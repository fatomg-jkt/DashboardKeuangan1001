"use client";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactRupiah, formatPercent } from "@/lib/formatters";
import type { ProfitLossReport } from "@/lib/accurate/types";

export function ProfitLossChart({ data }: { data: ProfitLossReport }) {
  return <div className="grid gap-4 xl:grid-cols-2">
    <Card><CardHeader><CardTitle>Tren Profit & Loss Bulanan</CardTitle></CardHeader><CardContent className="h-80"><ResponsiveContainer><BarChart data={data.monthlyTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis tickFormatter={formatCompactRupiah} /><Tooltip formatter={(v) => formatCompactRupiah(Number(v))} /><Legend /><Bar dataKey="revenue" name="Revenue" fill="#2563eb" /><Bar dataKey="cogs" name="COGS" fill="#f97316" /><Bar dataKey="netProfit" name="Net Profit" fill="#16a34a" /></BarChart></ResponsiveContainer></CardContent></Card>
    <Card><CardHeader><CardTitle>Margin Analysis</CardTitle></CardHeader><CardContent className="h-80"><ResponsiveContainer><LineChart data={data.monthlyTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis tickFormatter={(v) => `${v}%`} /><Tooltip formatter={(v) => formatPercent(Number(v))} /><Legend /><Line type="monotone" dataKey="grossMargin" name="Gross Margin" stroke="#2563eb" strokeWidth={2} /><Line type="monotone" dataKey="netProfitMargin" name="Net Margin" stroke="#16a34a" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
  </div>;
}
