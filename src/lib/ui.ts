export const catColor: Record<string, string> = {
  work: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
  dev: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
  social: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  entertainment: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
  shopping: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  news: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
  domain: 'text-slate-500 bg-slate-500/10 border-slate-500/20',
};

export const catDot: Record<string, string> = {
  work: 'bg-sky-500', dev: 'bg-violet-500', social: 'bg-amber-500',
  entertainment: 'bg-rose-500', shopping: 'bg-emerald-500', news: 'bg-cyan-500', domain: 'bg-slate-500',
};

export const fmtTime = (sec: number) => {
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

export const ago = (ts: number) => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

export const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0 })}`;
