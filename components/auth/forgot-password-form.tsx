    "use client";

    import { useState } from "react";
    import { Mail } from "lucide-react";

    export function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        });

        setLoading(false);
        setSubmitted(true);
    }

    if (submitted) {
        return (
        <p className="text-sm text-text-secondary">
            If that email exists in our system, a reset link has been sent.
            Check your inbox.
        </p>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="email" className="mb-1.5 block text-sm text-text-label">
            Email
            </label>
            <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-placeholder" />
            <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-border-warm bg-white py-2.5 pl-10 pr-3 text-sm text-ink placeholder:text-placeholder focus:border-teal focus:ring-2 focus:ring-teal/40 focus:outline-none"
                placeholder="you@example.com"
            />
            </div>
        </div>

        <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-ink py-2.5 text-sm font-medium text-parchment hover:bg-ink-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
            {loading ? "Sending..." : "Send reset link"}
        </button>
        </form>
    );
}