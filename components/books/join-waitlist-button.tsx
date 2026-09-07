    "use client";

    import { useState } from "react";
    import { useRouter } from "next/navigation";

    export function JoinWaitlistButton({ bookId }: { bookId: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleClick() {
        setLoading(true);
        setMessage("");

        const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
        setMessage(data.message);
        return;
        }

        router.refresh();
    }

    return (
        <div>
        <button
            onClick={handleClick}
            disabled={loading}
            className="rounded-md border border-border-warm px-4 py-2.5 text-sm font-medium text-ink hover:border-teal disabled:cursor-not-allowed disabled:opacity-50"
        >
            {loading ? "Joining..." : "Join waitlist"}
        </button>
        {message && <p className="mt-1.5 text-xs text-coral">{message}</p>}
        </div>
    );
}