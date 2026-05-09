-- Run this only if you want this Vite frontend to manage data directly with the anon key.
-- For production, prefer a small backend/edge function with a service-role key instead of public write policies.

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active services" ON services;
CREATE POLICY "Public read active services"
  ON services FOR SELECT
  USING (is_active = TRUE);

DROP POLICY IF EXISTS "Admin UI manage services" ON services;
CREATE POLICY "Admin UI manage services"
  ON services FOR ALL
  USING (TRUE)
  WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Public create contact queries" ON contact_queries;
CREATE POLICY "Public create contact queries"
  ON contact_queries FOR INSERT
  WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Admin UI read contact queries" ON contact_queries;
CREATE POLICY "Admin UI read contact queries"
  ON contact_queries FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Admin UI update contact queries" ON contact_queries;
CREATE POLICY "Admin UI update contact queries"
  ON contact_queries FOR UPDATE
  USING (TRUE)
  WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Admin UI delete contact queries" ON contact_queries;
CREATE POLICY "Admin UI delete contact queries"
  ON contact_queries FOR DELETE
  USING (TRUE);

DROP POLICY IF EXISTS "Admin UI read admins by email" ON admins;
CREATE POLICY "Admin UI read admins by email"
  ON admins FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Admin UI manage astrologers" ON astrologers;
CREATE POLICY "Admin UI manage astrologers"
  ON astrologers FOR ALL
  USING (TRUE)
  WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Admin UI manage banners" ON banners;
CREATE POLICY "Admin UI manage banners"
  ON banners FOR ALL
  USING (TRUE)
  WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Admin UI manage live shows" ON live_shows;
CREATE POLICY "Admin UI manage live shows"
  ON live_shows FOR ALL
  USING (TRUE)
  WITH CHECK (TRUE);

INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', TRUE)
ON CONFLICT (id) DO UPDATE SET public = TRUE;

DROP POLICY IF EXISTS "Public read images" ON storage.objects;
CREATE POLICY "Public read images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Admin UI upload images" ON storage.objects;
CREATE POLICY "Admin UI upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "Admin UI update images" ON storage.objects;
CREATE POLICY "Admin UI update images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'images')
  WITH CHECK (bucket_id = 'images');
