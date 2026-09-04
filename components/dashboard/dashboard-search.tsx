    "use client";

    import { useState } from "react";
    import { useRouter } from "next/navigation";
    import { Search } from "lucide-react";

    export function DashboardSearch() {
    const router = useRouter();
    const [query, setQuery] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (query.trim()) {
        router.push(`/books?search=${encodeURIComponent(query)}`);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-placeholder" />
        <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your books..."
            className="w-full rounded-md border border-border-warm bg-white py-2.5 pl-10 pr-3 text-sm text-ink placeholder:text-placeholder focus:border-teal focus:ring-2 focus:ring-teal/40 focus:outline-none"
        />
        </form>
    );
}