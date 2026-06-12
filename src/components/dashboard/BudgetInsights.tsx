import type { BudgetInsight } from "@/lib/accurate/types";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPercent, formatRupiah } from "@/lib/formatters";

export function BudgetInsights({ insights }: { insights: BudgetInsight[] }) {
  return <Card><CardHeader><CardTitle>Budget Analysis</CardTitle></CardHeader><CardContent className="space-y-3">{insights.map((insight) => <Alert key={insight.title} variant={insight.type === "danger" ? "danger" : insight.type === "warning" ? "warning" : insight.type === "success" ? "success" : "default"}><div className="font-semibold">{insight.title}</div><p className="mt-1">{insight.description}</p>{(insight.amount !== undefined || insight.percentage !== undefined) && <p className="mt-2 text-xs font-medium">{insight.amount !== undefined ? formatRupiah(insight.amount) : ""} {insight.percentage !== undefined ? `• ${formatPercent(insight.percentage)}` : ""}</p>}{insight.recommendation && <p className="mt-2 text-sm">Rekomendasi: {insight.recommendation}</p>}</Alert>)}</CardContent></Card>;
}
