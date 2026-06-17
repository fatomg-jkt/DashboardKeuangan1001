// Helper kalkulasi keuangan dibuat murni agar mudah dites dan diganti sumber datanya dari API/database.
export const grossProfit = (revenue: number, cogs: number) => revenue - cogs;
export const grossMargin = (revenue: number, cogs: number) => (revenue === 0 ? 0 : grossProfit(revenue, cogs) / revenue);
export const netProfit = (revenue: number, cogs: number, operatingExpenses: number, otherIncome = 0, otherExpenses = 0) => grossProfit(revenue, cogs) - operatingExpenses + otherIncome - otherExpenses;
export const netProfitMargin = (revenue: number, netProfitValue: number) => (revenue === 0 ? 0 : netProfitValue / revenue);
export const budgetVariance = (actual: number, budget: number) => actual - budget;
export const budgetVariancePercent = (actual: number, budget: number) => (budget === 0 ? 0 : budgetVariance(actual, budget) / budget);
export const endingCash = (beginningCash: number, netCashflow: number) => beginningCash + netCashflow;
export const assetValidationDifference = (totalAssets: number, totalLiabilities: number, totalEquity: number) => totalAssets - (totalLiabilities + totalEquity);
