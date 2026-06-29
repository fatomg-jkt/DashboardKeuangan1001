import React, { useState } from "./vendor/react.js";

const h = React.createElement;
const menuItems = ["Dashboard Utama", "Laporan Neraca", "Laporan Laba Rugi", "Laporan Budgeting", "Cashflow"];
const rupiah = (value) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
const kpis = [["Total Pendapatan", 1250000000], ["Total Beban", 760000000], ["Laba Bersih", 490000000], ["Total Aset", 3850000000], ["Kas & Bank", 925000000], ["Budget Terpakai", 615000000]];
const dashboardBars = [["Jan", 55], ["Feb", 66], ["Mar", 72], ["Apr", 60], ["Mei", 82], ["Jun", 95]];
const neracaRows = [["Aset Lancar", 1450000000], ["Aset Tetap", 2400000000], ["Total Aset", 3850000000], ["Liabilitas", 1260000000], ["Ekuitas", 2590000000], ["Total Liabilitas + Ekuitas", 3850000000]];
const labaRugiRows = [["Pendapatan", 1250000000], ["HPP", 420000000], ["Laba Kotor", 830000000], ["Beban Operasional", 340000000], ["Laba Bersih", 490000000]];
const budgetRows = [["Operasional", 280000000, 238000000, "Aman"], ["Marketing", 180000000, 162000000, "Perhatian"], ["Software", 90000000, 104000000, "Over Budget"], ["Training", 65000000, 41000000, "Aman"]];
const cashflowRows = [["Opening Balance", 710000000], ["Cash Inflow", 590000000], ["Cash Outflow", 375000000], ["Net Cashflow", 215000000], ["Ending Balance", 925000000]];

function SimpleBarChart({ data }) {
  return h("div", { className: "bar-chart", "aria-label": "Grafik sederhana" }, data.map(([label, value]) => h("div", { className: "bar-item", key: label }, h("div", { className: "bar-track" }, h("div", { className: "bar-fill", style: { height: `${value}%` } })), h("span", null, label))));
}

function HorizontalBars({ data }) {
  return h("div", { className: "horizontal-chart" }, data.map(([label, value, color]) => h("div", { className: "horizontal-row", key: label }, h("div", { className: "horizontal-label" }, label), h("div", { className: "horizontal-track" }, h("div", { className: "horizontal-fill", style: { width: `${value}%`, background: color } })), h("strong", null, `${value}%`))));
}

function MoneyTable({ rows }) {
  return h("div", { className: "table-card" }, h("table", null, h("tbody", null, rows.map(([label, value]) => h("tr", { key: label, className: label.includes("Total") || label.includes("Laba Bersih") || label.includes("Ending") ? "highlight" : "" }, h("td", null, label), h("td", null, rupiah(value)))))));
}

function Card({ title, children }) {
  return h("section", { className: "card" }, h("h2", null, title), children);
}

function DashboardUtama() {
  return h(React.Fragment, null, h("section", { className: "kpi-grid" }, kpis.map(([title, value]) => h("article", { className: "card kpi", key: title }, h("span", null, title), h("strong", null, rupiah(value))))), h(Card, { title: "Grafik Pendapatan Bulanan" }, h(SimpleBarChart, { data: dashboardBars })));
}

function LaporanNeraca() {
  return h("section", { className: "content-grid" }, h(Card, { title: "Tabel Laporan Neraca" }, h(MoneyTable, { rows: neracaRows })), h(Card, { title: "Komposisi Neraca" }, h(HorizontalBars, { data: [["Aset Lancar", 38, "#14b8a6"], ["Aset Tetap", 62, "#2563eb"], ["Liabilitas", 33, "#f97316"], ["Ekuitas", 67, "#22c55e"]] })));
}

function LaporanLabaRugi() {
  return h("section", { className: "content-grid" }, h(Card, { title: "Tabel Laporan Laba Rugi" }, h(MoneyTable, { rows: labaRugiRows })), h(Card, { title: "Pendapatan vs Beban vs Laba" }, h(HorizontalBars, { data: [["Pendapatan", 100, "#2563eb"], ["Beban", 61, "#ef4444"], ["Laba", 39, "#22c55e"]] })));
}

function LaporanBudgeting() {
  return h(Card, { title: "Tabel Budgeting" }, h("div", { className: "table-card" }, h("table", null, h("thead", null, h("tr", null, ["Kategori", "Budget", "Actual", "Selisih", "Status"].map((title) => h("th", { key: title }, title)))), h("tbody", null, budgetRows.map(([category, budget, actual, status]) => h("tr", { key: category }, h("td", null, category), h("td", null, rupiah(budget)), h("td", null, rupiah(actual)), h("td", null, rupiah(budget - actual)), h("td", null, h("span", { className: `status ${status.toLowerCase().replace(" ", "-")}` }, status))))))));
}

function Cashflow() {
  return h("section", { className: "content-grid" }, h(Card, { title: "Tabel Cashflow" }, h(MoneyTable, { rows: cashflowRows })), h(Card, { title: "Cash Inflow vs Cash Outflow" }, h(HorizontalBars, { data: [["Cash Inflow", 100, "#22c55e"], ["Cash Outflow", 64, "#ef4444"], ["Net Cashflow", 36, "#2563eb"]] })));
}

export default function App() {
  const [activeMenu, setActiveMenu] = useState("Dashboard Utama");
  const pages = { "Dashboard Utama": h(DashboardUtama), "Laporan Neraca": h(LaporanNeraca), "Laporan Laba Rugi": h(LaporanLabaRugi), "Laporan Budgeting": h(LaporanBudgeting), Cashflow: h(Cashflow) };

  return h("div", { className: "app-shell" }, h("aside", { className: "sidebar" }, h("div", { className: "brand" }, "Finance Accounting"), h("nav", null, menuItems.map((item) => h("button", { key: item, type: "button", className: activeMenu === item ? "active" : "", onClick: () => setActiveMenu(item) }, item)))), h("main", { className: "main-content" }, h("header", { className: "hero" }, h("p", null, "Dashboard Finance Accounting"), h("h1", null, activeMenu), h("span", null, "Versi sederhana tanpa router, database, API, login, atau library chart.")), pages[activeMenu]));
}
