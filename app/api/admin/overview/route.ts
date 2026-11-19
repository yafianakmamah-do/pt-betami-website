import { createClient } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || user.app_metadata.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [messagesRes, applicationsRes, internsRes, galleryRes] = await Promise.all([
    supabase.from('contact_messages').select('id,name,company,email,phone,topic,message,status,created_at').order('created_at', { ascending: false }),
    supabase.from('internship_applications').select('id,name,institution,major,email,phone,division,duration,message,status,created_at').order('created_at', { ascending: false }),
    supabase.from('interns').select('id,name,university,major,period,location,experience,photo_url,photo_storage_path,is_published,created_at').order('created_at', { ascending: false }),
    supabase.from('gallery_items').select('id,image_url,storage_path,category,title_id,title_en,description_id,description_en,is_published,created_at').order('created_at', { ascending: false }),
  ]);

  return Response.json({
    messages: messagesRes.data || [],
    applications: applicationsRes.data || [],
    interns: internsRes.data || [],
    gallery: galleryRes.data || [],
  }, { headers: { 'Cache-Control': 'no-store' } });
}