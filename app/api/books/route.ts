    import { NextResponse } from "next/server";
    import { getServerSession } from "next-auth";
    import { authOptions } from "@/lib/auth";
    import { prisma } from "@/lib/prisma";

    export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
    }

    const { title, author, genre, isbn, coverUrl, copiesAvailable, format } =
        await request.json();

    if (!title || !author) {
        return NextResponse.json(
        { message: "Title and author are required." },
        { status: 400 }
        );
    }

    const book = await prisma.book.create({
        data: {
        title,
        author,
        genre: genre || null,
        isbn: isbn || null,
        coverUrl: coverUrl || null,
        copiesAvailable: copiesAvailable ?? 1,
        format: format ?? "PHYSICAL",
        ownerId: session.user.id,
        },
    });

    return NextResponse.json(book, { status: 201 });
}