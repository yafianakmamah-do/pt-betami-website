import { createClient } from '@supabase/supabase-js';
import { isSupabaseConfigured, getSupabaseConfig } from '@/lib/supabase/config';
import { FALLBACK_NEWS, type NewsPost } from '@/lib/news';

const COLUMNS = 'id,slug,title_id,title_en,excerpt_id,excerpt_en,body_id,body_en,cover_url,category,published_at';

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get('slug');
  let items: NewsPost[] = [];

  if (isSupabaseConfigured()) {
    const { url, anonKey } = getSupabaseConfig();
    const supabase = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await supabase
      .from('news_posts')
      .select(COLUMNS)
      .eq('is_published', true)
      .order('published_at', { ascending: false });
    if (error) console.error('Public news query failed:', error.message);
    else items = data as NewsPost[];
  }

  const all = [...items, ...FALLBACK_NEWS.filter((f) => !items.some((i) => i.slug === f.slug))]
    .sort((a, b) => b.published_at.localeCompare(a.published_at));

  if (slug) {
    const item = all.find((n) => n.slug === slug);
    if (!item) return Response.json({ error: 'Berita tidak ditemukan.' }, { status: 404 });
    return Response.json({ item, related: all.filter((n) => n.slug !== slug).slice(0, 3) }, { headers: { 'Cache-Control': 'no-store' } });
  }

  return Response.json({ items: all }, { headers: { 'Cache-Control': 'no-store' } });
}
