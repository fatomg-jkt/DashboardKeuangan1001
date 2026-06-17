export const formatCurrency = (value: number, compact = false) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: compact ? 2 : 0, notation: compact ? 'compact' : 'standard', compactDisplay: 'long' }).format(value);
export const formatPercent = (value: number) => new Intl.NumberFormat('id-ID', { style: 'percent', maximumFractionDigits: 1 }).format(value);
export const formatNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);
