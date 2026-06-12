import { BalanceSheetTable } from "@/components/dashboard/BalanceSheetTable";
import { getBalanceSheet } from "@/lib/accurate/reports";
import type { QueryFilters } from "@/lib/accurate/types";

export default async function BalanceSheetPage({ searchParams }: { searchParams: QueryFilters }) {
  return <BalanceSheetTable data={await getBalanceSheet(searchParams.endDate)} />;
}
