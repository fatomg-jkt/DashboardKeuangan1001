import type { BudgetVsActualItem } from "@/lib/accurate/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatPercent, formatRupiah } from "@/lib/formatters";

export function BudgetVsActualTable({ data }: { data: BudgetVsActualItem[] }) {
  const totalBudget = data.reduce((sum, row) => sum + row.budget, 0);
  const totalActual = data.reduce((sum, row) => sum + row.actual, 0);
  const variance = totalActual - totalBudget;
  return <Card><CardHeader><CardTitle>Budget vs Actual Summary</CardTitle></CardHeader><CardContent className="space-y-5"><div className="grid gap-3 md:grid-cols-4"><Metric label="Total Budget" value={formatRupiah(totalBudget)} /><Metric label="Total Actual" value={formatRupiah(totalActual)} /><Metric label="Variance" value={formatRupiah(variance)} /><Metric label="Variance %" value={formatPercent((variance / totalBudget) * 100)} /></div><Table><TableHeader><TableRow><TableHead>Kategori</TableHead><TableHead>Akun</TableHead><TableHead>Department</TableHead><TableHead className="text-right">Budget</TableHead><TableHead className="text-right">Actual</TableHead><TableHead className="text-right">Variance</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{data.map((row) => <TableRow key={`${row.category}-${row.accountName}`}><TableCell>{row.category}</TableCell><TableCell>{row.accountName}</TableCell><TableCell>{row.department ?? "-"}</TableCell><TableCell className="text-right">{formatRupiah(row.budget)}</TableCell><TableCell className="text-right">{formatRupiah(row.actual)}</TableCell><TableCell className="text-right">{formatRupiah(row.variance)} ({formatPercent(row.variancePercent)})</TableCell><TableCell><Badge variant={row.status === "over_budget" ? "danger" : row.status === "on_track" ? "warning" : "success"}>{row.status.replace("_", " ")}</Badge></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>;
}
function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-lg bg-slate-50 p-4"><p className="text-sm text-muted-foreground">{label}</p><p className="text-lg font-semibold">{value}</p></div>; }
