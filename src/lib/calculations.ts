import type { BudgetInsight, BudgetVsActualItem } from "@/lib/accurate/types";

export function safePercent(numerator: number, denominator: number) {
  if (!denominator) return 0;
  return (numerator / denominator) * 100;
}

export function calculateVariance(actual: number, budget: number) {
  return actual - budget;
}

export function calculateBudgetStatus(item: { category: string; budget: number; actual: number }): "under_budget" | "over_budget" | "on_track" {
  const variancePercent = safePercent(item.actual - item.budget, item.budget);
  if (Math.abs(variancePercent) <= 3) return "on_track";
  const isRevenue = item.category.toLowerCase().includes("revenue") || item.category.toLowerCase().includes("pendapatan");
  if (isRevenue) return item.actual >= item.budget ? "under_budget" : "over_budget";
  return item.actual <= item.budget ? "under_budget" : "over_budget";
}

export function generateBudgetInsights(budgetVsActualData: BudgetVsActualItem[]): BudgetInsight[] {
  if (!budgetVsActualData.length) {
    return [{ type: "info", title: "Belum ada data budget", description: "Data budget vs actual belum tersedia untuk periode ini.", recommendation: "Lengkapi budget di Accurate Online agar analisa variance dapat berjalan." }];
  }

  const insights: BudgetInsight[] = [];
  const sortedByAbsVariance = [...budgetVsActualData].sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance));
  const largest = sortedByAbsVariance[0];
  insights.push({
    type: largest.status === "over_budget" ? "warning" : "info",
    title: "Variance terbesar",
    description: `${largest.department ? `Departemen ${largest.department} pada ` : ""}${largest.accountName} memiliki variance terbesar sebesar ${formatInlineAmount(largest.variance)} atau ${largest.variancePercent.toFixed(1)}%.`,
    amount: largest.variance,
    percentage: largest.variancePercent,
    recommendation: largest.status === "over_budget" ? "Review transaksi detail dan identifikasi aktivitas dengan ROI rendah." : "Pertahankan kontrol budget dan evaluasi peluang realokasi dana."
  });

  const overExpenses = budgetVsActualData
    .filter((item) => item.status === "over_budget" && !isRevenueCategory(item.category))
    .sort((a, b) => b.variancePercent - a.variancePercent)
    .slice(0, 3);
  overExpenses.forEach((item) => insights.push({
    type: item.variancePercent > 15 ? "danger" : "warning",
    title: `Expense over budget: ${item.accountName}`,
    description: `${item.department ? `Departemen ${item.department} ` : ""}mengalami over budget sebesar ${formatInlineAmount(item.variance)} atau ${item.variancePercent.toFixed(1)}% di atas budget.`,
    amount: item.variance,
    percentage: item.variancePercent,
    recommendation: "Bandingkan spend dengan outcome bisnis dan tunda pengeluaran non-kritis sampai akhir periode."
  }));

  const missedRevenue = budgetVsActualData
    .filter((item) => isRevenueCategory(item.category) && item.actual < item.budget)
    .sort((a, b) => a.variancePercent - b.variancePercent)[0];
  if (missedRevenue) {
    insights.push({
      type: "danger",
      title: "Revenue belum mencapai target",
      description: `${missedRevenue.accountName} masih di bawah target sebesar ${formatInlineAmount(Math.abs(missedRevenue.variance))} atau ${Math.abs(missedRevenue.variancePercent).toFixed(1)}%.`,
      amount: missedRevenue.variance,
      percentage: missedRevenue.variancePercent,
      recommendation: "Prioritaskan pipeline penjualan, promo produk margin tinggi, dan follow-up piutang pelanggan strategis."
    });
  }

  const underBudgetCount = budgetVsActualData.filter((item) => item.status === "under_budget").length;
  if (underBudgetCount >= budgetVsActualData.length / 2) {
    insights.push({
      type: "success",
      title: "Mayoritas pos terkendali",
      description: `${underBudgetCount} dari ${budgetVsActualData.length} pos berada pada status under budget atau positif terhadap target.`,
      recommendation: "Gunakan ruang budget untuk inisiatif yang mempercepat revenue atau efisiensi operasional."
    });
  }

  return insights.slice(0, 6);
}

function isRevenueCategory(category: string) {
  const value = category.toLowerCase();
  return value.includes("revenue") || value.includes("pendapatan");
}

function formatInlineAmount(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}
