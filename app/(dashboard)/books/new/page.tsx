    import { getServerSession } from "next-auth";
    import { redirect } from "next/navigation";
    import { authOptions } from "@/lib/auth";
    import { BookForm } from "@/components/books/book-form";

    export default async function NewBookPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen w-full bg-parchment px-6 py-10">
        <div className="mx-auto max-w-3xl">
            <h1 className="text-2xl font-medium text-ink">Add a book</h1>
            <p className="mb-8 text-sm text-text-secondary">
            Add a new book to your library.
            </p>
            <BookForm />
        </div>
        </div>
    );
}