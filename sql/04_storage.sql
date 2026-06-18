-- =============================================================
-- 04_storage.sql — Bucket de imagens
-- ATENÇÃO: a criação do bucket em si deve ser feita pela UI do
-- Supabase (Storage → New bucket). Este arquivo contém apenas
-- os comandos SQL de política que complementam o bucket.
--
-- Passos manuais ANTES de executar este arquivo:
--   1. Supabase → Storage → New bucket
--   2. Nome: gallery
--   3. Marcar "Public bucket" (para URLs públicas funcionarem)
--
-- Depois execute o bloco abaixo no SQL Editor.
-- =============================================================

-- Permitir que o anon (painel sem Supabase Auth) faça upload
CREATE POLICY "gallery: upload anon"
  ON storage.objects FOR INSERT TO anon
  WITH CHECK (bucket_id = 'gallery');

-- Permitir que o anon remova arquivos (botão "Remover" da galeria)
CREATE POLICY "gallery: delete anon"
  ON storage.objects FOR DELETE TO anon
  USING (bucket_id = 'gallery');

-- Leitura pública já é coberta automaticamente pelo "Public bucket".
-- Se precisar configurar manualmente:
-- CREATE POLICY "gallery: leitura pública"
--   ON storage.objects FOR SELECT TO anon
--   USING (bucket_id = 'gallery');
