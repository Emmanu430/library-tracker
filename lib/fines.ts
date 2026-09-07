    const DAILY_FINE_RATE = 0.5;

    export function calculateFine(dueDate: Date, returnedAt: Date | null): number {
    const endDate = returnedAt ?? new Date();
    const daysOverdue = Math.floor(
        (endDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysOverdue > 0 ? daysOverdue * DAILY_FINE_RATE : 0;
}