"use client";
import { Bar, BarChart, CartesianGrid, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactRupiah, formatRupiah } from "@/lib/formatters";
import type { CashFlowReport } from "@/lib/accurate/types";

export function CashFlowChart({ data }: { data: CashFlowReport }) {
  return <Card><CardHeader><CardTitle>Cash Movement per Bulan</CardTitle></CardHeader><CardContent><div className="grid gap-3 pb-4 sm:grid-cols-3"><div>Operating<br /><b>{formatRupiah(data.operatingActivities)}</b></div><div>Net Change<br /><b>{formatRupiah(data.netChangeInCash)}</b></div><div>Closing Cash<br /><b>{formatRupiah(data.closingCashBalance)}</b></div></div><div className="h-80"><ResponsiveContainer><BarChart data={data.monthlyMovement}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis tickFormatter={formatCompactRupiah} /><Tooltip formatter={(v) => formatCompactRupiah(Number(v))} /><Legend /><Bar dataKey="operating" fill="#16a34a" name="Operating" /><Bar dataKey="investing" fill="#f97316" name="Investing" /><Bar dataKey="financing" fill="#7c3aed" name="Financing" /><Line dataKey="closingCash" stroke="#2563eb" name="Closing Cash" /></BarChart></ResponsiveContainer></div></CardContent></Card>;
}
