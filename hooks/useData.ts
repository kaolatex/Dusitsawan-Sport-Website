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
} from '@/lib/supabase/services';

export function useSports(enableRealtime: boolean = false) {
  const fetcher = useCallback(() => fetchSports(), []);
  return useSupabaseData('sports', fetcher, enableRealtime);
}

export function useMatches(enableRealtime: boolean = false) {
  const fetcher = useCallback(() => fetchMatches(), []);
  return useSupabaseData('matches', fetcher, enableRealtime);
}

export function useNews(enableRealtime: boolean = false) {
  const fetcher = useCallback(() => fetchNews(), []);
  return useSupabaseData('news', fetcher, enableRealtime);
}

export function useGallery(enableRealtime: boolean = false) {
  const fetcher = useCallback(() => fetchGallery(), []);
  return useSupabaseData('gallery', fetcher, enableRealtime);
}

export function useMedals(enableRealtime: boolean = false) {
  const fetcher = useCallback(() => fetchMedals(), []);
  return useSupabaseData('medals', fetcher, enableRealtime);
}

export function useAthletes(enableRealtime: boolean = false) {
  const fetcher = useCallback(() => fetchAthletes(), []);
  return useSupabaseData('athletes', fetcher, enableRealtime);
}

export function useStaff(enableRealtime: boolean = false) {
  const fetcher = useCallback(() => fetchStaff(), []);
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
