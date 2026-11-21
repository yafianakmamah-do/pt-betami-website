-- Migration: Create job_applications table for Career/Lamaran Pekerjaan feature
-- Run this in Supabase SQL Editor

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  email text not null check (char_length(email) between 5 and 254),
  phone text not null check (char_length(trim(phone)) between 5 and 40),
  position text not null check (char_length(trim(position)) between 2 and 180),
  resume_url text not null default '',
  cover_letter text not null default '' check (char_length(cover_letter) <= 5000),
  status text not null default 'baru' check (status in ('baru', 'ditinjau', 'diterima', 'ditolak')),
  created_at timestamptz not null default now()
);

create index if not exists job_applications_created_at_idx
  on public.job_applications (created_at desc);

alter table public.job_applications enable row level security;

grant insert on public.job_applications to anon, authenticated;
grant select, update on public.job_applications to authenticated;

drop policy if exists "Public can submit job applications" on public.job_applications;
create policy "Public can submit job applications"
  on public.job_applications for insert to anon, authenticated
  with check (true);

drop policy if exists "Admins manage job applications" on public.job_applications;
create policy "Admins manage job applications"
  on public.job_applications for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
