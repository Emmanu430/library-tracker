    import { NextResponse } from "next/server";
    import { getServerSession } from "next-auth";
    import { authOptions } from "@/lib/auth";
    import { prisma } from "@/lib/prisma";

    export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
    ) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
    }

    const { id } = await params;

    const loan = await prisma.loan.findUnique({
        where: { id },
        include: { book: true },
    });

    if (!loan || loan.book.ownerId !== session.user.id) {
        return NextResponse.json({ message: "Loan not found." }, { status: 404 });
    }

    const updated = await prisma.loan.update({
        where: { id },
        data: { returnedAt: new Date() },
    });

    return NextResponse.json(updated, { status: 200 });
}