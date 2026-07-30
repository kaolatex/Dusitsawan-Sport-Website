import { getSupabase } from './client';
import { assembleSports, mapGallery, mapMatch, mapMedal, mapNews } from './mappers';
import type { TablesInsert, TablesUpdate } from './database.types';
import type { GalleryImage, MatchSchedule, NewsItem, SportCategory, TeamScore } from '@/types';

function extractErrorObject(error: any): Record<string, any> {
  if (!error) return {};
  if (typeof error === 'string') return { message: error };
  if (typeof error !== 'object') return { message: String(error) };

  const result: Record<string, any> = {};

  if (error.message) result.message = error.message;
  if (error.code) result.code = error.code;
  if (error.details) result.details = error.details;
  if (error.hint) result.hint = error.hint;
  if (error.status) result.status = error.status;
  if (error.statusText) result.statusText = error.statusText;

  let obj = error;
  while (obj && obj !== Object.prototype) {
    for (const key of Object.getOwnPropertyNames(obj)) {
      if (result[key] === undefined && typeof obj[key] !== 'function') {
        const val = obj[key];
        if (val !== undefined && val !== null) {
          result[key] = val;
        }
      }
    }
    obj = Object.getPrototypeOf(obj);
  }

  return result;
}

function handleDbError(error: any) {
  if (!error) return;

  const extracted = extractErrorObject(error);

  if (!extracted.message && !extracted.code && !extracted.details && !extracted.hint) {
    return;
  }

  console.error("DB Error Details:", extracted);
  console.error("Raw Error Object:", error);

  const rawMsg =
    extracted.message ||
    extracted.details ||
    extracted.hint ||
    (extracted.code ? `Database Error (Code: ${extracted.code})` : null);

  if (rawMsg) {
    throw new Error(rawMsg);
  }
}

export async function fetchSports(): Promise<SportCategory[]> {
  const supabase = getSupabase();
  const [sportsRes, subsRes, athletesRes] = await Promise.all([
    supabase.from('sports').select('*').order('sort_order'),
    supabase.from('sport_subcategories').select('*').order('sort_order'),
    supabase.from('athletes').select('*'),
  ]);

  if (sportsRes.error) handleDbError(sportsRes.error);
  if (subsRes.error) handleDbError(subsRes.error);
  if (athletesRes.error) handleDbError(athletesRes.error);

  return assembleSports(sportsRes.data ?? [], subsRes.data ?? [], athletesRes.data ?? []);
}

export async function fetchMatches(): Promise<MatchSchedule[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .order('date', { ascending: false })
    .order('time', { ascending: false });

  if (error) handleDbError(error);
  return (data ?? []).map(mapMatch);
}

export async function fetchNews(): Promise<NewsItem[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('date', { ascending: false });

  if (error) handleDbError(error);
  return (data ?? []).map(mapNews);
}

export async function fetchGallery(): Promise<GalleryImage[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('date', { ascending: false });

  if (error) handleDbError(error);
  return (data ?? []).map(mapGallery);
}

export async function fetchMedals(): Promise<TeamScore[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('medals')
    .select('*')
    .order('total_points', { ascending: false });

  if (error) handleDbError(error);
  return (data ?? []).map(mapMedal);
}

export async function fetchAthletes() {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('athletes').select('*').order('name');
  if (error) handleDbError(error);
  return data ?? [];
}

export async function fetchSportOptions() {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('sports').select('id, name').order('sort_order');
  if (error) handleDbError(error);
  return data ?? [];
}

export async function fetchSubcategories(sportId?: string) {
  const supabase = getSupabase();
  let query = supabase.from('sport_subcategories').select('*').order('sort_order');
  if (sportId) query = query.eq('sport_id', sportId);
  const { data, error } = await query;
  if (error) handleDbError(error);
  return data ?? [];
}

// --- Mutations ---

export async function upsertSport(payload: TablesInsert<'sports'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('sports').upsert(payload);
  if (error) handleDbError(error);
}

export async function updateSport(id: string, payload: TablesUpdate<'sports'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('sports').update(payload).eq('id', id);
  if (error) handleDbError(error);
}

export async function deleteSport(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from('sports').delete().eq('id', id);
  if (error) handleDbError(error);
}

export async function updateSportsOrder(updates: { id: string; sort_order: number }[]) {
  const supabase = getSupabase();
  for (const u of updates) {
    await supabase.from('sports').update({ sort_order: u.sort_order }).eq('id', u.id);
  }
}


export async function upsertSubcategory(payload: TablesInsert<'sport_subcategories'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('sport_subcategories').upsert(payload);
  if (error) handleDbError(error);
}

export async function deleteSubcategory(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from('sport_subcategories').delete().eq('id', id);
  if (error) handleDbError(error);
}

export async function updateSubcategoriesOrder(updates: { id: string; sort_order: number }[]) {
  const supabase = getSupabase();
  for (const u of updates) {
    await supabase.from('sport_subcategories').update({ sort_order: u.sort_order }).eq('id', u.id);
  }
}


export async function upsertMatch(payload: TablesInsert<'matches'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('matches').insert(payload).select();
  if (error) handleDbError(error);
}

export async function updateMatch(id: string, payload: TablesUpdate<'matches'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('matches').update(payload).eq('id', id).select();
  if (error) handleDbError(error);
}

export async function deleteMatch(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from('matches').delete().eq('id', id);
  if (error) handleDbError(error);
}

export async function upsertNews(payload: TablesInsert<'news'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('news').insert(payload);
  if (error) handleDbError(error);
}

export async function updateNews(id: string, payload: TablesUpdate<'news'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('news').update(payload).eq('id', id);
  if (error) handleDbError(error);
}

export async function deleteNews(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from('news').delete().eq('id', id);
  if (error) handleDbError(error);
}

export async function upsertGallery(payload: TablesInsert<'gallery'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('gallery').insert(payload);
  if (error) handleDbError(error);
}

export async function updateGallery(id: string, payload: TablesUpdate<'gallery'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('gallery').update(payload).eq('id', id);
  if (error) handleDbError(error);
}

export async function deleteGallery(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from('gallery').delete().eq('id', id);
  if (error) handleDbError(error);
}

export async function upsertAthlete(payload: TablesInsert<'athletes'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('athletes').upsert(payload);
  if (error) handleDbError(error);
}

export async function updateAthlete(id: string, payload: TablesUpdate<'athletes'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('athletes').update(payload).eq('id', id);
  if (error) handleDbError(error);
}

export async function deleteAthlete(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from('athletes').delete().eq('id', id);
  if (error) handleDbError(error);
}

export async function upsertMedal(payload: TablesInsert<'medals'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('medals').upsert(payload);
  if (error) handleDbError(error);
}

export async function deleteMedal(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from('medals').delete().eq('id', id);
  if (error) handleDbError(error);
}

export async function fetchStaff() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .order('display_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) handleDbError(error);
  return data ?? [];
}

export async function upsertStaff(payload: TablesInsert<'staff'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('staff').upsert(payload);
  if (error) handleDbError(error);
}

export async function updateStaff(id: string, payload: TablesUpdate<'staff'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('staff').update(payload).eq('id', id);
  if (error) handleDbError(error);
}

export async function deleteStaff(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from('staff').delete().eq('id', id);
  if (error) handleDbError(error);
}

export async function updateStaffOrder(updates: { id: string; display_order: number }[]) {
  const supabase = getSupabase();
  for (const u of updates) {
    await supabase.from('staff').update({ display_order: u.display_order }).eq('id', u.id);
  }
}


export async function fetchCheerMessages() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('cheer_wall')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) handleDbError(error);
  return data ?? [];
}

export async function submitCheerMessage(payload: TablesInsert<'cheer_wall'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('cheer_wall').insert({
    id: `cheer-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    ...payload,
  });
  if (error) handleDbError(error);
}

export async function updateCheerStatus(id: string, status: 'approved' | 'pending' | 'flagged') {
  const supabase = getSupabase();
  const { error } = await supabase.from('cheer_wall').update({ status }).eq('id', id);
  if (error) handleDbError(error);
}

export async function updateCheerWall(id: string, payload: TablesUpdate<'cheer_wall'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('cheer_wall').update(payload).eq('id', id);
  if (error) handleDbError(error);
}

export async function deleteCheerMessage(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from('cheer_wall').delete().eq('id', id);
  if (error) handleDbError(error);
}

export async function fetchSiteSettings() {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('site_settings').select('*').limit(1).single();
  if (error && error.code !== 'PGRST116') handleDbError(error);
  return data ?? null;
}

export async function upsertSiteSettings(payload: TablesInsert<'site_settings'>) {
  const supabase = getSupabase();
  const { error } = await supabase.from('site_settings').upsert({ id: 'main_settings', ...payload });
  if (error) handleDbError(error);
}

export async function fetchPageViews(): Promise<number> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('site_settings')
    .select('page_views')
    .eq('id', 'main_settings')
    .single();

  if (error) {
    if (error.code === 'PGRST116') return 0; // Row not found
    handleDbError(error);
  }
  return data?.page_views || 0;
}

export async function incrementPageView(): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.rpc('increment_page_view');
  
  // Ignore PGRST202 or 42883 if the user hasn't created the RPC yet
  if (error && error.code !== 'PGRST202' && error.code !== '42883') {
    handleDbError(error);
  }
}

export async function updateCheerStatuses(ids: string[], status: 'approved' | 'pending' | 'flagged') {
  const supabase = getSupabase();
  const { error } = await supabase.from('cheer_wall').update({ status }).in('id', ids);
  if (error) handleDbError(error);
}

export async function deleteCheerMessages(ids: string[]) {
  const supabase = getSupabase();
  const { error } = await supabase.from('cheer_wall').delete().in('id', ids);
  if (error) handleDbError(error);
}

export async function fetchPhotoWall(status: 'pending' | 'approved' | 'rejected' = 'approved', limit = 50) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('photo_wall')
    .select('*')
    .eq('status', status)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) handleDbError(error);
  return data ?? [];
}

export async function uploadPhotoToWall(file: File, uploaderName: string, caption: string) {
  const supabase = getSupabase();
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `wall/${fileName}`;

  // 1. Upload to storage
  const { error: uploadError } = await supabase.storage
    .from('photo_wall')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) handleDbError(uploadError);

  // 2. Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('photo_wall')
    .getPublicUrl(filePath);

  // 3. Insert into photo_wall table
  const { data: insertedData, error: insertError } = await supabase
    .from('photo_wall')
    .insert({
      image_url: publicUrlData.publicUrl,
      uploader_name: uploaderName || 'ไม่ระบุนาม',
      caption: caption || '',
      status: 'pending' // default status
    })
    .select()
    .single();

  if (insertError) handleDbError(insertError);
  return insertedData;
}

export async function updatePhotoWallStatus(ids: string[], status: 'approved' | 'rejected') {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('photo_wall')
    .update({ status })
    .in('id', ids);

  if (error) handleDbError(error);
}

export async function likePhotoWallPost(id: string) {
  const supabase = getSupabase();
  // Using RPC to increment likes safely
  const { error } = await supabase.rpc('increment_photo_like', { photo_id: id });
  
  if (error) {
    // Fallback if RPC doesn't exist
    const { data: current } = await supabase.from('photo_wall').select('likes_count').eq('id', id).single();
    if (current) {
      const { error: updateErr } = await supabase
        .from('photo_wall')
        .update({ likes_count: (current.likes_count || 0) + 1 })
        .eq('id', id);
      if (updateErr) handleDbError(updateErr);
    }
  }
}

export async function deletePhotoWallPost(ids: string[]) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('photo_wall')
    .delete()
    .in('id', ids);

  if (error) handleDbError(error);
}

export async function fetchPhotoWallStatuses(ids: string[]) {
  if (!ids || ids.length === 0) return [];
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('photo_wall')
    .select('id, status')
    .in('id', ids);
  
  if (error) handleDbError(error);
  return data ?? [];
}
