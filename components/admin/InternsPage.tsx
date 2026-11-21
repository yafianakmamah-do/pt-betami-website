'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import {
  Users, Loader2, RefreshCw, Search, Building2, GraduationCap, MapPin,
  Calendar, EyeOff, Trash2, Plus, X, CheckCircle, ChevronDown, ChevronUp,
  Camera, ExternalLink, ImagePlus,
} from 'lucide-react';
import AcceptanceToggle from './AcceptanceToggle';

interface Intern {
  id: string;
  name: string;
  university: string;
  major: string;
  period: string;
  location: string;
  experience: string;
  photo_url: string;
  photo_storage_path: string;
  is_published: boolean;
  created_at: string;
}

const EMPTY_FORM = {
  name: '', university: '', major: '', period: '', location: '', experience: '',
  photo_url: '', photo_storage_path: '', is_published: true,
};

const MAX_PHOTO_SIZE = 8 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const FALLBACK_PHOTO =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop&crop=face';

export default function InternsPage({ supabase: propSupabase }: { supabase: ReturnType<typeof createSupabaseBrowserClient> | null }) {
  const supabase = useMemo(() => propSupabase || (isSupabaseConfigured() ? createSupabaseBrowserClient() : null), [propSupabase]);
  const [interns, setInterns] = useState<Intern[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Intern | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/overview', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setInterns(Array.isArray(json.interns) ? json.interns : []);
      }
    } catch { setError('Gagal memuat data peserta magang.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => () => { if (photoPreview) URL.revokeObjectURL(photoPreview); }, [photoPreview]);

  const filtered = useMemo(() => {
    return interns.filter((intern) => {
      const text = `${intern.name} ${intern.university} ${intern.major} ${intern.location}`.toLowerCase();
      return !search || text.includes(search.toLowerCase());
    });
  }, [interns, search]);

  const resetForm = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setFormData(EMPTY_FORM);
    setPhotoFile(null);
    setPhotoPreview('');
    setSelected(null);
    setShowForm(false);
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (intern: Intern) => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setSelected(intern);
    setFormData({
      name: intern.name,
      university: intern.university,
      major: intern.major,
      period: intern.period,
      location: intern.location,
      experience: intern.experience,
      photo_url: intern.photo_url,
      photo_storage_path: intern.photo_storage_path,
      is_published: intern.is_published,
    });
    setPhotoFile(null);
    setPhotoPreview('');
    setShowForm(true);
    setError('');
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      setPhotoFile(null);
      setPhotoPreview('');
      return;
    }
    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      setError('Foto harus berformat JPG, PNG, atau WEBP.');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setError('Ukuran foto maksimal 8 MB.');
      e.target.value = '';
      return;
    }
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setError('');
  };

  const uploadPhoto = async (file: File): Promise<{ url: string; path: string }> => {
    if (!supabase) throw new Error('Supabase belum dikonfigurasi.');
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const fileName = `interns/${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const { error: uploadErr } = await supabase.storage
      .from('betami-gallery')
      .upload(fileName, file, { contentType: file.type || 'image/jpeg', upsert: false });
    if (uploadErr) throw uploadErr;
    const { data: urlData } = supabase.storage.from('betami-gallery').getPublicUrl(fileName);
    return { url: urlData.publicUrl, path: fileName };
  };

  const removePhoto = async (path?: string) => {
    if (!path || !supabase) return;
    const { error: removeErr } = await supabase.storage.from('betami-gallery').remove([path]);
    if (removeErr) console.warn('Gagal menghapus foto lama:', removeErr.message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true); setError('');
    try {
      let photo_url = formData.photo_url;
      let photo_storage_path = formData.photo_storage_path;
      if (photoFile) {
        const { url, path } = await uploadPhoto(photoFile);
        photo_url = url;
        photo_storage_path = path;
      }
      const { error: dbErr } = await supabase.from('interns').insert({
        name: formData.name.trim(),
        university: formData.university.trim(),
        major: formData.major.trim(),
        period: formData.period.trim(),
        location: formData.location.trim(),
        experience: formData.experience.trim(),
        photo_url,
        photo_storage_path,
        is_published: formData.is_published,
      });
      if (dbErr) throw dbErr;
      setNotice(formData.is_published
        ? 'Anak magang ditambahkan. Foto dan ceritanya langsung tampil di halaman Magang.'
        : 'Anak magang disimpan, tetapi belum ditampilkan di website.');
      resetForm();
      void load();
    } catch (err: any) { setError(err?.message || 'Gagal menyimpan data.'); }
    finally { setSaving(false); }
  };

  const handleEdit = async (e: React.FormEvent) => {
    if (!selected || !supabase) return;
    setSaving(true); setError('');
    try {
      let photo_url = selected.photo_url;
      let photo_storage_path = selected.photo_storage_path;
      const oldPath = selected.photo_storage_path;
      if (photoFile) {
        const { url, path } = await uploadPhoto(photoFile);
        photo_url = url;
        photo_storage_path = path;
      }
      const { error: dbErr } = await supabase.from('interns').update({
        name: formData.name.trim(),
        university: formData.university.trim(),
        major: formData.major.trim(),
        period: formData.period.trim(),
        location: formData.location.trim(),
        experience: formData.experience.trim(),
        photo_url,
        photo_storage_path,
        is_published: formData.is_published,
      }).eq('id', selected.id);
      if (dbErr) throw dbErr;
      if (photoFile && oldPath && oldPath !== photo_storage_path) await removePhoto(oldPath);
      setNotice('Data anak magang berhasil diperbarui.');
      resetForm();
      void load();
    } catch (err: any) { setError(err?.message || 'Gagal memperbarui data.'); }
    finally { setSaving(false); }
  };

  const togglePublish = async (intern: Intern) => {
    if (!supabase) return;
    setSaving(true); setError('');
    try {
      const { error: dbErr } = await supabase.from('interns').update({ is_published: !intern.is_published }).eq('id', intern.id);
      if (dbErr) throw dbErr;
      setInterns((prev) => prev.map((i) => i.id === intern.id ? { ...i, is_published: !i.is_published } : i));
      setNotice(intern.is_published
        ? 'Foto dan cerita disembunyikan dari halaman Magang.'
        : 'Foto dan cerita sekarang tampil di halaman Magang.');
    } catch (err: any) { setError(err?.message || 'Status belum diperbarui.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (intern: Intern) => {
    if (!window.confirm(`Hapus data ${intern.name}? Fotonya juga akan dihapus dari penyimpanan.`)) return;
    if (!supabase) return;
    setSaving(true); setError('');
    try {
      const { error: dbErr } = await supabase.from('interns').delete().eq('id', intern.id);
      if (dbErr) throw dbErr;
      await removePhoto(intern.photo_storage_path);
      setNotice(`${intern.name} berhasil dihapus.`);
      void load();
    } catch (err: any) { setError(err?.message || 'Gagal menghapus data.'); }
    finally { setSaving(false); }
  };

  const formatDate = (v: string) => {
    if (!v) return '-';
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(v));
  };

  const previewSrc = photoPreview || (!selected ? '' : (selected.photo_url || FALLBACK_PHOTO));
  const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Users className="h-5 w-5" /></div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Anak Magang &amp; Cerita Mereka</h2>
            <p className="text-xs text-slate-500">
              {interns.filter((i) => i.is_published).length} dari {interns.length} ditampilkan di halaman Magang
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/magang"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ExternalLink className="h-4 w-4" />Lihat Website
          </a>
          <button onClick={() => void load()} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <RefreshCw className="h-4 w-4" />Refresh
          </button>
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-500">
            <Plus className="h-4 w-4" />Tambah Anak Magang
          </button>
        </div>
      </div>

      <AcceptanceToggle
        page="internship"
        title="Status Penerimaan Anak Magang"
        description="Jika ditutup (misalnya kuota sudah penuh), tautan WhatsApp dan tombol lamaran magang di halaman /magang otomatis hilang. Galeri anak magang tetap tampil."
        previewHref="/magang"
      />

      {/* Petunjuk singkat */}
      <div className="rounded-2xl border border-teal-100 bg-teal-50/70 p-4 text-xs leading-relaxed text-teal-900">
        <p className="font-bold">Cara kerja:</p>
        <p className="mt-1">
          Klik <strong>Tambah Anak Magang</strong>, isi nama, foto, dan pengalaman, lalu pastikan kotak
          <strong> “Tampilkan di halaman Magang”</strong> dicentang. Setelah disimpan, foto dan ceritanya langsung
          muncul di <code>/magang</code>. Jumlah 1-3 orang tampil sejajar tanpa tombol geser; panah geser muncul otomatis mulai 4 orang.
        </p>
      </div>

      {notice && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle className="h-4 w-4 shrink-0" />{notice}
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama, universitas, atau lokasi..." className={`${inputClass} pl-10`} />
      </div>

      {/* Form tambah */}
      {showForm && !selected && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Tambah Anak Magang</h3>
            <button onClick={resetForm} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Tutup form"><X className="h-5 w-5" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Nama Anak Magang *</label>
                <input required minLength={2} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nama lengkap" className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Universitas / Sekolah *</label>
                <input required value={formData.university} onChange={(e) => setFormData({ ...formData, university: e.target.value })} placeholder="Contoh: Universitas Syiah Kuala" className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Jurusan *</label>
                <input required value={formData.major} onChange={(e) => setFormData({ ...formData, major: e.target.value })} placeholder="Contoh: Teknik Industri" className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Periode Magang *</label>
                <input required value={formData.period} onChange={(e) => setFormData({ ...formData, period: e.target.value })} placeholder="Contoh: Jan - Jun 2026" className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Lokasi / Bagian *</label>
                <input required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Contoh: Pabrik Kelapa Sawit" className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Foto Anak Magang</label>
                <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-3 text-xs font-bold transition ${photoPreview ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-slate-300 bg-slate-50 text-slate-600 hover:border-emerald-400'}`}>
                  <ImagePlus className="h-4 w-4" />
                  {photoFile ? photoFile.name : 'Pilih foto (JPG/PNG/WEBP)'}
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} className="sr-only" />
                </label>
                <p className="mt-1 text-[11px] text-slate-400">Maksimal 8 MB. Foto akan langsung tampil di carousel magang.</p>
              </div>
            </div>

            {previewSrc && (
              <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewSrc} alt="Pratinjau foto" className="h-24 w-20 rounded-lg object-cover" />
                <div className="text-xs text-slate-600">
                  <p className="font-bold text-slate-800">Pratinjau foto</p>
                  <p className="mt-1">Foto ini akan ditampilkan pada kartu anak magang di website.</p>
                </div>
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Pengalaman / Cerita Magang *</label>
              <textarea
                required minLength={10} rows={4} maxLength={3000}
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="Ceritakan apa yang dipelajari, bagian yang dikerjakan, dan kesan selama magang..."
                className={inputClass}
              />
              <p className="mt-1 text-[11px] text-slate-400">Teks ini tampil di kartu dan bisa dibaca lengkap dengan klik kartu.</p>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={formData.is_published} onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })} className="rounded border-slate-300" />
              Tampilkan foto &amp; pengalaman di halaman <strong>Magang</strong> website
            </label>

            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={saving} className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-50">
                {saving ? 'Menyimpan...' : 'Simpan & Tampilkan'}
              </button>
              <button type="button" onClick={resetForm} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Batal</button>
            </div>
          </form>
        </div>
      )}

      {/* Form edit */}
      {showForm && selected && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Edit Anak Magang</h3>
            <button onClick={resetForm} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" aria-label="Tutup form"><X className="h-5 w-5" /></button>
          </div>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Nama Anak Magang *</label>
                <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Universitas / Sekolah *</label>
                <input required value={formData.university} onChange={(e) => setFormData({ ...formData, university: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Jurusan *</label>
                <input required value={formData.major} onChange={(e) => setFormData({ ...formData, major: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Periode Magang *</label>
                <input required value={formData.period} onChange={(e) => setFormData({ ...formData, period: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Lokasi / Bagian *</label>
                <input required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Ganti Foto</label>
                <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-3 text-xs font-bold transition ${photoPreview ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-slate-300 bg-slate-50 text-slate-600 hover:border-emerald-400'}`}>
                  <Camera className="h-4 w-4" />
                  {photoFile ? photoFile.name : 'Pilih foto baru (opsional)'}
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} className="sr-only" />
                </label>
              </div>
            </div>

            {previewSrc && (
              <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewSrc} alt="Pratinjau foto" className="h-24 w-20 rounded-lg object-cover" />
                <p className="text-xs text-slate-500">{photoFile ? 'Foto baru akan mengganti foto lama.' : 'Foto saat ini.'}</p>
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">Pengalaman / Cerita Magang *</label>
              <textarea required minLength={10} rows={4} maxLength={3000} value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} className={inputClass} />
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={formData.is_published} onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })} className="rounded border-slate-300" />
              Tampilkan foto &amp; pengalaman di halaman <strong>Magang</strong> website
            </label>

            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={saving} className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-50">
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
              <button type="button" onClick={resetForm} className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Batal</button>
            </div>
          </form>
        </div>
      )}

      {/* Daftar */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-6 py-5 shadow-sm">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
            <span className="text-sm font-semibold text-slate-700">Memuat data anak magang...</span>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">Belum ada anak magang. Klik <strong>Tambah Anak Magang</strong> untuk memulai.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((intern) => (
            <div key={intern.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={intern.photo_url || FALLBACK_PHOTO}
                    alt={intern.name}
                    className="h-20 w-16 shrink-0 rounded-xl bg-slate-100 object-cover"
                    onError={(e) => { const el = e.currentTarget; if (el.src !== FALLBACK_PHOTO) el.src = FALLBACK_PHOTO; }}
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{intern.name}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${intern.is_published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {intern.is_published ? 'Tampil di website' : 'Tersembunyi'}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1"><Building2 className="h-3 w-3" />{intern.university}</span>
                      <span className="inline-flex items-center gap-1"><GraduationCap className="h-3 w-3" />{intern.major}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{intern.location}</span>
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{intern.period}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => void togglePublish(intern)} disabled={saving} className={`rounded-lg px-3 py-2 text-xs font-bold ${intern.is_published ? 'border border-emerald-200 text-emerald-700 hover:bg-emerald-50' : 'border border-slate-200 text-slate-500 hover:bg-slate-50'} disabled:opacity-50`}>
                    {intern.is_published ? <><CheckCircle className="mr-1 inline h-3 w-3" />Sembunyikan</> : <><EyeOff className="mr-1 inline h-3 w-3" />Tampilkan</>}
                  </button>
                  <button onClick={() => openEdit(intern)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">Edit</button>
                  <button onClick={() => void handleDelete(intern)} disabled={saving} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50">Hapus</button>
                </div>
              </div>
              <button onClick={() => setExpanded(expanded === intern.id ? null : intern.id)} className="mt-3 flex w-full items-center justify-between text-left text-xs text-slate-500 hover:text-slate-700">
                <span>{intern.experience.substring(0, 110)}{intern.experience.length > 110 ? '...' : ''}</span>
                {expanded === intern.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {expanded === intern.id && (
                <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{intern.experience}</p>
                  <p className="mt-2 text-xs text-slate-400">Ditambahkan: {formatDate(intern.created_at)}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
