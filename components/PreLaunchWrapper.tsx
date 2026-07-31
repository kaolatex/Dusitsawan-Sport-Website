'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { getSupabase } from '@/lib/supabase/client';
import AdminLoginModal from '@/components/admin/admin-login-modal';
import { Lock } from 'lucide-react';

interface PreLaunchWrapperProps {
  children: React.ReactNode;
}

// STRICT Target Date: August 3, 2026, 06:00:00 (Asia/Bangkok)
const TARGET_DATE = new Date('2026-08-03T06:00:00+07:00').getTime();

export default function PreLaunchWrapper({ children }: PreLaunchWrapperProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  // 1. Check Supabase session on mount for bypass
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await getSupabase().auth.getSession();
      if (session) {
        setIsUnlocked(true);
      }
    };
    checkSession();
  }, []);

  // 2. Countdown Logic
  useEffect(() => {
    if (isUnlocked || isFadingOut) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = TARGET_DATE - now;

      if (distance <= 0) {
        clearInterval(interval);
        handleEpicReveal();
      } else {
        setTimeLeft({
          d: Math.floor(distance / (1000 * 60 * 60 * 24)),
          h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isUnlocked, isFadingOut]);

  // 3. Epic Reveal Sequence
  const handleEpicReveal = () => {
    const duration = 2500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff0080', '#ff8c00', '#40e0d0', '#ffffff', '#000000']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff0080', '#ff8c00', '#40e0d0', '#ffffff', '#000000']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      } else {
        setIsFadingOut(true);
        setTimeout(() => setIsUnlocked(true), 1000);
      }
    };
    frame();
  };

  const handleAdminSignIn = async (email: string, pass: string) => {
    const { error } = await getSupabase().auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
    setShowAdminModal(false);
    setIsUnlocked(true); // Bypass instantly
  };

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className={`fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center transition-opacity duration-1000 ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      <div className="text-center space-y-10 px-6">
        <h1 className="text-primary font-bold text-3xl md:text-5xl tracking-tight">
          เตรียมพบกันเร็วๆ นี้
        </h1>
        
        {timeLeft ? (
          <div className="flex items-center justify-center gap-4 md:gap-8 text-primary">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="flex flex-col items-center w-16 md:w-24">
                <span className="text-4xl md:text-6xl font-black font-mono tracking-tighter">
                  {value.toString().padStart(2, '0')}
                </span>
                <span className="text-xs md:text-sm font-semibold uppercase tracking-widest text-zinc-500 mt-2">
                  {unit === 'd' ? 'Days' : unit === 'h' ? 'Hours' : unit === 'm' ? 'Mins' : 'Secs'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-24 md:h-32 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-zinc-900 animate-spin"></div>
          </div>
        )}

        {/* Secret Admin Backdoor (Moved below timer) */}
        <div className="pt-8 flex justify-center">
          <button
            onClick={() => setShowAdminModal(true)}
            className="opacity-50 hover:opacity-100 transition-opacity px-4 py-2 rounded-full border border-zinc-200 cursor-pointer flex items-center gap-2 text-zinc-500 text-xs font-mono"
            aria-label="Admin Access"
          >
            <Lock size={14} /> <span>Admin Login</span>
          </button>
        </div>
      </div>

      {/* Admin Login Modal Overlay */}
      {showAdminModal && (
        <div className="relative z-[10000]">
          <AdminLoginModal onSignIn={handleAdminSignIn} />
          {/* Close button for the modal just in case the admin wants to back out */}
          <button 
            onClick={() => setShowAdminModal(false)}
            className="fixed top-6 right-6 z-[10001] w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white font-bold backdrop-blur-md transition-all"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
