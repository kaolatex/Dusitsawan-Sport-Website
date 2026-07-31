-- 1. Create the photo_wall bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
  VALUES ('photo_wall', 'photo_wall', true)
  ON CONFLICT (id) DO NOTHING;

-- 2. Drop existing policies to be safe
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Uploads" ON storage.objects;

-- 3. Recreate SELECT policy (Everyone can view)
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'photo_wall');

-- 4. Recreate INSERT policy (Everyone can upload)
CREATE POLICY "Public Uploads" 
ON storage.objects FOR INSERT 
TO public 
WITH CHECK (bucket_id = 'photo_wall');
