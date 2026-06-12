import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { BalanceSheetTable } from "@/components/dashboard/BalanceSheetTable";
import { getBalanceSheet } from "@/lib/accurate/reports";

export default async function BalanceSheetPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const params = searchParams;
  const data = await getBalanceSheet(params.endDate, params);
  return <div className="space-y-6"><header><p className="text-sm text-muted-foreground">Posisi Keuangan</p><h1 className="text-3xl font-bold tracking-tight">Balance Sheet</h1></header><DashboardFilters /><BalanceSheetTable data={data} /></div>;
}
