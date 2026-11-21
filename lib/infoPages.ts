export type InfoCopy = {
  title: string;
  body: string;
  bullets?: string[];
};

export type InfoPageData = {
  eyebrowId: string;
  eyebrowEn: string;
  titleId: string;
  titleEn: string;
  descId: string;
  descEn: string;
  image: string;
  backHref: string;
  backId: string;
  backEn: string;
  sections: { id: InfoCopy; en: InfoCopy }[];
};

export const INFO_PAGES: Record<string, InfoPageData> = {
  'profil-lokasi': {
    eyebrowId: 'Profil Perusahaan',
    eyebrowEn: 'Company Profile',
    titleId: 'Profil & Lokasi',
    titleEn: 'Profile & Location',
    descId:
      'PT Benih Tamiang (BETAMI) mengelola kebun dan Pabrik Kelapa Sawit (PKS) di Kecamatan Rantau, Kabupaten Aceh Tamiang, Nanggroe Aceh Darussalam.',
    descEn:
      'PT Benih Tamiang (BETAMI) manages plantations and a Palm Oil Mill (PKS) in Rantau District, Aceh Tamiang Regency, Nanggroe Aceh Darussalam.',
    image: '/images/pks-mill-ramp.jpg',
    backHref: '/tentang-kami',
    backId: 'Kembali ke Tentang Kami',
    backEn: 'Back to About Us',
    sections: [
      {
        id: {
          title: 'Sekilas Perusahaan',
          body: 'BETAMI bergerak di bidang perkebunan dan pengolahan kelapa sawit. Kami mengelola rantai usaha secara utuh: mulai dari kebun, panen dan pengumpulan tandan buah segar (TBS), pengiriman ke pabrik, hingga pengolahan menjadi Crude Palm Oil (CPO) dan inti sawit. Dengan fokus pada operasional yang tertib dan berkelanjutan, BETAMI mendukung perekonomian daerah melalui penyerapan tenaga kerja lokal dan kemitraan dengan petani serta desa di sekitar area operasional.',
        },
        en: {
          title: 'Company Overview',
          body: 'BETAMI operates in oil palm plantation and processing. We manage the full business chain: from estates, harvesting and fresh fruit bunch (FFB) collection, delivery to the mill, to processing into Crude Palm Oil (CPO) and palm kernel. Focused on orderly and sustainable operations, BETAMI supports the local economy through local workforce absorption and partnerships with farmers and villages around the operational area.',
        },
      },
      {
        id: {
          title: 'Bidang Usaha',
          body: 'Kegiatan usaha BETAMI mencakup dua lini utama yang saling terhubung:',
          bullets: [
            'Perkebunan kelapa sawit: pengelolaan kebun dan panen TBS',
            'Pengolahan: Pabrik Kelapa Sawit (PKS) untuk produksi CPO',
            'Pemasaran hasil: penjualan CPO dan inti sawit ke pasar nasional',
            'Kemitraan: kerja sama dengan petani dan desa sekitar',
          ],
        },
        en: {
          title: 'Business Lines',
          body: 'BETAMI business activities cover two connected main lines:',
          bullets: [
            'Oil palm plantations: estate management and FFB harvesting',
            'Processing: Palm Oil Mill (PKS) for CPO production',
            'Marketing: sales of CPO and palm kernel to the national market',
            'Partnership: cooperation with local farmers and villages',
          ],
        },
      },
      {
        id: {
          title: 'Lokasi Operasional',
          body: 'Area operasional kami berada di Kecamatan Rantau, Kabupaten Aceh Tamiang, Nanggroe Aceh Darussalam. Lokasi ini menjadi pusat kegiatan kebun dan pabrik, dengan akses jalan yang menghubungkan area perkebunan, titik penerimaan TBS, hingga fasilitas pabrik.',
          bullets: [
            'Desa Kebun Rantau, Kecamatan Rantau',
            'Kabupaten Aceh Tamiang, NAD 24453',
            'Akses ke area pabrik dan kebun sekitar',
            'Berada di koridor pengangkutan sawit Aceh Tamiang',
          ],
        },
        en: {
          title: 'Operational Location',
          body: 'Our operations are based in Rantau District, Aceh Tamiang Regency, Nanggroe Aceh Darussalam. This area hosts our estate and mill activities, with road access connecting plantations, FFB receiving points, and mill facilities.',
          bullets: [
            'Kebun Rantau Village, Rantau District',
            'Aceh Tamiang Regency, NAD 24453',
            'Access to the mill and surrounding estates',
            'Located on the Aceh Tamiang palm oil transport corridor',
          ],
        },
      },
      {
        id: {
          title: 'Struktur Operasional',
          body: 'Operasional BETAMI ditunjang oleh tim kebun, tim pabrik, serta fungsi penunjang seperti kualitas, keuangan, dan administrasi. Setiap fungsi memiliki alur pelaporan yang jelas agar keputusan di lapangan dapat diambil cepat dan akurat.',
          bullets: [
            'Tim Kebun: perawatan, panen, dan pengangkutan TBS',
            'Tim Pabrik: pengolahan dan pemeliharaan mesin',
            'Tim Kualitas: pengawasan mutu CPO dan inti sawit',
            'Tim Administrasi: keuangan, SDM, dan pelaporan',
          ],
        },
        en: {
          title: 'Operational Structure',
          body: 'BETAMI operations are supported by estate teams, mill teams, and supporting functions such as quality, finance, and administration. Each function has a clear reporting line so field decisions can be made quickly and accurately.',
          bullets: [
            'Estate Team: maintenance, harvesting, and FFB transport',
            'Mill Team: processing and machine maintenance',
            'Quality Team: CPO and palm kernel quality control',
            'Administration Team: finance, HR, and reporting',
          ],
        },
      },
      {
        id: {
          title: 'Kegiatan & Kemitraan Desa',
          body: 'Kami berinteraksi dan bermitra dengan desa di sekitar operasional, antara lain Suka Jadi, Benua Raja, dan Durian. Bentuk kegiatannya antara lain bantuan sembako, dukungan fasilitas, dan perawatan infrastruktur jalan desa.',
        },
        en: {
          title: 'Activities & Village Partnership',
          body: 'We engage and partner with villages around our operations, including Suka Jadi, Benua Raja, and Durian. Activities include food aid, facility support, and maintenance of village road infrastructure.',
        },
      },
      {
        id: {
          title: 'Kontak Perusahaan',
          body: 'Untuk pertanyaan kemitraan, pasokan, maupun informasi perusahaan lainnya, silakan hubungi kami melalui halaman kontak atau email resmi pt.betami@gmail.com. Kami menjawab setiap pertanyaan pada jam kerja operasional.',
        },
        en: {
          title: 'Company Contact',
          body: 'For questions about partnership, supply, or other company information, please contact us through the contact page or official email pt.betami@gmail.com. We answer every inquiry during operational working hours.',
        },
      },
    ],
  },

  'kemitraan-desa': {
    eyebrowId: 'Kegiatan Sosial',
    eyebrowEn: 'Community Activities',
    titleId: 'Kegiatan & Kemitraan Desa',
    titleEn: 'Village Activities & Partnership',
    descId:
      'BETAMI menjalankan kegiatan sosial dan kemitraan bersama desa di sekitar wilayah operasional Aceh Tamiang sebagai bentuk kehadiran perusahaan yang bertanggung jawab.',
    descEn:
      'BETAMI runs social activities and partnerships with villages around its Aceh Tamiang operational area as a form of responsible corporate presence.',
    image: '/images/kegiatan/csr-betami-juli-2026.jpeg',
    backHref: '/keberlanjutan',
    backId: 'Lihat Keberlanjutan',
    backEn: 'View Sustainability',
    sections: [
      {
        id: {
          title: 'Desa Mitra',
          body: 'Kegiatan kemitraan melibatkan desa-desa di Kecamatan Rantau yang berada di sekitar area operasional perusahaan. Hubungan dibangun secara berkelanjutan, bukan sekadar kegiatan sesaat, agar manfaatnya benar-benar dirasakan warga.',
          bullets: ['Desa Suka Jadi', 'Desa Benua Raja', 'Desa Durian'],
        },
        en: {
          title: 'Partner Villages',
          body: 'Partnership activities involve villages in Rantau District around the company operational area. The relationship is built continuously, not just one-off activities, so that the benefits are truly felt by residents.',
          bullets: ['Suka Jadi Village', 'Benua Raja Village', 'Durian Village'],
        },
      },
      {
        id: {
          title: 'Bentuk Kegiatan',
          body: 'Program yang dijalankan bersama desa dan warga antara lain:',
          bullets: [
            'Bantuan sembako dan kebutuhan pokok bagi warga prasejahtera',
            'Dukungan fasilitas umum desa',
            'Perawatan dan perbaikan infrastruktur jalan desa',
            'Dukungan kegiatan keagamaan dan kemasyarakatan',
          ],
        },
        en: {
          title: 'Types of Activities',
          body: 'Programs run together with villages and residents include:',
          bullets: [
            'Food aid and basic needs for underprivileged residents',
            'Support for village public facilities',
            'Maintenance and repair of village road infrastructure',
            'Support for religious and community activities',
          ],
        },
      },
      {
        id: {
          title: 'Manfaat bagi Warga',
          body: 'Kemitraan desa memberi manfaat langsung berupa akses jalan yang lebih baik, bantuan bagi warga yang membutuhkan, serta peluang kerja bagi warga sekitar area operasional. Perusahaan juga membuka jalur komunikasi agar aspirasi warga dapat disampaikan dan ditindaklanjuti.',
        },
        en: {
          title: 'Benefits for Residents',
          body: 'Village partnership provides direct benefits in the form of better road access, aid for residents in need, and job opportunities for people around the operational area. The company also opens communication channels so residents aspirations can be conveyed and followed up.',
        },
      },
      {
        id: {
          title: 'Keberlanjutan Program',
          body: 'Seluruh program dijalankan secara berkala dan berkelanjutan. Evaluasi bersama pemerintah desa dan warga dilakukan untuk memastikan bantuan tepat sasaran dan sesuai kebutuhan nyata di lapangan.',
        },
        en: {
          title: 'Program Sustainability',
          body: 'All programs run regularly and continuously. Evaluation together with village governments and residents ensures that assistance reaches the right targets and matches real needs in the field.',
        },
      },
    ],
  },

  'pengalaman-operasional': {
    eyebrowId: 'Pengalaman',
    eyebrowEn: 'Experience',
    titleId: 'Pengalaman Operasional',
    titleEn: 'Operational Experience',
    descId:
      'Lebih dari dua dekade BETAMI menjalankan kegiatan perkebunan dan pengolahan kelapa sawit di Aceh Tamiang dengan operasional yang terus ditingkatkan.',
    descEn:
      'For more than two decades, BETAMI has run oil palm plantation and processing activities in Aceh Tamiang with continuously improved operations.',
    image: '/images/estate-road-aerial-hd.jpg',
    backHref: '/tentang-kami',
    backId: 'Kembali ke Tentang Kami',
    backEn: 'Back to About Us',
    sections: [
      {
        id: {
          title: 'Dari Kebun ke Pabrik',
          body: 'Rutinitas operasional dimulai dari kebun: perawatan tanaman, pemupukan, dan panen tandan buah segar sesuai umur buah. TBS kemudian dikumpulkan, ditimbang, dan dikirim ke pabrik melalui titik penerimaan. Di pabrik, TBS diolah melalui rangkaian proses sterilisasi, pengocokan, pemisahan, dan pemurnian hingga menjadi CPO dan inti sawit.',
        },
        en: {
          title: 'From Estate to Mill',
          body: 'The operational routine starts at the estate: plant maintenance, fertilization, and harvesting of fresh fruit bunches according to fruit age. FFB is then collected, weighed, and delivered to the mill through the receiving point. At the mill, FFB goes through sterilization, threshing, separation, and purification processes until it becomes CPO and palm kernel.',
        },
      },
      {
        id: {
          title: 'Standar Mutu & Keamanan',
          body: 'Setiap tahap operasional mengikuti prosedur tetap agar mutu produk dan keselamatan kerja tetap terjaga. Pemeriksaan mutu dilakukan pada bahan masuk maupun hasil keluar pabrik.',
          bullets: [
            'Penimbangan dan pencatatan TBS yang transparan',
            'Pengawasan suhu dan kondisi proses pengolahan',
            'Pemeriksaan mutu CPO sebelum pengiriman',
            'Pelatihan keselamatan kerja untuk petugas lapangan',
          ],
        },
        en: {
          title: 'Quality & Safety Standards',
          body: 'Every operational stage follows standard procedures to maintain product quality and work safety. Quality checks are carried out on incoming materials and mill outputs.',
          bullets: [
            'Transparent FFB weighing and recording',
            'Monitoring of processing conditions and temperature',
            'CPO quality inspection before shipment',
            'Work safety training for field officers',
          ],
        },
      },
      {
        id: {
          title: 'Tenaga Kerja Lokal',
          body: 'Operasional kami melibatkan tenaga kerja lokal dan tim lapangan yang memahami kondisi kebun dan pabrik. Selain menjadi sumber daya utama, kehadiran tenaga kerja lokal juga berkontribusi pada ekonomi rumah tangga di sekitar area operasional.',
        },
        en: {
          title: 'Local Workforce',
          body: 'Our operations involve local workers and field teams who understand estate and mill conditions. Beyond being the main resource, the presence of local workers also contributes to household economies around the operational area.',
        },
      },
      {
        id: {
          title: 'Peningkatan Berkelanjutan',
          body: 'Pengalaman bertahun-tahun menjadi dasar untuk terus memperbaiki cara kerja: efisiensi energi di pabrik, perawatan mesin secara berkala, serta optimalisasi rute pengangkutan TBS agar hasil panen sampai ke pabrik dalam kondisi terbaik.',
        },
        en: {
          title: 'Continuous Improvement',
          body: 'Years of experience form the basis for continuously improving the way we work: mill energy efficiency, regular machine maintenance, and optimization of FFB transport routes so harvested fruit reaches the mill in the best condition.',
        },
      },
    ],
  },

  'informasi-publik': {
    eyebrowId: 'Informasi',
    eyebrowEn: 'Information',
    titleId: 'Informasi Publik',
    titleEn: 'Public Information',
    descId:
      'Informasi perusahaan dirangkum dari sumber publik dan referensi yang dapat dikonfirmasi. Halaman ini menjelaskan cara mengakses dan memverifikasi informasi resmi BETAMI.',
    descEn:
      'Company information is summarized from public sources and references that can be confirmed. This page explains how to access and verify official BETAMI information.',
    image: '/images/about-palm.jpg',
    backHref: '/kontak',
    backId: 'Hubungi Kami',
    backEn: 'Contact Us',
    sections: [
      {
        id: {
          title: 'Sumber Informasi',
          body: 'Data profil dan kegiatan disusun berdasarkan pemberitaan publik serta dokumentasi yang tersedia. Kami berusaha agar setiap informasi yang ditampilkan dapat dipertanggungjawabkan dan tidak menyesatkan pembaca.',
        },
        en: {
          title: 'Source of Information',
          body: 'Profile and activity data are compiled from public reporting and available documentation. We strive to ensure every published piece of information is accountable and does not mislead readers.',
        },
      },
      {
        id: {
          title: 'Informasi yang Dipublikasikan',
          body: 'Beberapa jenis informasi yang dapat diakses publik melalui situs ini:',
          bullets: [
            'Profil perusahaan dan lokasi operasional',
            'Kegiatan usaha: kebun, pabrik, dan produk',
            'Program keberlanjutan dan kegiatan sosial',
            'Lowongan kerja dan program magang',
            'Galeri kegiatan operasional',
          ],
        },
        en: {
          title: 'Published Information',
          body: 'Types of information accessible to the public through this site:',
          bullets: [
            'Company profile and operational location',
            'Business activities: estates, mill, and products',
            'Sustainability programs and social activities',
            'Job vacancies and internship programs',
            'Operational activity gallery',
          ],
        },
      },
      {
        id: {
          title: 'Verifikasi Informasi',
          body: 'Jika Anda memerlukan konfirmasi resmi mengenai data perusahaan, kerja sama, atau pemberitaan yang beredar, silakan hubungi kanal kontak resmi kami. Detail resmi dapat dikonfirmasi langsung melalui kontak perusahaan.',
        },
        en: {
          title: 'Information Verification',
          body: 'If you need official confirmation regarding company data, partnerships, or circulating news, please contact our official contact channel. Official details can be confirmed directly through the company contact.',
        },
      },
      {
        id: {
          title: 'Kontak Resmi',
          body: 'Untuk pertanyaan kemitraan, pasokan, atau informasi perusahaan, silakan gunakan halaman kontak atau email pt.betami@gmail.com. Kami akan mengarahkan pertanyaan Anda ke pihak yang berwenang.',
        },
        en: {
          title: 'Official Contact',
          body: 'For questions about partnership, supply, or company information, please use the contact page or email pt.betami@gmail.com. We will direct your inquiry to the authorized party.',
        },
      },
    ],
  },

  'pasokan-tbs': {
    eyebrowId: 'Kegiatan Usaha',
    eyebrowEn: 'Business Activity',
    titleId: 'Pasokan & Penerimaan TBS',
    titleEn: 'FFB Supply & Receiving',
    descId:
      'Tandan Buah Segar dari kebun mitra dan kebun sendiri diterima dan ditangani sebelum masuk ke proses pabrik. Kualitas panen menentukan mutu CPO akhir.',
    descEn:
      'Fresh Fruit Bunches from partner estates and our own plantations are received and handled before mill processing. Harvest quality determines final CPO quality.',
    image: '/images/ffb-harvest-hd.jpg',
    backHref: '/bisnis',
    backId: 'Kembali ke Bisnis',
    backEn: 'Back to Business',
    sections: [
      {
        id: {
          title: 'Pengumpulan TBS',
          body: 'TBS dipanen dan dikumpulkan dari kebun sesuai umur buah dan jadwal operasional. Panen yang tepat waktu menjaga kandungan minyak dan mencegah kerusakan buah selama pengangkutan.',
          bullets: [
            'Panen sesuai umur buah optimal',
            'Pengumpulan dan pengarahan ke titik pengambilan',
            'Pengangkutan dengan jadwal yang terjadwal',
          ],
        },
        en: {
          title: 'FFB Collection',
          body: 'FFB is harvested and collected from estates according to fruit age and operational schedule. Timely harvesting maintains oil content and prevents fruit damage during transport.',
          bullets: [
            'Harvesting at optimal fruit age',
            'Collection and direction to pickup points',
            'Transport on a scheduled basis',
          ],
        },
      },
      {
        id: {
          title: 'Penerimaan di Pabrik',
          body: 'Di area penerimaan, setiap armada TBS ditimbang dan diperiksa kondisinya sebelum masuk ke lini pengolahan. Pencatatan yang transparan memastikan pasokan tercatat akurat bagi kebun maupun mitra petani.',
          bullets: [
            'Penimbangan setiap armada',
            'Pemeriksaan kualitas dan kondisi buah',
            'Pencatatan data pasokan yang akurat',
          ],
        },
        en: {
          title: 'Mill Receiving',
          body: 'At the receiving area, every FFB vehicle is weighed and inspected before entering the processing line. Transparent recording ensures supply is accurately tracked for estates and partner farmers.',
          bullets: [
            'Weighing of every vehicle',
            'Inspection of fruit quality and condition',
            'Accurate supply data recording',
          ],
        },
      },
      {
        id: {
          title: 'Rantai Pasok yang Efisien',
          body: 'Koordinasi antara kebun, pengangkut, dan pabrik dijaga agar waktu tunggu armada singkat dan buah tetap segar saat diterima. Pengendalian pasokan ini menjadi kunci efisiensi operasional pabrik.',
        },
        en: {
          title: 'Efficient Supply Chain',
          body: 'Coordination between estates, transporters, and the mill keeps vehicle waiting times short and fruit fresh upon arrival. This supply control is the key to mill operational efficiency.',
        },
      },
    ],
  },

  'pabrik-kelapa-sawit': {
    eyebrowId: 'Kegiatan Usaha',
    eyebrowEn: 'Business Activity',
    titleId: 'Pabrik Kelapa Sawit (PKS)',
    titleEn: 'Palm Oil Mill (PKS)',
    descId:
      'PKS BETAMI di Kecamatan Rantau mengolah tandan buah segar menjadi Crude Palm Oil dan inti sawit melalui rangkaian proses yang terkontrol.',
    descEn:
      'The BETAMI Palm Oil Mill in Rantau District processes fresh fruit bunches into Crude Palm Oil and palm kernel through controlled processes.',
    image: '/images/pks-factory-real.jpg',
    backHref: '/bisnis',
    backId: 'Kembali ke Bisnis',
    backEn: 'Back to Business',
    sections: [
      {
        id: {
          title: 'Proses Pengolahan',
          body: 'TBS yang sudah diterima menjalani rangkaian proses di pabrik hingga menjadi minyak sawit mentah dan produk turunannya:',
          bullets: [
            'Sterilisasi: pemanasan buah untuk mempermudah pemisahan',
            'Pengocokan (threshing): pemisahan buah dari tandan',
            'Pengepresan: pengambilan minyak dari buah',
            'Pemurnian: pemisahan minyak, ampas, dan air limbah',
            'Pemisahan inti: pengambilan inti sawit dari biji',
          ],
        },
        en: {
          title: 'Processing',
          body: 'Received FFB goes through the mill process until it becomes crude palm oil and its derivatives:',
          bullets: [
            'Sterilization: heating fruit to ease separation',
            'Threshing: separating fruit from bunches',
            'Pressing: extracting oil from the fruit',
            'Purification: separating oil, fiber, and effluent',
            'Kernel separation: extracting palm kernel from seeds',
          ],
        },
      },
      {
        id: {
          title: 'Pengelolaan Limbah & Energi',
          body: 'Proses pengolahan menghasilkan limbah organik yang dikelola secara bertanggung jawab. Ampas dan limbah pabrik diolah menjadi bahan bernilai guna, sementara efisiensi energi terus diupayakan untuk mengurangi konsumsi bahan bakar.',
        },
        en: {
          title: 'Waste & Energy Management',
          body: 'Processing activities produce organic waste that is managed responsibly. Mill fiber and effluent are processed into useful materials, while energy efficiency continues to be pursued to reduce fuel consumption.',
        },
      },
      {
        id: {
          title: 'Lokasi Pabrik',
          body: 'Fasilitas pabrik berada di area operasional Kecamatan Rantau, Kabupaten Aceh Tamiang. Lokasi ini dipilih karena dekat dengan kebun dan berada pada jalur pengangkutan yang memudahkan distribusi hasil produksi.',
        },
        en: {
          title: 'Mill Location',
          body: 'The mill facility is located in the operational area of Rantau District, Aceh Tamiang Regency. The location was chosen for its proximity to estates and its position on transport routes that facilitate product distribution.',
        },
      },
      {
        id: {
          title: 'Mutu Hasil Produksi',
          body: 'Setiap batch hasil produksi diperiksa sebelum dikirim ke pembeli. Pengawasan mutu ini memastikan CPO dan inti sawit yang diterima pasar sesuai standar yang disepakati.',
        },
        en: {
          title: 'Production Quality',
          body: 'Every production batch is inspected before delivery to buyers. This quality control ensures the CPO and palm kernel received by the market meet agreed standards.',
        },
      },
    ],
  },

  'cpo-inti-sawit': {
    eyebrowId: 'Produk',
    eyebrowEn: 'Products',
    titleId: 'CPO & Inti Sawit',
    titleEn: 'CPO & Palm Kernel',
    descId:
      'Produk utama hasil olahan pabrik adalah Crude Palm Oil (CPO) dan inti sawit sebagai produk turunan yang bernilai ekonomi tinggi.',
    descEn:
      'The main mill outputs are Crude Palm Oil (CPO) and palm kernel as derivative products with high economic value.',
    image: '/images/cpo-kernel-hd.jpg',
    backHref: '/bisnis',
    backId: 'Kembali ke Bisnis',
    backEn: 'Back to Business',
    sections: [
      {
        id: {
          title: 'Crude Palm Oil (CPO)',
          body: 'CPO adalah minyak sawit mentah hasil pengolahan buah kelapa sawit di pabrik. CPO menjadi bahan baku bagi industri penyulingan dan turunannya, serta menjadi komoditas ekspor Indonesia yang penting.',
          bullets: [
            'Dihasilkan langsung dari proses pengepresan dan pemurnian',
            'Dikirim ke pembeli dalam kondisi terjaga mutunya',
            'Bahan baku industri minyak sawit terpurifikasi',
          ],
        },
        en: {
          title: 'Crude Palm Oil (CPO)',
          body: 'CPO is crude palm oil produced from processing oil palm fruit at the mill. CPO is the raw material for the refining industry and its derivatives, and an important Indonesian export commodity.',
          bullets: [
            'Produced directly from pressing and purification processes',
            'Delivered to buyers with maintained quality',
            'Raw material for the refined palm oil industry',
          ],
        },
      },
      {
        id: {
          title: 'Inti Sawit',
          body: 'Inti sawit merupakan produk turunan yang diperoleh dari pemisahan biji setelah proses pengolahan. Inti sawit mengandung minyak inti sawit (kernel oil) yang banyak digunakan industri pangan dan kosmetik.',
        },
        en: {
          title: 'Palm Kernel',
          body: 'Palm kernel is a derivative product obtained from seed separation after processing. Palm kernel contains kernel oil widely used in the food and cosmetics industries.',
        },
      },
      {
        id: {
          title: 'Pemasaran Hasil Produksi',
          body: 'CPO dan inti sawit dipasarkan kepada pembeli domestik melalui jaringan distribusi yang sudah berjalan. Pemasaran dilakukan dengan penjadwalan pengiriman agar rantai pasok pembeli tetap terpenuhi.',
        },
        en: {
          title: 'Product Marketing',
          body: 'CPO and palm kernel are marketed to domestic buyers through established distribution networks. Marketing is carried out with shipment scheduling so buyers supply chains remain fulfilled.',
        },
      },
      {
        id: {
          title: 'Nilai Ekonomi',
          body: 'Sebagai produk utama industri sawit, CPO dan inti sawit memberi kontribusi nyata pada nilai tambah hasil bumi Aceh Tamiang serta mendukung keberlanjutan usaha perkebunan dan pabrik.',
        },
        en: {
          title: 'Economic Value',
          body: 'As the main products of the palm oil industry, CPO and palm kernel provide real added value to Aceh Tamiang agricultural output and support the sustainability of plantation and mill businesses.',
        },
      },
    ],
  },
};
