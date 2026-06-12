import type { BalanceSheetReport, BudgetVsActualItem, CashFlowReport, ExpenseByDepartment, FinancialSummary, ProfitLossReport, SalesByProduct } from "@/lib/accurate/types";
import { calculateBudgetStatus, calculateVariance, safePercent } from "@/lib/calculations";

const numberFrom = (value: unknown) => Number(value ?? 0);

export function mapFinancialSummary(raw: any): FinancialSummary {
  const totalRevenue = numberFrom(raw?.totalRevenue ?? raw?.revenue ?? raw?.data?.revenue);
  const grossProfit = numberFrom(raw?.grossProfit ?? raw?.data?.grossProfit);
  const netProfit = numberFrom(raw?.netProfit ?? raw?.data?.netProfit);
  const operatingExpense = numberFrom(raw?.operatingExpense ?? raw?.data?.operatingExpense);
  return {
    totalRevenue,
    grossProfit,
    netProfit,
    totalAssets: numberFrom(raw?.totalAssets ?? raw?.data?.totalAssets),
    cashAndBank: numberFrom(raw?.cashAndBank ?? raw?.data?.cashAndBank),
    grossMargin: numberFrom(raw?.grossMargin) || safePercent(grossProfit, totalRevenue),
    netProfitMargin: numberFrom(raw?.netProfitMargin) || safePercent(netProfit, totalRevenue),
    operatingExpense
  };
}

export function mapProfitLoss(raw: any): ProfitLossReport {
  if (raw?.rows && raw?.monthlyTrend) return raw as ProfitLossReport;
  const summary = mapFinancialSummary(raw);
  const cogs = summary.totalRevenue - summary.grossProfit;
  return {
    rows: [
      { label: "Pendapatan", amount: summary.totalRevenue, type: "revenue" },
      { label: "Harga Pokok Penjualan / COGS", amount: -Math.abs(cogs), type: "cogs" },
      { label: "Laba Kotor", amount: summary.grossProfit, type: "gross_profit" },
      { label: "Operating Expense", amount: -Math.abs(summary.operatingExpense), type: "expense" },
      { label: "Laba Operasional", amount: summary.grossProfit - summary.operatingExpense, type: "operating_profit" },
      { label: "Laba Bersih", amount: summary.netProfit, type: "net_profit" }
    ],
    monthlyTrend: raw?.monthlyTrend ?? [],
    marginAnalysis: { grossMargin: summary.grossMargin, netProfitMargin: summary.netProfitMargin, operatingMargin: safePercent(summary.grossProfit - summary.operatingExpense, summary.totalRevenue) }
  };
}

export function mapBalanceSheet(raw: any): BalanceSheetReport {
  const currentAssets = raw?.currentAssets ?? {};
  const fixedAssets = numberFrom(raw?.fixedAssets);
  const totalAssets = numberFrom(raw?.totalAssets) || numberFrom(currentAssets.cashAndBank) + numberFrom(currentAssets.accountsReceivable) + numberFrom(currentAssets.inventory) + numberFrom(currentAssets.otherCurrentAssets) + fixedAssets;
  const liabilities = numberFrom(raw?.liabilities);
  const equity = numberFrom(raw?.equity);
  const totalLiabilitiesAndEquity = numberFrom(raw?.totalLiabilitiesAndEquity) || liabilities + equity;
  return { currentAssets: { cashAndBank: numberFrom(currentAssets.cashAndBank), accountsReceivable: numberFrom(currentAssets.accountsReceivable), inventory: numberFrom(currentAssets.inventory), otherCurrentAssets: numberFrom(currentAssets.otherCurrentAssets) }, fixedAssets, totalAssets, liabilities, equity, totalLiabilitiesAndEquity, isBalanced: Math.abs(totalAssets - totalLiabilitiesAndEquity) < 1, difference: totalAssets - totalLiabilitiesAndEquity };
}

export function mapCashFlow(raw: any): CashFlowReport {
  const operatingActivities = numberFrom(raw?.operatingActivities);
  const investingActivities = numberFrom(raw?.investingActivities);
  const financingActivities = numberFrom(raw?.financingActivities);
  const netChangeInCash = numberFrom(raw?.netChangeInCash) || operatingActivities + investingActivities + financingActivities;
  const openingCashBalance = numberFrom(raw?.openingCashBalance);
  return { operatingActivities, investingActivities, financingActivities, netChangeInCash, openingCashBalance, closingCashBalance: numberFrom(raw?.closingCashBalance) || openingCashBalance + netChangeInCash, monthlyMovement: raw?.monthlyMovement ?? [] };
}

export function mapSalesByProduct(raw: any): SalesByProduct[] {
  const rows = Array.isArray(raw) ? raw : raw?.data ?? raw?.rows ?? [];
  return rows.map((row: any) => {
    const revenue = numberFrom(row.revenue ?? row.salesAmount);
    const grossProfit = numberFrom(row.grossProfit);
    return { productName: String(row.productName ?? row.name ?? "Produk"), revenue, quantity: numberFrom(row.quantity ?? row.qty), grossProfit, grossMargin: numberFrom(row.grossMargin) || safePercent(grossProfit, revenue) };
  });
}

export function mapExpenseByDepartment(raw: any): ExpenseByDepartment[] {
  const rows = Array.isArray(raw) ? raw : raw?.data ?? raw?.rows ?? [];
  const total = rows.reduce((sum: number, row: any) => sum + numberFrom(row.actual ?? row.expense), 0);
  return rows.map((row: any) => ({ departmentName: String(row.departmentName ?? row.department ?? "Department"), actual: numberFrom(row.actual ?? row.expense), budget: row.budget === undefined ? undefined : numberFrom(row.budget), variance: row.budget === undefined ? undefined : numberFrom(row.actual ?? row.expense) - numberFrom(row.budget), percentageOfTotal: numberFrom(row.percentageOfTotal) || safePercent(numberFrom(row.actual ?? row.expense), total) }));
}

export function mapBudgetVsActual(raw: any): BudgetVsActualItem[] {
  const rows = Array.isArray(raw) ? raw : raw?.data ?? raw?.rows ?? [];
  return rows.map((row: any) => {
    const budget = numberFrom(row.budget);
    const actual = numberFrom(row.actual);
    const variance = numberFrom(row.variance) || calculateVariance(actual, budget);
    return { category: String(row.category ?? "Account Category"), accountName: String(row.accountName ?? row.account ?? "Account"), department: row.department, budget, actual, variance, variancePercent: numberFrom(row.variancePercent) || safePercent(variance, budget), status: row.status ?? calculateBudgetStatus({ category: String(row.category ?? ""), budget, actual }) };
  });
}
