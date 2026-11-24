import { useCallback, useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export interface GalleryItem {
  id: string;
  image_url: string;
  storage_path: string;
  category: 'aerial' | 'mill' | 'plantation' | 'product' | 'csr';
  title_id: string;
  title_en: string;
  description_id: string;
  description_en: string;
  is_published: boolean;
  taken_at?: string | null;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  status: 'baru' | 'dibaca' | 'selesai';
  created_at: string;
}

export interface InternshipApplication {
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
}

export interface Intern {
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

export interface JobApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  resume_url: string;
  resume_signed_url?: string;
  cover_letter: string;
  status: 'baru' | 'ditinjau' | 'diterima' | 'ditolak';
  created_at: string;
}

export interface JobOpening {
  id: string;
  title: string;
  location: string;
  employment_type: string;
  description: string;
  is_published: boolean;
  created_at: string;
}

export type GalleryRecord = GalleryItem;

export type AdminTab =
  | 'dashboard'
  | 'career'
  | 'careerSettings'
  | 'jobs'
  | 'internship'
  | 'interns'
  | 'gallery'
  | 'messages'
  | 'content'
  | 'settings';

export interface AdminData {
  messages: ContactMessage[];
  applications: InternshipApplication[];
  interns: Intern[];
  gallery: GalleryItem[];
  jobs?: JobApplication[];
  jobsWarning?: string;
}

export function useAdminData() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/overview', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        setError('Gagal memuat data admin.');
      }
    } catch (err) {
      setError('Gagal memuat data admin.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, refresh: load };
}

export function useAuth() {
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const sb = createSupabaseBrowserClient();
        const { data: { user } } = await sb.auth.getUser();
        if (user) {
          setUser({ email: user.email || '', role: user.app_metadata?.role || 'user' });
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const logout = async () => {
    const sb = createSupabaseBrowserClient();
    await sb.auth.signOut();
    setUser(null);
  };

  return { user, loading, logout };
}

export const categoryLabels: Record<string, string> = {
  aerial: 'Aerial',
  mill: 'Pabrik (PKS)',
  plantation: 'Perkebunan',
  product: 'Produk',
  csr: 'CSR',
};

export const statusLabels: Record<string, string> = {
  baru: 'Baru',
  dibaca: 'Dibaca',
  selesai: 'Selesai',
  ditinjau: 'Ditinjau',
  diterima: 'Diterima',
  ditolak: 'Ditolak',
};
