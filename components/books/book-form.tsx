    "use client";

    import { useState, useRef } from "react";
    import { useRouter } from "next/navigation";
    import { Upload, X } from "lucide-react";

    type BookFormProps = {
    bookId?: string;
    initialData?: {
        title: string;
        author: string;
        genre: string | null;
        isbn: string | null;
        coverUrl: string | null;
        copiesAvailable: number;
        format: "PHYSICAL" | "DIGITAL";
    };
    };

    export function BookForm({ bookId, initialData }: BookFormProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isEditMode = Boolean(bookId);

    const [title, setTitle] = useState(initialData?.title ?? "");
    const [author, setAuthor] = useState(initialData?.author ?? "");
    const [isbn, setIsbn] = useState(initialData?.isbn ?? "");
    const [genre, setGenre] = useState(initialData?.genre ?? "");
    const [coverPreview, setCoverPreview] = useState<string | null>(
        initialData?.coverUrl ?? null
    );
    const [lookupLoading, setLookupLoading] = useState(false);
    const [lookupError, setLookupError] = useState("");
    const [errors, setErrors] = useState<{ title?: string; author?: string }>({});
    const [loading, setLoading] = useState(false);
    const [copiesAvailable, setCopiesAvailable] = useState(
        initialData?.copiesAvailable ?? 1
    );
    const [format, setFormat] = useState<"PHYSICAL" | "DIGITAL">(
        initialData?.format ?? "PHYSICAL"
    );

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const previewUrl = URL.createObjectURL(file);
        setCoverPreview(previewUrl);
    }

    function removeCover() {
        setCoverPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const newErrors: { title?: string; author?: string } = {};
        if (!title.trim()) newErrors.title = "Title is required.";
        if (!author.trim()) newErrors.author = "Author is required.";

        if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
        }

        setErrors({});
        setLoading(true);

        const url = isEditMode ? `/api/books/${bookId}` : "/api/books";
        const method = isEditMode ? "PATCH" : "POST";

        const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title,
            author,
            genre,
            isbn,
            coverUrl: coverPreview?.startsWith("blob:") ? null : coverPreview,
            copiesAvailable,
            format,
        }),
        });
        setLoading(false);

        if (res.ok) {
        router.push(isEditMode ? `/books/${bookId}` : "/books");
        router.refresh();
        }
    }

    async function handleLookup() {
        if (!isbn.trim()) return;

        setLookupError("");
        setLookupLoading(true);

        try {
        const res = await fetch(
            `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
        );
        const data = await res.json();
        const bookData = data[`ISBN:${isbn}`];

        if (!bookData) {
            setLookupError("No book found for this ISBN — enter details manually.");
            setLookupLoading(false);
            return;
        }

        setTitle(bookData.title ?? "");
        setAuthor(bookData.authors?.[0]?.name ?? "");
        setCoverPreview(`https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`);
        } catch {
        setLookupError("Something went wrong looking that up — enter details manually.");
        } finally {
        setLookupLoading(false);
        }
    }

    return (
        <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-border-warm bg-white p-6 lg:p-8"
        >
        <div className="mb-6">
            <label htmlFor="isbn-lookup" className="mb-1.5 block text-sm text-text-label">
            ISBN
            </label>
            <div className="flex gap-3">
            <input
                id="isbn-lookup"
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="e.g. 9780143127550"
                className="flex-1 rounded-md border border-border-warm bg-white px-3 py-2.5 text-sm text-ink focus:border-teal focus:ring-2 focus:ring-teal/40 focus:outline-none"
            />
            <button
                type="button"
                onClick={handleLookup}
                disabled={lookupLoading}
                className="rounded-md border border-border-warm px-4 py-2.5 text-sm font-medium text-ink hover:border-teal disabled:cursor-not-allowed disabled:opacity-50"
            >
                {lookupLoading ? "Looking up..." : "Lookup"}
            </button>
            </div>
            {lookupError && <p className="mt-1.5 text-xs text-coral">{lookupError}</p>}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-[160px_1fr]">
            {/* Cover upload */}
            <div className="relative aspect-2/3 w-full max-w-40">
            <div
                onClick={() => fileInputRef.current?.click()}
                className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border-warm bg-[#FBF8F1] hover:border-teal"
            >
                {coverPreview ? (
                <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="h-full w-full rounded-md object-cover"
                />
                ) : (
                <>
                    <Upload className="h-5 w-5 text-placeholder" />
                    <span className="px-2 text-center text-xs text-text-secondary">
                    Click to upload
                    </span>
                </>
                )}
            </div>
            {coverPreview && (
                <button
                type="button"
                onClick={removeCover}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink/80 text-white"
                aria-label="Remove cover image"
                >
                <X className="h-3.5 w-3.5" />
                </button>
            )}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
            </div>

            {/* Title / Author / Genre / Copies / Format */}
            <div className="space-y-4">
            <div>
                <label htmlFor="title" className="mb-1.5 block text-sm text-text-label">
                Title <span className="text-coral">*</span>
                </label>
                <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm text-ink focus:ring-2 focus:outline-none ${
                    errors.title
                    ? "border-coral focus:border-coral focus:ring-coral/40"
                    : "border-border-warm focus:border-teal focus:ring-teal/40"
                }`}
                />
                {errors.title && <p className="mt-1.5 text-xs text-coral">{errors.title}</p>}
            </div>

            <div>
                <label htmlFor="author" className="mb-1.5 block text-sm text-text-label">
                Author <span className="text-coral">*</span>
                </label>
                <input
                id="author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm text-ink focus:ring-2 focus:outline-none ${
                    errors.author
                    ? "border-coral focus:border-coral focus:ring-coral/40"
                    : "border-border-warm focus:border-teal focus:ring-teal/40"
                }`}
                />
                {errors.author && <p className="mt-1.5 text-xs text-coral">{errors.author}</p>}
            </div>

            <div>
                <label htmlFor="genre" className="mb-1.5 block text-sm text-text-label">
                Genre
                </label>
                <input
                id="genre"
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full rounded-md border border-border-warm bg-white px-3 py-2.5 text-sm text-ink focus:border-teal focus:ring-2 focus:ring-teal/40 focus:outline-none"
                />
            </div>

            <div>
                <label htmlFor="copiesAvailable" className="mb-1.5 block text-sm text-text-label">
                Copies available
                </label>
                <input
                id="copiesAvailable"
                type="number"
                min={1}
                value={copiesAvailable}
                onChange={(e) => setCopiesAvailable(Number(e.target.value))}
                className="w-full rounded-md border border-border-warm bg-white px-3 py-2.5 text-sm text-ink focus:border-teal focus:ring-2 focus:ring-teal/40 focus:outline-none"
                />
            </div>

            <div>
                <label htmlFor="format" className="mb-1.5 block text-sm text-text-label">
                Format
                </label>
                <select
                id="format"
                value={format}
                onChange={(e) => setFormat(e.target.value as "PHYSICAL" | "DIGITAL")}
                className="w-full rounded-md border border-border-warm bg-white px-3 py-2.5 text-sm text-ink focus:border-teal focus:ring-2 focus:ring-teal/40 focus:outline-none"
                >
                <option value="PHYSICAL">Physical</option>
                <option value="DIGITAL">Digital</option>
                </select>
            </div>
            </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center gap-3 border-t border-[#EFE9DA] pt-6">
            <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-parchment hover:bg-ink-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
            {loading ? "Saving..." : isEditMode ? "Save changes" : "Save book"}
            </button>
            <button
            type="button"
            onClick={() => router.push("/books")}
            className="rounded-md px-4 py-2.5 text-sm font-medium text-ink hover:bg-[#F6F1E7]"
            >
            Cancel
            </button>
        </div>
        </form>
    );
}