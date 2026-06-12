import { GrossMarginChart } from "@/components/dashboard/GrossMarginChart";
import { ProfitLossChart } from "@/components/dashboard/ProfitLossChart";
import { getProfitLoss } from "@/lib/accurate/reports";
import type { QueryFilters } from "@/lib/accurate/types";

export default async function ProfitLossPage({ searchParams }: { searchParams: QueryFilters }) {
  const data = await getProfitLoss(searchParams.startDate, searchParams.endDate);
  return <div className="space-y-6"><ProfitLossChart data={data} /><GrossMarginChart trend={data.monthlyTrend} /></div>;
}
