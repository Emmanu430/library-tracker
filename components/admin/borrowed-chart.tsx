    "use client";

    type BorrowData = { title: string; count: number };

    export function BorrowedChart({ data }: { data: BorrowData[] }) {
    const maxCount = Math.max(...data.map((d) => d.count), 1);

    return (
        <div className="rounded-xl border border-border-warm bg-white p-5">
        <h2 className="mb-4 text-base font-medium text-ink">Most borrowed books</h2>
        <div className="space-y-3">
            {data.map((item) => (
            <div key={item.title}>
                <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-ink">{item.title}</span>
                <span className="text-text-secondary">{item.count}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#EFE9DA]">
                <div
                    className="h-full rounded-full bg-teal"
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
                </div>
            </div>
            ))}
        </div>
        </div>
    );
}