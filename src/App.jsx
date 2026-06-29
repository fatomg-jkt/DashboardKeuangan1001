import React, { useMemo, useState } from "./vendor/react.js";

const h = React.createElement;
const STORAGE_KEY = "dashboard-keuangan-budgeting-v1";
const menuItems = ["Dashboard", "Laporan Budgeting"];
const sampleBudgetData = [
  { id: "sample-1", bulan: "Januari", departemen: "Finance", kategori: "Operasional", budget: 50000000, actual: 42000000 },
  { id: "sample-2", bulan: "Januari", departemen: "Marketing", kategori: "Campaign", budget: 75000000, actual: 82000000 },
  { id: "sample-3", bulan: "Februari", departemen: "Finance", kategori: "Operasional", budget: 52000000, actual: 51000000 },
  { id: "sample-4", bulan: "Februari", departemen: "HRD", kategori: "Recruitment", budget: 30000000, actual: 25000000 },
  { id: "sample-5", bulan: "Maret", departemen: "IT", kategori: "Software", budget: 45000000, actual: 47000000 },
  { id: "sample-6", bulan: "Maret", departemen: "Sales", kategori: "Event", budget: 60000000, actual: 55000000 },
];
const monthOrder = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const emptyForm = { bulan: "Januari", departemen: "", kategori: "", budget: "", actual: "" };

const rupiah = (value) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0);
const percent = (value) => `${(Number.isFinite(value) ? value : 0).toFixed(1)}%`;
const safeNumber = (value) => Math.max(0, Number(String(value).replace(/[^0-9]/g, "")) || 0);
const calcRow = (row) => {
  const budget = safeNumber(row.budget);
  const actual = safeNumber(row.actual);
  return { ...row, budget, actual, selisih: budget - actual, realisasi: budget === 0 ? 0 : (actual / budget) * 100, status: actual > budget ? "Over Budget" : actual < budget ? "Under Budget" : "On Track" };
};
const statusClass = (status = "On Track") => String(status).toLowerCase().replaceAll(" ", "-");

function readInitialData() {
  try {
    const raw = window.localStorage?.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed.map(calcRow) : sampleBudgetData.map(calcRow);
  } catch {
    return sampleBudgetData.map(calcRow);
  }
}
function saveData(rows) {
  try {
    window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(rows));
  } catch {
    // localStorage is optional; the page must stay usable even when storage is blocked.
  }
}
function Card({ title, children, className = "" }) {
  return h("section", { className: `card ${className}` }, title ? h("h2", null, title) : null, children);
}
function StatusBadge({ status }) {
  return h("span", { className: `status ${statusClass(status)}` }, status);
}
function normalizeRows(rows) {
  return Array.isArray(rows) ? rows.filter(Boolean).map(calcRow) : [];
}
function makeSummary(rows) {
  const safeRows = normalizeRows(rows);
  const totalBudget = safeRows.reduce((sum, row) => sum + row.budget, 0);
  const totalActual = safeRows.reduce((sum, row) => sum + row.actual, 0);
  const selisih = totalBudget - totalActual;
  const realisasi = totalBudget === 0 ? 0 : (totalActual / totalBudget) * 100;
  return { totalBudget, totalActual, selisih, realisasi, status: totalActual > totalBudget ? "Over Budget" : totalActual < totalBudget ? "Under Budget" : "On Track" };
}
function groupBy(rows, key) {
  return normalizeRows(rows).reduce((acc, row) => {
    const name = row[key] || "Lainnya";
    acc[name] = acc[name] || { name, budget: 0, actual: 0 };
    acc[name].budget += row.budget;
    acc[name].actual += row.actual;
    return acc;
  }, {});
}
function BarChart({ data = [], title }) {
  const safeData = Array.isArray(data) ? data : [];
  const max = Math.max(1, ...safeData.flatMap((item) => [item.budget || 0, item.actual || 0]));
  return h("div", { className: "chart-wrap", "aria-label": title }, safeData.length ? safeData.map((item) => h("div", { className: "chart-group", key: item.name }, h("div", { className: "bar-pair" }, h("span", { className: "bar budget", style: { height: `${Math.max(4, (item.budget / max) * 100)}%` } }), h("span", { className: "bar actual", style: { height: `${Math.max(4, (item.actual / max) * 100)}%` } })), h("small", null, item.name))) : h("p", { className: "empty" }, "Belum ada data untuk grafik."), h("div", { className: "legend" }, h("span", null, h("i", { className: "dot budget-dot" }), "Budget"), h("span", null, h("i", { className: "dot actual-dot" }), "Actual")));
}
function DonutList({ data = [] }) {
  const safeData = Array.isArray(data) ? data : [];
  const total = safeData.reduce((sum, item) => sum + item.actual, 0);
  return h("div", { className: "donut-list" }, safeData.length ? safeData.map((item, index) => h("div", { className: "donut-row", key: item.name }, h("span", { className: `slice slice-${index % 5}` }), h("strong", null, item.name), h("em", null, total === 0 ? "0%" : percent((item.actual / total) * 100)), h("small", null, rupiah(item.actual)))) : h("p", { className: "empty" }, "Belum ada data departemen."));
}
function Dashboard({ rows }) {
  const safeRows = normalizeRows(rows);
  const summary = makeSummary(safeRows);
  const monthly = Object.values(groupBy(safeRows, "bulan")).sort((a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name));
  const departments = Object.values(groupBy(safeRows, "departemen"));
  return h(React.Fragment, null, h("section", { className: "kpi-grid" }, [["Total Budget", rupiah(summary.totalBudget)], ["Total Actual", rupiah(summary.totalActual)], ["Selisih Budget vs Actual", rupiah(summary.selisih)], ["Persentase Realisasi Budget", percent(summary.realisasi)]].map(([label, value]) => h("article", { className: "card kpi", key: label }, h("span", null, label), h("strong", null, value))), h("article", { className: "card kpi" }, h("span", null, "Status Budget"), h(StatusBadge, { status: summary.status }))), h("section", { className: "content-grid" }, h(Card, { title: "Grafik Budget vs Actual per Bulan" }, h(BarChart, { data: monthly, title: "Budget vs Actual per bulan" })), h(Card, { title: "Realisasi Budget per Departemen" }, h(DonutList, { data: departments }))));
}
function BudgetForm({ form, setForm, editingId, onSubmit, onCancel }) {
  const input = (name, label, type = "text") => h("label", null, h("span", null, label), h("input", { value: form[name], type, min: type === "number" ? "0" : undefined, onChange: (e) => setForm({ ...form, [name]: e.target.value }), placeholder: label }));
  return h("form", { className: "budget-form", onSubmit }, h("label", null, h("span", null, "Bulan"), h("select", { value: form.bulan, onChange: (e) => setForm({ ...form, bulan: e.target.value }) }, monthOrder.map((month) => h("option", { key: month, value: month }, month)))), input("departemen", "Departemen"), input("kategori", "Kategori"), input("budget", "Budget", "number"), input("actual", "Actual", "number"), h("div", { className: "form-actions" }, h("button", { className: "primary", type: "submit" }, editingId ? "Update Data" : "Tambah Data"), editingId ? h("button", { type: "button", onClick: onCancel }, "Batal Edit") : null));
}
function LaporanBudgeting({ rows, setRows }) {
  const safeRows = normalizeRows(rows);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({ bulan: "Semua", departemen: "Semua", search: "" });
  const departments = [...new Set(safeRows.map((row) => row.departemen).filter(Boolean))];
  const filteredRows = safeRows.filter((row) => (filters.bulan === "Semua" || row.bulan === filters.bulan) && (filters.departemen === "Semua" || row.departemen === filters.departemen) && `${row.kategori} ${row.departemen}`.toLowerCase().includes(filters.search.toLowerCase()));
  const submit = (event) => {
    event.preventDefault();
    const clean = calcRow({ id: editingId || `budget-${Date.now()}`, bulan: form.bulan, departemen: form.departemen.trim() || "Umum", kategori: form.kategori.trim() || "Lainnya", budget: form.budget, actual: form.actual });
    const nextRows = editingId ? safeRows.map((row) => (row.id === editingId ? clean : row)) : [...safeRows, clean];
    setRows(nextRows); saveData(nextRows); setForm(emptyForm); setEditingId(null);
  };
  const edit = (row) => { setEditingId(row.id); setForm({ bulan: row.bulan, departemen: row.departemen, kategori: row.kategori, budget: String(row.budget), actual: String(row.actual) }); };
  const remove = (id) => { const nextRows = safeRows.filter((row) => row.id !== id); setRows(nextRows); saveData(nextRows); };
  const chartData = Object.values(groupBy(filteredRows, "bulan")).sort((a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name));
  const composition = Object.values(groupBy(filteredRows, "departemen"));
  return h(React.Fragment, null, h("section", { className: "content-grid" }, h(Card, { title: editingId ? "Edit Data Budgeting" : "Form Input Manual Data Budgeting" }, h(BudgetForm, { form, setForm, editingId, onSubmit: submit, onCancel: () => { setEditingId(null); setForm(emptyForm); } })), h(Card, { title: "Grafik Komposisi Actual per Departemen" }, h(DonutList, { data: composition }))), h(Card, { title: "Filter Laporan", className: "filter-card" }, h("div", { className: "filters" }, h("select", { value: filters.bulan, onChange: (e) => setFilters({ ...filters, bulan: e.target.value }) }, ["Semua", ...monthOrder].map((month) => h("option", { key: month, value: month }, month))), h("select", { value: filters.departemen, onChange: (e) => setFilters({ ...filters, departemen: e.target.value }) }, ["Semua", ...departments].map((department) => h("option", { key: department, value: department }, department))), h("input", { value: filters.search, onChange: (e) => setFilters({ ...filters, search: e.target.value }), placeholder: "Search kategori/departemen" }))), h("section", { className: "content-grid" }, h(Card, { title: "Grafik Budget vs Actual" }, h(BarChart, { data: chartData, title: "Budget vs Actual" })), h(Card, { title: "Tabel Data Budgeting" }, h("div", { className: "table-card" }, h("table", null, h("thead", null, h("tr", null, ["Bulan", "Departemen", "Kategori", "Budget", "Actual", "Selisih", "Realisasi", "Status", "Aksi"].map((title) => h("th", { key: title }, title)))), h("tbody", null, filteredRows.length ? filteredRows.map((row) => h("tr", { key: row.id }, h("td", null, row.bulan), h("td", null, row.departemen), h("td", null, row.kategori), h("td", null, rupiah(row.budget)), h("td", null, rupiah(row.actual)), h("td", null, rupiah(row.selisih)), h("td", null, percent(row.realisasi)), h("td", null, h(StatusBadge, { status: row.status })), h("td", { className: "actions" }, h("button", { type: "button", onClick: () => edit(row) }, "Edit"), h("button", { type: "button", className: "danger", onClick: () => remove(row.id) }, "Hapus")))) : h("tr", null, h("td", { colSpan: 9, className: "empty" }, safeRows.length ? "Tidak ada data budgeting yang cocok." : "Belum ada data budgeting."))))))));
}
export default function App() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [rows, setRows] = useState(readInitialData);
  const page = useMemo(() => activeMenu === "Dashboard" ? h(Dashboard, { rows }) : h(LaporanBudgeting, { rows, setRows }), [activeMenu, rows]);
  return h("div", { className: "app-shell" }, h("aside", { className: "sidebar" }, h("div", { className: "brand" }, "Finance Accounting"), h("nav", null, menuItems.map((item) => h("button", { key: item, type: "button", className: activeMenu === item ? "active" : "", onClick: () => setActiveMenu(item) }, item)))), h("main", { className: "main-content" }, h("header", { className: "hero" }, h("p", null, "Dashboard Finance Accounting"), h("h1", null, activeMenu), h("span", null, "Dashboard budgeting sederhana berbasis React state/localStorage, tanpa database, API, server, upload file, atau dependency chart berat.")), page));
}
