import { useCallback } from 'react';
import { useSupabaseData } from './useSupabaseData';
import {
  fetchGallery,
  fetchMatches,
  fetchMedals,
  fetchNews,
  fetchSports,
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
