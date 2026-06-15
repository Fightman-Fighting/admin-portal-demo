import React, { useState } from 'react';
import { usePlatform } from '@/contexts/PlatformContext';
import { Card, Badge, Button } from '@/components/shared/Primitives';
import { catColor } from '@/lib/ui';
import { ShieldAlert, Plus, Trash2, Ban, Bell } from 'lucide-react';

const RulesEngine: React.FC<{ orgId: string }> = ({ orgId }) => {
  const { rules, toggleRule, addRule, removeRule } = usePlatform();
  const orgRules = rules.filter((r) => r.orgId === orgId);
  const [form, setForm] = useState({ name: '', category: 'social', target: '', limitMin: 60, action: 'alert' as 'alert' | 'block' });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    addRule({ orgId, name: form.name, category: form.category as any, target: form.target || `all ${form.category}`, limitMin: Number(form.limitMin), action: form.action, enabled: true });
    setForm({ name: '', category: 'social', target: '', limitMin: 60, action: 'alert' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 space-y-3">
        {orgRules.map((r) => (
          <Card key={r.id} className="p-4 flex items-center gap-4">
            <div className={`grid h-10 w-10 place-items-center rounded-lg ${r.action === 'block' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
              {r.action === 'block' ? <Ban className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-slate-900 dark:text-white">{r.name}</div>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                <Badge className={catColor[r.category]}>{r.category}</Badge>
                <span>{r.target}</span>
                {r.limitMin > 0 && <span>· limit {r.limitMin}m/day</span>}
                <span>· {r.action === 'block' ? 'Block access' : 'Alert partner'}</span>
              </div>
            </div>
            <button onClick={() => toggleRule(r.id)} className={`relative h-6 w-11 rounded-full transition-colors ${r.enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-white/10'}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${r.enabled ? 'left-5.5' : 'left-0.5'}`} style={{ left: r.enabled ? '22px' : '2px' }} />
            </button>
            <button onClick={() => removeRule(r.id)} className="text-slate-400 hover:text-rose-500"><Trash2 className="h-4 w-4" /></button>
          </Card>
        ))}
        {orgRules.length === 0 && <Card className="p-10 text-center text-sm text-slate-400">No rules configured yet. Create one to start enforcing policies.</Card>}
      </div>

      <Card className="p-5 h-fit">
        <div className="flex items-center gap-2 mb-4"><ShieldAlert className="h-4 w-4 text-indigo-500" /><span className="font-semibold text-slate-900 dark:text-white">New rule</span></div>
        <form onSubmit={submit} className="space-y-3">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Rule name" className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-700 dark:text-slate-200">
            {['social', 'entertainment', 'shopping', 'news', 'domain'].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} placeholder="Target (e.g. youtube.com)" className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500" />
          <div className="flex gap-2">
            <input type="number" value={form.limitMin} onChange={(e) => setForm({ ...form, limitMin: Number(e.target.value) })} placeholder="Limit (min)" className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500" />
            <select value={form.action} onChange={(e) => setForm({ ...form, action: e.target.value as any })} className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-700 dark:text-slate-200">
              <option value="alert">Alert</option><option value="block">Block</option>
            </select>
          </div>
          <Button type="submit" className="w-full"><Plus className="h-4 w-4" /> Add rule</Button>
        </form>
        <p className="mt-3 text-xs text-slate-400">Example: YouTube &gt; 60 min/day → alert accountability partner.</p>
      </Card>
    </div>
  );
};

export default RulesEngine;
