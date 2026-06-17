export function safeNumber(value: unknown): number {
  if (value === null || value === undefined) return 0;
  const numberValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

export function formatRupiah(value: unknown): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(safeNumber(value));
}

export function formatPercent(value: unknown): string {
  return `${safeNumber(value).toFixed(1)}%`;
}

export function calculateGrossMargin(revenue: unknown, grossProfit: unknown): number {
  const safeRevenue = safeNumber(revenue);
  if (safeRevenue === 0) return 0;
  return (safeNumber(grossProfit) / safeRevenue) * 100;
}

export function calculateVariance(actual: unknown, budget: unknown): number {
  const safeBudget = safeNumber(budget);
  if (safeBudget === 0) return 0;
  return ((safeNumber(actual) - safeBudget) / safeBudget) * 100;
}
