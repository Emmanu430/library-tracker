    "use client";

    import Link from "next/link";
    import { useRouter } from "next/navigation";
    import { BookOpen } from "lucide-react";

    export default function NotFound() {
    const router = useRouter();

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-parchment px-6 text-center">
        <BookOpen className="mb-6 h-10 w-10 text-teal" />
        <h1 className="mb-2 font-serif text-3xl text-ink">Page not found</h1>
        <p className="mb-8 max-w-sm text-sm text-text-secondary">
            This page doesn't exist yet, or the shelf's been moved.
        </p>
        <div className="flex gap-4">
            <button
            onClick={() => router.back()}
            className="rounded-md border border-border-warm px-4 py-2.5 text-sm font-medium text-ink hover:border-ink"
            >
            Go back
            </button>
            <Link
            href="/"
            className="rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-parchment hover:bg-ink-hover"
            >
            Go home
            </Link>
        </div>
        </div>
    );
}