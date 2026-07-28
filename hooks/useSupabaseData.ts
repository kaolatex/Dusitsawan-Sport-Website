'use client';

import { useCallback, useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase/client';

type Fetcher<T> = () => Promise<T>;

export function useSupabaseData<T>(
  table: string,
  fetcher: Fetcher<T>,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setError(null);
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    setLoading(true);
    refetch();

    let supabase;
    try {
      supabase = getSupabase();
    } catch {
      setLoading(false);
      setError('Supabase is not configured');
      return;
    }

    const channelName = `realtime-${table}-${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table }, () => {
        refetch();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, refetch, ...deps]);

  return { data, loading, error, refetch };
}
