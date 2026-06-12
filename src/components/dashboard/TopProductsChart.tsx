"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCompactRupiah, formatPercent, formatRupiah, numberFormatter } from "@/lib/formatters";
import type { SalesByProduct } from "@/lib/accurate/types";

export function TopProductsChart({ data }: { data: SalesByProduct[] }) {
  return <Card><CardHeader><CardTitle>Top 5 Penjualan per Produk</CardTitle></CardHeader><CardContent className="grid gap-6 xl:grid-cols-2"><div className="h-80"><ResponsiveContainer><BarChart data={data} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tickFormatter={formatCompactRupiah} /><YAxis type="category" dataKey="productName" width={140} /><Tooltip formatter={(v) => formatCompactRupiah(Number(v))} /><Bar dataKey="revenue" fill="#2563eb" name="Penjualan" /></BarChart></ResponsiveContainer></div><Table><TableHeader><TableRow><TableHead>Produk</TableHead><TableHead className="text-right">Sales</TableHead><TableHead className="text-right">Qty</TableHead><TableHead className="text-right">GP</TableHead><TableHead className="text-right">GM</TableHead></TableRow></TableHeader><TableBody>{data.map((item) => <TableRow key={item.productName}><TableCell>{item.productName}</TableCell><TableCell className="text-right">{formatRupiah(item.revenue)}</TableCell><TableCell className="text-right">{numberFormatter.format(item.quantity)}</TableCell><TableCell className="text-right">{formatRupiah(item.grossProfit)}</TableCell><TableCell className="text-right">{formatPercent(item.grossMargin)}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>;
}
