"use client";
import { AlertTriangle } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactRupiah, formatPercent } from "@/lib/formatters";
import type { ProfitLossReport } from "@/lib/accurate/types";

export function GrossMarginChart({ data }: { data: ProfitLossReport }) {
  const last = data.monthlyTrend.at(-1)?.grossMargin ?? 0;
  const previous = data.monthlyTrend.at(-2)?.grossMargin ?? 0;
  return <div className="grid gap-4 xl:grid-cols-2">
    <Card><CardHeader><CardTitle>Revenue vs COGS</CardTitle></CardHeader><CardContent className="h-72"><ResponsiveContainer><BarChart data={data.monthlyTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis tickFormatter={formatCompactRupiah} /><Tooltip formatter={(v) => formatCompactRupiah(Number(v))} /><Legend /><Bar dataKey="revenue" name="Revenue" fill="#2563eb" /><Bar dataKey="cogs" name="COGS" fill="#ef4444" /></BarChart></ResponsiveContainer></CardContent></Card>
    <Card><CardHeader><CardTitle>Trend Gross Margin</CardTitle></CardHeader><CardContent><div className="h-56"><ResponsiveContainer><AreaChart data={data.monthlyTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis tickFormatter={(v) => `${v}%`} /><Tooltip formatter={(v) => formatPercent(Number(v))} /><Area dataKey="grossMargin" name="Gross Margin" fill="#bfdbfe" stroke="#2563eb" /></AreaChart></ResponsiveContainer></div>{last < previous && <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-700"><AlertTriangle className="mr-2 inline h-4 w-4" />Gross Margin turun dibanding periode sebelumnya.</p>}</CardContent></Card>
  </div>;
}
