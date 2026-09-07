    "use client";

    import { useState } from "react";
    import { useRouter } from "next/navigation";
    import { X } from "lucide-react";

    export function DismissNoticeButton({ reservationId }: { reservationId: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleClick() {
        setLoading(true);
        await fetch(`/api/reservations/${reservationId}`, { method: "DELETE" });
        setLoading(false);
        router.refresh();
    }

    return (
        <button
        onClick={handleClick}
        disabled={loading}
        aria-label="Dismiss notice"
        className="text-teal hover:text-ink disabled:opacity-50"
        >
        <X className="h-4 w-4" />
        </button>
    );
    }