import { useCallback } from 'react';
import { useSupabaseData } from './useSupabaseData';
import {
  fetchGallery,
  fetchMatches,
  fetchMedals,
  fetchNews,
  fetchSports,
  fetchAthletes,
  fetchStaff,
  fetchCheerMessages,
  fetchSiteSettings,
  fetchPhotoWall,
} from '@/lib/supabase/services';

export function usePhotoWall(status: 'pending' | 'approved' | 'rejected' = 'approved', limit = 50, enableRealtime: boolean = false) {
  const fetcher = useCallback(async () => {
    // For PhotoWall we skip the cache API because it's highly dynamic and user-generated
    return fetchPhotoWall(status, limit);
  }, [status, limit]);
  return useSupabaseData('photo_wall', fetcher, enableRealtime);
}

export function useSports(enableRealtime: boolean = false) {
  const fetcher: typeof fetchSports = useCallback(async () => {
    if (enableRealtime) return fetchSports();
    const res = await fetch('/api/cache?type=sports');
    if (!res.ok) throw new Error('Failed to fetch sports');
    return res.json();
  }, [enableRealtime]);
  return useSupabaseData('sports', fetcher, enableRealtime);
}

export function useMatches(enableRealtime: boolean = false) {
  const fetcher: typeof fetchMatches = useCallback(async () => {
    if (enableRealtime) return fetchMatches();
    const res = await fetch('/api/cache?type=matches');
    if (!res.ok) throw new Error('Failed to fetch matches');
    return res.json();
  }, [enableRealtime]);
  return useSupabaseData('matches', fetcher, enableRealtime);
}

export function useNews(enableRealtime: boolean = false) {
  const fetcher: typeof fetchNews = useCallback(async () => {
    if (enableRealtime) return fetchNews();
    const res = await fetch('/api/cache?type=news');
    if (!res.ok) throw new Error('Failed to fetch news');
    return res.json();
  }, [enableRealtime]);
  return useSupabaseData('news', fetcher, enableRealtime);
}

export function useGallery(enableRealtime: boolean = false) {
  const fetcher: typeof fetchGallery = useCallback(async () => {
    if (enableRealtime) return fetchGallery();
    const res = await fetch('/api/cache?type=gallery');
    if (!res.ok) throw new Error('Failed to fetch gallery');
    return res.json();
  }, [enableRealtime]);
  return useSupabaseData('gallery', fetcher, enableRealtime);
}

export function useMedals(enableRealtime: boolean = false) {
  const fetcher: typeof fetchMedals = useCallback(async () => {
    if (enableRealtime) return fetchMedals();
    const res = await fetch('/api/cache?type=medals');
    if (!res.ok) throw new Error('Failed to fetch medals');
    return res.json();
  }, [enableRealtime]);
  return useSupabaseData('medals', fetcher, enableRealtime);
}

export function useAthletes(enableRealtime: boolean = false) {
  const fetcher: typeof fetchAthletes = useCallback(async () => {
    if (enableRealtime) return fetchAthletes();
    const res = await fetch('/api/cache?type=athletes');
    if (!res.ok) throw new Error('Failed to fetch athletes');
    return res.json();
  }, [enableRealtime]);
  return useSupabaseData('athletes', fetcher, enableRealtime);
}

export function useStaff(enableRealtime: boolean = false) {
  const fetcher: typeof fetchStaff = useCallback(async () => {
    if (enableRealtime) return fetchStaff();
    const res = await fetch('/api/cache?type=staff');
    if (!res.ok) throw new Error('Failed to fetch staff');
    return res.json();
  }, [enableRealtime]);
  return useSupabaseData('staff', fetcher, enableRealtime);
}

export function useCheerMessages(enableRealtime: boolean = false) {
  const fetcher = useCallback(() => fetchCheerMessages(), []);
  return useSupabaseData('cheer_wall', fetcher, enableRealtime);
}

export function useSiteSettings(enableRealtime: boolean = false) {
  const fetcher = useCallback(() => fetchSiteSettings(), []);
  return useSupabaseData('site_settings', fetcher, enableRealtime);
}
