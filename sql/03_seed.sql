-- =============================================================
-- 03_seed.sql — Dados iniciais
-- Execute DEPOIS de 01_tables.sql
-- Execute no Supabase → SQL Editor
-- =============================================================

-- Modalidades padrão
INSERT INTO modalities (name, level, description, position) VALUES
  ('Hip Hop',      'Iniciante ao avançado', 'Fundamentos, groove e coreografias.',               1),
  ('Breaking',     'Todos os níveis',       'Top rock, footwork, power moves e freezes.',        2),
  ('Kids',         '6 a 12 anos',           'Coordenação, ritmo e diversão para crianças.',      3),
  ('Coreográfico', 'Intermediário',         'Montagem de coreografias para eventos.',            4),
  ('Treino da Cia','Seletiva',              'Treino fechado do elenco oficial.',                 5)
ON CONFLICT DO NOTHING;

-- Configurações padrão do site
INSERT INTO site_settings (key, value) VALUES
  ('hero_image_url', ''),
  ('instagram',      'https://www.instagram.com/streetalmacompanydance/'),
  ('whatsapp',       ''),
  ('email',          '')
ON CONFLICT (key) DO NOTHING;

-- Endereço padrão (ajuste conforme necessário)
INSERT INTO addresses (label, address, position) VALUES
  ('', 'Rio das Ostras — RJ', 1)
ON CONFLICT DO NOTHING;
