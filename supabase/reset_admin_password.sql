-- Ganti sandi admin LANGSUNG tanpa email reset.
-- Jalankan di Supabase → SQL Editor → New query → Run.
-- Sandi sudah diisi: BetamiAdmin2026! — tidak perlu diubah lagi.
-- Email admin yang benar: admin@betami.com

create extension if not exists pgcrypto;

update auth.users
set
  encrypted_password = crypt('BetamiAdmin2026!', gen_salt('bf')),
  email_confirmed_at = coalesce(email_confirmed_at, now()),
  raw_app_meta_data =
    coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb,
  updated_at = now()
where email = 'admin@betami.com';

-- Cek hasilnya: harus mengembalikan 1 baris
select email,
       email_confirmed_at is not null as confirmed,
       raw_app_meta_data ->> 'role' as role
from auth.users
where email = 'admin@betami.com';
