    "use client";

    import { useState, useMemo } from "react";
    import Link from "next/link";
    import { BookOpen } from "lucide-react";

    type Loan = {
    id: string;
    borrowerName: string;
    dateLent: Date;
    dueDate: Date;
    returnedAt: Date | null;
    book: {
        id: string;
        title: string;
    };
    };

    function getStatus(loan: Loan): "active" | "overdue" | "returned" {
    if (loan.returnedAt) return "returned";
    if (new Date(loan.dueDate) < new Date()) return "overdue";
    return "active";
    }

    const statusStyles = {
    active: "bg-amber/10 text-amber",
    overdue: "bg-coral/10 text-coral",
    returned: "bg-teal/10 text-teal",
    };

    const statusOrder = { overdue: 0, active: 1, returned: 2 };

    export function LoansList({ loans }: { loans: Loan[] }) {
    const [filter, setFilter] = useState<"all" | "active" | "overdue" | "returned">(
        "all"
    );

    const filtered = useMemo(() => {
        const withStatus = loans.map((loan) => ({ loan, status: getStatus(loan) }));
        const visible =
        filter === "all"
            ? withStatus
            : withStatus.filter((item) => item.status === filter);

        // Overdue first, then active, then returned
        return [...visible].sort(
        (a, b) => statusOrder[a.status] - statusOrder[b.status]
        );
    }, [loans, filter]);

    return (
        <div>
        {/* Filter tabs */}
        <div className="mb-6 flex items-center gap-2">
            {(["all", "active", "overdue", "returned"] as const).map((option) => (
            <button
                key={option}
                onClick={() => setFilter(option)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                filter === option
                    ? "bg-ink text-parchment"
                    : "text-text-secondary hover:bg-white"
                }`}
            >
                {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
            ))}
        </div>

        <div className="overflow-hidden rounded-xl border border-border-warm bg-white">
            {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-5 py-16 text-center">
                <BookOpen className="h-8 w-8 text-placeholder" />
                <p className="text-sm text-text-secondary">
                No {filter !== "all" ? filter : ""} loans to show.
                </p>
            </div>
            ) : (
            filtered.map(({ loan, status }, i) => (
                <Link
                key={loan.id}
                href={`/books/${loan.book.id}`}
                className={`flex items-center justify-between px-5 py-4 hover:bg-[#FBF8F1] ${
                    i !== filtered.length - 1 ? "border-b border-[#EFE9DA]" : ""
                }`}
                >
                <div>
                    <p className="text-sm font-medium text-ink">{loan.book.title}</p>
                    <p className="mt-0.5 text-xs text-text-secondary">
                    Lent to {loan.borrowerName} · {loan.dateLent.toLocaleDateString()}
                    {" – "}
                    {loan.returnedAt
                        ? loan.returnedAt.toLocaleDateString()
                        : `due ${loan.dueDate.toLocaleDateString()}`}
                    </p>
                </div>
                <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}
                >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
                </Link>
            ))
            )}
        </div>
        </div>
    );
}