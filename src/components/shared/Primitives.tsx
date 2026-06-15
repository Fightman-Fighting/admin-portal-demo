import React from 'react';

export const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <div className={`rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900/60 shadow-sm ${className}`}>
    {children}
  </div>
);

export const Badge: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = '', children }) => (
  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${className}`}>{children}</span>
);

export const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    active: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    trialing: 'text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20',
    past_due: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
    canceled: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
    paid: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    failed: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
    open: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
  };
  return map[status] || 'text-slate-500 bg-slate-500/10 border-slate-500/20';
};

export const StatusDot: React.FC<{ status: string }> = ({ status }) => {
  const c = status === 'online' ? 'bg-emerald-500' : status === 'idle' ? 'bg-amber-400' : 'bg-slate-400';
  return (
    <span className="relative inline-flex h-2.5 w-2.5">
      {status === 'online' && <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${c} opacity-60`} />}
      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${c}`} />
    </span>
  );
};

export const Ring: React.FC<{ value: number; size?: number; color?: string; label?: string }> = ({ value, size = 88, color = '#22d3ee', label }) => {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="currentColor" className="text-slate-200 dark:text-white/10" strokeWidth="6" fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
      </svg>
      <div className="absolute text-center">
        <div className="text-lg font-bold text-slate-800 dark:text-white">{Math.round(value)}{label ? '' : '%'}</div>
        {label && <div className="text-[10px] text-slate-400">{label}</div>}
      </div>
    </div>
  );
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'outline' | 'danger' }> = ({ variant = 'primary', className = '', children, ...rest }) => {
  const v: Record<string, string> = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/30',
    ghost: 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300',
    outline: 'border border-slate-300 dark:border-white/15 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white',
  };
  return <button className={`inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${v[variant]} ${className}`} {...rest}>{children}</button>;
};
