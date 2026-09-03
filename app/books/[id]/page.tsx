    import { getServerSession } from "next-auth";
    import { redirect, notFound } from "next/navigation";
    import Link from "next/link";
    import { authOptions } from "@/lib/auth";
    import { prisma } from "@/lib/prisma";
    import { ArrowLeft, BookOpen, User } from "lucide-react";

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

    if (!book || book.ownerId !== session.user.id) {
        notFound();
    }

    const now = new Date();
    const activeLoan = book.loans.find((loan) => !loan.returnedAt);
    const status = !activeLoan
        ? "available"
        : activeLoan.dueDate < now
        ? "overdue"
        : "lent";

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
            <div className="flex aspect-[2/3] items-center justify-center rounded-xl bg-ink">
                <BookOpen className="h-10 w-10 text-parchment/50" />
            </div>

            <div className="flex flex-col">
                <span
                className={`mb-3 inline-block w-fit rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
                >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
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
                </div>

                <div className="mt-auto pt-6">
                {activeLoan ? (
                    <div className="rounded-md border border-amber/20 bg-amber/10 px-4 py-3 text-sm text-ink">
                    Currently lent to{" "}
                    <span className="font-medium">{activeLoan.borrowerName}</span>,
                    due{" "}
                    <span className="font-medium">
                        {activeLoan.dueDate.toLocaleDateString()}
                    </span>
                    </div>
                ) : (
                    <button className="rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-parchment hover:bg-ink-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2">
                    Lend this book
                    </button>
                )}
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
                        </div>
                    </div>
                    <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        isActive ? "bg-amber/10 text-amber" : "bg-teal/10 text-teal"
                        }`}
                    >
                        {isActive ? "Active" : "Returned"}
                    </span>
                    </div>
                );
                })
            )}
            </div>
        </div>
        </div>
    );
}