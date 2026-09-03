    import { getServerSession } from "next-auth";
    import { redirect } from "next/navigation";
    import Link from "next/link";
    import { authOptions } from "@/lib/auth";
    import { prisma } from "@/lib/prisma";
    import { Plus, BookOpen } from "lucide-react";
    import { BookGrid } from "@/components/books/book-grid";

    export default async function BooksPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login");
    }

    const books = await prisma.book.findMany({
        where: { ownerId: session.user.id },
        include: {
        loans: {
            where: { returnedAt: null },
        },
        },
        orderBy: { title: "asc" },
    });

    const initials = session.user.name
        ? session.user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "?";

    return (
        <div className="min-h-screen w-full bg-parchment">
        {/* Top bar */}
        <div className="border-b border-border-warm">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-10">
            <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-teal" />
                <span className="font-serif text-xl text-ink">Athenaeum</span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-medium text-parchment">
                {initials}
            </div>
            </div>
        </div>

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

            <BookGrid books={books} />
        </div>
        </div>
    );
}