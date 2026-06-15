import React, { useState } from 'react';
import { usePlatform } from '@/contexts/PlatformContext';
import { ago } from '@/lib/ui';
import { Menu, Search, Bell, Moon, Sun, Radio } from 'lucide-react';

const Topbar: React.FC<{ onMenu: () => void; title: string }> = ({ onMenu, title }) => {
  const { currentUser, dark, toggleDark, notifications, markAllRead } = usePlatform();
  const [showNotifs, setShowNotifs] = useState(false);
  if (!currentUser) return null;
  const scope = currentUser.role === 'SUPER_ADMIN' ? notifications : notifications.filter((n) => n.orgId === currentUser.orgId);
  const unread = scope.filter((n) => !n.read).length;

  const sev: Record<string, string> = { high: 'bg-rose-500', medium: 'bg-amber-400', low: 'bg-emerald-500' };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-950/80 px-4 backdrop-blur">
      <button onClick={onMenu} className="lg:hidden text-slate-500"><Menu className="h-5 w-5" /></button>
      <h1 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h1>

      <div className="ml-2 hidden md:flex items-center gap-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1.5 w-72">
        <Search className="h-4 w-4 text-slate-400" />
        <input placeholder="Search users, orgs, activity..." className="w-full bg-transparent text-sm outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400" />
      </div>

      <div className="ml-auto flex items-center gap-1">
        <span className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          <Radio className="h-3 w-3 animate-pulse" /> Live
        </span>
        <button onClick={toggleDark} className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5">
          {dark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>
        <div className="relative">
          <button onClick={() => setShowNotifs((s) => !s)} className="relative grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5">
            <Bell className="h-4.5 w-4.5" />
            {unread > 0 && <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 px-1 place-items-center rounded-full bg-rose-500 text-[9px] font-bold text-white">{unread}</span>}
          </button>
          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 px-4 py-2.5">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</span>
                <button onClick={markAllRead} className="text-xs text-indigo-500 hover:underline">Mark all read</button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {scope.slice(0, 12).map((n) => (
                  <div key={n.id} className={`flex gap-3 px-4 py-3 border-b border-slate-100 dark:border-white/5 ${!n.read ? 'bg-indigo-50/50 dark:bg-indigo-500/5' : ''}`}>
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${sev[n.severity]}`} />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">{n.title}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{n.body}</div>
                      <div className="mt-0.5 text-[10px] text-slate-400">{ago(n.timestamp)}</div>
                    </div>
                  </div>
                ))}
                {scope.length === 0 && <div className="px-4 py-8 text-center text-sm text-slate-400">No notifications</div>}
              </div>
            </div>
          )}
        </div>
        <img src={currentUser.avatar} className="ml-1 h-9 w-9 rounded-full object-cover ring-2 ring-indigo-500/30" alt="" />
      </div>
    </header>
  );
};

export default Topbar;
