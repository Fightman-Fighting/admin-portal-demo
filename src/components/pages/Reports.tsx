import React, { useMemo, useState } from 'react';
import { usePlatform } from '@/contexts/PlatformContext';
import { Card, Button } from '@/components/shared/Primitives';
import { AreaChart, BarChart, Donut } from '@/components/shared/Charts';
import { fmtTime } from '@/lib/ui';
import { Download, FileBarChart, Check } from 'lucide-react';

const Reports: React.FC<{ orgId: string }> = ({ orgId }) => {
  const { activity, allUsers } = usePlatform();
  const orgActivity = activity.filter((a) => a.orgId === orgId);
  const [exported, setExported] = useState(false);

  const catTotals = useMemo(() => {
    const m: Record<string, number> = {};
    orgActivity.forEach((a) => { m[a.category] = (m[a.category] || 0) + a.durationSec; });
    return m;
  }, [orgActivity]);

  const colors: Record<string, string> = { work: '#0ea5e9', dev: '#8b5cf6', social: '#f59e0b', entertainment: '#f43f5e', shopping: '#10b981', news: '#06b6d4' };
  const donut = Object.entries(catTotals).map(([k, v]) => ({ label: k, value: v, color: colors[k] || '#6366f1' }));

  const topUsers = allUsers.filter((u) => /^u_org_/.test(u.id) && u.orgId === orgId).sort((a, b) => b.productivity - a.productivity).slice(0, 6);

  const exportCsv = () => {
    const rows = [['user', 'domain', 'category', 'duration_sec', 'timestamp']];
    orgActivity.slice(0, 200).forEach((a) => {
      const u = allUsers.find((x) => x.id === a.userId);
      rows.push([u?.name || '', a.domain, a.category, String(a.durationSec), new Date(a.timestamp).toISOString()]);
    });
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'activity-report.csv'; a.click();
    URL.revokeObjectURL(url);
    setExported(true); setTimeout(() => setExported(false), 2500);
  };

  return (
    <div className="space-y-5">
      <Card className="p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2"><FileBarChart className="h-5 w-5 text-indigo-500" /><span className="font-semibold text-slate-900 dark:text-white">Weekly Productivity Report</span></div>
        <Button onClick={exportCsv}>{exported ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}{exported ? 'Exported' : 'Export CSV'}</Button>
      </Card>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-5">
          <div className="font-semibold text-slate-900 dark:text-white mb-4">Productivity trend</div>
          <AreaChart data={[62, 68, 71, 65, 78, 74, 81]} labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} color="#10b981" />
        </Card>
        <Card className="p-5"><div className="font-semibold text-slate-900 dark:text-white mb-4">Category split</div><Donut segments={donut} /></Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <div className="font-semibold text-slate-900 dark:text-white mb-4">Top focus scores</div>
          <BarChart data={topUsers.map((u) => ({ label: u.name.split(' ')[0], value: u.productivity, color: u.productivity > 70 ? '#10b981' : '#f59e0b' }))} />
        </Card>
        <Card className="p-5">
          <div className="font-semibold text-slate-900 dark:text-white mb-4">Time by category</div>
          <div className="space-y-3">
            {Object.entries(catTotals).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
              <div key={k}>
                <div className="flex justify-between text-sm mb-1"><span className="capitalize text-slate-600 dark:text-slate-300">{k}</span><span className="text-slate-400">{fmtTime(v)}</span></div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden"><div className="h-full rounded-full" style={{ width: `${(v / Math.max(...Object.values(catTotals))) * 100}%`, background: colors[k] }} /></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
