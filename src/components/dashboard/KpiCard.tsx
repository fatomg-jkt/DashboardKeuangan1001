import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { formatCurrency, formatPercent } from '../../lib/utils/formatCurrency';

export function KpiCard({ title, value, change, isPercent = false }: { title: string; value: number; change: number; isPercent?: boolean }) {
  const positive = change >= 0;
  return <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><p className="text-sm text-slate-500">{title}</p><div className="mt-3 flex items-end justify-between gap-3"><h3 className="text-2xl font-bold text-slate-900">{isPercent ? formatPercent(value) : formatCurrency(value, true)}</h3><span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${positive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{positive ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} {formatPercent(Math.abs(change))}</span></div><p className="mt-3 text-xs text-slate-400">vs periode sebelumnya</p></div>;
}
