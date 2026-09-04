    "use client";

    import { useState, useMemo } from "react";
    import Link from "next/link";
    import { Search, ChevronDown, BookOpen } from "lucide-react";

    type Loan = {
    id: string;
    dueDate: Date;
    returnedAt: Date | null;
    };

    type Book = {
    id: string;
    title: string;
    author: string;
    genre: string | null;
    coverUrl: string | null;
    loans: Loan[];
    };

    function getStatus(book: Book): "available" | "lent" | "overdue" {
    const activeLoan = book.loans[0];
    if (!activeLoan) return "available";
    if (new Date(activeLoan.dueDate) < new Date()) return "overdue";
    return "lent";
    }

    const statusStyles = {
    available: "bg-teal/10 text-teal",
    lent: "bg-amber/10 text-amber",
    overdue: "bg-coral/10 text-coral",
    };

    const placeholderColors = ["#3D7A6E", "#C88A2C", "#8B5A2B", "#1C2333", "#D85A30"];

    export function BookGrid({ books }: { books: Book[] }) {
    const [search, setSearch] = useState("");
    const [genreFilter, setGenreFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const genres = useMemo(
        () => Array.from(new Set(books.map((b) => b.genre).filter(Boolean))),
        [books]
    );

    const filtered = books.filter((book) => {
        const status = getStatus(book);
        const matchesSearch =
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase());
        const matchesGenre = !genreFilter || book.genre === genreFilter;
        const matchesStatus = !statusFilter || status === statusFilter;
        return matchesSearch && matchesGenre && matchesStatus;
    });

    return (
        <div>
        {/* Filter bar */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-placeholder" />
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title or author..."
                className="w-full rounded-md border border-border-warm bg-white py-2.5 pl-10 pr-3 text-sm text-ink placeholder:text-placeholder focus:border-teal focus:ring-2 focus:ring-teal/40 focus:outline-none"
            />
            </div>

            <div className="relative">
            <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="appearance-none rounded-md border border-border-warm bg-white py-2.5 pl-3 pr-9 text-sm text-ink focus:border-teal focus:ring-2 focus:ring-teal/40 focus:outline-none"
            >
                <option value="">All genres</option>
                {genres.map((genre) => (
                <option key={genre} value={genre!}>
                    {genre}
                </option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-placeholder" />
            </div>

            <div className="relative">
            <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none rounded-md border border-border-warm bg-white py-2.5 pl-3 pr-9 text-sm text-ink focus:border-teal focus:ring-2 focus:ring-teal/40 focus:outline-none"
            >
                <option value="">All statuses</option>
                <option value="available">Available</option>
                <option value="lent">Lent</option>
                <option value="overdue">Overdue</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-placeholder" />
            </div>
        </div>

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-border-warm bg-white py-16 text-center">
                    <BookOpen className="h-8 w-8 text-placeholder" />
                    {books.length === 0 ? (
                    <>
                        <p className="text-sm text-text-secondary">
                        Your library is empty. Add your first book to get started.
                        </p>
                        <Link href="/books/new" className="text-sm text-teal hover:underline">
                        Add your first book
                        </Link>
                    </>
                    ) : (
                    <>
                        <p className="text-sm text-text-secondary">No books match your filters.</p>
                        <button
                        onClick={() => {
                            setSearch("");
                            setGenreFilter("");
                            setStatusFilter("");
                        }}
                        className="text-sm text-teal hover:underline"
                        >
                        Clear filters
                        </button>
                    </>
                    )}
                </div>
                ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((book, i) => {
                const status = getStatus(book);
                const color = placeholderColors[i % placeholderColors.length];

                return (
                <Link
                    key={book.id}
                    href={`/books/${book.id}`}
                    className="group overflow-hidden rounded-xl border border-border-warm bg-white hover:border-teal hover:shadow-sm"
                >
                    <div
                        className="flex h-36 items-center justify-center overflow-hidden"
                        style={book.coverUrl ? undefined : { backgroundColor: color }}
                        >
                        {book.coverUrl ? (
                            <img
                            src={book.coverUrl}
                            alt={book.title}
                            className="h-full w-full object-cover"
                            />
                        ) : (
                            <BookOpen className="h-8 w-8 text-white/70" />
                        )}
                    </div>
                    <div className="p-4">
                    <span
                        className={`mb-2 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                    <p className="text-sm font-medium text-ink group-hover:text-teal">
                        {book.title}
                    </p>
                    <p className="mt-0.5 text-xs text-text-secondary">{book.author}</p>
                    {book.genre && (
                        <p className="mt-1 text-xs text-placeholder">{book.genre}</p>
                    )}
                    </div>
                </Link>
                );
            })}
            </div>
        )}
        </div>
    );
}