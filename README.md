# Dashboard Keuangan Accurate Online

Dashboard keuangan berbasis Next.js + TypeScript untuk kebutuhan manajemen. Aplikasi ini disiapkan agar token Accurate Online hanya dipakai di server-side, memiliki mock mode, dan mudah dikembangkan ketika endpoint Accurate Online aktual perlu disesuaikan.

## Fitur Utama

- Financial Summary Cards: Total Pendapatan, Laba Kotor, Laba Bersih, Total Asset, Kas & Bank, Gross Margin, Net Profit Margin, Operating Expense.
- Profit & Loss: tabel laporan, tren bulanan, dan margin analysis.
- Balance Sheet: validasi Total Asset = Total Liabilities + Equity dengan warning otomatis.
- Cash Flow: operating, investing, financing, net change, opening cash, closing cash, dan chart cash movement.
- Gross Margin: formula otomatis `(Laba Kotor / Total Pendapatan) * 100`, Revenue vs COGS, trend, dan warning penurunan margin.
- Top 5 Penjualan Produk: revenue, quantity sold, gross profit, gross margin.
- Expense by Department: pie chart, horizontal bar chart, budget vs actual department.
- Budget vs Actual: revenue, COGS, operating expense, department, account category.
- Budget Analysis: insight otomatis dalam bahasa Indonesia melalui `generateBudgetInsights`.
- Filter UX: date range, preset bulan/quarter/YTD/custom, department, product, branch.
- Mock mode agar dashboard berjalan tanpa credential Accurate.

## Cara Install

```bash
npm install
```

## Menjalankan Development Server

```bash
npm run dev
```

Buka `http://localhost:3000/dashboard`.

## Konfigurasi Environment

Salin contoh environment:

```bash
cp .env.example .env.local
```

Isi `.env.local`:

```bash
ACCURATE_BASE_URL=https://account.accurate.id
ACCURATE_API_TOKEN=token-accurate-anda
ACCURATE_SESSION_ID=session-id-anda
ACCURATE_DB_ID=database-id-anda
USE_MOCK_DATA=false
```

> Catatan: nama endpoint Accurate Online dapat berbeda antar kebutuhan laporan. Karena itu aplikasi menggunakan service + mapper layer agar penyesuaian cukup dilakukan di satu tempat.

## Mengaktifkan Mock Mode

Untuk menjalankan dashboard tanpa token Accurate:

```bash
USE_MOCK_DATA=true
```

Data mock realistis dalam Rupiah Indonesia tersedia di `src/lib/mock/financeData.ts`.

## Struktur Folder

```text
src/app/dashboard/page.tsx
src/app/dashboard/profit-loss/page.tsx
src/app/dashboard/balance-sheet/page.tsx
src/app/dashboard/cash-flow/page.tsx
src/app/dashboard/budget-analysis/page.tsx
src/app/api/finance/*/route.ts
src/components/dashboard/*
src/components/ui/*
src/lib/accurate/client.ts
src/lib/accurate/reports.ts
src/lib/accurate/mappers.ts
src/lib/accurate/types.ts
src/lib/mock/financeData.ts
src/lib/formatters.ts
src/lib/calculations.ts
```

## Menyesuaikan Endpoint Accurate Online

1. Ubah path endpoint di `src/lib/accurate/reports.ts` pada object `endpoints`.
2. Jika struktur response Accurate berbeda, sesuaikan mapping di `src/lib/accurate/mappers.ts`.
3. Format internal aplikasi didefinisikan di `src/lib/accurate/types.ts`, sehingga komponen UI tidak perlu berubah selama format internal tetap sama.
4. Retry, credential, session, dan error handling API dikelola di `src/lib/accurate/client.ts`.

## API Internal

Semua API menerima query `startDate`, `endDate`, `department`, `product`, dan `branch`:

- `GET /api/finance/summary`
- `GET /api/finance/profit-loss`
- `GET /api/finance/balance-sheet`
- `GET /api/finance/cash-flow`
- `GET /api/finance/sales-by-product`
- `GET /api/finance/expense-by-department`
- `GET /api/finance/budget-vs-actual`
- `GET /api/finance/budget-insights`

## Catatan Keamanan Token API

- Jangan hardcode token di source code.
- Simpan credential hanya di `.env.local` atau secret manager deployment.
- Token Accurate hanya dibaca di `src/lib/accurate/client.ts` yang berjalan server-side.
- Jangan membuat variable environment dengan prefix `NEXT_PUBLIC_` untuk token Accurate.
- `.env.example` hanya berisi placeholder aman.
