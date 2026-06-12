"use client";

import { ArrowDownRight, ArrowUpRight, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPercent, formatRupiah } from "@/lib/formatters";
import type { FinancialSummary } from "@/lib/accurate/types";

const metrics: Array<{ key: keyof Omit<FinancialSummary, "comparisons">; label: string; percentage?: boolean; expense?: boolean }> = [
  { key: "totalRevenue", label: "Total Pendapatan" },
  { key: "grossProfit", label: "Laba Kotor" },
  { key: "netProfit", label: "Laba Bersih" },
  { key: "totalAssets", label: "Total Asset" },
  { key: "cashAndBank", label: "Kas & Bank" },
  { key: "grossMargin", label: "Gross Margin", percentage: true },
  { key: "netProfitMargin", label: "Net Profit Margin", percentage: true },
  { key: "operatingExpense", label: "Operating Expense", expense: true }
];

export function FinancialSummaryCards() {
  const [data, setData] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    fetch(`/api/finance/summary?${params.toString()}`)
      .then(async (response) => {
        if (!response.ok) throw new Error((await response.json()).error ?? "Gagal memuat summary");
        return response.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertCircle className="mr-2 inline h-4 w-4" />{error}</div>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const comparison = data?.comparisons?.[metric.key];
        const value = data?.[metric.key] ?? 0;
        const isPositive = (comparison?.changePercent ?? 0) >= 0;
        return (
          <Card key={metric.key}>
            <CardHeader className="pb-2"><CardTitle className="text-muted-foreground">{metric.label}</CardTitle></CardHeader>
            <CardContent>
              {loading ? <div className="h-16 animate-pulse rounded-lg bg-muted" /> : (
                <>
                  <div className="text-2xl font-bold tracking-tight">{metric.percentage ? formatPercent(value) : formatRupiah(value)}</div>
                  <div className={`mt-2 flex items-center gap-1 text-xs ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
                    {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    {formatPercent(comparison?.changePercent ?? 0)} vs periode sebelumnya
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
