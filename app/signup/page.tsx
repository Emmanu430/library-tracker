    import { BookOpen } from "lucide-react";
    import { SignupForm } from "@/components/auth/signup-form";

    export default function SignupPage() {
    return (
        <div className="flex min-h-screen w-full">
        {/* Left brand panel — hidden below lg breakpoint */}
        <div className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden bg-ink lg:flex">
            {/* Book spine bars — different heights/order than login */}
            <div className="absolute bottom-0 flex h-40 w-full items-end gap-2 px-12">
            <div className="h-56 w-12 bg-teal" />
            <div className="h-76 w-12 bg-amber" />
            <div className="h-64 w-12 bg-coral" />
            <div className="h-84 w-12 bg-parchment/40" />
            <div className="h-48 w-12 bg-teal/60" />
            </div>
            {/* Gradient overlay so text stays legible over the bars */}
            <div className="absolute inset-0 bg-linear-to-b from-ink via-ink/80 to-transparent" />

            <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-parchment/10">
                <BookOpen className="h-8 w-8 text-parchment" />
            </div>
            <h1 className="font-serif text-4xl text-parchment">Athenaeum</h1>
            <p className="mt-2 text-parchment/60">Your library, always in order.</p>
            </div>
        </div>

        {/* Right form panel — always visible */}
        <div className="flex w-full flex-col items-center justify-center bg-parchment px-6 py-12 lg:w-1/2">
            <div className="w-full max-w-sm">
            {/* Small inline logo, shown only below lg */}
            <div className="mb-8 flex items-center gap-2 lg:hidden">
                <BookOpen className="h-5 w-5 text-ink" />
                <span className="font-serif text-xl text-ink">Athenaeum</span>
            </div>

            <h2 className="mb-1 text-2xl font-medium text-ink">Create your account</h2>
            <p className="mb-8 text-sm text-text-secondary">
                Set up your library in a couple of minutes.
            </p>

            <SignupForm />
            </div>
        </div>
        </div>
    );
}