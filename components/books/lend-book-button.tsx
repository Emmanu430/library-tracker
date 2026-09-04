    "use client";

    import { useState } from "react";
    import { LendBookModal } from "@/components/books/lend-book-modal";

    export function LendBookButton({ bookId }: { bookId: string }) {
    const [open, setOpen] = useState(false);

    return (
        <>
        <button
            onClick={() => setOpen(true)}
            className="rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-parchment hover:bg-ink-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
        >
            Lend this book
        </button>

        {open && <LendBookModal bookId={bookId} onClose={() => setOpen(false)} />}
        </>
    );
}