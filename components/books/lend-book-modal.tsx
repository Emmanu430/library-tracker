    "use client";

    import { useState } from "react";
    import { useRouter } from "next/navigation";
    import { X } from "lucide-react";

    export function LendBookModal({
    bookId,
    onClose,
    }: {
    bookId: string;
    onClose: () => void;
    }) {
    const router = useRouter();
    const [borrowerName, setBorrowerName] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await fetch("/api/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, borrowerName, dueDate }),
        });

        setLoading(false);

        if (!res.ok) {
        const data = await res.json();
        setError(data.message ?? "Something went wrong.");
        return;
        }

        onClose();
        router.refresh();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-6">
        <div className="w-full max-w-sm rounded-xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-medium text-ink">Lend this book</h2>
            <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="text-placeholder hover:text-ink"
            >
                <X className="h-4 w-4" />
            </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label
                htmlFor="borrowerName"
                className="mb-1.5 block text-sm text-text-label"
                >
                Borrower name
                </label>
                <input
                id="borrowerName"
                type="text"
                value={borrowerName}
                onChange={(e) => setBorrowerName(e.target.value)}
                required
                className="w-full rounded-md border border-border-warm bg-white px-3 py-2.5 text-sm text-ink focus:border-teal focus:ring-2 focus:ring-teal/40 focus:outline-none"
                />
            </div>

            <div>
                <label htmlFor="dueDate" className="mb-1.5 block text-sm text-text-label">
                Due date
                </label>
                <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="w-full rounded-md border border-border-warm bg-white px-3 py-2.5 text-sm text-ink focus:border-teal focus:ring-2 focus:ring-teal/40 focus:outline-none"
                />
            </div>

            {error && <p className="text-xs text-coral">{error}</p>}

            <div className="flex gap-3 pt-2">
                <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-parchment hover:bg-ink-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                {loading ? "Saving..." : "Confirm loan"}
                </button>
                <button
                type="button"
                onClick={onClose}
                className="rounded-md px-4 py-2.5 text-sm font-medium text-ink hover:bg-[#F6F1E7]"
                >
                Cancel
                </button>
            </div>
            </form>
        </div>
        </div>
    );
}