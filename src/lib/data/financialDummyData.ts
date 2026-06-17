import { assetValidationDifference, budgetVariance, budgetVariancePercent, endingCash, grossMargin, grossProfit, netProfit, netProfitMargin } from '../utils/financialCalculations';

export type PeriodType = 'Bulanan' | 'Kuartalan' | 'Tahunan';
export type FilterState = { period: PeriodType; year: number; department: string; product: string; entity: string };

export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

// Dummy data realistis: angka P&L, kas, budget, dan neraca dibuat konsisten untuk simulasi executive dashboard.
export const monthlyFinancialSummary = months.map((month, index) => {
  const revenue = [1380000000, 1450000000, 1510000000, 1490000000, 1580000000, 1620000000, 1660000000, 1710000000, 1740000000, 1690000000, 1810000000, 1880000000][index];
  const cogs = Math.round(revenue * [0.58, 0.575, 0.57, 0.59, 0.60, 0.61, 0.60, 0.595, 0.585, 0.61, 0.60, 0.59][index]);
  const operatingExpenses = [330000000, 342000000, 351000000, 360000000, 372000000, 385000000, 392000000, 401000000, 410000000, 418000000, 425000000, 438000000][index];
  const otherIncome = [25000000, 18000000, 20000000, 22000000, 26000000, 24000000, 27000000, 26000000, 28000000, 25000000, 30000000, 32000000][index];
  const otherExpenses = [12000000, 14000000, 13000000, 15000000, 16000000, 17000000, 18000000, 17000000, 19000000, 22000000, 20000000, 21000000][index];
  const net = netProfit(revenue, cogs, operatingExpenses, otherIncome, otherExpenses);
  return { month, revenue, cogs, grossProfit: grossProfit(revenue, cogs), operatingExpenses, operatingProfit: grossProfit(revenue, cogs) - operatingExpenses, otherIncome, otherExpenses, netProfit: net, grossMargin: grossMargin(revenue, cogs), netProfitMargin: netProfitMargin(revenue, net), cashInflow: Math.round(revenue * 0.92), cashOutflow: cogs + operatingExpenses + otherExpenses, endingCash: 850000000 + index * 78000000 + net * 0.08 };
});

export const currentMonth = monthlyFinancialSummary[11];
export const previousMonth = monthlyFinancialSummary[10];

export const balanceSheet = {
  assets: [
    { name: 'Cash & Bank', amount: 1830000000 }, { name: 'Account Receivable', amount: 1120000000 }, { name: 'Inventory', amount: 890000000 }, { name: 'Fixed Assets', amount: 3250000000 }, { name: 'Other Assets', amount: 410000000 },
  ],
  liabilities: [
    { name: 'Account Payable', amount: 760000000 }, { name: 'Short Term Debt', amount: 540000000 }, { name: 'Long Term Debt', amount: 1600000000 }, { name: 'Other Liabilities', amount: 230000000 },
  ],
  equity: [
    { name: 'Capital', amount: 2400000000 }, { name: 'Retained Earnings', amount: 1430000000 }, { name: 'Current Year Profit', amount: 540000000 },
  ],
};
export const totalAssets = balanceSheet.assets.reduce((s, i) => s + i.amount, 0);
export const totalLiabilities = balanceSheet.liabilities.reduce((s, i) => s + i.amount, 0);
export const totalEquity = balanceSheet.equity.reduce((s, i) => s + i.amount, 0);
export const validationDifference = assetValidationDifference(totalAssets, totalLiabilities, totalEquity);

export const cashflow = { operating: 515000000, investing: -185000000, financing: -90000000, beginningCash: 1590000000 };
export const netCashflow = cashflow.operating + cashflow.investing + cashflow.financing;
export const endingCashBalance = endingCash(cashflow.beginningCash, netCashflow);

export const productSales = [
  { name: 'ERP Subscription', sales: 5200000000, quantity: 1040, grossProfit: 2290000000 }, { name: 'Implementation Service', sales: 4100000000, quantity: 205, grossProfit: 1720000000 }, { name: 'Premium Support', sales: 2450000000, quantity: 490, grossProfit: 1510000000 }, { name: 'Data Analytics Add-on', sales: 1880000000, quantity: 376, grossProfit: 790000000 }, { name: 'Training Package', sales: 960000000, quantity: 320, grossProfit: 470000000 },
].map((p) => ({ ...p, grossMargin: p.grossProfit / p.sales }));
const totalProductRevenue = productSales.reduce((s, p) => s + p.sales, 0);
export const topProducts = productSales.map((p) => ({ ...p, contribution: p.sales / totalProductRevenue }));

export const departmentExpenses = [
  { department: 'Finance', actual: 510000000, budget: 530000000 }, { department: 'Sales & Marketing', actual: 1380000000, budget: 1230000000 }, { department: 'Operations', actual: 1160000000, budget: 1190000000 }, { department: 'HR', actual: 430000000, budget: 455000000 }, { department: 'IT', actual: 620000000, budget: 590000000 }, { department: 'General & Administrative', actual: 710000000, budget: 735000000 },
];
export const totalDepartmentExpense = departmentExpenses.reduce((s, d) => s + d.actual, 0);

export const budgetVsActual = [
  { item: 'Revenue', budget: 19500000000, actual: 19120000000, favorableWhenPositive: true }, { item: 'COGS', budget: 11350000000, actual: 11480000000, favorableWhenPositive: false }, { item: 'Operating Expense', budget: 5040000000, actual: 4924000000, favorableWhenPositive: false }, { item: 'Gross Profit', budget: 8150000000, actual: 7640000000, favorableWhenPositive: true }, { item: 'Net Profit', budget: 3220000000, actual: 2840000000, favorableWhenPositive: true }, { item: 'Cash Balance', budget: 1760000000, actual: endingCashBalance, favorableWhenPositive: true },
].map((b) => { const variance = budgetVariance(b.actual, b.budget); const pct = budgetVariancePercent(b.actual, b.budget); const favorable = b.favorableWhenPositive ? variance >= 0 : variance <= 0; return { ...b, variance, variancePct: pct, status: favorable ? 'Favorable' : 'Unfavorable' as 'Favorable' | 'Unfavorable' }; });

export const budgetInsights = [
  { type: 'Risiko', title: 'Revenue di bawah budget', description: 'Sales actual 1,9% di bawah budget, terutama karena pipeline implementasi tertunda pada kuartal akhir.', impact: 'Menekan laba bersih sekitar Rp 380 juta dibanding target.', recommendation: 'Percepat closing enterprise account dan berikan prioritas pada produk margin tinggi.' },
  { type: 'Over Budget', title: 'Sales & Marketing melewati budget', description: 'Marketing expense 12,2% di atas budget namun revenue belum naik sebanding.', impact: 'Efisiensi akuisisi pelanggan perlu dievaluasi.', recommendation: 'Alihkan spend ke kanal dengan CAC rendah dan hentikan campaign yang ROI-nya negatif.' },
  { type: 'Margin', title: 'Gross margin melemah', description: 'Gross margin bulan Desember membaik ke 41,0%, tetapi rata-rata tahunan masih tertekan oleh kenaikan HPP Q2-Q3.', impact: 'Ruang diskon menjadi lebih sempit.', recommendation: 'Negosiasi vendor, audit biaya implementasi, dan review pricing strategy.' },
  { type: 'Likuiditas', title: 'Cash runway aman', description: 'Ending cash balance mendukung kebutuhan operasional lebih dari 3 bulan.', impact: 'Risiko likuiditas jangka pendek rendah.', recommendation: 'Pertahankan discipline collection dan jadwalkan capex non-kritis bertahap.' },
];
