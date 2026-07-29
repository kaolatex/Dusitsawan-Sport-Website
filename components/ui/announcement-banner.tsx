'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { fetchSiteSettings } from '@/lib/supabase/services';
import { Megaphone, Timer, X } from 'lucide-react';

export default function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  const settingsFetcher = useCallback(() => fetchSiteSettings(), []);
  const { data: settings } = useSupabaseData('site_settings', settingsFetcher);

  const announcementText = settings?.announcement_text || '🎉 ยินดีต้อนรับสู่เว็บไซต์การแข่งขันกีฬาสี ดุสิตสวรรค์ธัญมหาปราสาท คณะ 2 สีชมพู!';
  const isAnnouncementActive = settings ? settings.is_announcement_active : true;
  const eventDate = settings?.event_date || '2026-08-15T08:30:00';
  const isCountdownActive = settings ? settings.is_countdown_active : true;

  useEffect(() => {
    if (!isCountdownActive || !eventDate) return;

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
  }, [eventDate, isCountdownActive]);

  if (dismissed || (!isAnnouncementActive && !isCountdownActive)) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-primary via-primary-hover to-accent-gold text-white text-xs shadow-md border-b border-white/10 relative z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Left: Announcement text */}
        {isAnnouncementActive && (
          <div className="flex items-center gap-2 truncate text-center sm:text-left">
            <span className="p-1 rounded-full bg-white/15 border border-white/15 shrink-0 animate-pulse">
              <Megaphone size={12} className="text-white" />
            </span>
            <span className="font-semibold text-[11px] sm:text-xs truncate tracking-wide">
              {announcementText}
            </span>
          </div>
        )}

        {/* Right: Countdown & Dismiss */}
        <div className="flex items-center gap-3 shrink-0">
          {isCountdownActive && timeLeft && (
            <div className="flex items-center gap-1.5 bg-black/15 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider border border-white/15 shadow-inner">
              <Timer size={11} className="text-accent-gold" />
              <span>นับถอยหลัง:</span>
              <span className="text-white bg-white/20 px-1.5 py-0.5 rounded">{timeLeft.days}d</span>
              <span>:</span>
              <span className="text-white bg-white/20 px-1.5 py-0.5 rounded">{String(timeLeft.hours).padStart(2, '0')}h</span>
              <span>:</span>
              <span className="text-white bg-white/20 px-1.5 py-0.5 rounded">{String(timeLeft.minutes).padStart(2, '0')}m</span>
              <span>:</span>
              <span className="text-white bg-white/20 px-1.5 py-0.5 rounded text-accent-gold">{String(timeLeft.seconds).padStart(2, '0')}s</span>
            </div>
          )}

          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-full border border-white/15 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer active:scale-95"
            title="ซ่อนประกาศ"
          >
            <X size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
