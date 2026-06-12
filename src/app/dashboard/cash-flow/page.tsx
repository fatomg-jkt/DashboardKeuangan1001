import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { CashFlowChart } from "@/components/dashboard/CashFlowChart";
import { CashFlowTable } from "@/components/dashboard/ReportTable";
import { getCashFlow } from "@/lib/accurate/reports";

export default async function CashFlowPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const params = searchParams;
  const data = await getCashFlow(params.startDate, params.endDate, params);
  return <div className="space-y-6"><header><p className="text-sm text-muted-foreground">Arus Kas</p><h1 className="text-3xl font-bold tracking-tight">Cash Flow</h1></header><DashboardFilters /><CashFlowChart data={data} /><CashFlowTable data={data} /></div>;
}
