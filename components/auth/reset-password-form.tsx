    "use client";

    import { useState } from "react";
    import { useRouter, useSearchParams } from "next/navigation";
    import { Lock, Eye, EyeOff } from "lucide-react";

    export function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-md border border-border-warm bg-white py-2.5 pl-10 pr-10 text-sm text-ink focus:border-teal focus:ring-2 focus:ring-teal/40 focus:outline-none"
            />
            <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-placeholder hover:text-text-secondary"
            >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
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
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-md border border-border-warm bg-white py-2.5 pl-10 pr-10 text-sm text-ink focus:border-teal focus:ring-2 focus:ring-teal/40 focus:outline-none"
            />
            <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-placeholder hover:text-text-secondary"
            >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
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