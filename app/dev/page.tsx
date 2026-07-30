'use client';

import React, { useEffect, useState, useContext, useMemo } from 'react';
import { getSupabase } from '@/lib/supabase/client';
import { PresenceContext } from '@/components/presence-provider';
import { 
  Terminal, Database, Activity, Wifi, Settings, ShieldAlert, Globe, 
  Trash2, Send, Smartphone, Monitor, AlertTriangle, 
  CheckCircle2, Flame, Heart, Image as ImageIcon, Clock, HardDrive,
  Network, Zap, XCircle, FileText
} from 'lucide-react';

type TabType = 'OVERVIEW' | 'SYSTEM' | 'AUDIENCE' | 'COMMAND';

type IncidentEvent = {
  id: string;
  time: string;
  type: 'PHOTO' | 'CHEER' | 'SYSTEM' | 'ERROR';
  title: string;
  subtitle?: string;
  content?: string;
  imgUrl?: string;
  isMajor?: boolean;
};

type ClientError = {
  id: string;
  time: string;
  url: string;
  message: string;
  source?: string;
  resolved: boolean;
};

export default function OmniscienceDashboard() {
  const { onlineUsers, presenceList, broadcast } = useContext(PresenceContext);
  
  // States
  const [activeTab, setActiveTab] = useState<TabType>('OVERVIEW');
  const [dbLatency, setDbLatency] = useState(0);
  const [dbStatus, setDbStatus] = useState<'ONLINE'|'DEGRADED'|'OFFLINE'>('ONLINE');
  const [tableCounts, setTableCounts] = useState<Record<string, number>>({});
  const [storageSize, setStorageSize] = useState({ bytes: 0, count: 0 });
  const [settings, setSettings] = useState<any>(null);
  
  const [peakUsers, setPeakUsers] = useState(0);
  const [incidentTimeline, setIncidentTimeline] = useState<IncidentEvent[]>([]);
  const [errorLog, setErrorLog] = useState<ClientError[]>([]);
  const [apiMetrics, setApiMetrics] = useState<Record<string, number[]>>({}); // URL -> latencies[]
  
  const [isPanicMode, setIsPanicMode] = useState(false);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [holdTimeout, setHoldTimeout] = useState<NodeJS.Timeout | null>(null);
  const [toastInput, setToastInput] = useState('');

  // Initial Data Fetch
  const fetchAllData = async () => {
    const supabase = getSupabase();
    const { data: setts } = await supabase.from('site_settings').select('*').single();
    if (setts) setSettings(setts);

    const tables = ['sports', 'photo_wall', 'cheer_wall'];
    const counts: Record<string, number> = {};
    for (const t of tables) {
      const { count } = await supabase.from(t).select('*', { count: 'exact', head: true });
      counts[t] = count || 0;
    }
    setTableCounts(counts);

    const { data: files } = await supabase.storage.from('gallery').list();
    if (files) {
      setStorageSize({
        bytes: files.reduce((acc, f) => acc + (f.metadata?.size || 0), 0),
        count: files.length
      });
    }
  };

  useEffect(() => {
    fetchAllData();
    logIncident({ type: 'SYSTEM', title: 'Omniscience Boot', subtitle: 'System initialized' });
    logIncident({ type: 'SYSTEM', title: 'Omniscience V5 Online', subtitle: 'All telemetry linked.', isMajor: true });
  }, []);

  // Track Peak
  useEffect(() => { if (onlineUsers > peakUsers) setPeakUsers(onlineUsers); }, [onlineUsers, peakUsers]);

  // DB Ping
  useEffect(() => {
    const pingDb = async () => {
      const start = performance.now();
      const supabase = getSupabase();
      try {
        await supabase.from('site_settings').select('id').limit(1);
        const diff = Math.round(performance.now() - start);
        setDbLatency(diff);
        setDbStatus(diff > 1000 ? 'DEGRADED' : 'ONLINE');
      } catch (err) {
        setDbStatus('OFFLINE');
        logIncident({ type: 'ERROR', title: 'DB PING FAILED', isMajor: true });
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      }
    };
    pingDb();
    const interval = setInterval(pingDb, 5000);
    return () => clearInterval(interval);
  }, []);

  // Telemetry Subscriptions
  useEffect(() => {
    const supabase = getSupabase();
    const telSub = supabase.channel('global_telemetry')
      .on('broadcast', { event: 'client_error' }, (payload) => {
        const err: ClientError = {
          id: Math.random().toString(),
          time: new Date().toISOString().split('T')[1].slice(0, 8),
          url: payload.payload.url,
          message: payload.payload.message,
          source: payload.payload.source,
          resolved: false
        };
        setErrorLog(prev => [err, ...prev].slice(0, 100));
        logIncident({ type: 'ERROR', title: `Client Error @ ${err.url}`, content: err.message });
      })
      .on('broadcast', { event: 'api_metric' }, (payload) => {
        setApiMetrics(prev => {
          const ep = payload.payload.endpoint;
          const lat = payload.payload.latency;
          const current = prev[ep] || [];
          return { ...prev, [ep]: [...current.slice(-19), lat] };
        });
      }).subscribe();

    const dbSub = supabase.channel('global_db_dev')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'cheer_wall' }, (payload: any) => {
        logIncident({ type: 'CHEER', title: `New Cheer: ${payload.new.author_name}`, content: payload.new.message });
        setTableCounts(prev => ({...prev, cheer_wall: (prev.cheer_wall || 0) + 1}));
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'photo_wall' }, (payload: any) => {
        logIncident({ type: 'PHOTO', title: `New Photo: ${payload.new.uploader_name}`, content: payload.new.caption, imgUrl: payload.new.image_url });
        setTableCounts(prev => ({...prev, photo_wall: (prev.photo_wall || 0) + 1}));
      }).subscribe();

    return () => { supabase.removeChannel(telSub); supabase.removeChannel(dbSub); };
  }, []);

  const logIncident = (e: Omit<IncidentEvent, 'id' | 'time'>) => {
    setIncidentTimeline(prev => [
      { ...e, id: Math.random().toString(), time: new Date().toISOString().split('T')[1].slice(0, 8) },
      ...prev
    ].slice(0, 150));
  };

  const executeBroadcast = async (event: string, payload: any = {}) => {
    broadcast(event, payload);
    logIncident({ type: 'SYSTEM', title: 'Broadcast Sent', subtitle: event, isMajor: true });
  };

  const updateSetting = async (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
    const supabase = getSupabase();
    await supabase.from('site_settings').update({ [key]: value } as any).eq('id', 'main_settings');
    logIncident({ type: 'SYSTEM', title: 'Setting Updated', subtitle: `${key} = ${value}`, isMajor: true });
    
    if (key === 'is_maintenance_mode') {
      executeBroadcast('maintenance', { active: value });
    }
  };

  const startHoldAction = (action: () => void) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setHoldProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        if (navigator.vibrate) navigator.vibrate([100, 100, 100]);
        action();
        setHoldProgress(0);
      }
    }, 100);
    setHoldTimeout(interval);
  };

  const cancelHoldAction = () => {
    if (holdTimeout) clearInterval(holdTimeout);
    setHoldProgress(0);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const unresolvedErrors = errorLog.filter(e => !e.resolved).length;
  
  const errorHeatmap = useMemo(() => {
    const counts: Record<string, number> = {};
    errorLog.forEach(e => counts[e.url] = (counts[e.url] || 0) + 1);
    return Object.entries(counts).sort((a,b) => b[1] - a[1]);
  }, [errorLog]);

  // ---------------- RENDER HELPERS ----------------

  const renderDashboard = () => (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
      <div className={`p-4 rounded-xl flex items-center justify-between border ${dbStatus === 'ONLINE' && unresolvedErrors < 10 ? 'bg-green-950/20 border-green-900/50 text-green-400' : 'bg-red-950/20 border-red-900/50 text-red-400'}`}>
        <div>
          <div className="text-[10px] font-bold tracking-wider">SYSTEM HEALTH</div>
          <div className="text-2xl font-bold">{dbStatus === 'ONLINE' && unresolvedErrors < 10 ? 'OPTIMAL' : 'DEGRADED'}</div>
        </div>
        <Activity className="w-8 h-8 opacity-50" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#111111] p-4 rounded-xl border border-zinc-800">
          <div className="text-zinc-500 text-xs flex items-center gap-2"><Globe className="w-4 h-4 text-blue-400" /> ONLINE</div>
          <div className="text-3xl font-bold text-white mt-1">{onlineUsers}</div>
        </div>
        <div className="bg-[#111111] p-4 rounded-xl border border-zinc-800">
          <div className="text-zinc-500 text-xs flex items-center gap-2"><Activity className="w-4 h-4 text-purple-400" /> PEAK USERS</div>
          <div className="text-3xl font-bold text-zinc-300 mt-1">{peakUsers}</div>
        </div>
        <div className="bg-[#111111] p-4 rounded-xl border border-zinc-800">
          <div className="text-zinc-500 text-xs flex items-center gap-2"><Database className="w-4 h-4 text-yellow-400" /> DB LATENCY</div>
          <div className="text-3xl font-bold text-zinc-300 mt-1">{dbLatency}<span className="text-sm ml-1 text-zinc-600">ms</span></div>
        </div>
        <div className="bg-[#111111] p-4 rounded-xl border border-zinc-800">
          <div className="text-zinc-500 text-xs flex items-center gap-2"><HardDrive className="w-4 h-4 text-orange-400" /> STORAGE</div>
          <div className="text-xl font-bold text-zinc-300 mt-2 truncate">{formatBytes(storageSize.bytes)}</div>
        </div>
      </div>
    </div>
  );

  const renderStreams = () => (
    <div className="flex flex-col gap-3 animate-in fade-in duration-300">
      <div className="text-xs text-zinc-500 font-bold px-1">LIVE ACTIVITY & INCIDENTS</div>
      {incidentTimeline.map(s => (
        <div key={s.id} className={`p-3 rounded-lg border-l-4 bg-[#111111] ${s.isMajor ? 'border-l-yellow-500' : s.type === 'ERROR' ? 'border-l-red-500' : s.type === 'PHOTO' ? 'border-l-blue-500' : s.type === 'CHEER' ? 'border-l-primary' : 'border-l-zinc-500'}`}>
          <div className="flex justify-between items-center text-[10px] text-zinc-500 mb-1">
            <span className="font-bold flex items-center gap-1">
              {s.isMajor && <AlertTriangle className="w-3 h-3 text-yellow-500" />}
              {s.type}
            </span>
            <span>{s.time}</span>
          </div>
          <div className="text-sm font-bold text-white">{s.title}</div>
          {s.subtitle && <div className="text-xs text-zinc-400">{s.subtitle}</div>}
          {s.content && <div className="text-xs text-zinc-300 bg-black p-2 mt-2 rounded">{s.content}</div>}
          {s.imgUrl && <img src={s.imgUrl} className="mt-2 w-full h-32 object-cover rounded" alt="stream" />}
        </div>
      ))}
    </div>
  );

  const renderErrors = () => {
    return (
      <div className="flex flex-col gap-4 animate-in fade-in duration-300">
        <div className="bg-[#111111] p-4 rounded-xl border border-zinc-800">
          <div className="text-xs text-zinc-500 font-bold mb-3 flex items-center gap-2"><Flame className="w-4 h-4 text-red-500" /> ERROR HEATMAP</div>
          {errorHeatmap.length === 0 ? <div className="text-xs text-zinc-600">No errors detected.</div> : errorHeatmap.map(([url, count]) => (
            <div key={url} className="flex justify-between text-xs py-1 border-b border-zinc-800 last:border-0">
              <span className="text-zinc-300 truncate pr-2">{url}</span>
              <span className="text-red-400 font-bold">{count}</span>
            </div>
          ))}
        </div>

        <div className="text-xs text-zinc-500 font-bold px-1 mt-2">UNRESOLVED LOGS</div>
        {errorLog.filter(e => !e.resolved).map(e => (
          <div key={e.id} className="p-3 bg-red-950/20 border border-red-900/30 rounded-lg flex flex-col gap-2">
            <div className="flex justify-between text-[10px] text-red-400">
              <span>{e.time} • {e.url}</span>
              <button onClick={() => setErrorLog(prev => prev.map(p => p.id === e.id ? {...p, resolved: true} : p))} className="hover:text-white bg-red-900/50 px-2 py-0.5 rounded">RESOLVE</button>
            </div>
            <div className="text-sm font-bold text-red-300 break-words">{e.message}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderNetwork = () => {
    const apiRanking = Object.entries(apiMetrics).map(([ep, latencies]) => ({
      endpoint: ep,
      avg: Math.round(latencies.reduce((a,b)=>a+b,0) / latencies.length),
      reqs: latencies.length
    })).sort((a,b) => b.avg - a.avg);

    return (
      <div className="flex flex-col gap-4 animate-in fade-in duration-300">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#111111] p-4 rounded-xl border border-zinc-800 flex flex-col items-center justify-center">
            <Network className="w-6 h-6 text-blue-400 mb-2" />
            <div className="text-[10px] text-zinc-500">WSS CHANNELS</div>
            <div className="text-xl font-bold mt-1">3 ACTIVE</div>
          </div>
          <div className="bg-[#111111] p-4 rounded-xl border border-zinc-800 flex flex-col items-center justify-center">
            <Activity className="w-6 h-6 text-purple-400 mb-2" />
            <div className="text-[10px] text-zinc-500">SUBSCRIBERS</div>
            <div className="text-xl font-bold mt-1">{onlineUsers}</div>
          </div>
        </div>

        <div className="bg-[#111111] p-4 rounded-xl border border-zinc-800">
          <div className="text-xs text-zinc-500 font-bold mb-3 flex items-center gap-2"><Wifi className="w-4 h-4 text-green-500" /> API PERFORMANCE RANKING</div>
          {apiRanking.length === 0 ? <div className="text-xs text-zinc-600">No API telemetry yet.</div> : apiRanking.map(a => (
            <div key={a.endpoint} className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0">
              <div className="flex flex-col max-w-[60%]">
                <span className="text-[11px] text-zinc-300 truncate">{a.endpoint}</span>
                <span className="text-[9px] text-zinc-600">{a.reqs} requests recorded</span>
              </div>
              <span className={`text-sm font-bold ${a.avg > 500 ? 'text-red-400' : a.avg > 200 ? 'text-yellow-400' : 'text-green-400'}`}>{a.avg}ms</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSessions = () => (
    <div className="flex flex-col gap-3 animate-in fade-in duration-300">
      <div className="flex items-center justify-between text-xs text-zinc-500 px-1 font-bold">
        <span>ACTIVE SESSIONS ({onlineUsers})</span>
        <span>PING</span>
      </div>
      {presenceList.map(p => {
        const inactiveSecs = Math.round((new Date().getTime() - new Date(p.last_activity).getTime()) / 1000);
        return (
          <div key={p.key} className={`bg-[#111111] border ${inactiveSecs > 60 ? 'border-zinc-800/50 opacity-50' : 'border-zinc-800'} p-3 rounded-lg flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              {p.device === 'Mobile' || p.device === 'Tablet' ? <Smartphone className="w-5 h-5 text-zinc-400" /> : <Monitor className="w-5 h-5 text-zinc-400" />}
              <div className="flex flex-col">
                <span className="text-xs text-zinc-300 truncate max-w-[150px]">{p.pathname}</span>
                <span className="text-[9px] text-zinc-500">{p.browser} • Last act: {inactiveSecs}s ago</span>
              </div>
            </div>
            <div className={`text-xs font-bold ${p.latency < 200 ? 'text-green-500' : 'text-red-500'}`}>{p.latency}ms</div>
          </div>
        );
      })}
    </div>
  );

  const renderOverview = () => (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {renderDashboard()}
      <div className="h-px bg-zinc-900 w-full" />
      {renderStreams()}
    </div>
  );

  const renderSystem = () => (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {renderNetwork()}
      <div className="h-px bg-zinc-900 w-full" />
      {renderErrors()}
    </div>
  );

  const renderAudience = () => (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {renderSessions()}
    </div>
  );

  const renderCommand = () => (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* PANIC SHIELD & CRITICAL */}
      <div className="bg-red-950/20 border border-red-900/50 p-4 rounded-xl flex flex-col gap-4">
        <div className="flex items-center gap-2 text-red-500 font-bold"><AlertTriangle className="w-5 h-5" /> CRITICAL CONTROLS</div>
        
        <button 
          onPointerDown={() => startHoldAction(() => {
            const newState = !isPanicMode;
            setIsPanicMode(newState);
            executeBroadcast('panic_mode', { active: newState });
          })}
          onPointerUp={cancelHoldAction}
          onPointerLeave={cancelHoldAction}
          className="relative overflow-hidden w-full p-4 rounded-lg bg-black border border-red-900/50 text-red-500 font-bold flex justify-between items-center"
        >
          <div className="absolute top-0 left-0 h-full bg-red-900/30 transition-all duration-100 ease-linear" style={{ width: `${holdProgress}%` }} />
          <span className="relative z-10">{isPanicMode ? 'DISABLE PANIC MODE' : 'HOLD 1s TO PANIC'}</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => {
              const newState = !settings?.is_maintenance_mode;
              updateSetting('is_maintenance_mode', newState);
            }}
            className={`p-3 rounded-lg border flex justify-center text-xs font-bold ${settings?.is_maintenance_mode ? 'bg-orange-900 text-white border-orange-500' : 'bg-black text-orange-500 border-orange-900/50'}`}
          >
            {settings?.is_maintenance_mode ? 'END MAINTENANCE' : 'MAINTENANCE MODE'}
          </button>
          
          <button 
            onClick={() => { executeBroadcast('force_reload'); logIncident({ type: 'SYSTEM', title: 'Force Refresh All Clients', isMajor: true }); }}
            className="p-3 rounded-lg bg-black border border-red-900/50 text-red-400 flex justify-center text-xs font-bold"
          >
            FORCE REFRESH
          </button>
        </div>

        <button 
          onClick={async () => { await fetch('/api/cache/purge', { method: 'POST' }); logIncident({ type: 'SYSTEM', title: 'Cache Purged', isMajor: true }); }}
          className="w-full p-3 rounded-lg bg-black border border-red-900/50 text-red-400 flex justify-between items-center text-xs"
        >
          <span>PURGE NEXT.JS CACHE</span><Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* CROWD INTERACTION */}
      <div className="bg-[#111111] border border-zinc-800 p-4 rounded-xl flex flex-col gap-4">
        <div className="flex items-center gap-2 text-zinc-400 font-bold text-xs"><Zap className="w-4 h-4 text-yellow-500" /> CROWD INTERACTION</div>
        
        <div className="flex gap-2">
          <input 
            type="text" 
            value={toastInput} 
            onChange={e => setToastInput(e.target.value)}
            className="flex-1 bg-black border border-zinc-800 p-3 rounded-lg focus:outline-none focus:border-zinc-500 text-sm" 
            placeholder="Broadcast a popup message..."
          />
          <button 
            onClick={() => {
              if (!toastInput) return;
              executeBroadcast('toast', { text: toastInput });
              setToastInput('');
            }}
            className="p-3 bg-zinc-800 rounded-lg text-white font-bold text-xs"
          >
            SEND
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <button onClick={() => executeBroadcast('hearts')} className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-bold text-pink-400">💖 HEART BURST</button>
          <button onClick={() => executeBroadcast('confetti')} className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-bold text-blue-400">🎉 CONFETTI</button>
          <button onClick={() => executeBroadcast('glitch')} className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-bold text-green-400">📺 GLITCH SCREEN</button>
          <button onClick={() => executeBroadcast('shake')} className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-bold text-yellow-400">💥 SHAKE SCREENS</button>
          <button onClick={() => executeBroadcast('blackout')} className="col-span-2 p-3 rounded-lg bg-black border border-zinc-800 text-xs font-bold text-red-500 tracking-widest mt-2">🌑 STAND BY BLACKOUT</button>
        </div>
      </div>

      {/* ANNOUNCEMENT */}
      {settings && (
        <div className="bg-[#111111] border border-zinc-800 p-4 rounded-xl flex flex-col gap-4">
          <div className="flex items-center gap-2 text-zinc-400 font-bold text-xs"><Settings className="w-4 h-4" /> GLOBAL ANNOUNCEMENT</div>
          <input 
            type="text" 
            value={settings.announcement_text || ''} 
            onChange={e => setSettings({...settings, announcement_text: e.target.value})}
            onBlur={e => updateSetting('announcement_text', e.target.value)}
            className="w-full bg-black border border-zinc-800 p-3 rounded-lg focus:outline-none focus:border-zinc-500 text-sm" 
            placeholder="Global Announcement Text..."
          />
          <label className="flex items-center justify-between">
            <span className="text-sm">Show Announcement</span>
            <input type="checkbox" checked={settings.is_announcement_active} onChange={e => updateSetting('is_announcement_active', e.target.checked)} className="w-5 h-5 accent-primary" />
          </label>
        </div>
      )}

      {/* DEBUG TOOLKIT */}
      <div className="bg-[#111111] border border-zinc-800 p-4 rounded-xl flex flex-col gap-3">
        <div className="flex items-center gap-2 text-zinc-400 font-bold text-xs"><Terminal className="w-4 h-4" /> DEBUG TOOLKIT</div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => {
            logIncident({ type: 'SYSTEM', title: 'Test Ping', content: 'Ping sent successfully.' });
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
          }} className="p-2 bg-zinc-900 rounded text-xs text-zinc-400 border border-zinc-800">Test Notification</button>
          <button onClick={() => fetchAllData()} className="p-2 bg-zinc-900 rounded text-xs text-zinc-400 border border-zinc-800">Test Database</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#000000] min-h-screen text-zinc-300 font-mono flex flex-col pb-24 select-none">
      <div className="sticky top-0 z-50 bg-[#09090b]/95 backdrop-blur-xl border-b border-zinc-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <ShieldAlert className="w-5 h-5 text-red-500" />
          <h1 className="font-bold tracking-tighter">OMNISCIENCE V5</h1>
        </div>
        <div className="text-xs font-bold text-primary flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          LIVE
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'OVERVIEW' && renderOverview()}
        {activeTab === 'SYSTEM' && renderSystem()}
        {activeTab === 'AUDIENCE' && renderAudience()}
        {activeTab === 'COMMAND' && renderCommand()}
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-[#09090b]/95 backdrop-blur-xl border-t border-zinc-800 px-1 py-2 pb-6 z-50">
        <div className="flex justify-between items-center max-w-lg mx-auto">
          {[
            { id: 'OVERVIEW', icon: Activity, label: 'OVERVIEW' },
            { id: 'SYSTEM', icon: Network, label: 'SYSTEM', count: unresolvedErrors },
            { id: 'AUDIENCE', icon: Globe, label: 'AUDIENCE' },
            { id: 'COMMAND', icon: Settings, label: 'COMMAND' }
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id as TabType)} className={`flex flex-col items-center gap-1 p-2 flex-1 relative transition-colors ${activeTab === t.id ? 'text-primary' : 'text-zinc-600'}`}>
              <t.icon className="w-5 h-5" />
              <span className="text-[10px] font-bold">{t.label}</span>
              {t.count ? <span className="absolute top-1 right-2 w-3 h-3 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold animate-pulse">{t.count}</span> : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
