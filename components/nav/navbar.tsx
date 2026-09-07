    "use client";

    import { useState } from "react";
    import Link from "next/link";
    import { usePathname } from "next/navigation";
    import { signOut } from "next-auth/react";
    import { BookOpen, LogOut, Menu, X } from "lucide-react";

    const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/books", label: "Books" },
    { href: "/loans", label: "Loans" },
    ];

    const staffLinks = [
    { href: "/admin/loans", label: "All Loans" },
    { href: "/admin/analytics", label: "Analytics" },
    ];

    export function Navbar({ userName, role }: { userName: string; role: string }) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isStaff = role === "LIBRARIAN" || role === "ADMIN";
    const visibleLinks = isStaff ? [...links, ...staffLinks] : links;

    return (
        <div className="border-b border-border-warm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-10">
            <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-teal" />
                <span className="font-serif text-xl text-ink">Athenaeum</span>
            </div>

            <nav className="hidden items-center gap-6 md:flex">
                {visibleLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                    <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm ${
                        isActive
                        ? "font-medium text-ink"
                        : "text-text-secondary hover:text-ink"
                    }`}
                    >
                    {link.label}
                    </Link>
                );
                })}
            </nav>
            </div>

            <div className="hidden items-center gap-4 md:flex">
            <span className="text-sm text-text-secondary">{userName}</span>
            <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-ink"
            >
                <LogOut className="h-3.5 w-3.5" />
                Logout
            </button>
            </div>

            <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="text-ink md:hidden"
            >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
        </div>

        {mobileMenuOpen && (
            <nav className="flex flex-col gap-1 border-t border-border-warm px-6 py-4 md:hidden">
            {visibleLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`rounded-md px-3 py-2.5 text-sm ${
                    isActive
                        ? "bg-ink/5 font-medium text-ink"
                        : "text-text-secondary hover:bg-[#FBF8F1]"
                    }`}
                >
                    {link.label}
                </Link>
                );
            })}

            <div className="mt-2 flex items-center justify-between border-t border-[#EFE9DA] px-3 pt-4">
                <span className="text-sm text-text-secondary">{userName}</span>
                <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-ink"
                >
                <LogOut className="h-3.5 w-3.5" />
                Logout
                </button>
            </div>
            </nav>
        )}
        </div>
    );
}