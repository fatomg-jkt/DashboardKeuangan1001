"use client";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCompactRupiah, formatPercent, formatRupiah } from "@/lib/formatters";
import type { ExpenseByDepartment } from "@/lib/accurate/types";

const colors = ["#2563eb", "#16a34a", "#f97316", "#7c3aed", "#ef4444"];
export function ExpenseByDepartmentChart({ data }: { data: ExpenseByDepartment[] }) {
  return <Card><CardHeader><CardTitle>Expense by Department</CardTitle></CardHeader><CardContent className="grid gap-6 xl:grid-cols-3"><div className="h-72"><ResponsiveContainer><PieChart><Pie data={data} dataKey="actual" nameKey="departmentName" outerRadius={95} label>{data.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}</Pie><Tooltip formatter={(v) => formatCompactRupiah(Number(v))} /></PieChart></ResponsiveContainer></div><div className="h-72"><ResponsiveContainer><BarChart data={data} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" tickFormatter={formatCompactRupiah} /><YAxis type="category" dataKey="departmentName" width={110} /><Tooltip formatter={(v) => formatCompactRupiah(Number(v))} /><Bar dataKey="actual" fill="#2563eb" /></BarChart></ResponsiveContainer></div><Table><TableHeader><TableRow><TableHead>Department</TableHead><TableHead className="text-right">Actual</TableHead><TableHead className="text-right">% Total</TableHead><TableHead className="text-right">Variance</TableHead></TableRow></TableHeader><TableBody>{data.map((item) => <TableRow key={item.departmentName}><TableCell>{item.departmentName}</TableCell><TableCell className="text-right">{formatRupiah(item.actual)}</TableCell><TableCell className="text-right">{formatPercent(item.percentageOfTotal)}</TableCell><TableCell className="text-right">{formatRupiah(item.variance ?? 0)}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>;
}
