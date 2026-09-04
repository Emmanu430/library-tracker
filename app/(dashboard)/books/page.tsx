    import { getServerSession } from "next-auth";
    import { redirect } from "next/navigation";
    import Link from "next/link";
    import { authOptions } from "@/lib/auth";
    import { prisma } from "@/lib/prisma";
    import { Plus } from "lucide-react";
    import { BookGrid } from "@/components/books/book-grid";

    export default async function BooksPage({
    searchParams,
    }: {
    searchParams: Promise<{ search?: string }>;
    }) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login");
    }

    const { search } = await searchParams;

    const books = await prisma.book.findMany({
        where: { ownerId: session.user.id },
        include: {
        loans: {
            where: { returnedAt: null },
        },
        },
        orderBy: { title: "asc" },
    });

    return (
        <div className="min-h-screen w-full bg-parchment">
        <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
            <div className="mb-8 flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-medium text-ink">Books</h1>
                <p className="text-sm text-text-secondary">
                {books.length} {books.length === 1 ? "book" : "books"} in your library
                </p>
            </div>
            <Link
                href="/books/new"
                className="flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-parchment hover:bg-ink-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
            >
                <Plus className="h-4 w-4" />
                Add book
            </Link>
            </div>

            <BookGrid books={books} initialSearch={search ?? ""} />
        </div>
        </div>
    );
}