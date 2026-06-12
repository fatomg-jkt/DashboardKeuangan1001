import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatPercent, formatRupiah } from "@/lib/formatters";
import type { BudgetVsActualItem, BudgetVsActualReport } from "@/lib/accurate/types";

function Status({ status }: { status: BudgetVsActualItem["status"] }) {
  const map = { under_budget: ["Under Budget", "success"], over_budget: ["Over Budget", "danger"], on_track: ["On Track", "muted"] } as const;
  return <Badge variant={map[status][1]}>{map[status][0]}</Badge>;
}

export function BudgetVsActualTable({ data, title = "Budget vs Actual Summary" }: { data: BudgetVsActualReport; title?: string }) {
  const rows = [...data.byRevenue, ...data.byCogs, ...data.byOperatingExpense, ...data.byDepartment, ...data.byAccountCategory];
  return <Card><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent><div className="mb-4 grid gap-3 sm:grid-cols-4"><div>Total Budget<br /><b>{formatRupiah(data.totalBudget)}</b></div><div>Total Actual<br /><b>{formatRupiah(data.totalActual)}</b></div><div>Variance<br /><b>{formatRupiah(data.variance)}</b></div><div>Variance %<br /><b>{formatPercent(data.variancePercent)}</b></div></div><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Kategori</TableHead><TableHead>Akun</TableHead><TableHead>Department</TableHead><TableHead className="text-right">Budget</TableHead><TableHead className="text-right">Actual</TableHead><TableHead className="text-right">Variance</TableHead><TableHead className="text-right">Variance %</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{rows.map((item, index) => <TableRow key={`${item.category}-${item.accountName}-${index}`}><TableCell>{item.category}</TableCell><TableCell>{item.accountName}</TableCell><TableCell>{item.department ?? "-"}</TableCell><TableCell className="text-right">{formatRupiah(item.budget)}</TableCell><TableCell className="text-right">{formatRupiah(item.actual)}</TableCell><TableCell className="text-right">{formatRupiah(item.variance)}</TableCell><TableCell className="text-right">{formatPercent(item.variancePercent)}</TableCell><TableCell><Status status={item.status} /></TableCell></TableRow>)}</TableBody></Table></div></CardContent></Card>;
}
