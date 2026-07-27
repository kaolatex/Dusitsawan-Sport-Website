-- Dusitsawan Production Schema for Supabase
-- Run this in Supabase SQL Editor

-- Sports
CREATE TABLE IF NOT EXISTS sports (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon_name TEXT DEFAULT 'Trophy',
  rules JSONB DEFAULT '[]'::jsonb,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sport Subcategories
CREATE TABLE IF NOT EXISTS sport_subcategories (
  id TEXT PRIMARY KEY,
  sport_id TEXT NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  rules JSONB DEFAULT '[]'::jsonb,
  sort_order INT DEFAULT 0
);

-- Athletes
CREATE TABLE IF NOT EXISTS athletes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sport_id TEXT REFERENCES sports(id) ON DELETE CASCADE,
  sub_category_id TEXT REFERENCES sport_subcategories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  number TEXT,
  position TEXT,
  team TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matches
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sport_id TEXT REFERENCES sports(id) ON DELETE SET NULL,
  sport_name TEXT NOT NULL,
  stage TEXT NOT NULL,
  team_a_name TEXT NOT NULL,
  team_a_color_hex TEXT NOT NULL,
  team_a_score INT,
  team_b_name TEXT NOT NULL,
  team_b_color_hex TEXT NOT NULL,
  team_b_score INT,
  status TEXT NOT NULL CHECK (status IN ('upcoming', 'live', 'completed')),
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- News
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  date TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('sports', 'announcement', 'activity')),
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  sport_name TEXT,
  image_url TEXT NOT NULL,
  date TEXT NOT NULL,
  aspect_ratio TEXT DEFAULT 'landscape',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medals (Team Scoreboard)
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

-- Row Level Security
ALTER TABLE sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE sport_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE medals ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read sports" ON sports FOR SELECT USING (true);
CREATE POLICY "Public read subcategories" ON sport_subcategories FOR SELECT USING (true);
CREATE POLICY "Public read athletes" ON athletes FOR SELECT USING (true);
CREATE POLICY "Public read matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Public read news" ON news FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read medals" ON medals FOR SELECT USING (true);

-- Authenticated write policies
CREATE POLICY "Auth write sports" ON sports FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write subcategories" ON sport_subcategories FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write athletes" ON athletes FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write matches" ON matches FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write news" ON news FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write medals" ON medals FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE sports;
ALTER PUBLICATION supabase_realtime ADD TABLE sport_subcategories;
ALTER PUBLICATION supabase_realtime ADD TABLE athletes;
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
ALTER PUBLICATION supabase_realtime ADD TABLE news;
ALTER PUBLICATION supabase_realtime ADD TABLE gallery;
ALTER PUBLICATION supabase_realtime ADD TABLE medals;
