import React, { useState } from 'react';
import { ForumTopic, ForumReply } from '../types';
import { MessageSquare, ThumbsUp, CheckCircle, Search, Plus, Filter, CornerDownRight, Tag, HelpCircle, Award } from 'lucide-react';

interface TeacherForumProps {
  topics: ForumTopic[];
  onAddTopic: (topic: ForumTopic) => void;
  onAddReply: (topicId: string, reply: ForumReply) => void;
  onToggleLikeTopic: (topicId: string) => void;
  onToggleLikeReply: (topicId: string, replyId: string) => void;
  onMarkBestAnswer: (topicId: string, replyId: string) => void;
  onSendEmailNotification: (log: {
    recipientEmail: string;
    recipientName: string;
    subject: string;
    eventType: 'Balasan Diskusi';
    bodyPreview: string;
  }) => void;
}

export const TeacherForum: React.FC<TeacherForumProps> = ({
  topics,
  onAddTopic,
  onAddReply,
  onToggleLikeTopic,
  onToggleLikeReply,
  onMarkBestAnswer,
  onSendEmailNotification,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [filterSolved, setFilterSolved] = useState<'Semua' | 'Terselesaikan' | 'Belum Terjawab'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState<ForumTopic | null>(null);
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);

  // New topic form states
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ForumTopic['category']>('Fisika');
  const [newContent, setNewContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorSchool, setAuthorSchool] = useState('SMP Negeri 1 Purwokerto');
  const [newTags, setNewTags] = useState('');

  // Reply form state
  const [replyContent, setReplyContent] = useState('');
  const [replyAuthorName, setReplyAuthorName] = useState('');
  const [replyAuthorSchool, setReplyAuthorSchool] = useState('SMP Negeri di Banyumas');

  const categories = ['Semua', 'Fisika', 'Biologi', 'Kimia', 'Kurikulum Merdeka', 'Laboratorium & Alat', 'Umum'];

  const filteredTopics = topics.filter((t) => {
    const matchesCat = selectedCategory === 'Semua' || t.category === selectedCategory;
    const matchesSolved =
      filterSolved === 'Semua'
        ? true
        : filterSolved === 'Terselesaikan'
        ? t.hasBestAnswer
        : t.replies.length === 0;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSolved && matchesSearch;
  });

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent || !authorName) return;

    const tags = newTags
      ? newTags.split(',').map((t) => t.trim())
      : [newCategory, 'IPA SMP'];

    const newTopicItem: ForumTopic = {
      id: `FRM-${Date.now().toString().slice(-4)}`,
      title: newTitle,
      category: newCategory,
      content: newContent,
      authorName,
      authorSchool,
      createdAt: new Date().toISOString().split('T')[0],
      likes: 1,
      views: 1,
      hasBestAnswer: false,
      tags,
      replies: [],
    };

    onAddTopic(newTopicItem);
    setShowNewTopicModal(false);
    setActiveTopic(newTopicItem);
    setNewTitle('');
    setNewContent('');
    setNewTags('');
  };

  const handleCreateReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTopic || !replyContent || !replyAuthorName) return;

    const newReply: ForumReply = {
      id: `REP-${Date.now().toString().slice(-4)}`,
      topicId: activeTopic.id,
      authorName: replyAuthorName,
      authorSchool: replyAuthorSchool,
      content: replyContent,
      createdAt: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`,
      isBestAnswer: false,
      likes: 0,
    };

    onAddReply(activeTopic.id, newReply);

    // Update active topic local state
    setActiveTopic({
      ...activeTopic,
      replies: [...activeTopic.replies, newReply],
    });

    // Send automatic notification email to topic creator
    onSendEmailNotification({
      recipientEmail: 'penulis.pertanyaan@banyumaskab.go.id',
      recipientName: activeTopic.authorName,
      subject: `[MGMP IPA BMS] Tanggapan Baru pada Diskusi: ${activeTopic.title.slice(0, 45)}...`,
      eventType: 'Balasan Diskusi',
      bodyPreview: `${replyAuthorName} (${replyAuthorSchool}) telah menanggapi topik diskusi Anda: "${replyContent.slice(0, 100)}..."`,
    });

    setReplyContent('');
  };

  const handleMarkBest = (replyId: string) => {
    if (!activeTopic) return;
    onMarkBestAnswer(activeTopic.id, replyId);
    setActiveTopic({
      ...activeTopic,
      hasBestAnswer: true,
      replies: activeTopic.replies.map((r) => ({
        ...r,
        isBestAnswer: r.id === replyId,
      })),
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Forum Diskusi & Kolaborasi Pedagogis Guru IPA
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tanya jawab seputar miskonsepsi siswa, tips praktikum lab, diferensiasi Kurikulum Merdeka, dan asesmen.
          </p>
        </div>

        <button
          onClick={() => setShowNewTopicModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Buat Pertanyaan / Topik Baru</span>
        </button>
      </div>

      {/* Main Forum Split: Left List / Right Active Discussion */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Topic List & Filters */}
        <div className={`space-y-4 ${activeTopic ? 'lg:col-span-5' : 'lg:col-span-12'}`}>
          {/* Search & Filter toolbar */}
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari topik diskusi atau kata kunci..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
              <div className="flex items-center gap-1">
                {(['Semua', 'Terselesaikan', 'Belum Terjawab'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setFilterSolved(mode)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                      filterSolved === mode
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="flex items-center gap-1 overflow-x-auto pt-1 border-t border-slate-100 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                    selectedCategory === cat
                      ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Topics List Cards */}
          <div className="space-y-3">
            {filteredTopics.map((topic) => {
              const isSelected = activeTopic?.id === topic.id;
              return (
                <div
                  key={topic.id}
                  onClick={() => setActiveTopic(topic)}
                  className={`cursor-pointer bg-white rounded-xl border p-4 shadow-xs transition-all ${
                    isSelected
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1.5">
                    <span className="font-semibold text-emerald-800">{topic.category}</span>
                    <div className="flex items-center gap-1">
                      {topic.hasBestAnswer && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>Solusi Terbaik</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                    {topic.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {topic.content}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate max-w-[200px]">
                      {topic.authorName} · {topic.authorSchool}
                    </span>
                    <div className="flex items-center gap-3 shrink-0 font-mono">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3 text-slate-400" />
                        {topic.likes}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <MessageSquare className="w-3 h-3 text-slate-400" />
                        {topic.replies.length}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredTopics.length === 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
                Tidak ada diskusi yang sesuai kriteria.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Thread Detail */}
        {activeTopic && (
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            {/* Thread Header */}
            <div>
              <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-emerald-800">{activeTopic.category}</span>
                  <span>·</span>
                  <span>{activeTopic.createdAt}</span>
                </div>
                <button
                  onClick={() => setActiveTopic(null)}
                  className="lg:hidden text-xs text-slate-500 hover:text-slate-800"
                >
                  Tutup Diskusi
                </button>
              </div>

              <h2 className="text-lg font-bold text-slate-900 leading-snug">
                {activeTopic.title}
              </h2>

              <div className="flex items-center gap-2 mt-2 text-xs text-slate-600">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
                  {activeTopic.authorName.charAt(0)}
                </div>
                <span>
                  Oleh <strong>{activeTopic.authorName}</strong> ({activeTopic.authorSchool})
                </span>
              </div>
            </div>

            {/* Question Content */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
              {activeTopic.content}
            </div>

            {/* Tags & Topic Upvote Bar */}
            <div className="flex items-center justify-between gap-2 text-xs border-b border-slate-100 pb-4">
              <div className="flex items-center gap-1.5 flex-wrap">
                {activeTopic.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <button
                onClick={() => onToggleLikeTopic(activeTopic.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-700" />
                <span>Bermanfaat ({activeTopic.likes})</span>
              </button>
            </div>

            {/* Replies Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Tanggapan & Diskusi Rekan Guru ({activeTopic.replies.length})
                </h4>
                {activeTopic.hasBestAnswer && (
                  <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    Solusi Terpilih Tersedia
                  </span>
                )}
              </div>

              {/* Reply list */}
              <div className="space-y-3">
                {activeTopic.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`rounded-xl p-4 text-xs transition-colors border ${
                      reply.isBestAnswer
                        ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400/30'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-[10px]">
                          {reply.authorName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">
                            {reply.authorName}
                          </p>
                          <span className="text-[10px] text-slate-500">
                            {reply.authorSchool} · {reply.createdAt}
                          </span>
                        </div>
                      </div>

                      {reply.isBestAnswer ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-100 rounded">
                          <CheckCircle className="w-3 h-3" />
                          SOLUSI TERBAIK
                        </span>
                      ) : (
                        <button
                          onClick={() => handleMarkBest(reply.id)}
                          className="text-[11px] font-medium text-slate-500 hover:text-emerald-700"
                        >
                          Tandai Solusi
                        </button>
                      )}
                    </div>

                    <p className="text-slate-800 leading-relaxed whitespace-pre-line mt-2 text-xs sm:text-[13px]">
                      {reply.content}
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Praktik Baik Guru Banyumas</span>
                      <button
                        onClick={() => onToggleLikeReply(activeTopic.id, reply.id)}
                        className="flex items-center gap-1 text-slate-600 hover:text-emerald-700 font-mono"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{reply.likes}</span>
                      </button>
                    </div>
                  </div>
                ))}

                {activeTopic.replies.length === 0 && (
                  <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                    Belum ada tanggapan. Jadilah yang pertama memberikan masukan atau solusi!
                  </div>
                )}
              </div>
            </div>

            {/* Add Reply Form */}
            <form onSubmit={handleCreateReply} className="pt-4 border-t border-slate-200 space-y-3">
              <h5 className="text-xs font-bold text-slate-800">
                Berikan Tanggapan / Bagikan Solusi Anda
              </h5>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap Anda..."
                  value={replyAuthorName}
                  onChange={(e) => setReplyAuthorName(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Asal Sekolah..."
                  value={replyAuthorSchool}
                  onChange={(e) => setReplyAuthorSchool(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <textarea
                rows={3}
                required
                placeholder="Tuliskan saran praktis, pengalaman di kelas, atau referensi materi IPA..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Notifikasi email otomatis akan dikirim ke penanya.
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Kirim Tanggapan
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* New Topic Modal */}
      {showNewTopicModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Mulai Diskusi atau Tanyakan Kendala IPA
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Topik akan dibahas bersama guru IPA se-Kabupaten Banyumas.
            </p>

            <form onSubmit={handleCreateTopic} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Pertanyaan / Pokok Diskusi
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bagaimana menyederhanakan perhitungan kalor jenis pada kelas 7?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori Pembahasan
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                >
                  <option value="Fisika">Fisika SMP</option>
                  <option value="Biologi">Biologi & Ekologi</option>
                  <option value="Kimia">Kimia Dasar</option>
                  <option value="Kurikulum Merdeka">Kurikulum Merdeka & Modul Ajar</option>
                  <option value="Laboratorium & Alat">Laboratorium & Alat Praktikum</option>
                  <option value="Umum">Umum / Kebijakan Dinas</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Guru
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Asal Sekolah
                  </label>
                  <input
                    type="text"
                    placeholder="SMP Negeri ..."
                    value={authorSchool}
                    onChange={(e) => setAuthorSchool(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rincian Pertanyaan / Konteks Kasus di Kelas
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Jelaskan kendala konsep yang dialami siswa atau topik yang ingin didiskusikan..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kata Kunci / Tag (pisahkan koma)
                </label>
                <input
                  type="text"
                  placeholder="Kalor, Praktikum, Kelas 7"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewTopicModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800"
                >
                  Terbitkan Pertanyaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
