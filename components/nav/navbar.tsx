    "use client";

    import Link from "next/link";
    import { usePathname } from "next/navigation";
    import { signOut } from "next-auth/react";
    import { BookOpen, LogOut } from "lucide-react";

    const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/books", label: "Books" },
    // { href: "/loans", label: "Loans" }, // add later
    ];

    export function Navbar({ userName }: { userName: string }) {
    const pathname = usePathname();

    return (
        <div className="border-b border-border-warm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-10">
            <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-teal" />
                <span className="font-serif text-xl text-ink">Athenaeum</span>
            </div>

            <nav className="flex items-center gap-6">
                {links.map((link) => {
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

            <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary">{userName}</span>
            <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-ink"
            >
                <LogOut className="h-3.5 w-3.5" />
                Logout
            </button>
            </div>
        </div>
        </div>
    );
}