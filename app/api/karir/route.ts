import { createSupabaseServerClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

const RESUME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const RESUME_MIME_BY_EXT: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

export async function GET() {
  if (!isSupabaseConfigured()) {
    return Response.json({ openings: [] });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('job_openings')
    .select('id,title,location,employment_type,description,created_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    return Response.json({ openings: [] });
  }

  return Response.json({ openings: data ?? [] }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return Response.json(
      { error: 'Penyimpanan belum tersambung. Isi konfigurasi Supabase di .env.local.' },
      { status: 503 },
    );
  }

  try {
    const form = await request.formData();
    const botField = String(form.get('botField') ?? '');
    if (botField.trim()) {
      return Response.json({ error: 'Permintaan ditolak.' }, { status: 400 });
    }

    const name = String(form.get('name') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();
    const phone = String(form.get('phone') ?? '').trim();
    const position = String(form.get('position') ?? '').trim();
    const coverLetter = String(form.get('coverLetter') ?? '').trim();

    if (name.length < 2 || name.length > 120) {
      return Response.json({ error: 'Nama harus 2-120 karakter.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return Response.json({ error: 'Alamat email tidak valid.' }, { status: 400 });
    }
    if (phone.length < 5 || phone.length > 40 || !/^[+\d][\d\s-]{4,39}$/.test(phone)) {
      return Response.json({ error: 'Nomor telepon tidak valid.' }, { status: 400 });
    }
    if (position.length < 2 || position.length > 180) {
      return Response.json({ error: 'Posisi yang dilamar wajib diisi.' }, { status: 400 });
    }
    if (coverLetter.length > 5000) {
      return Response.json({ error: 'Surat pengantar terlalu panjang.' }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    let resumePath = '';
    let cvWarning = '';
    const resume = form.get('resume');
    if (!(resume instanceof File) || resume.size === 0) {
      return Response.json({ error: 'CV wajib dilampirkan (PDF, DOC, atau DOCX, maksimal 5 MB).' }, { status: 400 });
    }

    const extension = resume.name.split('.').pop()?.toLowerCase() ?? '';
    const allowedExt = extension === 'pdf' || extension === 'doc' || extension === 'docx';
    if (resume.size > 5 * 1024 * 1024) {
      return Response.json({ error: 'CV maksimal 5 MB.' }, { status: 400 });
    }
    if (!RESUME_TYPES.has(resume.type) && !allowedExt) {
      return Response.json({ error: 'CV harus berupa PDF, DOC, atau DOCX.' }, { status: 400 });
    }

    const safeExt = allowedExt ? extension : 'pdf';
    const storagePath = `applications/${crypto.randomUUID()}.${safeExt}`;
    const bytes = new Uint8Array(await resume.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from('betami-documents')
      .upload(storagePath, bytes, {
        contentType: RESUME_TYPES.has(resume.type) ? resume.type : RESUME_MIME_BY_EXT[safeExt],
        upsert: false,
      });

    if (uploadError) {
      cvWarning = 'Lamaran tersimpan, tetapi file CV belum masuk ke penyimpanan. Bucket betami-documents belum siap.';
    } else {
      resumePath = storagePath;
    }

    const { error } = await supabase.from('job_applications').insert({
      name,
      email,
      phone,
      position,
      resume_url: resumePath,
      cover_letter: coverLetter,
      status: 'baru',
    });

    if (error) {
      console.error('Job application insert failed:', error.message);
      const missing = error.message.includes('job_applications') || error.code === 'PGRST205';
      return Response.json(
        {
          error: missing
            ? 'Tabel lamaran kerja belum dibuat di Supabase. Jalankan file supabase/migration_admin_features.sql di SQL Editor.'
            : 'Lamaran belum terkirim. Coba lagi nanti.',
        },
        { status: missing ? 503 : 500 },
      );
    }

    return Response.json({ ok: true, cvStored: Boolean(resumePath), warning: cvWarning });
  } catch (error) {
    console.error('Career POST error:', error);
    return Response.json({ error: 'Permintaan tidak valid.' }, { status: 400 });
  }
}
