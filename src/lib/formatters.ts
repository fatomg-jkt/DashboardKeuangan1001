export const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0
});

export const numberFormatter = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });

export function formatRupiah(value: number) {
  return rupiahFormatter.format(value);
}

export function formatPercent(value: number) {
  return `${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(value)}%`;
}

export function formatCompactRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}
