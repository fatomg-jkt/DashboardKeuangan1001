"use client";
import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from "recharts";
import type { MonthlyTrend } from "@/lib/accurate/types";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactRupiah, formatPercent, formatRupiah } from "@/lib/formatters";

export function GrossMarginChart({ trend, warning }: { trend: MonthlyTrend[]; warning?: boolean }) {
  const latest = trend[trend.length - 1];
  return <Card><CardHeader><CardTitle>Gross Margin</CardTitle></CardHeader><CardContent className="space-y-4">{warning && <Alert variant="warning">Gross Margin turun dibanding periode sebelumnya. Review harga jual, diskon, dan COGS.</Alert>}<div className="text-3xl font-bold">{formatPercent(latest?.grossMargin ?? 0)}</div><div className="grid gap-4 lg:grid-cols-2"><div className="h-64"><ResponsiveContainer><BarChart data={trend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis tickFormatter={formatCompactRupiah} /><Tooltip formatter={(v) => formatRupiah(Number(v))} /><Legend /><Bar dataKey="revenue" name="Revenue" fill="#2563eb" /><Bar dataKey="cogs" name="COGS" fill="#f97316" /></BarChart></ResponsiveContainer></div><div className="h-64"><ResponsiveContainer><LineChart data={trend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis tickFormatter={(v) => `${v}%`} /><Tooltip formatter={(v) => formatPercent(Number(v))} /><Line dataKey="grossMargin" name="Gross Margin" stroke="#16a34a" strokeWidth={3} /></LineChart></ResponsiveContainer></div></div></CardContent></Card>;
}
