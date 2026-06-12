export type Category = "IT" | "Desain" | "Bisnis" | "Seni" | "Akademik";

export type Competition = {
  id: number;
  title: string;
  organizer: string;
  category: Category;
  deadline: string;
  registrationFee: number;
  isFree: boolean;
  prodi: string[];
  poster: string;
  prizes: string;
  participants: string;
  description: string;
  benefits: string[];
  requirements: string[];
  tags: string[];
  savedByUser: boolean;
  popular: boolean;
};

export const competitions: Competition[] = [
  {
    id: 1,
    title: "GEMASTIK XVII – Pengembangan Aplikasi Mobile",
    organizer: "Kemdikbudristek RI",
    category: "IT",
    deadline: "2026-08-20",
    registrationFee: 0,
    isFree: true,
    prodi: ["Informatika", "Sistem Informasi", "Teknik Komputer"],
    poster: "https://images.unsplash.com/photo-1719159381981-1327b22aff9b?w=600&h=360&fit=crop&auto=format",
    prizes: "Rp 50.000.000",
    participants: "Tim 3–5 orang",
    description:
      "Kompetisi Mahasiswa Teknologi Informasi dan Komunikasi (GEMASTIK) adalah kompetisi bergengsi tingkat nasional yang diselenggarakan oleh Kemdikbudristek RI. Kategori Pengembangan Aplikasi Mobile menantang peserta untuk menciptakan solusi inovatif berbasis aplikasi Android/iOS yang menjawab permasalahan nyata di masyarakat Indonesia.",
    benefits: [
      "Total hadiah Rp 50.000.000",
      "Sertifikat bertaraf nasional dari Kemdikbud",
      "Trophy dan medali juara",
      "Peluang internship di perusahaan teknologi mitra",
    ],
    requirements: [
      "Mahasiswa aktif S1/D4 perguruan tinggi negeri/swasta Indonesia",
      "Belum pernah lulus sidang tugas akhir",
      "Membentuk tim 3–5 orang dari prodi relevan",
    ],
    tags: ["Mobile", "Android", "iOS", "Inovasi"],
    savedByUser: true,
    popular: true,
  },
  {
    id: 2,
    title: "INAICTA 2026 – Kategori UI/UX Design Challenge",
    organizer: "Kominfo – Kementerian Komunikasi",
    category: "Desain",
    deadline: "2026-07-30",
    registrationFee: 0,
    isFree: true,
    prodi: ["DKV", "Desain Produk", "Informatika"],
    poster: "https://images.unsplash.com/photo-1540612597331-63c67ea382fc?w=600&h=360&fit=crop&auto=format",
    prizes: "Rp 30.000.000",
    participants: "Individu / Tim 2 orang",
    description:
      "Indonesia ICT Award (INAICTA) adalah penghargaan bergengsi di bidang Teknologi Informasi dan Komunikasi. Kategori UI/UX Design Challenge mengundang mahasiswa untuk merancang antarmuka pengguna yang intuitif dan berdampak bagi masyarakat Indonesia.",
    benefits: [
      "Hadiah uang total Rp 30.000.000",
      "Sertifikat internasional",
      "Networking dengan para profesional industri",
    ],
    requirements: [
      "Mahasiswa aktif S1/D3 seluruh Indonesia",
      "File desain dalam format Figma/Adobe XD",
      "Mengangkat tema aksesibilitas digital",
    ],
    tags: ["UI/UX", "Figma", "Prototyping", "Aksesibilitas"],
    savedByUser: false,
    popular: true,
  },
  {
    id: 3,
    title: "National Business Plan Competition FEBUI 2026",
    organizer: "FEB Universitas Indonesia",
    category: "Bisnis",
    deadline: "2026-09-05",
    registrationFee: 150000,
    isFree: false,
    prodi: ["Manajemen", "Akuntansi", "Ekonomi"],
    poster: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=360&fit=crop&auto=format",
    prizes: "Rp 25.000.000 + Beasiswa",
    participants: "Tim 3 orang",
    description:
      "Kompetisi rencana bisnis bergengsi yang diselenggarakan oleh Fakultas Ekonomi dan Bisnis Universitas Indonesia. Peserta ditantang untuk menyusun rencana bisnis yang inovatif, berkelanjutan, dan berdampak positif bagi masyarakat.",
    benefits: [
      "Total hadiah Rp 25.000.000",
      "Beasiswa parsial bagi juara 1",
      "Mentoring dari pelaku bisnis senior",
      "Sertifikat prestisius bertanda tangan Dekan FEBUI",
    ],
    requirements: [
      "Mahasiswa aktif S1 seluruh Indonesia",
      "Tim terdiri dari 3 orang",
      "Menyerahkan proposal bisnis (maks 30 halaman)",
    ],
    tags: ["Business Plan", "Finance", "Marketing"],
    savedByUser: false,
    popular: false,
  },
  {
    id: 4,
    title: "Smart City Innovation Challenge 2026",
    organizer: "Bappenas – Kementerian PPN",
    category: "IT",
    deadline: "2026-06-05",
    registrationFee: 0,
    isFree: true,
    prodi: ["Informatika", "Teknik Sipil", "Planologi"],
    poster: "https://images.unsplash.com/photo-1631350397792-8e0c2de5b637?w=600&h=360&fit=crop&auto=format",
    prizes: "Rp 75.000.000",
    participants: "Tim 3–4 orang",
    description:
      "Tantangan inovasi kota pintar yang mencari solusi teknologi untuk permasalahan perkotaan. Peserta diminta mengembangkan prototipe atau konsep berbasis IoT, data, atau AI yang dapat diterapkan di kota-kota Indonesia.",
    benefits: [
      "Total hadiah Rp 75.000.000",
      "Pilot project di kota mitra IKN",
      "Sertifikat dari Bappenas",
      "Presentasi di forum Smartcity Nasional",
    ],
    requirements: [
      "Mahasiswa aktif S1/S2 PTN/PTS Indonesia",
      "Tim multidisiplin sangat dianjurkan",
      "Mengajukan proposal dan prototype/demo produk",
    ],
    tags: ["Smart City", "IoT", "Data Analytics", "AI"],
    savedByUser: true,
    popular: true,
  },
  {
    id: 5,
    title: "Lomba Fotografi Nusantara 2026",
    organizer: "HIMA Ilmu Komunikasi UGM",
    category: "Seni",
    deadline: "2026-08-01",
    registrationFee: 50000,
    isFree: false,
    prodi: ["Ilmu Komunikasi", "Seni Rupa", "DKV"],
    poster: "https://images.unsplash.com/photo-1773608943272-2f185ec3621b?w=600&h=360&fit=crop&auto=format",
    prizes: "Rp 10.000.000 + Trophy",
    participants: "Individu",
    description:
      "Lomba foto dokumentasi keragaman budaya nusantara yang menangkap esensi kebhinekaan Indonesia. Peserta mengirimkan maksimal 5 karya foto dengan tema 'Harmoni dalam Keberbedaan'.",
    benefits: [
      "Hadiah total Rp 10.000.000",
      "Pameran foto di Galeri Seni Rupa UGM",
      "Sertifikat penghargaan",
      "Publikasi di majalah nasional mitra",
    ],
    requirements: [
      "Mahasiswa aktif S1/D4 seluruh Indonesia",
      "Karya orisinil, belum pernah dipublikasikan",
      "Format RAW/JPEG resolusi min 3000×2000px",
    ],
    tags: ["Fotografi", "Budaya", "Dokumentasi"],
    savedByUser: false,
    popular: false,
  },
  {
    id: 6,
    title: "Olimpiade Statistika Nasional 2026",
    organizer: "BPS – Badan Pusat Statistik",
    category: "Akademik",
    deadline: "2026-09-15",
    registrationFee: 0,
    isFree: true,
    prodi: ["Statistika", "Matematika", "Ekonomi", "Sains Data"],
    poster: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&h=360&fit=crop&auto=format",
    prizes: "Rp 20.000.000 + Sertifikat",
    participants: "Individu",
    description:
      "Olimpiade statistika tingkat nasional yang menantang kemampuan analisis data mahasiswa. Peserta mengerjakan soal-soal analitis berbasis studi kasus nyata dengan data resmi BPS.",
    benefits: [
      "Hadiah total Rp 20.000.000",
      "Sertifikat BNSP nasional",
      "Kesempatan magang di BPS Pusat",
      "Diakui sebagai prestasi akademik",
    ],
    requirements: [
      "Mahasiswa aktif S1/D4 jurusan MIPA/Sosial",
      "Mendaftar secara individu",
      "Mengikuti seleksi tahap 1 (online) dan tahap 2 (onsite Jakarta)",
    ],
    tags: ["Statistika", "Data Analysis", "Matematika"],
    savedByUser: false,
    popular: false,
  },
  {
    id: 7,
    title: "Innovation Design Thinking Competition",
    organizer: "ITS – Institut Teknologi Sepuluh Nopember",
    category: "Desain",
    deadline: "2026-08-10",
    registrationFee: 75000,
    isFree: false,
    prodi: ["Desain Produk", "Informatika", "Teknik Industri"],
    poster: "https://images.unsplash.com/photo-1578401057158-0e58789f5947?w=600&h=360&fit=crop&auto=format",
    prizes: "Rp 15.000.000",
    participants: "Tim 3 orang",
    description:
      "Kompetisi design thinking yang mengajak mahasiswa memecahkan permasalahan sosial melalui pendekatan desain berpusat pada manusia. Tim terbaik presentasi di depan panel juri profesional.",
    benefits: [
      "Hadiah total Rp 15.000.000",
      "Mentoring dari Google dan Tokopedia",
      "Sertifikat dari ITS",
      "Inkubasi ide di Co-working Space ITS",
    ],
    requirements: [
      "Mahasiswa aktif S1/D4 seluruh Indonesia",
      "Tim 3 orang dari prodi berbeda (multidisiplin)",
      "Presentasi dalam Bahasa Indonesia atau Inggris",
    ],
    tags: ["Design Thinking", "Innovation", "Human-Centered"],
    savedByUser: false,
    popular: false,
  },
  {
    id: 8,
    title: "Green Energy Startup Challenge 2026",
    organizer: "PLN Pusat & EBTKE Kementerian ESDM",
    category: "Bisnis",
    deadline: "2026-10-01",
    registrationFee: 0,
    isFree: true,
    prodi: ["Teknik Elektro", "Manajemen", "Informatika", "Teknik Kimia"],
    poster: "https://images.unsplash.com/photo-1594818379496-da1e345b0ded?w=600&h=360&fit=crop&auto=format",
    prizes: "Rp 100.000.000 + Inkubasi",
    participants: "Tim 3–5 orang",
    description:
      "Kompetisi startup energi terbarukan terbesar Indonesia. Tim terpilih mendapatkan modal awal dan program inkubasi 6 bulan bersama PLN untuk mengembangkan inovasi energi hijau.",
    benefits: [
      "Grand Prize Rp 100.000.000",
      "Program inkubasi 6 bulan penuh",
      "Akses ke jaringan investor PLN Ventures",
      "Mentoring dari C-Level PLN dan Pertamina",
    ],
    requirements: [
      "Mahasiswa S1/S2/D4 atau fresh graduate maks 2 tahun",
      "Tim 3–5 orang, boleh lintas universitas",
      "Mengajukan pitch deck dan business model canvas",
    ],
    tags: ["Energy", "Startup", "Sustainability", "Green Tech"],
    savedByUser: false,
    popular: true,
  },
];

export type TeamPost = {
  id: number;
  teamName: string;
  competition: string;
  category: Category;
  description: string;
  contact: string;
  skills: string[];
  postedBy: string;
  postedAt: string;
  slots: number;
  filledSlots: number;
};

export const teamPosts: TeamPost[] = [
  {
    id: 1,
    teamName: "Team InnovaHack",
    competition: "GEMASTIK XVII – Pengembangan Aplikasi Mobile",
    category: "IT",
    description:
      "Tim 2 orang dari Informatika UB, membangun aplikasi pemantauan kualitas udara berbasis IoT. Butuh UI/UX Designer untuk mempercantik tampilan dan pengalaman pengguna aplikasi mobile kami.",
    contact: "WA: 0812-3456-7890 | Instagram: @arif_budi",
    skills: ["#Butuh_UI/UX_Designer", "#Figma", "#Mobile_Designer"],
    postedBy: "Arif Budiman – Informatika UB",
    postedAt: "2026-07-10",
    slots: 3,
    filledSlots: 2,
  },
  {
    id: 2,
    teamName: "Green Futures Collective",
    competition: "Green Energy Startup Challenge 2026",
    category: "Bisnis",
    description:
      "Tim dari Teknik Elektro ITB dengan ide panel surya portabel untuk daerah terpencil. Membutuhkan anggota yang paham Business Plan dan Financial Modeling untuk melengkapi tim.",
    contact: "Email: greenteam@itb.ac.id | Line: @sinta_lia",
    skills: ["#Butuh_Business_Analyst", "#Financial_Model", "#Marketing"],
    postedBy: "Sinta Amelia – Teknik Elektro ITB",
    postedAt: "2026-07-08",
    slots: 4,
    filledSlots: 2,
  },
  {
    id: 3,
    teamName: "Visio Design Studio",
    competition: "INAICTA 2026 – Kategori UI/UX Design",
    category: "Desain",
    description:
      "Designer berpengalaman dari DKV UNS mencari partner INAICTA. Butuh UX Researcher dengan keahlian User Testing dan Design Thinking untuk menghasilkan desain user-centric.",
    contact: "Instagram: @raka_design | Email: raka@student.uns.ac.id",
    skills: ["#Butuh_UX_Researcher", "#User_Testing", "#Design_Thinking"],
    postedBy: "Raka Pratama – DKV UNS",
    postedAt: "2026-07-05",
    slots: 2,
    filledSlots: 1,
  },
  {
    id: 4,
    teamName: "DataWiz Squad",
    competition: "Smart City Innovation Challenge 2026",
    category: "IT",
    description:
      "Tim dari Informatika UNPAD dan Teknik Sipil UNPAD. Punya data engineer dan civil planner. Butuh Data Scientist ahli ML/AI untuk membangun model prediksi kemacetan kota.",
    contact: "WA: 0856-7890-1234 | LinkedIn: maya-putri-datawiz",
    skills: ["#Butuh_Data_Scientist", "#Machine_Learning", "#Python"],
    postedBy: "Maya Putri – Informatika UNPAD",
    postedAt: "2026-07-03",
    slots: 4,
    filledSlots: 3,
  },
];

export type Submission = {
  id: number;
  title: string;
  organizer: string;
  category: string;
  deadline: string;
  isFree: boolean;
  registrationFee: number;
  submittedBy: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
};

export const submissionsData: Submission[] = [
  {
    id: 1,
    title: "Kompetisi Essay Ilmiah Nasional 2026",
    organizer: "LIPI – Badan Riset Inovasi Nasional",
    category: "Akademik",
    deadline: "2026-08-25",
    isFree: true,
    registrationFee: 0,
    submittedBy: "Dewi Rahayu – dirahayu@email.com",
    submittedAt: "2026-07-11",
    status: "pending",
  },
  {
    id: 2,
    title: "Ideathon Fintech ASEAN 2026",
    organizer: "OJK – Otoritas Jasa Keuangan",
    category: "Bisnis",
    deadline: "2026-09-10",
    isFree: false,
    registrationFee: 100000,
    submittedBy: "Bimo Surya – bimosurya@email.com",
    submittedAt: "2026-07-09",
    status: "pending",
  },
  {
    id: 3,
    title: "Game Design Championship Indonesia",
    organizer: "BEKRAF – Badan Ekonomi Kreatif",
    category: "IT",
    deadline: "2026-10-15",
    isFree: true,
    registrationFee: 0,
    submittedBy: "Aldi Kurniawan – aldi.k@email.com",
    submittedAt: "2026-07-07",
    status: "pending",
  },
  {
    id: 4,
    title: "Lomba Karya Tulis Ilmiah FKUI",
    organizer: "Fakultas Kedokteran UI",
    category: "Akademik",
    deadline: "2026-08-05",
    isFree: false,
    registrationFee: 50000,
    submittedBy: "Fitri Handayani – fitri.h@email.com",
    submittedAt: "2026-07-06",
    status: "approved",
  },
  {
    id: 5,
    title: "Kompetisi Animasi Pendek Indonesia",
    organizer: "Asosiasi Animasi Indonesia",
    category: "Seni",
    deadline: "2026-09-20",
    isFree: false,
    registrationFee: 75000,
    submittedBy: "Taufik Hidayat – taufikh@email.com",
    submittedAt: "2026-07-04",
    status: "rejected",
  },
];
