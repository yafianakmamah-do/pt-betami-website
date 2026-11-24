-- Jalankan sekali di Supabase SQL Editor (aman dijalankan ulang).
-- 1) Tanggal foto galeri yang bisa diubah admin
alter table public.gallery_items add column if not exists taken_at date;

-- 2) Berita
create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title_id text not null check (char_length(trim(title_id)) between 3 and 200),
  title_en text not null default '',
  excerpt_id text not null default '' check (char_length(excerpt_id) <= 400),
  excerpt_en text not null default '' check (char_length(excerpt_en) <= 400),
  body_id text not null default '' check (char_length(body_id) <= 20000),
  body_en text not null default '' check (char_length(body_en) <= 20000),
  cover_url text not null default '',
  cover_storage_path text not null default '',
  category text not null default 'perusahaan',
  published_at date not null default current_date,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.news_posts enable row level security;
grant select on public.news_posts to anon, authenticated;
grant insert, update, delete on public.news_posts to authenticated;

drop policy if exists "Published news are public" on public.news_posts;
create policy "Published news are public" on public.news_posts for select
  using (is_published = true or public.is_admin());

drop policy if exists "Admins manage news" on public.news_posts;
create policy "Admins manage news" on public.news_posts for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
