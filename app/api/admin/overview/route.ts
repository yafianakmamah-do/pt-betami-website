import { requireAdmin } from '@/lib/supabase/admin';

export async function GET() {
  const access = await requireAdmin();
  if (access.response) return access.response;

  const [messagesRes, applicationsRes, internsRes, galleryRes, jobsRes] = await Promise.all([
    access.client.from('contact_messages').select('id,name,company,email,phone,topic,message,status,created_at').order('created_at', { ascending: false }),
    access.client.from('internship_applications').select('id,name,institution,major,email,phone,division,duration,message,status,created_at').order('created_at', { ascending: false }),
    access.client.from('interns').select('id,name,university,major,period,location,experience,photo_url,photo_storage_path,is_published,created_at').order('created_at', { ascending: false }),
    access.client.from('gallery_items').select('*').order('created_at', { ascending: false }),
    access.client.from('job_applications').select('id,name,email,phone,position,status,created_at').order('created_at', { ascending: false }),
  ]);

  return Response.json({
    messages: messagesRes.data || [],
    applications: applicationsRes.data || [],
    interns: internsRes.data || [],
    gallery: galleryRes.data || [],
    jobs: jobsRes.error ? [] : jobsRes.data || [],
    jobsWarning: jobsRes.error ? 'Tabel lamaran kerja belum tersedia di Supabase. Jalankan supabase/migration_admin_features.sql.' : '',
  }, { headers: { 'Cache-Control': 'no-store' } });
}
