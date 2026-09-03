    "use client";

    import { useState, useRef } from "react";
    import { useRouter } from "next/navigation";
    import { Upload, X } from "lucide-react";

    export function BookForm() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [genre, setGenre] = useState("");
    const [isbn, setIsbn] = useState("");
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ title?: string; author?: string }>({});
    const [loading, setLoading] = useState(false);

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

        const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, genre, isbn }),
        });

        setLoading(false);

        if (res.ok) {
        router.push("/books");
        }
    }

    return (
        <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-border-warm bg-white p-6 lg:p-8"
        >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-[160px_1fr]">
            {/* Cover upload */}
            <div className="relative aspect-[2/3] w-full max-w-[160px]">
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

            {/* Title / Author / Genre */}
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
            </div>
        </div>

        {/* ISBN full-width */}
        <div className="mt-4">
            <label htmlFor="isbn" className="mb-1.5 block text-sm text-text-label">
            ISBN
            </label>
            <input
            id="isbn"
            type="text"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            className="w-full rounded-md border border-border-warm bg-white px-3 py-2.5 text-sm text-ink focus:border-teal focus:ring-2 focus:ring-teal/40 focus:outline-none"
            />
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center gap-3 border-t border-[#EFE9DA] pt-6">
            <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-parchment hover:bg-ink-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
            {loading ? "Saving..." : "Save book"}
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