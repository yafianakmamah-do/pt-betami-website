import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig, isSupabaseConfigured } from '@/lib/supabase/config';
import { mergeSiteContent, type SiteContent } from '@/lib/siteContent';

export const dynamic = 'force-dynamic';

const PUBLIC_PAGES = ['career', 'internship'];

/**
 * Konten publik untuk halaman Karir & Magang.
 * Memakai anon key (RLS site_content mengizinkan SELECT publik).
 * Jika Supabase belum terisi, halaman memakai nilai default dari lib/siteContent.
 */
export async function GET() {
  const stored: SiteContent = {};

  if (isSupabaseConfigured()) {
    try {
      const { url, anonKey } = getSupabaseConfig();
      const supabase = createClient(url, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { data, error } = await supabase
        .from('site_content')
        .select('page,field,value')
        .in('page', PUBLIC_PAGES);

      if (error) {
        console.warn('Public site content query failed:', error.message);
      } else {
        for (const row of data ?? []) {
          if (!PUBLIC_PAGES.includes(row.page)) continue;
          if (!stored[row.page]) stored[row.page] = {};
          stored[row.page][row.field] = row.value ?? '';
        }
      }
    } catch (error) {
      console.warn('Public site content query skipped:', error);
    }
  }

  return NextResponse.json(
    { ok: true, content: mergeSiteContent(stored) },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
