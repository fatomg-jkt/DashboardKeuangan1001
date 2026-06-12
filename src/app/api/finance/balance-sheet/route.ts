import { NextResponse, type NextRequest } from "next/server";
import { getBalanceSheet } from "@/lib/accurate/reports";
import { apiError, filtersFromRequest } from "../utils";
export async function GET(request: NextRequest) { try { const f = filtersFromRequest(request); return NextResponse.json(await getBalanceSheet(f.endDate, f)); } catch (e) { return apiError(e); } }
