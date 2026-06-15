import React, { useState } from 'react';
import { usePlatform } from '@/contexts/PlatformContext';
import { Card, Badge, Button } from '@/components/shared/Primitives';
import { ago } from '@/lib/ui';
import { AlertTriangle, Bell, StickyNote, Send } from 'lucide-react';

export const AlertsPage: React.FC<{ orgId: string }> = ({ orgId }) => {
  const { notifications } = usePlatform();
  const alerts = notifications.filter((n) => n.orgId === orgId && (n.type === 'violation' || n.type === 'threshold'));
  const sev: Record<string, string> = {
    high: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
    medium: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
    low: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  };
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 px-5 py-3.5">
        <Bell className="h-4 w-4 text-rose-500" /><span className="font-semibold text-slate-900 dark:text-white">Alerts & Violations</span>
        <Badge className="ml-auto text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20">{alerts.filter((a) => !a.read).length} active</Badge>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-white/5 max-h-[560px] overflow-y-auto">
        {alerts.map((a) => (
          <div key={a.id} className="flex items-start gap-3 px-5 py-4">
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${a.severity === 'high' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}><AlertTriangle className="h-4 w-4" /></span>
            <div className="flex-1">
              <div className="flex items-center gap-2"><span className="font-medium text-slate-900 dark:text-white">{a.title}</span><Badge className={sev[a.severity]}>{a.severity}</Badge></div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{a.body}</div>
              <div className="mt-0.5 text-[11px] text-slate-400">{ago(a.timestamp)}</div>
            </div>
          </div>
        ))}
        {alerts.length === 0 && <div className="px-5 py-12 text-center text-sm text-slate-400">No alerts - all users within policy.</div>}
      </div>
    </Card>
  );
};

export const NotesPage: React.FC<{ orgId: string }> = ({ orgId }) => {
  const { allUsers, currentUser } = usePlatform();
  const members = allUsers.filter((u) => /^u_org_/.test(u.id) && u.orgId === orgId);
  const [notes, setNotes] = useState<{ id: string; user: string; text: string; ts: number; author: string }[]>([
    { id: '1', user: members[0]?.name || '', text: 'Discussed afternoon focus dips - agreed to enable a 2pm social media block.', ts: Date.now() - 86400000, author: currentUser?.name || '' },
  ]);
  const [sel, setSel] = useState(members[0]?.id);
  const [text, setText] = useState('');

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const u = members.find((m) => m.id === sel);
    setNotes((p) => [{ id: String(Date.now()), user: u?.name || '', text, ts: Date.now(), author: currentUser?.name || '' }, ...p]);
    setText('');
  };

  return (
    <div className="grid lg:grid-cols-3 gap-5">
      <Card className="p-5 h-fit">
        <div className="flex items-center gap-2 mb-3"><StickyNote className="h-4 w-4 text-amber-500" /><span className="font-semibold text-slate-900 dark:text-white">Add note</span></div>
        <form onSubmit={add} className="space-y-3">
          <select value={sel} onChange={(e) => setSel(e.target.value)} className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-700 dark:text-slate-200">
            {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="Write a note about this user..." className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500" />
          <Button type="submit" className="w-full"><Send className="h-4 w-4" /> Post note</Button>
        </form>
      </Card>
      <div className="lg:col-span-2 space-y-3">
        {notes.map((n) => (
          <Card key={n.id} className="p-4">
            <div className="flex items-center justify-between"><span className="font-medium text-slate-900 dark:text-white">{n.user}</span><span className="text-[11px] text-slate-400">{ago(n.ts)}</span></div>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">{n.text}</p>
            <div className="mt-2 text-[11px] text-slate-400">- {n.author}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};
