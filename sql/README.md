# SQL — Street Alma

Execute os arquivos **em ordem** no Supabase → SQL Editor.

| Arquivo | O que faz |
|---|---|
| `01_tables.sql` | Cria todas as tabelas |
| `02_rls.sql` | Habilita RLS e cria as políticas de acesso |
| `03_seed.sql` | Insere dados iniciais (modalidades, settings, endereço) |
| `04_storage.sql` | Políticas do bucket `gallery` no Storage |

## Antes de executar `04_storage.sql`

Crie o bucket manualmente:
1. Supabase → **Storage → New bucket**
2. Nome: `gallery`
3. Marcar **Public bucket**

## Tabelas

- **schedules** — grade de horários
- **gallery_photos** — fotos da galeria
- **modalities** — modalidades exibidas no site (editável pelo painel)
- **site_settings** — configurações gerais: foto do grupo, Instagram, WhatsApp, e-mail
- **addresses** — endereços da escola (múltiplos permitidos)
