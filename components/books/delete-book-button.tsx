    "use client";

    import { useState } from "react";
    import { useRouter } from "next/navigation";
    import { Trash2 } from "lucide-react";

    export function DeleteBookButton({ bookId }: { bookId: string }) {
    const router = useRouter();
    const [confirming, setConfirming] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        setLoading(true);

        const res = await fetch(`/api/books/${bookId}`, {
        method: "DELETE",
        });

        setLoading(false);

        if (res.ok) {
        router.push("/books");
        router.refresh();
        }
    }

    if (confirming) {
        return (
        <div className="flex items-center gap-2 text-sm">
            <span className="text-text-secondary">Delete this book?</span>
            <button
            onClick={handleDelete}
            disabled={loading}
            className="font-medium text-coral hover:underline disabled:opacity-50"
            >
            {loading ? "Deleting..." : "Confirm"}
            </button>
            <button
            onClick={() => setConfirming(false)}
            className="text-text-secondary hover:underline"
            >
            Cancel
            </button>
        </div>
        );
    }

    return (
        <button
        onClick={() => setConfirming(true)}
        className="flex items-center gap-1.5 text-sm text-coral hover:underline"
        >
        <Trash2 className="h-3.5 w-3.5" />
        Delete book
        </button>
    );
}