import type { BudgetInsight, BudgetStatus, BudgetVsActualItem, BudgetVsActualReport } from "@/lib/accurate/types";

export function safePercent(numerator: number, denominator: number) {
  if (!denominator) return 0;
  return (numerator / denominator) * 100;
}

export function grossMargin(grossProfit: number, revenue: number) {
  return safePercent(grossProfit, revenue);
}

export function variance(actual: number, budget: number) {
  return actual - budget;
}

export function variancePercent(actual: number, budget: number) {
  return safePercent(variance(actual, budget), budget);
}

export function budgetStatus(category: string, actual: number, budget: number): BudgetStatus {
  const diff = variance(actual, budget);
  const tolerance = Math.abs(budget) * 0.02;
  if (Math.abs(diff) <= tolerance) return "on_track";
  const isRevenue = category.toLowerCase().includes("revenue") || category.toLowerCase().includes("pendapatan");
  if (isRevenue) return diff >= 0 ? "under_budget" : "over_budget";
  return diff <= 0 ? "under_budget" : "over_budget";
}

export function withBudgetMath<T extends Omit<BudgetVsActualItem, "variance" | "variancePercent" | "status">>(item: T): BudgetVsActualItem {
  const itemVariance = variance(item.actual, item.budget);
  return {
    ...item,
    variance: itemVariance,
    variancePercent: variancePercent(item.actual, item.budget),
    status: budgetStatus(item.category, item.actual, item.budget)
  };
}

export function generateBudgetInsights(data: BudgetVsActualReport): BudgetInsight[] {
  const allItems = [
    ...data.byRevenue,
    ...data.byCogs,
    ...data.byOperatingExpense,
    ...data.byDepartment,
    ...data.byAccountCategory
  ];
  const overBudgetExpenses = allItems
    .filter((item) => item.status === "over_budget" && !item.category.toLowerCase().includes("revenue"))
    .sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance));
  const underTargetRevenue = data.byRevenue
    .filter((item) => item.actual < item.budget)
    .sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance));
  const biggestVariance = [...allItems].sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance))[0];

  const insights: BudgetInsight[] = [];
  if (biggestVariance) {
    insights.push({
      type: biggestVariance.status === "over_budget" ? "warning" : "info",
      title: `Variance terbesar: ${biggestVariance.accountName}`,
      description: `${biggestVariance.department ? `Departemen ${biggestVariance.department} ` : "Akun ini "}memiliki selisih ${Math.abs(biggestVariance.variancePercent).toFixed(1)}% terhadap budget.`,
      amount: biggestVariance.variance,
      percentage: biggestVariance.variancePercent,
      recommendation: "Review transaksi pembentuk variance dan validasi apakah budget perlu direvisi atau realisasi perlu dikendalikan."
    });
  }

  overBudgetExpenses.slice(0, 3).forEach((item) => {
    insights.push({
      type: Math.abs(item.variancePercent) > 15 ? "danger" : "warning",
      title: `${item.department ?? item.accountName} over budget`,
      description: `${item.department ? `Departemen ${item.department}` : item.accountName} mengalami over budget sebesar ${Math.abs(item.variancePercent).toFixed(1)}% di atas budget. Penyebab utama berasal dari akun ${item.accountName}.`,
      amount: item.variance,
      percentage: item.variancePercent,
      recommendation: "Prioritaskan approval pengeluaran baru, evaluasi vendor, dan hentikan aktivitas dengan ROI rendah."
    });
  });

  underTargetRevenue.slice(0, 2).forEach((item) => {
    insights.push({
      type: "warning",
      title: `${item.accountName} belum mencapai target`,
      description: `Realisasi revenue ${item.accountName} masih ${Math.abs(item.variancePercent).toFixed(1)}% di bawah budget periode ini.`,
      amount: item.variance,
      percentage: item.variancePercent,
      recommendation: "Perkuat pipeline penjualan, percepat follow-up quotation, dan fokus pada produk dengan margin tinggi."
    });
  });

  if (data.status === "under_budget") {
    insights.push({
      type: "success",
      title: "Kinerja budget keseluruhan terkendali",
      description: "Total realisasi masih berada dalam batas budget sehingga ruang efisiensi dapat dipertahankan.",
      amount: data.variance,
      percentage: data.variancePercent,
      recommendation: "Pertahankan disiplin spending dan alokasikan surplus ke aktivitas prioritas."
    });
  }

  return insights.slice(0, 6);
}
