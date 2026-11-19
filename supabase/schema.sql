create extension if not exists pgcrypto;

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  storage_path text not null,
  category text not null check (category in ('aerial', 'mill', 'plantation', 'product', 'csr')),
  title_id text not null check (char_length(trim(title_id)) between 2 and 120),
  title_en text not null check (char_length(trim(title_en)) between 2 and 120),
  description_id text not null default '' check (char_length(description_id) <= 500),
  description_en text not null default '' check (char_length(description_en) <= 500),
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  company text not null default '' check (char_length(company) <= 160),
  email text not null check (char_length(email) between 5 and 254),
  phone text not null check (char_length(trim(phone)) between 5 and 40),
  topic text not null check (char_length(trim(topic)) between 2 and 120),
  message text not null check (char_length(trim(message)) between 5 and 5000),
  status text not null default 'baru' check (status in ('baru', 'dibaca', 'selesai')),
  created_at timestamptz not null default now()
);

create table if not exists public.internship_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  institution text not null check (char_length(trim(institution)) between 2 and 180),
  major text not null check (char_length(trim(major)) between 2 and 120),
  email text not null check (char_length(email) between 5 and 254),
  phone text not null check (char_length(trim(phone)) between 5 and 40),
  division text not null check (char_length(trim(division)) between 2 and 120),
  duration text not null check (char_length(trim(duration)) between 2 and 40),
  message text not null default '' check (char_length(message) <= 3000),
  status text not null default 'baru' check (status in ('baru', 'ditinjau', 'diterima', 'ditolak')),
  created_at timestamptz not null default now()
);

create table if not exists public.interns (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  university text not null check (char_length(trim(university)) between 2 and 180),
  major text not null check (char_length(trim(major)) between 2 and 120),
  period text not null check (char_length(trim(period)) between 2 and 60),
  location text not null check (char_length(trim(location)) between 2 and 180),
  experience text not null check (char_length(trim(experience)) between 10 and 1000),
  photo_url text not null,
  photo_storage_path text not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.gallery_items (
  id, image_url, storage_path, category, title_id, title_en, description_id, description_en, is_published
) values
  ('00000000-0000-4000-8000-000000000001', '/images/pks-factory-real.jpg', 'builtin:1', 'mill', 'Pabrik Kelapa Sawit (PKS) PT BETAMI', 'PT BETAMI Palm Oil Mill (PKS)', 'Fasilitas pengolahan TBS menjadi CPO di area operasional Aceh Tamiang.', 'FFB to CPO processing facility in Aceh Tamiang operations area.', true),
  ('00000000-0000-4000-8000-000000000002', '/images/tbs-harvest.jpg', 'builtin:2', 'product', 'Pemanenan & Pengumpulan TBS', 'FFB Harvest & Collection', 'Tandan Buah Segar hasil panen yang dikumpulkan untuk pengolahan di PKS.', 'Fresh fruit bunches collected for mill processing.', true),
  ('00000000-0000-4000-8000-000000000003', '/images/fruit-oil-palm-real.jpg', 'builtin:3', 'product', 'Brondolan Buah Sawit Segar', 'Fresh Loose Palm Fruits', 'Buah kelapa sawit berkualitas sebagai bahan baku pengolahan minyak sawit.', 'Quality palm fruits as raw material for palm oil processing.', true),
  ('00000000-0000-4000-8000-000000000004', '/images/palm-fruit-bunch.jpg', 'builtin:4', 'plantation', 'Tandan Buah Segar di Pohon', 'Fresh Fruit Bunch on Tree', 'TBS matang pada pohon kelapa sawit siap dipanen.', 'Ripe fresh fruit bunch ready for harvest.', true),
  ('00000000-0000-4000-8000-000000000005', '/images/estate-jambi.jpg', 'builtin:5', 'plantation', 'Perkebunan & Jalan Operasional', 'Estate & Operational Roads', 'Infrastruktur kebun dan jalan pendukung distribusi TBS/CPO.', 'Estate infrastructure and roads supporting FFB/CPO logistics.', true),
  ('00000000-0000-4000-8000-000000000006', '/images/kegiatan/csr-betami-juli-2026.jpeg', 'builtin:6', 'csr', 'Kegiatan Sosial & CSR PT BETAMI', 'PT BETAMI Social & CSR Activities', 'Dokumentasi kegiatan sosial perusahaan bersama masyarakat desa sekitar (Sumber: pemberitaan publik).', 'Company social activities with nearby villages (Source: public news).', true),
  ('00000000-0000-4000-8000-000000000007', '/images/kegiatan/csr-sembako-betami.jpg', 'builtin:7', 'csr', 'Penyaluran Bantuan Sembako', 'Food Aid Distribution', 'Program bantuan sembako bagi warga di desa sekitar operasional perusahaan (Sumber: pemberitaan publik).', 'Food aid program for residents near operational area (Source: public news).', true),
  ('00000000-0000-4000-8000-000000000008', '/images/pks-mill-ramp.jpg', 'builtin:8', 'mill', 'Area Penerimaan TBS', 'FFB Receiving Area', 'Area penerimaan dan penanganan TBS sebelum proses pengolahan pabrik.', 'FFB receiving and handling area before mill processing.', true),
  ('00000000-0000-4000-8000-000000000009', '/images/plantation-1.jpg', 'builtin:9', 'plantation', 'Hamparan Perkebunan Kelapa Sawit', 'Oil Palm Plantation Landscape', 'Lanskap perkebunan kelapa sawit sebagai bagian dari rantai pasok TBS.', 'Oil palm plantation landscape supporting FFB supply chain.', true),
  ('00000000-0000-4000-8000-000000000010', '/images/aerial-palm-estate.jpg', 'builtin:10', 'aerial', 'Hamparan Kebun Sawit dari Atas', 'Palm Estate from Above', 'Foto udara hamparan kebun kelapa sawit dengan pola blok tanaman yang tertata (ilustrasi industri).', 'Aerial view of oil palm estate with neatly arranged planting blocks (industry illustration).', true),
  ('00000000-0000-4000-8000-000000000011', '/images/estate-road-aerial-hd.jpg', 'builtin:11', 'aerial', 'Jalan Kebun Menembus Blok Tanaman', 'Estate Road Across Planting Blocks', 'Jalan operasional kebun yang menghubungkan blok tanaman menuju titik pengumpulan TBS (ilustrasi industri).', 'Operational estate road linking planting blocks to FFB collection points (industry illustration).', true),
  ('00000000-0000-4000-8000-000000000012', '/images/pks-aerial-hd.jpg', 'builtin:12', 'mill', 'Kompleks Pabrik Kelapa Sawit (Udara)', 'Palm Oil Mill Complex (Aerial)', 'Tampak udara kompleks PKS beserta area penerimaan TBS dan tangki penyimpanan (ilustrasi industri).', 'Aerial view of the mill complex with FFB receiving area and storage tanks (industry illustration).', true),
  ('00000000-0000-4000-8000-000000000013', '/images/palm-nursery-hd.jpg', 'builtin:13', 'plantation', 'Pembibitan Kelapa Sawit', 'Oil Palm Seedling Nursery', 'Ribuan bibit kelapa sawit dalam polybag siap ditanam — awal dari siklus kebun sawit (ilustrasi industri).', 'Thousands of oil palm seedlings in polybags ready for planting — the start of the estate cycle (industry illustration).', true),
  ('00000000-0000-4000-8000-000000000014', '/images/ffb-harvest-hd.jpg', 'builtin:14', 'product', 'Tandan Buah Segar Hasil Panen', 'Freshly Harvested Fruit Bunches', 'Tandan Buah Segar berwarna merah-oranye yang baru dipanen dan siap diolah (ilustrasi industri).', 'Freshly harvested red-orange fruit bunches ready for processing (industry illustration).', true),
  ('00000000-0000-4000-8000-000000000015', '/images/cpo-kernel-hd.jpg', 'builtin:15', 'product', 'CPO & Inti Sawit', 'CPO & Palm Kernel', 'Produk olahan utama: Crude Palm Oil (CPO) berwarna keemasan dan inti sawit (ilustrasi produk).', 'Main outputs: golden Crude Palm Oil (CPO) and palm kernel (product illustration).', true),
  ('00000000-0000-4000-8000-000000000016', '/images/palm-canopy-sunset-hd.jpg', 'builtin:16', 'aerial', 'Kanopi Kebun Sawit Saat Senja', 'Palm Canopy at Sunset', 'Pemandangan kanopi kebun sawit dari udara saat matahari terbenam di wilayah Aceh Tamiang (ilustrasi industri).', 'Aerial view of palm canopy at sunset over the Aceh Tamiang area (industry illustration).', true),
  ('00000000-0000-4000-8000-000000000017', '/images/palm-fruit-tree.jpg', 'builtin:17', 'plantation', 'Buah Sawit di Atas Pohon', 'Palm Fruit on Tree', 'Buah kelapa sawit segar yang sudah matang di atas pohon.', 'Ripe fresh palm fruit hanging on the tree.', true),
  ('00000000-0000-4000-8000-000000000018', '/images/palm-fruit.jpg', 'builtin:18', 'product', 'Hasil Panen Buah Sawit', 'Palm Harvest Result', 'Hasil panen buah sawit segar dari kebun.', 'Fresh palm harvest result from the estate.', true),
  ('00000000-0000-4000-8000-000000000019', '/images/palm-kernel.jpg', 'builtin:19', 'product', 'Inti Sawit (Palm Kernel)', 'Palm Kernel', 'Inti sawit sebagai produk turunan CPO.', 'Palm kernel as a CPO derivative.', true),
  ('00000000-0000-4000-8000-000000000020', '/images/cpo-product.jpg', 'builtin:20', 'product', 'Produk CPO', 'CPO Product', 'Crude Palm Oil (CPO) hasil olahan pabrik.', 'Crude Palm Oil output from the mill.', true),
  ('00000000-0000-4000-8000-000000000021', '/images/factory.jpg', 'builtin:21', 'mill', 'Fasilitas Pabrik', 'Mill Facility', 'Fasilitas pabrik kelapa sawit PT BETAMI.', 'PT BETAMI palm oil mill facility.', true),
  ('00000000-0000-4000-8000-000000000022', '/images/hero-palm.jpg', 'builtin:22', 'plantation', 'Lanskap Kebun Sawit', 'Palm Landscape', 'Lanskap perkebunan kelapa sawit.', 'Oil palm plantation landscape.', true),
  ('00000000-0000-4000-8000-000000000023', '/images/internship.jpg', 'builtin:23', 'csr', 'Program Magang & CSR', 'Internship & CSR Program', 'Kegiatan magang dan sosial perusahaan.', 'Internship and social program activities.', true),
  ('00000000-0000-4000-8000-000000000024', '/images/about-palm.jpg', 'builtin:24', 'plantation', 'Sawit untuk Kehidupan', 'Palm for Life', 'Sawit sebagai sumber kehidupan masyarakat.', 'Palm as community livelihood.', true)
on conflict (id) do nothing;

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);
create index if not exists internship_applications_created_at_idx
  on public.internship_applications (created_at desc);
create index if not exists interns_created_at_idx
  on public.interns (created_at desc);
create index if not exists gallery_items_created_at_idx
  on public.gallery_items (created_at desc);

alter table public.gallery_items enable row level security;
alter table public.contact_messages enable row level security;
alter table public.internship_applications enable row level security;
alter table public.interns enable row level security;

grant select, insert, update, delete on public.gallery_items to anon, authenticated;
grant insert on public.contact_messages to anon, authenticated;
grant select, update on public.contact_messages to authenticated;
grant insert on public.internship_applications to anon, authenticated;
grant select, update on public.internship_applications to authenticated;
grant select on public.interns to anon, authenticated;
grant insert, update, delete on public.interns to authenticated;

drop policy if exists "Published gallery is public" on public.gallery_items;
create policy "Published gallery is public"
  on public.gallery_items for select
  using (is_published = true);

drop policy if exists "Admins manage gallery" on public.gallery_items;
create policy "Admins manage gallery"
  on public.gallery_items for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Public can submit contact messages" on public.contact_messages;
create policy "Public can submit contact messages"
  on public.contact_messages for insert to anon, authenticated
  with check (
    status = 'baru'
    and char_length(trim(name)) between 2 and 120
    and char_length(email) between 5 and 254
    and char_length(trim(message)) between 5 and 5000
  );

drop policy if exists "Admins manage contact messages" on public.contact_messages;
create policy "Admins manage contact messages"
  on public.contact_messages for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Public can submit internship applications" on public.internship_applications;
create policy "Public can submit internship applications"
  on public.internship_applications for insert to anon, authenticated
  with check (
    status = 'baru'
    and char_length(trim(name)) between 2 and 120
    and char_length(trim(institution)) between 2 and 180
    and char_length(email) between 5 and 254
  );

drop policy if exists "Admins manage internship applications" on public.internship_applications;
create policy "Admins manage internship applications"
  on public.internship_applications for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Published interns is public" on public.interns;
create policy "Published interns is public"
  on public.interns for select
  using (is_published = true);

drop policy if exists "Admins manage interns" on public.interns;
create policy "Admins manage interns"
  on public.interns for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('betami-gallery', 'betami-gallery', true, 8388608, array['image/jpeg', 'image/png', 'image/webp'])
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

-- After creating the first admin user in Supabase Auth, grant its role:
-- update auth.users
-- set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
-- where email = 'your-admin-email@example.com';
