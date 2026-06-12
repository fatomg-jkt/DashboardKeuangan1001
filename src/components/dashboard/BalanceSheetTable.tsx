import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatRupiah } from "@/lib/formatters";
import type { BalanceSheetReport } from "@/lib/accurate/types";

export function BalanceSheetTable({ data }: { data: BalanceSheetReport }) {
  const rows = [
    ["Asset Lancar", data.currentAssets], ["Kas & Bank", data.cashAndBank], ["Piutang", data.accountsReceivable], ["Persediaan", data.inventory], ["Asset Tetap", data.fixedAssets], ["Total Asset", data.totalAssets], ["Liabilities", data.liabilities], ["Equity", data.equity], ["Total Liabilities + Equity", data.totalLiabilitiesAndEquity]
  ];
  return <Card><CardHeader><CardTitle>Balance Sheet</CardTitle></CardHeader><CardContent><div className={`mb-4 rounded-lg p-3 text-sm ${data.isBalanced ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{data.isBalanced ? <CheckCircle2 className="mr-2 inline h-4 w-4" /> : <AlertTriangle className="mr-2 inline h-4 w-4" />}{data.isBalanced ? "Total Asset balance dengan Total Liabilities + Equity." : `Warning: laporan tidak balance, selisih ${formatRupiah(data.difference)}.`}</div><Table><TableBody>{rows.map(([label, value]) => <TableRow key={label as string}><TableCell className="font-medium">{label}</TableCell><TableCell className="text-right">{formatRupiah(value as number)}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>;
}
