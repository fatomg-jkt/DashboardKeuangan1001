import './styles.css';

const colors = ['#2563eb', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#22c55e'];

const dashboardData = {
  period: { month: 'Juni', quarter: 'Q2', year: '2026' },
  profitLoss: { revenue: 4850000000, cogs: 2175000000, operatingExpenses: 1280000000, otherIncomeExpense: -85000000 },
  balanceSheet: { currentAssets: 3640000000, fixedAssets: 5250000000, currentLiabilities: 1790000000, longTermLiabilities: 2610000000, equity: 4490000000 },
  cashflow: { operating: 865000000, investing: -420000000, financing: 175000000, beginningCash: 980000000 },
  topProducts: [
    { name: 'Enterprise Analytics Suite', sales: 1425000000, units: 95 },
    { name: 'Payroll Automation', sales: 980000000, units: 140 },
    { name: 'POS Retail Pro', sales: 780000000, units: 260 },
    { name: 'Inventory Cloud', sales: 545000000, units: 180 },
    { name: 'Finance API Add-on', sales: 410000000, units: 310 },
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

const safeNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};
const safeDivide = (value, total) => safeNumber(total) === 0 ? 0 : safeNumber(value) / safeNumber(total);
const formatRupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(safeNumber(value));
const formatPercent = (value) => `${(safeNumber(value) * 100).toFixed(1)}%`;
const getBudgetStatus = (budget, actual) => safeNumber(actual) > safeNumber(budget) ? 'Over Budget' : safeNumber(actual) < safeNumber(budget) ? 'Under Budget' : 'On Track';

const calculateFinancials = (data = {}) => {
  const pl = data.profitLoss || {}, bs = data.balanceSheet || {}, cf = data.cashflow || {};
  const revenue = safeNumber(pl.revenue), cogs = safeNumber(pl.cogs), grossProfit = revenue - cogs;
  const operatingExpenses = safeNumber(pl.operatingExpenses), operatingProfit = grossProfit - operatingExpenses;
  const otherIncomeExpense = safeNumber(pl.otherIncomeExpense), netProfit = operatingProfit + otherIncomeExpense;
  const totalAssets = safeNumber(bs.currentAssets) + safeNumber(bs.fixedAssets);
  const totalLiabilities = safeNumber(bs.currentLiabilities) + safeNumber(bs.longTermLiabilities);
  const liabilitiesAndEquity = totalLiabilities + safeNumber(bs.equity);
  const cashChange = safeNumber(cf.operating) + safeNumber(cf.investing) + safeNumber(cf.financing);
  return { revenue, cogs, grossProfit, operatingExpenses, operatingProfit, otherIncomeExpense, netProfit, grossMargin: safeDivide(grossProfit, revenue), netMargin: safeDivide(netProfit, revenue), currentAssets: safeNumber(bs.currentAssets), fixedAssets: safeNumber(bs.fixedAssets), totalAssets, currentLiabilities: safeNumber(bs.currentLiabilities), longTermLiabilities: safeNumber(bs.longTermLiabilities), totalLiabilities, equity: safeNumber(bs.equity), liabilitiesAndEquity, isBalanceSheetBalanced: totalAssets === liabilitiesAndEquity, cashflow: { operating: safeNumber(cf.operating), investing: safeNumber(cf.investing), financing: safeNumber(cf.financing), cashChange, beginningCash: safeNumber(cf.beginningCash), endingCash: safeNumber(cf.beginningCash) + cashChange } };
};
const prepareProducts = (products = []) => { const rows = Array.isArray(products) ? products : []; const total = rows.reduce((sum, item) => sum + safeNumber(item?.sales), 0); return rows.slice(0, 5).map((item) => ({ name: item?.name || 'Produk tanpa nama', sales: safeNumber(item?.sales), units: safeNumber(item?.units), contribution: safeDivide(item?.sales, total) })); };
const prepareExpenses = (expenses = []) => { const rows = Array.isArray(expenses) ? expenses : []; const total = rows.reduce((sum, item) => sum + safeNumber(item?.expense), 0); return rows.map((item) => ({ department: item?.department || 'Departemen tidak diketahui', expense: safeNumber(item?.expense), percentage: safeDivide(item?.expense, total) })); };
const prepareBudgets = (budgets) => !Array.isArray(budgets) || budgets.length === 0 ? [] : budgets.map((item) => { const budget = safeNumber(item?.budget), actual = safeNumber(item?.actual), variance = actual - budget; return { category: item?.category || 'Kategori tanpa nama', budget, actual, variance, realization: safeDivide(actual, budget), status: getBudgetStatus(budget, actual), warning: budget > 0 && actual > budget * 1.1 }; });

const moneyClass = (value) => safeNumber(value) < 0 ? 'negative' : 'positive';
const row = (cells) => `<tr>${cells.map((cell) => `<td class="${cell.class || ''}">${cell.value}</td>`).join('')}</tr>`;
const table = (columns, rows, emptyText = 'Data belum tersedia') => `<div class="table-wrap"><table><thead><tr>${columns.map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.length ? rows.join('') : `<tr><td class="empty-state" colspan="${columns.length}">${emptyText}</td></tr>`}</tbody></table></div>`;
const kpi = (title, value, icon, tone = 'blue', helper = '') => `<article class="kpi-card ${tone}"><div><p>${title}</p><h3>${value}</h3>${helper ? `<span>${helper}</span>` : ''}</div><div class="kpi-icon">${icon}</div></article>`;
const bars = (items) => `<div class="bar-chart">${items.map((item, i) => `<div class="bar-row"><span>${item.name}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.max(item.contribution * 100, 3)}%;background:${colors[i % colors.length]}"></div></div><strong>${formatPercent(item.contribution)}</strong></div>`).join('')}</div>`;
const donut = (items) => { let acc = 0; const gradient = items.map((item, i) => { const start = acc; acc += item.percentage * 100; return `${colors[i % colors.length]} ${start}% ${acc}%`; }).join(', '); return `<div class="donut-wrap"><div class="donut" style="background:conic-gradient(${gradient || '#e2e8f0 0 100%'})"></div><div class="legend-list">${items.map((item, i) => `<span><i style="background:${colors[i % colors.length]}"></i>${item.department}</span>`).join('')}</div></div>`; };

function renderDashboard(data) {
  const f = calculateFinancials(data), products = prepareProducts(data.topProducts), expenses = prepareExpenses(data.expensesByDepartment), budgets = prepareBudgets(data.budgets), warnings = budgets.filter((item) => item.warning);
  const plRows = [['Pendapatan', f.revenue], ['Harga Pokok Penjualan', -f.cogs], ['Laba Kotor', f.grossProfit], ['Beban Operasional', -f.operatingExpenses], ['Laba Operasional', f.operatingProfit], ['Pendapatan / Beban Lain-lain', f.otherIncomeExpense], ['Laba Bersih', f.netProfit]].map(([label, value]) => row([{ value: label }, { value: formatRupiah(value), class: `numeric ${moneyClass(value)}` }]));
  const bsRows = [['Aset Lancar', f.currentAssets], ['Aset Tetap', f.fixedAssets], ['Total Aset', f.totalAssets], ['Liabilitas Lancar', f.currentLiabilities], ['Liabilitas Jangka Panjang', f.longTermLiabilities], ['Total Liabilitas', f.totalLiabilities], ['Ekuitas', f.equity], ['Total Liabilitas + Ekuitas', f.liabilitiesAndEquity]].map(([label, value]) => row([{ value: label }, { value: formatRupiah(value), class: 'numeric' }]));
  const cfRows = [['Arus Kas Operasional', f.cashflow.operating], ['Arus Kas Investasi', f.cashflow.investing], ['Arus Kas Pendanaan', f.cashflow.financing], ['Kenaikan / Penurunan Kas', f.cashflow.cashChange], ['Saldo Kas Awal', f.cashflow.beginningCash], ['Saldo Kas Akhir', f.cashflow.endingCash]].map(([label, value]) => row([{ value: label }, { value: formatRupiah(value), class: `numeric ${moneyClass(value)}` }]));
  document.querySelector('#app').innerHTML = `<main class="dashboard"><header class="hero"><div><span class="eyebrow">▣ Periode laporan</span><h1>Dashboard Keuangan</h1><p>Ringkasan performa keuangan perusahaan dengan validasi anti-error dan data dummy realistis yang mudah diganti ke API atau database.</p></div><div class="filters"><select><option>${data.period.month}</option><option>Mei</option></select><select><option>${data.period.quarter}</option><option>Q1</option></select><select><option>${data.period.year}</option><option>2025</option></select></div></header><section class="kpi-grid">${kpi('Total Pendapatan', formatRupiah(f.revenue), '📊')}${kpi('Laba Kotor', formatRupiah(f.grossProfit), '↗', 'green', formatPercent(f.grossMargin))}${kpi('Laba Bersih', formatRupiah(f.netProfit), '📈', 'purple', formatPercent(f.netMargin))}${kpi('Total Aset', formatRupiah(f.totalAssets), '🏢', 'amber')}${kpi('Kas & Bank', formatRupiah(f.cashflow.endingCash), '🏦', 'teal')}${kpi('Margin Laba Kotor', formatPercent(f.grossMargin), '◔', 'green')}${kpi('Margin Laba Bersih', formatPercent(f.netMargin), '💳', 'purple')}</section>${f.isBalanceSheetBalanced ? '' : `<div class="warning">⚠️ Total Aset tidak sama dengan Total Liabilitas + Ekuitas. Selisih: ${formatRupiah(f.totalAssets - f.liabilitiesAndEquity)}</div>`}${warnings.map((item) => `<div class="warning">⚠️ ${item.category} melebihi budget lebih dari 10%.</div>`).join('')}<section class="grid two"><div class="panel"><h2>Profit & Loss</h2>${table(['Komponen', 'Nilai'], plRows)}</div><div class="panel"><h2>Cashflow / Arus Kas</h2>${table(['Komponen', 'Nilai'], cfRows)}</div></section><section class="panel"><h2>Balance Sheet</h2>${table(['Komponen', 'Nilai'], bsRows)}</section><section class="grid two"><div class="panel"><h2>Top 5 Penjualan Produk</h2>${bars(products)}${table(['Nama Produk', 'Total Penjualan', 'Jumlah Terjual', 'Kontribusi'], products.map((p) => row([{ value: p.name }, { value: formatRupiah(p.sales), class: 'numeric' }, { value: p.units, class: 'numeric' }, { value: formatPercent(p.contribution), class: 'numeric' }])))}</div><div class="panel"><h2>Expense by Department</h2>${donut(expenses)}${table(['Departemen', 'Total Expense', 'Persentase'], expenses.map((e) => row([{ value: e.department }, { value: formatRupiah(e.expense), class: 'numeric' }, { value: formatPercent(e.percentage), class: 'numeric' }])))}</div></section><section class="panel"><div class="panel-title"><h2>Budget vs Actual</h2><span>Validasi otomatis aman untuk data kosong, null, undefined, dan angka tidak valid.</span></div>${table(['Kategori', 'Budget', 'Actual', 'Selisih', 'Realisasi', 'Status'], budgets.map((b) => row([{ value: b.category }, { value: formatRupiah(b.budget), class: 'numeric' }, { value: formatRupiah(b.actual), class: 'numeric' }, { value: formatRupiah(b.variance), class: `numeric ${moneyClass(b.variance)}` }, { value: formatPercent(b.realization), class: 'numeric' }, { value: `<span class="status ${b.status.toLowerCase().replaceAll(' ', '-')}">${b.status}</span>` }])), 'Data budget belum tersedia')}</section></main>`;
}

renderDashboard(dashboardData);
export { safeNumber, safeDivide, formatRupiah, calculateFinancials, prepareBudgets };
