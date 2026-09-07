    import { getServerSession } from "next-auth";
    import { redirect } from "next/navigation";
    import { authOptions } from "@/lib/auth";
    import { prisma } from "@/lib/prisma";

    export default async function AllLoansAdminPage() {
    const session = await getServerSession(authOptions);

    if (session?.user.role !== "LIBRARIAN" && session?.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const loans = await prisma.loan.findMany({
        include: { book: { include: { owner: true } } },
        orderBy: { dateLent: "desc" },
    });

    return (
        <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
        <h1 className="mb-8 text-2xl font-medium text-ink">All Loans (Staff)</h1>
        <div className="overflow-hidden rounded-xl border border-border-warm bg-white">
            {loans.map((loan, i) => (
            <div
                key={loan.id}
                className={`flex items-center justify-between px-5 py-4 ${
                i !== loans.length - 1 ? "border-b border-[#EFE9DA]" : ""
                }`}
            >
                <div>
                <p className="text-sm font-medium text-ink">{loan.book.title}</p>
                <p className="mt-0.5 text-xs text-text-secondary">
                    Owned by {loan.book.owner.name} · Lent to {loan.borrowerName}
                </p>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
}