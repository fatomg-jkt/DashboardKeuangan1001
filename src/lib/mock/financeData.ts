import type { BalanceSheetReport, BudgetVsActualItem, CashFlowReport, ExpenseByDepartment, FinancialSummary, PeriodComparison, ProfitLossReport, SalesByProduct } from "@/lib/accurate/types";
import { calculateBudgetStatus, calculateVariance, safePercent } from "@/lib/calculations";

export const financialSummary: PeriodComparison<FinancialSummary> = {
  current: {
    totalRevenue: 4_850_000_000,
    grossProfit: 2_037_000_000,
    netProfit: 842_000_000,
    totalAssets: 12_875_000_000,
    cashAndBank: 2_260_000_000,
    grossMargin: 42,
    netProfitMargin: 17.36,
    operatingExpense: 1_050_000_000
  },
  previous: {
    totalRevenue: 4_320_000_000,
    grossProfit: 1_728_000_000,
    netProfit: 610_000_000,
    totalAssets: 12_100_000_000,
    cashAndBank: 1_880_000_000,
    grossMargin: 40,
    netProfitMargin: 14.12,
    operatingExpense: 980_000_000
  },
  changes: {}
};
financialSummary.changes = buildChanges(financialSummary.current, financialSummary.previous);

export const profitLoss: ProfitLossReport = {
  rows: [
    { label: "Pendapatan", amount: 4_850_000_000, type: "revenue" },
    { label: "Harga Pokok Penjualan / COGS", amount: -2_813_000_000, type: "cogs" },
    { label: "Laba Kotor", amount: 2_037_000_000, type: "gross_profit" },
    { label: "Operating Expense", amount: -1_050_000_000, type: "expense" },
    { label: "Laba Operasional", amount: 987_000_000, type: "operating_profit" },
    { label: "Pendapatan/Beban Lain-lain", amount: -145_000_000, type: "other" },
    { label: "Laba Bersih", amount: 842_000_000, type: "net_profit" }
  ],
  monthlyTrend: [
    { month: "Jan", revenue: 3_750_000_000, cogs: 2_250_000_000, grossProfit: 1_500_000_000, operatingExpense: 910_000_000, netProfit: 460_000_000, grossMargin: 40 },
    { month: "Feb", revenue: 3_980_000_000, cogs: 2_310_000_000, grossProfit: 1_670_000_000, operatingExpense: 935_000_000, netProfit: 538_000_000, grossMargin: 42 },
    { month: "Mar", revenue: 4_120_000_000, cogs: 2_390_000_000, grossProfit: 1_730_000_000, operatingExpense: 960_000_000, netProfit: 580_000_000, grossMargin: 42 },
    { month: "Apr", revenue: 4_440_000_000, cogs: 2_575_000_000, grossProfit: 1_865_000_000, operatingExpense: 995_000_000, netProfit: 645_000_000, grossMargin: 42 },
    { month: "Mei", revenue: 4_620_000_000, cogs: 2_680_000_000, grossProfit: 1_940_000_000, operatingExpense: 1_015_000_000, netProfit: 710_000_000, grossMargin: 42 },
    { month: "Jun", revenue: 4_850_000_000, cogs: 2_813_000_000, grossProfit: 2_037_000_000, operatingExpense: 1_050_000_000, netProfit: 842_000_000, grossMargin: 42 }
  ],
  marginAnalysis: { grossMargin: 42, netProfitMargin: 17.36, operatingMargin: 20.35 }
};

export const balanceSheet: BalanceSheetReport = {
  currentAssets: { cashAndBank: 2_260_000_000, accountsReceivable: 3_150_000_000, inventory: 2_480_000_000, otherCurrentAssets: 610_000_000 },
  fixedAssets: 4_375_000_000,
  totalAssets: 12_875_000_000,
  liabilities: 5_125_000_000,
  equity: 7_750_000_000,
  totalLiabilitiesAndEquity: 12_875_000_000,
  isBalanced: true,
  difference: 0
};

export const cashFlow: CashFlowReport = {
  operatingActivities: 1_185_000_000,
  investingActivities: -420_000_000,
  financingActivities: -385_000_000,
  netChangeInCash: 380_000_000,
  openingCashBalance: 1_880_000_000,
  closingCashBalance: 2_260_000_000,
  monthlyMovement: [
    { month: "Jan", cashIn: 3_900_000_000, cashOut: 3_720_000_000, netCash: 180_000_000 },
    { month: "Feb", cashIn: 4_040_000_000, cashOut: 3_860_000_000, netCash: 180_000_000 },
    { month: "Mar", cashIn: 4_175_000_000, cashOut: 3_980_000_000, netCash: 195_000_000 },
    { month: "Apr", cashIn: 4_330_000_000, cashOut: 4_120_000_000, netCash: 210_000_000 },
    { month: "Mei", cashIn: 4_510_000_000, cashOut: 4_260_000_000, netCash: 250_000_000 },
    { month: "Jun", cashIn: 4_810_000_000, cashOut: 4_430_000_000, netCash: 380_000_000 }
  ]
};

export const salesByProduct: SalesByProduct[] = [
  { productName: "Paket Enterprise", revenue: 1_320_000_000, quantity: 42, grossProfit: 686_000_000, grossMargin: 52 },
  { productName: "Produk A Retail", revenue: 1_050_000_000, quantity: 2_900, grossProfit: 409_500_000, grossMargin: 39 },
  { productName: "Produk B Premium", revenue: 875_000_000, quantity: 1_650, grossProfit: 393_750_000, grossMargin: 45 },
  { productName: "Service Maintenance", revenue: 720_000_000, quantity: 128, grossProfit: 504_000_000, grossMargin: 70 },
  { productName: "Produk C Distributor", revenue: 590_000_000, quantity: 5_400, grossProfit: 177_000_000, grossMargin: 30 }
];

export const budgetVsActual: BudgetVsActualItem[] = [
  item("Pendapatan", "Penjualan Produk A", "Sales", 1_200_000_000, 1_050_000_000),
  item("Pendapatan", "Subscription Enterprise", "Sales", 1_150_000_000, 1_320_000_000),
  item("COGS", "Pembelian Persediaan", "Operations", 2_600_000_000, 2_813_000_000),
  item("Operating Expense", "Advertising Expense", "Marketing", 140_000_000, 165_000_000),
  item("Operating Expense", "Gaji dan Benefit", "HR", 420_000_000, 405_000_000),
  item("Operating Expense", "Cloud Infrastructure", "IT", 160_000_000, 188_000_000),
  item("Department", "Event & Activation", "Marketing", 120_000_000, 138_000_000),
  item("Account Category", "Travel Expense", "Sales", 85_000_000, 72_000_000)
];

export const expenseByDepartment: ExpenseByDepartment[] = buildExpenseDepartments();

function item(category: string, accountName: string, department: string, budget: number, actual: number): BudgetVsActualItem {
  const variance = calculateVariance(actual, budget);
  return { category, accountName, department, budget, actual, variance, variancePercent: safePercent(variance, budget), status: calculateBudgetStatus({ category, budget, actual }) };
}

function buildExpenseDepartments(): ExpenseByDepartment[] {
  const rows = [
    { departmentName: "Marketing", actual: 303_000_000, budget: 260_000_000 },
    { departmentName: "Sales", actual: 172_000_000, budget: 185_000_000 },
    { departmentName: "Operations", actual: 242_000_000, budget: 230_000_000 },
    { departmentName: "IT", actual: 188_000_000, budget: 160_000_000 },
    { departmentName: "HR", actual: 145_000_000, budget: 155_000_000 }
  ];
  const total = rows.reduce((sum, row) => sum + row.actual, 0);
  return rows.map((row) => ({ ...row, variance: row.actual - row.budget, percentageOfTotal: safePercent(row.actual, total) }));
}

function buildChanges(current: FinancialSummary, previous: FinancialSummary) {
  return Object.fromEntries(Object.entries(current).map(([key, value]) => [key, safePercent(value - previous[key as keyof FinancialSummary], previous[key as keyof FinancialSummary])])) as Record<string, number>;
}
