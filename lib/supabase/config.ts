/**
 * Konfigurasi Supabase untuk sisi browser maupun server.
 *
 * Yang BoLEH dipakai di website:
 *  - NEXT_PUBLIC_SUPABASE_URL  -> Project URL, contoh https://abcdefgh.supabase.co
 *  - NEXT_PUBLIC_SUPABASE_ANON_KEY -> Publishable key / legacy anon key
 *
 * Yang DILARANG dipakai di frontend:
 *  - sb_secret_... / service_role / Secret Key
 */

type KeyKind = 'jwt-anon' | 'publishable' | 'unknown';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  projectRef: string;
  keyKind: KeyKind;
}

/**
 * Akses HARUS memakai literal process.env.NEXT_PUBLIC_* agar Next.js meng-inline
 * nilainya ke bundle browser. Akses dinamis seperti process.env[name] tidak
 * diganti dan akan selalu undefined di sisi klien.
 */
function readSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? '';
}

function readSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const json = typeof atob === 'function'
      ? atob(padded)
      : String((globalThis as { Buffer?: { from: (v: string, enc: string) => { toString: (enc: string) => string } } }).Buffer?.from(padded, 'base64').toString('binary') ?? '');
    if (!json) return null;
    const parsed = JSON.parse(json);
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function isPlaceholder(value: string) {
  return [
    /your[-_ ]?project/i,
    /your[-_ ]?supabase[-_ ]?anon/i,
    /id-proyek-anda/i,
    /publishable_key_anda/i,
    /\bdummy\b/i,
  ].some((pattern) => pattern.test(value));
}

function projectRefFromHost(host: string) {
  const label = host.split('.')[0] ?? '';
  return /^[a-z0-9]{15,25}$/.test(label) ? label : '';
}

export function getSupabaseConfig(): SupabaseConfig {
  const url = readSupabaseUrl();
  const anonKey = readSupabaseAnonKey();

  if (!url || !anonKey) {
    throw new Error(
      'Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local, lalu restart server / redeploy.',
    );
  }

  if (isPlaceholder(url) || isPlaceholder(anonKey)) {
    throw new Error(
      'Kredensial Supabase masih berupa contoh/placeholder. Buka .env.local dan ganti NEXT_PUBLIC_SUPABASE_URL dengan Project URL asli serta NEXT_PUBLIC_SUPABASE_ANON_KEY dengan Publishable/anon key proyek Anda, lalu restart server.',
    );
  }

  // Kasus paling sering: URL dan key tertukar saat paste.
  if (/^(eyJ|sb_publishable_|sb_secret_)/i.test(url)) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL terisi API key. Isi dengan Project URL (https://xxxx.supabase.co), sedangkan API key diletakkan di NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    );
  }
  if (/^https?:\/\//i.test(anonKey)) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_ANON_KEY terisi Project URL. Isi dengan Publishable key atau anon key, bukan URL.',
    );
  }

  if (anonKey.startsWith('sb_secret_') || /service_role/i.test(anonKey)) {
    throw new Error(
      'Jangan memakai Secret Key atau service_role di website. Gunakan Publishable key / anon key saja.',
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL tidak valid. Gunakan Project URL, contoh https://abcdefgh.supabase.co.',
    );
  }

  if (parsed.protocol !== 'https:') {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL harus menggunakan https://.');
  }

  const host = parsed.hostname.toLowerCase();
  const isSupabaseHost = host.endsWith('.supabase.co') || host.endsWith('.supabase.net');
  if (!isSupabaseHost) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL bukan Project URL Supabase. Contoh yang benar: https://abcdefgh.supabase.co.',
    );
  }

  const projectRef = projectRefFromHost(host);
  let keyKind: KeyKind = 'unknown';

  if (anonKey.startsWith('sb_publishable_')) {
    keyKind = 'publishable';
    // Format publishable key memuat ref proyek. Jika ref terdeteksi dan berbeda,
    // beri tahu lebih awal daripada menunggu error "Invalid API key" saat login.
    const embedded = anonKey.match(/sb_publishable_([a-z0-9]{15,25})_/i)?.[1]?.toLowerCase();
    if (embedded && projectRef && embedded !== projectRef) {
      throw new Error(
        `Publishable key tidak cocok dengan Project URL (key: ${embedded}, URL: ${projectRef}). Salin kedua nilai dari proyek Supabase yang sama.`,
      );
    }
  } else if (anonKey.startsWith('eyJ')) {
    keyKind = 'jwt-anon';
    const payload = decodeJwtPayload(anonKey);
    const role = String(payload?.role ?? '').toLowerCase();
    const keyRef = String(payload?.ref ?? '').toLowerCase();

    if (role === 'service_role') {
      throw new Error(
        'Jangan memakai Secret Key atau service_role di website. Gunakan Publishable key / anon key saja.',
      );
    }
    if (!payload || !keyRef) {
      throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY bukan anon key Supabase yang valid.');
    }
    if (projectRef && keyRef !== projectRef) {
      throw new Error(
        `API key tidak cocok dengan Project URL (key: ${keyRef}, URL: ${projectRef}). Salin Project URL dan Publishable/anon key dari proyek Supabase yang sama.`,
      );
    }
  } else {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_ANON_KEY tidak dikenali. Gunakan Publishable key (sb_publishable_...) atau legacy anon key (eyJ...).',
    );
  }

  return { url: parsed.origin, anonKey, projectRef, keyKind };
}

export function isSupabaseConfigured() {
  try {
    getSupabaseConfig();
    return true;
  } catch {
    return false;
  }
}

export function supabaseConfigError() {
  try {
    getSupabaseConfig();
    return '';
  } catch (error) {
    return error instanceof Error ? error.message : 'Supabase belum dikonfigurasi.';
  }
}

/** Status tanpa informasi rahasia — aman ditampilkan di UI. */
export function getSupabaseConfigStatus() {
  try {
    const config = getSupabaseConfig();
    return {
      ok: true as const,
      message: 'Supabase terhubung.',
      projectRef: config.projectRef,
      keyKind: config.keyKind,
    };
  } catch (error) {
    return {
      ok: false as const,
      message: error instanceof Error ? error.message : 'Supabase belum dikonfigurasi.',
      projectRef: '',
      keyKind: 'unknown' as KeyKind,
    };
  }
}

/** Terjemahkan pesan error Supabase menjadi petunjuk yang bisa ditindaklanjuti. */
export function describeSupabaseError(raw: string) {
  const message = String(raw ?? '').trim();

  const resetWait = message.match(/only request this after\s+(\d+)\s+seconds?/i);
  if (resetWait) {
    return `Supabase membatasi pengiriman ulang. Tunggu ${resetWait[1]} detik sebelum mencoba lagi. Email reset sebelumnya biasanya sudah dikirim — cek inbox dan folder spam Anda.`;
  }
  if (/for security purposes/i.test(message)) {
    return 'Supabase membatasi pengiriman ulang untuk sementara. Tunggu sebentar, atau cek email reset yang sudah dikirim sebelumnya.';
  }

  if (/email not confirmed|confirm your email/i.test(message)) {
    return 'Email admin belum dikonfirmasi. Buka Supabase → Authentication → Users, lalu aktifkan/Confirm user atau centang Auto Confirm saat membuat akun.';
  }
  if (/invalid login credentials|invalid email or password/i.test(message)) {
    return 'Email atau kata sandi salah. Periksa kembali akun admin di Supabase → Authentication → Users.';
  }
  if (/too many requests|rate limit/i.test(message)) {
    return 'Terlalu banyak percobaan login. Tunggu beberapa menit lalu coba lagi.';
  }
  if (/invalid api key|api key|jwt|unauthorized|401/i.test(message)) {
    return 'API key Supabase tidak valid / tidak cocok dengan Project URL. Buka Supabase → Project Settings → API Keys, salin Project URL dan Publishable key dari proyek yang sama ke .env.local, lalu restart server.';
  }
  if (/failed to fetch|fetch failed|networkerror|enotfound|econnrefused|timeout/i.test(message)) {
    return 'Tidak dapat terhubung ke Supabase. Periksa koneksi internet, Project URL, dan status proyek Supabase.';
  }
  if (/relation .* does not exist|pgrst205|could not find the table/i.test(message)) {
    return 'Tabel database belum dibuat. Jalankan file supabase/schema.sql dan supabase/migration_admin_features.sql di SQL Editor Supabase.';
  }
  if (/row-level security|42501|permission denied/i.test(message)) {
    return 'Akses ditolak oleh aturan RLS. Pastikan akun login memiliki app_metadata.role = admin dan kebijakan RLS sudah dijalankan.';
  }

  return message || 'Terjadi kesalahan. Silakan coba lagi.';
}
