-- ==============================================================================
-- DUSITSAWAN SPORT WEBSITE - MASTER DATABASE SCHEMA
-- โครงสร้างฐานข้อมูลทั้งหมดของโปรเจกต์ ดุสิตสวรรค์ธัญมหาปราสาท (คณะ 2 สีชมพู)
-- ==============================================================================

-- 1. ตารางชนิดกีฬา (sports)
CREATE TABLE IF NOT EXISTS public.sports (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon_name TEXT DEFAULT 'Trophy',
    rules JSONB DEFAULT '[]'::jsonb,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.sports ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE;

-- 2. ตารางประเภทย่อยของกีฬา (sport_subcategories)
CREATE TABLE IF NOT EXISTS public.sport_subcategories (
    id TEXT PRIMARY KEY,
    sport_id TEXT REFERENCES public.sports(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    rules JSONB DEFAULT '[]'::jsonb,
    sort_order INT DEFAULT 0
);

-- 3. ตารางข้อมูลนักกีฬา (athletes)
CREATE TABLE IF NOT EXISTS public.athletes (
    id TEXT PRIMARY KEY,
    sport_id TEXT REFERENCES public.sports(id) ON DELETE SET NULL,
    sub_category_id TEXT REFERENCES public.sport_subcategories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    number TEXT,
    position TEXT,
    team TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.athletes ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE;

-- 4. ตารางตารางแข่งขัน & คะแนน (matches)
CREATE TABLE IF NOT EXISTS public.matches (
    id TEXT PRIMARY KEY,
    sport_id TEXT REFERENCES public.sports(id) ON DELETE SET NULL,
    sport_name TEXT NOT NULL,
    stage TEXT NOT NULL,
    team_a_name TEXT NOT NULL,
    team_a_color_hex TEXT DEFAULT '#E6007E',
    team_a_score INT,
    team_b_name TEXT NOT NULL,
    team_b_color_hex TEXT DEFAULT '#1E40AF',
    team_b_score INT,
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed')),
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    rank_results JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS match_type TEXT NOT NULL DEFAULT 'versus';
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS competitors JSONB DEFAULT NULL;

-- 5. ตารางข่าวสาร (news)
CREATE TABLE IF NOT EXISTS public.news (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    date TEXT NOT NULL,
    category TEXT DEFAULT 'sports' CHECK (category IN ('sports', 'announcement', 'activity')),
    image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;

-- 6. ตารางแกลเลอรีภาพ (gallery)
CREATE TABLE IF NOT EXISTS public.gallery (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    sport_name TEXT,
    image_url TEXT NOT NULL,
    date TEXT NOT NULL,
    aspect_ratio TEXT DEFAULT 'landscape',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.gallery ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;

-- 7. ตารางสรุปเหรียญรางวัล & คะแนนรวม (medals)
CREATE TABLE IF NOT EXISTS public.medals (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    color_name TEXT NOT NULL,
    color_hex TEXT NOT NULL,
    gold INT DEFAULT 0,
    silver INT DEFAULT 0,
    bronze INT DEFAULT 0,
    total_points INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. ตารางเจ้าหน้าที่ & คณะทำงาน (staff)
CREATE TABLE IF NOT EXISTS public.staff (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    position TEXT,
    department TEXT,
    contact_info TEXT,
    type TEXT DEFAULT 'Head',
    display_order INT DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.staff ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE;

-- 9. ตารางกำแพงส่งกำลังใจ (cheer_wall)
CREATE TABLE IF NOT EXISTS public.cheer_wall (
    id TEXT PRIMARY KEY,
    author_name TEXT DEFAULT 'กองเชียร์สีชมพู',
    message TEXT NOT NULL,
    sticker_id TEXT DEFAULT 'heart',
    is_anonymous BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'flagged')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.cheer_wall ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE;
ALTER TABLE public.cheer_wall ADD COLUMN IF NOT EXISTS pinned_order INTEGER DEFAULT 0;

-- 10. ตารางตั้งค่าประกาศด่วน & นับถอยหลัง (site_settings)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY,
    announcement_text TEXT,
    is_announcement_active BOOLEAN DEFAULT true,
    event_date TEXT,
    is_countdown_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS show_countdown_on_home BOOLEAN DEFAULT true;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS show_medals_on_home BOOLEAN DEFAULT true;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS show_cheer_on_home BOOLEAN DEFAULT false;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS page_views INT DEFAULT 0;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS is_photo_wall_paused boolean DEFAULT false;

-- V5 Feature Flags (เพิ่มโดยไม่กระทบของเก่า)
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS is_wave_mode_active BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS is_heart_counter_active BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS is_lucky_draw_active BOOLEAN NOT NULL DEFAULT false;

-- 11. ตาราง Photo Wall (Community Gallery)
CREATE TABLE IF NOT EXISTS public.photo_wall (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url text NOT NULL,
  uploader_name text,
  caption text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  likes_count integer DEFAULT 0,
  is_pinned boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) & POLICIES SETUP
-- ==============================================================================

-- เปิดการใช้งาน RLS สำหรับทุกตาราง
ALTER TABLE public.sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sport_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cheer_wall ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_wall ENABLE ROW LEVEL SECURITY;

-- ลบ Policy เก่าออกทั้งหมดเพื่อป้องกันข้อผิดพลาด Policy Already Exists
DROP POLICY IF EXISTS "Allow public read sports" ON public.sports;
DROP POLICY IF EXISTS "Allow all sports" ON public.sports;
DROP POLICY IF EXISTS "Allow public read subcategories" ON public.sport_subcategories;
DROP POLICY IF EXISTS "Allow all subcategories" ON public.sport_subcategories;
DROP POLICY IF EXISTS "Allow public read athletes" ON public.athletes;
DROP POLICY IF EXISTS "Allow all athletes" ON public.athletes;
DROP POLICY IF EXISTS "Allow public read matches" ON public.matches;
DROP POLICY IF EXISTS "Allow all matches" ON public.matches;
DROP POLICY IF EXISTS "Allow public read news" ON public.news;
DROP POLICY IF EXISTS "Allow all news" ON public.news;
DROP POLICY IF EXISTS "Allow public read gallery" ON public.gallery;
DROP POLICY IF EXISTS "Allow all gallery" ON public.gallery;
DROP POLICY IF EXISTS "Allow public read medals" ON public.medals;
DROP POLICY IF EXISTS "Allow all medals" ON public.medals;
DROP POLICY IF EXISTS "Allow public read staff" ON public.staff;
DROP POLICY IF EXISTS "Allow all staff" ON public.staff;
DROP POLICY IF EXISTS "Allow public read cheer_wall" ON public.cheer_wall;
DROP POLICY IF EXISTS "Allow public insert cheer_wall" ON public.cheer_wall;
DROP POLICY IF EXISTS "Allow all cheer_wall" ON public.cheer_wall;
DROP POLICY IF EXISTS "Allow public read site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow all site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public can view approved photos" ON public.photo_wall;
DROP POLICY IF EXISTS "Public can upload photos" ON public.photo_wall;
DROP POLICY IF EXISTS "Public can update likes" ON public.photo_wall;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.photo_wall;
DROP POLICY IF EXISTS "Enable update for all users" ON public.photo_wall;

-- สร้าง Policy ใหม่
CREATE POLICY "Allow public read sports" ON public.sports FOR SELECT USING (true);
CREATE POLICY "Allow all sports" ON public.sports FOR ALL USING (true);

CREATE POLICY "Allow public read subcategories" ON public.sport_subcategories FOR SELECT USING (true);
CREATE POLICY "Allow all subcategories" ON public.sport_subcategories FOR ALL USING (true);

CREATE POLICY "Allow public read athletes" ON public.athletes FOR SELECT USING (true);
CREATE POLICY "Allow all athletes" ON public.athletes FOR ALL USING (true);

CREATE POLICY "Allow public read matches" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Allow all matches" ON public.matches FOR ALL USING (true);

CREATE POLICY "Allow public read news" ON public.news FOR SELECT USING (true);
CREATE POLICY "Allow all news" ON public.news FOR ALL USING (true);

CREATE POLICY "Allow public read gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Allow all gallery" ON public.gallery FOR ALL USING (true);

CREATE POLICY "Allow public read medals" ON public.medals FOR SELECT USING (true);
CREATE POLICY "Allow all medals" ON public.medals FOR ALL USING (true);

CREATE POLICY "Allow public read staff" ON public.staff FOR SELECT USING (true);
CREATE POLICY "Allow all staff" ON public.staff FOR ALL USING (true);

CREATE POLICY "Allow public read cheer_wall" ON public.cheer_wall FOR SELECT USING (true);
CREATE POLICY "Allow public insert cheer_wall" ON public.cheer_wall FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all cheer_wall" ON public.cheer_wall FOR ALL USING (true);

CREATE POLICY "Allow public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Allow all site_settings" ON public.site_settings FOR ALL USING (true);

-- FIX: อนุญาตให้ดูรูป pending ได้ (เพื่อให้เวลา insert แล้ว select() ไม่ติด error)
CREATE POLICY "Public can view approved photos" ON public.photo_wall FOR SELECT USING (true);
CREATE POLICY "Public can upload photos" ON public.photo_wall FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update likes" ON public.photo_wall FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete for all users" ON public.photo_wall FOR DELETE USING (true);
CREATE POLICY "Enable update for all users" ON public.photo_wall FOR UPDATE USING (true) WITH CHECK (true);

-- ==============================================================================
-- STORAGE BUCKETS & POLICIES
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public) 
  VALUES ('photo_wall', 'photo_wall', true)
  ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Uploads" ON storage.objects;

-- FIX: เพิ่ม TO public เข้าไปเพื่อป้องกันปัญหา RLS กับ Anonymous Users
CREATE POLICY "Public Access" 
  ON storage.objects FOR SELECT 
  TO public
  USING (bucket_id = 'photo_wall');

CREATE POLICY "Public Uploads" 
  ON storage.objects FOR INSERT 
  TO public
  WITH CHECK (bucket_id = 'photo_wall');

-- ==============================================================================
-- FUNCTIONS (RPC)
-- ==============================================================================

CREATE OR REPLACE FUNCTION increment_page_view()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE site_settings
  SET page_views = COALESCE(page_views, 0) + 1
  WHERE id = 'main_settings';
END;
$$;

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

INSERT INTO public.medals (id, name, color_name, color_hex, gold, silver, bronze, total_points)
VALUES
    ('team-pink', 'คณะ 2 สีชมพู (ดุสิตสวรรค์)', 'สีชมพู', '#E6007E', 5, 3, 2, 45),
    ('team-gold', 'คณะ 4 สีทอง', 'สีทอง', '#D4AF37', 4, 4, 1, 40),
    ('team-blue', 'คณะ 1 สีฟ้า', 'สีฟ้า', '#0284C7', 3, 2, 4, 32),
    ('team-green', 'คณะ 3 สีเขียว', 'สีเขียว', '#16A34A', 2, 3, 3, 28),
    ('team-red', 'คณะ 5 สีแดง', 'สีแดง', '#DC2626', 1, 2, 2, 20)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.site_settings (id, announcement_text, is_announcement_active, event_date, is_countdown_active)
VALUES (
    'main_settings',
    '🎉 ยินดีต้อนรับสู่การแข่งขันกีฬาสี ดุสิตสวรรค์ธัญมหาปราสาท คณะ 2 สีชมพู!',
    true,
    '2026-08-15T08:30:00',
    true
)
ON CONFLICT (id) DO NOTHING;

-- Reload Schema for PostgREST
NOTIFY pgrst, 'reload schema';

-- V5.1 Omniscience Protocol Upgrade
-- เพิ่มคอลัมน์ระบบ Persistent Maintenance Mode
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS is_maintenance_mode BOOLEAN NOT NULL DEFAULT false;
