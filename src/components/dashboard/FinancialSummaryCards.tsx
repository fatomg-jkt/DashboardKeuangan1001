import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { FinancialSummary, PeriodComparison } from "@/lib/accurate/types";
import { formatPercent, formatRupiah } from "@/lib/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const cards: Array<{ key: keyof FinancialSummary; label: string; percent?: boolean }> = [
  { key: "totalRevenue", label: "Total Pendapatan" }, { key: "grossProfit", label: "Laba Kotor" }, { key: "netProfit", label: "Laba Bersih" }, { key: "totalAssets", label: "Total Asset" },
  { key: "cashAndBank", label: "Kas & Bank" }, { key: "grossMargin", label: "Gross Margin", percent: true }, { key: "netProfitMargin", label: "Net Profit Margin", percent: true }, { key: "operatingExpense", label: "Operating Expense" }
];

export function FinancialSummaryCards({ data, loading = false, error }: { data?: PeriodComparison<FinancialSummary>; loading?: boolean; error?: string }) {
  if (error) return <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">Gagal memuat KPI: {error}</div>;
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map((card) => <Card key={card.key}><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{card.label}</CardTitle></CardHeader><CardContent>{loading || !data ? <><Skeleton className="h-8 w-36" /><Skeleton className="mt-3 h-4 w-24" /></> : <KpiValue value={data.current[card.key]} change={data.changes[card.key]} percent={card.percent} />}</CardContent></Card>)}</div>;
}

function KpiValue({ value, change, percent }: { value: number; change: number; percent?: boolean }) {
  const positive = change >= 0;
  return <><div className="text-2xl font-bold tracking-tight">{percent ? formatPercent(value) : formatRupiah(value)}</div><div className={`mt-2 flex items-center gap-1 text-sm ${positive ? "text-emerald-600" : "text-rose-600"}`}>{positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}{formatPercent(Math.abs(change))} vs periode sebelumnya</div></>;
}
