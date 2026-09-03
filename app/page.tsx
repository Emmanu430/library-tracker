import Link from "next/link";
import { BookOpen, ArrowRight, Search, Users, BellRing } from "lucide-react";

export default function LandingPage() {
  return (
      <div className=" bg-parchment  w-full">
            <div className="mx-auto max-w-7xl  px-6 lg:px-16">
      {/* Nav */}
      <nav className="flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-teal" />
          <span className="font-serif text-xl text-ink">Athenaeum</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-text-label hover:text-ink"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-parchment hover:bg-ink-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="grid grid-cols-1 items-center gap-12 pt-16 pb-24 lg:grid-cols-2">
        <div>
          <h1 className="mb-6 font-serif text-4xl leading-tight text-ink lg:text-5xl">
            Your personal library, finally organized.
          </h1>
          <p className="mb-8 max-w-md text-base text-text-secondary lg:text-lg">
            Track every book you own and every copy you've lent out — never
            lose a book to a forgetful friend again.
          </p>
          <div className="flex gap-4">
            <Link
              href="/signup"
              className="flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-parchment hover:bg-ink-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
            >
              Create your library
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-border-warm px-4 py-2.5 text-sm font-medium text-ink hover:border-ink"
            >
              Sign in
            </Link>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="relative h-80 overflow-hidden rounded-2xl bg-ink lg:h-96"
        >
          <div className="absolute bottom-0 flex w-full items-end gap-2 px-12 pb-8">
            <div className="h-10 w-12 bg-teal" />
            <div className="h-16 w-12 bg-amber" />
            <div className="h-14 w-12 bg-coral" />
            <div className="h-20 w-12 bg-parchment/40" />
            <div className="h-12 w-12 bg-teal/60" />
          </div>
          <div className="absolute inset-0 bg-linear-to-b from-ink via-transparent to-transparent" />
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 gap-8 pb-24 sm:grid-cols-3">
        <div>
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-teal/10">
            <Search className="h-5 w-5 text-teal" />
          </div>
          <h3 className="mb-1.5 text-base font-medium text-ink">
            Find any book instantly
          </h3>
          <p className="text-sm text-text-secondary">
            Search your whole collection by title, author, or genre in
            seconds.
          </p>
        </div>

        <div>
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-amber/10">
            <Users className="h-5 w-5 text-amber" />
          </div>
          <h3 className="mb-1.5 text-base font-medium text-ink">
            Track who has what
          </h3>
          <p className="text-sm text-text-secondary">
            See exactly who borrowed which book, and when it's due back.
          </p>
        </div>

        <div>
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-coral/10">
            <BellRing className="h-5 w-5 text-coral" />
          </div>
          <h3 className="mb-1.5 text-base font-medium text-ink">
            Never miss a return
          </h3>
          <p className="text-sm text-text-secondary">
            Keep an eye on due dates so no book goes missing for good.
          </p>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-border-warm py-16 text-center">
        <h2 className="mb-4 font-serif text-2xl text-ink lg:text-3xl">
          Ready to get your shelves in order?
        </h2>
        <Link
          href="/signup"
          className="inline-block rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-parchment hover:bg-ink-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
        >
          Get started — it's free
        </Link>
      </section>
    </div>
      </div>
  );
}