import { NextResponse, type NextRequest } from "next/server";
import type { QueryFilters } from "@/lib/accurate/types";

export function filtersFromRequest(request: NextRequest): QueryFilters {
  const params = request.nextUrl.searchParams;
  return {
    startDate: params.get("startDate") ?? undefined,
    endDate: params.get("endDate") ?? undefined,
    department: params.get("department") ?? undefined,
    product: params.get("product") ?? undefined,
    branch: params.get("branch") ?? undefined
  };
}

export function apiError(error: unknown) {
  const message = error instanceof Error ? error.message : "Terjadi kesalahan server.";
  const status = typeof error === "object" && error !== null && "status" in error ? Number((error as { status?: number }).status) : 500;
  return NextResponse.json({ error: message }, { status: status || 500 });
}
