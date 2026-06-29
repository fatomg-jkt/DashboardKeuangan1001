import React, { useState } from 'https://esm.sh/react@19';
import { createRoot } from 'https://esm.sh/react-dom@19/client';
import {
  BarChart, Bar, CartesianGrid, Cell, Legend, LineChart, Line, PieChart, Pie,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'https://esm.sh/recharts@2.15.4?external=react,react-dom';
import { createRouter, RouterProvider, createRootRoute, createRoute, Outlet, Link } from 'https://esm.sh/@tanstack/react-router@1?external=react,react-dom';
import './styles.css';

const h = React.createElement;
const colors = ['#2563eb', '#0f766e', '#f59e0b', '#7c3aed', '#ef4444', '#14b8a6'];

const months = [
  { month: 'Jan', revenue: 3200000000, expenses: 2050000000, cogs: 1220000000, assets: 7200000000, liabilities: 3300000000, equity: 3900000000, cashIn: 820000000, cashOut: 520000000, endingCash: 1180000000 },
  { month: 'Feb', revenue: 3450000000, expenses: 2140000000, cogs: 1310000000, assets: 7420000000, liabilities: 3380000000, equity: 4040000000, cashIn: 860000000, cashOut: 545000000, endingCash: 1495000000 },
  { month: 'Mar', revenue: 3820000000, expenses: 2320000000, cogs: 1450000000, assets: 7780000000, liabilities: 3520000000, equity: 4260000000, cashIn: 910000000, cashOut: 590000000, endingCash: 1815000000 },
  { month: 'Apr', revenue: 4010000000, expenses: 2460000000, cogs: 1525000000, assets: 8010000000, liabilities: 3610000000, equity: 4400000000, cashIn: 945000000, cashOut: 620000000, endingCash: 2140000000 },
  { month: 'Mei', revenue: 4380000000, expenses: 2630000000, cogs: 1660000000, assets: 8320000000, liabilities: 3720000000, equity: 4600000000, cashIn: 980000000, cashOut: 655000000, endingCash: 2465000000 },
  { month: 'Jun', revenue: 4850000000, expenses: 2890000000, cogs: 1790000000, assets: 8890000000, liabilities: 3920000000, equity: 4970000000, cashIn: 1040000000, cashOut: 705000000, endingCash: 2800000000 },
  { month: 'Jul', revenue: 4720000000, expenses: 2810000000, cogs: 1745000000, assets: 9020000000, liabilities: 3980000000, equity: 5040000000, cashIn: 1010000000, cashOut: 690000000, endingCash: 3120000000 },
  { month: 'Agu', revenue: 5060000000, expenses: 2990000000, cogs: 1870000000, assets: 9350000000, liabilities: 4100000000, equity: 5250000000, cashIn: 1080000000, cashOut: 735000000, endingCash: 3465000000 },
  { month: 'Sep', revenue: 5280000000, expenses: 3090000000, cogs: 1940000000, assets: 9610000000, liabilities: 4210000000, equity: 5400000000, cashIn: 1120000000, cashOut: 760000000, endingCash: 3825000000 },
  { month: 'Okt', revenue: 5510000000, expenses: 3210000000, cogs: 2025000000, assets: 9920000000, liabilities: 4350000000, equity: 5570000000, cashIn: 1160000000, cashOut: 790000000, endingCash: 4195000000 },
  { month: 'Nov', revenue: 5740000000, expenses: 3360000000, cogs: 2105000000, assets: 10180000000, liabilities: 4470000000, equity: 5710000000, cashIn: 1210000000, cashOut: 820000000, endingCash: 4585000000 },
  { month: 'Des', revenue: 6180000000, expenses: 3590000000, cogs: 2260000000, assets: 10650000000, liabilities: 4620000000, equity: 6030000000, cashIn: 1290000000, cashOut: 875000000, endingCash: 5000000000 },
];

const balanceRows = [
  ['Aset Lancar', 5120000000], ['Aset Tetap', 5530000000], ['Total Aset', 10650000000],
  ['Liabilitas', 4620000000], ['Ekuitas', 6030000000], ['Total Liabilitas + Ekuitas', 10650000000],
];
const assetComposition = [{ name: 'Kas & Bank', value: 2100000000 }, { name: 'Piutang', value: 1750000000 }, { name: 'Persediaan', value: 1270000000 }, { name: 'Aset Tetap', value: 5530000000 }];
const budgetRows = [
  { category: 'Marketing', budget: 820000000, actual: 735000000 },
  { category: 'Operasional Kantor', budget: 510000000, actual: 424000000 },
  { category: 'Cloud & Software', budget: 650000000, actual: 690000000 },
  { category: 'Training Karyawan', budget: 180000000, actual: 126000000 },
  { category: 'Perjalanan Dinas', budget: 260000000, actual: 258000000 },
  { category: 'Riset Produk', budget: 430000000, actual: 382000000 },
];
const cashflowRows = [['Cash Inflow', 1290000000], ['Cash Outflow', 875000000], ['Net Cashflow', 415000000], ['Opening Balance', 4585000000], ['Ending Balance', 5000000000]];

export const safeNumber = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
export const formatRupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(safeNumber(value));
const shortMoney = (value) => `${(safeNumber(value) / 1000000000).toFixed(1)}M`;
const netProfit = (m) => safeNumber(m.revenue) - safeNumber(m.cogs) - safeNumber(m.expenses);
const usage = (actual, budget) => budget ? (safeNumber(actual) / safeNumber(budget)) * 100 : 0;
const budgetStatus = (actual, budget) => usage(actual, budget) > 100 ? 'Over Budget' : usage(actual, budget) >= 80 ? 'Perhatian' : 'Aman';

function PageShell({ title, subtitle, children }) {
  const [period, setPeriod] = useState('Bulanan');
  return h(React.Fragment, null,
    h('header', { className: 'topbar' }, h('div', null, h('p', { className: 'eyebrow' }, 'Dashboard Finance Accounting'), h('h1', null, title), h('p', { className: 'subtitle' }, subtitle)), h('div', { className: 'actions' }, h('select', { value: period, onChange: (e) => setPeriod(e.target.value), 'aria-label': 'Filter periode' }, ['Bulanan', 'Kuartalan', 'Tahunan'].map((p) => h('option', { key: p }, p))), h('button', null, 'Export PDF'), h('button', null, 'Export Excel'))),
    children);
}
function KpiCard({ title, value, hint }) { return h('article', { className: 'kpi-card' }, h('span', null, title), h('strong', null, formatRupiah(value)), h('small', null, hint)); }
function DataTable({ columns, rows }) { return h('div', { className: 'table-wrap' }, h('table', null, h('thead', null, h('tr', null, columns.map((c) => h('th', { key: c }, c)))), h('tbody', null, rows))); }
function ChartCard({ title, children }) { return h('section', { className: 'panel chart-panel' }, h('h2', null, title), h('div', { className: 'chart-box' }, children)); }
function MoneyTable({ rows }) { return h(DataTable, { columns: ['Komponen', 'Nilai'], rows: rows.map(([label, value]) => h('tr', { key: label, className: label.startsWith('Total') || label.includes('Laba') || label.includes('Ending') ? 'total-row' : '' }, h('td', null, label), h('td', { className: 'numeric' }, formatRupiah(value)))) }); }
const TooltipMoney = (props) => h(Tooltip, { ...props, formatter: (value) => formatRupiah(value), labelStyle: { color: '#0f172a' } });

function Dashboard() {
  const latest = months.at(-1); const totalBudget = budgetRows.reduce((s, b) => s + b.budget, 0); const totalActual = budgetRows.reduce((s, b) => s + b.actual, 0);
  return h(PageShell, { title: 'Dashboard Utama', subtitle: 'Ringkasan KPI, tren bulanan, dan komposisi keuangan perusahaan.' },
    h('section', { className: 'kpi-grid' }, h(KpiCard, { title: 'Total Pendapatan', value: latest.revenue, hint: 'Desember 2026' }), h(KpiCard, { title: 'Total Beban', value: latest.expenses, hint: 'Termasuk HPP & Opex' }), h(KpiCard, { title: 'Laba Bersih', value: netProfit(latest), hint: 'Margin sehat' }), h(KpiCard, { title: 'Total Aset', value: latest.assets, hint: 'Balance sheet' }), h(KpiCard, { title: 'Kas & Bank', value: latest.endingCash, hint: 'Ending cash' }), h(KpiCard, { title: 'Budget Terpakai', value: totalActual, hint: `${usage(totalActual, totalBudget).toFixed(1)}% dari budget` })),
    h('section', { className: 'grid two-columns' }, h(RevenueExpenseChart), h(NetProfitChart), h(CompositionChart, { title: 'Komposisi Aset, Liabilitas, Ekuitas' })));
}
function RevenueExpenseChart() { return h(ChartCard, { title: 'Pendapatan vs Beban per Bulan' }, h(ResponsiveContainer, null, h(BarChart, { data: months }, h(CartesianGrid, { strokeDasharray: '3 3' }), h(XAxis, { dataKey: 'month' }), h(YAxis, { tickFormatter: shortMoney }), h(TooltipMoney), h(Legend), h(Bar, { dataKey: 'revenue', name: 'Pendapatan', fill: '#2563eb', radius: [8, 8, 0, 0] }), h(Bar, { dataKey: 'expenses', name: 'Beban', fill: '#f59e0b', radius: [8, 8, 0, 0] })))); }
function NetProfitChart() { return h(ChartCard, { title: 'Laba Bersih per Bulan' }, h(ResponsiveContainer, null, h(LineChart, { data: months.map((m) => ({ ...m, profit: netProfit(m) })) }, h(CartesianGrid, { strokeDasharray: '3 3' }), h(XAxis, { dataKey: 'month' }), h(YAxis, { tickFormatter: shortMoney }), h(TooltipMoney), h(Line, { type: 'monotone', dataKey: 'profit', name: 'Laba Bersih', stroke: '#0f766e', strokeWidth: 3, dot: false })))); }
function CompositionChart({ title }) { const latest = months.at(-1); const data = [{ name: 'Aset', value: latest.assets }, { name: 'Liabilitas', value: latest.liabilities }, { name: 'Ekuitas', value: latest.equity }]; return h(ChartCard, { title }, h(ResponsiveContainer, null, h(PieChart, null, h(Pie, { data, dataKey: 'value', nameKey: 'name', innerRadius: 55, outerRadius: 95, paddingAngle: 4 }, data.map((_, i) => h(Cell, { key: i, fill: colors[i] }))), h(TooltipMoney), h(Legend)))); }
function BalanceSheet() { const latest = months.at(-1); return h(PageShell, { title: 'Laporan Neraca', subtitle: 'Posisi aset, liabilitas, dan ekuitas dengan struktur balance.' }, h('section', { className: 'grid two-columns' }, h('section', { className: 'panel' }, h('h2', null, 'Tabel Laporan Neraca'), h(MoneyTable, { rows: balanceRows })), h(ChartCard, { title: 'Grafik Komposisi Aset' }, h(ResponsiveContainer, null, h(PieChart, null, h(Pie, { data: assetComposition, dataKey: 'value', nameKey: 'name', outerRadius: 100 }, assetComposition.map((_, i) => h(Cell, { key: i, fill: colors[i] }))), h(TooltipMoney), h(Legend)))), h(CompositionChart, { title: 'Perbandingan Aset, Liabilitas, dan Ekuitas' }))); }
function ProfitLoss() { const latest = months.at(-1); const gross = latest.revenue - latest.cogs; return h(PageShell, { title: 'Laporan Laba Rugi', subtitle: 'Pendapatan, beban, dan margin profitabilitas perusahaan.' }, h('section', { className: 'grid two-columns' }, h('section', { className: 'panel' }, h('h2', null, 'Tabel Laba Rugi'), h(MoneyTable, { rows: [['Pendapatan', latest.revenue], ['Harga Pokok Penjualan', latest.cogs], ['Laba Kotor', gross], ['Beban Operasional', latest.expenses - latest.cogs], ['Laba Operasional', latest.revenue - latest.expenses], ['Laba Bersih', netProfit(latest)]] })), h(RevenueExpenseChart), h(NetProfitChart), h(ChartCard, { title: 'Margin Laba Kotor dan Laba Bersih' }, h(ResponsiveContainer, null, h(LineChart, { data: months.map((m) => ({ month: m.month, grossMargin: ((m.revenue - m.cogs) / m.revenue) * 100, netMargin: (netProfit(m) / m.revenue) * 100 })) }, h(CartesianGrid, { strokeDasharray: '3 3' }), h(XAxis, { dataKey: 'month' }), h(YAxis, { tickFormatter: (v) => `${v}%` }), h(Tooltip, { formatter: (v) => `${Number(v).toFixed(1)}%` }), h(Legend), h(Line, { dataKey: 'grossMargin', name: 'Margin Laba Kotor', stroke: '#2563eb', strokeWidth: 3 }), h(Line, { dataKey: 'netMargin', name: 'Margin Laba Bersih', stroke: '#0f766e', strokeWidth: 3 })))))); }
function Budgeting() { return h(PageShell, { title: 'Laporan Budgeting', subtitle: 'Monitoring budget vs actual lengkap dengan status otomatis.' }, h('section', { className: 'grid two-columns' }, h('section', { className: 'panel wide' }, h('h2', null, 'Budget vs Actual'), h(DataTable, { columns: ['Kategori', 'Budget', 'Actual', 'Selisih', 'Persentase Pemakaian', 'Status'], rows: budgetRows.map((b) => { const pct = usage(b.actual, b.budget); const status = budgetStatus(b.actual, b.budget); return h('tr', { key: b.category }, h('td', null, b.category), h('td', { className: 'numeric' }, formatRupiah(b.budget)), h('td', { className: 'numeric' }, formatRupiah(b.actual)), h('td', { className: 'numeric' }, formatRupiah(b.budget - b.actual)), h('td', { className: 'numeric' }, `${pct.toFixed(1)}%`), h('td', null, h('span', { className: `status ${status.toLowerCase().replace(' ', '-')}` }, status))); }) })), h(ChartCard, { title: 'Budget vs Actual per Kategori' }, h(ResponsiveContainer, null, h(BarChart, { data: budgetRows }, h(CartesianGrid, { strokeDasharray: '3 3' }), h(XAxis, { dataKey: 'category' }), h(YAxis, { tickFormatter: shortMoney }), h(TooltipMoney), h(Legend), h(Bar, { dataKey: 'budget', name: 'Budget', fill: '#2563eb' }), h(Bar, { dataKey: 'actual', name: 'Actual', fill: '#f59e0b' })))), h(ChartCard, { title: 'Persentase Pemakaian Budget' }, h(ResponsiveContainer, null, h(BarChart, { data: budgetRows.map((b) => ({ category: b.category, percentage: usage(b.actual, b.budget) })) }, h(CartesianGrid, { strokeDasharray: '3 3' }), h(XAxis, { dataKey: 'category' }), h(YAxis, { tickFormatter: (v) => `${v}%` }), h(Tooltip, { formatter: (v) => `${Number(v).toFixed(1)}%` }), h(Bar, { dataKey: 'percentage', name: 'Pemakaian', fill: '#0f766e', radius: [8, 8, 0, 0] })))))); }
function Cashflow() { return h(PageShell, { title: 'Laporan Cashflow', subtitle: 'Arus kas masuk, keluar, net cashflow, dan ending balance.' }, h('section', { className: 'grid two-columns' }, h('section', { className: 'panel' }, h('h2', null, 'Laporan Arus Kas'), h(MoneyTable, { rows: cashflowRows })), h(ChartCard, { title: 'Cash Inflow vs Cash Outflow per Bulan' }, h(ResponsiveContainer, null, h(BarChart, { data: months }, h(CartesianGrid, { strokeDasharray: '3 3' }), h(XAxis, { dataKey: 'month' }), h(YAxis, { tickFormatter: shortMoney }), h(TooltipMoney), h(Legend), h(Bar, { dataKey: 'cashIn', name: 'Cash Inflow', fill: '#0f766e' }), h(Bar, { dataKey: 'cashOut', name: 'Cash Outflow', fill: '#ef4444' })))), h(ChartCard, { title: 'Ending Cash Balance per Bulan' }, h(ResponsiveContainer, null, h(LineChart, { data: months }, h(CartesianGrid, { strokeDasharray: '3 3' }), h(XAxis, { dataKey: 'month' }), h(YAxis, { tickFormatter: shortMoney }), h(TooltipMoney), h(Line, { dataKey: 'endingCash', name: 'Ending Balance', stroke: '#2563eb', strokeWidth: 3, dot: false })))))); }

const menu = [['/', 'Dashboard Utama', Dashboard], ['/neraca', 'Laporan Neraca', BalanceSheet], ['/laba-rugi', 'Laporan Laba Rugi', ProfitLoss], ['/budgeting', 'Laporan Budgeting', Budgeting], ['/cashflow', 'Laporan Cashflow', Cashflow]];
const rootRoute = createRootRoute({ component: () => h('div', { className: 'app-shell' }, h('aside', { className: 'sidebar' }, h('div', { className: 'brand' }, h('div', { className: 'brand-mark' }, 'FA'), h('div', null, h('strong', null, 'Dashboard Finance'), h('span', null, 'Accounting'))), h('nav', null, menu.map(([to, label]) => h(Link, { key: to, to, activeProps: { className: 'active' } }, label)))), h('main', { className: 'content' }, h(Outlet))) });
const routes = menu.map(([path, , component]) => createRoute({ getParentRoute: () => rootRoute, path: path === '/' ? '/' : path.slice(1), component }));
const routeTree = rootRoute.addChildren(routes);
const router = createRouter({ routeTree });

createRoot(document.getElementById('root')).render(h(RouterProvider, { router }));
