import React, { useState } from 'react';
import { ActivityEvent } from '../types';
import { Calendar, Clock, MapPin, Users, Video, FileText, CheckCircle, Plus, Send, ExternalLink } from 'lucide-react';
import { OfficialLetterModal } from './OfficialLetterModal';

interface ActivityScheduleProps {
  activities: ActivityEvent[];
  onRegisterActivity: (activityId: string, memberEmail: string) => void;
  onSendEmailNotification: (log: {
    recipientEmail: string;
    recipientName: string;
    subject: string;
    eventType: 'Undangan Kegiatan' | 'Pengingat H-1';
    bodyPreview: string;
  }) => void;
  onAddActivity: (activity: ActivityEvent) => void;
}

export const ActivitySchedule: React.FC<ActivityScheduleProps> = ({
  activities,
  onRegisterActivity,
  onSendEmailNotification,
  onAddActivity,
}) => {
  const [filterType, setFilterType] = useState<string>('Semua');
  const [selectedActivityForLetter, setSelectedActivityForLetter] = useState<ActivityEvent | null>(null);
  const [rsvpModalActivity, setRsvpModalActivity] = useState<ActivityEvent | null>(null);
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New activity form states
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<ActivityEvent['type']>('Workshop');
  const [newDate, setNewDate] = useState('2026-11-28');
  const [newTime, setNewTime] = useState('08:30 - 14:00 WIB');
  const [newLocation, setNewLocation] = useState('SMP Negeri 1 Purwokerto');
  const [newSpeaker, setNewSpeaker] = useState('');
  const [newSpeakerTitle, setNewSpeakerTitle] = useState('Fasilitator MGMP IPA');
  const [newDescription, setNewDescription] = useState('');
  const [newCapacity, setNewCapacity] = useState(60);

  const filteredActivities = activities.filter((act) => {
    if (filterType === 'Semua') return true;
    if (filterType === 'Mendatang') return act.status === 'Mendatang';
    if (filterType === 'Selesai') return act.status === 'Selesai';
    if (filterType === 'Daring') return act.isOnline;
    if (filterType === 'Luring') return !act.isOnline;
    return true;
  });

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpModalActivity || !rsvpEmail) return;

    onRegisterActivity(rsvpModalActivity.id, rsvpEmail);

    // Send automated email confirmation
    onSendEmailNotification({
      recipientEmail: rsvpEmail,
      recipientName: rsvpName || 'Bapak/Ibu Guru IPA',
      subject: `[MGMP IPA BMS] Konfirmasi Kehadiran: ${rsvpModalActivity.title}`,
      eventType: 'Undangan Kegiatan',
      bodyPreview: `Konfirmasi pendaftaran Anda untuk kegiatan "${rsvpModalActivity.title}" pada tanggal ${rsvpModalActivity.date} di ${rsvpModalActivity.location} telah tercatat. Silakan bawa surat tugas dari kepala sekolah.`,
    });

    alert(`Pendaftaran kegiatan berhasil! Surat undangan & konfirmasi telah dikirimkan ke ${rsvpEmail}`);
    setRsvpModalActivity(null);
    setRsvpName('');
    setRsvpEmail('');
  };

  const handleSendReminder = (act: ActivityEvent) => {
    onSendEmailNotification({
      recipientEmail: 'seluruh.anggota.mgmp@banyumaskab.go.id',
      recipientName: 'Seluruh Peserta Terdaftar',
      subject: `[PENGINGAT H-1] Kegiatan ${act.title}`,
      eventType: 'Pengingat H-1',
      bodyPreview: `Mengingatkan kembali pelaksanaan kegiatan ${act.title} esok hari (${act.date}) pukul ${act.time} bertempat di ${act.location}.`,
    });
    alert(`Pengingat otomatis H-1 untuk "${act.title}" berhasil disimulasikan dan dicatat di Log Notifikasi!`);
  };

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newAct: ActivityEvent = {
      id: `ACT-2026-${(activities.length + 1).toString().padStart(2, '0')}`,
      title: newTitle,
      type: newType,
      description: newDescription || 'Kegiatan peningkatan kompetensi dan sinkronisasi modul pembelajaran guru IPA Banyumas.',
      date: newDate,
      time: newTime,
      location: newLocation,
      isOnline: newLocation.toLowerCase().includes('zoom') || newLocation.toLowerCase().includes('daring'),
      rayon: 'Kabupaten Banyumas',
      speaker: newSpeaker || 'Tim Pengembang MGMP Banyumas',
      speakerTitle: newSpeakerTitle,
      capacity: Number(newCapacity),
      registeredCount: 1,
      letterNumber: `0${activities.length + 5}/MGMP-IPA/BMS/XI/2026`,
      status: 'Mendatang',
      registeredMembers: [],
    };

    onAddActivity(newAct);
    setShowAddModal(false);
    setNewTitle('');
    setNewSpeaker('');
    setNewDescription('');

    // Send broadcast email notification for new event
    onSendEmailNotification({
      recipientEmail: 'distribusi.guru.ipa@banyumaskab.go.id',
      recipientName: 'Guru IPA se-Banyumas',
      subject: `[AGENDA BARU MGMP] ${newAct.title}`,
      eventType: 'Undangan Kegiatan',
      bodyPreview: `Telah dibuka pendaftaran kegiatan ${newAct.title} untuk tanggal ${newAct.date}. Kuota: ${newAct.capacity} peserta. Segera daftarkan kehadiran Anda melalui portal.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Jadwal Kegiatan & Agenda MGMP
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pelatihan, workshop Kurikulum Merdeka, bedah kisi-kisi asesmen, dan praktikum laboratorium IPA.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter options */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            {['Semua', 'Mendatang', 'Selesai', 'Luring', 'Daring'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  filterType === tab
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Agenda</span>
          </button>
        </div>
      </div>

      {/* Activity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredActivities.map((activity) => {
          const isFull = activity.registeredCount >= activity.capacity;
          const isPassed = activity.status === 'Selesai';

          return (
            <div
              key={activity.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-emerald-800">{activity.type}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-[11px]">{activity.letterNumber}</span>
                  </div>
                  <span className={`text-[11px] font-medium ${isPassed ? 'text-slate-500' : 'text-emerald-700'}`}>
                    {activity.status}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {activity.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {activity.description}
                </p>

                {/* Details Pill-free strip */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-900">{activity.date}</span>
                    <span className="text-slate-400">·</span>
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-slate-700">{activity.time}</span>
                  </div>

                  <div className="flex items-start gap-2">
                    {activity.isOnline ? (
                      <Video className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    <span className="leading-snug">{activity.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Narasumber: <strong>{activity.speaker}</strong></span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions & Capacity Bar */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col gap-3">
                {/* Quota Progress */}
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Kapasitas Peserta:</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-800">
                    {activity.registeredCount} / {activity.capacity} Guru
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isFull ? 'bg-amber-500' : 'bg-emerald-600'
                    }`}
                    style={{
                      width: `${Math.min(100, (activity.registeredCount / activity.capacity) * 100)}%`,
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => setSelectedActivityForLetter(activity)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>Surat Undangan</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {!isPassed && (
                      <button
                        onClick={() => handleSendReminder(activity)}
                        title="Simulasi Kirim Notifikasi Pengingat ke Email Anggota"
                        className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {!isPassed ? (
                      <button
                        onClick={() => setRsvpModalActivity(activity)}
                        disabled={isFull}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors shadow-xs ${
                          isFull
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-emerald-700 text-white hover:bg-emerald-800'
                        }`}
                      >
                        {isFull ? 'Kuota Penuh' : 'Daftar Hadir (RSVP)'}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500 font-medium px-2 py-1 bg-slate-50 rounded">
                        Kegiatan Selesai
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Official Invitation Letter Modal */}
      <OfficialLetterModal
        activity={selectedActivityForLetter}
        onClose={() => setSelectedActivityForLetter(null)}
      />

      {/* RSVP Modal */}
      {rsvpModalActivity && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Formulir Kehadiran Kegiatan MGMP
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Konfirmasi kehadiran Anda pada: <strong className="text-slate-900">{rsvpModalActivity.title}</strong>
            </p>

            <form onSubmit={handleRsvpSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Guru
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Prasetyo, S.Pd."
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Email (Untuk Pengiriman Undangan & Materi)
                </label>
                <input
                  type="email"
                  required
                  placeholder="email.guru@sekolah.sch.id"
                  value={rsvpEmail}
                  onChange={(e) => setRsvpEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="p-3 bg-emerald-50 text-[11px] text-emerald-900 rounded-lg space-y-1">
                <p className="font-semibold">Informasi Pelaksanaan:</p>
                <p>Tanggal: {rsvpModalActivity.date} · Waktu: {rsvpModalActivity.time}</p>
                <p>Lokasi: {rsvpModalActivity.location}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRsvpModalActivity(null)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800"
                >
                  Konfirmasi & Kirim Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Activity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Tambah Agenda Kegiatan MGMP Baru
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Agenda baru akan otomatis diumumkan ke seluruh guru IPA terdaftar melalui notifikasi email.
            </p>

            <form onSubmit={handleCreateActivity} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Kegiatan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Lokakarya Penulisan Modul Ajar Berdiferensiasi IPA"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Kegiatan
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Bimtek">Bimtek</option>
                    <option value="Bedah Kisi-Kisi">Bedah Kisi-Kisi</option>
                    <option value="Praktikum Terpadu">Praktikum Terpadu</option>
                    <option value="Rapat Pleno">Rapat Pleno</option>
                    <option value="Olimpiade IPA">Olimpiade IPA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kapasitas Kursi
                  </label>
                  <input
                    type="number"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Waktu Pelaksanaan
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tempat / Link Daring
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Lab IPA SMPN 1 Purwokerto / Zoom Meeting"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Narasumber
                  </label>
                  <input
                    type="text"
                    value={newSpeaker}
                    onChange={(e) => setNewSpeaker(e.target.value)}
                    placeholder="Nama Narasumber"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gelar / Asosiasi Narasumber
                  </label>
                  <input
                    type="text"
                    value={newSpeakerTitle}
                    onChange={(e) => setNewSpeakerTitle(e.target.value)}
                    placeholder="Pengawas SMP / Dosen Sains"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deskripsi & Tujuan
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Rincian topik dan luaran kegiatan..."
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                >
                  Simpan & Kirim Notifikasi Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
