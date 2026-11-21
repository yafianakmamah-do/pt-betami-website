-- Fitur admin yang belum ada di database: lamaran kerja, lowongan, konten, dan storage.
-- Aman dijalankan ulang. Tidak menghapus data yang sudah ada.

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
grant select, update, delete on public.job_applications to authenticated;

drop policy if exists "Public can submit job applications" on public.job_applications;
create policy "Public can submit job applications"
  on public.job_applications for insert to anon, authenticated
  with check (
    status = 'baru'
    and char_length(trim(name)) between 2 and 120
    and char_length(email) between 5 and 254
    and char_length(trim(phone)) between 5 and 40
    and char_length(trim(position)) between 2 and 180
    and char_length(cover_letter) <= 5000
  );

drop policy if exists "Admins manage job applications" on public.job_applications;
create policy "Admins manage job applications"
  on public.job_applications for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create table if not exists public.job_openings (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 2 and 180),
  location text not null default 'Aceh Tamiang' check (char_length(trim(location)) between 2 and 180),
  employment_type text not null default 'Penuh waktu' check (char_length(trim(employment_type)) between 2 and 60),
  description text not null default '' check (char_length(description) <= 5000),
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists job_openings_created_at_idx
  on public.job_openings (created_at desc);

alter table public.job_openings enable row level security;

grant select on public.job_openings to anon, authenticated;
grant insert, update, delete on public.job_openings to authenticated;

drop policy if exists "Published openings are public" on public.job_openings;
create policy "Published openings are public"
  on public.job_openings for select
  using (is_published = true);

drop policy if exists "Admins manage openings" on public.job_openings;
create policy "Admins manage openings"
  on public.job_openings for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create table if not exists public.site_content (
  page text not null,
  field text not null,
  value text not null default '' check (char_length(value) <= 8000),
  updated_at timestamptz not null default now(),
  primary key (page, field)
);

alter table public.site_content enable row level security;

grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
  on public.site_content for select
  using (true);

drop policy if exists "Admins manage site content" on public.site_content;
create policy "Admins manage site content"
  on public.site_content for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('betami-gallery', 'betami-gallery', true, 8388608, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'betami-documents',
  'betami-documents',
  false,
  5242880,
  array['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Gallery images are public" on storage.objects;
create policy "Gallery images are public"
  on storage.objects for select
  using (bucket_id = 'betami-gallery');

drop policy if exists "Admins upload gallery images" on storage.objects;
create policy "Admins upload gallery images"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'betami-gallery'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

drop policy if exists "Admins update gallery images" on storage.objects;
create policy "Admins update gallery images"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'betami-gallery'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  with check (
    bucket_id = 'betami-gallery'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

drop policy if exists "Admins delete gallery images" on storage.objects;
create policy "Admins delete gallery images"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'betami-gallery'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

drop policy if exists "Applicants upload resumes" on storage.objects;
create policy "Applicants upload resumes"
  on storage.objects for insert to anon, authenticated
  with check (
    bucket_id = 'betami-documents'
    and (storage.foldername(name))[1] = 'applications'
  );

drop policy if exists "Admins read resumes" on storage.objects;
create policy "Admins read resumes"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'betami-documents'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

drop policy if exists "Admins delete resumes" on storage.objects;
create policy "Admins delete resumes"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'betami-documents'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
