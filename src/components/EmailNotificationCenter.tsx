import React, { useState } from 'react';
import { EmailLog } from '../types';
import { Mail, Send, CheckCircle2, Eye, Clock, RefreshCw, Bell, Shield, Filter, Search } from 'lucide-react';

interface EmailNotificationCenterProps {
  logs: EmailLog[];
  onTriggerManualEmail: (log: EmailLog) => void;
}

export const EmailNotificationCenter: React.FC<EmailNotificationCenterProps> = ({
  logs,
  onTriggerManualEmail,
}) => {
  const [selectedLogForPreview, setSelectedLogForPreview] = useState<EmailLog | null>(null);
  const [filterType, setFilterType] = useState<string>('Semua');
  const [searchEmail, setSearchEmail] = useState('');

  // Dispatch Simulator state
  const [simEventType, setSimEventType] = useState<EmailLog['eventType']>('Undangan Kegiatan');
  const [simRecipientEmail, setSimRecipientEmail] = useState('bambang.smp1bms@gmail.com');
  const [simRecipientName, setSimRecipientName] = useState('Drs. Bambang Sudarsono, M.Pd.');
  const [simCustomMessage, setSimCustomMessage] = useState('');

  const filteredLogs = logs.filter((log) => {
    const matchesType = filterType === 'Semua' || log.eventType === filterType;
    const matchesSearch =
      log.recipientEmail.toLowerCase().includes(searchEmail.toLowerCase()) ||
      log.recipientName.toLowerCase().includes(searchEmail.toLowerCase()) ||
      log.subject.toLowerCase().includes(searchEmail.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleSimulateDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simRecipientEmail || !simRecipientName) return;

    let generatedSubject = '';
    let generatedBody = '';
    let officialNumber = `0${Math.floor(Math.random() * 80) + 10}/MGMP-IPA/BMS/X/2026`;

    switch (simEventType) {
      case 'Undangan Kegiatan':
        generatedSubject = `[MGMP IPA BMS] Undangan Resmi Lokakarya Kurikulum Merdeka Terpadu`;
        generatedBody = `Yth. ${simRecipientName}, Anda diundang menghadiri Lokakarya Praktikum & Modul Ajar Sains SMP. ${
          simCustomMessage || 'Mohon hadir tepat waktu dengan membawa perangkat laptop.'
        }`;
        break;
      case 'Pengingat H-1':
        generatedSubject = `[PENGINGAT H-1] Kegiatan MGMP IPA Besok Pagi Pukul 08:30 WIB`;
        generatedBody = `Yth. ${simRecipientName}, mengingatkan pelaksanaan Bimtek Laboratorium IPA Terpadu esok hari di SMPN 2 Purwokerto. ${
          simCustomMessage || 'Materi dan rundown telah tersedia di portal.'
        }`;
        break;
      case 'Registrasi Anggota':
        generatedSubject = `[MGMP IPA BMS] KTA Digital & Nomor Keanggotaan Telah Aktif`;
        generatedBody = `Selamat ${simRecipientName}, pendaftaran Anda di MGMP IPA Banyumas telah diverifikasi. KTA digital Anda dapat diunduh di portal.`;
        break;
      case 'Rilis Perangkat Ajar':
        generatedSubject = `[PERANGKAT AJAR BARU] Modul Ajar IPA Fase D Siap Diunduh`;
        generatedBody = `Yth. ${simRecipientName}, tim kurikulum MGMP IPA Banyumas baru saja mengesahkan Modul Ajar & LKPD Praktikum terbaru untuk jenjang SMP.`;
        break;
      case 'Balasan Diskusi':
        generatedSubject = `[FORUM MGMP] Ada Tanggapan Baru pada Pertanyaan Anda`;
        generatedBody = `Yth. ${simRecipientName}, rekan guru IPA telah memberikan solusi dan saran pedagogis pada topik diskusi yang Anda buat.`;
        break;
    }

    const newLogItem: EmailLog = {
      id: `EML-${Date.now().toString().slice(-4)}`,
      recipientEmail: simRecipientEmail,
      recipientName: simRecipientName,
      subject: generatedSubject,
      eventType: simEventType,
      sentAt: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      })}`,
      status: 'Terkirim',
      bodyPreview: generatedBody,
      officialNumber,
    };

    onTriggerManualEmail(newLogItem);
    setSelectedLogForPreview(newLogItem);
    setSimCustomMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Pusat Notifikasi & Pengiriman Email Otomatis
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Sistem pengiriman email otomatis terintegrasi untuk undangan kegiatan, rilis modul ajar, dan status keanggotaan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>SMTP Server Terhubung</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Left Simulator / Right Sent Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Email Dispatch Simulator */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Send className="w-4 h-4 text-emerald-700" />
              <span>Simulasi Kirim Notifikasi Email Otomatis</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Uji pengiriman notifikasi instan kepada guru anggota menggunakan format kop resmi MGMP.
            </p>
          </div>

          <form onSubmit={handleSimulateDispatch} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori Notifikasi Otomatis
              </label>
              <select
                value={simEventType}
                onChange={(e) => setSimEventType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Undangan Kegiatan">Undangan Kegiatan & Workshop MGMP</option>
                <option value="Pengingat H-1">Pengingat H-1 Kegiatan (Reminder)</option>
                <option value="Registrasi Anggota">Penerbitan KTA & Selamat Datang</option>
                <option value="Rilis Perangkat Ajar">Rilis Dokumen Modul Ajar Baru</option>
                <option value="Balasan Diskusi">Tanggapan Diskusi Forum IPA</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Penerima Guru
              </label>
              <input
                type="text"
                required
                value={simRecipientName}
                onChange={(e) => setSimRecipientName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Penerima
              </label>
              <input
                type="email"
                required
                value={simRecipientEmail}
                onChange={(e) => setSimRecipientEmail(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan Tambahan (Opsional)
              </label>
              <textarea
                rows={2}
                value={simCustomMessage}
                onChange={(e) => setSimCustomMessage(e.target.value)}
                placeholder="Pesan khusus untuk penerima..."
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim & Simpan ke Riwayat Email</span>
              </button>
            </div>
          </form>

          {/* Trigger rules informational strip */}
          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-600 space-y-1.5">
            <p className="font-semibold text-slate-800">Skenario Otomatisasi Sistem:</p>
            <p>1. Guru mendaftar KTA → Email konfirmasi & KTA terbit dikirim otomatis.</p>
            <p>2. Guru klik RSVP jadwal kegiatan → Surat undangan & barcode tiket terkirim otomatis.</p>
            <p>3. Tim kurikulum meluluskan modul ajar → Notifikasi blast ke 180+ guru se-Banyumas.</p>
            <p>4. Guru membalas forum diskusi → Email pemberitahuan ke penulis pertanyaan.</p>
          </div>
        </div>

        {/* Right Column: Sent Logs List & Search */}
        <div className="lg:col-span-7 space-y-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="Cari penerima atau subjek..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 w-full sm:w-auto"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Undangan Kegiatan">Undangan Kegiatan</option>
              <option value="Pengingat H-1">Pengingat H-1</option>
              <option value="Registrasi Anggota">Registrasi Anggota</option>
              <option value="Rilis Perangkat Ajar">Rilis Perangkat Ajar</option>
              <option value="Balasan Diskusi">Balasan Diskusi</option>
            </select>
          </div>

          {/* Email Logs List */}
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                onClick={() => setSelectedLogForPreview(log)}
                className="p-4 hover:bg-slate-50/80 transition-colors cursor-pointer flex items-start justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-emerald-800">{log.eventType}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-[11px] font-mono text-slate-500">{log.sentAt}</span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {log.subject}
                  </h4>

                  <p className="text-xs text-slate-500 truncate">
                    Kepada: <strong className="text-slate-700">{log.recipientName}</strong> ({log.recipientEmail})
                  </p>

                  <p className="text-[11px] text-slate-600 line-clamp-1 italic">
                    "{log.bodyPreview}"
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {log.status}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLogForPreview(log);
                    }}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                    title="Lihat Pratinjau Email Resmi"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {filteredLogs.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">
                Tidak ada log email yang sesuai dengan pencarian.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HTML Email Modal Preview */}
      {selectedLogForPreview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Window bar */}
            <div className="px-5 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Mail className="w-4 h-4 text-emerald-700" />
                <span>Pratinjau Pesan Email Masuk (Email Client View)</span>
              </div>
              <button
                onClick={() => setSelectedLogForPreview(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Email Headers */}
            <div className="p-5 bg-slate-50 border-b border-slate-200 text-xs space-y-1.5">
              <p><strong className="text-slate-500">Dari:</strong> MGMP IPA SMP Kab. Banyumas &lt;noreply@mgmp-ipa.banyumaskab.go.id&gt;</p>
              <p><strong className="text-slate-500">Kepada:</strong> {selectedLogForPreview.recipientName} &lt;{selectedLogForPreview.recipientEmail}&gt;</p>
              <p><strong className="text-slate-500">Subjek:</strong> <strong className="text-slate-900">{selectedLogForPreview.subject}</strong></p>
              <p><strong className="text-slate-500">Waktu Kirim:</strong> {selectedLogForPreview.sentAt} WIB</p>
            </div>

            {/* Styled Email Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-800">
              {/* Kop Header */}
              <div className="border-b border-emerald-700 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-emerald-900 text-sm sm:text-base leading-tight">
                    MGMP IPA KABUPATEN BANYUMAS
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Dinas Pendidikan Kab. Banyumas · Jawa Tengah
                  </p>
                </div>
                <div className="text-right text-[10px] text-slate-400 font-mono">
                  SISTEM OTOMATIS
                </div>
              </div>

              {/* Greeting */}
              <p>
                Yth. Bapak/Ibu <strong>{selectedLogForPreview.recipientName}</strong>,
              </p>

              {/* Body */}
              <div className="p-4 bg-emerald-50/50 rounded-lg border border-emerald-100 text-xs leading-relaxed text-slate-800">
                {selectedLogForPreview.bodyPreview}
              </div>

              {/* Call to action button */}
              <div className="py-2 text-center">
                <button
                  onClick={() => {
                    alert('Membuka tautan portal dokumen / KTA digital MGMP IPA Banyumas...');
                  }}
                  className="px-5 py-2.5 bg-emerald-700 text-white font-bold text-xs rounded-lg hover:bg-emerald-800 shadow-sm"
                >
                  Buka Portal MGMP IPA Banyumas
                </button>
              </div>

              {/* Footer notice */}
              <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
                <p>
                  Pesan ini dikirimkan secara otomatis oleh Sistem Informasi Manajemen MGMP IPA SMP Kabupaten Banyumas.
                </p>
                <p>
                  Sekretariat: Gedung Guru Kabupaten Banyumas, Jl. Perintis Kemerdekaan No. 32 Purwokerto.
                </p>
              </div>
            </div>

            {/* Modal Bottom Close */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setSelectedLogForPreview(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
