import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig, isSupabaseConfigured } from '@/lib/supabase/config';
import { readInterns } from '@/lib/internsStorage';

export const dynamic = 'force-dynamic';

type PublicIntern = {
  id: string;
  name: string;
  experience: string;
  photo_url: string;
  photoUrl: string;
  university?: string;
  major?: string;
  period?: string;
  location?: string;
  is_published?: boolean;
  created_at?: string;
};

function fallbackPhoto() {
  return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop&crop=face';
}

function normalize(row: any): PublicIntern {
  const photo = row?.photo_url || row?.photoUrl || fallbackPhoto();
  return {
    id: String(row?.id ?? crypto.randomUUID()),
    name: String(row?.name ?? 'Anak Magang BETAMI'),
    experience: String(row?.experience ?? ''),
    photo_url: photo,
    photoUrl: photo,
    university: row?.university ? String(row.university) : undefined,
    major: row?.major ? String(row.major) : undefined,
    period: row?.period ? String(row.period) : undefined,
    location: row?.location ? String(row.location) : undefined,
    is_published: row?.is_published ?? true,
    created_at: row?.created_at,
  };
}

/**
 * Data peserta magang untuk halaman publik.
 * Prioritas: peserta yang ditambahkan admin di Supabase (tabel `interns`).
 * Jika Supabase belum terisi/belum terkonfigurasi, pakai data contoh lokal agar
 * halaman tetap terlihat lengkap. Carousel lama di homepage ikut terhubung ke sini.
 */
export async function GET() {
  let items: PublicIntern[] = [];

  if (isSupabaseConfigured()) {
    try {
      const { url, anonKey } = getSupabaseConfig();
      const supabase = createClient(url, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { data, error } = await supabase
        .from('interns')
        .select('id,name,experience,photo_url,university,major,period,location,is_published,created_at')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Public interns query failed:', error.message);
      } else if (Array.isArray(data) && data.length > 0) {
        items = data.map(normalize);
      }
    } catch (error) {
      console.warn('Public interns query skipped:', error);
    }
  }

  if (items.length === 0) {
    items = readInterns()
      .filter((row: any) => (row?.is_published ?? true) !== false)
      .map(normalize);
  }

  return NextResponse.json(
    { ok: true, items, interns: items },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
