"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { calculateVariance, formatPercent, formatRupiah, safeNumber } from "@/lib/formatters";
import type { BalanceSheet, BudgetActual, BudgetInsight, CashFlow, NamedAmount, ProfitLoss, SummaryMetric } from "@/lib/types";

type Props = {
  summary?: SummaryMetric[] | null;
  profitLoss?: ProfitLoss | null;
  balanceSheet?: BalanceSheet | null;
  cashFlow?: CashFlow | null;
  salesByProduct?: NamedAmount[] | null;
  expenseByDepartment?: NamedAmount[] | null;
  budgetVsActual?: BudgetActual[] | null;
  budgetInsights?: BudgetInsight[] | null;
};

function SimpleBarChart({ data, dataKey = "amount" }: { data?: Array<Record<string, string | number>> | null; dataKey?: string }) {
  const safeData = Array.isArray(data) ? data : [];
  if (safeData.length === 0) return <p>Belum ada data.</p>;

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={safeData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={(value: unknown) => `${safeNumber(value) / 1_000_000}jt`} />
        <Tooltip formatter={(value: unknown) => formatRupiah(value)} />
        <Legend />
        <Bar dataKey={dataKey} fill="#2563eb" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function FinanceDashboard(props: Props) {
  const summary = props.summary ?? [];
  const profitLoss = props.profitLoss;
  const balanceSheet = props.balanceSheet;
  const cashFlow = props.cashFlow;
  const salesByProduct = props.salesByProduct ?? [];
  const expenseByDepartment = props.expenseByDepartment ?? [];
  const budgetVsActual = props.budgetVsActual ?? [];
  const budgetInsights = props.budgetInsights ?? [];

  return (
    <>
      <section className="grid" aria-label="Financial Summary Cards">
        {summary.map((item) => (
          <article className="card" key={item.label}>
            <h3>{item.label}</h3>
            <strong>{item.label.includes("Margin") ? formatPercent(item.value) : formatRupiah(item.value)}</strong>
            <p className="badge">{formatPercent(item.changePercent)} vs periode lalu</p>
          </article>
        ))}
      </section>

      <section className="grid" style={{ marginTop: 16 }}>
        <article className="card">
          <h2>Profit &amp; Loss</h2>
          <p>Revenue: {formatRupiah(profitLoss?.revenue)}</p>
          <p>Gross Profit: {formatRupiah(profitLoss?.grossProfit)}</p>
          <p>Net Profit: {formatRupiah(profitLoss?.netProfit)}</p>
          <SimpleBarChart data={(profitLoss?.monthly ?? []).map((item) => ({ name: item.period, amount: item.amount }))} />
        </article>
        <article className="card">
          <h2>Cash Flow</h2>
          <p>Operating: {formatRupiah(cashFlow?.operating)}</p>
          <p>Investing: {formatRupiah(cashFlow?.investing)}</p>
          <p>Financing: {formatRupiah(cashFlow?.financing)}</p>
          <SimpleBarChart data={(cashFlow?.monthly ?? []).map((item) => ({ name: item.period, amount: item.amount }))} />
        </article>
      </section>

      <section className="grid" style={{ marginTop: 16 }}>
        <article className="card">
          <h2>Balance Sheet</h2>
          <p>Assets: {formatRupiah(balanceSheet?.assets)}</p>
          <p>Liabilities: {formatRupiah(balanceSheet?.liabilities)}</p>
          <p>Equity: {formatRupiah(balanceSheet?.equity)}</p>
          <p>Current Ratio: {safeNumber(balanceSheet?.currentAssets) / Math.max(safeNumber(balanceSheet?.currentLiabilities), 1)}</p>
        </article>
        <article className="card">
          <h2>Top 5 Product Sales</h2>
          <SimpleBarChart data={salesByProduct.map((item) => ({ name: item.name, amount: item.amount }))} />
        </article>
        <article className="card">
          <h2>Expense by Department</h2>
          <SimpleBarChart data={expenseByDepartment.map((item) => ({ name: item.name, amount: item.amount }))} />
        </article>
      </section>

      <section className="grid" style={{ marginTop: 16 }}>
        <article className="card">
          <h2>Budget vs Actual</h2>
          <table>
            <thead><tr><th>Kategori</th><th>Budget</th><th>Actual</th><th>Variance</th></tr></thead>
            <tbody>
              {budgetVsActual.map((item) => (
                <tr key={item.category}>
                  <td>{item.category}</td>
                  <td>{formatRupiah(item.budget)}</td>
                  <td>{formatRupiah(item.actual)}</td>
                  <td>{formatPercent(calculateVariance(item.actual, item.budget))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
        <article className="card">
          <h2>Budget Analysis</h2>
          {budgetInsights.map((insight) => (
            <p key={insight.title}><strong>{insight.title}:</strong> {insight.description}</p>
          ))}
        </article>
      </section>
    </>
  );
}
