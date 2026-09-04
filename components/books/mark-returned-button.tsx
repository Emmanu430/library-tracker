    "use client";

    import { useState } from "react";
    import { useRouter } from "next/navigation";

    export function MarkReturnedButton({ loanId }: { loanId: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleClick() {
        setLoading(true);

        await fetch(`/api/loans/${loanId}`, {
        method: "PATCH",
        });

        setLoading(false);
        router.refresh();
    }

    return (
        <button
        onClick={handleClick}
        disabled={loading}
        className="text-sm font-medium text-teal hover:underline disabled:opacity-50"
        >
        {loading ? "Marking..." : "Mark as returned"}
        </button>
    );
}