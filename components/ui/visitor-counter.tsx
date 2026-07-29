'use client';

import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { fetchPageViews, incrementPageView } from '@/lib/supabase/services';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export default function VisitorCounter() {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const initViews = async () => {
      try {
        const hasVisited = sessionStorage.getItem('has_visited');
        if (!hasVisited) {
          await incrementPageView();
          sessionStorage.setItem('has_visited', 'true');
        }
        
        const currentViews = await fetchPageViews();
        setViews(currentViews);
      } catch (error) {
        console.error('Failed to init views:', error);
      }
    };

    initViews();
  }, []);

  if (views === null) return null;

  return (
    <div className="flex items-center gap-1.5 text-[11px] text-text-secondary bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-full border border-border/40 shadow-inner">
      <Eye size={12} className="text-primary/70" />
      <span>ผู้เข้าชม:</span>
      <span className="font-mono font-bold text-text-primary">{views.toLocaleString()}</span>
    </div>
  );
}
