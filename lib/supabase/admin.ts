import type { SupabaseClient } from '@supabase/supabase-js';
import { isSupabaseConfigured } from './config';
import { createSupabaseServerClient } from './server';

type AdminAccess =
  | { client: SupabaseClient; response?: never }
  | { client?: never; response: Response };

export async function requireAdmin(): Promise<AdminAccess> {
  if (!isSupabaseConfigured()) {
    return { response: Response.json({ error: 'Supabase belum dikonfigurasi.' }, { status: 503 }) };
  }

  const client = await createSupabaseServerClient();
  const { data: { user }, error } = await client.auth.getUser();

  if (error) {
    console.error('Admin session verification failed:', error.message);
    return { response: Response.json({ error: 'Sesi admin tidak valid. Silakan masuk kembali.' }, { status: 401 }) };
  }

  if (!user) {
    return { response: Response.json({ error: 'Silakan masuk sebagai admin.' }, { status: 401 }) };
  }

  if (user.app_metadata.role !== 'admin') {
    return { response: Response.json({ error: 'Akun ini tidak memiliki akses admin.' }, { status: 403 }) };
  }

  return { client };
}
