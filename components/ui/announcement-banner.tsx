'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { fetchSiteSettings } from '@/lib/supabase/services';
import { Megaphone, Timer, X } from 'lucide-react';

export default function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false);

  const settingsFetcher = useCallback(() => fetchSiteSettings(), []);
  const { data: settings } = useSupabaseData('site_settings', settingsFetcher);

  const announcementText = settings?.announcement_text || '🎉 ยินดีต้อนรับสู่เว็บไซต์การแข่งขันกีฬาสี ดุสิตสวรรค์ธัญมหาปราสาท คณะ 2 สีชมพู!';
  const isAnnouncementActive = settings ? settings.is_announcement_active : true;

  if (dismissed || !isAnnouncementActive) {
    return null;
  }

  return (
    <div className="bg-primary/10 dark:bg-primary/15 backdrop-blur-md border-b border-primary/20 dark:border-primary/30 text-zinc-800 dark:text-white relative z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        {/* Left: Announcement text */}
        <div className="flex items-center justify-center gap-2.5 flex-1 min-w-0">
          <span className="p-1.5 rounded-full bg-primary/20 dark:bg-primary/30 border border-primary/30 dark:border-primary/40 shrink-0 shadow-[0_0_10px_rgba(236,72,153,0.2)] dark:shadow-[0_0_15px_rgba(236,72,153,0.4)]">
            <Megaphone size={12} className="text-primary-dark dark:text-primary-light animate-pulse" />
          </span>
          <span className="font-medium text-[11px] sm:text-sm truncate tracking-wide text-zinc-800 dark:text-white/95">
            {announcementText}
          </span>
        </div>

        {/* Right: Dismiss */}
        <div className="shrink-0 flex items-center">
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-zinc-500 dark:text-white/60 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            title="ซ่อนประกาศ"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
