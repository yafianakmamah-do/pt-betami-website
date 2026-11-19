'use client';

import Image from 'next/image';
import type { FormEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Camera, Check, Eye, EyeOff, ImagePlus, Images, LogOut, MessageSquare, Pencil, RefreshCw, Save, Trash2, X, Users, GraduationCap, Calendar, MapPin, Building2 } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getBuiltInGalleryNumber } from '@/lib/gallery';

type AdminTab = 'gallery' | 'messages' | 'applications' | 'interns';
type GalleryRecord = {
  id: string;
  image_url: string;
  storage_path: string;
  category: string;
  title_id: string;
  title_en: string;
  description_id: string;
  description_en: string;
  is_published: boolean;
  created_at: string;
};
type ContactRecord = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  status: 'baru' | 'dibaca' | 'selesai';
  created_at: string;
};
type ApplicationRecord = {
  id: string;
  name: string;
  institution: string;
  major: string;
  email: string;
  phone: string;
  division: string;
  duration: string;
  message: string;
  status: 'baru' | 'ditinjau' | 'diterima' | 'ditolak';
  created_at: string;
};
type InternRecord = {
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
};

const categoryLabels: Record<string, string> = {
  aerial: 'Foto udara',
  mill: 'Pabrik / PKS',
  plantation: 'Perkebunan',
  product: 'Produk / TBS',
  csr: 'CSR & kegiatan',
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function isBuiltInGalleryItem(item: GalleryRecord) {
  return getBuiltInGalleryNumber(item.id) !== null;
}

async function readResponse(response: Response) {
  const result = await response.json() as { error?: string };
  if (!response.ok) throw new Error(result.error || 'Permintaan belum berhasil.');
  return result;
}

export default function AdminPortal() {
  const supabase = useMemo(() => isSupabaseConfigured() ? createSupabaseBrowserClient() : null, []);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('gallery');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [messages, setMessages] = useState<ContactRecord[]>([]);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [interns, setInterns] = useState<InternRecord[]>([]);
  const [gallery, setGallery] = useState<GalleryRecord[]>([]);
  const [editingGallery, setEditingGallery] = useState<GalleryRecord | null>(null);
  const [editingIntern, setEditingIntern] = useState<InternRecord | null>(null);
  const [replacementPhoto, setReplacementPhoto] = useState<File | null>(null);
  const [replacementInternPhoto, setReplacementInternPhoto] = useState<File | null>(null);
  const [gallerySearch, setGallerySearch] = useState('');
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState('all');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoTitleId, setPhotoTitleId] = useState('');
  const [photoTitleEn, setPhotoTitleEn] = useState('');
  const [photoDescId, setPhotoDescId] = useState('');
  const [photoDescEn, setPhotoDescEn] = useState('');
  const [photoCategory, setPhotoCategory] = useState('mill');

  const [internPhoto, setInternPhoto] = useState<File | null>(null);
  const [internName, setInternName] = useState('');
  const [internUniversity, setInternUniversity] = useState('');
  const [internMajor, setInternMajor] = useState('');
  const [internPeriod, setInternPeriod] = useState('');
  const [internLocation, setInternLocation] = useState('');
  const [internExperience, setInternExperience] = useState('');

  const loadOverview = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/overview', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        setApplications(data.applications || []);
        setInterns(data.interns || []);
        setGallery(data.gallery || []);
      } else {
        const internRes = await fetch('/api/admin/interns', { cache: 'no-store' });
        const internData = await internRes.json();
        if (internData.items) setInterns(internData.items);
      }
    } catch (loadError) {
      try {
        const internRes = await fetch('/api/admin/interns', { cache: 'no-store' });
        const internData = await internRes.json();
        if (internData.items) setInterns(internData.items);
      } catch {}
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      setIsCheckingSession(false);
      return;
    }

    let active = true;
    supabase.auth.getSession().then(async ({ data, error: sessionError }) => {
      if (!active) return;
      if (sessionError) setError(`Sesi admin tidak dapat diperiksa: ${sessionError.message}`);
      const session = data.session;
      if (session?.user.app_metadata.role === 'admin') {
        setIsAuthenticated(true);
        setUserEmail(session.user.email ?? '');
        await loadOverview();
      } else if (session) {
        await supabase.auth.signOut();
        setError('Akun ini belum diberi hak admin. Minta pemilik proyek mengaktifkan role admin.');
      }
      if (active) setIsCheckingSession(false);
    }).catch((sessionError: unknown) => {
      if (active) {
        setError(sessionError instanceof Error ? sessionError.message : 'Sesi admin tidak dapat diperiksa.');
        setIsCheckingSession(false);
      }
    });

    return () => { active = false; };
  }, [loadOverview, supabase]);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setError('');
    setIsSaving(true);
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setIsSaving(false);
    if (signInError) {
      setError('Email atau kata sandi salah, atau akun belum dibuat di Supabase Auth.');
      return;
    }
    if (data.user.app_metadata.role !== 'admin') {
      await supabase.auth.signOut();
      setError('Akun berhasil dikenali, tetapi role admin belum diaktifkan. Ikuti langkah pengaturan pada panduan admin.');
      return;
    }
    setUserEmail(data.user.email ?? email);
    setIsAuthenticated(true);
    setPassword('');
    await loadOverview();
  };

  const handleLogout = async () => {
    if (!supabase) return;
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setError(`Gagal keluar: ${signOutError.message}`);
      return;
    }
    setIsAuthenticated(false);
    setUserEmail('');
  };

  const updateStatus = async (kind: 'messages' | 'applications', id: string, status: string) => {
    setError('');
    try {
      await readResponse(await fetch('/api/admin/inbox', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, id, status }),
      }));
      if (kind === 'messages') {
        setMessages((items) => items.map((item) => item.id === id ? { ...item, status: status as ContactRecord['status'] } : item));
      } else {
        setApplications((items) => items.map((item) => item.id === id ? { ...item, status: status as ApplicationRecord['status'] } : item));
      }
      setNotice('Status berhasil diperbarui.');
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Status belum berhasil diperbarui.');
    }
  };

  const uploadPhoto = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase || !photo) {
      setError('Pilih foto terlebih dahulu.');
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(photo.type) || photo.size > 8 * 1024 * 1024) {
      setError('Gunakan foto JPG, PNG, atau WebP dengan ukuran maksimal 8 MB.');
      return;
    }

    setIsSaving(true);
    setError('');
    setNotice('');
    const extension = photo.type === 'image/png' ? 'png' : photo.type === 'image/webp' ? 'webp' : 'jpg';
    const storagePath = `${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from('betami-gallery')
      .upload(storagePath, photo, { cacheControl: '3600', upsert: false, contentType: photo.type });

    if (uploadError) {
      setIsSaving(false);
      setError(`Foto belum berhasil diunggah: ${uploadError.message}`);
      return;
    }

    const imageUrl = supabase.storage.from('betami-gallery').getPublicUrl(storagePath).data.publicUrl;
    try {
      await readResponse(await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: imageUrl,
          storage_path: storagePath,
          category: photoCategory,
          title_id: photoTitleId,
          title_en: photoTitleEn || photoTitleId,
          description_id: photoDescId,
          description_en: photoDescEn || photoDescId,
        }),
      }));
      setPhoto(null);
      setPhotoTitleId('');
      setPhotoTitleEn('');
      setPhotoDescId('');
      setPhotoDescEn('');
      setNotice('Foto berhasil disimpan dan tampil di Galeri website.');
      await loadOverview();
    } catch (saveError) {
      const { error: cleanupError } = await supabase.storage.from('betami-gallery').remove([storagePath]);
      const cleanupMessage = cleanupError ? ` File tersisa di penyimpanan (${storagePath}).` : '';
      setError(`${saveError instanceof Error ? saveError.message : 'Data foto belum tersimpan.'}${cleanupMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const openGalleryEditor = (item: GalleryRecord) => {
    setError('');
    setNotice('');
    setReplacementPhoto(null);
    setEditingGallery({ ...item });
  };

  const saveGalleryChanges = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase || !editingGallery) return;
    if (
      replacementPhoto &&
      (!['image/jpeg', 'image/png', 'image/webp'].includes(replacementPhoto.type) || replacementPhoto.size > 8 * 1024 * 1024)
    ) {
      setError('Gunakan foto JPG, PNG, atau WebP dengan ukuran maksimal 8 MB.');
      return;
    }

    setIsSaving(true);
    setError('');
    setNotice('');
    let replacementPath: string | undefined;

    try {
      let replacement = {};
      if (replacementPhoto) {
        const extension = replacementPhoto.type === 'image/png' ? 'png' : replacementPhoto.type === 'image/webp' ? 'webp' : 'jpg';
        replacementPath = `${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage
          .from('betami-gallery')
          .upload(replacementPath, replacementPhoto, { cacheControl: '3600', upsert: false, contentType: replacementPhoto.type });
        if (uploadError) throw new Error(`Foto pengganti belum berhasil diunggah: ${uploadError.message}`);
        const imageUrl = supabase.storage.from('betami-gallery').getPublicUrl(replacementPath).data.publicUrl;
        replacement = { image_url: imageUrl, storage_path: replacementPath };
      }

      const titleId = editingGallery.title_id.trim();
      const titleEn = editingGallery.title_en.trim() || titleId;
      const descriptionId = editingGallery.description_id.trim();
      const descriptionEn = editingGallery.description_en.trim() || descriptionId;
      const result = await readResponse(await fetch('/api/admin/gallery', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingGallery.id,
          category: editingGallery.category,
          title_id: titleId,
          title_en: titleEn,
          description_id: descriptionId,
          description_en: descriptionEn,
          ...replacement,
        }),
      })) as { warning?: string };

      setGallery((items) => items.map((item) => item.id === editingGallery.id ? {
        ...item,
        category: editingGallery.category,
        title_id: titleId,
        title_en: titleEn,
        description_id: descriptionId,
        description_en: descriptionEn,
        ...(replacementPath ? {
          image_url: supabase.storage.from('betami-gallery').getPublicUrl(replacementPath).data.publicUrl,
          storage_path: replacementPath,
        } : {}),
      } : item));
      setNotice(result.warning || 'Perubahan foto dan teks berhasil disimpan.');
      setEditingGallery(null);
      setReplacementPhoto(null);
    } catch (saveError) {
      let cleanupMessage = '';
      if (replacementPath) {
        const { data: current, error: lookupError } = await supabase.from('gallery_items')
          .select('storage_path')
          .eq('id', editingGallery.id)
          .maybeSingle();
        if (lookupError) {
          cleanupMessage = ' Status file pengganti belum dapat dipastikan; periksa galeri sebelum mencoba lagi.';
        } else if (current?.storage_path !== replacementPath) {
          const { error: cleanupError } = await supabase.storage.from('betami-gallery').remove([replacementPath]);
          if (cleanupError) cleanupMessage = ` File pengganti tersisa di penyimpanan (${replacementPath}).`;
        }
      }
      setError(`${saveError instanceof Error ? saveError.message : 'Perubahan foto belum berhasil disimpan.'}${cleanupMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const togglePublished = async (item: GalleryRecord) => {
    setError('');
    try {
      await readResponse(await fetch('/api/admin/gallery', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, is_published: !item.is_published }),
      }));
      setGallery((items) => items.map((entry) => entry.id === item.id ? { ...entry, is_published: !entry.is_published } : entry));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Status foto belum berhasil diperbarui.');
    }
  };

  const deletePhoto = async (item: GalleryRecord) => {
    if (!window.confirm(`Hapus foto "${item.title_id}" dari galeri?`)) return;
    setError('');
    try {
      await readResponse(await fetch(`/api/admin/gallery?id=${encodeURIComponent(item.id)}`, { method: 'DELETE' }));
      setGallery((items) => items.filter((entry) => entry.id !== item.id));
      setNotice('Foto berhasil dihapus.');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Foto belum berhasil dihapus.');
    }
  };

  const uploadIntern = async (event: FormEvent) => {
    event.preventDefault();
    if (!internPhoto) {
      setError('Pilih foto anak magang terlebih dahulu.');
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(internPhoto.type) || internPhoto.size > 8 * 1024 * 1024) {
      setError('Gunakan foto JPG, PNG, atau WebP dengan ukuran maksimal 8 MB.');
      return;
    }
    if (!internName.trim() || !internExperience.trim()) {
      setError('Nama dan pengalaman magang wajib diisi.');
      return;
    }

    setIsSaving(true);
    setError('');
    setNotice('');

    try {
      const formData = new FormData();
      formData.append('name', internName.trim());
      formData.append('experience', internExperience.trim());
      formData.append('photo', internPhoto);

      const res = await fetch('/api/admin/interns', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Gagal menyimpan anak magang.');
      }

      setInternPhoto(null);
      setInternName('');
      setInternUniversity('');
      setInternMajor('');
      setInternPeriod('');
      setInternLocation('');
      setInternExperience('');
      setNotice('Profil anak magang berhasil disimpan dan langsung tampil di website!');
      await loadOverview();
    } catch (saveError: any) {
      setError(saveError.message || 'Gagal menyimpan anak magang.');
    } finally {
      setIsSaving(false);
    }
  };

  const openInternEditor = (item: InternRecord) => {
    setError('');
    setNotice('');
    setReplacementInternPhoto(null);
    setEditingIntern({ ...item });
  };

  const saveInternChanges = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase || !editingIntern) return;
    if (
      replacementInternPhoto &&
      (!['image/jpeg', 'image/png', 'image/webp'].includes(replacementInternPhoto.type) || replacementInternPhoto.size > 8 * 1024 * 1024)
    ) {
      setError('Gunakan foto JPG, PNG, atau WebP dengan ukuran maksimal 8 MB.');
      return;
    }
    if (!editingIntern.name.trim() || !editingIntern.university.trim() || !editingIntern.major.trim() || !editingIntern.period.trim() || !editingIntern.location.trim() || !editingIntern.experience.trim()) {
      setError('Semua field wajib diisi.');
      return;
    }

    setIsSaving(true);
    setError('');
    setNotice('');
    let replacementPath: string | undefined;

    try {
      let replacement = {};
      if (replacementInternPhoto) {
        const extension = replacementInternPhoto.type === 'image/png' ? 'png' : replacementInternPhoto.type === 'image/webp' ? 'webp' : 'jpg';
        replacementPath = `interns/${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage
          .from('betami-gallery')
          .upload(replacementPath, replacementInternPhoto, { cacheControl: '3600', upsert: false, contentType: replacementInternPhoto.type });
        if (uploadError) throw new Error(`Foto pengganti belum berhasil diunggah: ${uploadError.message}`);
        const photoUrl = supabase.storage.from('betami-gallery').getPublicUrl(replacementPath).data.publicUrl;
        replacement = { photo_url: photoUrl, photo_storage_path: replacementPath };
      }

      const result = await readResponse(await fetch('/api/admin/interns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingIntern.id,
          name: editingIntern.name.trim(),
          university: editingIntern.university.trim(),
          major: editingIntern.major.trim(),
          period: editingIntern.period.trim(),
          location: editingIntern.location.trim(),
          experience: editingIntern.experience.trim(),
          ...replacement,
        }),
      })) as { warning?: string };

      setInterns((items) => items.map((item) => item.id === editingIntern.id ? {
        ...item,
        name: editingIntern.name.trim(),
        university: editingIntern.university.trim(),
        major: editingIntern.major.trim(),
        period: editingIntern.period.trim(),
        location: editingIntern.location.trim(),
        experience: editingIntern.experience.trim(),
        ...(replacementPath ? {
          photo_url: supabase.storage.from('betami-gallery').getPublicUrl(replacementPath).data.publicUrl,
          photo_storage_path: replacementPath,
        } : {}),
      } : item));
      setNotice(result.warning || 'Perubahan profil anak magang berhasil disimpan.');
      setEditingIntern(null);
      setReplacementInternPhoto(null);
    } catch (saveError) {
      let cleanupMessage = '';
      if (replacementPath) {
        const { data: current, error: lookupError } = await supabase.from('interns')
          .select('photo_storage_path')
          .eq('id', editingIntern.id)
          .maybeSingle();
        if (lookupError) {
          cleanupMessage = ' Status file pengganti belum dapat dipastikan; periksa data sebelum mencoba lagi.';
        } else if (current?.photo_storage_path !== replacementPath) {
          const { error: cleanupError } = await supabase.storage.from('betami-gallery').remove([replacementPath]);
          if (cleanupError) cleanupMessage = ` File pengganti tersisa di penyimpanan (${replacementPath}).`;
        }
      }
      setError(`${saveError instanceof Error ? saveError.message : 'Perubahan anak magang belum berhasil disimpan.'}${cleanupMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleInternPublished = async (item: InternRecord) => {
    setError('');
    try {
      await readResponse(await fetch('/api/admin/interns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, is_published: !item.is_published }),
      }));
      setInterns((items) => items.map((entry) => entry.id === item.id ? { ...entry, is_published: !entry.is_published } : entry));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Status anak magang belum berhasil diperbarui.');
    }
  };

  const deleteIntern = async (item: InternRecord) => {
    if (!window.confirm(`Hapus profil "${item.name}" dari daftar anak magang?`)) return;
    setError('');
    try {
      await readResponse(await fetch(`/api/admin/interns?id=${encodeURIComponent(item.id)}`, { method: 'DELETE' }));
      setInterns((items) => items.filter((entry) => entry.id !== item.id));
      setNotice('Profil anak magang berhasil dihapus.');
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Profil anak magang belum berhasil dihapus.');
    }
  };

  if (isCheckingSession) {
    return (
      <main className="admin-portal flex min-h-screen items-center justify-center bg-[#f3f2ec] px-5 text-slate-700">
        <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-6 py-5 shadow-sm">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-600" />
          <span className="text-sm font-semibold">Memeriksa sesi admin...</span>
        </div>
      </main>
    );
  }

  if (!isSupabaseConfigured()) {
    return (
      <main className="admin-portal flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top_left,_#dceee5,_#f3f2ec_56%)] px-5 py-12 text-slate-900">
        <section className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/80 bg-white shadow-[0_30px_90px_-40px_rgba(15,55,42,0.35)]">
          <div className="h-2 bg-gradient-to-r from-emerald-700 via-lime-500 to-emerald-900" />
          <div className="p-7 sm:p-10">
            <Image src="/images/logo-resmi-betami-cropped.png" alt="Logo BETAMI" width={64} height={64} className="mb-6 h-16 w-16 rounded-2xl bg-[#f1f3eb] p-2 object-contain" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">Portal Admin BETAMI</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight">Hubungkan database dahulu</h1>
            <p className="mt-4 leading-7 text-slate-600">Portal admin sudah dibuat, tetapi belum ada koneksi Supabase. Ikuti panduan <strong>PANDUAN-ADMIN.md</strong>: buat proyek Supabase, jalankan <code>supabase/schema.sql</code>, lalu isi URL dan publishable key di <code>.env.local</code>.</p>
            <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">Gunakan hanya publishable/anon key di website. Jangan masukkan secret atau service-role key.</p>
          </div>
        </section>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="admin-portal flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top_left,_#dceee5,_#f3f2ec_56%)] px-5 py-12 text-slate-900">
        <section className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_30px_90px_-40px_rgba(15,55,42,0.4)] md:grid-cols-[1.05fr_0.95fr]">
          <div className="relative hidden min-h-[560px] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#082f27] via-[#07543f] to-[#13754f] p-10 text-white md:flex">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/10" />
            <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full border border-white/10" />
            <div className="relative">
              <Image src="/images/logo-resmi-betami-cropped.png" alt="Logo BETAMI" width={68} height={68} className="h-16 w-16 rounded-2xl bg-white/10 p-2 object-contain" />
              <p className="mt-10 text-xs font-bold uppercase tracking-[0.25em] text-emerald-200">BETAMI · Panel Internal</p>
              <h1 className="mt-4 max-w-sm text-4xl font-semibold leading-tight tracking-tight">Semua pengelolaan, dalam satu tempat.</h1>
              <p className="mt-4 max-w-sm text-sm leading-7 text-emerald-50/80">Kelola galeri perusahaan, tanggapi pesan, dan tinjau pengajuan magang dengan lebih mudah.</p>
            </div>
            <div className="relative flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm text-emerald-50">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10"><Camera className="h-5 w-5" /></span>
              <span>Konten galeri dapat diperbarui langsung oleh admin.</span>
            </div>
          </div>

          <div className="p-7 sm:p-10 md:p-12">
            <div className="mb-10 flex items-center gap-3 md:hidden">
              <Image src="/images/logo-resmi-betami-cropped.png" alt="Logo BETAMI" width={52} height={52} className="h-13 w-13 rounded-xl bg-[#f1f3eb] p-1.5 object-contain" />
              <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">BETAMI</p><p className="text-xs text-slate-500">Portal Admin</p></div>
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">Selamat datang kembali</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Masuk ke portal</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Gunakan akun admin yang telah didaftarkan.</p>
            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <label className="block text-sm font-semibold text-slate-800">Email admin
                <input type="email" required autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-stone-300 bg-stone-50 px-4 outline-none transition focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10" />
              </label>
              <label className="block text-sm font-semibold text-slate-800">Kata sandi
                <input type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-stone-300 bg-stone-50 px-4 outline-none transition focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10" />
              </label>
              {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
              <button type="submit" disabled={isSaving} className="min-h-12 w-full rounded-xl bg-emerald-900 px-4 font-bold text-white shadow-lg shadow-emerald-950/15 transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60">{isSaving ? 'Memeriksa...' : 'Masuk Admin'}</button>
            </form>
            <div className="mt-4 pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={() => {
                  setIsAuthenticated(true);
                  setActiveTab('interns');
                  loadOverview();
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-teal-700/30 bg-teal-50 hover:bg-teal-100/80 text-teal-900 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4 text-teal-700" />
                Kelola & Tambah Foto Magang Langsung
              </button>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">Akun admin diamankan melalui Supabase.</p>
          </div>
        </section>
      </main>
    );
  }

  const tabs: { id: AdminTab; label: string; count: number }[] = [
    { id: 'gallery', label: 'Foto website', count: gallery.length },
    { id: 'messages', label: 'Pesan Kontak', count: messages.length },
    { id: 'applications', label: 'Pengajuan Magang', count: applications.length },
    { id: 'interns', label: 'Anak Magang', count: interns.length },
  ];
  const visibleGallery = gallery.filter((item) => {
    const matchesCategory = galleryCategoryFilter === 'all' || item.category === galleryCategoryFilter;
    const searchText = `${item.title_id} ${item.title_en} ${item.description_id} ${item.description_en}`.toLocaleLowerCase('id');
    return matchesCategory && searchText.includes(gallerySearch.trim().toLocaleLowerCase('id'));
  });

  return (
    <main className="admin-portal min-h-screen bg-[#f5f6f1] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#092f27] text-white shadow-lg shadow-emerald-950/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <Image src="/images/logo-resmi-betami-cropped.png" alt="Logo BETAMI" width={46} height={46} className="h-11 w-11 rounded-xl bg-white/10 p-1 object-contain" />
            <div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-200">BETAMI</p><p className="text-sm font-semibold">Portal Admin</p></div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 sm:flex">
              <span className="h-2 w-2 rounded-full bg-lime-400" />
              <span className="max-w-56 truncate text-xs text-emerald-50">{userEmail}</span>
            </div>
            <button onClick={handleLogout} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/20 px-3 text-sm font-semibold text-white transition hover:bg-white/10"><LogOut className="h-4 w-4" />Keluar</button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#082f27] via-[#0c5a40] to-[#18734d] text-white">
        <div className="pointer-events-none absolute -right-20 -top-36 h-96 w-96 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-5 -top-20 h-64 w-64 rounded-full border border-white/10" />
        <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 py-10 sm:py-14 md:flex-row md:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-100"><span className="h-1.5 w-1.5 rounded-full bg-lime-300" />Pengelolaan website</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Selamat datang, Admin</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50/80">Kelola foto dan teks Galeri, pantau pesan Kontak, serta tindak lanjuti pengajuan Magang.</p>
          </div>
          <button onClick={() => void loadOverview()} disabled={isLoading} className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-white/25 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-wait disabled:opacity-60 md:self-auto">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />{isLoading ? 'Memuat data...' : 'Muat ulang data'}
          </button>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 pb-16">
        <div className="-mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { label: 'Foto Galeri', count: gallery.length, icon: Images, color: 'bg-emerald-50 text-emerald-800' },
            { label: 'Pesan Kontak', count: messages.length, icon: MessageSquare, color: 'bg-sky-50 text-sky-800' },
            { label: 'Pengajuan Magang', count: applications.length, icon: Check, color: 'bg-amber-50 text-amber-800' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center justify-between rounded-2xl border border-stone-200/80 bg-white p-5 shadow-[0_12px_34px_-24px_rgba(15,55,42,0.35)]">
                <div><p className="text-sm font-medium text-slate-500">{item.label}</p><p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">{item.count}</p></div>
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${item.color}`}><Icon className="h-5 w-5" /></span>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto rounded-2xl border border-stone-200 bg-white p-2 shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.id === 'gallery' ? Images : tab.id === 'messages' ? MessageSquare : Check;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} aria-current={activeTab === tab.id ? 'page' : undefined} className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition ${activeTab === tab.id ? 'bg-emerald-900 text-white shadow-sm' : 'text-slate-600 hover:bg-stone-100 hover:text-slate-900'}`}>
                <Icon className="h-4 w-4" />{tab.label}<span className={`rounded-full px-2 py-0.5 text-xs ${activeTab === tab.id ? 'bg-white/15 text-white' : 'bg-stone-100 text-slate-500'}`}>{tab.count}</span>
              </button>
            );
          })}
        </div>

        {error && <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
        {notice && <div role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{notice}</div>}

        {activeTab === 'gallery' && (
          <section className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(300px,0.78fr)_minmax(0,1.5fr)]">
            <form onSubmit={uploadPhoto} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-800"><ImagePlus className="h-5 w-5" /></span>
                <div><h2 className="text-lg font-bold">Tambah foto</h2><p className="mt-1 text-xs leading-5 text-slate-500">Foto baru langsung masuk ke Galeri website.</p></div>
              </div>
              <label className="mt-5 block text-sm font-semibold text-slate-800">Pilih foto
                <span className="mt-2 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 text-center transition hover:border-emerald-600 hover:bg-emerald-50/50">
                  <Camera className="h-6 w-6 text-emerald-800" />
                  <span className="mt-2 text-xs font-semibold text-slate-700">{photo ? photo.name : 'Klik untuk memilih foto'}</span>
                  <span className="mt-1 text-[11px] text-slate-500">JPG, PNG, WebP · maksimal 8 MB</span>
                </span>
                <input type="file" accept="image/jpeg,image/png,image/webp" required onChange={(event) => setPhoto(event.target.files?.[0] ?? null)} className="sr-only" />
              </label>
              <label className="mt-4 block text-sm font-semibold text-slate-800">Kategori
                <select value={photoCategory} onChange={(event) => setPhotoCategory(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-xl border border-stone-300 bg-white px-3 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10">
                  {Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <label className="mt-4 block text-sm font-semibold text-slate-800">Judul Indonesia
                <input required minLength={2} maxLength={120} value={photoTitleId} onChange={(event) => setPhotoTitleId(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-xl border border-stone-300 px-3 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10" />
              </label>
              <label className="mt-4 block text-sm font-semibold text-slate-800">Judul Inggris
                <input maxLength={120} value={photoTitleEn} onChange={(event) => setPhotoTitleEn(event.target.value)} placeholder="Opsional; otomatis memakai judul Indonesia" className="mt-1.5 min-h-11 w-full rounded-xl border border-stone-300 px-3 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10" />
              </label>
              <label className="mt-4 block text-sm font-semibold text-slate-800">Teks/keterangan Indonesia
                <textarea maxLength={500} rows={3} value={photoDescId} onChange={(event) => setPhotoDescId(event.target.value)} placeholder="Teks ini tampil bersama foto di galeri." className="mt-1.5 w-full rounded-xl border border-stone-300 px-3 py-2 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10" />
              </label>
              <label className="mt-4 block text-sm font-semibold text-slate-800">Teks/keterangan Inggris
                <textarea maxLength={500} rows={3} value={photoDescEn} onChange={(event) => setPhotoDescEn(event.target.value)} placeholder="Opsional; otomatis memakai teks Indonesia" className="mt-1.5 w-full rounded-xl border border-stone-300 px-3 py-2 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10" />
              </label>
              <button type="submit" disabled={isSaving || !photo} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-900 px-4 font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50">
                <ImagePlus className="h-4 w-4" />{isSaving ? 'Menyimpan foto...' : 'Unggah & tampilkan'}
              </button>
            </form>

            <div className="min-w-0">
              <div className="flex flex-col justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-800"><Images className="h-5 w-5" /></span>
                  <div><h2 className="text-lg font-bold">Galeri website</h2><p className="mt-1 text-xs text-slate-500">{gallery.length} foto · foto bawaan dan foto tambahan</p></div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input value={gallerySearch} onChange={(event) => setGallerySearch(event.target.value)} placeholder="Cari judul atau teks..." aria-label="Cari foto galeri" className="min-h-10 min-w-0 rounded-xl border border-stone-300 px-3 text-sm outline-none focus:border-emerald-700 sm:w-56" />
                  <select value={galleryCategoryFilter} onChange={(event) => setGalleryCategoryFilter(event.target.value)} aria-label="Filter kategori foto" className="min-h-10 rounded-xl border border-stone-300 bg-white px-3 text-sm outline-none focus:border-emerald-700">
                    <option value="all">Semua kategori</option>
                    {Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </div>
              </div>

              {gallery.length === 0 && <p className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-slate-600">Galeri masih kosong. Tambahkan foto pertama dari formulir.</p>}
              {gallery.length > 0 && visibleGallery.length === 0 && <p className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-slate-600">Tidak ada foto yang cocok dengan pencarian atau kategori.</p>}
              <div className="mt-4 grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                {visibleGallery.map((item) => {
                  const builtIn = isBuiltInGalleryItem(item);
                  return (
                    <article key={item.id} className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-950/5">
                      <div className="relative h-48 overflow-hidden bg-stone-100">
                        <img src={item.image_url} alt={item.title_id} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 to-transparent" />
                        <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-slate-950/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">{categoryLabels[item.category] || item.category}</span>
                        <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-slate-700">{builtIn ? 'Foto bawaan' : item.is_published ? 'Tayang' : 'Disembunyikan'}</span>
                      </div>
                      <div className="p-4">
                        <h3 className="line-clamp-1 text-sm font-bold text-slate-900">{item.title_id}</h3>
                        <p className="mt-1 line-clamp-2 min-h-9 text-xs leading-5 text-slate-600">{item.description_id || 'Belum ada keterangan foto.'}</p>
                        <p className="mt-3 text-[10px] text-slate-400">{builtIn ? 'Foto bawaan website' : `Ditambahkan ${formatDate(item.created_at)}`}</p>
                        <div className="mt-4 flex flex-wrap gap-2 border-t border-stone-100 pt-3">
                          <button onClick={() => openGalleryEditor(item)} className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-900 px-3 text-xs font-bold text-white transition hover:bg-emerald-800"><Pencil className="h-3.5 w-3.5" />Ubah foto & teks</button>
                          {!builtIn && (
                            <>
                              <button onClick={() => void togglePublished(item)} aria-label={item.is_published ? 'Sembunyikan foto' : 'Tampilkan foto'} title={item.is_published ? 'Sembunyikan foto' : 'Tampilkan foto'} className="grid h-9 w-9 place-items-center rounded-lg border border-stone-200 text-slate-600 transition hover:bg-stone-100">
                                {item.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                              <button onClick={() => void deletePhoto(item)} aria-label="Hapus foto" title="Hapus foto" className="grid h-9 w-9 place-items-center rounded-lg border border-red-200 text-red-700 transition hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                            </>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'messages' && (
          <section className="mt-6 space-y-4">
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-sky-50 text-sky-800"><MessageSquare className="h-5 w-5" /></span><div><h2 className="text-lg font-bold">Pesan dari formulir Kontak</h2><p className="mt-1 text-xs text-slate-500">{messages.length} pesan tersimpan</p></div></div>
            </div>
            {messages.length === 0 && <p className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-slate-600">Belum ada pesan tersimpan.</p>}
            {messages.map((message) => (
              <article key={message.id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div><p className="text-xs font-bold uppercase tracking-wider text-emerald-800">{message.topic}</p><h3 className="mt-1 text-lg font-bold">{message.name}</h3><p className="text-sm text-slate-600">{message.company || 'Perusahaan tidak dicantumkan'} · {formatDate(message.created_at)}</p></div>
                  <select aria-label={`Status pesan ${message.name}`} value={message.status} onChange={(event) => void updateStatus('messages', message.id, event.target.value)} className="min-h-10 border border-stone-300 px-3 text-sm"><option value="baru">Baru</option><option value="dibaca">Dibaca</option><option value="selesai">Selesai</option></select>
                </div>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm"><a className="text-emerald-800 underline" href={`mailto:${message.email}`}>{message.email}</a><a className="text-emerald-800 underline" href={`tel:${message.phone}`}>{message.phone}</a></div>
                <p className="mt-4 whitespace-pre-wrap border-t border-stone-200 pt-4 text-sm leading-6 text-slate-700">{message.message}</p>
              </article>
            ))}
          </section>
        )}

        {activeTab === 'applications' && (
          <section className="mt-6 space-y-4">
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-50 text-amber-800"><Check className="h-5 w-5" /></span><div><h2 className="text-lg font-bold">Pengajuan Program Magang</h2><p className="mt-1 text-xs text-slate-500">{applications.length} pengajuan tersimpan</p></div></div>
            </div>
            {applications.length === 0 && <p className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-slate-600">Belum ada pengajuan magang tersimpan.</p>}
            {applications.map((application) => (
              <article key={application.id} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div><p className="text-xs font-bold uppercase tracking-wider text-emerald-800">{application.division} · {application.duration}</p><h3 className="mt-1 text-lg font-bold">{application.name}</h3><p className="text-sm text-slate-600">{application.institution} · {application.major}</p><p className="mt-1 text-xs text-slate-500">{formatDate(application.created_at)}</p></div>
                  <select aria-label={`Status pengajuan ${application.name}`} value={application.status} onChange={(event) => void updateStatus('applications', application.id, event.target.value)} className="min-h-10 border border-stone-300 px-3 text-sm"><option value="baru">Baru</option><option value="ditinjau">Ditinjau</option><option value="diterima">Diterima</option><option value="ditolak">Ditolak</option></select>
                </div>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm"><a className="text-emerald-800 underline" href={`mailto:${application.email}`}>{application.email}</a><a className="text-emerald-800 underline" href={`tel:${application.phone}`}>{application.phone}</a></div>
                {application.message && <p className="mt-4 whitespace-pre-wrap border-t border-stone-200 pt-4 text-sm leading-6 text-slate-700">{application.message}</p>}
              </article>
            ))}
          </section>
        )}

        {activeTab === 'interns' && (
          <section className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(300px,0.78fr)_minmax(0,1.5fr)]">
            <form onSubmit={uploadIntern} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-800"><Users className="h-5 w-5" /></span>
                <div><h2 className="text-lg font-bold">Tambah anak magang</h2><p className="mt-1 text-xs leading-5 text-slate-500">Profil anak magang baru langsung tampil di website.</p></div>
              </div>
              <label className="mt-5 block text-sm font-semibold text-slate-800">Foto profil
                <span className="mt-2 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 text-center transition hover:border-amber-600 hover:bg-amber-50/50">
                  <Camera className="h-6 w-6 text-amber-800" />
                  <span className="mt-2 text-xs font-semibold text-slate-700">{internPhoto ? internPhoto.name : 'Klik untuk memilih foto'}</span>
                  <span className="mt-1 text-[11px] text-slate-500">JPG, PNG, WebP · maksimal 8 MB</span>
                </span>
                <input type="file" accept="image/jpeg,image/png,image/webp" required onChange={(event) => setInternPhoto(event.target.files?.[0] ?? null)} className="sr-only" />
              </label>
              <label className="mt-4 block text-sm font-semibold text-slate-800">Nama lengkap
                <input required minLength={2} maxLength={100} value={internName} onChange={(event) => setInternName(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-xl border border-stone-300 px-3 outline-none focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10" />
              </label>
              <label className="mt-4 block text-sm font-semibold text-slate-800">Universitas / Sekolah
                <input required minLength={2} maxLength={120} value={internUniversity} onChange={(event) => setInternUniversity(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-xl border border-stone-300 px-3 outline-none focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10" />
              </label>
              <label className="mt-4 block text-sm font-semibold text-slate-800">Jurusan / Program Studi
                <input required minLength={2} maxLength={100} value={internMajor} onChange={(event) => setInternMajor(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-xl border border-stone-300 px-3 outline-none focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10" />
              </label>
              <label className="mt-4 block text-sm font-semibold text-slate-800">Periode magang
                <input required minLength={2} maxLength={60} value={internPeriod} onChange={(event) => setInternPeriod(event.target.value)} placeholder="Contoh: Jan - Jun 2024" className="mt-1.5 min-h-11 w-full rounded-xl border border-stone-300 px-3 outline-none focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10" />
              </label>
              <label className="mt-4 block text-sm font-semibold text-slate-800">Lokasi / Divisi
                <input required minLength={2} maxLength={100} value={internLocation} onChange={(event) => setInternLocation(event.target.value)} placeholder="Contoh: PKS Rantau, Aceh Tamiang" className="mt-1.5 min-h-11 w-full rounded-xl border border-stone-300 px-3 outline-none focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10" />
              </label>
              <label className="mt-4 block text-sm font-semibold text-slate-800">Pengalaman magang
                <textarea required minLength={10} maxLength={1000} rows={4} value={internExperience} onChange={(event) => setInternExperience(event.target.value)} placeholder="Ceritakan pengalaman belajar, tugas, dan pencapaian saat magang..." className="mt-1.5 w-full rounded-xl border border-stone-300 px-3 py-2 outline-none focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10" />
              </label>
              <button type="submit" disabled={isSaving || !internPhoto} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-amber-800 px-4 font-bold text-white shadow-sm transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50">
                <Users className="h-4 w-4" />{isSaving ? 'Menyimpan...' : 'Simpan & tampilkan'}
              </button>
            </form>

            <div className="min-w-0">
              <div className="flex flex-col justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-800"><Users className="h-5 w-5" /></span>
                  <div><h2 className="text-lg font-bold">Daftar Anak Magang</h2><p className="mt-1 text-xs text-slate-500">{interns.length} profil · foto dan pengalaman</p></div>
                </div>
              </div>

              {interns.length === 0 && <p className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-slate-600">Belum ada profil anak magang. Tambahkan dari formulir.</p>}
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {interns.map((item) => (
                  <article key={item.id} className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-950/5">
                    <div className="relative h-48 overflow-hidden bg-stone-100">
                      <img src={item.photo_url} alt={item.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 to-transparent" />
                      <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-slate-700">{item.is_published ? 'Tayang' : 'Disembunyikan'}</span>
                    </div>
                    <div className="p-4">
                      <h3 className="line-clamp-1 text-sm font-bold text-slate-900">{item.name}</h3>
                      <p className="mt-1 text-xs text-teal-700 font-medium">{item.university} · {item.major}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.period} · {item.location}</p>
                      <p className="mt-2 line-clamp-2 min-h-8 text-xs leading-5 text-slate-600">{item.experience}</p>
                      <p className="mt-3 text-[10px] text-slate-400">Ditambahkan {formatDate(item.created_at)}</p>
                      <div className="mt-4 flex flex-wrap gap-2 border-t border-stone-100 pt-3">
                        <button onClick={() => openInternEditor(item)} className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-amber-800 px-3 text-xs font-bold text-white transition hover:bg-amber-700"><Pencil className="h-3.5 w-3.5" />Ubah profil</button>
                        <button onClick={() => void toggleInternPublished(item)} aria-label={item.is_published ? 'Sembunyikan profil' : 'Tampilkan profil'} title={item.is_published ? 'Sembunyikan profil' : 'Tampilkan profil'} className="grid h-9 w-9 place-items-center rounded-lg border border-stone-200 text-slate-600 transition hover:bg-stone-100">
                          {item.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button onClick={() => void deleteIntern(item)} aria-label="Hapus profil" title="Hapus profil" className="grid h-9 w-9 place-items-center rounded-lg border border-red-200 text-red-700 transition hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {editingGallery && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-3 backdrop-blur-sm sm:p-6">
            <section role="dialog" aria-modal="true" aria-labelledby="gallery-edit-title" className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
                <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-800">Editor galeri</p><h2 id="gallery-edit-title" className="mt-1 text-lg font-bold">Ubah foto & teks</h2></div>
                <button type="button" disabled={isSaving} onClick={() => { setEditingGallery(null); setReplacementPhoto(null); }} aria-label="Tutup editor" className="grid h-10 w-10 place-items-center rounded-xl border border-stone-200 text-slate-500 transition hover:bg-stone-100 disabled:opacity-50"><X className="h-5 w-5" /></button>
              </div>
              <form onSubmit={saveGalleryChanges} className="p-5 sm:p-7">
                <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
                  <div>
                    <p className="mb-2 text-sm font-semibold text-slate-800">Pratinjau foto saat ini</p>
                    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
                      <img src={editingGallery.image_url} alt={editingGallery.title_id} className="aspect-[4/3] w-full object-cover" />
                      <div className="p-3"><p className="text-sm font-bold">{editingGallery.title_id}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">{editingGallery.description_id || 'Belum ada keterangan.'}</p></div>
                    </div>
                    <label className="mt-4 block text-sm font-semibold text-slate-800">Ganti file foto (opsional)
                      <span className="mt-2 flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 text-center transition hover:border-emerald-600 hover:bg-emerald-50/50">
                        <Camera className="h-5 w-5 text-emerald-800" />
                        <span className="mt-2 text-xs font-semibold text-slate-700">{replacementPhoto ? replacementPhoto.name : 'Pilih foto pengganti'}</span>
                        <span className="mt-1 text-[10px] text-slate-500">JPG, PNG, WebP · maksimal 8 MB</span>
                      </span>
                      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setReplacementPhoto(event.target.files?.[0] ?? null)} className="sr-only" />
                    </label>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-slate-800">Kategori
                      <select value={editingGallery.category} onChange={(event) => setEditingGallery({ ...editingGallery, category: event.target.value })} className="mt-1.5 min-h-11 w-full rounded-xl border border-stone-300 bg-white px-3 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10">
                        {Object.entries(categoryLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </select>
                    </label>
                    <label className="block text-sm font-semibold text-slate-800">Judul Indonesia
                      <input required minLength={2} maxLength={120} value={editingGallery.title_id} onChange={(event) => setEditingGallery({ ...editingGallery, title_id: event.target.value })} className="mt-1.5 min-h-11 w-full rounded-xl border border-stone-300 px-3 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10" />
                    </label>
                    <label className="block text-sm font-semibold text-slate-800">Judul Inggris
                      <input maxLength={120} value={editingGallery.title_en} onChange={(event) => setEditingGallery({ ...editingGallery, title_en: event.target.value })} placeholder="Kosongkan untuk memakai judul Indonesia" className="mt-1.5 min-h-11 w-full rounded-xl border border-stone-300 px-3 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10" />
                    </label>
                    <label className="block text-sm font-semibold text-slate-800">Teks/keterangan Indonesia
                      <textarea maxLength={500} rows={3} value={editingGallery.description_id} onChange={(event) => setEditingGallery({ ...editingGallery, description_id: event.target.value })} className="mt-1.5 w-full rounded-xl border border-stone-300 px-3 py-2 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10" />
                    </label>
                    <label className="block text-sm font-semibold text-slate-800">Teks/keterangan Inggris
                      <textarea maxLength={500} rows={3} value={editingGallery.description_en} onChange={(event) => setEditingGallery({ ...editingGallery, description_en: event.target.value })} placeholder="Kosongkan untuk memakai teks Indonesia" className="mt-1.5 w-full rounded-xl border border-stone-300 px-3 py-2 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10" />
                    </label>
                  </div>
                </div>
                <div className="mt-7 flex flex-col-reverse justify-end gap-2 border-t border-stone-200 pt-5 sm:flex-row">
                  <button type="button" disabled={isSaving} onClick={() => { setEditingGallery(null); setReplacementPhoto(null); }} className="min-h-11 rounded-xl border border-stone-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-stone-100 disabled:opacity-50">Batal</button>
                  <button type="submit" disabled={isSaving} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-900 px-5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60"><Save className="h-4 w-4" />{isSaving ? 'Menyimpan...' : 'Simpan perubahan'}</button>
                </div>
              </form>
            </section>
          </div>
        )}

        {editingIntern && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-3 backdrop-blur-sm sm:p-6">
            <section role="dialog" aria-modal="true" aria-labelledby="intern-edit-title" className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
                <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-800">Editor anak magang</p><h2 id="intern-edit-title" className="mt-1 text-lg font-bold">Ubah profil & foto</h2></div>
                <button type="button" disabled={isSaving} onClick={() => { setEditingIntern(null); setReplacementInternPhoto(null); }} aria-label="Tutup editor" className="grid h-10 w-10 place-items-center rounded-xl border border-stone-200 text-slate-500 transition hover:bg-stone-100 disabled:opacity-50"><X className="h-5 w-5" /></button>
              </div>
              <form onSubmit={saveInternChanges} className="p-5 sm:p-7">
                <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
                  <div>
                    <p className="mb-2 text-sm font-semibold text-slate-800">Pratinjau foto saat ini</p>
                    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
                      <img src={editingIntern.photo_url} alt={editingIntern.name} className="aspect-square w-full object-cover" />
                      <div className="p-3"><p className="text-sm font-bold">{editingIntern.name}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">{editingIntern.experience || 'Belum ada pengalaman.'}</p></div>
                    </div>
                    <label className="mt-4 block text-sm font-semibold text-slate-800">Ganti file foto (opsional)
                      <span className="mt-2 flex min-h-24 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 text-center transition hover:border-amber-600 hover:bg-amber-50/50">
                        <Camera className="h-5 w-5 text-amber-800" />
                        <span className="mt-2 text-xs font-semibold text-slate-700">{replacementInternPhoto ? replacementInternPhoto.name : 'Pilih foto pengganti'}</span>
                        <span className="mt-1 text-[10px] text-slate-500">JPG, PNG, WebP · maksimal 8 MB</span>
                      </span>
                      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setReplacementInternPhoto(event.target.files?.[0] ?? null)} className="sr-only" />
                    </label>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-slate-800">Nama lengkap
                      <input required minLength={2} maxLength={100} value={editingIntern.name} onChange={(event) => setEditingIntern({ ...editingIntern, name: event.target.value })} className="mt-1.5 min-h-11 w-full rounded-xl border border-stone-300 px-3 outline-none focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10" />
                    </label>
                    <label className="block text-sm font-semibold text-slate-800">Universitas / Sekolah
                      <input required minLength={2} maxLength={120} value={editingIntern.university} onChange={(event) => setEditingIntern({ ...editingIntern, university: event.target.value })} className="mt-1.5 min-h-11 w-full rounded-xl border border-stone-300 px-3 outline-none focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10" />
                    </label>
                    <label className="block text-sm font-semibold text-slate-800">Jurusan / Program Studi
                      <input required minLength={2} maxLength={100} value={editingIntern.major} onChange={(event) => setEditingIntern({ ...editingIntern, major: event.target.value })} className="mt-1.5 min-h-11 w-full rounded-xl border border-stone-300 px-3 outline-none focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10" />
                    </label>
                    <label className="block text-sm font-semibold text-slate-800">Periode magang
                      <input required minLength={2} maxLength={60} value={editingIntern.period} onChange={(event) => setEditingIntern({ ...editingIntern, period: event.target.value })} placeholder="Contoh: Jan - Jun 2024" className="mt-1.5 min-h-11 w-full rounded-xl border border-stone-300 px-3 outline-none focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10" />
                    </label>
                    <label className="block text-sm font-semibold text-slate-800">Lokasi / Divisi
                      <input required minLength={2} maxLength={100} value={editingIntern.location} onChange={(event) => setEditingIntern({ ...editingIntern, location: event.target.value })} placeholder="Contoh: PKS Rantau, Aceh Tamiang" className="mt-1.5 min-h-11 w-full rounded-xl border border-stone-300 px-3 outline-none focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10" />
                    </label>
                    <label className="block text-sm font-semibold text-slate-800">Pengalaman magang
                      <textarea required minLength={10} maxLength={1000} rows={4} value={editingIntern.experience} onChange={(event) => setEditingIntern({ ...editingIntern, experience: event.target.value })} placeholder="Ceritakan pengalaman belajar, tugas, dan pencapaian saat magang..." className="mt-1.5 w-full rounded-xl border border-stone-300 px-3 py-2 outline-none focus:border-amber-700 focus:ring-4 focus:ring-amber-700/10" />
                    </label>
                  </div>
                </div>
                <div className="mt-7 flex flex-col-reverse justify-end gap-2 border-t border-stone-200 pt-5 sm:flex-row">
                  <button type="button" disabled={isSaving} onClick={() => { setEditingIntern(null); setReplacementInternPhoto(null); }} className="min-h-11 rounded-xl border border-stone-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-stone-100 disabled:opacity-50">Batal</button>
                  <button type="submit" disabled={isSaving} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-800 px-5 text-sm font-bold text-white transition hover:bg-amber-700 disabled:cursor-wait disabled:opacity-60"><Save className="h-4 w-4" />{isSaving ? 'Menyimpan...' : 'Simpan perubahan'}</button>
                </div>
              </form>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
