import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { FinancialSummaryCards } from "@/components/dashboard/FinancialSummaryCards";
import { ProfitLossChart } from "@/components/dashboard/ProfitLossChart";
import { GrossMarginChart } from "@/components/dashboard/GrossMarginChart";
import { BalanceSheetTable } from "@/components/dashboard/BalanceSheetTable";
import { CashFlowChart } from "@/components/dashboard/CashFlowChart";
import { TopProductsChart } from "@/components/dashboard/TopProductsChart";
import { ExpenseByDepartmentChart } from "@/components/dashboard/ExpenseByDepartmentChart";
import { BudgetVsActualTable } from "@/components/dashboard/BudgetVsActualTable";
import { BudgetInsights } from "@/components/dashboard/BudgetInsights";
import { ProfitLossTable, CashFlowTable } from "@/components/dashboard/ReportTable";
import { getBalanceSheet, getBudgetInsights, getBudgetVsActual, getCashFlow, getExpenseByDepartment, getProfitLoss, getSalesByProduct } from "@/lib/accurate/reports";

export default async function DashboardPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const params = searchParams;
  const [profitLoss, balanceSheet, cashFlow, products, departments, budget, insights] = await Promise.all([
    getProfitLoss(params.startDate, params.endDate, params),
    getBalanceSheet(params.endDate, params),
    getCashFlow(params.startDate, params.endDate, params),
    getSalesByProduct(params.startDate, params.endDate, params),
    getExpenseByDepartment(params.startDate, params.endDate, params),
    getBudgetVsActual(params.startDate, params.endDate, params),
    getBudgetInsights(params.startDate, params.endDate, params)
  ]);
  return <div className="space-y-6"><header><p className="text-sm text-muted-foreground">Manajemen Keuangan</p><h1 className="text-3xl font-bold tracking-tight">Dashboard Keuangan</h1></header><DashboardFilters /><FinancialSummaryCards /><ProfitLossChart data={profitLoss} /><GrossMarginChart data={profitLoss} /><TopProductsChart data={products} /><ExpenseByDepartmentChart data={departments} /><div className="grid gap-4 xl:grid-cols-2"><BalanceSheetTable data={balanceSheet} /><CashFlowTable data={cashFlow} /></div><CashFlowChart data={cashFlow} /><ProfitLossTable data={profitLoss} /><BudgetVsActualTable data={budget} /><BudgetInsights insights={insights} /></div>;
}
