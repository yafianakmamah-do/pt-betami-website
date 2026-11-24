# Panduan Admin & Supabase — PT BETAMI

Portal admin berada di `/admin`. Halaman lamaran kerja publik berada di `/karir`.
Panduan ini menjelaskan apa yang sudah terpasang di kode dan apa yang **masih perlu Anda lakukan di Supabase** (karena kredensial proyek tidak boleh ditaruh di repository).

---

## 1. Status konfigurasi saat ini

Kode sudah mendeteksi dan menolak kredensial contoh/placeholder serta Secret Key.

File `.env.local` saat ini sudah terisi dengan Project URL dan anon key milik proyek Supabase BETAMI:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xipuoszxxxuxdxftgtga.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (anon key proyek BETAMI)
```

Project ref `xipuoszxxxuxdxftgtga` itu **bukan placeholder**—sudah diverifikasi dari dashboard Supabase Anda.

**Bila ingin memakai Publishable key yang lebih baru:**
1. Buka Supabase → **Project Settings → API Keys → Publishable key**.
2. Salin nilai `sb_publishable_...` (bukan `sb_secret_...` dan bukan `service_role`).
3. Ganti baris `NEXT_PUBLIC_SUPABASE_ANON_KEY` di `.env.local`.
4. Simpan, lalu **restart** `npm run dev` (atau redeploy).

> Validasi otomatis di `lib/supabase/config.ts` akan menolak: nilai placeholder, URL dan key yang tertukar, key dari proyek lain (project ref tidak cocok), serta Secret Key/service_role.

---

## 2. Siapkan database (SQL Editor Supabase)

Jalankan **berurutan** di Supabase → SQL Editor → New query. Skrip aman dijalankan ulang dan tidak menghapus data.

1. `supabase/schema.sql` — tabel galeri, kontak, magang, peserta magang, foto bawaan, RLS awal, bucket `betami-gallery`.
2. `supabase/migration_admin_features.sql` — tabel `job_applications`, `job_openings`, `site_content`, bucket privat `betami-documents`.
3. `supabase/migration_security_fix.sql` — pengamanan final: fungsi `is_admin()`, pencabutan izin tulis publik, RLS admin untuk semua tabel, serta kebijakan Storage yang benar.
4. `supabase/migration_news_gallery_dates.sql` — kolom tanggal foto galeri (`taken_at`) dan tabel `news_posts` untuk menu Berita.

Catatan: file `supabase/migration_job_applications.sql` adalah versi lama/duplikat dari bagian `job_applications`. Tidak perlu dijalankan jika sudah menjalankan `migration_admin_features.sql`.

---

## 3. Buat akun admin

1. Supabase → **Authentication → Users → Add user**. Isi email admin, kata sandi kuat, dan aktifkan **Auto Confirm User**.
2. Beri hak admin lewat SQL Editor (ganti email):

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'email-admin-anda@example.com';
```

3. Buka `/admin`, login, lalu **logout dan login ulang** setelah perubahan role agar sesi memuat role terbaru.
4. Akun yang login tetapi tidak memiliki role admin akan ditolak oleh middleware dan API `/api/admin/*`.

### Lupa sandi admin / email reset tidak masuk
Jalankan `supabase/reset_admin_password.sql` di SQL Editor. Ganti `SANDI_BARU_ANDA` dengan sandi baru, lalu **Run**. Skrip ini sekaligus:

- mengganti sandi langsung (tanpa email),
- memastikan email sudah confirmed,
- memberi role admin,
- menampilkan hasil pengecekan.

Setelah itu tunggu sekitar 1 menit karena Supabase membatasi percobaan login yang terlalu sering, lalu login ulang di `/admin`.

---

## 4. Fitur yang sudah terpasang

### Dashboard (`/admin`)
- Ringkasan pesan kontak, lamaran magang, lamaran kerja, peserta magang, dan galeri.
- sidebar responsif (bisa diciutkan, menu mobile berfungsi), top bar, refresh per tab.

### Lamaran Kerja & CV
- Tabel `/karir` dengan pencarian dan filter status; ubah status Baru → Ditinjau → Diterima/Ditolak; hapus lamaran.
- CV disimpan di bucket privat `betami-documents`. Tombol **Lihat CV** memakai *signed URL* yang dibuat di server (berlaku 1 jam). Tidak ada Secret Key di browser.
- Formulir publik `/karir` mengirim data + CV ke `/api/karir`; data masuk otomatis ke dashboard.

### Lowongan Pekerjaan
- Tab **Lowongan Pekerjaan**: tambah, ubah, sembunyikan/tampilkan, hapus lowongan.
- Lowongan yang ditayangkan tampil di halaman `/karir` dan bisa dipilih saat melamar.
- Di bagian atas tab ada tombol **Status Penerimaan Karyawan**:
  - **Tutup Penerimaan** → tombol dan formulir lamaran di `/karir` langsung hilang; halaman tetap menampilkan teks ajakan dan pesan pengumuman.
  - **Buka Penerimaan** → formulir dan tombol lamaran tampil kembali.

### Pengaturan Karir
- Menu admin **Pengaturan Karir** mengatur status penerimaan, judul/deskripsi halaman, judul/deskripsi ajakan, label tombol, dan pesan saat nonaktif.
- Status **AKTIF** menampilkan tombol **LAMAR SEKARANG** yang mengarah ke formulir lamaran BETAMI.
- Status **NONAKTIF** menyembunyikan tombol dan formulir, lalu menampilkan pesan penutup profesional.
- Klik **SIMPAN PERUBAHAN** untuk menyimpan teks. Tombol AKTIF/NONAKTIF menyimpan status langsung.
- Semua pengaturan tersimpan di tabel `site_content` yang sudah ada, sehingga tetap ada setelah refresh.
- Lamaran dari formulir BETAMI masuk ke tabel `job_applications` dan tampil di menu **Lamaran Kerja & CV**. CV disimpan di bucket privat `betami-documents`.

### Tentang Astra
- Alur Astra sudah dinonaktifkan dari halaman Karir sesuai permintaan.
- Semua pelamar kini memakai formulir BETAMI, sehingga datanya pasti masuk ke dashboard admin.

### Karir & Teks Lamaran
- Halaman `/karir` memakai layout rekrutmen korporat: hero besar, nilai kerja, proses rekrutmen, lowongan, dan ajakan melamar.
- Teks utama bisa diubah di **Pengaturan Karir**. Teks lama tetap tersedia di **Konten Website → tab Karir** untuk kompatibilitas.

### Magang & Galeri
- **Pendaftaran Magang**: lihat lamaran magang dan ubah statusnya.
- **Peserta Magang / Anak Magang**: tambah, ubah, hapus, dan sembunyikan/tampilkan anak magang. Isi **nama**, **universitas**, **jurusan**, **periode**, **lokasi/bagian**, **foto**, dan **pengalaman/cerita**. Foto diunggah ke bucket `betami-gallery`.
  - Jika kotak **Tampilkan di halaman Magang** dicentang, foto + nama + pengalaman langsung muncul di bagian "Anak Magang di PT BETAMI" pada halaman `/magang` dan juga di homepage.
  - Jumlah 1-3 orang ditampilkan sejajar tanpa tombol geser. Tombol panah kiri/kanan dan indikator slide muncul otomatis mulai 4 orang.
  - Klik kartu anak magang di website untuk membaca pengalaman selengkapnya.
- Di bagian atas tab **Peserta Magang** ada tombol **Status Penerimaan Anak Magang**:
  - **Tutup Penerimaan** (misalnya kuota sudah penuh) → tautan WhatsApp dan tombol "Kirim Lamaran Magang" di `/magang` langsung hilang. Galeri anak magang tetap tampil.
  - **Buka Penerimaan** → tautan dan tombol lamaran tampil kembali.
- Halaman `/magang` juga memakai **teks ajakan** dan **Syarat Lamaran Magang** yang bisa diubah di **Konten Website → tab Magang**, termasuk nomor/tautan WhatsApp dan pesan saat kuota penuh.
- **Galeri Foto**: unggah, ubah judul/keterangan, ganti foto, sembunyikan/tampilkan, hapus. Foto bawaan tetap bisa diubah tetapi tidak dihapus dari daftar.

### Pesan Kontak & Konten
- **Pesan Kontak**: baca dan ubah status Baru/Dibaca/Selesai.
- **Konten Website**: simpan teks situs ke tabel `site_content` yang sudah ada (tidak perlu SQL migrasi baru).
  - Tab **Karir** dan **Magang** berisi editor teks ajakan, syarat lamaran, label tombol, dan tombol buka/tutup penerimaan.
  - Klik **Simpan Semua** setelah mengubah teks/foto. Nilai lama otomatis dimuat saat tab dibuka.

### Pengaturan
- Profil admin bersifat read-only dari sesi Supabase.
- **Keamanan**: ubah kata sandi sungguhan lewat `supabase.auth.updateUser()`. Tidak ada tombol "simpan" palsu.

---

## 5. Keamanan yang diterapkan

- `middleware.ts` memeriksa sesi dan role admin untuk `/admin` dan seluruh `/api/admin/*`.
- Setiap route admin juga memanggil `requireAdmin()` (pertahanan berlapis).
- RLS aktif pada semua tabel; public hanya bisa: melihat data yang dipublikasikan dan mengirim formulir.
- Bucket `betami-gallery` publik untuk dibaca, tapi hanya admin yang bisa mengubah.
- Bucket `betami-documents` privat; anon hanya boleh mengunggah ke folder `applications/` dengan ekstensi PDF/DOC/DOCX.
- Tidak ada Secret Key / Service Role Key di frontend maupun di file proyek.

---

## 6. Hosting (Vercel)

1. Simpan proyek ke repository GitHub pribadi. **Jangan commit `.env.local`.**
2. Di Vercel → Project Settings → Environment Variables, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy ulang setiap kali environment variable berubah.
4. Supabase → Authentication → URL Configuration: set **Site URL** ke domain produksi dan daftarkan URL preview/local di **Redirect URLs**.

---

## 7. Pengujian

Yang sudah diverifikasi dengan kredensial Supabase asli:
- `npx tsc --noEmit` lolos dan `npm run build` sukses.
- Login admin berhasil dan dashboard tampil.
- `/karir` menampilkan tombol **LAMAR SEKARANG** yang menuju ke formulir BETAMI.
- Tombol dan formulir hilang saat status NONAKTIF, lalu tampil lagi saat status AKTIF.
- Perubahan teks/URL di **Pengaturan Karir** tersimpan dan langsung tampil di halaman publik setelah refresh.
- `/api/admin/content` menolak akses publik dengan 401.
- Tidak ada tautan Astra lagi di halaman Karir.

Yang **belum bisa diuji** sampai kredensial asli dipasang:
- Login/logout dengan akun admin sungguhan.
- Tulis/baca data ke tabel Supabase.
- Upload CV dan pembuatan signed URL.

Setelah kredensial asli terpasang, uji secara berurutan:
1. `/admin` → login admin → logout → login lagi.
2. Tab **Konten Website → Karir** → ubah teks ajakan dan syarat lamaran → simpan → cek `/karir`.
3. Tab **Lowongan Pekerjaan** → tambah lowongan → cek di `/karir`. Tekan **Tutup Penerimaan** → cek `/karir`: formulir dan tombol lamaran harus hilang. Tekan **Buka Penerimaan** lagi.
4. `/karir` → kirim lamaran dengan CV → cek tab **Lamaran Kerja & CV** → buka **Lihat CV**.
5. Form kontak `/kontak` → cek tab **Pesan Kontak**. Tab **Peserta Magang** → tambah 2 anak magang lengkap dengan foto dan cerita, lalu cek `/magang`: foto, nama, dan pengalaman harus tampil tanpa tombol geser.
6. Tab **Konten Website → Magang** → ubah syarat magang dan tautan WhatsApp → simpan → cek `/magang`.
7. Di tab **Peserta Magang**, tekan **Tutup Penerimaan** → cek `/magang`: tautan WhatsApp dan tombol lamaran harus hilang, galeri tetap ada. Tekan **Buka Penerimaan** lagi.
8. Tab **Galeri Foto** → unggah foto → cek `/galeri`.
9. Coba akun non-admin mengakses `/admin` dan `/api/admin/overview` → harus ditolak.
