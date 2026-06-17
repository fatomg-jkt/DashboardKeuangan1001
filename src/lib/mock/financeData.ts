import { calculateGrossMargin, calculateVariance } from "@/lib/formatters";
import type { BalanceSheet, BudgetActual, BudgetInsight, CashFlow, NamedAmount, ProfitLoss, SummaryMetric } from "@/lib/types";

export const profitLoss: ProfitLoss = {
  revenue: 950_000_000,
  costOfGoodsSold: 570_000_000,
  grossProfit: 380_000_000,
  operatingExpenses: 210_000_000,
  netProfit: 170_000_000,
  monthly: [
    { period: "Jan", amount: 105_000_000 },
    { period: "Feb", amount: 118_000_000 },
    { period: "Mar", amount: 132_000_000 },
    { period: "Apr", amount: 126_000_000 },
    { period: "May", amount: 141_000_000 },
    { period: "Jun", amount: 155_000_000 }
  ]
};

export const balanceSheet: BalanceSheet = {
  assets: 1_850_000_000,
  liabilities: 740_000_000,
  equity: 1_110_000_000,
  currentAssets: 690_000_000,
  currentLiabilities: 310_000_000
};

export const cashFlow: CashFlow = {
  operating: 230_000_000,
  investing: -85_000_000,
  financing: 40_000_000,
  netCashFlow: 185_000_000,
  monthly: [
    { period: "Jan", amount: 18_000_000 },
    { period: "Feb", amount: 24_000_000 },
    { period: "Mar", amount: 31_000_000 },
    { period: "Apr", amount: 27_000_000 },
    { period: "May", amount: 39_000_000 },
    { period: "Jun", amount: 46_000_000 }
  ]
};

export const salesByProduct: NamedAmount[] = [
  { name: "Produk A", amount: 245_000_000 },
  { name: "Produk B", amount: 198_000_000 },
  { name: "Produk C", amount: 160_000_000 },
  { name: "Produk D", amount: 122_000_000 },
  { name: "Produk E", amount: 95_000_000 }
];

export const expenseByDepartment: NamedAmount[] = [
  { name: "Operasional", amount: 88_000_000 },
  { name: "Marketing", amount: 62_000_000 },
  { name: "Sales", amount: 54_000_000 },
  { name: "HR", amount: 28_000_000 },
  { name: "IT", amount: 23_000_000 }
];

export const budgetVsActual: BudgetActual[] = [
  { category: "Revenue", budget: 900_000_000, actual: 950_000_000 },
  { category: "COGS", budget: 550_000_000, actual: 570_000_000 },
  { category: "Opex", budget: 225_000_000, actual: 210_000_000 },
  { category: "Net Profit", budget: 125_000_000, actual: 170_000_000 }
];

export const summary: SummaryMetric[] = [
  { label: "Revenue", value: profitLoss.revenue, changePercent: 8.4 },
  { label: "Gross Margin", value: calculateGrossMargin(profitLoss.revenue, profitLoss.grossProfit), changePercent: 2.1 },
  { label: "Net Profit", value: profitLoss.netProfit, changePercent: 11.2 },
  { label: "Cash Flow", value: cashFlow.netCashFlow, changePercent: 5.8 }
];

export const budgetInsights: BudgetInsight[] = budgetVsActual.map((item) => ({
  title: item.category,
  description: `Variance ${calculateVariance(item.actual, item.budget).toFixed(1)}% terhadap budget.`,
  severity: item.actual >= item.budget ? "good" : "warning"
}));
