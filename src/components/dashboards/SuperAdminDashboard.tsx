import React from 'react';
import { usePlatform } from '@/contexts/PlatformContext';
import StatCard from '@/components/shared/StatCard';
import LiveFeed from '@/components/shared/LiveFeed';
import { Card, Badge, statusBadge } from '@/components/shared/Primitives';
import { AreaChart, Donut } from '@/components/shared/Charts';
import { money } from '@/lib/ui';
import { Building2, Users, Radio, DollarSign } from 'lucide-react';

const SuperAdminDashboard: React.FC<{ goto: (p: string) => void }> = ({ goto }) => {
  const { orgs, allUsers, activity, subscriptions } = usePlatform();
  const trackedUsers = allUsers.filter((u) => /^u_org_/.test(u.id));
  const online = trackedUsers.filter((u) => u.status === 'online').length;
  const mrr = orgs.reduce((s, o) => s + o.mrr, 0);
  const planCounts = ['free', 'pro', 'enterprise'].map((p) => ({
    label: p, value: subscriptions.filter((s) => s.plan === p).length,
    color: p === 'free' ? '#94a3b8' : p === 'pro' ? '#6366f1' : '#22d3ee',
  }));

  const revenue = [12400, 15200, 14800, 18900, 21500, 23800, mrr * 100];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Organizations" value={String(orgs.length)} delta={12} icon={Building2} accent="indigo" />
        <StatCard label="Total Users" value={String(trackedUsers.length)} delta={8} icon={Users} accent="cyan" />
        <StatCard label="Active Sessions" value={String(online)} delta={5} icon={Radio} accent="emerald" />
        <StatCard label="Monthly Revenue" value={money(mrr)} delta={20} icon={DollarSign} accent="violet" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card className="xl:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-slate-400">Platform Revenue</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{money(mrr * 12)}<span className="text-sm font-normal text-slate-400"> /yr ARR</span></div>
            </div>
            <Badge className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20">+20% MoM</Badge>
          </div>
          <AreaChart data={revenue} labels={['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']} color="#6366f1" />
        </Card>

        <Card className="p-5">
          <div className="mb-4 font-semibold text-slate-900 dark:text-white">Subscription Mix</div>
          <Donut segments={planCounts} />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card className="xl:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 px-5 py-3.5">
            <span className="font-semibold text-slate-900 dark:text-white">Organizations</span>
            <button onClick={() => goto('orgs')} className="text-sm text-indigo-500 hover:underline">Manage all</button>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-slate-400 border-b border-slate-100 dark:border-white/5">
              <th className="px-5 py-2.5 font-medium">Organization</th><th className="py-2.5 font-medium">Plan</th><th className="py-2.5 font-medium">Seats</th><th className="py-2.5 font-medium">MRR</th><th className="py-2.5 font-medium">Status</th>
            </tr></thead>
            <tbody>
              {orgs.map((o) => (
                <tr key={o.id} className="border-b border-slate-50 dark:border-white/[0.03] hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-500/10 text-indigo-500 text-xs font-bold">{o.name.slice(0, 2).toUpperCase()}</div>
                      <div><div className="font-medium text-slate-900 dark:text-white">{o.name}</div><div className="text-[11px] text-slate-400">{o.domain}</div></div>
                    </div>
                  </td>
                  <td className="py-3 capitalize text-slate-600 dark:text-slate-300">{o.plan}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">{o.usedSeats}/{o.seats}</td>
                  <td className="py-3 font-medium text-slate-900 dark:text-white">{money(o.mrr)}</td>
                  <td className="py-3"><Badge className={statusBadge(o.status)}>{o.status.replace('_', ' ')}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <LiveFeed limit={10} title="Global Live Feed" />
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
