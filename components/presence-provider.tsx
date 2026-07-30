'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { getSupabase } from '@/lib/supabase/client';
import { usePathname } from 'next/navigation';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { parseUserAgent } from '@/hooks/useDeviceDetect';

export interface PresenceData {
  key: string;
  online_at: string;
  pathname: string;
  device: string;
  browser: string;
  latency: number;
  last_activity: string;
}

export const PresenceContext = React.createContext<{
  onlineUsers: number;
  presenceList: PresenceData[];
  broadcast: (event: string, payload?: any) => void;
}>({
  onlineUsers: 0,
  presenceList: [],
  broadcast: () => {},
});

export default function PresenceProvider({ children }: { children: React.ReactNode }) {
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [presenceList, setPresenceList] = useState<PresenceData[]>([]);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Telemetry
  const [latency, setLatency] = useState(0);
  const [deviceInfo, setDeviceInfo] = useState({ device: 'Desktop', browser: 'Unknown' });

  // Crowd Control
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isPanicMode, setIsPanicMode] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isBlackout, setIsBlackout] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number }[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Refs — prevent stale closures in long-lived channel callbacks
  const isPanicModeRef = useRef(false);
  const channelRef = useRef<any>(null);
  const deviceInfoRef = useRef(deviceInfo);
  const latencyRef = useRef(latency);
  const pathnameRef = useRef(pathname);

  // Debug pill
  const [showDebugPill, setShowDebugPill] = useState(false);
  const [debugState, setDebugState] = useState('INIT');
  const [lastEvent, setLastEvent] = useState('NONE');

  // Keep refs in sync with state
  useEffect(() => { isPanicModeRef.current = isPanicMode; }, [isPanicMode]);
  useEffect(() => { deviceInfoRef.current = deviceInfo; }, [deviceInfo]);
  useEffect(() => { latencyRef.current = latency; }, [latency]);
  useEffect(() => { pathnameRef.current = pathname; }, [pathname]);

  // Debug pill — read from localStorage and listen for changes
  useEffect(() => {
    setShowDebugPill(localStorage.getItem('dev_debug_mode') === 'true');
    const handler = () => setShowDebugPill(localStorage.getItem('dev_debug_mode') === 'true');
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  // Telemetry: device detection + fetch latency interceptor
  useEffect(() => {
    const info = parseUserAgent(window.navigator.userAgent);
    setDeviceInfo(info);
    deviceInfoRef.current = info;
    setMounted(true);

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const start = performance.now();
      try {
        const response = await originalFetch(...args);
        const ms = Math.round(performance.now() - start);
        setLatency(ms);
        latencyRef.current = ms;
        return response;
      } catch (error) {
        throw error;
      }
    };
    return () => { window.fetch = originalFetch; };
  }, []);

  // Supabase Realtime — one channel, never recreated on route changes
  useEffect(() => {
    const supabase = getSupabase();
    const sessionId = Math.random().toString(36).substring(2, 15);

    const channel = supabase.channel('global_presence', {
      config: {
        presence: { key: sessionId },
        broadcast: { ack: true, self: true },
      },
    });

    channelRef.current = channel;
    setDebugState('CREATED');

    // Fetch initial maintenance state
    supabase
      .from('site_settings')
      .select('is_maintenance_mode')
      .eq('id', 'main_settings')
      .single()
      .then(({ data }) => { if (data) setIsMaintenance(data.is_maintenance_mode); });

    channel
      .on('broadcast', { event: 'force_reload' }, () => {
        window.location.reload();
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'site_settings',
        filter: 'id=eq.main_settings',
      }, (payload) => {
        if (payload.new && 'is_maintenance_mode' in payload.new) {
          setIsMaintenance(payload.new.is_maintenance_mode);
        }
      })
      .on('broadcast', { event: 'panic_mode' }, (payload) => {
        const active: boolean = payload.payload.active;
        setIsPanicMode(active);
        isPanicModeRef.current = active;
        document.body.classList.toggle('panic-mode', active);
      })
      .on('broadcast', { event: 'confetti' }, () => {
        if (isPanicModeRef.current) return;
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, zIndex: 9999 });
      })
      .on('broadcast', { event: 'hearts' }, () => {
        setLastEvent('hearts-' + Date.now());
        if (isPanicModeRef.current) return;
        const newHearts = Array.from({ length: 20 }, (_, i) => ({
          id: Date.now() + i,
          x: Math.random() * 100,
        }));
        setHearts(prev => [...prev, ...newHearts]);
        setTimeout(() => setHearts(prev => prev.filter(h => !newHearts.find(n => n.id === h.id))), 3500);
      })
      .on('broadcast', { event: 'glitch' }, () => {
        setLastEvent('glitch-' + Date.now());
        if (isPanicModeRef.current) return;
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 3000);
      })
      .on('broadcast', { event: 'blackout' }, () => {
        setLastEvent('blackout-' + Date.now());
        if (isPanicModeRef.current) return;
        setIsBlackout(true);
        setTimeout(() => setIsBlackout(false), 5000);
      })
      .on('broadcast', { event: 'shake' }, (payload) => {
        setLastEvent('shake-' + Date.now());
        if (isPanicModeRef.current) return;
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), payload.payload?.duration || 2000);
      })
      .on('broadcast', { event: 'toast' }, (payload) => {
        setLastEvent('toast-' + Date.now());
        // Support both `message` and `text` keys for backward compat
        const msg = payload.payload?.message || payload.payload?.text || '';
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 5000);
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setOnlineUsers(Object.keys(state).length);
        const pList: PresenceData[] = [];
        for (const key in state) {
          const p = state[key][0] as any;
          if (p) {
            pList.push({
              key,
              online_at: p.online_at,
              pathname: p.pathname || '/',
              device: p.device || 'Unknown',
              browser: p.browser || 'Unknown',
              latency: p.latency || 0,
              last_activity: p.last_activity || p.online_at,
            });
          }
        }
        setPresenceList(pList);
      });

    channel.subscribe((status, err) => {
      setDebugState(status);
      if (status === 'SUBSCRIBED') {
        const now = new Date().toISOString();
        channel.track({
          online_at: now,
          pathname: pathnameRef.current,
          device: deviceInfoRef.current.device,
          browser: deviceInfoRef.current.browser,
          latency: 0,
          last_activity: now,
        });
      } else if ((status === 'CLOSED' || status === 'CHANNEL_ERROR') && err) {
        console.error('[PresenceProvider] Channel error:', err);
      }
    });

    return () => {
      channelRef.current = null;
      supabase.removeChannel(channel);
    };
  }, []); // Run only once on mount — intentional

  // Update presence tracking on route / latency changes
  useEffect(() => {
    const ch = channelRef.current;
    if (ch && ch.state === 'joined') {
      const now = new Date().toISOString();
      ch.track({
        online_at: now,
        pathname,
        device: deviceInfo.device,
        browser: deviceInfo.browser,
        latency,
        last_activity: now,
      });
    }
  }, [pathname, latency, deviceInfo]);

  const broadcast = useCallback(async (event: string, payload: any = {}) => {
    const ch = channelRef.current;
    if (!ch) {
      setToastMessage('⏳ System booting up... Please wait.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    try {
      const resp = await ch.send({ type: 'broadcast', event, payload });
      if (resp !== 'ok') {
        setToastMessage(`⚠️ Send failed (${resp})`);
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (err) {
      console.error('[Broadcast] Error:', err);
      setToastMessage('⚠️ Broadcast error');
      setTimeout(() => setToastMessage(null), 3000);
    }
  }, []);

  return (
    <PresenceContext.Provider value={{ onlineUsers, presenceList, broadcast }}>
      {isGlitching && (
        <style dangerouslySetInnerHTML={{ __html: `
          body { animation: glitch-anim 0.2s linear infinite; }
          @keyframes glitch-anim {
            0%   { filter: invert(1) hue-rotate(90deg)  contrast(150%); transform: translate(4px, -4px);  }
            50%  { filter: invert(0) hue-rotate(0deg)   contrast(100%); transform: translate(-4px, 4px);  }
            100% { filter: invert(1) hue-rotate(180deg) contrast(150%); transform: translate(4px, -4px);  }
          }
        `}} />
      )}

      <div className={`transition-transform duration-75 ${isShaking ? 'animate-[shake_0.2s_ease-in-out_infinite]' : ''}`}>
        {children}
      </div>

      {mounted && createPortal(
        <>
          {/* Toast Notification */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.9 }}
                animate={{ opacity: 1, y: 20, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                className="fixed top-4 left-1/2 -translate-x-1/2 z-[99999] bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl border border-white/10 flex items-center gap-3 pointer-events-none"
              >
                <span className="text-xl">🔔</span>
                <p className="font-semibold text-sm">{toastMessage}</p>
              </motion.div>
            )}

            {/* System Blackout */}
            {isBlackout && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 z-[99999] bg-black pointer-events-none flex items-center justify-center"
              >
                <div className="text-red-500 font-mono text-sm tracking-widest animate-pulse">SYSTEM_BLACKOUT_INITIATED</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Hearts */}
          {hearts.map(h => (
            <motion.div
              key={h.id}
              initial={{ y: '10vh', opacity: 1, x: `${h.x}vw`, scale: 0.5 }}
              animate={{ y: '-120vh', opacity: 0, x: `${h.x + (Math.random() * 10 - 5)}vw`, scale: 1.5 }}
              transition={{ duration: 3, ease: 'easeOut' }}
              className="fixed z-[99998] text-4xl pointer-events-none"
              style={{ bottom: '-10vh', left: 0 }}
            >
              💖
            </motion.div>
          ))}

          {/* Maintenance Mode Overlay */}
          {isMaintenance && (
            <div className="fixed inset-0 z-[99999] bg-[#09090b] flex flex-col items-center justify-center font-mono text-zinc-300">
              <h1 className="text-4xl font-bold text-red-500 mb-4 animate-pulse">SYSTEM MAINTENANCE</h1>
              <p className="text-zinc-500 max-w-md text-center mb-8">
                The system is currently undergoing critical maintenance. Please wait...
              </p>
              <div className="flex gap-2">
                <span className="w-2 h-2 bg-zinc-700 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-zinc-700 rounded-full animate-bounce delay-100" />
                <span className="w-2 h-2 bg-zinc-700 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          )}

          {/* Debug Pill — visible only when enabled in /dev */}
          {showDebugPill && pathname !== '/dev' && (
            <div className="fixed bottom-2 left-2 z-[999999] bg-black/80 text-white text-[10px] font-mono p-2 rounded border border-zinc-800 pointer-events-none opacity-50">
              <div>WS: {debugState}</div>
              <div>EVT: {lastEvent}</div>
              <div>PATH: {pathname}</div>
            </div>
          )}
        </>,
        document.body
      )}
    </PresenceContext.Provider>
  );
}
