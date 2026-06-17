import { NextResponse } from "next/server";
import { getFinanceData } from "@/lib/financeService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getFinanceData("cash-flow");
    return NextResponse.json({ data });
  } catch {
    const data = await getFinanceData("cash-flow");
    return NextResponse.json({ data, warning: "Fallback data returned." });
  }
}
