    import { NextResponse } from "next/server";
    import { getServerSession } from "next-auth";
    import { authOptions } from "@/lib/auth";
    import { prisma } from "@/lib/prisma";

    export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
    }

    const { bookId } = await request.json();

    const book = await prisma.book.findUnique({
        where: { id: bookId },
        include: {
        loans: { where: { returnedAt: null } },
        reservations: true,
        },
    });

    if (!book) {
        return NextResponse.json({ message: "Book not found." }, { status: 404 });
    }

    const copiesFree = book.copiesAvailable - book.loans.length;

    if (copiesFree > 0) {
        return NextResponse.json(
        { message: "This book has copies available — no need to reserve." },
        { status: 409 }
        );
    }

    const alreadyReserved = book.reservations.some(
        (r) => r.userId === session.user.id
    );

    if (alreadyReserved) {
        return NextResponse.json(
        { message: "You're already on the waitlist for this book." },
        { status: 409 }
        );
    }

    const reservation = await prisma.reservation.create({
        data: { bookId, userId: session.user.id },
    });

    return NextResponse.json(reservation, { status: 201 });
}