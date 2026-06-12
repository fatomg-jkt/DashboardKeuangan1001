import { accurateFetch, isMockMode } from "@/lib/accurate/client";
import { mapBalanceSheet, mapBudgetVsActual, mapCashFlow, mapExpenseByDepartment, mapFinancialSummary, mapProfitLoss, mapSalesByProduct } from "@/lib/accurate/mappers";
import type { QueryFilters } from "@/lib/accurate/types";
import * as mock from "@/lib/mock/financeData";
import { safePercent } from "@/lib/calculations";

const endpoints = {
  profitLoss: "/api/report/profit-loss",
  balanceSheet: "/api/report/balance-sheet",
  cashFlow: "/api/report/cash-flow",
  salesByProduct: "/api/report/sales-by-product",
  expenseByDepartment: "/api/report/expense-by-department",
  budgetVsActual: "/api/report/budget-vs-actual",
  summary: "/api/report/financial-summary"
};

export async function getProfitLoss(startDate?: string, endDate?: string) {
  if (isMockMode()) return mock.profitLoss;
  return mapProfitLoss(await accurateFetch({ path: endpoints.profitLoss, query: { startDate, endDate } }));
}

export async function getBalanceSheet(asOfDate?: string) {
  if (isMockMode()) return mock.balanceSheet;
  return mapBalanceSheet(await accurateFetch({ path: endpoints.balanceSheet, query: { asOfDate } }));
}

export async function getCashFlow(startDate?: string, endDate?: string) {
  if (isMockMode()) return mock.cashFlow;
  return mapCashFlow(await accurateFetch({ path: endpoints.cashFlow, query: { startDate, endDate } }));
}

export async function getSalesByProduct(startDate?: string, endDate?: string) {
  if (isMockMode()) return mock.salesByProduct;
  return mapSalesByProduct(await accurateFetch({ path: endpoints.salesByProduct, query: { startDate, endDate } }));
}

export async function getExpenseByDepartment(startDate?: string, endDate?: string) {
  if (isMockMode()) return mock.expenseByDepartment;
  return mapExpenseByDepartment(await accurateFetch({ path: endpoints.expenseByDepartment, query: { startDate, endDate } }));
}

export async function getBudgetVsActual(startDate?: string, endDate?: string) {
  if (isMockMode()) return mock.budgetVsActual;
  return mapBudgetVsActual(await accurateFetch({ path: endpoints.budgetVsActual, query: { startDate, endDate } }));
}

export async function getFinancialSummary(startDate?: string, endDate?: string) {
  if (isMockMode()) return mock.financialSummary;
  const current = mapFinancialSummary(await accurateFetch({ path: endpoints.summary, query: { startDate, endDate } }));
  return { current, previous: current, changes: Object.fromEntries(Object.entries(current).map(([key]) => [key, 0])) };
}

export async function getDashboardBundle(filters: QueryFilters) {
  const [summary, pl, bs, cf, products, expenses, budget] = await Promise.all([
    getFinancialSummary(filters.startDate, filters.endDate),
    getProfitLoss(filters.startDate, filters.endDate),
    getBalanceSheet(filters.endDate),
    getCashFlow(filters.startDate, filters.endDate),
    getSalesByProduct(filters.startDate, filters.endDate),
    getExpenseByDepartment(filters.startDate, filters.endDate),
    getBudgetVsActual(filters.startDate, filters.endDate)
  ]);
  return { summary, profitLoss: pl, balanceSheet: bs, cashFlow: cf, salesByProduct: products, expenseByDepartment: expenses, budgetVsActual: budget, grossMarginWarning: summary.current.grossMargin < summary.previous.grossMargin, revenueVsCogs: { revenue: summary.current.totalRevenue, cogs: summary.current.totalRevenue - summary.current.grossProfit, grossMargin: safePercent(summary.current.grossProfit, summary.current.totalRevenue) } };
}
