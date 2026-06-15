import React, { useState } from 'react';
import { usePlatform } from '@/contexts/PlatformContext';
import { Card, Badge, Button, statusBadge } from '@/components/shared/Primitives';
import { money } from '@/lib/ui';
import { Building2, Search, Users } from 'lucide-react';

const Organizations: React.FC<{ goto: (p: string) => void }> = ({ goto }) => {
  const { orgs, allUsers } = usePlatform();
  const [q, setQ] = useState('');
  const [plan, setPlan] = useState('all');
  const filtered = orgs.filter((o) =>
    (o.name.toLowerCase().includes(q.toLowerCase()) || o.domain.includes(q.toLowerCase())) &&
    (plan === 'all' || o.plan === plan));

  return (
    <div className="space-y-5">
      <Card className="p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 flex-1 min-w-48">
          <Search className="h-4 w-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search organizations..." className="w-full bg-transparent text-sm outline-none text-slate-700 dark:text-slate-200" />
        </div>
        <select value={plan} onChange={(e) => setPlan(e.target.value)} className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-700 dark:text-slate-200">
          <option value="all">All plans</option><option value="free">Free</option><option value="pro">Pro</option><option value="enterprise">Enterprise</option>
        </select>
        <Button onClick={() => goto('billing')}><Building2 className="h-4 w-4" /> Billing Center</Button>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((o) => {
          const orgUsers = allUsers.filter((u) => u.orgId === o.id && /^u_org_/.test(u.id)).length;
          return (
            <Card key={o.id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/10 text-indigo-500 font-bold">{o.name.slice(0, 2).toUpperCase()}</div>
                  <div><div className="font-semibold text-slate-900 dark:text-white">{o.name}</div><div className="text-xs text-slate-400">{o.domain}</div></div>
                </div>
                <Badge className={statusBadge(o.status)}>{o.status.replace('_', ' ')}</Badge>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div><div className="text-lg font-bold text-slate-900 dark:text-white capitalize">{o.plan}</div><div className="text-[10px] text-slate-400">Plan</div></div>
                <div><div className="text-lg font-bold text-slate-900 dark:text-white">{orgUsers}</div><div className="text-[10px] text-slate-400">Users</div></div>
                <div><div className="text-lg font-bold text-slate-900 dark:text-white">{money(o.mrr)}</div><div className="text-[10px] text-slate-400">MRR</div></div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(o.usedSeats / o.seats) * 100}%` }} />
                </div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1"><Users className="h-3 w-3" />{o.usedSeats}/{o.seats}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Organizations;
