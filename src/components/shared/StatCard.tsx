import React from 'react';
import { Card } from './Primitives';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard: React.FC<{ label: string; value: string; delta?: number; icon: any; accent?: string }> = ({ label, value, delta, icon: Icon, accent = 'indigo' }) => {
  const accents: Record<string, string> = {
    indigo: 'from-indigo-500/15 to-indigo-500/5 text-indigo-500',
    cyan: 'from-cyan-500/15 to-cyan-500/5 text-cyan-500',
    emerald: 'from-emerald-500/15 to-emerald-500/5 text-emerald-500',
    amber: 'from-amber-500/15 to-amber-500/5 text-amber-500',
    rose: 'from-rose-500/15 to-rose-500/5 text-rose-500',
    violet: 'from-violet-500/15 to-violet-500/5 text-violet-500',
  };
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
          {delta !== undefined && (
            <div className={`mt-1.5 flex items-center gap-1 text-xs font-medium ${delta >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {delta >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              {delta >= 0 ? '+' : ''}{delta}% <span className="text-slate-400 font-normal">vs last week</span>
            </div>
          )}
        </div>
        <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${accents[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
