export type InsightType = "warning" | "success" | "info" | "danger";
export type BudgetStatus = "under_budget" | "over_budget" | "on_track";

export type QueryFilters = {
  startDate?: string;
  endDate?: string;
  department?: string;
  product?: string;
  branch?: string;
};

export type PeriodComparison = {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
};

export type FinancialSummary = {
  totalRevenue: number;
  grossProfit: number;
  netProfit: number;
  totalAssets: number;
  cashAndBank: number;
  grossMargin: number;
  netProfitMargin: number;
  operatingExpense: number;
  comparisons?: Record<keyof Omit<FinancialSummary, "comparisons">, PeriodComparison>;
};

export type ProfitLossLine = {
  label: string;
  value: number;
  type: "revenue" | "expense" | "subtotal" | "profit";
};

export type ProfitLossReport = {
  lines: ProfitLossLine[];
  monthlyTrend: Array<{ month: string; revenue: number; cogs: number; grossProfit: number; operatingExpense: number; netProfit: number; grossMargin: number; netProfitMargin: number }>;
  marginAnalysis: Array<{ label: string; value: number }>;
};

export type BalanceSheetReport = {
  currentAssets: number;
  cashAndBank: number;
  accountsReceivable: number;
  inventory: number;
  fixedAssets: number;
  totalAssets: number;
  liabilities: number;
  equity: number;
  totalLiabilitiesAndEquity: number;
  isBalanced: boolean;
  difference: number;
};

export type CashFlowReport = {
  operatingActivities: number;
  investingActivities: number;
  financingActivities: number;
  netChangeInCash: number;
  openingCashBalance: number;
  closingCashBalance: number;
  monthlyMovement: Array<{ month: string; operating: number; investing: number; financing: number; netChange: number; closingCash: number }>;
};

export type SalesByProduct = {
  productName: string;
  revenue: number;
  quantity: number;
  grossProfit: number;
  grossMargin: number;
};

export type ExpenseByDepartment = {
  departmentName: string;
  actual: number;
  budget?: number;
  variance?: number;
  percentageOfTotal: number;
};

export type BudgetVsActualItem = {
  category: string;
  accountName: string;
  department?: string;
  budget: number;
  actual: number;
  variance: number;
  variancePercent: number;
  status: BudgetStatus;
};

export type BudgetVsActualReport = {
  totalBudget: number;
  totalActual: number;
  variance: number;
  variancePercent: number;
  status: BudgetStatus;
  byRevenue: BudgetVsActualItem[];
  byCogs: BudgetVsActualItem[];
  byOperatingExpense: BudgetVsActualItem[];
  byDepartment: BudgetVsActualItem[];
  byAccountCategory: BudgetVsActualItem[];
};

export type BudgetInsight = {
  type: InsightType;
  title: string;
  description: string;
  amount?: number;
  percentage?: number;
  recommendation?: string;
};
