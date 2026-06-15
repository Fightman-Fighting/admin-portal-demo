import React from 'react';
import { usePlatform } from '@/contexts/PlatformContext';
import { NAV, roleLabel } from '@/lib/nav';
import { Activity, LogOut, X } from 'lucide-react';

const Sidebar: React.FC<{ page: string; setPage: (p: string) => void; open: boolean; setOpen: (b: boolean) => void }> = ({ page, setPage, open, setOpen }) => {
  const { currentUser, logout, orgs } = usePlatform();
  if (!currentUser) return null;
  const items = NAV[currentUser.role];
  const sections = Array.from(new Set(items.map((i) => i.section)));
  const org = orgs.find((o) => o.id === currentUser.orgId);

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed z-40 lg:static inset-y-0 left-0 w-64 shrink-0 border-r border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 flex flex-col transition-transform ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 text-white"><Activity className="h-4 w-4" /></div>
            <span className="font-bold tracking-tight text-slate-900 dark:text-white">SentinelOps</span>
          </div>
          <button className="lg:hidden text-slate-400" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
        </div>

        <div className="px-3 py-3 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 dark:bg-white/5 px-3 py-2.5">
            <img src={currentUser.avatar} className="h-9 w-9 rounded-full object-cover" alt="" />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">{currentUser.name}</div>
              <div className="truncate text-[11px] text-indigo-500 dark:text-indigo-400">{roleLabel[currentUser.role]}</div>
            </div>
          </div>
          {org && currentUser.role !== 'SUPER_ADMIN' && (
            <div className="mt-2 px-1 text-[11px] text-slate-400">Workspace · <span className="font-medium text-slate-600 dark:text-slate-300">{org.name}</span></div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {sections.map((s) => (
            <div key={s}>
              <div className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{s}</div>
              <div className="space-y-0.5">
                {items.filter((i) => i.section === s).map((i) => {
                  const Icon = i.icon;
                  const active = page === i.id;
                  return (
                    <button key={i.id} onClick={() => { setPage(i.id); setOpen(false); }}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'}`}>
                      <Icon className="h-4 w-4 shrink-0" />{i.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-200 dark:border-white/10">
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
