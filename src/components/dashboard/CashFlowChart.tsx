"use client";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { CashFlowReport } from "@/lib/accurate/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactRupiah, formatRupiah } from "@/lib/formatters";

export function CashFlowChart({ data }: { data: CashFlowReport }) {
  return <Card><CardHeader><CardTitle>Arus Kas</CardTitle></CardHeader><CardContent className="space-y-5"><div className="grid gap-3 md:grid-cols-3"><Metric label="Operating Activities" value={data.operatingActivities} /><Metric label="Investing Activities" value={data.investingActivities} /><Metric label="Financing Activities" value={data.financingActivities} /><Metric label="Net Change in Cash" value={data.netChangeInCash} /><Metric label="Opening Cash Balance" value={data.openingCashBalance} /><Metric label="Closing Cash Balance" value={data.closingCashBalance} /></div><div className="h-72"><ResponsiveContainer><BarChart data={data.monthlyMovement}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis tickFormatter={formatCompactRupiah} /><Tooltip formatter={(v) => formatRupiah(Number(v))} /><Legend /><Bar dataKey="cashIn" name="Cash In" fill="#22c55e" /><Bar dataKey="cashOut" name="Cash Out" fill="#ef4444" /><Bar dataKey="netCash" name="Net Cash" fill="#2563eb" /></BarChart></ResponsiveContainer></div></CardContent></Card>;
}
function Metric({ label, value }: { label: string; value: number }) { return <div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="font-semibold">{formatRupiah(value)}</p></div>; }
