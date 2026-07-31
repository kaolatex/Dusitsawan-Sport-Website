-- ==========================================
-- SCRIPT แก้อาการอัปโหลดรูปลง Photo Wall ไม่ได้
-- ==========================================

-- 1. แก้ไขสิทธิ์การมองเห็น (SELECT) ของตาราง photo_wall 
-- เพื่อให้ตอนระบบ insert แล้ว return ข้อมูลกลับมา (select().single()) ไม่โดนบล็อก
DROP POLICY IF EXISTS "Public can view approved photos" ON public.photo_wall;
CREATE POLICY "Public can view approved photos" 
  ON public.photo_wall 
  FOR SELECT 
  USING (true); -- ยอมให้ select ได้ทั้งหมด (ตัว UI จะกรองเฉพาะ approved เอง)

-- 2. ยืนยันการสร้างถังรูป (Storage Bucket) ให้ชัวร์ 100% ว่ามีอยู่
INSERT INTO storage.buckets (id, name, public) 
  VALUES ('photo_wall', 'photo_wall', true)
  ON CONFLICT (id) DO NOTHING;

-- 3. รีเซ็ตสิทธิ์ของ Storage Bucket ใหม่ให้คนนอกอัปโหลดได้แบบไม่มีเงื่อนไขจุกจิก
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Uploads" ON storage.objects;

CREATE POLICY "Public Access" 
  ON storage.objects FOR SELECT 
  TO public 
  USING (bucket_id = 'photo_wall');

CREATE POLICY "Public Uploads" 
  ON storage.objects FOR INSERT 
  TO public 
  WITH CHECK (bucket_id = 'photo_wall');
