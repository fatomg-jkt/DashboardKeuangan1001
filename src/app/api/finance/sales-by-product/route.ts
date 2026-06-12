import { NextResponse, type NextRequest } from "next/server";
import { getSalesByProduct } from "@/lib/accurate/reports";
import { apiError, filtersFromRequest } from "../utils";
export async function GET(request: NextRequest) { try { const f = filtersFromRequest(request); return NextResponse.json(await getSalesByProduct(f.startDate, f.endDate, f)); } catch (e) { return apiError(e); } }
