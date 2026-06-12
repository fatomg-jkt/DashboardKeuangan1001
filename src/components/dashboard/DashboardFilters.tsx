"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function DashboardFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value); else next.delete(key);
    router.push(`?${next.toString()}`);
  };
  return (
    <div className="grid gap-3 rounded-xl border bg-white p-4 shadow-soft md:grid-cols-6">
      <select className="rounded-lg border px-3 py-2 text-sm" defaultValue={params.get("preset") ?? "month"} onChange={(e) => update("preset", e.target.value)}>
        <option value="month">Bulan berjalan</option><option value="quarter">Quarter</option><option value="ytd">Year-to-date</option><option value="custom">Custom</option>
      </select>
      <input className="rounded-lg border px-3 py-2 text-sm" type="date" defaultValue={params.get("startDate") ?? "2026-06-01"} onChange={(e) => update("startDate", e.target.value)} />
      <input className="rounded-lg border px-3 py-2 text-sm" type="date" defaultValue={params.get("endDate") ?? "2026-06-30"} onChange={(e) => update("endDate", e.target.value)} />
      <input className="rounded-lg border px-3 py-2 text-sm" placeholder="Department" defaultValue={params.get("department") ?? ""} onBlur={(e) => update("department", e.target.value)} />
      <input className="rounded-lg border px-3 py-2 text-sm" placeholder="Product" defaultValue={params.get("product") ?? ""} onBlur={(e) => update("product", e.target.value)} />
      <input className="rounded-lg border px-3 py-2 text-sm" placeholder="Branch / Cabang" defaultValue={params.get("branch") ?? ""} onBlur={(e) => update("branch", e.target.value)} />
    </div>
  );
}
