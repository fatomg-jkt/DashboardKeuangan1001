export type SummaryMetric = {
  label: string;
  value: number;
  changePercent: number;
};

export type PeriodAmount = {
  period: string;
  amount: number;
};

export type ProfitLoss = {
  revenue: number;
  costOfGoodsSold: number;
  grossProfit: number;
  operatingExpenses: number;
  netProfit: number;
  monthly: PeriodAmount[];
};

export type BalanceSheet = {
  assets: number;
  liabilities: number;
  equity: number;
  currentAssets: number;
  currentLiabilities: number;
};

export type CashFlow = {
  operating: number;
  investing: number;
  financing: number;
  netCashFlow: number;
  monthly: PeriodAmount[];
};

export type NamedAmount = {
  name: string;
  amount: number;
};

export type BudgetActual = {
  category: string;
  budget: number;
  actual: number;
};

export type BudgetInsight = {
  title: string;
  description: string;
  severity: "good" | "warning" | "danger";
};
