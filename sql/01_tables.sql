-- =============================================================
-- 01_tables.sql — Criação de todas as tabelas
-- Execute no Supabase → SQL Editor
-- =============================================================

-- Grade de horários
CREATE TABLE IF NOT EXISTS schedules (
  id         BIGSERIAL PRIMARY KEY,
  day        TEXT        NOT NULL,
  time       TEXT        NOT NULL,
  modality   TEXT        NOT NULL,
  level      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Galeria de fotos
CREATE TABLE IF NOT EXISTS gallery_photos (
  id         BIGSERIAL PRIMARY KEY,
  url        TEXT        NOT NULL,
  caption    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Modalidades exibidas no site
CREATE TABLE IF NOT EXISTS modalities (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT    NOT NULL,
  level       TEXT    NOT NULL,
  description TEXT    NOT NULL,
  position    INTEGER NOT NULL DEFAULT 0
);

-- Configurações gerais do site (chave → valor)
CREATE TABLE IF NOT EXISTS site_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

-- Endereços (múltiplos)
CREATE TABLE IF NOT EXISTS addresses (
  id       BIGSERIAL PRIMARY KEY,
  label    TEXT    NOT NULL DEFAULT '',
  address  TEXT    NOT NULL,
  position INTEGER NOT NULL DEFAULT 0
);
