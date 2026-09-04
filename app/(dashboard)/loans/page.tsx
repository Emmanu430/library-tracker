    import { getServerSession } from "next-auth";
    import { authOptions } from "@/lib/auth";
    import { prisma } from "@/lib/prisma";
    import { LoansList } from "@/components/loans/loans-list";

    export default async function LoansPage() {
    const session = await getServerSession(authOptions);

    const loans = await prisma.loan.findMany({
        where: { book: { ownerId: session!.user.id } },
        include: { book: true },
        orderBy: { dateLent: "desc" },
    });

    return (
        <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
        <div className="mb-8">
            <h1 className="text-2xl font-medium text-ink">Loans</h1>
            <p className="text-sm text-text-secondary">
            {loans.length} {loans.length === 1 ? "loan" : "loans"} across your library
            </p>
        </div>

        <LoansList loans={loans} />
        </div>
    );
}