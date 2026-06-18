# Street Alma Company Dance — Next.js + Supabase

Site da companhia de dança com:

- 🏠 **Landing page** pública (apresentação, modalidades, galeria, horários)
- 🔐 **Login admin** com credenciais hardcoded (`magno` / `123`)
- 📊 **Dashboard** para cadastrar horários e enviar fotos
- 🖼️ **Galeria de fotos** que aparece automaticamente na landing page
- 🎨 Tema laranja (`#FF5C00`) + preto

---

## 1. Instalação

```bash
npm install
cp .env.local.example .env.local
# edite .env.local com sua URL e ANON KEY do Supabase
npm run dev
```

Abra http://localhost:3000

---

## 2. Configurando o Supabase

### 2.1. Criar o projeto

1. Acesse https://app.supabase.com e crie um projeto novo.
2. Em **Settings → API**, copie:
   - `Project URL` → cole em `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → cole em `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2.2. Criar as tabelas

No **SQL Editor** do Supabase, rode:

```sql
-- Tabela de horários
create table public.schedules (
  id bigserial primary key,
  day text not null,
  time text not null,
  modality text not null,
  level text,
  created_at timestamptz default now()
);

-- Tabela de fotos
create table public.gallery_photos (
  id bigserial primary key,
  url text not null,
  caption text,
  created_at timestamptz default now()
);

-- Row Level Security (libera leitura e escrita pública nesta demo;
-- em produção, restrinja conforme sua estratégia de auth)
alter table public.schedules enable row level security;
alter table public.gallery_photos enable row level security;

create policy "public read schedules" on public.schedules
  for select using (true);
create policy "public write schedules" on public.schedules
  for all using (true) with check (true);

create policy "public read photos" on public.gallery_photos
  for select using (true);
create policy "public write photos" on public.gallery_photos
  for all using (true) with check (true);
```

### 2.3. Criar o bucket de Storage

1. Vá em **Storage → New bucket**.
2. Nome: `gallery`.
3. Marque como **Public**.
4. Em **Policies** do bucket, adicione policies de `INSERT`, `SELECT` e `DELETE` permitindo `true` para a role `anon` (ou ajuste conforme sua estratégia).

Pronto. O dashboard já vai conseguir subir, listar e remover fotos.

---

## 3. Estrutura do projeto

```
street-alma/
├── app/
│   ├── page.tsx                  ← Landing page
│   ├── login/page.tsx            ← Login (magno / 123)
│   └── dashboard/
│       ├── layout.tsx            ← Sidebar do painel
│       ├── page.tsx              ← Home do dashboard
│       ├── horarios/page.tsx     ← CRUD de horários
│       └── galeria/page.tsx      ← Upload de fotos
├── components/
│   ├── PhotoGallery.tsx          ← Galeria reutilizável (landing)
│   ├── SchedulesTable.tsx        ← Tabela de horários (landing)
│   └── SiteHeader.tsx
├── lib/
│   ├── supabase.ts               ← Cliente Supabase + tipos
│   └── auth.ts                   ← Helpers de cookie e credenciais
├── middleware.ts                 ← Protege /dashboard
└── ...
```

---

## 4. Credenciais

- **Usuário:** `magno`
- **Senha:** `123`

Definidas em `lib/auth.ts`. O login seta um cookie `sa_auth=ok` que o `middleware.ts` checa em qualquer rota dentro de `/dashboard`.

> ⚠️ **Importante:** isto é uma autenticação simbólica para protótipo. Em
> produção, troque por **Supabase Auth** (`@supabase/auth-helpers-nextjs`)
> ou outro provedor real, e ajuste as policies de RLS.

---

## 5. Como usar

1. Abra `/` para ver o site público.
2. Clique em **Painel** (canto superior direito) → login com `magno` / `123`.
3. No dashboard, vá em **Horários** para cadastrar a grade.
4. Vá em **Galeria** para subir fotos — elas aparecem automaticamente na seção "Galeria" da landing.

---

## 6. Deploy

Funciona em Vercel sem ajustes:

```bash
vercel
```

Cole as duas variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`) no painel da Vercel e pronto.
