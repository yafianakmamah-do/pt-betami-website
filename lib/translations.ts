export type Language = 'id' | 'en';

export interface TranslationSchema {
  nav: {
    home: string;
    about: string;
    business: string;
    gallery: string;
    internship: string;
    contact: string;
    contactBtn: string;
    listenPage: string;
    stopAudio: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    btnAbout: string;
    btnBusiness: string;
    statExperience: string;
    statPlantation: string;
    statCapacity: string;
  };
  aboutSection: {
    badge: string;
    title: string;
    subtitle: string;
    p1: string;
    p2: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar3Title: string;
    pillar3Desc: string;
    btnMore: string;
  };
  businessSection: {
    badge: string;
    title: string;
    subtitle: string;
    card1Title: string;
    card1Category: string;
    card1Desc: string;
    card1Points: string[];
    card2Title: string;
    card2Category: string;
    card2Desc: string;
    card2Points: string[];
    card3Title: string;
    card3Category: string;
    card3Desc: string;
    card3Points: string[];
    viewAllBtn: string;
  };
  statsSection: {
    badge: string;
    title: string;
    subtitle: string;
    disclaimer: string;
    stat1Value: string;
    stat1Label: string;
    stat1Desc: string;
    stat2Value: string;
    stat2Label: string;
    stat2Desc: string;
    stat3Value: string;
    stat3Label: string;
    stat3Desc: string;
    stat4Value: string;
    stat4Label: string;
    stat4Desc: string;
  };
  gallerySection: {
    badge: string;
    title: string;
    subtitle: string;
    filterAll: string;
    filterPlantation: string;
    filterMill: string;
    filterProduct: string;
    filterCommunity: string;
    viewAllBtn: string;
    lightboxHint: string;
  };
  internshipSection: {
    badge: string;
    title: string;
    subtitle: string;
    desc: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
    btnInfo: string;
    btnContact: string;
  };
  ctaSection: {
    badge: string;
    title: string;
    desc: string;
    btnContact: string;
    btnInternship: string;
  };
  tts: {
    listenButton: string;
    playing: string;
    paused: string;
    pause: string;
    resume: string;
    stop: string;
    speed: string;
    speechSupported: string;
    speechNotSupported: string;
  };
  footer: {
    companyDesc: string;
    quickLinks: string;
    businessUnits: string;
    contactInfo: string;
    addressOffice: string;
    addressPlantation: string;
    phone: string;
    email: string;
    rights: string;
    sustainableBadge: string;
  };
}

export const translations: Record<Language, TranslationSchema> = {
  id: {
    nav: {
      home: 'Beranda',
      about: 'Tentang Kami',
      business: 'Bisnis',
      gallery: 'Galeri',
      internship: 'Magang',
      contact: 'Kontak',
      contactBtn: 'Hubungi Kami',
      listenPage: 'Dengarkan Halaman',
      stopAudio: 'Hentikan Suara',
    },
    hero: {
      badge: 'PT Benih Tamiang (BETAMI) · Aceh Tamiang',
      titleLine1: 'Mengolah Sawit,',
      titleLine2: 'Tumbuh Bersama Masyarakat',
      description: 'Pabrik Kelapa Sawit (PKS) di Kecamatan Rantau, Kabupaten Aceh Tamiang. Fokus pada pengolahan TBS menjadi CPO, penyerapan tenaga kerja lokal, dan kepedulian sosial bagi desa sekitar.',
      btnAbout: 'Tentang PT BETAMI',
      btnBusiness: 'Lihat Kegiatan Usaha',
      statExperience: '20+ tahun pengalaman sektor sawit',
      statPlantation: 'Desa mitra di Kec. Rantau',
      statCapacity: 'PKS operasional di Aceh Tamiang',
    },
    aboutSection: {
      badge: 'Profil Perusahaan',
      title: 'PT BETAMI: Pabrik Kelapa Sawit di Aceh Tamiang',
      subtitle: 'Informasi dirangkum dari sumber publik dan pemberitaan lokal terkait operasional perusahaan.',
      p1: 'PT Benih Tamiang (BETAMI) adalah perusahaan yang bergerak di sektor kelapa sawit dengan fasilitas Pabrik Kelapa Sawit (PKS) di wilayah Kecamatan Rantau, Kabupaten Aceh Tamiang, Nanggroe Aceh Darussalam. Perusahaan berperan dalam rantai pasok pengolahan Tandan Buah Segar (TBS) menjadi Crude Palm Oil (CPO).',
      p2: 'Dalam berbagai pemberitaan, PT BETAMI disebut beroperasi lebih dari dua dekade dan terlibat dalam kegiatan sosial/CSR serta interaksi dengan masyarakat desa sekitar seperti Suka Jadi, Benua Raja, dan Durian, termasuk bantuan logistik, dukungan fasilitas, dan perawatan infrastruktur jalan operasional.',
      pillar1Title: 'Pengolahan TBS & CPO',
      pillar1Desc: 'Kegiatan inti berupa penerimaan dan pengolahan Tandan Buah Segar (TBS) di PKS.',
      pillar2Title: 'Kemitraan Desa Sekitar',
      pillar2Desc: 'Interaksi dan dukungan sosial bagi masyarakat di wilayah sekitar operasional pabrik.',
      pillar3Title: 'Operasional & Ketenagakerjaan',
      pillar3Desc: 'Kontribusi terhadap aktivitas ekonomi dan penyerapan tenaga kerja lokal di Aceh Tamiang.',
      btnMore: 'Selengkapnya Tentang Kami',
    },
    businessSection: {
      badge: 'Kegiatan Usaha',
      title: 'Fokus Operasional PT BETAMI',
      subtitle: 'Gambaran umum kegiatan usaha berdasarkan informasi publik: perkebunan/pasok TBS, pabrik kelapa sawit, dan produk CPO/inti sawit.',
      card1Title: 'Pasokan & Penerimaan TBS',
      card1Category: 'Hulu & Pasok',
      card1Desc: 'Penerimaan dan penanganan Tandan Buah Segar (TBS) dari sumber pasokan untuk diolah di pabrik.',
      card1Points: ['Penerimaan TBS di area PKS', 'Penanganan buah segar sebelum olah', 'Koordinasi pasokan dari wilayah sekitar'],
      card2Title: 'Pabrik Kelapa Sawit (PKS)',
      card2Category: 'Pengolahan',
      card2Desc: 'Pengolahan TBS menjadi Crude Palm Oil (CPO) dan produk inti sawit di fasilitas pabrik di Kecamatan Rantau.',
      card2Points: ['Proses pengolahan TBS menjadi CPO', 'Operasional pabrik di Aceh Tamiang', 'Pengelolaan hasil olahan kelapa sawit'],
      card3Title: 'Produk & Kontribusi Lokal',
      card3Category: 'Hasil & Dampak',
      card3Desc: 'Hasil olahan berupa CPO/inti sawit serta kontribusi ekonomi dan sosial bagi masyarakat desa sekitar.',
      card3Points: ['Crude Palm Oil (CPO) & inti sawit', 'Penyerapan tenaga kerja lokal', 'Dukungan sosial/CSR untuk desa mitra'],
      viewAllBtn: 'Lihat Detail Kegiatan Usaha',
    },
    statsSection: {
      badge: 'Profil Operasional',
      title: 'Gambaran Singkat PT BETAMI',
      subtitle: 'Poin-poin faktual berdasarkan referensi publik yang tersedia.',
      disclaimer: 'Catatan: Informasi bersifat ringkasan dari sumber publik/pemberitaan. Detail resmi dapat dikonfirmasi melalui kontak perusahaan.',
      stat1Value: '20+',
      stat1Label: 'Tahun Pengalaman',
      stat1Desc: 'Disebut memiliki pengalaman lebih dari dua dekade di sektor kelapa sawit.',
      stat2Value: '3+',
      stat2Label: 'Desa Mitra Sekitar',
      stat2Desc: 'Interaksi dengan desa seperti Suka Jadi, Benua Raja, dan Durian.',
      stat3Value: 'PKS',
      stat3Label: 'Fasilitas Pengolahan',
      stat3Desc: 'Pabrik Kelapa Sawit beroperasi di Kecamatan Rantau, Aceh Tamiang.',
      stat4Value: 'CPO',
      stat4Label: 'Produk Utama',
      stat4Desc: 'Pengolahan TBS menjadi Crude Palm Oil (CPO) dan turunan inti sawit.',
    },
    gallerySection: {
      badge: 'Dokumentasi Visual',
      title: 'Galeri Operasional & Kegiatan PT BETAMI',
      subtitle: 'Foto fasilitas PKS, TBS/sawit, perkebunan, serta dokumentasi kegiatan sosial perusahaan.',
      filterAll: 'Semua Foto',
      filterPlantation: 'Perkebunan',
      filterMill: 'Pabrik (PKS)',
      filterProduct: 'TBS & Produk',
      filterCommunity: 'CSR & Kegiatan',
      viewAllBtn: 'Buka Galeri Lengkap',
      lightboxHint: 'Klik foto untuk memperbesar',
    },
    internshipSection: {
      badge: 'Peluang Magang',
      title: 'Magang di PT BETAMI',
      subtitle: 'Kesempatan belajar di lingkungan operasional Pabrik Kelapa Sawit (PKS) dan agribisnis di Aceh Tamiang.',
      desc: 'Kirim lamaran magang Anda melalui tautan di halaman magang. Tim kami akan segera menghubungi Anda.',
      feature1Title: 'Lingkungan PKS',
      feature1Desc: 'Pengenalan proses operasional pabrik kelapa sawit.',
      feature2Title: 'Pembelajaran Lapangan',
      feature2Desc: 'Pengalaman observasi/praktek sesuai bidang dan kebutuhan.',
      feature3Title: 'Konfirmasi Resmi',
      feature3Desc: 'Detail program, kuota, dan persyaratan mengikuti informasi resmi perusahaan.',
      btnInfo: 'Kirim Lamaran Magang',
      btnContact: 'Kontak Perusahaan',
    },
    ctaSection: {
      badge: 'Informasi & Komunikasi',
      title: 'Hubungi PT BETAMI',
      desc: 'Untuk keperluan informasi operasional, kemitraan pasok, atau pertanyaan terkait magang, silakan sampaikan melalui saluran kontak yang tersedia.',
      btnContact: 'Hubungi Kami',
      btnInternship: 'Informasi Magang',
    },
    tts: {
      listenButton: 'Dengarkan Halaman',
      playing: 'Sedang Membaca Halaman...',
      paused: 'Pembacaan Dijeda',
      pause: 'Jeda',
      resume: 'Lanjut',
      stop: 'Berhenti',
      speed: 'Kecepatan Suara',
      speechSupported: 'Web Speech API Siap',
      speechNotSupported: 'Browser Anda belum mendukung fitur pembacaan suara otomatis.',
    },
    footer: {
      companyDesc: 'PT Benih Tamiang (BETAMI) mengoperasikan Pabrik Kelapa Sawit (PKS) di Kecamatan Rantau, Kabupaten Aceh Tamiang, dengan fokus pada pengolahan TBS, produk CPO, dan kontribusi bagi masyarakat sekitar.',
      quickLinks: 'Tautan Cepat',
      businessUnits: 'Kegiatan Usaha',
      contactInfo: 'Lokasi & Kontak',
      addressOffice: 'Desa Kebun Rantau, Kec. Rantau, Kab. Aceh Tamiang, NAD 24453 (ref: 73PX+GQF)',
      addressPlantation: 'Wilayah interaksi: Desa Suka Jadi, Benua Raja, Durian (Kec. Rantau, Aceh Tamiang)',
      phone: 'Hubungi melalui formulir kontak website',
      email: '— (saluran resmi via formulir website)',
      rights: 'Seluruh hak cipta dilindungi.',
      sustainableBadge: 'Berkomitmen pada operasional bertanggung jawab dan kepedulian sosial',
    },
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      business: 'Business',
      gallery: 'Gallery',
      internship: 'Internship',
      contact: 'Contact',
      contactBtn: 'Contact Us',
      listenPage: 'Read Page Aloud',
      stopAudio: 'Stop Voice',
    },
    hero: {
      badge: 'PT Benih Tamiang (BETAMI) · Aceh Tamiang',
      titleLine1: 'Processing Palm,',
      titleLine2: 'Growing with the Community',
      description: 'Palm Oil Mill (PKS) in Rantau District, Aceh Tamiang Regency. Focused on processing FFB into CPO, local employment, and social support for surrounding villages.',
      btnAbout: 'About PT BETAMI',
      btnBusiness: 'View Operations',
      statExperience: '20+ years in palm sector',
      statPlantation: 'Partner villages in Rantau District',
      statCapacity: 'Operational PKS in Aceh Tamiang',
    },
    aboutSection: {
      badge: 'Company Profile',
      title: 'PT BETAMI: Palm Oil Mill in Aceh Tamiang',
      subtitle: 'Summarized from publicly available information and local reporting.',
      p1: 'PT Benih Tamiang (BETAMI) operates in the palm oil sector with a Palm Oil Mill (PKS) in Rantau District, Aceh Tamiang Regency, Nanggroe Aceh Darussalam. The company plays a role in processing Fresh Fruit Bunches (FFB) into Crude Palm Oil (CPO).',
      p2: 'Public reports indicate more than two decades of operation and involvement in CSR/social activities with nearby villages such as Suka Jadi, Benua Raja, and Durian, including aid distribution, facility support, and maintenance of operational roads.',
      pillar1Title: 'FFB & CPO Processing',
      pillar1Desc: 'Core activity: receiving and processing Fresh Fruit Bunches (FFB) at the mill.',
      pillar2Title: 'Nearby Village Engagement',
      pillar2Desc: 'Social interaction and support for communities around the operational area.',
      pillar3Title: 'Operations & Local Jobs',
      pillar3Desc: 'Contribution to local economic activity and employment in Aceh Tamiang.',
      btnMore: 'Learn More About Us',
    },
    businessSection: {
      badge: 'Business Activities',
      title: 'PT BETAMI Operational Focus',
      subtitle: 'General overview based on public information: FFB supply, palm oil mill processing, and CPO/kernel outputs.',
      card1Title: 'FFB Supply & Receiving',
      card1Category: 'Upstream & Supply',
      card1Desc: 'Receiving and handling Fresh Fruit Bunches (FFB) for processing at the mill.',
      card1Points: ['FFB receiving at PKS area', 'Fresh fruit handling before processing', 'Supply coordination with nearby areas'],
      card2Title: 'Palm Oil Mill (PKS)',
      card2Category: 'Processing',
      card2Desc: 'Processing FFB into Crude Palm Oil (CPO) and palm kernel products at the Rantau District facility.',
      card2Points: ['FFB to CPO processing', 'Mill operations in Aceh Tamiang', 'Management of palm oil outputs'],
      card3Title: 'Products & Local Contribution',
      card3Category: 'Outputs & Impact',
      card3Desc: 'CPO/kernel products alongside economic and social contributions to nearby villages.',
      card3Points: ['Crude Palm Oil (CPO) & palm kernel', 'Local employment opportunities', 'CSR/social support for partner villages'],
      viewAllBtn: 'View Business Details',
    },
    statsSection: {
      badge: 'Operational Snapshot',
      title: 'PT BETAMI at a Glance',
      subtitle: 'Factual points based on available public references.',
      disclaimer: 'Note: Information is summarized from public sources/reports. Official details can be confirmed via company contact.',
      stat1Value: '20+',
      stat1Label: 'Years of Experience',
      stat1Desc: 'Reported to have over two decades in the palm oil sector.',
      stat2Value: '3+',
      stat2Label: 'Nearby Partner Villages',
      stat2Desc: 'Engagement with villages such as Suka Jadi, Benua Raja, and Durian.',
      stat3Value: 'PKS',
      stat3Label: 'Processing Facility',
      stat3Desc: 'Palm Oil Mill operating in Rantau District, Aceh Tamiang.',
      stat4Value: 'CPO',
      stat4Label: 'Primary Product',
      stat4Desc: 'Processing FFB into Crude Palm Oil (CPO) and palm kernel derivatives.',
    },
    gallerySection: {
      badge: 'Visual Gallery',
      title: 'PT BETAMI Operations & Activities Gallery',
      subtitle: 'Photos of PKS facilities, FFB/palm fruits, plantations, and company social activities.',
      filterAll: 'All Photos',
      filterPlantation: 'Plantation',
      filterMill: 'Mill (PKS)',
      filterProduct: 'FFB & Products',
      filterCommunity: 'CSR & Activities',
      viewAllBtn: 'Open Full Gallery',
      lightboxHint: 'Click photo to enlarge',
    },
    internshipSection: {
      badge: 'Internship Opportunity',
      title: 'Intern at PT BETAMI',
      subtitle: 'Learn within the Palm Oil Mill (PKS) operations and agribusiness environment in Aceh Tamiang.',
      desc: 'Send your internship application through the link on the internship page. Our team will contact you shortly.',
      feature1Title: 'Mill Environment',
      feature1Desc: 'Introduction to palm oil mill operational processes.',
      feature2Title: 'Field Learning',
      feature2Desc: 'Observation/practice experience based on field and needs.',
      feature3Title: 'Official Confirmation',
      feature3Desc: 'Program details, quota, and requirements follow official company information.',
      btnInfo: 'Send Internship Application',
      btnContact: 'Contact Company',
    },
    ctaSection: {
      badge: 'Information & Contact',
      title: 'Get in Touch with PT BETAMI',
      desc: 'For operational information, supply partnership, or internship inquiries, please reach out through the available contact channels.',
      btnContact: 'Contact Us',
      btnInternship: 'Internship Info',
    },
    tts: {
      listenButton: 'Read Page Aloud',
      playing: 'Reading Page Aloud...',
      paused: 'Reading Paused',
      pause: 'Pause',
      resume: 'Resume',
      stop: 'Stop',
      speed: 'Voice Speed',
      speechSupported: 'Web Speech API Ready',
      speechNotSupported: 'Your browser does not currently support automatic speech synthesis.',
    },
    footer: {
      companyDesc: 'PT Benih Tamiang (BETAMI) operates a Palm Oil Mill (PKS) in Rantau District, Aceh Tamiang Regency, focused on FFB processing, CPO products, and contribution to surrounding communities.',
      quickLinks: 'Quick Links',
      businessUnits: 'Business Activities',
      contactInfo: 'Location & Contact',
      addressOffice: 'Desa Kebun Rantau, Rantau District, Aceh Tamiang Regency, NAD 24453 (ref: 73PX+GQF)',
      addressPlantation: 'Engagement area: Suka Jadi, Benua Raja, Durian villages (Rantau District, Aceh Tamiang)',
      phone: 'Contact via website form',
      email: '— (official channel via website form)',
      rights: 'All rights reserved.',
      sustainableBadge: 'Committed to responsible operations and social care',
    },
  },
};
