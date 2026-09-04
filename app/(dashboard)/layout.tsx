    import { getServerSession } from "next-auth";
    import { redirect } from "next/navigation";
    import { authOptions } from "@/lib/auth";
    import { Navbar } from "@/components/nav/navbar";

    export default async function DashboardLayout({
    children,
    }: {
    children: React.ReactNode;
    }) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen w-full bg-parchment">
        <Navbar userName={session.user.name ?? ""} />
        {children}
        </div>
    );
}