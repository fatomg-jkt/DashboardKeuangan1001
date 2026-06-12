import { accurateFetch, shouldUseMockData } from "@/lib/accurate/client";
import { generateBudgetInsights } from "@/lib/calculations";
import { mapBalanceSheet, mapBudgetVsActual, mapCashFlow, mapExpenseByDepartment, mapFinancialSummary, mapProfitLoss, mapSalesByProduct } from "@/lib/accurate/mappers";
import type { QueryFilters } from "@/lib/accurate/types";
import { mockBalanceSheet, mockBudgetVsActual, mockCashFlow, mockExpenseByDepartment, mockFinancialSummary, mockProfitLoss, mockSalesByProduct } from "@/lib/mock/financeData";

const endpoints = {
  profitLoss: "/api/finance/profit-loss",
  balanceSheet: "/api/finance/balance-sheet",
  cashFlow: "/api/finance/cash-flow",
  salesByProduct: "/api/finance/sales-by-product",
  expenseByDepartment: "/api/finance/expense-by-department",
  budgetVsActual: "/api/finance/budget-vs-actual",
  financialSummary: "/api/finance/summary"
};

export async function getProfitLoss(startDate?: string, endDate?: string, filters: QueryFilters = {}) {
  if (shouldUseMockData()) return mockProfitLoss;
  return mapProfitLoss(await accurateFetch(endpoints.profitLoss, { ...filters, startDate, endDate }));
}

export async function getBalanceSheet(asOfDate?: string, filters: QueryFilters = {}) {
  if (shouldUseMockData()) return mockBalanceSheet;
  return mapBalanceSheet(await accurateFetch(endpoints.balanceSheet, { ...filters, endDate: asOfDate }));
}

export async function getCashFlow(startDate?: string, endDate?: string, filters: QueryFilters = {}) {
  if (shouldUseMockData()) return mockCashFlow;
  return mapCashFlow(await accurateFetch(endpoints.cashFlow, { ...filters, startDate, endDate }));
}

export async function getSalesByProduct(startDate?: string, endDate?: string, filters: QueryFilters = {}) {
  if (shouldUseMockData()) return mockSalesByProduct;
  return mapSalesByProduct(await accurateFetch(endpoints.salesByProduct, { ...filters, startDate, endDate }));
}

export async function getExpenseByDepartment(startDate?: string, endDate?: string, filters: QueryFilters = {}) {
  if (shouldUseMockData()) return mockExpenseByDepartment;
  return mapExpenseByDepartment(await accurateFetch(endpoints.expenseByDepartment, { ...filters, startDate, endDate }));
}

export async function getBudgetVsActual(startDate?: string, endDate?: string, filters: QueryFilters = {}) {
  if (shouldUseMockData()) return mockBudgetVsActual;
  return mapBudgetVsActual(await accurateFetch(endpoints.budgetVsActual, { ...filters, startDate, endDate }));
}

export async function getFinancialSummary(startDate?: string, endDate?: string, filters: QueryFilters = {}) {
  if (shouldUseMockData()) return mockFinancialSummary;
  return mapFinancialSummary(await accurateFetch(endpoints.financialSummary, { ...filters, startDate, endDate }));
}

export async function getBudgetInsights(startDate?: string, endDate?: string, filters: QueryFilters = {}) {
  return generateBudgetInsights(await getBudgetVsActual(startDate, endDate, filters));
}
