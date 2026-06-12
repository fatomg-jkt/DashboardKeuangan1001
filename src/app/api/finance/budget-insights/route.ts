import type { NextRequest } from "next/server";
import { getBudgetVsActual } from "@/lib/accurate/reports";
import { generateBudgetInsights } from "@/lib/calculations";
import { filtersFromRequest, jsonRoute } from "../_helpers";

export async function GET(request: NextRequest) {
  const filters = filtersFromRequest(request);
  return jsonRoute(async () => generateBudgetInsights(await getBudgetVsActual(filters.startDate, filters.endDate)));
}
