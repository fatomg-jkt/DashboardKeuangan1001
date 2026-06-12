import { grossMargin, safePercent, withBudgetMath } from "@/lib/calculations";
import type { BalanceSheetReport, BudgetVsActualItem, BudgetVsActualReport, CashFlowReport, ExpenseByDepartment, FinancialSummary, ProfitLossReport, SalesByProduct } from "@/lib/accurate/types";

type AccurateRow = Record<string, unknown>;
const num = (value: unknown) => Number(value ?? 0) || 0;
const str = (value: unknown, fallback = "-") => String(value ?? fallback);

export function mapFinancialSummary(raw: AccurateRow): FinancialSummary {
  const totalRevenue = num(raw.totalRevenue ?? raw.revenue);
  const grossProfitValue = num(raw.grossProfit);
  const netProfit = num(raw.netProfit);
  return {
    totalRevenue,
    grossProfit: grossProfitValue,
    netProfit,
    totalAssets: num(raw.totalAssets),
    cashAndBank: num(raw.cashAndBank ?? raw.cashBank),
    grossMargin: num(raw.grossMargin) || grossMargin(grossProfitValue, totalRevenue),
    netProfitMargin: num(raw.netProfitMargin) || safePercent(netProfit, totalRevenue),
    operatingExpense: Math.abs(num(raw.operatingExpense))
  };
}

export function mapProfitLoss(raw: AccurateRow): ProfitLossReport {
  const lines = (Array.isArray(raw.lines) ? raw.lines : []) as AccurateRow[];
  const trend = (Array.isArray(raw.monthlyTrend) ? raw.monthlyTrend : []) as AccurateRow[];
  return {
    lines: lines.map((line) => ({
      label: str(line.label ?? line.name),
      value: num(line.value ?? line.amount),
      type: str(line.type, "subtotal") as ProfitLossReport["lines"][number]["type"]
    })),
    monthlyTrend: trend.map((item) => ({
      month: str(item.month ?? item.period),
      revenue: num(item.revenue),
      cogs: num(item.cogs),
      grossProfit: num(item.grossProfit),
      operatingExpense: num(item.operatingExpense),
      netProfit: num(item.netProfit),
      grossMargin: num(item.grossMargin) || grossMargin(num(item.grossProfit), num(item.revenue)),
      netProfitMargin: num(item.netProfitMargin) || safePercent(num(item.netProfit), num(item.revenue))
    })),
    marginAnalysis: (Array.isArray(raw.marginAnalysis) ? raw.marginAnalysis : []).map((item) => ({
      label: str((item as AccurateRow).label),
      value: num((item as AccurateRow).value)
    }))
  };
}

export function mapBalanceSheet(raw: AccurateRow): BalanceSheetReport {
  const totalAssets = num(raw.totalAssets);
  const totalLiabilitiesAndEquity = num(raw.totalLiabilitiesAndEquity) || num(raw.liabilities) + num(raw.equity);
  const difference = totalAssets - totalLiabilitiesAndEquity;
  return {
    currentAssets: num(raw.currentAssets),
    cashAndBank: num(raw.cashAndBank),
    accountsReceivable: num(raw.accountsReceivable),
    inventory: num(raw.inventory),
    fixedAssets: num(raw.fixedAssets),
    totalAssets,
    liabilities: num(raw.liabilities),
    equity: num(raw.equity),
    totalLiabilitiesAndEquity,
    isBalanced: Math.abs(difference) < 1,
    difference
  };
}

export function mapCashFlow(raw: AccurateRow): CashFlowReport {
  return {
    operatingActivities: num(raw.operatingActivities),
    investingActivities: num(raw.investingActivities),
    financingActivities: num(raw.financingActivities),
    netChangeInCash: num(raw.netChangeInCash),
    openingCashBalance: num(raw.openingCashBalance),
    closingCashBalance: num(raw.closingCashBalance),
    monthlyMovement: ((Array.isArray(raw.monthlyMovement) ? raw.monthlyMovement : []) as AccurateRow[]).map((item) => ({
      month: str(item.month ?? item.period),
      operating: num(item.operating),
      investing: num(item.investing),
      financing: num(item.financing),
      netChange: num(item.netChange),
      closingCash: num(item.closingCash)
    }))
  };
}

export function mapSalesByProduct(raw: unknown): SalesByProduct[] {
  return ((Array.isArray(raw) ? raw : []) as AccurateRow[]).map((item) => {
    const revenue = num(item.revenue ?? item.salesAmount);
    const grossProfitValue = num(item.grossProfit);
    return {
      productName: str(item.productName ?? item.itemName),
      revenue,
      quantity: num(item.quantity ?? item.qty),
      grossProfit: grossProfitValue,
      grossMargin: num(item.grossMargin) || grossMargin(grossProfitValue, revenue)
    };
  });
}

export function mapExpenseByDepartment(raw: unknown): ExpenseByDepartment[] {
  const rows = (Array.isArray(raw) ? raw : []) as AccurateRow[];
  const total = rows.reduce((sum, row) => sum + Math.abs(num(row.actual ?? row.expense)), 0);
  return rows.map((item) => ({
    departmentName: str(item.departmentName ?? item.department),
    actual: Math.abs(num(item.actual ?? item.expense)),
    budget: item.budget === undefined ? undefined : num(item.budget),
    variance: item.variance === undefined ? undefined : num(item.variance),
    percentageOfTotal: num(item.percentageOfTotal) || safePercent(Math.abs(num(item.actual ?? item.expense)), total)
  }));
}

function mapBudgetItems(raw: unknown): BudgetVsActualItem[] {
  return ((Array.isArray(raw) ? raw : []) as AccurateRow[]).map((item) => withBudgetMath({
    category: str(item.category),
    accountName: str(item.accountName ?? item.account),
    department: item.department ? str(item.department) : undefined,
    budget: num(item.budget),
    actual: num(item.actual)
  }));
}

export function mapBudgetVsActual(raw: AccurateRow): BudgetVsActualReport {
  const byRevenue = mapBudgetItems(raw.byRevenue);
  const byCogs = mapBudgetItems(raw.byCogs);
  const byOperatingExpense = mapBudgetItems(raw.byOperatingExpense);
  const byDepartment = mapBudgetItems(raw.byDepartment);
  const byAccountCategory = mapBudgetItems(raw.byAccountCategory);
  const all = [...byRevenue, ...byCogs, ...byOperatingExpense];
  const totalBudget = num(raw.totalBudget) || all.reduce((sum, item) => sum + item.budget, 0);
  const totalActual = num(raw.totalActual) || all.reduce((sum, item) => sum + item.actual, 0);
  const total = withBudgetMath({ category: "overall", accountName: "Total", budget: totalBudget, actual: totalActual });
  return { totalBudget, totalActual, variance: total.variance, variancePercent: total.variancePercent, status: total.status, byRevenue, byCogs, byOperatingExpense, byDepartment, byAccountCategory };
}
