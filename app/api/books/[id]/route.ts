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

    const book = await prisma.book.findUnique({ where: { id } });

    if (!book || book.ownerId !== session.user.id) {
        return NextResponse.json({ message: "Book not found." }, { status: 404 });
    }

    const { title, author, genre, isbn, coverUrl } = await request.json();

    if (!title || !author) {
        return NextResponse.json(
        { message: "Title and author are required." },
        { status: 400 }
        );
    }

    const updated = await prisma.book.update({
        where: { id },
        data: {
        title,
        author,
        genre: genre || null,
        isbn: isbn || null,
        coverUrl: coverUrl || null,
        },
    });

    return NextResponse.json(updated, { status: 200 });
    }

    export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
    ) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
    }

    const { id } = await params;

    const book = await prisma.book.findUnique({ where: { id } });

    if (!book || book.ownerId !== session.user.id) {
        return NextResponse.json({ message: "Book not found." }, { status: 404 });
    }

    // Delete loan history first, since Prisma blocks deleting a book
    // that still has related loans (foreign key constraint).
    await prisma.loan.deleteMany({ where: { bookId: id } });
    await prisma.book.delete({ where: { id } });

    return NextResponse.json({ message: "Book deleted." }, { status: 200 });
}