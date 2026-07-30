'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { getSupabase } from '@/lib/supabase/client';
import { usePathname } from 'next/navigation';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { parseUserAgent } from '@/hooks/useDeviceDetect';
import { ShieldAlert } from 'lucide-react';

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
  broadcast: () => {} 
});

export default function PresenceProvider({ children }: { children: React.ReactNode }) {
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [presenceList, setPresenceList] = useState<PresenceData[]>([]);
  const [activeChannel, setActiveChannel] = useState<any>(null);
  const pathname = usePathname();
  
  // Telemetry States
  const [latency, setLatency] = useState(0);
  const [deviceInfo, setDeviceInfo] = useState({ device: 'Desktop', browser: 'Unknown' });
  const [lastActivity, setLastActivity] = useState(() => new Date().toISOString());

  // States for Crowd Control & System Overrides
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isPanicMode, setIsPanicMode] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isBlackout, setIsBlackout] = useState(false);
  const [hearts, setHearts] = useState<{ id: number, x: number }[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // DIAGNOSTICS
  const [debugState, setDebugState] = useState<string>('INIT');
  const [lastEvent, setLastEvent] = useState<string>('NONE');

  // Initialize Telemetry
  useEffect(() => {
    setDeviceInfo(parseUserAgent(window.navigator.userAgent));

    // Intercept fetch to calculate latency & API Performance
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const start = performance.now();
      try {
        const response = await originalFetch(...args);
        const end = performance.now();
        const duration = Math.round(end - start);
        setLatency(duration);
        setLastActivity(new Date().toISOString());
        
        // API Performance tracking (Local only)
        const urlObj = typeof args[0] === 'string' ? new URL(args[0], window.location.origin) : null;
        
        return response;
      } catch (error) {
        throw error;
      }
    };

    // Intercept Errors
    const handleError = (msg: string, source?: string) => {
      // Local error logging only
      console.error(`[Client Error] ${msg} at ${source || 'Unknown'}`);
    };
    
    window.addEventListener('error', (e) => handleError(e.message, e.filename));
    window.addEventListener('unhandledrejection', (e) => handleError(e.reason?.toString() || 'Unknown', 'Promise'));

    setMounted(true);

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  useEffect(() => {
    // We only want to track presence if we are on the client side
    const supabase = getSupabase();
    
    // Create a random user ID for this session's presence
    const sessionId = Math.random().toString(36).substring(2, 15);
    
    const channel = supabase.channel('global_presence', {
      config: {
        presence: {
          key: sessionId,
        },
        broadcast: { ack: true, self: true },
      },
    });

    setActiveChannel(channel);
    setDebugState('CREATED');

    // Init Maintenance Mode from DB
    const initMaintenance = async () => {
      const { data } = await supabase.from('site_settings').select('is_maintenance_mode').eq('id', 'main_settings').single();
      if (data) setIsMaintenance(data.is_maintenance_mode);
    };
    initMaintenance();

    const updatePresence = async () => {
      if (channel.state === 'joined') {
        await channel.track({ 
          online_at: new Date().toISOString(), 
          pathname,
          device: deviceInfo.device,
          browser: deviceInfo.browser,
          latency,
          last_activity: lastActivity
        });
      }
    };

    channel
      .on('broadcast', { event: 'force_reload' }, () => {
        console.warn('SYSTEM OVERRIDE: Global reload initiated by DEV.');
        window.location.reload();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'site_settings', filter: 'id=eq.main_settings' }, (payload) => {
        if (payload.new && 'is_maintenance_mode' in payload.new) {
          setIsMaintenance(payload.new.is_maintenance_mode);
        }
      })
      .on('broadcast', { event: 'panic_mode' }, (payload) => {
        setIsPanicMode(payload.payload.active);
        if (payload.payload.active) {
          document.body.classList.add('panic-mode');
        } else {
          document.body.classList.remove('panic-mode');
        }
      })
      .on('broadcast', { event: 'confetti' }, () => {
        if (isPanicMode) return; // Disable heavy effects
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          zIndex: 9999
        });
      })
      .on('broadcast', { event: 'hearts' }, () => {
        setLastEvent('hearts-' + Date.now());
        if (isPanicMode) return;
        const newHearts = Array.from({ length: 20 }).map((_, i) => ({ id: Date.now() + i, x: Math.random() * 100 }));
        setHearts(prev => [...prev, ...newHearts]);
        setTimeout(() => setHearts(prev => prev.filter(h => !newHearts.find(n => n.id === h.id))), 3000);
      })
      .on('broadcast', { event: 'glitch' }, () => {
        setLastEvent('glitch-' + Date.now());
        if (isPanicMode) return;
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 3000);
      })
      .on('broadcast', { event: 'blackout' }, () => {
        setLastEvent('blackout-' + Date.now());
        if (isPanicMode) return;
        setIsBlackout(true);
        setTimeout(() => setIsBlackout(false), 5000);
      })
      .on('broadcast', { event: 'shake' }, (payload) => {
        setLastEvent('shake-' + Date.now());
        if (isPanicMode) return; // Disable heavy effects
        setIsShaking(true);
        const dur = payload.payload?.duration || 2000;
        setTimeout(() => setIsShaking(false), dur);
      })
      .on('broadcast', { event: 'toast' }, (payload) => {
        setLastEvent('toast-' + Date.now());
        setToastMessage(payload.payload.message);
        setTimeout(() => setToastMessage(null), 5000);
      })
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        setOnlineUsers(Object.keys(newState).length);
        
        // Extract presence list
        const pList: PresenceData[] = [];
        for (const key in newState) {
          const p = newState[key][0] as any;
          if (p) {
            pList.push({ 
              key, 
              online_at: p.online_at, 
              pathname: p.pathname || '/',
              device: p.device || 'Unknown',
              browser: p.browser || 'Unknown',
              latency: p.latency || 0,
              last_activity: p.last_activity || p.online_at
            });
          }
        }
        setPresenceList(pList);
      })
      .subscribe((status, err) => {
        setDebugState(status);
        if (status === 'SUBSCRIBED') {
          setActiveChannel(channel);
          updatePresence();
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setActiveChannel(null);
          // Auto-reconnect if it closed unexpectedly
          setTimeout(() => {
            if (mounted) channel.subscribe();
          }, 2000);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // Run only once on mount

  // Handle path and latency changes for presence tracking
  useEffect(() => {
    const now = new Date().toISOString();
    setLastActivity(now);
    if (activeChannel && activeChannel.state === 'joined') {
      activeChannel.track({ 
        online_at: now, 
        pathname,
        device: deviceInfo.device,
        browser: deviceInfo.browser,
        latency,
        last_activity: now
      });
    }
  }, [pathname, latency, deviceInfo, activeChannel]);

  const broadcast = async (event: string, payload: any = {}) => {
    if (activeChannel) {
      try {
        const resp = await activeChannel.send({ type: 'broadcast', event, payload });
        console.log(`[Broadcast] Sent ${event}:`, resp);
        
        if (resp !== 'ok') {
          setToastMessage(`⚠️ Send failed (${resp}). Connection might be unstable.`);
        }
      } catch (err) {
        console.error(`[Broadcast] Error sending ${event}:`, err);
        setToastMessage(`⚠️ Error: ${err}`);
      }
    } else {
      setToastMessage('⏳ System booting up... Please wait.');
    }
  };

  return (
    <PresenceContext.Provider value={{ onlineUsers, presenceList, broadcast }}>
      {isGlitching && (
        <style dangerouslySetInnerHTML={{ __html: `
          body {
            animation: glitch-anim 0.2s linear infinite;
          }
          @keyframes glitch-anim {
            0% { filter: invert(1) hue-rotate(90deg) contrast(150%); transform: translate(4px, -4px); }
            50% { filter: invert(0) hue-rotate(0deg) contrast(100%); transform: translate(-4px, 4px); }
            100% { filter: invert(1) hue-rotate(180deg) contrast(150%); transform: translate(4px, -4px); }
          }
        `}} />
      )}
      <div className={`transition-transform duration-75 ${isShaking ? 'animate-[shake_0.2s_ease-in-out_infinite]' : ''}`}>
        {children}
      </div>

      {mounted && createPortal(
        <>
          {/* Dynamic Broadcast Pill (Toast) */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.9 }}
                animate={{ opacity: 1, y: 20, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                className="fixed top-4 left-1/2 -translate-x-1/2 z-[99999] bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl border border-white/10 flex items-center gap-3"
              >
                <span className="text-xl">🔔</span>
                <p className="font-semibold text-sm">{toastMessage}</p>
              </motion.div>
            )}
            
            {/* System Blackout Event */}
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
              initial={{ y: '100vh', opacity: 1, x: `${h.x}vw`, scale: 0.5 }}
              animate={{ y: '-10vh', opacity: 0, x: `${h.x + (Math.random() * 10 - 5)}vw`, scale: 1.5 }}
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

          {/* DEV DIAGNOSTICS */}
          {pathname !== '/dev' && (
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
