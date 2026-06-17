export type FinanceEndpoint =
  | "summary"
  | "profit-loss"
  | "balance-sheet"
  | "cash-flow"
  | "sales-by-product"
  | "expense-by-department"
  | "budget-vs-actual"
  | "budget-insights";

const endpointPath: Record<FinanceEndpoint, string> = {
  summary: "/finance/summary",
  "profit-loss": "/finance/profit-loss",
  "balance-sheet": "/finance/balance-sheet",
  "cash-flow": "/finance/cash-flow",
  "sales-by-product": "/finance/sales-by-product",
  "expense-by-department": "/finance/expense-by-department",
  "budget-vs-actual": "/finance/budget-vs-actual",
  "budget-insights": "/finance/budget-insights"
};

export function shouldUseMockData(): boolean {
  return process.env.USE_MOCK_DATA !== "false" || !process.env.ACCURATE_BASE_URL || !process.env.ACCURATE_ACCESS_TOKEN;
}

export async function fetchAccurateData<T>(endpoint: FinanceEndpoint): Promise<T | null> {
  if (shouldUseMockData()) return null;

  try {
    const response = await fetch(`${process.env.ACCURATE_BASE_URL}${endpointPath[endpoint]}`, {
      headers: {
        Authorization: `Bearer ${process.env.ACCURATE_ACCESS_TOKEN}`,
        ...(process.env.ACCURATE_SESSION_ID ? { "X-Session-ID": process.env.ACCURATE_SESSION_ID } : {})
      },
      cache: "no-store"
    });

    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}
