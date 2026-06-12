import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { GrossMarginChart } from "@/components/dashboard/GrossMarginChart";
import { ProfitLossChart } from "@/components/dashboard/ProfitLossChart";
import { ProfitLossTable } from "@/components/dashboard/ReportTable";
import { getProfitLoss } from "@/lib/accurate/reports";

export default async function ProfitLossPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const params = searchParams;
  const data = await getProfitLoss(params.startDate, params.endDate, params);
  return <div className="space-y-6"><header><p className="text-sm text-muted-foreground">Laporan Keuangan</p><h1 className="text-3xl font-bold tracking-tight">Profit & Loss</h1></header><DashboardFilters /><ProfitLossChart data={data} /><GrossMarginChart data={data} /><ProfitLossTable data={data} /></div>;
}
