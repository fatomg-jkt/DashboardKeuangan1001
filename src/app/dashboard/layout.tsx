import type React from "react";
import Link from "next/link";
import { BarChart3, Landmark, LineChart, PieChart, WalletCards } from "lucide-react";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";

const nav = [
  ["Overview", "/dashboard", BarChart3], ["Profit & Loss", "/dashboard/profit-loss", LineChart], ["Balance Sheet", "/dashboard/balance-sheet", Landmark], ["Cash Flow", "/dashboard/cash-flow", WalletCards], ["Budget Analysis", "/dashboard/budget-analysis", PieChart]
] as const;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-slate-50"><aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r bg-slate-950 p-6 text-white lg:block"><div className="text-xl font-bold">Keuangan 1001</div><p className="mt-2 text-sm text-slate-300">Accurate Online Dashboard</p><nav className="mt-8 space-y-2">{nav.map(([label, href, Icon]) => <Link className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/10" key={href} href={href}><Icon size={18} />{label}</Link>)}</nav></aside><main className="lg:pl-64"><header className="sticky top-0 z-10 border-b bg-white/90 p-4 backdrop-blur lg:p-6"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-bold tracking-tight">Dashboard Keuangan</h1><p className="text-sm text-muted-foreground">Ringkasan manajemen, laporan, dan analisa budget</p></div><div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">Mock/API mode aman server-side</div></div><DashboardFilters /></header><div className="p-4 lg:p-6">{children}</div></main></div>;
}
