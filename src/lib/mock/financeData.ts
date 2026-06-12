import { grossMargin, safePercent, withBudgetMath } from "@/lib/calculations";
import type { BalanceSheetReport, BudgetVsActualReport, CashFlowReport, ExpenseByDepartment, FinancialSummary, ProfitLossReport, SalesByProduct } from "@/lib/accurate/types";

export const mockProfitLoss: ProfitLossReport = {
  lines: [
    { label: "Pendapatan", value: 2_850_000_000, type: "revenue" },
    { label: "Harga Pokok Penjualan / COGS", value: -1_520_000_000, type: "expense" },
    { label: "Laba Kotor", value: 1_330_000_000, type: "profit" },
    { label: "Operating Expense", value: -685_000_000, type: "expense" },
    { label: "Laba Operasional", value: 645_000_000, type: "profit" },
    { label: "Pendapatan/Beban Lain-lain", value: -45_000_000, type: "subtotal" },
    { label: "Laba Bersih", value: 600_000_000, type: "profit" }
  ],
  monthlyTrend: [
    { month: "Jan", revenue: 390_000_000, cogs: 218_000_000, grossProfit: 172_000_000, operatingExpense: 95_000_000, netProfit: 70_000_000, grossMargin: 44.1, netProfitMargin: 17.9 },
    { month: "Feb", revenue: 425_000_000, cogs: 229_000_000, grossProfit: 196_000_000, operatingExpense: 101_000_000, netProfit: 86_000_000, grossMargin: 46.1, netProfitMargin: 20.2 },
    { month: "Mar", revenue: 468_000_000, cogs: 246_000_000, grossProfit: 222_000_000, operatingExpense: 112_000_000, netProfit: 101_000_000, grossMargin: 47.4, netProfitMargin: 21.6 },
    { month: "Apr", revenue: 502_000_000, cogs: 263_000_000, grossProfit: 239_000_000, operatingExpense: 120_000_000, netProfit: 110_000_000, grossMargin: 47.6, netProfitMargin: 21.9 },
    { month: "Mei", revenue: 515_000_000, cogs: 283_000_000, grossProfit: 232_000_000, operatingExpense: 128_000_000, netProfit: 95_000_000, grossMargin: 45.0, netProfitMargin: 18.4 },
    { month: "Jun", revenue: 550_000_000, cogs: 281_000_000, grossProfit: 269_000_000, operatingExpense: 129_000_000, netProfit: 138_000_000, grossMargin: 48.9, netProfitMargin: 25.1 }
  ],
  marginAnalysis: [
    { label: "Gross Margin", value: 46.7 },
    { label: "Operating Margin", value: 22.6 },
    { label: "Net Profit Margin", value: 21.1 }
  ]
};

export const mockBalanceSheet: BalanceSheetReport = {
  currentAssets: 4_125_000_000,
  cashAndBank: 1_240_000_000,
  accountsReceivable: 1_050_000_000,
  inventory: 1_835_000_000,
  fixedAssets: 2_375_000_000,
  totalAssets: 6_500_000_000,
  liabilities: 2_150_000_000,
  equity: 4_350_000_000,
  totalLiabilitiesAndEquity: 6_500_000_000,
  isBalanced: true,
  difference: 0
};

export const mockCashFlow: CashFlowReport = {
  operatingActivities: 720_000_000,
  investingActivities: -210_000_000,
  financingActivities: -95_000_000,
  netChangeInCash: 415_000_000,
  openingCashBalance: 825_000_000,
  closingCashBalance: 1_240_000_000,
  monthlyMovement: [
    { month: "Jan", operating: 88_000_000, investing: -35_000_000, financing: -10_000_000, netChange: 43_000_000, closingCash: 868_000_000 },
    { month: "Feb", operating: 105_000_000, investing: -18_000_000, financing: -12_000_000, netChange: 75_000_000, closingCash: 943_000_000 },
    { month: "Mar", operating: 116_000_000, investing: -42_000_000, financing: -14_000_000, netChange: 60_000_000, closingCash: 1_003_000_000 },
    { month: "Apr", operating: 127_000_000, investing: -60_000_000, financing: -18_000_000, netChange: 49_000_000, closingCash: 1_052_000_000 },
    { month: "Mei", operating: 134_000_000, investing: -25_000_000, financing: -20_000_000, netChange: 89_000_000, closingCash: 1_141_000_000 },
    { month: "Jun", operating: 150_000_000, investing: -30_000_000, financing: -21_000_000, netChange: 99_000_000, closingCash: 1_240_000_000 }
  ]
};

export const mockSalesByProduct: SalesByProduct[] = [
  { productName: "Paket Enterprise ERP", revenue: 820_000_000, quantity: 28, grossProfit: 410_000_000, grossMargin: 50.0 },
  { productName: "Subscription Pro", revenue: 640_000_000, quantity: 420, grossProfit: 345_000_000, grossMargin: 53.9 },
  { productName: "Implementasi Accurate", revenue: 510_000_000, quantity: 34, grossProfit: 235_000_000, grossMargin: 46.1 },
  { productName: "Training Finance", revenue: 265_000_000, quantity: 76, grossProfit: 155_000_000, grossMargin: 58.5 },
  { productName: "Support Premium", revenue: 215_000_000, quantity: 58, grossProfit: 118_000_000, grossMargin: 54.9 }
];

export const mockExpenseByDepartment: ExpenseByDepartment[] = [
  { departmentName: "Marketing", actual: 185_000_000, budget: 160_000_000, variance: 25_000_000, percentageOfTotal: 27.0 },
  { departmentName: "Sales", actual: 175_000_000, budget: 190_000_000, variance: -15_000_000, percentageOfTotal: 25.5 },
  { departmentName: "Operations", actual: 145_000_000, budget: 150_000_000, variance: -5_000_000, percentageOfTotal: 21.2 },
  { departmentName: "Technology", actual: 112_000_000, budget: 105_000_000, variance: 7_000_000, percentageOfTotal: 16.4 },
  { departmentName: "Finance & Admin", actual: 68_000_000, budget: 75_000_000, variance: -7_000_000, percentageOfTotal: 9.9 }
];

const revenue = [
  withBudgetMath({ category: "revenue", accountName: "Software Subscription", budget: 1_650_000_000, actual: 1_585_000_000 }),
  withBudgetMath({ category: "revenue", accountName: "Implementation Service", budget: 560_000_000, actual: 610_000_000 }),
  withBudgetMath({ category: "revenue", accountName: "Training & Support", budget: 300_000_000, actual: 285_000_000 })
];
const cogs = [
  withBudgetMath({ category: "COGS", accountName: "Cloud Infrastructure", budget: 650_000_000, actual: 690_000_000 }),
  withBudgetMath({ category: "COGS", accountName: "Implementation Consultant", budget: 520_000_000, actual: 505_000_000 })
];
const opex = [
  withBudgetMath({ category: "operating expense", accountName: "Advertising Expense", department: "Marketing", budget: 140_000_000, actual: 165_000_000 }),
  withBudgetMath({ category: "operating expense", accountName: "Sales Commission", department: "Sales", budget: 185_000_000, actual: 170_000_000 }),
  withBudgetMath({ category: "operating expense", accountName: "SaaS Tools", department: "Technology", budget: 95_000_000, actual: 112_000_000 }),
  withBudgetMath({ category: "operating expense", accountName: "Office & Admin", department: "Finance & Admin", budget: 80_000_000, actual: 68_000_000 })
];

export const mockBudgetVsActual: BudgetVsActualReport = {
  totalBudget: 4_180_000_000,
  totalActual: 4_190_000_000,
  variance: 10_000_000,
  variancePercent: 0.24,
  status: "on_track",
  byRevenue: revenue,
  byCogs: cogs,
  byOperatingExpense: opex,
  byDepartment: mockExpenseByDepartment.map((item) => withBudgetMath({ category: "department expense", accountName: `${item.departmentName} Expense`, department: item.departmentName, budget: item.budget ?? 0, actual: item.actual })),
  byAccountCategory: [
    withBudgetMath({ category: "revenue", accountName: "Total Revenue", budget: 2_510_000_000, actual: 2_480_000_000 }),
    withBudgetMath({ category: "COGS", accountName: "Total COGS", budget: 1_170_000_000, actual: 1_195_000_000 }),
    withBudgetMath({ category: "operating expense", accountName: "Total OPEX", budget: 500_000_000, actual: 515_000_000 })
  ]
};

export const mockFinancialSummary: FinancialSummary = {
  totalRevenue: 2_850_000_000,
  grossProfit: 1_330_000_000,
  netProfit: 600_000_000,
  totalAssets: mockBalanceSheet.totalAssets,
  cashAndBank: mockBalanceSheet.cashAndBank,
  grossMargin: grossMargin(1_330_000_000, 2_850_000_000),
  netProfitMargin: safePercent(600_000_000, 2_850_000_000),
  operatingExpense: 685_000_000,
  comparisons: {
    totalRevenue: { current: 2_850_000_000, previous: 2_560_000_000, change: 290_000_000, changePercent: 11.3 },
    grossProfit: { current: 1_330_000_000, previous: 1_160_000_000, change: 170_000_000, changePercent: 14.7 },
    netProfit: { current: 600_000_000, previous: 512_000_000, change: 88_000_000, changePercent: 17.2 },
    totalAssets: { current: 6_500_000_000, previous: 6_210_000_000, change: 290_000_000, changePercent: 4.7 },
    cashAndBank: { current: 1_240_000_000, previous: 1_090_000_000, change: 150_000_000, changePercent: 13.8 },
    grossMargin: { current: 46.7, previous: 45.3, change: 1.4, changePercent: 3.1 },
    netProfitMargin: { current: 21.1, previous: 20.0, change: 1.1, changePercent: 5.5 },
    operatingExpense: { current: 685_000_000, previous: 648_000_000, change: 37_000_000, changePercent: 5.7 }
  }
};
