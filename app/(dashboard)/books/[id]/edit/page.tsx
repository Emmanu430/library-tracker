    import { getServerSession } from "next-auth";
    import { redirect, notFound } from "next/navigation";
    import { authOptions } from "@/lib/auth";
    import { prisma } from "@/lib/prisma";
    import { BookForm } from "@/components/books/book-form";

    export default async function EditBookPage({
    params,
    }: {
    params: Promise<{ id: string }>;
    }) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login");
    }

    const { id } = await params;

    const book = await prisma.book.findUnique({ where: { id } });

    if (!book || book.ownerId !== session.user.id) {
        notFound();
    }

    return (
        <div className="min-h-screen w-full bg-parchment px-6 py-10">
        <div className="mx-auto max-w-3xl">
            <h1 className="text-2xl font-medium text-ink">Edit book</h1>
            <p className="mb-8 text-sm text-text-secondary">
            Update the details for this book.
            </p>
            <BookForm
            bookId={book.id}
            initialData={{
                title: book.title,
                author: book.author,
                genre: book.genre,
                isbn: book.isbn,
                coverUrl: book.coverUrl,
            }}
            />
        </div>
        </div>
    );
}