# Panduan Admin Website BETAMI

Panduan ini untuk menyiapkan penyimpanan foto, pesan Kontak, dan formulir Magang. Portal admin berada di `/admin`.

## Yang perlu disiapkan

- Akun Supabase untuk database, login admin, dan penyimpanan foto.
- Akun Vercel untuk hosting website Next.js.
- Untuk memublikasikan lewat integrasi Git Vercel, folder proyek perlu disimpan di repository GitHub terlebih dahulu. Folder proyek saat ini belum menjadi repository Git.

Tidak perlu membuat kata sandi admin di dalam kode. Jangan pernah mengirim kata sandi atau kunci rahasia lewat chat.

## 1. Buat database Supabase

1. Masuk ke [supabase.com](https://supabase.com) dan buat proyek baru.
2. Simpan kata sandi database di tempat pribadi. Kata sandi database berbeda dengan kata sandi admin website.
3. Buka **SQL Editor → New query**.
4. Buka file `supabase/schema.sql` di proyek ini, salin seluruh isinya ke SQL Editor, lalu tekan **Run**.
5. Skrip membuat tiga tabel, aturan privasi (RLS), bucket foto publik untuk baca dan admin-only untuk perubahan, serta mendaftarkan foto bawaan Galeri agar bisa dikelola dari portal. Pengunjung hanya bisa mengirim formulir dan melihat foto terbit; mereka tidak bisa membaca pesan atau pengajuan orang lain.

Jika Supabase sudah pernah disiapkan sebelum fitur pengelolaan foto bawaan ditambahkan, jalankan kembali seluruh `supabase/schema.sql` agar foto bawaan masuk ke daftar admin. Skrip aman dijalankan ulang dan tidak menggandakan entri foto bawaan.

## 2. Buat akun admin

1. Di Supabase, buka **Authentication → Users → Add user**.
2. Masukkan email admin dan buat kata sandi yang kuat. Jika ada pilihan **Auto Confirm User**, aktifkan untuk akun admin. Simpan kata sandi di password manager.
3. Salin email yang sama, lalu buka **SQL Editor** dan jalankan perintah berikut dengan mengganti alamat email:

   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
   where email = 'email-admin-anda@example.com';
   ```

4. Masuk lewat `/admin`. Jika baru mengubah role akun, keluar lalu masuk kembali agar sesi memuat role terbaru.

## 3. Sambungkan website saat dijalankan di komputer

1. Di Supabase, buka **Project Settings → API Keys**.
2. Salin **Project URL** dan **Publishable key** (atau legacy `anon`/`public` key). Jangan gunakan **Secret key** atau `service_role` key.
3. Buat file `.env.local` di folder utama proyek (sefolder dengan `package.json`) dengan isi:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://ID-PROYEK-ANDA.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=PUBLISHABLE_KEY_ANDA
   ```

4. Simpan file tersebut, lalu jalankan `npm run dev` di terminal pada folder proyek. Buka `http://localhost:3000/admin`.
5. `.env.local` dikecualikan Git. Jangan menghapus atau membagikan pengecualian ini.

## 4. Cara mengelola portal admin

### Menambah, mengganti, dan mengubah teks foto

1. Masuk ke `/admin`, pilih tab **Foto website**.
2. Pilih JPG, PNG, atau WebP maksimal 8 MB.
3. Pilih kategori, isi judul dan keterangan Indonesia; teks Inggris boleh dilengkapi.
4. Tekan **Unggah & tampilkan**. Foto dan teks masuk ke Supabase dan tampil di Galeri website.
5. Untuk memperbarui foto yang sudah ada—termasuk foto bawaan—pilih **Ubah foto & teks**. Pilih foto pengganti bila perlu, perbarui judul/keterangan, lalu simpan. Foto bawaan dapat diubah, tetapi tidak dapat dihapus dari portal.
6. Gunakan pencarian dan filter kategori untuk menemukan foto. Foto tambahan dapat disembunyikan atau dihapus.

### Membaca pesan Kontak

1. Pilih tab **Pesan Kontak**.
2. Baca pesan, lalu ubah status menjadi Baru, Dibaca, atau Selesai.
3. Tautan email dan telepon dapat dipilih untuk membalas melalui aplikasi email/telepon Anda.

### Meninjau pengajuan Magang

1. Pilih tab **Pengajuan Magang**.
2. Data peserta, sekolah, jurusan, bidang, durasi, kontak, dan catatan tampil di sini.
3. Ubah status menjadi Baru, Ditinjau, Diterima, atau Ditolak setelah ditindaklanjuti.
4. Data kontak dan pengajuan bersifat pribadi. Batasi akses portal admin hanya kepada staf berwenang.

## 5. Hosting ke internet dengan Vercel

1. Simpan proyek ini ke repository GitHub pribadi/perusahaan. Jangan commit `.env.local`.
2. Di [vercel.com](https://vercel.com), pilih **Add New → Project**, lalu impor repository tersebut.
3. Tambahkan environment variables berikut di **Project Settings → Environment Variables** untuk Production (dan Preview jika diperlukan):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy. Setiap kali environment variable diubah, lakukan redeploy.
5. Di Supabase **Authentication → URL Configuration**, set **Site URL** ke domain produksi dan tambahkan domain preview/local yang digunakan ke **Redirect URLs**.
6. Uji website, `/admin`, unggah foto, formulir Kontak, dan formulir Magang pada domain produksi sebelum membagikan alamat publik.

## Catatan penting

- Hingga proyek Supabase dibuat dan dua environment variable dipasang, formulir sengaja menampilkan bahwa penyimpanan belum tersambung; sistem tidak berpura-pura berhasil.
- Foto yang ditambahkan admin disimpan di bucket `betami-gallery`; teks/caption dan statusnya tersimpan di database Supabase.
- Pesan Kontak dan Magang masuk ke inbox `/admin`, **bukan otomatis dikirim ke email**. Email otomatis memerlukan layanan email dan konfigurasi tambahan.
- Formulir tidak meminta unggahan CV atau dokumen. Fitur tersebut belum dibuat.
- Foto galeri bawaan yang sudah ada tetap tampil; foto admin ditambahkan ke galeri. Foto dari perangkat lokal lama tidak otomatis tersalin ke Supabase.
