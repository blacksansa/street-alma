-- =============================================================
-- 02_rls.sql — Row Level Security
-- Projeto usa autenticação por cookie simples (não Supabase Auth),
-- então o painel opera com a chave anon. Todas as tabelas liberam
-- leitura pública e escrita para anon.
-- Execute no Supabase → SQL Editor
-- =============================================================

-- ── schedules ────────────────────────────────────────────────
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "schedules: leitura pública"
  ON schedules FOR SELECT TO anon USING (true);

CREATE POLICY "schedules: escrita anon"
  ON schedules FOR ALL TO anon USING (true) WITH CHECK (true);

-- ── gallery_photos ────────────────────────────────────────────
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gallery_photos: leitura pública"
  ON gallery_photos FOR SELECT TO anon USING (true);

CREATE POLICY "gallery_photos: escrita anon"
  ON gallery_photos FOR ALL TO anon USING (true) WITH CHECK (true);

-- ── modalities ────────────────────────────────────────────────
ALTER TABLE modalities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "modalities: leitura pública"
  ON modalities FOR SELECT TO anon USING (true);

CREATE POLICY "modalities: escrita anon"
  ON modalities FOR ALL TO anon USING (true) WITH CHECK (true);

-- ── site_settings ─────────────────────────────────────────────
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_settings: leitura pública"
  ON site_settings FOR SELECT TO anon USING (true);

CREATE POLICY "site_settings: escrita anon"
  ON site_settings FOR ALL TO anon USING (true) WITH CHECK (true);

-- ── addresses ─────────────────────────────────────────────────
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "addresses: leitura pública"
  ON addresses FOR SELECT TO anon USING (true);

CREATE POLICY "addresses: escrita anon"
  ON addresses FOR ALL TO anon USING (true) WITH CHECK (true);

-- ── storage.objects (bucket: gallery) ────────────────────────
CREATE POLICY "gallery: upload anon"
  ON storage.objects FOR INSERT TO anon
  WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "gallery: delete anon"
  ON storage.objects FOR DELETE TO anon
  USING (bucket_id = 'gallery');
