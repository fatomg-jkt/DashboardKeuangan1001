import React from 'https://esm.sh/react@19';
import { createRoot } from 'https://esm.sh/react-dom@19/client';
import './styles.css';

const h = React.createElement;

const financeData = {
  company: 'PT Nusantara Finance Digital',
  period: { month: 'Juni', year: '2026' },
  kpis: {
    totalAssets: 12850000000,
    totalLiabilities: 5210000000,
    totalEquity: 7640000000,
    totalRevenue: 6420000000,
    totalExpenses: 4180000000,
    cashBalance: 1865000000,
  },
  monthlyPerformance: [
    { month: 'Jan', revenue: 840000000, expenses: 570000000, netProfit: 270000000, cashIn: 910000000, cashOut: 620000000, budget: 540000000, actual: 570000000 },
    { month: 'Feb', revenue: 910000000, expenses: 610000000, netProfit: 300000000, cashIn: 950000000, cashOut: 655000000, budget: 590000000, actual: 610000000 },
    { month: 'Mar', revenue: 1020000000, expenses: 655000000, netProfit: 365000000, cashIn: 1090000000, cashOut: 690000000, budget: 640000000, actual: 655000000 },
    { month: 'Apr', revenue: 1115000000, expenses: 720000000, netProfit: 395000000, cashIn: 1200000000, cashOut: 760000000, budget: 700000000, actual: 720000000 },
    { month: 'Mei', revenue: 1195000000, expenses: 785000000, netProfit: 410000000, cashIn: 1270000000, cashOut: 805000000, budget: 770000000, actual: 785000000 },
    { month: 'Jun', revenue: 1340000000, expenses: 840000000, netProfit: 500000000, cashIn: 1420000000, cashOut: 900000000, budget: 820000000, actual: 840000000 },
  ],
  balanceSheet: [
    { account: 'Kas & Bank', amount: 1865000000 },
    { account: 'Piutang Usaha', amount: 2460000000 },
    { account: 'Persediaan', amount: 1745000000 },
    { account: 'Aset Tetap', amount: 6780000000 },
  ],
  liabilitiesEquity: [
    { account: 'Utang Usaha', amount: 1320000000 },
    { account: 'Pinjaman Bank', amount: 2890000000 },
    { account: 'Beban Akrual', amount: 1000000000 },
    { account: 'Modal Disetor', amount: 5000000000 },
    { account: 'Laba Ditahan', amount: 2640000000 },
  ],
  incomeStatement: [
    { account: 'Pendapatan Jasa', amount: 4260000000 },
    { account: 'Pendapatan Produk', amount: 2160000000 },
    { account: 'Beban Operasional', amount: -2510000000 },
    { account: 'Beban Gaji', amount: -1190000000 },
    { account: 'Beban Administrasi', amount: -480000000 },
  ],
  masterData: [
    { code: '1001', name: 'Kas Operasional', type: 'Aset Lancar' },
    { code: '1102', name: 'Piutang Usaha', type: 'Aset Lancar' },
    { code: '2101', name: 'Utang Usaha', type: 'Liabilitas' },
    { code: '4001', name: 'Pendapatan Jasa', type: 'Pendapatan' },
    { code: '5101', name: 'Beban Operasional', type: 'Beban' },
  ],
};

export const safeNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

export const formatRupiah = (value) => new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
}).format(safeNumber(value));

const sumBy = (items, key) => items.reduce((total, item) => total + safeNumber(item[key]), 0);
const netProfit = financeData.kpis.totalRevenue - financeData.kpis.totalExpenses;

function Sidebar() {
  const menus = [
    { label: 'Dashboard Utama', icon: '📊' },
    { label: 'Laporan Keuangan', icon: '📑', children: ['Neraca', 'Laba Rugi'] },
    { label: 'Budgeting', icon: '🎯' },
    { label: 'Cashflow', icon: '💸' },
    { label: 'Master Data', icon: '🗂️' },
  ];
  return h('aside', { className: 'sidebar' },
    h('div', { className: 'brand' }, h('span', null, 'F'), h('div', null, h('strong', null, 'FinAcc'), h('small', null, 'Accounting Dashboard'))),
    h('nav', { className: 'menu', 'aria-label': 'Menu dashboard' }, menus.map((menu) => h('div', { key: menu.label, className: 'menu-group' },
      h('a', { href: '#', className: menu.label === 'Dashboard Utama' ? 'active' : '' }, h('span', null, menu.icon), menu.label),
      menu.children && h('div', { className: 'submenu' }, menu.children.map((child) => h('a', { href: '#laporan', key: child }, child))),
    ))),
    h('div', { className: 'sidebar-card' }, h('small', null, 'Periode aktif'), h('strong', null, `${financeData.period.month} ${financeData.period.year}`)),
  );
}

function KpiCard({ title, value, tone }) {
  return h('article', { className: `kpi-card ${tone || ''}` }, h('p', null, title), h('strong', null, formatRupiah(value)));
}

function BarChart({ title, data, series, valueKey = 'month' }) {
  const max = Math.max(...data.flatMap((item) => series.map((s) => safeNumber(item[s.key]))), 1);
  return h('section', { className: 'chart-card' },
    h('div', { className: 'section-heading' }, h('h2', null, title), h('div', { className: 'legend' }, series.map((s) => h('span', { key: s.key }, h('i', { style: { background: s.color } }), s.label)))),
    h('div', { className: 'bar-chart' }, data.map((item) => h('div', { className: 'bar-group', key: item[valueKey] },
      h('div', { className: 'bars' }, series.map((s) => h('span', { key: s.key, title: `${s.label}: ${formatRupiah(item[s.key])}`, style: { height: `${Math.max((safeNumber(item[s.key]) / max) * 100, 4)}%`, background: s.color } }))),
      h('small', null, item[valueKey]),
    ))),
  );
}

function LineChart({ title, data }) {
  const max = Math.max(...data.map((item) => item.netProfit), 1);
  const points = data.map((item, index) => `${(index / (data.length - 1)) * 100},${100 - ((item.netProfit / max) * 86 + 7)}`).join(' ');
  return h('section', { className: 'chart-card' },
    h('div', { className: 'section-heading' }, h('h2', null, title), h('span', { className: 'pill' }, `YTD ${formatRupiah(sumBy(data, 'netProfit'))}`)),
    h('svg', { className: 'line-chart', viewBox: '0 0 100 100', preserveAspectRatio: 'none', role: 'img', 'aria-label': title },
      h('polyline', { points, fill: 'none', stroke: '#2563eb', strokeWidth: '3', vectorEffect: 'non-scaling-stroke' }),
      data.map((item, index) => h('circle', { key: item.month, cx: (index / (data.length - 1)) * 100, cy: 100 - ((item.netProfit / max) * 86 + 7), r: '1.8', fill: '#0f172a' })),
    ),
    h('div', { className: 'axis' }, data.map((item) => h('span', { key: item.month }, item.month))),
  );
}

function DataTable({ columns, rows }) {
  return h('div', { className: 'table-wrap' }, h('table', null,
    h('thead', null, h('tr', null, columns.map((column) => h('th', { key: column }, column)))),
    h('tbody', null, rows),
  ));
}

const amountCell = (value) => h('td', { className: safeNumber(value) < 0 ? 'numeric negative' : 'numeric' }, formatRupiah(value));

function App() {
  const kpis = [
    ['Total Aset', financeData.kpis.totalAssets, 'blue'],
    ['Total Liabilitas', financeData.kpis.totalLiabilities, 'amber'],
    ['Total Ekuitas', financeData.kpis.totalEquity, 'green'],
    ['Total Pendapatan', financeData.kpis.totalRevenue, 'blue'],
    ['Total Beban', financeData.kpis.totalExpenses, 'red'],
    ['Laba Bersih', netProfit, 'green'],
    ['Saldo Kas', financeData.kpis.cashBalance, 'purple'],
  ];

  return h('div', { className: 'app-shell' },
    h(Sidebar),
    h('main', { className: 'content' },
      h('header', { className: 'topbar' }, h('div', null, h('p', { className: 'eyebrow' }, 'Dashboard Finance Accounting'), h('h1', null, financeData.company), h('p', null, 'Monitoring KPI, laporan keuangan, budgeting, dan cashflow dari dummy data JavaScript lokal.')), h('button', null, 'Export Report')),
      h('section', { className: 'kpi-grid' }, kpis.map(([title, value, tone]) => h(KpiCard, { key: title, title, value, tone }))),
      h('section', { className: 'charts-grid' },
        h(BarChart, { title: 'Pendapatan vs Beban per Bulan', data: financeData.monthlyPerformance, series: [{ key: 'revenue', label: 'Pendapatan', color: '#2563eb' }, { key: 'expenses', label: 'Beban', color: '#f97316' }] }),
        h(LineChart, { title: 'Laba Bersih per Bulan', data: financeData.monthlyPerformance }),
        h(BarChart, { title: 'Cashflow Masuk dan Keluar', data: financeData.monthlyPerformance, series: [{ key: 'cashIn', label: 'Kas Masuk', color: '#16a34a' }, { key: 'cashOut', label: 'Kas Keluar', color: '#dc2626' }] }),
        h(BarChart, { title: 'Budget vs Actual', data: financeData.monthlyPerformance, series: [{ key: 'budget', label: 'Budget', color: '#7c3aed' }, { key: 'actual', label: 'Actual', color: '#0891b2' }] }),
      ),
      h('section', { id: 'laporan', className: 'tables-grid' },
        h('article', { className: 'panel' }, h('div', { className: 'section-heading' }, h('h2', null, 'Neraca')), h(DataTable, { columns: ['Akun', 'Nilai'], rows: [...financeData.balanceSheet, ...financeData.liabilitiesEquity].map((row) => h('tr', { key: row.account }, h('td', null, row.account), amountCell(row.amount))) })),
        h('article', { className: 'panel' }, h('div', { className: 'section-heading' }, h('h2', null, 'Laba Rugi')), h(DataTable, { columns: ['Akun', 'Nilai'], rows: financeData.incomeStatement.map((row) => h('tr', { key: row.account }, h('td', null, row.account), amountCell(row.amount))) })),
        h('article', { className: 'panel' }, h('div', { className: 'section-heading' }, h('h2', null, 'Master Data COA')), h(DataTable, { columns: ['Kode', 'Nama Akun', 'Tipe'], rows: financeData.masterData.map((row) => h('tr', { key: row.code }, h('td', null, row.code), h('td', null, row.name), h('td', null, row.type))) })),
      ),
    ),
  );
}

createRoot(document.getElementById('root')).render(h(App));
