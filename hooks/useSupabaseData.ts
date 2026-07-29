'use client';

import { useEffect } from 'react';
import useSWR from 'swr';
import { getSupabase } from '@/lib/supabase/client';

type Fetcher<T> = () => Promise<T>;

export function useSupabaseData<T>(
  table: string,
  fetcher: Fetcher<T>,
  enableRealtime: boolean = false
) {
  // Use SWR for caching, request deduplication, and stale-while-revalidate
  const { data, error, isLoading, mutate } = useSWR<T>(
    table, // Use the table name as the SWR cache key
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateIfStale: true,
      // We don't poll (refreshInterval) by default because we use realtime for critical data
    }
  );

  useEffect(() => {
    if (!enableRealtime) return;

    let supabase;
    try {
      supabase = getSupabase();
    } catch {
      return;
    }

    const channelName = `realtime-${table}-${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table }, () => {
        // When database changes, tell SWR to re-fetch and update cache automatically
        mutate();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, enableRealtime, mutate]);

  return {
    data: data ?? null,
    loading: isLoading,
    error: error ? (error instanceof Error ? error.message : String(error)) : null,
    refetch: mutate
  };
}
