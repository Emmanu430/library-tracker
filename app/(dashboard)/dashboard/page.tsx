    import { getServerSession } from "next-auth";
    import { redirect } from "next/navigation";
    import { authOptions } from "@/lib/auth";
    import { prisma } from "@/lib/prisma";
    import Link from "next/link";
    import { DashboardSearch } from "@/components/dashboard/dashboard-search";
    import { BookOpen, Plus, Clock, AlertCircle } from "lucide-react";

    export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login");
    }

    const userId = session.user.id;
    const now = new Date();

    const totalBooks = await prisma.book.count({
        where: { ownerId: userId },
    });

    const activeLoans = await prisma.loan.count({
        where: {
        returnedAt: null,
        book: { ownerId: userId },
        },
    });

    const overdueLoans = await prisma.loan.count({
        where: {
        returnedAt: null,
        dueDate: { lt: now },
        book: { ownerId: userId },
        },
    });

    const recentLoans = await prisma.loan.findMany({
        where: { book: { ownerId: userId } },
        orderBy: { dateLent: "desc" },
        take: 5,
        include: { book: true },
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
        {/* Main content */}
        <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
            {/* Page header */}
            <div className="mb-8 flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-medium text-ink">Dashboard</h1>
                <p className="text-sm text-text-secondary">
                Welcome back, {session.user.name}.
                </p>
            </div>
            <Link
                href="/books/new"
                className="flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-parchment hover:bg-ink-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2">
                <Plus className="h-4 w-4" />
                Add book
            </Link>
            </div>

            {/* Stat cards */}
            <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="rounded-xl border border-border-warm bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-text-secondary">Total books</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/5">
                    <BookOpen className="h-4 w-4 text-ink" />
                </div>
                </div>
                <p className="text-3xl font-medium text-ink">{totalBooks}</p>
            </div>

            <div className="rounded-xl border border-border-warm bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-text-secondary">Active loans</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber/10">
                    <Clock className="h-4 w-4 text-amber" />
                </div>
                </div>
                <p className="text-3xl font-medium text-ink">{activeLoans}</p>
            </div>

            <div className="rounded-xl border border-border-warm bg-white p-5">
                <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-text-secondary">Overdue</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-coral/10">
                    <AlertCircle className="h-4 w-4 text-coral" />
                </div>
                </div>
                <p className="text-3xl font-medium text-coral">{overdueLoans}</p>
            </div>
            </div>

            {/* Search bar */}
            <DashboardSearch />

            {/* Recent loans */}
            <div className="overflow-hidden rounded-xl border border-border-warm bg-white">
            <div className="flex items-center justify-between border-b border-border-warm px-5 py-4">
                <h2 className="text-base font-medium text-ink">Recent loans</h2>
                <a href="/loans" className="text-sm text-teal hover:underline">
                View all
                </a>
            </div>

            {recentLoans.length === 0 ? (
                <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
                <BookOpen className="h-8 w-8 text-placeholder" />
                <p className="text-sm text-text-secondary">
                    No loans yet. Lend out a book to see it here.
                </p>
                </div>
            ) : (
                recentLoans.map((loan, i) => {
                const isOverdue = !loan.returnedAt && loan.dueDate < now;
                const isLent = !loan.returnedAt && loan.dueDate >= now;

                return (
                    <div
                    key={loan.id}
                    className={`flex items-center justify-between px-5 py-4 ${
                        i !== recentLoans.length - 1 ? "border-b border-[#EFE9DA]" : ""
                    }`}
                    >
                    <div>
                        <p className="text-sm font-medium text-ink">{loan.book.title}</p>
                        <p className="mt-0.5 text-xs text-text-secondary">
                        Lent to {loan.borrowerName} · Due{" "}
                        {loan.dueDate.toLocaleDateString()}
                        </p>
                    </div>
                    {isOverdue && (
                        <span className="rounded-full bg-coral/10 px-2.5 py-1 text-xs font-medium text-coral">
                        Overdue
                        </span>
                    )}
                    {isLent && (
                        <span className="rounded-full bg-amber/10 px-2.5 py-1 text-xs font-medium text-amber">
                        Lent
                        </span>
                    )}
                    </div>
                );
                })
            )}
            </div>
        </div>
        </div>
    );
}