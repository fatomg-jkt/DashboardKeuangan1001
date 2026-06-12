# Dashboard Keuangan Accurate Online

Dashboard keuangan berbasis **Next.js + TypeScript** untuk manajemen, dengan integrasi server-side ke Accurate Online Token API dan fallback **mock mode** agar aplikasi tetap bisa berjalan tanpa credential.

## Fitur Utama

- Financial Summary KPI: Total Pendapatan, Laba Kotor, Laba Bersih, Total Asset, Kas & Bank, Gross Margin, Net Profit Margin, Operating Expense.
- Profit & Loss: tabel laporan, grafik tren bulanan, dan margin analysis.
- Balance Sheet: Asset Lancar, Kas & Bank, Piutang, Persediaan, Asset Tetap, Liabilities, Equity, serta validasi balance.
- Cash Flow: operating, investing, financing, net change, opening cash, closing cash, dan chart cash movement.
- Gross Margin: formula otomatis `(Laba Kotor / Total Pendapatan) * 100`, Revenue vs COGS, trend bulanan, dan warning penurunan margin.
- Top 5 Penjualan Produk: ranking berdasarkan revenue, quantity, gross profit, dan gross margin.
- Expense by Department: pie chart, tabel actual, budget, variance, dan persentase total expense.
- Budget vs Actual: total budget, actual, variance, variance %, status under/over/on-track untuk revenue, COGS, opex, department, dan account category.
- Budget Analysis otomatis dalam bahasa Indonesia melalui `generateBudgetInsights`.
- Filter UX: date range, preset bulan/quarter/YTD/custom, department, product, dan branch.
- API internal server-side agar token Accurate tidak pernah terekspos ke browser.

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

Salin file contoh environment:

```bash
cp .env.example .env.local
```

Isi variable berikut di `.env.local`:

```env
ACCURATE_BASE_URL=https://account.accurate.id
ACCURATE_API_TOKEN=isi_token_api_accurate
ACCURATE_SESSION_ID=isi_session_id
ACCURATE_DB_ID=isi_database_id
USE_MOCK_DATA=true
```

> Catatan: `.env.local` tidak di-commit. Token hanya dibaca oleh API route/server components melalui service layer server-side.

## Mock Mode

Aktifkan mock mode dengan:

```env
USE_MOCK_DATA=true
```

Saat mock mode aktif, API internal mengambil data realistis Rupiah Indonesia dari `src/lib/mock/financeData.ts`. Jika token Accurate belum tersedia, service juga otomatis fallback ke mock mode.

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

Endpoint Accurate Online dapat berbeda antar modul/akun. Penyesuaian cukup dilakukan di satu area:

1. Ubah path endpoint di `src/lib/accurate/reports.ts` pada object `endpoints`.
2. Jika response Accurate berbeda, sesuaikan mapping di `src/lib/accurate/mappers.ts`.
3. Pertahankan tipe internal di `src/lib/accurate/types.ts` agar komponen UI tidak perlu berubah.

Service layer menyediakan fungsi berikut:

- `getProfitLoss(startDate, endDate)`
- `getBalanceSheet(asOfDate)`
- `getCashFlow(startDate, endDate)`
- `getSalesByProduct(startDate, endDate)`
- `getExpenseByDepartment(startDate, endDate)`
- `getBudgetVsActual(startDate, endDate)`
- `getFinancialSummary(startDate, endDate)`

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

## Keamanan Token API

- Jangan pernah menaruh token Accurate di komponen client.
- Jangan menggunakan prefix `NEXT_PUBLIC_` untuk secret.
- Simpan credential hanya di `.env.local` atau secret manager deployment.
- Service `src/lib/accurate/client.ts` menambahkan header Authorization hanya dari server-side.
- Error token invalid/expired dan API rate limit ditangani dengan response API yang aman.

## Validasi Kualitas

```bash
npm run typecheck
npm run build
```
