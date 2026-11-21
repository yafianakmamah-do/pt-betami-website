/**
 * Konten teks halaman Karir & Magang yang bisa diedit admin.
 * Disimpan di tabel `site_content` (page, field, value). Tidak perlu tabel baru.
 */

export const SITE_CONTENT_PAGES = [
  'home',
  'about',
  'business',
  'sustainability',
  'contact',
  'career',
  'internship',
] as const;

const BASE_FIELDS = [
  'hero_title_id',
  'hero_title_en',
  'hero_desc_id',
  'hero_desc_en',
  'about_id',
  'about_en',
];

const APPLY_FIELDS = [
  'invite_title_id',
  'invite_title_en',
  'invite_desc_id',
  'invite_desc_en',
  'requirements_id',
  'requirements_en',
  'closed_note_id',
  'closed_note_en',
  'cta_label_id',
  'cta_label_en',
  'hero_image_url',
  'accepting',
];

const CAREER_FIELDS = [
  'apply_url',
  'apply_title_id',
  'apply_title_en',
  'apply_desc_id',
  'apply_desc_en',
  'own_form_enabled',
  'lamaran_hero_image_url',
  'lamaran_side_image_url',
];

const INTERNSHIP_FIELDS = [
  'whatsapp_url',
  'whatsapp_text_id',
  'whatsapp_text_en',
];

export const SITE_CONTENT_FIELDS = Array.from(
  new Set([...BASE_FIELDS, ...APPLY_FIELDS, ...CAREER_FIELDS, ...INTERNSHIP_FIELDS]),
);

export type SiteContent = Record<string, Record<string, string>>;
export type Lang = 'id' | 'en';

const DEFAULT_WHATSAPP =
  'https://wa.me/6281234567890?text=Halo%20PT%20BETAMI,%20saya%20tertarik%20magang.';

export const DEFAULT_SITE_CONTENT: SiteContent = {
  career: {
    hero_title_id: 'Bangun Masa Depan dan Berkembang Bersama PT Betami',
    hero_title_en: 'BUILD YOUR FUTURE WITH PT BETAMI',
    hero_desc_id:
      'Kami percaya bahwa sumber daya manusia merupakan bagian penting dalam pertumbuhan perusahaan. Bergabunglah bersama PT Betami dan jadilah bagian dari perjalanan serta perkembangan perusahaan kami.',
    hero_desc_en:
      'We believe that human resources are an important part of our company’s growth. Join PT Betami and be part of our journey and development.',
    hero_image_url: '/images/pks-factory-real.jpg',
    invite_title_id: 'Tumbuh Bersama Tim yang Berpengalaman',
    invite_title_en: 'Grow With an Experienced Team',
    invite_desc_id:
      'Di BETAMI, pekerjaan dijalani bersama tim di kebun dan pabrik. Anda belajar prosedur kerja, keselamatan, dan ritme operasional dari orang-orang yang sudah lama berada di lapangan.',
    invite_desc_en:
      'At BETAMI, work happens with teams in the plantation and mill. You learn procedures, safety, and the rhythm of operations from people who have spent years in the field.',
    requirements_id:
      'Syarat Umum Lamaran:\n• Warga Negara Indonesia.\n• Minimal SMA/SMK atau sesuai kualifikasi lowongan.\n• Bersedia ditempatkan di area operasional BETAMI, Aceh Tamiang.\n• Nyaman bekerja tim dan mengikuti aturan keselamatan kerja.\n• Siapkan CV terbaru sebelum mengajukan lamaran.',
    requirements_en:
      'General Application Requirements:\n• Indonesian citizen.\n• Minimum high school/vocational diploma or as required by the position.\n• Willing to be placed in BETAMI operational areas, Aceh Tamiang.\n• Comfortable working in a team and following workplace safety rules.\n• Prepare an up-to-date CV before applying.',
    apply_title_id: 'TERTARIK BERGABUNG BERSAMA KAMI?',
    apply_title_en: 'INTERESTED IN JOINING US?',
    apply_desc_id:
      'Temukan peluang karier dan ajukan lamaran Anda langsung melalui formulir BETAMI di bawah ini.',
    apply_desc_en:
      'Explore career opportunities and apply directly through the BETAMI form below.',
    cta_label_id: 'LAMAR SEKARANG',
    cta_label_en: 'APPLY NOW',
    lamaran_hero_image_url: '/images/palm-canopy-sunset-hd.jpg',
    lamaran_side_image_url: '/images/tbs-harvest.jpg',
    apply_url: 'https://career.astra.co.id/',
    own_form_enabled: 'true',
    closed_note_id:
      'TERIMA KASIH ATAS MINAT ANDA UNTUK BERGABUNG BERSAMA PT BETAMI.\n\nSAAT INI KAMI BELUM MEMBUKA PENERIMAAN LAMARAN KERJA.\n\nSILAKAN KUNJUNGI KEMBALI HALAMAN INI UNTUK MENDAPATKAN INFORMASI KESEMPATAN KARIER SELANJUTNYA.',
    closed_note_en:
      'THANK YOU FOR YOUR INTEREST IN JOINING PT BETAMI.\n\nWE ARE NOT ACCEPTING JOB APPLICATIONS AT THIS TIME.\n\nPLEASE VISIT THIS PAGE AGAIN FOR INFORMATION ABOUT FUTURE CAREER OPPORTUNITIES.',
    accepting: 'true',
  },
  internship: {
    hero_title_id: 'Magang di BETAMI',
    hero_title_en: 'Intern at BETAMI',
    hero_desc_id:
      'Belajar langsung dari kebun dan pabrik kelapa sawit kami di Aceh Tamiang. Kuota magang dibuka sesuai kebutuhan operasional.',
    hero_desc_en:
      'Learn directly from our plantation and palm oil mill in Aceh Tamiang. Internship slots open based on operational needs.',
    hero_image_url: '/images/internship.jpg',
    invite_title_id: 'Belajar dari Kebun Sampai Pabrik',
    invite_title_en: 'From Plantation to Mill',
    invite_desc_id:
      'Selama magang, Anda ikut kegiatan sehari-hari tim: melihat panen tandan buah segar, mengikuti alur pengolahan di pabrik, dan belajar cara kerja lapangan dari pembimbing yang mendampingi Anda. Ini bukan magang simulasi—Anda benar-benar turun ke area operasional.',
    invite_desc_en:
      'During the internship, you join the team’s daily routine: seeing fresh fruit bunch harvesting, following the milling process, and learning field work from the mentor assigned to you. This is not a simulated program—you will really go to the operational area.',
    requirements_id:
      'Syarat Lamaran Magang:\n• Mahasiswa aktif atau lulusan baru yang sedang mencari pengalaman kerja.\n• Bersedia mengikuti jadwal magang dan aturan keselamatan kerja di area operasional.\n• Siapkan surat pengantar dari sekolah/kampus bila diminta.\n• Kirim nama, sekolah/kampus, jurusan, dan periode magang yang tersedia.\n• Kuota terbatas, mengikuti kebutuhan operasional BETAMI.',
    requirements_en:
      'Internship Application Requirements:\n• Active student or recent graduate looking for work experience.\n• Willing to follow the internship schedule and safety rules in operational areas.\n• Prepare a recommendation letter from your school/university if requested.\n• Send your name, school/university, major, and available internship period.\n• Limited quota, subject to BETAMI operational needs.',
    cta_label_id: 'KIRIM LAMARAN MAGANG DISINI',
    cta_label_en: 'SEND INTERNSHIP APPLICATION HERE',
    closed_note_id:
      'Mohon maaf, kuota magang BETAMI saat ini penuh atau kami sedang tidak menerima pendaftaran. Tautan lamaran sementara ditutup. Silakan cek halaman ini lagi saat kuota berikutnya dibuka.',
    closed_note_en:
      'Sorry, BETAMI internship quota is currently full or registration is temporarily closed. The application link is hidden for now. Please check this page again for the next opening.',
    accepting: 'true',
    whatsapp_url: DEFAULT_WHATSAPP,
    whatsapp_text_id: 'Hubungi via WhatsApp',
    whatsapp_text_en: 'Contact via WhatsApp',
  },
};

/** Gabungkan nilai dari database dengan nilai default. */
export function mergeSiteContent(stored?: SiteContent | null): SiteContent {
  const merged: SiteContent = {};
  for (const [page, fields] of Object.entries(DEFAULT_SITE_CONTENT)) {
    merged[page] = { ...fields };
  }
  for (const [page, fields] of Object.entries(stored || {})) {
    if (!fields || typeof fields !== 'object') continue;
    merged[page] = { ...(merged[page] || {}), ...fields };
  }
  return merged;
}

export function contentValue(content: SiteContent, page: string, field: string): string {
  return content?.[page]?.[field] ?? '';
}

/** Ambil teks bilingual. Field yang dipakai: `${base}_id` atau `${base}_en`. */
export function contentText(
  content: SiteContent,
  page: string,
  base: string,
  lang: Lang,
): string {
  const field = `${base}_${lang}`;
  const value = contentValue(content, page, field).trim();
  if (value) return value;
  return DEFAULT_SITE_CONTENT[page]?.[field] || '';
}

/** Nilai teks tanpa bahasa, misalnya whatsapp_url atau accepting. */
export function contentRaw(content: SiteContent, page: string, field: string): string {
  const value = contentValue(content, page, field).trim();
  if (value) return value;
  return DEFAULT_SITE_CONTENT[page]?.[field] || '';
}

/** Defaultnya buka. Hanya nilai "false" explicit yang menutup. */
export function isAccepting(content: SiteContent, page: string): boolean {
  return contentValue(content, page, 'accepting') !== 'false';
}
