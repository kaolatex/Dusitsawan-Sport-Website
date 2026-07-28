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

export function useSports() {
  const fetcher = useCallback(() => fetchSports(), []);
  return useSupabaseData('sports', fetcher);
}

export function useMatches() {
  const fetcher = useCallback(() => fetchMatches(), []);
  return useSupabaseData('matches', fetcher);
}

export function useNews() {
  const fetcher = useCallback(() => fetchNews(), []);
  return useSupabaseData('news', fetcher);
}

export function useGallery() {
  const fetcher = useCallback(() => fetchGallery(), []);
  return useSupabaseData('gallery', fetcher);
}

export function useMedals() {
  const fetcher = useCallback(() => fetchMedals(), []);
  return useSupabaseData('medals', fetcher);
}

export function useAthletes() {
  const fetcher = useCallback(() => fetchAthletes(), []);
  return useSupabaseData('athletes', fetcher);
}

export function useStaff() {
  const fetcher = useCallback(() => fetchStaff(), []);
  return useSupabaseData('staff', fetcher);
}

export function useCheerMessages() {
  const fetcher = useCallback(() => fetchCheerMessages(), []);
  return useSupabaseData('cheer_wall', fetcher);
}

export function useSiteSettings() {
  const fetcher = useCallback(() => fetchSiteSettings(), []);
  return useSupabaseData('site_settings', fetcher);
}
