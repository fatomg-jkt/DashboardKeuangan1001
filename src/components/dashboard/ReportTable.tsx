import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatRupiah } from "@/lib/formatters";
import type { CashFlowReport, ProfitLossReport } from "@/lib/accurate/types";

export function ProfitLossTable({ data }: { data: ProfitLossReport }) {
  return <Card><CardHeader><CardTitle>Tabel Laporan Profit & Loss</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Komponen</TableHead><TableHead className="text-right">Nilai</TableHead></TableRow></TableHeader><TableBody>{data.lines.map((line) => <TableRow key={line.label} className={line.type === "profit" ? "font-semibold" : ""}><TableCell>{line.label}</TableCell><TableCell className="text-right">{formatRupiah(line.value)}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>;
}

export function CashFlowTable({ data }: { data: CashFlowReport }) {
  const rows = [["Cash Flow dari Operating Activities", data.operatingActivities], ["Cash Flow dari Investing Activities", data.investingActivities], ["Cash Flow dari Financing Activities", data.financingActivities], ["Net Change in Cash", data.netChangeInCash], ["Opening Cash Balance", data.openingCashBalance], ["Closing Cash Balance", data.closingCashBalance]];
  return <Card><CardHeader><CardTitle>Tabel Arus Kas</CardTitle></CardHeader><CardContent><Table><TableBody>{rows.map(([label, value]) => <TableRow key={label as string}><TableCell>{label}</TableCell><TableCell className="text-right font-medium">{formatRupiah(value as number)}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>;
}
