    import { Suspense } from "react";
    import { ResetPasswordForm } from "@/components/auth/reset-password-form";

    export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-parchment px-6">
        <div className="w-full max-w-sm">
            <h1 className="mb-1 text-2xl font-medium text-ink">Set a new password</h1>
            <p className="mb-8 text-sm text-text-secondary">
            Choose a new password for your account.
            </p>
            <Suspense fallback={<p className="text-sm text-text-secondary">Loading...</p>}>
            <ResetPasswordForm />
            </Suspense>
        </div>
        </div>
    );
}