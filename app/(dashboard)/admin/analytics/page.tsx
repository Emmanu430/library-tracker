    import { getServerSession } from "next-auth";
    import { redirect } from "next/navigation";
    import { authOptions } from "@/lib/auth";
    import { prisma } from "@/lib/prisma";
    import { BookOpen, TrendingUp, Users } from "lucide-react";
    import { BorrowedChart } from "@/components/admin/borrowed-chart";

    export default async function AnalyticsPage() {
    const session = await getServerSession(authOptions);

    if (session?.user.role !== "LIBRARIAN" && session?.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const loansThisMonth = await prisma.loan.count({
        where: { dateLent: { gte: startOfMonth } },
    });

    const allLoans = await prisma.loan.findMany({
        include: { book: true },
    });

    const borrowCounts = new Map<string, { title: string; count: number }>();
    for (const loan of allLoans) {
        const existing = borrowCounts.get(loan.bookId);
        if (existing) {
        existing.count += 1;
        } else {
        borrowCounts.set(loan.bookId, { title: loan.book.title, count: 1 });
        }
    }

    const mostBorrowed = Array.from(borrowCounts.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    const activePatronIds = new Set(
        allLoans
        .filter((loan) => !loan.returnedAt)
        .map((loan) => loan.borrowerName)
    );

    return (
        <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
        <h1 className="mb-8 text-2xl font-medium text-ink">Analytics</h1>

        {/* Stat cards */}
        <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="rounded-xl border border-border-warm bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-text-secondary">Loans this month</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal/10">
                <TrendingUp className="h-4 w-4 text-teal" />
                </div>
            </div>
            <p className="text-3xl font-medium text-ink">{loansThisMonth}</p>
            </div>

            <div className="rounded-xl border border-border-warm bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-text-secondary">Active patrons</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber/10">
                <Users className="h-4 w-4 text-amber" />
                </div>
            </div>
            <p className="text-3xl font-medium text-ink">{activePatronIds.size}</p>
            </div>

            <div className="rounded-xl border border-border-warm bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-text-secondary">Total loans (all time)</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/5">
                <BookOpen className="h-4 w-4 text-ink" />
                </div>
            </div>
            <p className="text-3xl font-medium text-ink">{allLoans.length}</p>
            </div>
        </div>

        {mostBorrowed.length === 0 ? (
            <div className="rounded-xl border border-border-warm bg-white px-5 py-12 text-center text-sm text-text-secondary">
                No loans recorded yet.
            </div>
            ) : (
            <BorrowedChart data={mostBorrowed} />
            )}

        </div>
    );
}