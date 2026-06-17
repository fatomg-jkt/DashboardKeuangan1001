import FinanceDashboard from "@/components/FinanceDashboard";
import { getFinanceData } from "@/lib/financeService";

export default async function Home() {
  const [summary, profitLoss, balanceSheet, cashFlow, salesByProduct, expenseByDepartment, budgetVsActual, budgetInsights] = await Promise.all([
    getFinanceData("summary"),
    getFinanceData("profit-loss"),
    getFinanceData("balance-sheet"),
    getFinanceData("cash-flow"),
    getFinanceData("sales-by-product"),
    getFinanceData("expense-by-department"),
    getFinanceData("budget-vs-actual"),
    getFinanceData("budget-insights")
  ]);

  return (
    <main>
      <h1>Dashboard Keuangan</h1>
      <p>Mode mock aktif secara default agar build dan deployment Vercel tetap aman saat kredensial Accurate belum tersedia.</p>
      <FinanceDashboard
        summary={summary}
        profitLoss={profitLoss}
        balanceSheet={balanceSheet}
        cashFlow={cashFlow}
        salesByProduct={salesByProduct}
        expenseByDepartment={expenseByDepartment}
        budgetVsActual={budgetVsActual}
        budgetInsights={budgetInsights}
      />
    </main>
  );
}
