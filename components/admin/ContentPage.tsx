'use client';

import { useEffect, useState } from 'react';
import {
  FileText, Loader2, Save, Globe, Settings, ImagePlus, Info,
  Briefcase, GraduationCap, ExternalLink, Shuffle,
} from 'lucide-react';
import { mergeSiteContent } from '@/lib/siteContent';
import AcceptanceToggle from './AcceptanceToggle';

interface ContentField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'image';
  placeholder?: string;
  rows?: number;
  hint?: string;
}

const INPUT_CLASS =
  'mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10';

const HERO_IMAGE_CHOICES = [
  '/images/internship.jpg',
  '/images/tbs-harvest.jpg',
  '/images/palm-canopy-sunset-hd.jpg',
  '/images/pks-factory-real.jpg',
  '/images/estate-road-aerial-hd.jpg',
  '/images/kegiatan/csr-betami-juli-2026.jpeg',
];

const GENERIC_FIELDS: ContentField[] = [
  { key: 'hero_title_id', label: 'Hero Title (Indonesia)', type: 'text', placeholder: 'Judul utama halaman...' },
  { key: 'hero_title_en', label: 'Hero Title (English)', type: 'text', placeholder: 'Main title in English...' },
  { key: 'hero_desc_id', label: 'Hero Description (Indonesia)', type: 'textarea', rows: 4, placeholder: 'Deskripsi halaman...' },
  { key: 'hero_desc_en', label: 'Hero Description (English)', type: 'textarea', rows: 4, placeholder: 'Description in English...' },
  { key: 'about_id', label: 'About Section (Indonesia)', type: 'textarea', rows: 6, placeholder: 'Tentang bagian...' },
  { key: 'about_en', label: 'About Section (English)', type: 'textarea', rows: 6, placeholder: 'About section in English...' },
];

const CAREER_FIELDS: ContentField[] = [
  { key: 'hero_title_id', label: 'Judul Hero (Indonesia)', type: 'text', placeholder: 'Karir di BETAMI' },
  { key: 'hero_title_en', label: 'Judul Hero (English)', type: 'text', placeholder: 'Careers at BETAMI' },
  { key: 'hero_desc_id', label: 'Deskripsi Hero (Indonesia)', type: 'textarea', rows: 3 },
  { key: 'hero_desc_en', label: 'Deskripsi Hero (English)', type: 'textarea', rows: 3 },
  {
    key: 'hero_image_url',
    label: 'Foto Latar Hero',
    type: 'image',
    placeholder: '/images/pks-factory-real.jpg',
    hint: 'Isi dengan path gambar atau URL. Tombol Acak mengambil foto dari Galeri yang sudah dipublish.',
  },
  { key: 'invite_title_id', label: 'Judul Teks Ajakan (Indonesia)', type: 'text' },
  { key: 'invite_title_en', label: 'Judul Teks Ajakan (English)', type: 'text' },
  { key: 'invite_desc_id', label: 'Teks Ajakan (Indonesia)', type: 'textarea', rows: 5 },
  { key: 'invite_desc_en', label: 'Teks Ajakan (English)', type: 'textarea', rows: 5 },
  {
    key: 'requirements_id',
    label: 'Syarat Lamaran (Indonesia)',
    type: 'textarea',
    rows: 7,
    hint: 'Satu syarat per baris. Gunakan tanda • bila ingin tampil sebagai poin.',
  },
  {
    key: 'requirements_en',
    label: 'Syarat Lamaran (English)',
    type: 'textarea',
    rows: 7,
    hint: 'Satu requirement per line.',
  },
  { key: 'cta_label_id', label: 'Label Tombol Kirim Lamaran (Indonesia)', type: 'text' },
  { key: 'cta_label_en', label: 'Label Tombol Kirim Lamaran (English)', type: 'text' },
  {
    key: 'lamaran_hero_image_url',
    label: 'Foto Hero Halaman Lamaran (/karir/lamaran)',
    type: 'image',
    placeholder: '/images/palm-canopy-sunset-hd.jpg',
    hint: 'Foto latar judul di halaman formulir lamaran. Isi path gambar atau URL, atau tekan Acak Foto.',
  },
  {
    key: 'lamaran_side_image_url',
    label: 'Foto Samping Formulir Lamaran',
    type: 'image',
    placeholder: '/images/tbs-harvest.jpg',
    hint: 'Foto di kolom kiri halaman lamaran (di atas Syarat Lamaran).',
  },
  { key: 'closed_note_id', label: 'Pesan Saat Penerimaan Ditutup (Indonesia)', type: 'textarea', rows: 4 },
  { key: 'closed_note_en', label: 'Pesan Saat Penerimaan Ditutup (English)', type: 'textarea', rows: 4 },
];

const INTERNSHIP_FIELDS: ContentField[] = [
  { key: 'hero_title_id', label: 'Judul Hero (Indonesia)', type: 'text', placeholder: 'Magang di BETAMI' },
  { key: 'hero_title_en', label: 'Judul Hero (English)', type: 'text', placeholder: 'Intern at BETAMI' },
  { key: 'hero_desc_id', label: 'Deskripsi Hero (Indonesia)', type: 'textarea', rows: 3 },
  { key: 'hero_desc_en', label: 'Deskripsi Hero (English)', type: 'textarea', rows: 3 },
  {
    key: 'hero_image_url',
    label: 'Foto Latar Hero',
    type: 'image',
    placeholder: '/images/internship.jpg',
    hint: 'Isi dengan path gambar atau URL. Tombol Acak mengambil foto dari Galeri yang sudah dipublish.',
  },
  { key: 'invite_title_id', label: 'Judul Teks Ajakan (Indonesia)', type: 'text' },
  { key: 'invite_title_en', label: 'Judul Teks Ajakan (English)', type: 'text' },
  { key: 'invite_desc_id', label: 'Teks Ajakan (Indonesia)', type: 'textarea', rows: 5 },
  { key: 'invite_desc_en', label: 'Teks Ajakan (English)', type: 'textarea', rows: 5 },
  {
    key: 'requirements_id',
    label: 'Syarat Lamaran Magang (Indonesia)',
    type: 'textarea',
    rows: 7,
    hint: 'Satu syarat per baris. Gunakan tanda • bila ingin tampil sebagai poin.',
  },
  {
    key: 'requirements_en',
    label: 'Syarat Lamaran Magang (English)',
    type: 'textarea',
    rows: 7,
    hint: 'Satu requirement per line.',
  },
  { key: 'cta_label_id', label: 'Label Tombol Lamaran (Indonesia)', type: 'text' },
  { key: 'cta_label_en', label: 'Label Tombol Lamaran (English)', type: 'text' },
  { key: 'whatsapp_text_id', label: 'Label Tombol WhatsApp Hero (Indonesia)', type: 'text' },
  { key: 'whatsapp_text_en', label: 'Label Tombol WhatsApp Hero (English)', type: 'text' },
  {
    key: 'whatsapp_url',
    label: 'Tautan WhatsApp Lamaran Magang',
    type: 'text',
    hint: 'Contoh: https://wa.me/62812xxxxxxxxx?text=Pesan%20default',
  },
  { key: 'closed_note_id', label: 'Pesan Saat Kuota Penuh / Ditutup (Indonesia)', type: 'textarea', rows: 4 },
  { key: 'closed_note_en', label: 'Pesan Saat Kuota Penuh / Ditutup (English)', type: 'textarea', rows: 4 },
];

const PREVIEW: Record<string, string> = {
  career: '/karir',
  internship: '/magang',
};

export default function ContentPage({ supabase: _supabase }: { supabase: any }) {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [content, setContent] = useState<Record<string, Record<string, string>>>(() => mergeSiteContent());
  const [randomizingField, setRandomizingField] = useState<string | null>(null);

  const tabs = [
    { key: 'home', label: 'Halaman Utama', icon: <Globe className="h-4 w-4" /> },
    { key: 'about', label: 'Tentang Kami', icon: <Info className="h-4 w-4" /> },
    { key: 'business', label: 'Bisnis', icon: <FileText className="h-4 w-4" /> },
    { key: 'sustainability', label: 'Keberlanjutan', icon: <ImagePlus className="h-4 w-4" /> },
    { key: 'contact', label: 'Kontak', icon: <Settings className="h-4 w-4" /> },
    { key: 'career', label: 'Karir', icon: <Briefcase className="h-4 w-4" /> },
    { key: 'internship', label: 'Magang', icon: <GraduationCap className="h-4 w-4" /> },
  ];

  useEffect(() => {
    let active = true;
    fetch('/api/admin/content', { cache: 'no-store' })
      .then((res) => res.json().catch(() => ({})))
      .then((json) => {
        if (active && json?.content && typeof json.content === 'object') {
          setContent(mergeSiteContent(json.content));
        }
      })
      .catch(() => { /* Biarkan field kosong bila Supabase belum terhubung. */ })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'Gagal menyimpan.');
      }
      setNotice('Konten berhasil disimpan! Perubahan langsung tampil di website.');
    } catch (err: any) {
      setError(err?.message || 'Gagal menyimpan konten.');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (section: string, key: string, value: string) => {
    setNotice('');
    setContent((prev) => ({ ...prev, [section]: { ...(prev[section] || {}), [key]: value } }));
  };

  const randomizeImage = async (section: string, key: string) => {
    const fieldId = `${section}.${key}`;
    setRandomizingField(fieldId);
    let choices = [...HERO_IMAGE_CHOICES];
    try {
      const res = await fetch('/api/gallery', { cache: 'no-store' });
      const json = await res.json().catch(() => ({}));
      const galleryUrls = Array.isArray(json?.items)
        ? json.items.map((item: any) => item?.image_url).filter(Boolean)
        : [];
      choices = Array.from(new Set([...choices, ...galleryUrls]));
    } catch {
      /* Tetap pakai pilihan bawaan bila galeri belum tersedia. */
    }
    const picked = choices[Math.floor(Math.random() * choices.length)];
    updateField(section, key, picked);
    setRandomizingField(null);
  };

  const activeFields =
    activeTab === 'career'
      ? CAREER_FIELDS
      : activeTab === 'internship'
        ? INTERNSHIP_FIELDS
        : GENERIC_FIELDS;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><FileText className="h-5 w-5" /></div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Pengelolaan Konten</h2>
            <p className="text-xs text-slate-500">
              Edit teks ajakan, syarat lamaran, dan status penerimaan Karir/Magang
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {PREVIEW[activeTab] && (
            <a
              href={PREVIEW[activeTab]}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ExternalLink className="h-4 w-4" />Lihat Halaman
            </a>
          )}
          <button onClick={() => void handleSave()} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-500 disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Menyimpan...' : 'Simpan Semua'}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              activeTab === tab.key
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-base font-bold text-slate-900">
            {tabs.find((t) => t.key === activeTab)?.label}
          </h3>
          {loading && <span className="inline-flex items-center gap-1.5 text-xs text-slate-400"><Loader2 className="h-3.5 w-3.5 animate-spin" />Memuat konten...</span>}
        </div>

        {error && <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}
        {notice && <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{notice}</p>}

        {(activeTab === 'career' || activeTab === 'internship') && (
          <div className="mb-6">
            <AcceptanceToggle
              page={activeTab}
              title={activeTab === 'career' ? 'Status Penerimaan Karyawan' : 'Status Penerimaan Anak Magang'}
              description={
                activeTab === 'career'
                  ? 'Tombol dan formulir lamaran di /karir disembunyikan saat ditutup.'
                  : 'Tautan WhatsApp dan tombol lamaran di /magang disembunyikan saat ditutup (misalnya kuota penuh).'
              }
              previewHref={PREVIEW[activeTab]}
              onChange={(value) => updateField(activeTab, 'accepting', value ? 'true' : 'false')}
            />
          </div>
        )}

        <div className="space-y-4">
          {activeFields.map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-semibold text-slate-700">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  value={content[activeTab]?.[field.key] || ''}
                  onChange={(e) => updateField(activeTab, field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={field.rows || 4}
                  className={INPUT_CLASS}
                />
              ) : field.type === 'image' ? (
                <div className="mt-1 flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    value={content[activeTab]?.[field.key] || ''}
                    onChange={(e) => updateField(activeTab, field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className={`${INPUT_CLASS} mt-0 flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() => void randomizeImage(activeTab, field.key)}
                    disabled={randomizingField === `${activeTab}.${field.key}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                  >
                    <Shuffle className="h-4 w-4" />
                    {randomizingField === `${activeTab}.${field.key}` ? 'Mengambil...' : 'Acak Foto'}
                  </button>
                </div>
              ) : (
                <input
                  type="text"
                  value={content[activeTab]?.[field.key] || ''}
                  onChange={(e) => updateField(activeTab, field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className={INPUT_CLASS}
                />
              )}
              {field.hint && <p className="mt-1 text-[11px] text-slate-500">{field.hint}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
