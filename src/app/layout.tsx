import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, Landmark, LineChart, PieChart, WalletCards } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dashboard Keuangan Accurate",
  description: "Dashboard manajemen keuangan terintegrasi Accurate Online"
};

const navigation = [
  { href: "/dashboard", label: "Overview", icon: BarChart3 },
  { href: "/dashboard/profit-loss", label: "Profit & Loss", icon: LineChart },
  { href: "/dashboard/balance-sheet", label: "Balance Sheet", icon: Landmark },
  { href: "/dashboard/cash-flow", label: "Cash Flow", icon: WalletCards },
  { href: "/dashboard/budget-analysis", label: "Budget Analysis", icon: PieChart }
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
          <aside className="border-r bg-white/80 p-4 backdrop-blur lg:min-h-screen">
            <Link href="/dashboard" className="mb-6 block rounded-xl bg-primary p-4 text-primary-foreground shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] opacity-80">Accurate Online</p>
              <h1 className="text-xl font-bold">Finance Dashboard</h1>
            </Link>
            <nav className="grid gap-2">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-muted">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
