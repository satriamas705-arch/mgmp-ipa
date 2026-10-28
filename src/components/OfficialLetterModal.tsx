import React from 'react';
import { ActivityEvent } from '../types';
import { X, Printer, Download, FileText, CheckCircle2 } from 'lucide-react';

interface OfficialLetterModalProps {
  activity: ActivityEvent | null;
  onClose: () => void;
}

export const OfficialLetterModal: React.FC<OfficialLetterModalProps> = ({ activity, onClose }) => {
  if (!activity) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Toolbar */}
        <div className="px-5 py-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-slate-800">
            <FileText className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Surat Undangan & Pemberitahuan Resmi
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Letter Body */}
        <div className="p-8 overflow-y-auto text-slate-900 text-xs sm:text-sm font-serif leading-relaxed">
          {/* Kop Surat Resmi */}
          <div className="border-b-2 border-slate-900 pb-3 mb-6 text-center">
            <h3 className="text-base sm:text-lg font-bold tracking-tight uppercase font-sans">
              PEMERINTAH KABUPATEN BANYUMAS
            </h3>
            <h4 className="text-sm sm:text-base font-bold uppercase font-sans">
              DINAS PENDIDIKAN
            </h4>
            <h5 className="text-xs sm:text-sm font-semibold uppercase tracking-wider font-sans text-emerald-900">
              MUSYAWARAH GURU MATA PELAJARAN (MGMP) IPA SMP
            </h5>
            <p className="text-[11px] font-sans text-slate-600 mt-1">
              Sekretariat: Gedung Guru Kab. Banyumas, Jl. Perintis Kemerdekaan No. 32, Purwokerto 53141
            </p>
          </div>

          {/* Letter Meta */}
          <div className="flex justify-between items-start text-xs mb-6 font-sans">
            <div className="space-y-1">
              <p><span className="w-20 inline-block font-medium">Nomor</span>: {activity.letterNumber}</p>
              <p><span className="w-20 inline-block font-medium">Lampiran</span>: 1 (satu) Berkas Jadwal & Rundown</p>
              <p><span className="w-20 inline-block font-medium">Hal</span>: <strong>Undangan {activity.type} Guru IPA SMP</strong></p>
            </div>
            <div className="text-right">
              <p>Purwokerto, 26 Oktober 2026</p>
              <p className="text-slate-600 mt-1">Kepada Yth.</p>
              <p className="font-bold">Kepala SMP Negeri / Swasta se-Kab. Banyumas</p>
              <p className="text-slate-600">di Tempat</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3 font-sans text-xs sm:text-[13px] leading-relaxed text-slate-800">
            <p>
              Dengan hormat,
            </p>
            <p className="text-justify">
              Dalam rangka peningkatan mutu pembelajaran sains dan penguatan implementasi Kurikulum Merdeka pada jenjang Sekolah Menengah Pertama (SMP) se-Kabupaten Banyumas, Pengurus MGMP IPA Kabupaten Banyumas mengharap kehadiran Bapak/Ibu Guru Mata Pelajaran IPA pada kegiatan:
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 my-3 space-y-1.5 font-sans text-xs">
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-3 font-semibold text-slate-700">Nama Kegiatan</span>
                <span className="col-span-9 font-bold text-slate-900">{activity.title}</span>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-3 font-semibold text-slate-700">Hari, Tanggal</span>
                <span className="col-span-9">{activity.date}</span>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-3 font-semibold text-slate-700">Waktu</span>
                <span className="col-span-9 font-mono">{activity.time}</span>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-3 font-semibold text-slate-700">Tempat</span>
                <span className="col-span-9">{activity.location}</span>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-3 font-semibold text-slate-700">Narasumber</span>
                <span className="col-span-9">{activity.speaker} ({activity.speakerTitle})</span>
              </div>
              {activity.materialsNote && (
                <div className="grid grid-cols-12 gap-2 pt-1 border-t border-slate-200">
                  <span className="col-span-3 font-semibold text-slate-700">Catatan Khusus</span>
                  <span className="col-span-9 text-slate-600 italic">{activity.materialsNote}</span>
                </div>
              )}
            </div>

            <p className="text-justify">
              Mengingat pentingnya agenda tersebut, kami memohon Bapak/Ibu Kepala Sekolah berkenan menugaskan guru mata pelajaran IPA untuk berpartisipasi aktif tepat waktu.
            </p>
            <p>
              Demikian surat undangan ini kami sampaikan. Atas perhatian, dukungan, dan kerja sama yang baik, kami ucapkan terima kasih.
            </p>
          </div>

          {/* Signatures */}
          <div className="mt-8 pt-4 grid grid-cols-2 gap-4 text-center font-sans text-xs">
            <div>
              <p className="text-slate-600">Mengetahui,</p>
              <p className="font-bold text-slate-800">Sekretaris MGMP IPA</p>
              <div className="h-14 flex items-center justify-center">
                <span className="text-[10px] text-slate-400 italic">[Tertanda Digital]</span>
              </div>
              <p className="font-bold text-slate-900 underline">Sri Rahayu Handayani, S.Pd., M.Si.</p>
              <p className="text-[10px] text-slate-500 font-mono">NIP. 19741108 199802 2 003</p>
            </div>
            <div>
              <p className="text-slate-600">Ketua MGMP IPA SMP</p>
              <p className="font-bold text-slate-800">Kabupaten Banyumas</p>
              <div className="h-14 flex items-center justify-center">
                <span className="text-[10px] text-slate-400 italic">[Cap & Tanda Tangan Resmi]</span>
              </div>
              <p className="font-bold text-slate-900 underline">Drs. Subagyo, M.Pd.</p>
              <p className="text-[10px] text-slate-500 font-mono">NIP. 19680512 199303 1 005</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 no-print">
          <span>Tervalidasi Sistem Informasi MGMP IPA Banyumas</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-900 text-white font-medium rounded hover:bg-slate-800"
          >
            Tutup Pratinjau
          </button>
        </div>
      </div>
    </div>
  );
};
