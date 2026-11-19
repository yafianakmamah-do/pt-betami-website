import { createClient } from '@supabase/supabase-js';
import { isSupabaseConfigured, getSupabaseConfig } from '@/lib/supabase/config';

export async function GET() {
  if (!isSupabaseConfigured()) {
    return Response.json({ configured: false, items: [] }, { headers: { 'Cache-Control': 'no-store' } });
  }

  const { url, anonKey } = getSupabaseConfig();
  const supabase = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase
    .from('gallery_items')
    .select('id,image_url,storage_path,category,title_id,title_en,description_id,description_en')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Public gallery query failed:', error.message);
    return Response.json({ error: 'Galeri tambahan belum dapat dimuat.' }, { status: 500 });
  }

  return Response.json({ configured: true, items: data }, { headers: { 'Cache-Control': 'no-store' } });
}