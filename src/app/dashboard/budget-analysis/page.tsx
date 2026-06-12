import { BudgetInsights } from "@/components/dashboard/BudgetInsights";
import { BudgetVsActualTable } from "@/components/dashboard/BudgetVsActualTable";
import { ExpenseByDepartmentChart } from "@/components/dashboard/ExpenseByDepartmentChart";
import { getBudgetVsActual, getExpenseByDepartment } from "@/lib/accurate/reports";
import { generateBudgetInsights } from "@/lib/calculations";
import type { QueryFilters } from "@/lib/accurate/types";

export default async function BudgetAnalysisPage({ searchParams }: { searchParams: QueryFilters }) {
  const [budget, expenses] = await Promise.all([getBudgetVsActual(searchParams.startDate, searchParams.endDate), getExpenseByDepartment(searchParams.startDate, searchParams.endDate)]);
  return <div className="space-y-6"><BudgetInsights insights={generateBudgetInsights(budget)} /><BudgetVsActualTable data={budget} /><ExpenseByDepartmentChart data={expenses} /></div>;
}
