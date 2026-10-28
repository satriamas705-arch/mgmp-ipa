import React, { useState } from 'react';
import { PerangkatDoc, GradeLevel } from '../types';
import { FileText, Download, Upload, Search, Filter, History, Eye, CheckCircle2, AlertCircle, Clock, BookOpen, Share2 } from 'lucide-react';

interface DocumentRepositoryProps {
  documents: PerangkatDoc[];
  onUploadDoc: (doc: PerangkatDoc) => void;
  onSendEmailNotification: (log: {
    recipientEmail: string;
    recipientName: string;
    subject: string;
    eventType: 'Rilis Perangkat Ajar';
    bodyPreview: string;
  }) => void;
}

export const DocumentRepository: React.FC<DocumentRepositoryProps> = ({
  documents,
  onUploadDoc,
  onSendEmailNotification,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedGrade, setSelectedGrade] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDocForDetail, setActiveDocForDetail] = useState<PerangkatDoc | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PerangkatDoc['category']>('Modul Ajar');
  const [grade, setGrade] = useState<PerangkatDoc['grade']>('Kelas 7');
  const [semester, setSemester] = useState<PerangkatDoc['semester']>('Semester 1 (Ganjil)');
  const [topic, setTopic] = useState('');
  const [author, setAuthor] = useState('');
  const [authorSchool, setAuthorSchool] = useState('SMP Negeri 1 Purwokerto');
  const [summary, setSummary] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const categories = [
    'Semua',
    'Modul Ajar',
    'ATP & CP',
    'LKPD Praktikum',
    'Modul P5',
    'Bank Soal & Asesmen',
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesCat = selectedCategory === 'Semua' || doc.category === selectedCategory;
    const matchesGrade = selectedGrade === 'Semua' || doc.grade === selectedGrade || doc.grade === 'Fase D (Semua)';
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesGrade && matchesSearch;
  });

  const handleDownload = (doc: PerangkatDoc) => {
    doc.downloads += 1;
    alert(
      `Memulai pengunduhan "${doc.title}" (${doc.fileSize}, format .${doc.fileFormat}). Berkas terverifikasi standar MGMP IPA Banyumas.`
    );
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author) return;

    const tags = tagsInput
      ? tagsInput.split(',').map((t) => t.trim())
      : ['Kurikulum Merdeka', 'Fase D', category];

    const newDoc: PerangkatDoc = {
      id: `DOC-BMS-${(documents.length + 1).toString().padStart(2, '0')}`,
      title,
      category,
      grade,
      semester,
      topic: topic || title,
      author,
      authorSchool,
      fileFormat: category.includes('Soal') ? 'docx' : 'pdf',
      fileSize: '2.5 MB',
      downloads: 1,
      version: 'v1.0',
      updatedAt: new Date().toISOString().split('T')[0],
      reviewStatus: 'Dalam Telaah',
      summary: summary || 'Perangkat ajar kolaboratif guru IPA Banyumas.',
      tags,
      revisions: [
        {
          version: 'v1.0',
          date: new Date().toISOString().split('T')[0],
          author,
          changeLog: 'Unggahan awal perangkat ajar untuk telaah kurikulum',
        },
      ],
    };

    onUploadDoc(newDoc);
    setShowUploadModal(false);

    // Send notification email
    onSendEmailNotification({
      recipientEmail: 'tim.telaah.kurikulum@banyumaskab.go.id',
      recipientName: 'Tim Telaah & Anggota MGMP IPA',
      subject: `[DOKUMEN BARU DIAJUKAN] ${newDoc.title}`,
      eventType: 'Rilis Perangkat Ajar',
      bodyPreview: `Guru ${author} (${authorSchool}) telah mengunggah perangkat ajar baru: "${newDoc.title}". Silakan pelajari dan berikan umpan balik kolaboratif.`,
    });

    alert('Perangkat ajar berhasil diunggah dan notifikasi dikirimkan ke Tim Telaah MGMP!');
    setTitle('');
    setTopic('');
    setSummary('');
    setTagsInput('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Repositori & Manajemen Dokumen Perangkat Ajar
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Berbagi dan menyelaraskan Modul Ajar Kurikulum Merdeka, ATP, LKPD Praktikum, Modul P5, dan Bank Soal.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors shadow-sm shrink-0"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Unggah Perangkat Ajar</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        {/* Top search & Grade pills */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari materi, judul, topik, atau penulis..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full md:w-auto">
            <span className="text-xs text-slate-500 font-medium mr-1">Tingkat:</span>
            {['Semua', 'Kelas 7', 'Kelas 8', 'Kelas 9'].map((gr) => (
              <button
                key={gr}
                onClick={() => setSelectedGrade(gr)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  selectedGrade === gr
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {gr}
              </button>
            ))}
          </div>
        </div>

        {/* Categories segmented buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pt-2 border-t border-slate-100 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map((doc) => {
          const isApproved = doc.reviewStatus === 'Disetujui MGMP';
          return (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                {/* Meta row */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="text-emerald-800 font-semibold">{doc.category}</span>
                    <span>·</span>
                    <span>{doc.grade}</span>
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-slate-600">
                    {doc.version}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                  {doc.title}
                </h3>

                {/* Topic & Summary */}
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {doc.summary}
                </p>

                {/* Author Info */}
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                  <p>
                    Penyusun: <strong className="text-slate-800">{doc.author}</strong>
                  </p>
                  <p className="truncate text-slate-600">{doc.authorSchool}</p>
                </div>

                {/* Tags row */}
                <div className="mt-2.5 flex flex-wrap gap-1 text-[10px] text-slate-500">
                  {doc.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="after:content-['·'] last:after:content-none mr-1">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono tabular-nums">
                  <span>{doc.fileSize}</span>
                  <span>·</span>
                  <span>{doc.downloads} unduhan</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveDocForDetail(doc)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                    title="Pratinjau & Riwayat Revisi"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDownload(doc)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>Unduh</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDocs.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-800">Tidak ada perangkat ajar ditemukan</p>
          <p className="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian atau kategori filter.</p>
        </div>
      )}

      {/* Document Detail & Revision Modal */}
      {activeDocForDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                  {activeDocForDetail.category} · {activeDocForDetail.grade}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">
                  {activeDocForDetail.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveDocForDetail(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs text-slate-700">
              <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 space-y-2">
                <p><strong>Topik / Bab:</strong> {activeDocForDetail.topic}</p>
                <p><strong>Penyusun Utama:</strong> {activeDocForDetail.author} ({activeDocForDetail.authorSchool})</p>
                <p><strong>Status Validasi:</strong> <span className="font-semibold text-emerald-800">{activeDocForDetail.reviewStatus}</span></p>
                <p><strong>Format & Ukuran:</strong> Berkas .{activeDocForDetail.fileFormat} ({activeDocForDetail.fileSize})</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Deskripsi & Ruang Lingkup Materi:</h4>
                <p className="text-slate-600 leading-relaxed">{activeDocForDetail.summary}</p>
              </div>

              {/* Revision History */}
              <div>
                <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-2">
                  <History className="w-3.5 h-3.5 text-slate-500" />
                  <span>Riwayat Revisi & Kolaborasi</span>
                </div>
                <div className="space-y-2 border-l-2 border-slate-200 pl-3 ml-1">
                  {activeDocForDetail.revisions.map((rev, i) => (
                    <div key={i} className="text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-emerald-800">{rev.version}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500">{rev.date}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-700 font-medium">{rev.author}</span>
                      </div>
                      <p className="text-slate-600 mt-0.5 text-[11px]">{rev.changeLog}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Terakhir diperbarui: {activeDocForDetail.updatedAt}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveDocForDetail(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    handleDownload(activeDocForDetail);
                    setActiveDocForDetail(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Dokumen Lengkap</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Unggah Perangkat Ajar Baru untuk Ditelaah
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Perangkat ajar yang diunggah akan masuk ke antrean telaah MGMP dan dapat digunakan guru se-Banyumas.
            </p>

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Dokumen Perangkat Ajar
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Modul Ajar: Sistem Pencernaan & Nutrisi Manusia"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Perangkat
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="Modul Ajar">Modul Ajar (RPP Plus)</option>
                    <option value="ATP & CP">ATP & CP</option>
                    <option value="LKPD Praktikum">LKPD Praktikum</option>
                    <option value="Modul P5">Modul P5 Kearifan Lokal</option>
                    <option value="Bank Soal & Asesmen">Bank Soal & Asesmen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sasaran Jenjang
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="Kelas 7">Fase D - Kelas 7</option>
                    <option value="Kelas 8">Fase D - Kelas 8</option>
                    <option value="Kelas 9">Fase D - Kelas 9</option>
                    <option value="Fase D (Semua)">Fase D (Semua Tingkat)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Penyusun
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap Guru"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Asal Sekolah
                  </label>
                  <input
                    type="text"
                    value={authorSchool}
                    onChange={(e) => setAuthorSchool(e.target.value)}
                    placeholder="SMPN ..."
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deskripsi / Ringkasan Modul & Elemen Capaian
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ringkasan tujuan pembelajaran, model berdiferensiasi, dan alat peraga yang digunakan..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Label / Tags (pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  placeholder="Banyumas, Ekosistem, Diferensiasi, Kelas 7"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800"
                >
                  Kirim & Beritahu Tim Kurikulum
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
