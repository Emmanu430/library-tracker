    "use client";

    import { useState } from "react";
    import { useRouter } from "next/navigation";
    import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

    export function SignupForm() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

        const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        });

        setLoading(false);

        if (!res.ok) {
        const data = await res.json();
        setError(data.message ?? "Something went wrong.");
        return;
        }

        router.push("/login");
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="name" className="mb-1.5 block text-sm text-text-label">
            Name
            </label>
            <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-placeholder" />
            <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-md border border-border-warm bg-white py-2.5 pl-10 pr-3 text-sm text-ink placeholder:text-placeholder focus:border-teal focus:ring-2 focus:ring-teal/40 focus:outline-none"
                placeholder="Jane Doe"
            />
            </div>
        </div>

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

        <div>
            <label htmlFor="password" className="mb-1.5 block text-sm text-text-label">
            Password
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
                className="w-full rounded-md border border-border-warm bg-white py-2.5 pl-10 pr-10 text-sm text-ink placeholder:text-placeholder focus:border-teal focus:ring-2 focus:ring-teal/40 focus:outline-none"
                placeholder="At least 8 characters"
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
            Confirm password
            </label>
            <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-placeholder" />
            <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                aria-describedby={error ? "confirm-password-error" : undefined}
                className={`w-full rounded-md border bg-white py-2.5 pl-10 pr-10 text-sm text-ink placeholder:text-placeholder focus:ring-2 focus:outline-none ${
                error
                    ? "border-coral focus:border-coral focus:ring-coral/40"
                    : "border-border-warm focus:border-teal focus:ring-teal/40"
                }`}
                placeholder="Re-enter your password"
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
            {error && (
            <p id="confirm-password-error" role="alert" aria-live="polite" className="mt-1.5 text-xs text-coral">
                {error}
            </p>
            )}
        </div>

        <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-ink py-2.5 text-sm font-medium text-parchment hover:bg-ink-hover focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
            {loading ? "Creating account..." : "Create account"}
        </button>

        <div className="mt-6 text-center text-xs text-text-secondary">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-amber hover:underline">
            Sign in
            </a>
        </div>
        </form>
    );
}