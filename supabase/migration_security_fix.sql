-- Pengamanan final Supabase untuk portal admin PT BETAMI.
-- Aman dijalankan berulang kali. TIDAK menghapus tabel, baris, atau file.
-- Prasyarat: jalankan supabase/schema.sql lalu supabase/migration_admin_features.sql terlebih dahulu.

-- Fungsi pembantu: hanya akun dengan app_metadata.role = 'admin' yang dianggap admin.
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

-- Pastikan RLS aktif pada seluruh tabel aplikasi.
alter table public.gallery_items enable row level security;
alter table public.contact_messages enable row level security;
alter table public.internship_applications enable row level security;
alter table public.interns enable row level security;
alter table public.job_applications enable row level security;
alter table public.job_openings enable row level security;
alter table public.site_content enable row level security;

-- Cabut hak tulis yang tidak perlu dari anon (public hanya boleh mengirim formulir).
revoke update, delete on public.gallery_items from anon;
revoke update, delete on public.contact_messages from anon;
revoke update, delete on public.internship_applications from anon;
revoke update, delete on public.job_applications from anon;
revoke delete on public.interns from anon;

-- Aksi admin pada tabel-tabel aplikasi.
drop policy if exists "Admins manage gallery" on public.gallery_items;
create policy "Admins manage gallery" on public.gallery_items for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins manage contact messages" on public.contact_messages;
create policy "Admins manage contact messages" on public.contact_messages for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins manage internship applications" on public.internship_applications;
create policy "Admins manage internship applications" on public.internship_applications for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins manage interns" on public.interns;
create policy "Admins manage interns" on public.interns for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins manage job applications" on public.job_applications;
create policy "Admins manage job applications" on public.job_applications for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins manage openings" on public.job_openings;
create policy "Admins manage openings" on public.job_openings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins manage site content" on public.site_content;
create policy "Admins manage site content" on public.site_content for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Bucket galeri: publik hanya bisa membaca; perubahan hanya admin.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('betami-gallery', 'betami-gallery', true, 8388608, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- Bucket CV: PRIVAT. Calon pelamar hanya bisa mengunggah ke folder applications/.
-- Admin membaca lewat signed URL yang dibuat di server (api/admin/careers).
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

-- Storage: galeri
drop policy if exists "Gallery images are public" on storage.objects;
create policy "Gallery images are public" on storage.objects for select
  using (bucket_id = 'betami-gallery');

drop policy if exists "Admins upload gallery images" on storage.objects;
create policy "Admins upload gallery images" on storage.objects for insert to authenticated
  with check (bucket_id = 'betami-gallery' and public.is_admin());

drop policy if exists "Admins update gallery images" on storage.objects;
create policy "Admins update gallery images" on storage.objects for update to authenticated
  using (bucket_id = 'betami-gallery' and public.is_admin())
  with check (bucket_id = 'betami-gallery' and public.is_admin());

drop policy if exists "Admins delete gallery images" on storage.objects;
create policy "Admins delete gallery images" on storage.objects for delete to authenticated
  using (bucket_id = 'betami-gallery' and public.is_admin());

-- Storage: CV / dokumen lamaran
drop policy if exists "Applicants upload resumes" on storage.objects;
create policy "Applicants upload resumes" on storage.objects for insert to anon, authenticated
  with check (
    bucket_id = 'betami-documents'
    and (storage.foldername(name))[1] = 'applications'
    and lower(split_part(storage.filename(name), '.', 2)) in ('pdf', 'doc', 'docx')
  );

drop policy if exists "Admins read resumes" on storage.objects;
create policy "Admins read resumes" on storage.objects for select to authenticated
  using (bucket_id = 'betami-documents' and public.is_admin());

drop policy if exists "Admins delete resumes" on storage.objects;
create policy "Admins delete resumes" on storage.objects for delete to authenticated
  using (bucket_id = 'betami-documents' and public.is_admin());

-- ---------------------------------------------------------------------------
-- CARA MEMBUAT AKUN ADMIN (jalankan setelah akun dibuat di Authentication)
-- Ganti alamat email berikut dengan email admin Anda, lalu jalankan:
--
-- update auth.users
-- set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
-- where email = 'email-admin-anda@example.com';
--
-- Setelah itu, logout lalu login ulang di /admin agar role terbawa ke sesi.
-- ---------------------------------------------------------------------------
