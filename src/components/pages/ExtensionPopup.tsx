import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '@/components/shared/Primitives';
import { catColor, catDot, fmtTime } from '@/lib/ui';
import { Chrome, RefreshCw, Check, Wifi, Pause, Play, Globe } from 'lucide-react';

const SITES = [
  { domain: 'github.com', cat: 'dev', sec: 4200 }, { domain: 'figma.com', cat: 'work', sec: 2700 },
  { domain: 'slack.com', cat: 'work', sec: 1800 }, { domain: 'youtube.com', cat: 'entertainment', sec: 1500 },
  { domain: 'twitter.com', cat: 'social', sec: 900 }, { domain: 'docs.google.com', cat: 'work', sec: 1200 },
];

const ExtensionPopup: React.FC = () => {
  const [current, setCurrent] = useState(SITES[0]);
  const [sessionSec, setSessionSec] = useState(11460);
  const [synced, setSynced] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [tracking, setTracking] = useState(true);

  useEffect(() => {
    if (!tracking) return;
    const id = setInterval(() => {
      setSessionSec((s) => s + 4);
      setCurrent(SITES[Math.floor(Math.random() * SITES.length)]);
      setSynced(false);
    }, 4000);
    return () => clearInterval(id);
  }, [tracking]);

  const sync = () => {
    setSyncing(true);
    setTimeout(() => { setSyncing(false); setSynced(true); }, 1200);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* explanation */}
      <div className="space-y-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-2"><Chrome className="h-5 w-5 text-indigo-500" /><span className="font-semibold text-slate-900 dark:text-white">Chrome Extension</span><Badge className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20">Manifest V3</Badge></div>
          <p className="text-sm text-slate-500 dark:text-slate-400">The SentinelOps browser extension silently tracks the active tab URL, measures time spent per site, and streams periodic events to <code className="text-indigo-500">/api/activity/track</code>. Sessions are cached locally and synced when online.</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {['Tracks active tab URL & domain', 'Measures time-per-site in real time', 'Periodic background sync (every 30s)', 'Offline-first local session cache', 'Respects org rules (blocks flagged domains)'].map((f) => (
              <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" />{f}</li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <div className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Install</div>
          <div className="rounded-lg bg-slate-950 border border-white/10 p-3 font-mono text-xs text-emerald-400 space-y-1">
            <div>$ git clone sentinelops/extension</div>
            <div>$ chrome://extensions → Load unpacked</div>
            <div className="text-slate-500"># manifest_version: 3 · permissions: tabs, storage</div>
          </div>
        </Card>
      </div>

      {/* mock popup */}
      <div className="flex justify-center">
        <div className="w-80 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-indigo-600 to-cyan-500 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Chrome className="h-5 w-5" /><span className="font-semibold">SentinelOps</span></div>
              <span className={`flex items-center gap-1 text-[11px] ${tracking ? 'text-emerald-200' : 'text-amber-200'}`}>
                <span className={`h-2 w-2 rounded-full ${tracking ? 'bg-emerald-300 animate-pulse' : 'bg-amber-300'}`} />{tracking ? 'Tracking' : 'Paused'}
              </span>
            </div>
            <div className="mt-3 text-3xl font-bold">{fmtTime(sessionSec)}</div>
            <div className="text-xs text-indigo-100">Time tracked today</div>
          </div>

          <div className="p-4 space-y-3">
            <div className="rounded-lg border border-slate-200 dark:border-white/10 p-3">
              <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">Current session</div>
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${catDot[current.cat]} animate-pulse`} />
                <Globe className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-900 dark:text-white">{current.domain}</span>
                <Badge className={`ml-auto ${catColor[current.cat]}`}>{current.cat}</Badge>
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-1.5">Top sites today</div>
              <div className="space-y-1.5">
                {SITES.slice(0, 4).map((s) => (
                  <div key={s.domain} className="flex items-center gap-2 text-sm">
                    <span className={`h-1.5 w-1.5 rounded-full ${catDot[s.cat]}`} />
                    <span className="text-slate-700 dark:text-slate-200">{s.domain}</span>
                    <span className="ml-auto text-xs text-slate-400">{fmtTime(s.sec)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${synced ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
              <Wifi className="h-3.5 w-3.5" />{synced ? 'All events synced' : 'Pending sync...'}
            </div>

            <div className="flex gap-2">
              <Button onClick={sync} disabled={syncing} className="flex-1"><RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />{syncing ? 'Syncing' : 'Sync now'}</Button>
              <Button onClick={() => setTracking((t) => !t)} variant="outline">{tracking ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtensionPopup;
