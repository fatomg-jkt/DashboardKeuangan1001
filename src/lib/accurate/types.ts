export type InsightType = "warning" | "success" | "info" | "danger";
export type BudgetStatus = "under_budget" | "over_budget" | "on_track";

export interface QueryFilters {
  startDate?: string;
  endDate?: string;
  department?: string;
  product?: string;
  branch?: string;
}

export interface PeriodComparison<T> {
  current: T;
  previous: T;
  changes: Record<string, number>;
}

export interface FinancialSummary {
  totalRevenue: number;
  grossProfit: number;
  netProfit: number;
  totalAssets: number;
  cashAndBank: number;
  grossMargin: number;
  netProfitMargin: number;
  operatingExpense: number;
}

export interface ProfitLossRow {
  label: string;
  amount: number;
  type: "revenue" | "cogs" | "gross_profit" | "expense" | "operating_profit" | "other" | "net_profit";
  level?: number;
}

export interface MonthlyTrend {
  month: string;
  revenue?: number;
  cogs?: number;
  grossProfit?: number;
  operatingExpense?: number;
  netProfit?: number;
  cashIn?: number;
  cashOut?: number;
  netCash?: number;
  grossMargin?: number;
}

export interface ProfitLossReport {
  rows: ProfitLossRow[];
  monthlyTrend: MonthlyTrend[];
  marginAnalysis: { grossMargin: number; netProfitMargin: number; operatingMargin: number };
}

export interface BalanceSheetReport {
  currentAssets: { cashAndBank: number; accountsReceivable: number; inventory: number; otherCurrentAssets: number };
  fixedAssets: number;
  totalAssets: number;
  liabilities: number;
  equity: number;
  totalLiabilitiesAndEquity: number;
  isBalanced: boolean;
  difference: number;
}

export interface CashFlowReport {
  operatingActivities: number;
  investingActivities: number;
  financingActivities: number;
  netChangeInCash: number;
  openingCashBalance: number;
  closingCashBalance: number;
  monthlyMovement: MonthlyTrend[];
}

export interface SalesByProduct {
  productName: string;
  revenue: number;
  quantity: number;
  grossProfit: number;
  grossMargin: number;
}

export interface ExpenseByDepartment {
  departmentName: string;
  actual: number;
  budget?: number;
  variance?: number;
  percentageOfTotal: number;
}

export interface BudgetVsActualItem {
  category: string;
  accountName: string;
  department?: string;
  budget: number;
  actual: number;
  variance: number;
  variancePercent: number;
  status: BudgetStatus;
}

export interface BudgetInsight {
  type: InsightType;
  title: string;
  description: string;
  amount?: number;
  percentage?: number;
  recommendation?: string;
}

export interface AccurateRequestOptions {
  path: string;
  query?: Record<string, string | number | undefined>;
}
