import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { MemberRegistration } from './components/MemberRegistration';
import { ActivitySchedule } from './components/ActivitySchedule';
import { DocumentRepository } from './components/DocumentRepository';
import { CurriculumProgressDashboard } from './components/CurriculumProgressDashboard';
import { TeacherForum } from './components/TeacherForum';
import { EmailNotificationCenter } from './components/EmailNotificationCenter';
import { Footer } from './components/Footer';
import {
  INITIAL_MEMBERS,
  INITIAL_ACTIVITIES,
  INITIAL_DOCS,
  INITIAL_PROGRESS,
  INITIAL_FORUM_TOPICS,
  INITIAL_EMAIL_LOGS,
} from './data/mockData';
import {
  Member,
  ActivityEvent,
  PerangkatDoc,
  ChapterProgress,
  ForumTopic,
  ForumReply,
  EmailLog,
} from './types';
import {
  Calendar,
  BookOpen,
  BarChart3,
  MessageSquare,
  Users,
  Mail,
  ArrowRight,
  CheckCircle,
  FileText,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('beranda');

  // Persistent States with local storage fallback
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('mgmp_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [activities, setActivities] = useState<ActivityEvent[]>(() => {
    const saved = localStorage.getItem('mgmp_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [documents, setDocuments] = useState<PerangkatDoc[]>(() => {
    const saved = localStorage.getItem('mgmp_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCS;
  });

  const [progressData, setProgressData] = useState<ChapterProgress[]>(() => {
    const saved = localStorage.getItem('mgmp_progress');
    return saved ? JSON.parse(saved) : INITIAL_PROGRESS;
  });

  const [forumTopics, setForumTopics] = useState<ForumTopic[]>(() => {
    const saved = localStorage.getItem('mgmp_forum');
    return saved ? JSON.parse(saved) : INITIAL_FORUM_TOPICS;
  });

  const [emailLogs, setEmailLogs] = useState<EmailLog[]>(() => {
    const saved = localStorage.getItem('mgmp_emails');
    return saved ? JSON.parse(saved) : INITIAL_EMAIL_LOGS;
  });

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('mgmp_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('mgmp_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('mgmp_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('mgmp_progress', JSON.stringify(progressData));
  }, [progressData]);

  useEffect(() => {
    localStorage.setItem('mgmp_forum', JSON.stringify(forumTopics));
  }, [forumTopics]);

  useEffect(() => {
    localStorage.setItem('mgmp_emails', JSON.stringify(emailLogs));
  }, [emailLogs]);

  // Handler: Add Member
  const handleAddMember = (newMember: Member) => {
    setMembers((prev) => [newMember, ...prev]);
  };

  // Handler: Register activity
  const handleRegisterActivity = (activityId: string, memberEmail: string) => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === activityId) {
          const registered = act.registeredMembers || [];
          if (!registered.includes(memberEmail)) {
            return {
              ...act,
              registeredCount: act.registeredCount + 1,
              registeredMembers: [...registered, memberEmail],
            };
          }
        }
        return act;
      })
    );
  };

  // Handler: Add Activity
  const handleAddActivity = (newAct: ActivityEvent) => {
    setActivities((prev) => [newAct, ...prev]);
  };

  // Handler: Upload Document
  const handleUploadDoc = (doc: PerangkatDoc) => {
    setDocuments((prev) => [doc, ...prev]);
  };

  // Handler: Update Chapter Progress
  const handleUpdateChapterStatus = (id: string, updates: Partial<ChapterProgress>) => {
    setProgressData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  // Handler: Add Forum Topic
  const handleAddTopic = (topic: ForumTopic) => {
    setForumTopics((prev) => [topic, ...prev]);
  };

  // Handler: Add Forum Reply
  const handleAddReply = (topicId: string, reply: ForumReply) => {
    setForumTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, replies: [...t.replies, reply] } : t))
    );
  };

  // Handler: Toggle Topic Like
  const handleToggleLikeTopic = (topicId: string) => {
    setForumTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, likes: t.likes + 1 } : t))
    );
  };

  // Handler: Toggle Reply Like
  const handleToggleLikeReply = (topicId: string, replyId: string) => {
    setForumTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          return {
            ...t,
            replies: t.replies.map((r) => (r.id === replyId ? { ...r, likes: r.likes + 1 } : r)),
          };
        }
        return t;
      })
    );
  };

  // Handler: Mark Best Answer
  const handleMarkBestAnswer = (topicId: string, replyId: string) => {
    setForumTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          return {
            ...t,
            hasBestAnswer: true,
            replies: t.replies.map((r) => ({
              ...r,
              isBestAnswer: r.id === replyId,
            })),
          };
        }
        return t;
      })
    );
  };

  // Handler: Automated Email Dispatcher Log
  const handleSendEmailNotification = (data: {
    recipientEmail: string;
    recipientName: string;
    subject: string;
    eventType: EmailLog['eventType'];
    bodyPreview: string;
  }) => {
    const newLog: EmailLog = {
      id: `EML-${Date.now().toString().slice(-4)}`,
      recipientEmail: data.recipientEmail,
      recipientName: data.recipientName,
      subject: data.subject,
      eventType: data.eventType,
      sentAt: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      })}`,
      status: 'Terkirim',
      bodyPreview: data.bodyPreview,
      officialNumber: `0${Math.floor(Math.random() * 50) + 10}/MGMP-IPA/BMS/2026`,
    };
    setEmailLogs((prev) => [newLog, ...prev]);
  };

  // Quick navigation helper
  const navigateTo = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={navigateTo}
        unreadEmailCount={emailLogs.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* VIEW: BERANDA */}
        {activeTab === 'beranda' && (
          <div className="space-y-10">
            {/* Hero Banner */}
            <HeroBanner
              onNavigate={navigateTo}
              memberCount={members.length}
              docCount={documents.length}
              activityCount={activities.length}
            />

            {/* Section 1: Agenda Kegiatan Terdekat */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    Agenda Kegiatan & Workshop Terdekat
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pelatihan dinas, bimbingan teknis lab, dan bedah kisi-kisi asesmen IPA di Kabupaten Banyumas.
                  </p>
                </div>
                <button
                  onClick={() => navigateTo('jadwal')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
                >
                  <span>Lihat Semua Jadwal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activities.slice(0, 3).map((act) => (
                  <div
                    key={act.id}
                    className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                        <span className="font-semibold text-emerald-800">{act.type}</span>
                        <span>{act.date}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2">
                        {act.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">
                        {act.description}
                      </p>
                      <div className="mt-3 text-[11px] text-slate-500 space-y-0.5">
                        <p className="truncate">Tempat: {act.location}</p>
                        <p className="truncate font-mono">
                          Peserta: {act.registeredCount} / {act.capacity} Guru
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-400">
                        {act.letterNumber}
                      </span>
                      <button
                        onClick={() => navigateTo('jadwal')}
                        className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors"
                      >
                        Ikuti Kegiatan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 2: Progres & Perangkat Ajar Terkini (Split) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Progress Snapshot */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Progres Kurikulum Merdeka Fase D
                    </h3>
                  </div>
                  <button
                    onClick={() => navigateTo('progres')}
                    className="text-xs font-semibold text-emerald-800 hover:underline"
                  >
                    Lihat Matriks
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  Status kelengkapan modul ajar, ATP, LKPD lab, dan asesmen oleh tim pengembang MGMP.
                </p>

                <div className="space-y-3 pt-1">
                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span>Fase D Kelas 7 (7 Bab)</span>
                      <span className="font-mono font-bold text-emerald-800">94%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: '94%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span>Fase D Kelas 8 (5 Bab)</span>
                      <span className="font-mono font-bold text-emerald-800">91%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: '91%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span>Fase D Kelas 9 (4 Bab)</span>
                      <span className="font-mono font-bold text-emerald-800">91%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: '91%' }} />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>Modul Unggulan: Kearifan Lokal Serayu & Tempe Mendoan</span>
                  <button
                    onClick={() => navigateTo('progres')}
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                  >
                    Buka Dashboard
                  </button>
                </div>
              </div>

              {/* Right Column: Perangkat Ajar Terbaru */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Perangkat Ajar & Modul Kolaboratif Terbaru
                    </h3>
                  </div>
                  <button
                    onClick={() => navigateTo('perangkat')}
                    className="text-xs font-semibold text-emerald-800 hover:underline"
                  >
                    Semua Dokumen ({documents.length})
                  </button>
                </div>

                <div className="space-y-3">
                  {documents.slice(0, 3).map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 transition-colors flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span className="font-semibold text-emerald-800">{doc.category}</span>
                          <span>·</span>
                          <span>{doc.grade}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 truncate mt-0.5">{doc.title}</h4>
                        <p className="text-slate-500 text-[11px] truncate">
                          Penyusun: {doc.author} ({doc.authorSchool})
                        </p>
                      </div>

                      <button
                        onClick={() => navigateTo('perangkat')}
                        className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-white border border-slate-200 rounded-md hover:bg-emerald-50 shrink-0"
                      >
                        Lihat & Unduh
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: Diskusi Guru Terbaru & Notifikasi Quick Bar */}
            <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Diskusi Populer di Forum Guru IPA
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tanya jawab miskonsepsi siswa, tips praktikum alternatif, dan penilaian formatif.
                  </p>
                </div>
                <button
                  onClick={() => navigateTo('forum')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950"
                >
                  <span>Buka Forum</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {forumTopics.slice(0, 2).map((top) => (
                  <div
                    key={top.id}
                    onClick={() => navigateTo('forum')}
                    className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors bg-slate-50/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                        <span className="font-semibold text-emerald-800">{top.category}</span>
                        <span>{top.createdAt}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2">
                        {top.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {top.content}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Oleh: {top.authorName}</span>
                      <span className="font-semibold text-slate-700">
                        {top.replies.length} Jawaban
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* VIEW: PENDAFTARAN ANGGOTA & KTA DIGITAL */}
        {(activeTab === 'daftar' || activeTab === 'anggota') && (
          <MemberRegistration
            members={members}
            onAddMember={handleAddMember}
            onSendEmailNotification={handleSendEmailNotification}
          />
        )}

        {/* VIEW: JADWAL KEGIATAN */}
        {activeTab === 'jadwal' && (
          <ActivitySchedule
            activities={activities}
            onRegisterActivity={handleRegisterActivity}
            onSendEmailNotification={handleSendEmailNotification}
            onAddActivity={handleAddActivity}
          />
        )}

        {/* VIEW: MANAJEMEN DOKUMEN & PERANGKAT AJAR */}
        {activeTab === 'perangkat' && (
          <DocumentRepository
            documents={documents}
            onUploadDoc={handleUploadDoc}
            onSendEmailNotification={handleSendEmailNotification}
          />
        )}

        {/* VIEW: DASHBOARD PROGRES PERANGKAT AJAR */}
        {activeTab === 'progres' && (
          <CurriculumProgressDashboard
            progressData={progressData}
            onUpdateChapterStatus={handleUpdateChapterStatus}
          />
        )}

        {/* VIEW: FORUM DISKUSI GURU */}
        {activeTab === 'forum' && (
          <TeacherForum
            topics={forumTopics}
            onAddTopic={handleAddTopic}
            onAddReply={handleAddReply}
            onToggleLikeTopic={handleToggleLikeTopic}
            onToggleLikeReply={handleToggleLikeReply}
            onMarkBestAnswer={handleMarkBestAnswer}
            onSendEmailNotification={handleSendEmailNotification}
          />
        )}

        {/* VIEW: PUSAT NOTIFIKASI EMAIL */}
        {activeTab === 'notifikasi' && (
          <EmailNotificationCenter
            logs={emailLogs}
            onTriggerManualEmail={(log) => setEmailLogs((prev) => [log, ...prev])}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}
