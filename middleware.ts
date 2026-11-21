import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseConfig } from '@/lib/supabase/config';

/**
 * Perlindungan server-side untuk portal admin.
 * - /api/admin/*  : hanya user Supabase dengan app_metadata.role = 'admin'
 * - /admin        : user non-admin dialihkan; user tanpa sesi tetap boleh melihat form login
 */
export async function middleware(request: NextRequest) {
  const isApi = request.nextUrl.pathname.startsWith('/api/admin');

  let config;
  try {
    config = getSupabaseConfig();
  } catch (error) {
    if (isApi) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Supabase belum dikonfigurasi.' },
        { status: 503 },
      );
    }
    // Biarkan halaman /admin merender form login dengan pesan konfigurasi.
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data, error } = await supabase.auth.getUser();
  const user = data.user;

  if (isApi) {
    if (error || !user) {
      return NextResponse.json({ error: 'Silakan masuk sebagai admin.' }, { status: 401 });
    }
    if (user.app_metadata?.role !== 'admin') {
      return NextResponse.json({ error: 'Akun ini tidak memiliki akses admin.' }, { status: 403 });
    }
    return response;
  }

  if (!error && user && user.app_metadata?.role !== 'admin') {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.search = '?admin=unauthorized';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/admin', '/api/admin/:path*'],
};
