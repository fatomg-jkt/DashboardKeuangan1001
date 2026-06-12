import { NextResponse, type NextRequest } from "next/server";
import { getCashFlow } from "@/lib/accurate/reports";
import { apiError, filtersFromRequest } from "../utils";
export async function GET(request: NextRequest) { try { const f = filtersFromRequest(request); return NextResponse.json(await getCashFlow(f.startDate, f.endDate, f)); } catch (e) { return apiError(e); } }
