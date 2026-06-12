import type { NextRequest } from "next/server";
import { getProfitLoss } from "@/lib/accurate/reports";
import { filtersFromRequest, jsonRoute } from "../_helpers";

export async function GET(request: NextRequest) {
  const filters = filtersFromRequest(request);
  return jsonRoute(() => getProfitLoss(filters.startDate, filters.endDate));
}
