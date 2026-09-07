    import { NextResponse } from "next/server";
    import { getServerSession } from "next-auth";
    import { authOptions } from "@/lib/auth";
    import { prisma } from "@/lib/prisma";

    export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
    ) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
    }

    const { id } = await params;

    const reservation = await prisma.reservation.findUnique({
        where: { id },
        include: {
        book: {
            include: { loans: { where: { returnedAt: null } } },
        },
        user: true,
        },
    });

    if (!reservation) {
        return NextResponse.json({ message: "Reservation not found." }, { status: 404 });
    }

    const isOwner = reservation.book.ownerId === session.user.id;
    const isWaitlistedUser = reservation.userId === session.user.id;

    if (!isOwner && !isWaitlistedUser) {
        return NextResponse.json({ message: "Not authorized." }, { status: 403 });
    }

    if (isOwner) {
        const copiesFree =
        reservation.book.copiesAvailable - reservation.book.loans.length;

        if (copiesFree <= 0) {
        return NextResponse.json(
            { message: "No copies are free yet — a copy must be returned first." },
            { status: 409 }
        );
        }

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);

        await prisma.loan.create({
        data: {
            bookId: reservation.bookId,
            borrowerName: reservation.user.name,
            dueDate,
        },
        });
    }

    await prisma.reservation.delete({ where: { id } });

    return NextResponse.json({ message: "Reservation resolved." }, { status: 200 });
}