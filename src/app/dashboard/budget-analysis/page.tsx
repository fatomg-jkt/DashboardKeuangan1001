import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { BudgetInsights } from "@/components/dashboard/BudgetInsights";
import { BudgetVsActualTable } from "@/components/dashboard/BudgetVsActualTable";
import { ExpenseByDepartmentChart } from "@/components/dashboard/ExpenseByDepartmentChart";
import { getBudgetInsights, getBudgetVsActual, getExpenseByDepartment } from "@/lib/accurate/reports";

export default async function BudgetAnalysisPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const params = searchParams;
  const [budget, insights, departments] = await Promise.all([getBudgetVsActual(params.startDate, params.endDate, params), getBudgetInsights(params.startDate, params.endDate, params), getExpenseByDepartment(params.startDate, params.endDate, params)]);
  return <div className="space-y-6"><header><p className="text-sm text-muted-foreground">Budget Control</p><h1 className="text-3xl font-bold tracking-tight">Budget Analysis</h1></header><DashboardFilters /><BudgetInsights insights={insights} /><ExpenseByDepartmentChart data={departments} /><BudgetVsActualTable data={budget} /></div>;
}
