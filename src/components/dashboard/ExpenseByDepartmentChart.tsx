"use client";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { ExpenseByDepartment } from "@/lib/accurate/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatPercent, formatRupiah } from "@/lib/formatters";

const colors = ["#2563eb", "#16a34a", "#f97316", "#9333ea", "#ef4444"];
export function ExpenseByDepartmentChart({ data }: { data: ExpenseByDepartment[] }) {
  return <Card><CardHeader><CardTitle>Expense by Department</CardTitle></CardHeader><CardContent className="grid gap-5 lg:grid-cols-2"><div className="h-72"><ResponsiveContainer><PieChart><Pie data={data} dataKey="actual" nameKey="departmentName" outerRadius={100} label>{data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}</Pie><Tooltip formatter={(v) => formatRupiah(Number(v))} /></PieChart></ResponsiveContainer></div><Table><TableHeader><TableRow><TableHead>Department</TableHead><TableHead className="text-right">Actual</TableHead><TableHead className="text-right">% Total</TableHead><TableHead className="text-right">Budget</TableHead></TableRow></TableHeader><TableBody>{data.map((row) => <TableRow key={row.departmentName}><TableCell>{row.departmentName}</TableCell><TableCell className="text-right">{formatRupiah(row.actual)}</TableCell><TableCell className="text-right">{formatPercent(row.percentageOfTotal)}</TableCell><TableCell className="text-right">{row.budget ? formatRupiah(row.budget) : "-"}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>;
}
