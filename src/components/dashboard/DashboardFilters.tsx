"use client";

import { useRouter, useSearchParams } from "next/navigation";

const inputClass = "rounded-lg border bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary";

export function DashboardFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value); else next.delete(key);
    router.push(`?${next.toString()}`);
  };
  return (
    <div className="grid gap-3 rounded-xl border bg-white p-4 shadow-sm md:grid-cols-3 xl:grid-cols-6">
      <select className={inputClass} defaultValue={params.get("preset") ?? "ytd"} onChange={(e) => update("preset", e.target.value)} aria-label="Preset tanggal">
        <option value="current_month">Bulan berjalan</option>
        <option value="quarter">Quarter</option>
        <option value="ytd">Year-to-date</option>
        <option value="custom">Custom</option>
      </select>
      <input className={inputClass} type="date" defaultValue={params.get("startDate") ?? "2026-01-01"} onChange={(e) => update("startDate", e.target.value)} />
      <input className={inputClass} type="date" defaultValue={params.get("endDate") ?? "2026-06-30"} onChange={(e) => update("endDate", e.target.value)} />
      <input className={inputClass} placeholder="Department" defaultValue={params.get("department") ?? ""} onBlur={(e) => update("department", e.target.value)} />
      <input className={inputClass} placeholder="Product" defaultValue={params.get("product") ?? ""} onBlur={(e) => update("product", e.target.value)} />
      <input className={inputClass} placeholder="Branch / Cabang" defaultValue={params.get("branch") ?? ""} onBlur={(e) => update("branch", e.target.value)} />
    </div>
  );
}
