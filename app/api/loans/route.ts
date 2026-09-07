    import { NextResponse } from "next/server";
    import { getServerSession } from "next-auth";
    import { authOptions } from "@/lib/auth";
    import { prisma } from "@/lib/prisma";

    export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
    }

    const { bookId, borrowerName, dueDate } = await request.json();

    if (!bookId || !borrowerName || !dueDate) {
        return NextResponse.json(
        { message: "Book, borrower name, and due date are required." },
        { status: 400 }
        );
    }

    // Confirm this book belongs to the logged-in user, and isn't already lent out
    const book = await prisma.book.findUnique({
        where: { id: bookId },
        include: { loans: { where: { returnedAt: null } } },
    });

    if (!book || book.ownerId !== session.user.id) {
        return NextResponse.json({ message: "Book not found." }, { status: 404 });
    }

    if (book.loans.length >= book.copiesAvailable) {
        return NextResponse.json(
        { message: "No copies available to lend." },
        { status: 409 }
        );
    }

    const loan = await prisma.loan.create({
        data: {
        bookId,
        borrowerName,
        dateLent: new Date(),
        dueDate: new Date(dueDate),
        },
    });

    return NextResponse.json(loan, { status: 201 });
}