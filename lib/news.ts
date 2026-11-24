export type NewsPost = {
  id: string;
  slug: string;
  title_id: string;
  title_en: string;
  excerpt_id: string;
  excerpt_en: string;
  body_id: string;
  body_en: string;
  cover_url: string;
  category: string;
  published_at: string;
};

export const NEWS_CATEGORIES: Record<string, { id: string; en: string }> = {
  perusahaan: { id: 'Perusahaan', en: 'Company' },
  csr: { id: 'CSR & Sosial', en: 'CSR & Social' },
  operasional: { id: 'Operasional', en: 'Operations' },
  karir: { id: 'Karir', en: 'Careers' },
};

export const FALLBACK_NEWS: NewsPost[] = [
  {
    id: 'builtin-csr-desa',
    slug: 'kegiatan-sosial-bersama-desa-sekitar',
    title_id: 'Kegiatan Sosial PT BETAMI Bersama Desa Sekitar',
    title_en: 'PT BETAMI Social Activities with Nearby Villages',
    excerpt_id: 'PT BETAMI terus menjalin kebersamaan dengan masyarakat desa di sekitar wilayah operasional melalui kegiatan sosial.',
    excerpt_en: 'PT BETAMI continues to build togetherness with villages around its operational area through social activities.',
    body_id: 'PT Benih Tamiang (BETAMI) menjalankan kegiatan sosial bersama masyarakat desa di sekitar wilayah operasional di Kecamatan Rantau, Aceh Tamiang.\n\nKegiatan ini menjadi bagian dari komitmen perusahaan untuk tumbuh bersama masyarakat, mendukung kebutuhan warga, dan menjaga hubungan baik dengan lingkungan sekitar.',
    body_en: 'PT Benih Tamiang (BETAMI) carries out social activities with village communities around its operational area in Rantau District, Aceh Tamiang.\n\nThese activities are part of the company commitment to grow together with the community, support local needs, and maintain good relations with the surrounding environment.',
    cover_url: '/images/kegiatan/csr-betami-juli-2026.jpeg',
    category: 'csr',
    published_at: '2026-07-01',
  },
  {
    id: 'builtin-sembako',
    slug: 'penyaluran-bantuan-sembako',
    title_id: 'Penyaluran Bantuan Sembako untuk Warga',
    title_en: 'Food Aid Distribution for Residents',
    excerpt_id: 'Program bantuan sembako disalurkan kepada warga desa di sekitar area operasional perusahaan.',
    excerpt_en: 'Food aid was distributed to village residents around the company operational area.',
    body_id: 'Sebagai bentuk kepedulian sosial, PT BETAMI menyalurkan bantuan sembako kepada warga di desa sekitar area operasional perusahaan.\n\nProgram ini diharapkan dapat meringankan kebutuhan masyarakat sekaligus mempererat hubungan antara perusahaan dan warga.',
    body_en: 'As a form of social care, PT BETAMI distributed food aid to residents in villages around the company operational area.\n\nThis program is intended to ease community needs while strengthening the relationship between the company and residents.',
    cover_url: '/images/kegiatan/csr-sembako-betami.jpg',
    category: 'csr',
    published_at: '2026-06-15',
  },
  {
    id: 'builtin-pks',
    slug: 'operasional-pabrik-kelapa-sawit-rantau',
    title_id: 'Operasional Pabrik Kelapa Sawit di Kecamatan Rantau',
    title_en: 'Palm Oil Mill Operations in Rantau District',
    excerpt_id: 'PKS PT BETAMI mengolah Tandan Buah Segar (TBS) menjadi Crude Palm Oil (CPO) dan inti sawit.',
    excerpt_en: 'The PT BETAMI mill processes Fresh Fruit Bunches (FFB) into Crude Palm Oil (CPO) and palm kernel.',
    body_id: 'Pabrik Kelapa Sawit (PKS) PT BETAMI di Kecamatan Rantau, Aceh Tamiang, mengolah Tandan Buah Segar (TBS) menjadi Crude Palm Oil (CPO) dan inti sawit.\n\nProses dimulai dari penerimaan TBS, perebusan, perontokan, pengepresan, hingga pemurnian minyak sebelum disimpan di tangki.',
    body_en: 'The PT BETAMI Palm Oil Mill (PKS) in Rantau District, Aceh Tamiang, processes Fresh Fruit Bunches (FFB) into Crude Palm Oil (CPO) and palm kernel.\n\nThe process starts with FFB receiving, sterilization, threshing, pressing, and oil clarification before storage in tanks.',
    cover_url: '/images/pks-factory-real.jpg',
    category: 'operasional',
    published_at: '2026-05-20',
  },
];

export function formatNewsDate(value: string, lang: 'id' | 'en') {
  return new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-US', { dateStyle: 'long' }).format(new Date(value));
}

export function slugify(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}
