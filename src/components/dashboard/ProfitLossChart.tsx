"use client";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ProfitLossReport } from "@/lib/accurate/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactRupiah, formatPercent, formatRupiah } from "@/lib/formatters";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ProfitLossChart({ data }: { data: ProfitLossReport }) {
  return <Card><CardHeader><CardTitle>Profit & Loss Trend</CardTitle></CardHeader><CardContent className="space-y-6"><div className="h-80"><ResponsiveContainer><AreaChart data={data.monthlyTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis tickFormatter={formatCompactRupiah} /><Tooltip formatter={(v) => formatRupiah(Number(v))} /><Legend /><Area type="monotone" dataKey="revenue" name="Pendapatan" stroke="#2563eb" fill="#dbeafe" /><Area type="monotone" dataKey="netProfit" name="Laba Bersih" stroke="#16a34a" fill="#dcfce7" /></AreaChart></ResponsiveContainer></div><div className="grid gap-3 md:grid-cols-3"><Metric label="Gross Margin" value={formatPercent(data.marginAnalysis.grossMargin)} /><Metric label="Operating Margin" value={formatPercent(data.marginAnalysis.operatingMargin)} /><Metric label="Net Profit Margin" value={formatPercent(data.marginAnalysis.netProfitMargin)} /></div><Table><TableHeader><TableRow><TableHead>Komponen</TableHead><TableHead className="text-right">Nilai</TableHead></TableRow></TableHeader><TableBody>{data.rows.map((row) => <TableRow key={row.label} className={row.type.includes("profit") ? "font-semibold" : ""}><TableCell>{row.label}</TableCell><TableCell className="text-right">{formatRupiah(row.amount)}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>;
}
function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-lg bg-slate-50 p-4"><p className="text-sm text-muted-foreground">{label}</p><p className="text-xl font-semibold">{value}</p></div>; }
