# Dashboard Keuangan 1001

Aplikasi dashboard keuangan berbasis React, TypeScript, Tailwind CSS, dan Recharts untuk memonitor KPI eksekutif, P&L, neraca, cashflow, gross margin, top product, expense department, budget vs actual, dan insight analisis budget.

## Menjalankan aplikasi

```bash
npm install
npm run dev
```

## Build production

```bash
npm run build
```

## Struktur penting

- `src/components/dashboard/` berisi komponen reusable untuk cards, chart, tabel, dan analisis.
- `src/lib/data/financialDummyData.ts` berisi dummy data terstruktur yang mudah diganti dengan API/database.
- `src/lib/utils/financialCalculations.ts` berisi helper kalkulasi keuangan.
- `src/lib/utils/formatCurrency.ts` berisi formatter Rupiah, persentase, dan angka Indonesia.
