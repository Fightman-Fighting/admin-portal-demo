import React from 'react';
import { usePlatform } from '@/contexts/PlatformContext';
import StatCard from '@/components/shared/StatCard';
import LiveFeed from '@/components/shared/LiveFeed';
import { Card, Badge, StatusDot } from '@/components/shared/Primitives';
import { Users, Radio, AlertTriangle, ArrowRight } from 'lucide-react';

const PartnerDashboard: React.FC<{ goto: (p: string) => void }> = ({ goto }) => {
  const { currentUser, assignedMembers, liveBrowsing, notifications } = usePlatform();
  if (!currentUser) return null;
  const assigned = assignedMembers(currentUser.id);
  const ids = assigned.map((a) => a.id);
  const online = assigned.filter((a) => a.status === 'online').length;
  const browsing = Object.keys(liveBrowsing).filter((k) => ids.includes(k)).length;
  const alerts = notifications.filter((n) => n.userId && ids.includes(n.userId) && n.type !== 'billing');

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Assigned Users" value={String(assigned.length)} icon={Users} accent="indigo" />
        <StatCard label="Browsing Now" value={String(browsing)} icon={Radio} accent="emerald" />
        <StatCard label="Active Alerts" value={String(alerts.filter((a) => !a.read).length)} icon={AlertTriangle} accent="rose" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card className="overflow-hidden">
          <div className="border-b border-slate-200 dark:border-white/10 px-5 py-3.5 font-semibold text-slate-900 dark:text-white">Assigned users</div>
          <div className="divide-y divide-slate-100 dark:divide-white/5 max-h-[480px] overflow-y-auto">
            {assigned.map((u) => {
              const site = liveBrowsing[u.id];
              return (
                <div key={u.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="relative"><img src={u.avatar} className="h-10 w-10 rounded-full object-cover" alt="" /><span className="absolute -bottom-0.5 -right-0.5"><StatusDot status={u.status} /></span></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 dark:text-white truncate">{u.name}</div>
                    {site ? <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><Radio className="h-2.5 w-2.5 animate-pulse" /> browsing {site.domain}</div> : <div className="text-[11px] text-slate-400">{u.status}</div>}
                  </div>
                  <span className="text-xs font-medium text-slate-500">{u.productivity}</span>
                </div>
              );
            })}
            {assigned.length === 0 && <div className="px-5 py-10 text-center text-sm text-slate-400">No users assigned yet.</div>}
          </div>
        </Card>

        <div className="xl:col-span-2 space-y-5">
          <LiveFeed userIds={ids} limit={8} title="Assigned Users Feed" />
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 px-5 py-3.5"><span className="font-semibold text-slate-900 dark:text-white">Recent alerts</span><button onClick={() => goto('alerts')} className="text-sm text-indigo-500 hover:underline flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></button></div>
            <div className="divide-y divide-slate-100 dark:divide-white/5 max-h-60 overflow-y-auto">
              {alerts.slice(0, 6).map((a) => (
                <div key={a.id} className="flex items-center gap-3 px-5 py-3">
                  <span className={`grid h-8 w-8 place-items-center rounded-lg ${a.severity === 'high' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}><AlertTriangle className="h-4 w-4" /></span>
                  <div className="flex-1"><div className="text-sm font-medium text-slate-900 dark:text-white">{a.title}</div><div className="text-xs text-slate-400">{a.body}</div></div>
                  <Badge className={a.severity === 'high' ? 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20' : 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20'}>{a.severity}</Badge>
                </div>
              ))}
              {alerts.length === 0 && <div className="px-5 py-8 text-center text-sm text-slate-400">No alerts for your users.</div>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
