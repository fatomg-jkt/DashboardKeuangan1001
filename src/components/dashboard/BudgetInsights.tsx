import { AlertTriangle, CheckCircle2, Info, Siren } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPercent, formatRupiah } from "@/lib/formatters";
import type { BudgetInsight } from "@/lib/accurate/types";

const icons = { warning: AlertTriangle, success: CheckCircle2, info: Info, danger: Siren };
const styles = { warning: "border-amber-200 bg-amber-50 text-amber-800", success: "border-emerald-200 bg-emerald-50 text-emerald-800", info: "border-blue-200 bg-blue-50 text-blue-800", danger: "border-red-200 bg-red-50 text-red-800" };
export function BudgetInsights({ insights }: { insights: BudgetInsight[] }) {
  return <Card><CardHeader><CardTitle>Budget Analysis - Insight Otomatis</CardTitle></CardHeader><CardContent className="grid gap-3 md:grid-cols-2">{insights.map((insight) => { const Icon = icons[insight.type]; return <div key={insight.title} className={`rounded-xl border p-4 ${styles[insight.type]}`}><div className="flex gap-3"><Icon className="mt-1 h-5 w-5 shrink-0" /><div><h3 className="font-semibold">{insight.title}</h3><p className="mt-1 text-sm opacity-90">{insight.description}</p><p className="mt-2 text-xs font-medium">{insight.amount !== undefined ? formatRupiah(insight.amount) : ""} {insight.percentage !== undefined ? `(${formatPercent(insight.percentage)})` : ""}</p>{insight.recommendation && <p className="mt-2 text-sm"><b>Rekomendasi:</b> {insight.recommendation}</p>}</div></div></div>; })}</CardContent></Card>;
}
