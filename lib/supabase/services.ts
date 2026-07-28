import { getSupabase } from './client';
import { assembleSports, mapGallery, mapMatch, mapMedal, mapNews } from './mappers';
import type { TablesInsert, TablesUpdate } from './database.types';
import type { GalleryImage, MatchSchedule, NewsItem, SportCategory, TeamScore } from '@/types';

export async function fetchSports(): Promise<SportCategory[]> {
  const supabase = getSupabase();
  const [sportsRes, subsRes, athletesRes] = await Promise.all([
    supabase.from('sports').select('*').order('sort_order'),
    supabase.from('sport_subcategories').select('*').order('sort_order'),
    supabase.from('athletes').select('*'),
  ]);

  if (sportsRes.error) throw sportsRes.error;
  if (subsRes.error) throw subsRes.error;
  if (athletesRes.error) throw athletesRes.error;

  return assembleSports(sportsRes.data ?? [], subsRes.data ?? [], athletesRes.data ?? []);
}

export async function fetchMatches(): Promise<MatchSchedule[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .order('date', { ascending: false })
    .order('time', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapMatch);
}

export async function fetchNews(): Promise<NewsItem[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapNews);
}

export async function fetchGallery(): Promise<GalleryImage[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapGallery);
}

export async function fetchMedals(): Promise<TeamScore[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('medals')
    .select('*')
    .order('total_points', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapMedal);
}

export async function fetchAthletes() {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('athletes').select('*').order('name');
  if (error) throw error;
  return data ?? [];
}

export async function fetchSportOptions() {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('sports').select('id, name').order('sort_order');
  if (error) throw error;
  return data ?? [];
}

export async function fetchSubcategories(sportId?: string) {
  const supabase = getSupabase();
  let query = supabase.from('sport_subcategories').select('*').order('sort_order');
  if (sportId) query = query.eq('sport_id', sportId);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

// --- Mutations ---

export async function upsertSport(payload: TablesInsert<'sports'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('sports').upsert(payload);
  if (error) throw error;
}

export async function updateSport(id: string, payload: TablesUpdate<'sports'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('sports').update(payload).eq('id', id);
  if (error) throw error;
}

export async function deleteSport(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from('sports').delete().eq('id', id);
  if (error) throw error;
}

export async function upsertSubcategory(payload: TablesInsert<'sport_subcategories'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('sport_subcategories').upsert(payload);
  if (error) throw error;
}

export async function deleteSubcategory(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from('sport_subcategories').delete().eq('id', id);
  if (error) throw error;
}

export async function upsertMatch(payload: TablesInsert<'matches'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('matches').upsert(payload);
  if (error) throw error;
}

export async function updateMatch(id: string, payload: TablesUpdate<'matches'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('matches').update(payload).eq('id', id);
  if (error) throw error;
}

export async function deleteMatch(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from('matches').delete().eq('id', id);
  if (error) throw error;
}

export async function upsertNews(payload: TablesInsert<'news'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('news').upsert(payload);
  if (error) throw error;
}

export async function updateNews(id: string, payload: TablesUpdate<'news'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('news').update(payload).eq('id', id);
  if (error) throw error;
}

export async function deleteNews(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from('news').delete().eq('id', id);
  if (error) throw error;
}

export async function upsertGallery(payload: TablesInsert<'gallery'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('gallery').upsert(payload);
  if (error) throw error;
}

export async function updateGallery(id: string, payload: TablesUpdate<'gallery'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('gallery').update(payload).eq('id', id);
  if (error) throw error;
}

export async function deleteGallery(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from('gallery').delete().eq('id', id);
  if (error) throw error;
}

export async function upsertAthlete(payload: TablesInsert<'athletes'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('athletes').upsert(payload);
  if (error) throw error;
}

export async function updateAthlete(id: string, payload: TablesUpdate<'athletes'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('athletes').update(payload).eq('id', id);
  if (error) throw error;
}

export async function deleteAthlete(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from('athletes').delete().eq('id', id);
  if (error) throw error;
}

export async function upsertMedal(payload: TablesInsert<'medals'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('medals').upsert(payload);
  if (error) throw error;
}

export async function deleteMedal(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from('medals').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchStaff() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .order('display_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function upsertStaff(payload: TablesInsert<'staff'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('staff').upsert(payload);
  if (error) throw error;
}

export async function updateStaff(id: string, payload: TablesUpdate<'staff'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('staff').update(payload).eq('id', id);
  if (error) throw error;
}

export async function deleteStaff(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from('staff').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchCheerMessages() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('cheer_wall')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function submitCheerMessage(payload: TablesInsert<'cheer_wall'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('cheer_wall').insert({
    id: `cheer-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    ...payload,
  });
  if (error) throw error;
}

export async function updateCheerStatus(id: string, status: 'approved' | 'pending' | 'flagged') {
  const supabase = getSupabase();
  const { error } = await supabase.from('cheer_wall').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function updateCheerWall(id: string, payload: TablesUpdate<'cheer_wall'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('cheer_wall').update(payload).eq('id', id);
  if (error) throw error;
}

export async function deleteCheerMessage(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from('cheer_wall').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchSiteSettings() {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('site_settings').select('*').limit(1).single();
  if (error && error.code !== 'PGRST116') throw error;
  return data ?? null;
}

export async function upsertSiteSettings(payload: TablesInsert<'site_settings'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('site_settings').upsert({ id: 'main_settings', ...payload });
  if (error) throw error;
}


