    import { getServerSession } from "next-auth";
    import { redirect, notFound } from "next/navigation";
    import Link from "next/link";
    import { authOptions } from "@/lib/auth";
    import { prisma } from "@/lib/prisma";
    import { calculateFine } from "@/lib/fines";
    import { ArrowLeft, BookOpen, User, Pencil } from "lucide-react";
    import { LendBookButton } from "@/components/books/lend-book-button";
    import { MarkReturnedButton } from "@/components/books/mark-returned-button";
    import { DeleteBookButton } from "@/components/books/delete-book-button";
    import { JoinWaitlistButton } from "@/components/books/join-waitlist-button";

    export default async function BookDetailPage({
    params,
    }: {
    params: Promise<{ id: string }>;
    }) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login");
    }

    const { id } = await params;

    const book = await prisma.book.findUnique({
        where: { id },
        include: {
        loans: {
            orderBy: { dateLent: "desc" },
        },
        },
    });

    if (!book) {
        notFound();
    }

    const isOwner = book.ownerId === session.user.id;

    const now = new Date();
    const activeLoans = book.loans.filter((loan) => !loan.returnedAt);
    const copiesLentOut = activeLoans.length;
    const copiesFree = book.copiesAvailable - copiesLentOut;
    const hasOverdue = activeLoans.some((loan) => loan.dueDate < now);

    const status = copiesFree > 0 ? "available" : hasOverdue ? "overdue" : "lent";

    const statusStyles = {
        available: "bg-teal/10 text-teal",
        lent: "bg-amber/10 text-amber",
        overdue: "bg-coral/10 text-coral",
    };

    return (
        <div className="min-h-screen w-full bg-parchment px-6 py-10">
        <div className="mx-auto max-w-4xl">
            <Link
            href="/books"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-ink"
            >
            <ArrowLeft className="h-4 w-4" />
            Back to books
            </Link>

            {/* Header: cover | info */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-[220px_1fr]">
            <div className="flex aspect-2/3 items-center justify-center overflow-hidden rounded-xl bg-ink">
                {book.coverUrl ? (
                <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="h-full w-full object-cover"
                />
                ) : (
                <BookOpen className="h-10 w-10 text-parchment/50" />
                )}
            </div>

            <div className="flex flex-col">
                <div className="mb-3 flex items-center justify-between">
                <span
                    className={`inline-block w-fit rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
                >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
                {isOwner && (
                    <div className="flex items-center gap-4">
                    <Link
                        href={`/books/${book.id}/edit`}
                        className="flex items-center gap-1.5 text-sm text-teal hover:underline"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit book
                    </Link>
                    <DeleteBookButton bookId={book.id} />
                    </div>
                )}
                </div>

                <h1 className="text-3xl font-medium text-ink">{book.title}</h1>
                <p className="mt-1 text-base text-text-secondary">{book.author}</p>

                <div className="mt-4 space-y-1 text-sm">
                {book.genre && (
                    <p>
                    <span className="text-text-label">Genre: </span>
                    <span className="text-ink">{book.genre}</span>
                    </p>
                )}
                {book.isbn && (
                    <p>
                    <span className="text-text-label">ISBN: </span>
                    <span className="text-ink">{book.isbn}</span>
                    </p>
                )}
                <p>
                    <span className="text-text-label">Format: </span>
                    <span className="text-ink">
                    {book.format === "PHYSICAL" ? "Physical" : "Digital"}
                    </span>
                </p>
                </div>

                <div className="mt-auto pt-6">
                <p className="mb-3 text-sm text-text-secondary">
                    {copiesFree} of {book.copiesAvailable}{" "}
                    {book.copiesAvailable === 1 ? "copy" : "copies"} available
                </p>
                {copiesFree > 0
                    ? isOwner && <LendBookButton bookId={book.id} />
                    : !isOwner && <JoinWaitlistButton bookId={book.id} />}
                </div>
            </div>
            </div>

            {/* Loan history */}
            <div className="mt-10 overflow-hidden rounded-xl border border-border-warm bg-white">
            <div className="border-b border-border-warm px-5 py-4">
                <h2 className="text-base font-medium text-ink">Loan history</h2>
            </div>

            {book.loans.length === 0 ? (
                <div className="px-5 py-12 text-center text-sm text-text-secondary">
                This book hasn't been lent out yet.
                </div>
            ) : (
                book.loans.map((loan, i) => {
                const isActive = !loan.returnedAt;
                const isOverdue = isActive && loan.dueDate < now;

                return (
                    <div
                    key={loan.id}
                    className={`flex items-center justify-between px-5 py-4 ${
                        i !== book.loans.length - 1 ? "border-b border-[#EFE9DA]" : ""
                    }`}
                    >
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/5">
                        <User className="h-4 w-4 text-ink" />
                        </div>
                        <div>
                        <p className="text-sm font-medium text-ink">
                            {loan.borrowerName}
                        </p>
                        <p className="text-xs text-text-secondary">
                            {loan.dateLent.toLocaleDateString()} –{" "}
                            {loan.returnedAt
                            ? loan.returnedAt.toLocaleDateString()
                            : loan.dueDate.toLocaleDateString() + " (due)"}
                        </p>
                        {isOverdue && (
                            <p className="mt-0.5 text-xs text-coral">
                            Fine so far: ${calculateFine(loan.dueDate, null).toFixed(2)}
                            </p>
                        )}
                        {!isActive && loan.fineAmount > 0 && (
                            <p className="mt-0.5 text-xs text-coral">
                            Fine: ${loan.fineAmount.toFixed(2)}
                            </p>
                        )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isOverdue && (
                        <span className="rounded-full bg-coral/10 px-2.5 py-1 text-xs font-medium text-coral">
                            Overdue
                        </span>
                        )}
                        {isActive && isOwner && <MarkReturnedButton loanId={loan.id} />}
                        <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            isActive ? "bg-amber/10 text-amber" : "bg-teal/10 text-teal"
                        }`}
                        >
                        {isActive ? "Active" : "Returned"}
                        </span>
                    </div>
                    </div>
                );
                })
            )}
            </div>
        </div>
        </div>
    );
}