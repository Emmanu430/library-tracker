    "use client";

    import { useState } from "react";
    import { signIn } from "next-auth/react";
    import { useRouter } from "next/navigation";
    import { Mail, Lock,  Eye, EyeOff } from "lucide-react";

    export function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        });

        setLoading(false);

        if (result?.error) {
        setError("Invalid email or password.");
        return;
        }

        router.push("/dashboard");
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
                aria-describedby={error ? "login-error" : undefined}
                className="w-full rounded-md border border-border-warm bg-white py-2.5 pl-10 pr-3 text-sm text-ink placeholder:text-placeholder focus:border-teal focus:ring-2 focus:ring-teal/40 focus:outline-none"
                placeholder="••••••••"
            />
            <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-placeholder hover:text-text-secondary"
            >
                {showPassword ? (
                <EyeOff className="h-4 w-4" />
                ) : (
                <Eye className="h-4 w-4" />
                )}
            </button>
            </div>
        </div>

        {error && (
            <p id="login-error" className="text-xs text-coral">
            {error}
            </p>
        )}

        <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-ink py-2.5 text-sm font-medium text-parchment hover:bg-ink-hover focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
            {loading ? "Signing in..." : "Sign in"}
        </button>

        <div className="mt-6 flex items-center justify-between text-xs">
            <a href="/forgot-password" className="text-teal hover:underline">
            Forgot password?
            </a>
            <span className="text-text-secondary">
            No account?{" "}
            <a href="/signup" className="font-medium text-amber hover:underline">
                Create one
            </a>
            </span>
        </div>
        </form>
    );
}