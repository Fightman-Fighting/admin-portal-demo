import React from 'react';
import { usePlatform } from '@/contexts/PlatformContext';
import { Card, Badge } from './Primitives';
import { catColor, catDot, fmtTime, ago } from '@/lib/ui';
import { Radio, Globe } from 'lucide-react';

const LiveFeed: React.FC<{ orgId?: string; userIds?: string[]; limit?: number; title?: string }> = ({ orgId, userIds, limit = 14, title = 'Live Activity Feed' }) => {
  const { activity, allUsers, liveBrowsing } = usePlatform();
  let feed = activity;
  if (orgId) feed = feed.filter((a) => a.orgId === orgId);
  if (userIds) feed = feed.filter((a) => userIds.includes(a.userId));
  feed = feed.slice(0, limit);
  const userById = (id: string) => allUsers.find((u) => u.id === id);

  const browsingList = Object.entries(liveBrowsing).filter(([uid]) => {
    const u = userById(uid);
    if (!u) return false;
    if (orgId && u.orgId !== orgId) return false;
    if (userIds && !userIds.includes(uid)) return false;
    return true;
  });

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500"><Radio className="h-4 w-4 animate-pulse" /></span>
          <span className="font-semibold text-slate-900 dark:text-white">{title}</span>
        </div>
        <Badge className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20">{browsingList.length} browsing now</Badge>
      </div>

      {browsingList.length > 0 && (
        <div className="border-b border-slate-100 dark:border-white/5 bg-slate-50/60 dark:bg-white/[0.02] px-5 py-2.5">
          <div className="flex flex-wrap gap-2">
            {browsingList.slice(0, 6).map(([uid, site]) => {
              const u = userById(uid)!;
              return (
                <span key={uid} className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 px-2 py-1 text-[11px]">
                  <span className={`h-1.5 w-1.5 rounded-full ${catDot[site.cat]} animate-pulse`} />
                  <span className="font-medium text-slate-700 dark:text-slate-200">{u.name.split(' ')[0]}</span>
                  <span className="text-slate-400">· {site.domain}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className="max-h-[460px] overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
        {feed.map((a) => {
          const u = userById(a.userId);
          return (
            <div key={a.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-white/[0.02]">
              <img src={u?.avatar} className="h-8 w-8 rounded-full object-cover" alt="" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-900 dark:text-white truncate">{u?.name || 'Unknown'}</span>
                  <span className="text-xs text-slate-400">visited</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500"><Globe className="h-3 w-3" /> {a.domain}</div>
              </div>
              <Badge className={catColor[a.category]}>{a.category}</Badge>
              <div className="hidden sm:block w-14 text-right text-xs text-slate-400">{fmtTime(a.durationSec)}</div>
              <div className="w-16 text-right text-[11px] text-slate-400">{ago(a.timestamp)}</div>
            </div>
          );
        })}
        {feed.length === 0 && <div className="px-5 py-10 text-center text-sm text-slate-400">No activity yet</div>}
      </div>
    </Card>
  );
};

export default LiveFeed;
