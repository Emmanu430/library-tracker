    import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

    export default function ForgotPasswordPage() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-parchment px-6">
        <div className="w-full max-w-sm">
            <h1 className="mb-1 text-2xl font-medium text-ink">Reset your password</h1>
            <p className="mb-8 text-sm text-text-secondary">
            Enter your email and we'll send you a reset link.
            </p>
            <ForgotPasswordForm />
        </div>
        </div>
    );
}