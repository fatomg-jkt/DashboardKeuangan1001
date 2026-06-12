import { CashFlowChart } from "@/components/dashboard/CashFlowChart";
import { getCashFlow } from "@/lib/accurate/reports";
import type { QueryFilters } from "@/lib/accurate/types";

export default async function CashFlowPage({ searchParams }: { searchParams: QueryFilters }) {
  return <CashFlowChart data={await getCashFlow(searchParams.startDate, searchParams.endDate)} />;
}
