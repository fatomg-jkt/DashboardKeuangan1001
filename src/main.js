import React from 'https://esm.sh/react@19';
import { createRoot } from 'https://esm.sh/react-dom@19/client';
import './styles.css';

const h = React.createElement;

const dashboardData = {
  period: { month: 'Juni', year: '2026' },
  profitLoss: { revenue: 4850000000, cogs: 2175000000, expense: 1280000000 },
  balanceSheet: { totalAssets: 8890000000, totalLiabilities: 4400000000, totalEquity: 4490000000 },
  cashflow: { beginningCash: 980000000, cashIn: 1040000000, cashOut: 420000000 },
  topProducts: [
    { name: 'Enterprise Analytics Suite', sales: 1425000000 },
    { name: 'Payroll Automation', sales: 980000000 },
    { name: 'POS Retail Pro', sales: 780000000 },
    { name: 'Inventory Cloud', sales: 545000000 },
    { name: 'Finance API Add-on', sales: 410000000 },
  ],
  expensesByDepartment: [
    { department: 'Sales & Marketing', expense: 465000000 },
    { department: 'Operasional', expense: 325000000 },
    { department: 'Teknologi', expense: 285000000 },
    { department: 'HR & General Affairs', expense: 135000000 },
    { department: 'Finance & Legal', expense: 70000000 },
  ],
  budgets: [
    { category: 'Marketing Campaign', budget: 420000000, actual: 485000000 },
    { category: 'Cloud Infrastructure', budget: 310000000, actual: 292000000 },
    { category: 'Training Karyawan', budget: 95000000, actual: 95000000 },
    { category: 'Perjalanan Dinas', budget: 125000000, actual: 102000000 },
    { category: 'Riset Produk', budget: 210000000, actual: 242000000 },
  ],
};

export const safeNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

export const formatRupiah = (value) => new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
}).format(safeNumber(value));

const getBudgetStatus = (budget, actual) => {
  if (safeNumber(actual) > safeNumber(budget)) return 'Over Budget';
  if (safeNumber(actual) < safeNumber(budget)) return 'Under Budget';
  return 'On Track';
};

const moneyClass = (value) => (safeNumber(value) < 0 ? 'negative' : 'positive');

const calculateDashboard = (data) => {
  const revenue = safeNumber(data?.profitLoss?.revenue);
  const cogs = safeNumber(data?.profitLoss?.cogs);
  const expense = safeNumber(data?.profitLoss?.expense);
  const grossProfit = revenue - cogs;
  const netProfit = grossProfit - expense;
  const totalAssets = safeNumber(data?.balanceSheet?.totalAssets);
  const totalLiabilities = safeNumber(data?.balanceSheet?.totalLiabilities);
  const totalEquity = safeNumber(data?.balanceSheet?.totalEquity);
  const liabilitiesPlusEquity = totalLiabilities + totalEquity;
  const beginningCash = safeNumber(data?.cashflow?.beginningCash);
  const cashIn = safeNumber(data?.cashflow?.cashIn);
  const cashOut = safeNumber(data?.cashflow?.cashOut);
  const endingCash = beginningCash + cashIn - cashOut;
  return { revenue, cogs, grossProfit, expense, netProfit, totalAssets, totalLiabilities, totalEquity, liabilitiesPlusEquity, beginningCash, cashIn, cashOut, endingCash, isBalanceSheetBalanced: totalAssets === liabilitiesPlusEquity };
};

function KpiCard({ title, value }) { return h('article', { className: 'kpi-card' }, h('p', null, title), h('strong', null, formatRupiah(value))); }
function DataTable({ columns, rows, emptyText = 'Data belum tersedia' }) { return h('div', { className: 'table-wrap' }, h('table', null, h('thead', null, h('tr', null, columns.map((column) => h('th', { key: column }, column)))), h('tbody', null, rows.length ? rows : h('tr', null, h('td', { colSpan: columns.length, className: 'empty-state' }, emptyText))))); }
const moneyRow = ([label, value]) => h('tr', { key: label }, h('td', null, label), h('td', { className: `numeric ${moneyClass(value)}` }, formatRupiah(value)));
const plainMoneyRow = ([label, value]) => h('tr', { key: label }, h('td', null, label), h('td', { className: 'numeric' }, formatRupiah(value)));

function App() {
  const f = calculateDashboard(dashboardData);
  const products = Array.isArray(dashboardData.topProducts) ? dashboardData.topProducts.slice(0, 5) : [];
  const departments = Array.isArray(dashboardData.expensesByDepartment) ? dashboardData.expensesByDepartment : [];
  const budgets = Array.isArray(dashboardData.budgets) ? dashboardData.budgets : [];
  return h('main', { className: 'dashboard' },
    h('header', { className: 'hero' },
      h('div', null, h('p', { className: 'eyebrow' }, 'Ringkasan Keuangan'), h('h1', null, 'Dashboard Keuangan'), h('p', { className: 'hero-copy' }, 'Dashboard React sederhana dengan dummy data lokal, aman dari data kosong, dan siap dijalankan di Vercel.')),
      h('div', { className: 'filters', 'aria-label': 'Filter periode' },
        h('label', null, 'Bulan', h('select', { defaultValue: dashboardData.period.month }, ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'].map((m) => h('option', { key: m }, m)))),
        h('label', null, 'Tahun', h('select', { defaultValue: dashboardData.period.year }, ['2024', '2025', '2026'].map((y) => h('option', { key: y }, y)))))),
    h('section', { className: 'kpi-grid' },
      h(KpiCard, { title: 'Total Pendapatan', value: f.revenue }), h(KpiCard, { title: 'Laba Kotor', value: f.grossProfit }), h(KpiCard, { title: 'Laba Bersih', value: f.netProfit }), h(KpiCard, { title: 'Total Aset', value: f.totalAssets }), h(KpiCard, { title: 'Kas & Bank', value: f.endingCash })),
    !f.isBalanceSheetBalanced && h('div', { className: 'warning' }, 'Balance Sheet tidak balance'),
    h('section', { className: 'grid two-columns' },
      h('div', { className: 'panel' }, h('h2', null, 'Profit & Loss'), h(DataTable, { columns: ['Komponen', 'Nilai'], rows: [['Pendapatan', f.revenue], ['HPP', f.cogs], ['Laba Kotor', f.grossProfit], ['Expense', f.expense], ['Laba Bersih', f.netProfit]].map(moneyRow) })),
      h('div', { className: 'panel' }, h('h2', null, 'Balance Sheet'), h(DataTable, { columns: ['Komponen', 'Nilai'], rows: [['Total Aset', f.totalAssets], ['Total Liabilitas', f.totalLiabilities], ['Total Ekuitas', f.totalEquity], ['Total Liabilitas + Ekuitas', f.liabilitiesPlusEquity]].map(plainMoneyRow) }))),
    h('section', { className: 'grid two-columns' },
      h('div', { className: 'panel' }, h('h2', null, 'Cashflow'), h(DataTable, { columns: ['Komponen', 'Nilai'], rows: [['Kas Awal', f.beginningCash], ['Kas Masuk', f.cashIn], ['Kas Keluar', f.cashOut], ['Kas Akhir', f.endingCash]].map(plainMoneyRow) })),
      h('div', { className: 'panel' }, h('h2', null, 'Top 5 Penjualan Produk'), h(DataTable, { columns: ['Nama Produk', 'Total Penjualan'], rows: products.map((p) => h('tr', { key: p.name }, h('td', null, p.name || 'Produk tanpa nama'), h('td', { className: 'numeric' }, formatRupiah(p.sales)))) }))),
    h('section', { className: 'grid two-columns' },
      h('div', { className: 'panel' }, h('h2', null, 'Expense by Department'), h(DataTable, { columns: ['Department', 'Total Expense'], rows: departments.map((d) => h('tr', { key: d.department }, h('td', null, d.department || 'Department tidak diketahui'), h('td', { className: 'numeric' }, formatRupiah(d.expense)))) })),
      h('div', { className: 'panel' }, h('h2', null, 'Budget vs Actual'), h(DataTable, { columns: ['Kategori', 'Budget', 'Actual', 'Selisih', 'Status'], rows: budgets.map((item) => { const budget = safeNumber(item.budget); const actual = safeNumber(item.actual); const difference = actual - budget; const status = getBudgetStatus(budget, actual); return h('tr', { key: item.category }, h('td', null, item.category || 'Kategori tanpa nama'), h('td', { className: 'numeric' }, formatRupiah(budget)), h('td', { className: 'numeric' }, formatRupiah(actual)), h('td', { className: `numeric ${moneyClass(difference)}` }, formatRupiah(difference)), h('td', null, h('span', { className: `status ${status.toLowerCase().replaceAll(' ', '-')}` }, status))); }) })))
  );
}

createRoot(document.getElementById('root')).render(h(App));
