import React, { useState, useMemo } from 'react';
import { usePlatform } from '@/contexts/PlatformContext';
import { supabase } from '@/lib/supabase';
import { Card, Badge, Button, Ring } from '@/components/shared/Primitives';
import { BarChart } from '@/components/shared/Charts';
import { catColor, fmtTime } from '@/lib/ui';
import { Sparkles, AlertTriangle, Lightbulb, Loader2, TrendingUp } from 'lucide-react';

const AIInsights: React.FC<{ orgScope?: string }> = ({ orgScope }) => {
  const { allUsers, activity, currentUser } = usePlatform();
  const members = allUsers.filter((u) => /^u_org_/.test(u.id) && (!orgScope || u.orgId === orgScope));
  const [selected, setSelected] = useState(members[0]?.id);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const user = allUsers.find((u) => u.id === selected);
  const userActivity = activity.filter((a) => a.userId === selected);

  const breakdown = useMemo(() => {
    const map: Record<string, number> = {};
    userActivity.forEach((a) => { map[a.category] = (map[a.category] || 0) + a.durationSec; });
    return Object.entries(map).map(([k, v]) => ({ label: k, sec: v }));
  }, [userActivity]);
  const totalSec = breakdown.reduce((s, b) => s + b.sec, 0) || 1;

  const generate = async () => {
    if (!user) return;
    setLoading(true); setErr(''); setResult(null);
    const bdMin: Record<string, number> = {};
    breakdown.forEach((b) => { bdMin[b.label] = Math.round(b.sec / 60); });
    try {
      const { data, error } = await supabase.functions.invoke('ai-insights', {
        body: { userName: user.name, breakdown: bdMin, productivity: user.productivity },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data);
    } catch (e: any) {
      setErr('AI service unavailable — showing fallback analysis.');
      const social = Math.round(((bdMin.social || 0) + (bdMin.entertainment || 0)) / (Object.values(bdMin).reduce((a, b) => a + b, 0) || 1) * 100);
      setResult({
        focusScore: user.productivity,
        riskLevel: user.productivity > 75 ? 'low' : user.productivity > 50 ? 'medium' : 'high',
        summary: `${user.name} spent roughly ${social}% of tracked time on social/entertainment with a focus score of ${user.productivity}/100.`,
        insights: [`${social}% of time on non-work categories`, `Focus score: ${user.productivity}/100`, 'Most active during morning hours'],
        recommendations: ['Block entertainment sites during work hours', 'Set a 45-minute social media daily cap'],
      });
    } finally { setLoading(false); }
  };

  const riskColor: Record<string, string> = {
    low: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    medium: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
    high: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
  };

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white"><Sparkles className="h-5 w-5" /></span>
            <div><div className="font-semibold text-slate-900 dark:text-white">AI Productivity Analyst</div><div className="text-xs text-slate-400">Powered by Gemini · live analysis</div></div>
          </div>
          <div className="ml-auto flex items-end gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Select user</label>
              <select value={selected} onChange={(e) => { setSelected(e.target.value); setResult(null); }} className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-700 dark:text-slate-200">
                {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <Button onClick={generate} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}{loading ? 'Analyzing...' : 'Generate Insights'}</Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="p-5">
          <div className="font-semibold text-slate-900 dark:text-white mb-4">Time Breakdown</div>
          <BarChart data={breakdown.map((b) => ({ label: b.label, value: Math.round(b.sec / 60), color: b.label === 'social' || b.label === 'entertainment' ? '#f43f5e' : '#6366f1' }))} />
          <div className="mt-4 space-y-1.5">
            {breakdown.sort((a, b) => b.sec - a.sec).map((b) => (
              <div key={b.label} className="flex items-center justify-between text-sm">
                <Badge className={catColor[b.label]}>{b.label}</Badge>
                <span className="text-slate-500">{fmtTime(b.sec)} · {Math.round((b.sec / totalSec) * 100)}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2 p-5">
          {!result && !loading && (
            <div className="grid place-items-center h-full py-16 text-center">
              <div><Sparkles className="h-10 w-10 mx-auto text-slate-300 dark:text-white/20" /><p className="mt-3 text-sm text-slate-400">Select a user and generate AI insights to see<br />productivity scoring, risk detection & recommendations.</p></div>
            </div>
          )}
          {loading && <div className="grid place-items-center h-full py-16"><Loader2 className="h-8 w-8 animate-spin text-indigo-500" /></div>}
          {result && (
            <div className="space-y-5">
              {err && <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">{err}</div>}
              <div className="flex items-center gap-5">
                <Ring value={result.focusScore} size={96} color="#8b5cf6" />
                <div>
                  <div className="flex items-center gap-2"><span className="text-sm text-slate-400">Risk level</span><Badge className={riskColor[result.riskLevel]}>{result.riskLevel}</Badge></div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-md">{result.summary}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-1.5 mb-2 text-sm font-semibold text-slate-900 dark:text-white"><TrendingUp className="h-4 w-4 text-indigo-500" /> Key insights</div>
                  <ul className="space-y-1.5">{result.insights?.map((i: string, k: number) => <li key={k} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />{i}</li>)}</ul>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-2 text-sm font-semibold text-slate-900 dark:text-white"><Lightbulb className="h-4 w-4 text-amber-500" /> Recommendations</div>
                  <ul className="space-y-1.5">{result.recommendations?.map((r: string, k: number) => <li key={k} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300"><AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />{r}</li>)}</ul>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AIInsights;
