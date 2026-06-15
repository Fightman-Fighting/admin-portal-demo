import React from 'react';
import { usePlatform } from '@/contexts/PlatformContext';
import StatCard from '@/components/shared/StatCard';
import LiveFeed from '@/components/shared/LiveFeed';
import { Card, Badge, Ring } from '@/components/shared/Primitives';
import { AreaChart, Donut } from '@/components/shared/Charts';
import { Users, ShieldAlert, Activity, AlertTriangle } from 'lucide-react';

const OrgAdminDashboard: React.FC<{ orgId: string; goto: (p: string) => void }> = ({ orgId, goto }) => {
  const { allUsers, activity, rules, notifications, orgs } = usePlatform();
  const org = orgs.find((o) => o.id === orgId);
  const members = allUsers.filter((u) => /^u_org_/.test(u.id) && u.orgId === orgId);
  const online = members.filter((m) => m.status === 'online').length;
  const orgActivity = activity.filter((a) => a.orgId === orgId);
  const activeRules = rules.filter((r) => r.orgId === orgId && r.enabled).length;
  const alerts = notifications.filter((n) => n.orgId === orgId && (n.type === 'violation' || n.type === 'threshold')).length;
  const avgProd = Math.round(members.reduce((s, m) => s + m.productivity, 0) / (members.length || 1));

  const catTotals: Record<string, number> = {};
  orgActivity.forEach((a) => { catTotals[a.category] = (catTotals[a.category] || 0) + a.durationSec; });
  const colors: Record<string, string> = { work: '#0ea5e9', dev: '#8b5cf6', social: '#f59e0b', entertainment: '#f43f5e', shopping: '#10b981', news: '#06b6d4' };
  const donut = Object.entries(catTotals).map(([k, v]) => ({ label: k, value: v, color: colors[k] || '#6366f1' }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Team Members" value={String(members.length)} delta={6} icon={Users} accent="indigo" />
        <StatCard label="Online Now" value={String(online)} delta={3} icon={Activity} accent="emerald" />
        <StatCard label="Active Rules" value={String(activeRules)} icon={ShieldAlert} accent="cyan" />
        <StatCard label="Open Alerts" value={String(alerts)} delta={-8} icon={AlertTriangle} accent="rose" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card className="xl:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div><div className="text-sm text-slate-400">Team productivity</div><div className="text-2xl font-bold text-slate-900 dark:text-white">{avgProd}<span className="text-sm font-normal text-slate-400">/100 avg</span></div></div>
            <Badge className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20">Trending up</Badge>
          </div>
          <AreaChart data={[58, 64, 61, 70, 68, 75, avgProd]} labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} color="#10b981" />
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2"><span className="font-semibold text-slate-900 dark:text-white">Org focus</span><span className="text-xs text-slate-400">{org?.name}</span></div>
          <div className="flex justify-center my-3"><Ring value={avgProd} size={120} color="#6366f1" /></div>
          <Donut segments={donut.slice(0, 4)} />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <LiveFeed orgId={orgId} limit={9} title="Team Live Feed" />
        <Card className="xl:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 px-5 py-3.5"><span className="font-semibold text-slate-900 dark:text-white">Team members</span><button onClick={() => goto('users')} className="text-sm text-indigo-500 hover:underline">Manage</button></div>
          <div className="divide-y divide-slate-100 dark:divide-white/5 max-h-[420px] overflow-y-auto">
            {members.map((m) => (
              <div key={m.id} className="flex items-center gap-3 px-5 py-3">
                <img src={m.avatar} className="h-9 w-9 rounded-full object-cover" alt="" />
                <div className="flex-1 min-w-0"><div className="text-sm font-medium text-slate-900 dark:text-white truncate">{m.name}</div><div className="text-[11px] text-slate-400 truncate">{m.email}</div></div>
                <div className="w-24"><div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden"><div className={`h-full rounded-full ${m.productivity > 70 ? 'bg-emerald-500' : m.productivity > 50 ? 'bg-amber-400' : 'bg-rose-500'}`} style={{ width: `${m.productivity}%` }} /></div></div>
                <span className="w-8 text-right text-xs font-medium text-slate-500">{m.productivity}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OrgAdminDashboard;
