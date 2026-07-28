-- Dusitsawan Production Schema for Supabase
-- Run this in Supabase SQL Editor

-- 1. Sports
CREATE TABLE IF NOT EXISTS sports (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon_name TEXT DEFAULT 'Trophy',
  rules JSONB DEFAULT '[]'::jsonb,
  sort_order INT DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Sport Subcategories
CREATE TABLE IF NOT EXISTS sport_subcategories (
  id TEXT PRIMARY KEY,
  sport_id TEXT NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  rules JSONB DEFAULT '[]'::jsonb,
  sort_order INT DEFAULT 0
);

-- 3. Athletes
CREATE TABLE IF NOT EXISTS athletes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sport_id TEXT REFERENCES sports(id) ON DELETE CASCADE,
  sub_category_id TEXT REFERENCES sport_subcategories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  number TEXT,
  position TEXT,
  team TEXT,
  avatar_url TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Matches
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sport_id TEXT REFERENCES sports(id) ON DELETE SET NULL,
  sport_name TEXT NOT NULL,
  stage TEXT NOT NULL,
  match_type TEXT NOT NULL DEFAULT 'versus' CHECK (match_type IN ('versus', 'track')),
  team_a_name TEXT NOT NULL,
  team_a_color_hex TEXT NOT NULL,
  team_a_score INT,
  team_b_name TEXT NOT NULL,
  team_b_color_hex TEXT NOT NULL,
  team_b_score INT,
  competitors JSONB DEFAULT NULL,
  status TEXT NOT NULL CHECK (status IN ('upcoming', 'live', 'completed')),
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. News
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  date TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('sports', 'announcement', 'activity')),
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Gallery
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  sport_name TEXT,
  image_url TEXT NOT NULL,
  date TEXT NOT NULL,
  aspect_ratio TEXT DEFAULT 'landscape',
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Medals (Team Scoreboard)
CREATE TABLE IF NOT EXISTS medals (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color_name TEXT NOT NULL,
  color_hex TEXT NOT NULL,
  gold INT DEFAULT 0,
  silver INT DEFAULT 0,
  bronze INT DEFAULT 0,
  total_points INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Staff (Team / Officials)
CREATE TABLE IF NOT EXISTS staff (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT,
  department TEXT,
  contact_info TEXT,
  display_order INT DEFAULT 0,
  image_url TEXT,
  type TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Cheer Wall
CREATE TABLE IF NOT EXISTS cheer_wall (
  id TEXT PRIMARY KEY,
  author_name TEXT NOT NULL,
  message TEXT NOT NULL,
  sticker_id TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('approved', 'pending', 'flagged')),
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Site Settings (Global Configuration)
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'main_settings',
  announcement_text TEXT,
  is_announcement_active BOOLEAN DEFAULT FALSE,
  event_date TEXT,
  is_countdown_active BOOLEAN DEFAULT FALSE,
  show_countdown_on_home BOOLEAN DEFAULT FALSE,
  show_medals_on_home BOOLEAN DEFAULT FALSE,
  show_cheer_on_home BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Default Settings
INSERT INTO site_settings (id, is_announcement_active, is_countdown_active, show_countdown_on_home, show_medals_on_home, show_cheer_on_home) 
VALUES ('main_settings', false, false, false, false, false) 
ON CONFLICT (id) DO NOTHING;

-- Row Level Security
ALTER TABLE sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE sport_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE medals ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE cheer_wall ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read sports" ON sports FOR SELECT USING (true);
CREATE POLICY "Public read subcategories" ON sport_subcategories FOR SELECT USING (true);
CREATE POLICY "Public read athletes" ON athletes FOR SELECT USING (true);
CREATE POLICY "Public read matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Public read news" ON news FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read medals" ON medals FOR SELECT USING (true);
CREATE POLICY "Public read staff" ON staff FOR SELECT USING (true);
CREATE POLICY "Public read cheer_wall" ON cheer_wall FOR SELECT USING (true);
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);

-- Authenticated write policies
CREATE POLICY "Auth write sports" ON sports FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write subcategories" ON sport_subcategories FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write athletes" ON athletes FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write matches" ON matches FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write news" ON news FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write medals" ON medals FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write staff" ON staff FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write cheer_wall" ON cheer_wall FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE sports;
ALTER PUBLICATION supabase_realtime ADD TABLE sport_subcategories;
ALTER PUBLICATION supabase_realtime ADD TABLE athletes;
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
ALTER PUBLICATION supabase_realtime ADD TABLE news;
ALTER PUBLICATION supabase_realtime ADD TABLE gallery;
ALTER PUBLICATION supabase_realtime ADD TABLE medals;
ALTER PUBLICATION supabase_realtime ADD TABLE staff;
ALTER PUBLICATION supabase_realtime ADD TABLE cheer_wall;
ALTER PUBLICATION supabase_realtime ADD TABLE site_settings;
