import React from 'react';

export const AreaChart: React.FC<{ data: number[]; labels?: string[]; height?: number; color?: string }> = ({ data, labels, height = 220, color = '#6366f1' }) => {
  const w = 600;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const pts = data.map((d, i) => [(i / (data.length - 1)) * w, height - 30 - ((d - min) / range) * (height - 50)]);
  // smooth path
  let path = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]; const [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    path += ` C ${cx} ${y0} ${cx} ${y1} ${x1} ${y1}`;
  }
  const area = `${path} L ${w} ${height - 30} L 0 ${height - 30} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((g) => (
        <line key={g} x1="0" x2={w} y1={(g / 3) * (height - 50) + 10} y2={(g / 3) * (height - 50) + 10} stroke="currentColor" className="text-slate-200 dark:text-white/5" strokeDasharray="4 4" />
      ))}
      <path d={area} fill="url(#ag)" />
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" />
      {labels && labels.map((l, i) => (
        <text key={i} x={(i / (labels.length - 1)) * w} y={height - 8} className="fill-slate-400 text-[11px]" textAnchor={i === 0 ? 'start' : i === labels.length - 1 ? 'end' : 'middle'}>{l}</text>
      ))}
    </svg>
  );
};

export const BarChart: React.FC<{ data: { label: string; value: number; color?: string }[]; height?: number }> = ({ data, height = 200 }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-3" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center justify-end gap-2">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{d.value}</div>
          <div className="w-full rounded-t-md transition-all" style={{ height: `${(d.value / max) * (height - 40)}px`, background: d.color || '#6366f1' }} />
          <div className="text-[11px] text-slate-400 capitalize">{d.label}</div>
        </div>
      ))}
    </div>
  );
};

export const Donut: React.FC<{ segments: { label: string; value: number; color: string }[] }> = ({ segments }) => {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let acc = 0;
  const r = 60, c = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-6">
      <svg width="150" height="150" viewBox="0 0 150 150" className="-rotate-90">
        {segments.map((s, i) => {
          const frac = s.value / total;
          const dash = frac * c;
          const el = <circle key={i} cx="75" cy="75" r={r} fill="none" stroke={s.color} strokeWidth="18" strokeDasharray={`${dash} ${c - dash}`} strokeDashoffset={-acc} />;
          acc += dash;
          return el;
        })}
      </svg>
      <div className="space-y-1.5">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
            <span className="capitalize text-slate-600 dark:text-slate-300">{s.label}</span>
            <span className="ml-auto font-medium text-slate-800 dark:text-slate-100">{Math.round((s.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Heatmap: React.FC<{ matrix: number[][] }> = ({ matrix }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const max = Math.max(...matrix.flat(), 1);
  return (
    <div className="space-y-1">
      {matrix.map((row, ri) => (
        <div key={ri} className="flex items-center gap-1">
          <span className="w-8 text-[10px] text-slate-400">{days[ri]}</span>
          {row.map((v, ci) => {
            const intensity = v / max;
            return <div key={ci} className="h-4 flex-1 rounded-sm" title={`${v} events`} style={{ background: `rgba(99,102,241,${0.12 + intensity * 0.85})` }} />;
          })}
        </div>
      ))}
      <div className="flex gap-1 pl-9 pt-1 text-[9px] text-slate-400">
        {Array.from({ length: 12 }).map((_, i) => <span key={i} className="flex-1 text-center">{i * 2}h</span>)}
      </div>
    </div>
  );
};
