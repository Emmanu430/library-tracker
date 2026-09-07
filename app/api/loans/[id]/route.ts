    import { NextResponse } from "next/server";
    import { getServerSession } from "next-auth";
    import { authOptions } from "@/lib/auth";
    import { prisma } from "@/lib/prisma";
    import { calculateFine } from "@/lib/fines";

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

    const returnedAt = new Date();
    const fineAmount = calculateFine(loan.dueDate, returnedAt);

    const updated = await prisma.loan.update({
        where: { id },
        data: { returnedAt, fineAmount },
    });

    // After updating the loan as returned...
const nextInLine = await prisma.reservation.findFirst({
  where: { bookId: loan.bookId, notified: false },
  orderBy: { requestedAt: "asc" },
});

if (nextInLine) {
  await prisma.reservation.update({
    where: { id: nextInLine.id },
    data: { notified: true },
  });
}


    return NextResponse.json(updated, { status: 200 });
}