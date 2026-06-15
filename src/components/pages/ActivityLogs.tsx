import React, { useState, useMemo } from 'react';
import { usePlatform } from '@/contexts/PlatformContext';
import { Card, Badge } from '@/components/shared/Primitives';
import { Heatmap } from '@/components/shared/Charts';
import { catColor, catDot, fmtTime, ago } from '@/lib/ui';
import { Filter, Globe } from 'lucide-react';

const ActivityLogs: React.FC<{ orgId?: string; userIds?: string[] }> = ({ orgId, userIds }) => {
  const { activity, allUsers } = usePlatform();
  const [cat, setCat] = useState('all');
  const [userF, setUserF] = useState('all');

  let base = activity;
  if (orgId) base = base.filter((a) => a.orgId === orgId);
  if (userIds) base = base.filter((a) => userIds.includes(a.userId));

  const members = allUsers.filter((u) => base.some((a) => a.userId === u.id));
  const filtered = base.filter((a) => (cat === 'all' || a.category === cat) && (userF === 'all' || a.userId === userF)).slice(0, 80);

  const heatmap = useMemo(() => {
    const m = Array.from({ length: 7 }, () => Array(12).fill(0));
    base.forEach((a) => {
      const d = new Date(a.timestamp);
      const day = (d.getDay() + 6) % 7;
      const hourBucket = Math.floor(d.getHours() / 2);
      m[day][hourBucket] += 1;
    });
    return m;
  }, [base]);

  const userById = (id: string) => allUsers.find((u) => u.id === id);

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="font-semibold text-slate-900 dark:text-white mb-3">Activity Heatmap</div>
        <Heatmap matrix={heatmap} />
      </Card>

      <Card className="p-4 flex flex-wrap items-center gap-3">
        <Filter className="h-4 w-4 text-slate-400" />
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-700 dark:text-slate-200">
          <option value="all">All categories</option>{['work', 'dev', 'social', 'entertainment', 'shopping', 'news'].map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={userF} onChange={(e) => setUserF(e.target.value)} className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-700 dark:text-slate-200">
          <option value="all">All users</option>{members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <span className="ml-auto text-xs text-slate-400">{filtered.length} entries</span>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 dark:border-white/10 px-5 py-3 font-semibold text-slate-900 dark:text-white">Activity Timeline</div>
        <div className="max-h-[520px] overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
          {filtered.map((a) => {
            const u = userById(a.userId);
            return (
              <div key={a.id} className="flex items-center gap-3 px-5 py-3">
                <span className={`h-2 w-2 rounded-full ${catDot[a.category]}`} />
                <img src={u?.avatar} className="h-7 w-7 rounded-full object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 dark:text-white">{u?.name}</div>
                  <div className="flex items-center gap-1 text-xs text-slate-400"><Globe className="h-3 w-3" />{a.url}</div>
                </div>
                <Badge className={catColor[a.category]}>{a.category}</Badge>
                <span className="hidden sm:inline w-14 text-right text-xs text-slate-400">{fmtTime(a.durationSec)}</span>
                <span className="w-16 text-right text-[11px] text-slate-400">{ago(a.timestamp)}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default ActivityLogs;
