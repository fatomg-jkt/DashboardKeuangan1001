const dashboardData = {
  period: { month: 'Juni', year: '2026' },
  profitLoss: { revenue: 4850000000, cogs: 2175000000, expense: 1280000000 },
  balanceSheet: {
    totalAssets: 8890000000,
    totalLiabilities: 4400000000,
    totalEquity: 4490000000,
  },
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
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number : 0;
};

export const formatRupiah = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
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

  return {
    revenue,
    cogs,
    grossProfit,
    expense,
    netProfit,
    totalAssets,
    totalLiabilities,
    totalEquity,
    liabilitiesPlusEquity,
    beginningCash,
    cashIn,
    cashOut,
    endingCash,
    isBalanceSheetBalanced: totalAssets === liabilitiesPlusEquity,
  };
};

function KpiCard({ title, value }) {
  return (
    <article className="kpi-card">
      <p>{title}</p>
      <strong>{formatRupiah(value)}</strong>
    </article>
  );
}

function DataTable({ columns, children, emptyText = 'Data belum tersedia' }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {children || (
            <tr>
              <td colSpan={columns.length} className="empty-state">{emptyText}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const moneyRows = (rows, highlight = true) =>
  rows.map(([label, value]) => (
    <tr key={label}>
      <td>{label}</td>
      <td className={`numeric ${highlight ? moneyClass(value) : ''}`}>{formatRupiah(value)}</td>
    </tr>
  ));

export default function Home() {
  const financials = calculateDashboard(dashboardData);
  const products = Array.isArray(dashboardData.topProducts) ? dashboardData.topProducts.slice(0, 5) : [];
  const departments = Array.isArray(dashboardData.expensesByDepartment) ? dashboardData.expensesByDepartment : [];
  const budgets = Array.isArray(dashboardData.budgets) ? dashboardData.budgets : [];

  return (
    <main className="dashboard">
      <header className="hero">
        <div>
          <p className="eyebrow">Ringkasan Keuangan</p>
          <h1>Dashboard Keuangan</h1>
          <p className="hero-copy">
            Dashboard Next.js sederhana dengan dummy data hardcoded, format Rupiah, dan validasi nilai kosong menjadi 0.
          </p>
        </div>
        <div className="period-card" aria-label="Periode laporan">
          <span>Periode</span>
          <strong>{dashboardData.period?.month ?? 'Tidak dipilih'} {dashboardData.period?.year ?? ''}</strong>
        </div>
      </header>

      <section className="kpi-grid" aria-label="KPI Keuangan">
        <KpiCard title="Total Pendapatan" value={financials.revenue} />
        <KpiCard title="Laba Kotor" value={financials.grossProfit} />
        <KpiCard title="Laba Bersih" value={financials.netProfit} />
        <KpiCard title="Total Aset" value={financials.totalAssets} />
        <KpiCard title="Kas & Bank" value={financials.endingCash} />
      </section>

      {!financials.isBalanceSheetBalanced && <div className="warning">Balance Sheet tidak balance</div>}

      <section className="grid two-columns">
        <div className="panel">
          <h2>Profit & Loss</h2>
          <DataTable columns={['Komponen', 'Nilai']}>
            {moneyRows([
              ['Pendapatan', financials.revenue],
              ['HPP', financials.cogs],
              ['Laba Kotor', financials.grossProfit],
              ['Expense', financials.expense],
              ['Laba Bersih', financials.netProfit],
            ])}
          </DataTable>
        </div>

        <div className="panel">
          <h2>Balance Sheet</h2>
          <DataTable columns={['Komponen', 'Nilai']}>
            {moneyRows([
              ['Total Aset', financials.totalAssets],
              ['Total Liabilitas', financials.totalLiabilities],
              ['Total Ekuitas', financials.totalEquity],
              ['Total Liabilitas + Ekuitas', financials.liabilitiesPlusEquity],
            ], false)}
          </DataTable>
        </div>
      </section>

      <section className="grid two-columns">
        <div className="panel">
          <h2>Cashflow</h2>
          <DataTable columns={['Komponen', 'Nilai']}>
            {moneyRows([
              ['Kas Awal', financials.beginningCash],
              ['Kas Masuk', financials.cashIn],
              ['Kas Keluar', financials.cashOut],
              ['Kas Akhir', financials.endingCash],
            ], false)}
          </DataTable>
        </div>

        <div className="panel">
          <h2>Top 5 Produk</h2>
          <DataTable columns={['Nama Produk', 'Total Penjualan']}>
            {products.map((product) => (
              <tr key={product?.name ?? 'produk'}>
                <td>{product?.name ?? 'Produk tanpa nama'}</td>
                <td className="numeric">{formatRupiah(product?.sales)}</td>
              </tr>
            ))}
          </DataTable>
        </div>
      </section>

      <section className="grid two-columns">
        <div className="panel">
          <h2>Expense Department</h2>
          <DataTable columns={['Department', 'Total Expense']}>
            {departments.map((department) => (
              <tr key={department?.department ?? 'department'}>
                <td>{department?.department ?? 'Department tidak diketahui'}</td>
                <td className="numeric">{formatRupiah(department?.expense)}</td>
              </tr>
            ))}
          </DataTable>
        </div>

        <div className="panel">
          <h2>Budget vs Actual</h2>
          <DataTable columns={['Kategori', 'Budget', 'Actual', 'Selisih', 'Status']}>
            {budgets.map((item) => {
              const budget = safeNumber(item?.budget);
              const actual = safeNumber(item?.actual);
              const difference = actual - budget;
              const status = getBudgetStatus(budget, actual);

              return (
                <tr key={item?.category ?? 'kategori'}>
                  <td>{item?.category ?? 'Kategori tanpa nama'}</td>
                  <td className="numeric">{formatRupiah(budget)}</td>
                  <td className="numeric">{formatRupiah(actual)}</td>
                  <td className={`numeric ${moneyClass(difference)}`}>{formatRupiah(difference)}</td>
                  <td><span className={`status ${status.toLowerCase().replaceAll(' ', '-')}`}>{status}</span></td>
                </tr>
              );
            })}
          </DataTable>
        </div>
      </section>
    </main>
  );
}
