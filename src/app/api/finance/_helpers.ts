import { NextResponse, type NextRequest } from "next/server";
import { AccurateApiError } from "@/lib/accurate/client";

export function filtersFromRequest(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  return {
    startDate: searchParams.get("startDate") ?? undefined,
    endDate: searchParams.get("endDate") ?? undefined,
    department: searchParams.get("department") ?? undefined,
    product: searchParams.get("product") ?? undefined,
    branch: searchParams.get("branch") ?? undefined
  };
}

export async function jsonRoute<T>(handler: () => Promise<T>) {
  try {
    return NextResponse.json(await handler());
  } catch (error) {
    const status = error instanceof AccurateApiError ? error.status ?? 500 : 500;
    return NextResponse.json({ message: error instanceof Error ? error.message : "Terjadi kesalahan server" }, { status });
  }
}
