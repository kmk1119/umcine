export function parsePage(value: unknown): number {
  const page = typeof value === "number" ? value
    : typeof value === "string" && /^\d+$/.test(value) ? Number(value) : NaN;
  return Number.isSafeInteger(page) && page > 0 && page <= 500 ? page : 1;
}
