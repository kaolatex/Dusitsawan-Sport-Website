-- ==========================================
-- Supabase Performance Indexing Script
-- ==========================================
-- รัน Script นี้ใน Supabase SQL Editor เพื่อเพิ่มความเร็วในการดึงข้อมูล (ลดภาระ Database)

-- 1. Index สำหรับ Foreign Keys (เพื่อการทำ JOIN หรือ WHERE ที่รวดเร็ว)
CREATE INDEX IF NOT EXISTS idx_sport_subcategories_sport_id ON sport_subcategories(sport_id);
CREATE INDEX IF NOT EXISTS idx_athletes_sport_id ON athletes(sport_id);
CREATE INDEX IF NOT EXISTS idx_athletes_sub_category_id ON athletes(sub_category_id);
CREATE INDEX IF NOT EXISTS idx_matches_sport_id ON matches(sport_id);

-- 2. Index สำหรับการจัดเรียง (ORDER BY) แบบต่างๆ ที่ใช้บ่อยในเว็บ
CREATE INDEX IF NOT EXISTS idx_sports_sort_order ON sports(sort_order);
CREATE INDEX IF NOT EXISTS idx_sport_subcategories_sort_order ON sport_subcategories(sort_order);
CREATE INDEX IF NOT EXISTS idx_staff_display_order ON staff(display_order);

-- 3. Index สำหรับวันที่ (เพื่อการแสดงข่าวสาร แกลเลอรี และ Cheer Wall ล่าสุด)
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON gallery(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cheer_wall_created_at ON cheer_wall(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_matches_date_time ON matches(date DESC, time DESC);

-- หมายเหตุ: การสร้าง Index จะช่วยให้ Supabase Free Plan จัดการข้อมูลได้ไวขึ้นมากๆ โดยเฉพาะเมื่อมีคนเข้าเว็บพร้อมกันเยอะๆ
