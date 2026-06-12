"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SalesByProduct } from "@/lib/accurate/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCompactRupiah, formatNumber, formatPercent, formatRupiah } from "@/lib/formatters";

export function TopProductsChart({ data }: { data: SalesByProduct[] }) {
  const top5 = data.slice(0, 5);
  return <Card><CardHeader><CardTitle>Top 5 Penjualan per Produk</CardTitle></CardHeader><CardContent className="space-y-5"><div className="h-72"><ResponsiveContainer><BarChart data={top5} layout="vertical" margin={{ left: 80 }}><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tickFormatter={formatCompactRupiah} /><YAxis type="category" dataKey="productName" width={130} /><Tooltip formatter={(v) => formatRupiah(Number(v))} /><Bar dataKey="revenue" name="Nilai Penjualan" fill="#2563eb" /></BarChart></ResponsiveContainer></div><Table><TableHeader><TableRow><TableHead>Produk</TableHead><TableHead className="text-right">Penjualan</TableHead><TableHead className="text-right">Qty</TableHead><TableHead className="text-right">Gross Profit</TableHead><TableHead className="text-right">GM%</TableHead></TableRow></TableHeader><TableBody>{top5.map((row) => <TableRow key={row.productName}><TableCell>{row.productName}</TableCell><TableCell className="text-right">{formatRupiah(row.revenue)}</TableCell><TableCell className="text-right">{formatNumber(row.quantity)}</TableCell><TableCell className="text-right">{formatRupiah(row.grossProfit)}</TableCell><TableCell className="text-right">{formatPercent(row.grossMargin)}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>;
}
