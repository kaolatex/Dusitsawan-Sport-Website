'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { fetchSiteSettings } from '@/lib/supabase/services';
import { Timer, X, Sparkles, ArrowRight } from 'lucide-react';

interface CountdownSplashProps {
  isOpen?: boolean;
  onClose?: () => void;
  forceOpen?: boolean;
}

export default function CountdownSplash({ isOpen: externalIsOpen, onClose: externalOnClose, forceOpen = false }: CountdownSplashProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  const settingsFetcher = useCallback(() => fetchSiteSettings(), []);
  const { data: settings } = useSupabaseData('site_settings', settingsFetcher);

  const eventDate = settings?.event_date || '2026-08-15T08:30:00';
  const isCountdownActive = settings ? settings.is_countdown_active : true;

  // Controlled vs Uncontrolled state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const handleClose = () => {
    if (externalOnClose) {
      externalOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  useEffect(() => {
    if (forceOpen) {
      setInternalIsOpen(true);
      return;
    }

    if (externalIsOpen === undefined) {
      setInternalIsOpen(true);
    }
  }, [forceOpen, externalIsOpen]);

  useEffect(() => {
    if (!eventDate) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(eventDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [eventDate]);

  if (!isCountdownActive && !forceOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl"
        >
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] bg-accent-gold/15 rounded-full blur-[100px] pointer-events-none" />

          {/* Glassmorphism Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg rounded-[2.5rem] border border-white/15 bg-white/[0.05] p-6 sm:p-10 shadow-2xl backdrop-blur-2xl text-white text-center overflow-hidden"
          >
            {/* Close Cross Button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
              title="ปิด"
            >
              <X size={16} />
            </button>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-xs font-semibold text-primary-light tracking-wide mb-6">
              <Sparkles size={13} className="text-primary-light animate-pulse" />
              คณะ 2 สีชมพู • ดุสิตสวรรค์ธัญมหาปราสาท
            </div>

            {/* Header */}
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2 text-white">
              นับถอยหลัง <span className="bg-gradient-to-r from-white via-pink-200 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">มหกรรมกีฬาสี</span>
            </h2>
            <p className="text-xs sm:text-sm text-white/70 max-w-sm mx-auto mb-8 font-light leading-relaxed">
              อีกไม่นานเกินรอ! มาร่วมเป็นส่วนหนึ่งของความสง่างามและความเพียบพร้อมในงานกีฬาสีประจำปี
            </p>

            {/* Countdown Digits Grid */}
            <div className="grid grid-cols-4 gap-2.5 sm:gap-4 mb-8">
              {[
                { label: 'วัน', value: timeLeft?.days ?? 0 },
                { label: 'ชั่วโมง', value: String(timeLeft?.hours ?? 0).padStart(2, '0') },
                { label: 'นาที', value: String(timeLeft?.minutes ?? 0).padStart(2, '0') },
                { label: 'วินาที', value: String(timeLeft?.seconds ?? 0).padStart(2, '0') },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white/[0.07] border border-white/10 shadow-inner backdrop-blur-md"
                >
                  <span className="text-2xl sm:text-4xl font-mono font-black tracking-tight text-white drop-shadow-md">
                    {item.value}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/60 mt-1">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={handleClose}
              className="w-full py-4 rounded-full bg-gradient-to-r from-primary via-primary-hover to-accent-gold text-white font-extrabold text-sm tracking-wide shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
            >
              <span>เข้าสู่เว็บไซต์</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function FloatingCountdownTrigger({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-primary/90 hover:bg-primary text-white font-bold text-xs shadow-lg shadow-primary/30 border border-white/20 backdrop-blur-md transition-all cursor-pointer group"
      title="เปิดหน้านับถอยหลัง"
    >
      <Timer size={16} className="text-accent-gold animate-spin-slow group-hover:scale-110 transition-transform" />
      <span className="hidden sm:inline">นับถอยหลัง</span>
    </motion.button>
  );
}
