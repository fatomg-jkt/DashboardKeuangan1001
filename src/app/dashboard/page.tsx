import { FinancialSummaryCards } from "@/components/dashboard/FinancialSummaryCards";
import { ProfitLossChart } from "@/components/dashboard/ProfitLossChart";
import { BalanceSheetTable } from "@/components/dashboard/BalanceSheetTable";
import { CashFlowChart } from "@/components/dashboard/CashFlowChart";
import { GrossMarginChart } from "@/components/dashboard/GrossMarginChart";
import { TopProductsChart } from "@/components/dashboard/TopProductsChart";
import { ExpenseByDepartmentChart } from "@/components/dashboard/ExpenseByDepartmentChart";
import { BudgetVsActualTable } from "@/components/dashboard/BudgetVsActualTable";
import { BudgetInsights } from "@/components/dashboard/BudgetInsights";
import { getDashboardBundle } from "@/lib/accurate/reports";
import { generateBudgetInsights } from "@/lib/calculations";
import type { QueryFilters } from "@/lib/accurate/types";

export default async function DashboardPage({ searchParams }: { searchParams: QueryFilters }) {
  const data = await getDashboardBundle(searchParams);
  const insights = generateBudgetInsights(data.budgetVsActual);
  return <div className="space-y-6"><FinancialSummaryCards data={data.summary} /><div className="grid gap-6 xl:grid-cols-2"><ProfitLossChart data={data.profitLoss} /><BalanceSheetTable data={data.balanceSheet} /></div><GrossMarginChart trend={data.profitLoss.monthlyTrend} warning={data.grossMarginWarning} /><CashFlowChart data={data.cashFlow} /><div className="grid gap-6 xl:grid-cols-2"><TopProductsChart data={data.salesByProduct} /><ExpenseByDepartmentChart data={data.expenseByDepartment} /></div><BudgetVsActualTable data={data.budgetVsActual} /><BudgetInsights insights={insights} /></div>;
}
