import type { BalanceSheetReport } from "@/lib/accurate/types";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { formatRupiah } from "@/lib/formatters";

export function BalanceSheetTable({ data }: { data: BalanceSheetReport }) {
  const rows = [["Kas & Bank", data.currentAssets.cashAndBank], ["Piutang", data.currentAssets.accountsReceivable], ["Persediaan", data.currentAssets.inventory], ["Asset Lancar Lainnya", data.currentAssets.otherCurrentAssets], ["Asset Tetap", data.fixedAssets], ["Total Asset", data.totalAssets], ["Liabilities", data.liabilities], ["Equity", data.equity], ["Total Liabilities + Equity", data.totalLiabilitiesAndEquity]];
  return <Card><CardHeader><CardTitle>Balance Sheet</CardTitle></CardHeader><CardContent className="space-y-4">{!data.isBalanced && <Alert variant="warning">Total Asset tidak sama dengan Total Liabilities + Equity. Selisih: {formatRupiah(data.difference)}</Alert>}<Table><TableBody>{rows.map(([label, value]) => <TableRow key={label as string} className={(label as string).startsWith("Total") ? "font-bold" : ""}><TableCell>{label}</TableCell><TableCell className="text-right">{formatRupiah(value as number)}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>;
}
