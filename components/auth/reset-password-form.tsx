    "use client";

    import { useState } from "react";
    import { useRouter, useSearchParams } from "next/navigation";
    import { Lock } from "lucide-react";

    export function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
        }

        setLoading(true);

        const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
        setError(data.message);
        return;
        }

        router.push("/login");
    }

    if (!token) {
        return (
        <p className="text-sm text-coral">
            This link is invalid. Please request a new password reset.
        </p>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="password" className="mb-1.5 block text-sm text-text-label">
            New password
            </label>
            <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-placeholder" />
            <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-md border border-border-warm bg-white py-2.5 pl-10 pr-3 text-sm text-ink focus:border-teal focus:ring-2 focus:ring-teal/40 focus:outline-none"
            />
            </div>
        </div>

        <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-sm text-text-label">
            Confirm new password
            </label>
            <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-placeholder" />
            <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-md border border-border-warm bg-white py-2.5 pl-10 pr-3 text-sm text-ink focus:border-teal focus:ring-2 focus:ring-teal/40 focus:outline-none"
            />
            </div>
        </div>

        {error && <p className="text-xs text-coral">{error}</p>}

        <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-ink py-2.5 text-sm font-medium text-parchment hover:bg-ink-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
            {loading ? "Updating..." : "Update password"}
        </button>
        </form>
    );
}