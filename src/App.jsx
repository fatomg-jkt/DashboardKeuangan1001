import React, { useMemo, useState } from "./vendor/react.js";

const h = React.createElement;
const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const departments = ["Finance", "Accounting", "Marketing", "Operational", "Human Resources", "Information Technology", "General Affairs"];
const categories = ["Gaji dan Tunjangan", "Marketing", "Sewa", "Utilitas", "Transportasi", "Peralatan", "Perawatan", "Operasional Lainnya"];
const brands = ["Nusantara Group", "Arunika Retail", "Samudra Digital"];
const colors = { navy: "#174A7E", blue: "#287FA6", turquoise: "#16B4C3", green: "#16A36D", yellow: "#E5AF2F", red: "#D93F3F" };

const rupiah = (value) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0);
const shortRp = (value) => `Rp${((Number.isFinite(value) ? value : 0) / 1_000_000_000).toFixed(1).replace(".0", "")} M`;
const percent = (value) => `${(Number.isFinite(value) ? value : 0).toFixed(1)}%`;
const safePct = (a, b) => (b ? (a / b) * 100 : 0);
const sum = (rows, key) => rows.reduce((total, row) => total + (Number(row[key]) || 0), 0);

const dataset = months.flatMap((month, monthIndex) => categories.flatMap((category, categoryIndex) => departments.map((department, departmentIndex) => {
  const budget = (24 + categoryIndex * 4.2 + departmentIndex * 2.7 + (monthIndex % 4) * 1.4) * 1_000_000;
  const usageBase = [0.73, 0.86, 0.95, 1.08, 0.82, 0.76, 0.91, 1.14][categoryIndex];
  const monthFactor = 0.96 + (monthIndex % 5) * 0.018;
  const deptFactor = 0.985 + (departmentIndex % 3) * 0.012;
  const actual = Math.round(budget * usageBase * monthFactor * deptFactor);
  const previousActual = Math.round(budget * (0.70 + ((categoryIndex + departmentIndex + monthIndex) % 6) * 0.045));
  return { year: 2026, month, monthIndex, brand: brands[(categoryIndex + departmentIndex) % brands.length], department, category, budget, actual, previousActual };
})));

function aggregate(rows, key) {
  return Object.values(rows.reduce((acc, row) => {
    const name = row[key];
    acc[name] ||= { name, budget: 0, actual: 0, previousActual: 0 };
    acc[name].budget += row.budget;
    acc[name].actual += row.actual;
    acc[name].previousActual += row.previousActual;
    return acc;
  }, {}));
}

function statusFor(actual, budget) {
  const pct = safePct(actual, budget);
  if (pct > 100) return "over";
  if (pct > 90) return "hampir";
  if (pct >= 80) return "perhatian";
  return "aman";
}

function Select({ label, value, onChange, items, all = true }) {
  return h("label", { className: "field" }, h("span", null, label), h("select", { value, onChange: (event) => onChange(event.target.value) }, all && h("option", { value: "Semua" }, `Semua ${label}`), items.map((item) => h("option", { key: item, value: item }, item))));
}

function Button({ children, onClick, primary = false, disabled = false }) {
  return h("button", { className: `button ${primary ? "primary" : ""}`, onClick, disabled }, children);
}

function Panel({ title, children, actions, compact = false }) {
  return h("section", { className: `panel ${compact ? "compact" : ""}` }, h("header", { className: "panel-title" }, h("h2", null, title), actions), children);
}

function Chart({ rows, mode = "combo" }) {
  const [hover, setHover] = useState(null);
  const max = Math.max(1, ...rows.flatMap((row) => [row.budget, row.actual, row.previousActual]));
  const point = (key, index) => `${index * (100 / Math.max(1, rows.length - 1))},${96 - (rows[index][key] / max) * 82}`;
  if (!rows.length) return h("div", { className: "empty" }, "Tidak ada data untuk filter ini.");
  return h("div", { className: "chart-wrap" },
    h("div", { className: "chart-canvas" },
      h("svg", { viewBox: "0 0 100 100", preserveAspectRatio: "none" },
        mode !== "line" && rows.map((row, index) => h(React.Fragment, { key: row.name },
          h("rect", { className: "bar actual", x: index * (100 / rows.length) + 1, y: 96 - (row.actual / max) * 82, width: (100 / rows.length) * 0.24, height: (row.actual / max) * 82 }),
          h("rect", { className: "bar previous", x: index * (100 / rows.length) + (100 / rows.length) * 0.29, y: 96 - (row.previousActual / max) * 82, width: (100 / rows.length) * 0.22, height: (row.previousActual / max) * 82 })
        )),
        mode === "grouped" && rows.map((row, index) => h("rect", { key: `b-${row.name}`, className: "bar budget", x: index * (100 / rows.length) + (100 / rows.length) * 0.55, y: 96 - (row.budget / max) * 82, width: (100 / rows.length) * 0.22, height: (row.budget / max) * 82 })),
        mode !== "grouped" && h("polyline", { className: "line budget-line", points: rows.map((_, i) => point("budget", i)).join(" ") }),
        mode === "line" && h("polyline", { className: "line actual-line", points: rows.map((_, i) => point("actual", i)).join(" ") }),
        mode !== "grouped" && rows.map((_, i) => h("circle", { key: i, className: "marker", cx: i * (100 / Math.max(1, rows.length - 1)), cy: 96 - (rows[i].budget / max) * 82, r: 1.15 }))
      ),
      h("div", { className: "axis" }, rows.map((row) => h("span", { key: row.name, onMouseEnter: () => setHover(row), onMouseLeave: () => setHover(null) }, row.name))),
      hover && h("div", { className: "tooltip" }, h("b", null, hover.name), h("span", null, "Budget", h("strong", null, rupiah(hover.budget))), h("span", null, "Aktual", h("strong", null, rupiah(hover.actual))), h("span", null, "Aktual Tahun Lalu", h("strong", null, rupiah(hover.previousActual))), h("span", null, "Selisih", h("strong", null, rupiah(hover.budget - hover.actual))), h("span", null, "Persentase Realisasi", h("strong", null, percent(safePct(hover.actual, hover.budget)))))
    ),
    h("div", { className: "legend" }, mode !== "line" && h("span", null, h("i", { className: "navy" }), "Aktual"), mode !== "line" && h("span", null, h("i", { className: "blue" }), "Aktual Tahun Lalu"), h("span", null, h("i", { className: "turquoise" }), "Budget"), mode === "line" && h("span", null, h("i", { className: "navy" }), "Aktual"))
  );
}

function SummaryTable({ title, rows, ytd = false }) {
  const grouped = aggregate(rows, "category");
  const total = { name: "Total", actual: sum(grouped, "actual"), budget: sum(grouped, "budget"), previousActual: sum(grouped, "previousActual") };
  const data = grouped.length ? [...grouped, total] : [];
  return h(Panel, { title }, h("div", { className: "table-scroll" }, h("table", null, h("thead", null, h("tr", null, ["Deskripsi", ytd ? "Aktual YTD" : "Aktual", ytd ? "Budget YTD" : "Budget", "Varians %", ytd ? "Aktual YTD Tahun Lalu" : "Aktual Tahun Lalu", "Perubahan %"].map((head) => h("th", { key: head }, head)))), h("tbody", null, data.length ? data.map((row, index) => h("tr", { key: row.name, className: index === data.length - 1 ? "total" : "" }, h("td", null, h("i", { className: `status ${statusFor(row.actual, row.budget)}` }), row.name), h("td", null, rupiah(row.actual)), h("td", null, rupiah(row.budget)), h("td", null, percent(safePct(row.actual - row.budget, row.budget))), h("td", null, rupiah(row.previousActual)), h("td", null, percent(safePct(row.actual - row.previousActual, row.previousActual))))) : h("tr", null, h("td", { colSpan: 6 }, "Tidak ada data"))))));
}

function MiniChart({ title, rows, ytd = false }) {
  const budget = sum(rows, "budget");
  const actual = sum(rows, "actual");
  const previousActual = sum(rows, "previousActual");
  const chartRows = [{ name: ytd ? "YTD" : "Bulan Ini", budget, actual, previousActual }];
  return h(Panel, { title, compact: true }, h(Chart, { rows: chartRows, mode: "grouped" }), ytd && h("div", { className: "mini-summary" }, h("span", null, "Total Budget YTD", h("b", null, shortRp(budget))), h("span", null, "Total Aktual YTD", h("b", null, shortRp(actual))), h("span", null, "Selisih YTD", h("b", { className: budget >= actual ? "good" : "bad" }, shortRp(budget - actual))), h("span", null, "Realisasi YTD", h("b", null, percent(safePct(actual, budget))))));
}

function UploadModal({ onClose }) {
  const [type, setType] = useState("Master Budget");
  const [rows, setRows] = useState([]);
  const [file, setFile] = useState(null);
  const required = type === "Master Budget" ? ["Tahun", "Bulan", "Brand", "Departemen", "Kategori", "Kode Budget", "Deskripsi Budget", "Nilai Budget"] : ["Tanggal", "Tahun", "Bulan", "Brand", "Departemen", "Kategori", "Kode Budget", "Deskripsi", "Nilai Aktual", "Nomor Referensi", "Vendor"];
  function read(event) {
    const selected = event.target.files?.[0];
    setFile(selected || null);
    if (!selected) return;
    const reader = new FileReader();
    reader.onload = () => {
      const lines = String(reader.result).split(/\r?\n/).filter(Boolean).slice(0, 8);
      const header = (lines[0] || "").split(",").map((cell) => cell.trim());
      setRows(lines.map((line, index) => {
        const cells = line.split(",");
        const missing = index === 0 ? required.filter((column) => !header.includes(column)) : [];
        const numberCell = Number(cells[type === "Master Budget" ? 7 : 8]);
        const dateInvalid = type !== "Master Budget" && index > 0 && Number.isNaN(Date.parse(cells[0]));
        return { line: index + 1, text: cells.slice(0, 5).join(" · "), valid: index === 0 ? missing.length === 0 : cells.length >= required.length && Number.isFinite(numberCell) && !dateInvalid, error: index === 0 && missing.length ? `Kolom wajib belum ada: ${missing.join(", ")}` : dateInvalid ? "Tanggal tidak valid" : !Number.isFinite(numberCell) && index > 0 ? "Nilai angka tidak valid" : "Valid" };
      }));
    };
    reader.readAsText(selected);
  }
  function confirm() { localStorage.setItem("budget-dashboard-import", JSON.stringify({ type, file: file?.name, count: Math.max(0, rows.length - 1), importedAt: new Date().toISOString() })); alert("Import dikonfirmasi dan tersimpan di localStorage."); onClose(); }
  return h("div", { className: "modal-bg", onMouseDown: (event) => event.target === event.currentTarget && onClose() }, h("div", { className: "modal" }, h("header", null, h("div", null, h("small", null, "UPLOAD DATA"), h("h2", null, "Import Budget dan Aktual")), h("button", { onClick: onClose }, "×")), h("div", { className: "tabs" }, ["Master Budget", "Data Aktual", "Aktual Tahun Sebelumnya"].map((item) => h("button", { key: item, className: type === item ? "active" : "", onClick: () => setType(item) }, item))), h("label", { className: "dropzone" }, h("b", null, file?.name || "Pilih file CSV/XLSX"), h("span", null, `Kolom wajib: ${required.join(", ")}`), h("input", { type: "file", accept: ".csv,.xlsx", onChange: read })), file && h("p", { className: "row-count" }, `${Math.max(0, rows.length - 1)} baris data terdeteksi`), rows.length > 0 && h("div", { className: "preview" }, rows.map((row) => h("div", { key: row.line }, h("i", { className: `status ${row.valid ? "aman" : "over"}` }), h("span", null, `Baris ${row.line}: ${row.text}`), h("em", null, row.error)))), h("footer", null, h(Button, { onClick: onClose }, "Batal"), h(Button, { primary: true, disabled: !file || rows.some((row) => !row.valid), onClick: confirm }, "Konfirmasi Import"))));
}

export default function App() {
  const [filters, setFilters] = useState({ year: "2026", month: "Desember", department: "Semua", category: "Semua", brand: "Semua" });
  const [opCategory, setOpCategory] = useState("Operasional Lainnya");
  const [trendDepartment, setTrendDepartment] = useState("Finance");
  const [updatedAt, setUpdatedAt] = useState(new Date());
  const [uploadOpen, setUploadOpen] = useState(false);
  const monthIndex = monthNames.indexOf(filters.month);
  const filtered = useMemo(() => dataset.filter((row) => (filters.department === "Semua" || row.department === filters.department) && (filters.category === "Semua" || row.category === filters.category) && (filters.brand === "Semua" || row.brand === filters.brand)), [filters]);
  const currentRows = filtered.filter((row) => row.monthIndex === monthIndex);
  const ytdRows = filtered.filter((row) => row.monthIndex <= monthIndex);
  const trendRows = aggregate(filtered, "month").sort((a, b) => months.indexOf(a.name) - months.indexOf(b.name));
  const budget = sum(ytdRows, "budget");
  const actual = sum(ytdRows, "actual");
  const overCount = aggregate(ytdRows, "category").filter((row) => row.actual > row.budget).length;
  const updateFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  return h("main", { className: "app" }, h("header", { className: "topbar" }, h("div", null, h("p", null, "Finance Accounting Dashboard"), h("h1", null, "Dashboard Budget vs Aktual"), h("span", null, "Monitoring perbandingan anggaran, realisasi, varians, dan pencapaian penggunaan budget perusahaan.")), h("div", { className: "actions" }, h(Button, { primary: true, onClick: () => setUploadOpen(true) }, "Upload Data"), h(Button, { onClick: () => setUpdatedAt(new Date()) }, "Refresh"), h("small", null, "Terakhir diperbarui: ", updatedAt.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })))), h("section", { className: "filters" }, h(Select, { label: "Tahun", value: filters.year, onChange: (value) => updateFilter("year", value), items: ["2026"], all: false }), h(Select, { label: "Bulan", value: filters.month, onChange: (value) => updateFilter("month", value), items: monthNames, all: false }), h(Select, { label: "Departemen", value: filters.department, onChange: (value) => updateFilter("department", value), items: departments }), h(Select, { label: "Kategori", value: filters.category, onChange: (value) => updateFilter("category", value), items: categories }), h(Select, { label: "Brand atau Perusahaan", value: filters.brand, onChange: (value) => updateFilter("brand", value), items: brands })), h("section", { className: "kpi-strip" }, [["Total Budget", rupiah(budget)], ["Total Aktual", rupiah(actual)], ["Sisa Budget", rupiah(budget - actual)], ["Persentase Realisasi", percent(safePct(actual, budget))], ["Jumlah Kategori Over Budget", overCount]].map(([label, value]) => h("article", { key: label }, h("span", null, label), h("b", null, value)))), h("section", { className: "dashboard-grid" }, h(Panel, { title: "Total Budget vs Aktual – Tren" }, h(Chart, { rows: trendRows, mode: "combo" })), h("div", { className: "right-pair" }, h(MiniChart, { title: "Budget vs Aktual – Bulan Ini", rows: currentRows }), h(MiniChart, { title: "Budget vs Aktual – Year-to-Date", rows: ytdRows, ytd: true })), h(Panel, { title: "Budget Operasional – Tren", actions: h("select", { value: opCategory, onChange: (event) => setOpCategory(event.target.value) }, categories.map((item) => h("option", { key: item }, item))) }, h(Chart, { rows: aggregate(filtered.filter((row) => row.category === opCategory), "month").sort((a, b) => months.indexOf(a.name) - months.indexOf(b.name)), mode: "line" })), h(SummaryTable, { title: "Ringkasan Budget Bulan Ini", rows: currentRows }), h(Panel, { title: "Realisasi Budget – Tren 12 Bulan", actions: h("select", { value: trendDepartment, onChange: (event) => setTrendDepartment(event.target.value) }, departments.map((item) => h("option", { key: item }, item))) }, h(Chart, { rows: aggregate(filtered.filter((row) => row.department === trendDepartment), "month").sort((a, b) => months.indexOf(a.name) - months.indexOf(b.name)), mode: "line" })), h(SummaryTable, { title: "Ringkasan Budget Year-to-Date", rows: ytdRows, ytd: true })), uploadOpen && h(UploadModal, { onClose: () => setUploadOpen(false) }));
}
