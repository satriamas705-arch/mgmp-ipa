export type RayonBanyumas = 
  | 'Rayon Purwokerto' 
  | 'Rayon Banyumas' 
  | 'Rayon Ajibarang' 
  | 'Rayon Wangon' 
  | 'Rayon Sokaraja' 
  | 'Rayon Jatilawang' 
  | 'Rayon Sumpiuh';

export type DisciplineFocus = 'Fisika' | 'Biologi' | 'Kimia Dasar' | 'IPAS Terpadu';

export type GradeLevel = 'Kelas 7' | 'Kelas 8' | 'Kelas 9';

export interface Member {
  id: string;
  fullName: string;
  nip: string; // NIP or NUPTK
  school: string;
  rayon: RayonBanyumas;
  focusDiscipline: DisciplineFocus;
  teachingGrades: GradeLevel[];
  employmentStatus: 'PNS' | 'PPPK' | 'GTT / Yayasan';
  email: string;
  phone: string;
  registeredAt: string;
  status: 'Aktif' | 'Menunggu Verifikasi' | 'Pengurus Inti';
  roleTitle?: string;
  avatarSeed?: string;
}

export interface ActivityEvent {
  id: string;
  title: string;
  type: 'Workshop' | 'Bimtek' | 'Bedah Kisi-Kisi' | 'Praktikum Terpadu' | 'Rapat Pleno' | 'Olimpiade IPA';
  description: string;
  date: string;
  time: string;
  location: string;
  isOnline: boolean;
  rayon: string;
  speaker: string;
  speakerTitle: string;
  capacity: number;
  registeredCount: number;
  letterNumber: string;
  materialsNote?: string;
  status: 'Mendatang' | 'Berlangsung' | 'Selesai';
  registeredMembers: string[]; // member emails or IDs
}

export interface PerangkatDoc {
  id: string;
  title: string;
  category: 'Modul Ajar' | 'ATP & CP' | 'LKPD Praktikum' | 'Modul P5' | 'Bank Soal & Asesmen';
  grade: GradeLevel | 'Fase D (Semua)';
  semester: 'Semester 1 (Ganjil)' | 'Semester 2 (Genap)' | 'Lengkap';
  topic: string;
  author: string;
  authorSchool: string;
  fileFormat: 'docx' | 'pdf' | 'xlsx';
  fileSize: string;
  downloads: number;
  version: string;
  updatedAt: string;
  reviewStatus: 'Disetujui MGMP' | 'Dalam Telaah' | 'Perlu Revisi';
  summary: string;
  tags: string[];
  revisions: {
    version: string;
    date: string;
    author: string;
    changeLog: string;
  }[];
}

export interface ChapterProgress {
  id: string;
  grade: GradeLevel;
  semester: 'Ganjil' | 'Genap';
  chapterNumber: number;
  chapterTitle: string;
  domain: 'Pemahaman IPA' | 'Keterampilan Proses';
  leadAuthor: string;
  leadSchool: string;
  modulAjarStatus: 'Selesai' | 'Dalam Telaah' | 'Proses';
  atpStatus: 'Selesai' | 'Dalam Telaah' | 'Proses';
  lkpdStatus: 'Selesai' | 'Dalam Telaah' | 'Proses';
  asesmenStatus: 'Selesai' | 'Dalam Telaah' | 'Proses';
  completionPercentage: number;
  lastUpdated: string;
  notes: string;
}

export interface ForumReply {
  id: string;
  topicId: string;
  authorName: string;
  authorSchool: string;
  authorRole?: string;
  content: string;
  createdAt: string;
  isBestAnswer: boolean;
  likes: number;
}

export interface ForumTopic {
  id: string;
  title: string;
  category: 'Fisika' | 'Biologi' | 'Kimia' | 'Kurikulum Merdeka' | 'Laboratorium & Alat' | 'Umum';
  content: string;
  authorName: string;
  authorSchool: string;
  createdAt: string;
  likes: number;
  views: number;
  hasBestAnswer: boolean;
  tags: string[];
  replies: ForumReply[];
}

export interface EmailLog {
  id: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  eventType: 'Registrasi Anggota' | 'Undangan Kegiatan' | 'Rilis Perangkat Ajar' | 'Balasan Diskusi' | 'Pengingat H-1';
  sentAt: string;
  status: 'Terkirim' | 'Diproses';
  bodyPreview: string;
  officialNumber?: string;
}
