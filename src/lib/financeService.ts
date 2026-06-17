import { fetchAccurateData, type FinanceEndpoint } from "@/lib/accurate/client";
import { balanceSheet, budgetInsights, budgetVsActual, cashFlow, expenseByDepartment, profitLoss, salesByProduct, summary } from "@/lib/mock/financeData";

const mockByEndpoint = {
  summary,
  "profit-loss": profitLoss,
  "balance-sheet": balanceSheet,
  "cash-flow": cashFlow,
  "sales-by-product": salesByProduct,
  "expense-by-department": expenseByDepartment,
  "budget-vs-actual": budgetVsActual,
  "budget-insights": budgetInsights
};

export async function getFinanceData<T extends FinanceEndpoint>(endpoint: T): Promise<(typeof mockByEndpoint)[T]> {
  const data = await fetchAccurateData<(typeof mockByEndpoint)[T]>(endpoint);
  return data ?? mockByEndpoint[endpoint];
}
