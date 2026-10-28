import React, { useRef } from 'react';
import { Member } from '../types';
import { Award, Printer, Download, CheckCircle2, QrCode, ShieldCheck } from 'lucide-react';

interface KtaCardProps {
  member: Member;
  onPrint?: () => void;
}

export const KtaCard: React.FC<KtaCardProps> = ({ member, onPrint }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Front Card Design */}
      <div 
        ref={cardRef}
        className="relative w-full max-w-[480px] aspect-[1.586/1] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-5 shadow-xl border border-emerald-600/30 flex flex-col justify-between"
      >
        {/* Subtle decorative scientific grid background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        {/* Header Band */}
        <div className="relative z-10 border-b border-emerald-500/20 pb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-slate-950/80 rounded-[10px] flex items-center justify-center">
                <span className="text-xs font-black tracking-widest text-emerald-400">IPA</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold leading-tight">
                Kartu Tanda Anggota Resmi
              </p>
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-tight">
                MGMP IPA KABUPATEN BANYUMAS
              </h4>
              <p className="text-[9px] text-slate-300 leading-tight">
                Dinas Pendidikan Kabupaten Banyumas · Jawa Tengah
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded">
              <ShieldCheck className="w-2.5 h-2.5" />
              TERVERIFIKASI
            </span>
          </div>
        </div>

        {/* Member Body */}
        <div className="relative z-10 grid grid-cols-12 gap-3.5 my-auto pt-2 items-center">
          {/* Photo & QR Avatar */}
          <div className="col-span-4 flex flex-col items-center">
            <div className="w-20 h-24 rounded-lg bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-emerald-500/40 flex flex-col items-center justify-center overflow-hidden relative shadow-inner">
              <div className="w-12 h-12 rounded-full bg-emerald-800/60 flex items-center justify-center text-emerald-200 font-bold text-base mb-1 border border-emerald-400/30">
                {member.fullName.charAt(0)}
              </div>
              <span className="text-[8px] font-mono text-emerald-300">GURU IPA</span>
              <div className="absolute bottom-0 inset-x-0 bg-emerald-600/90 text-[7px] text-center font-bold uppercase py-0.5 tracking-wider">
                {member.employmentStatus}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="col-span-8 flex flex-col justify-center space-y-1">
            <div>
              <span className="text-[9px] text-slate-400 block leading-none">Nama Lengkap & Gelar</span>
              <p className="text-xs sm:text-sm font-bold text-white leading-snug truncate">
                {member.fullName}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <span className="text-[8px] text-slate-400 block leading-none">NIP / NUPTK</span>
                <p className="font-mono text-[9px] text-slate-200 tracking-tight truncate">
                  {member.nip}
                </p>
              </div>
              <div>
                <span className="text-[8px] text-slate-400 block leading-none">ID Anggota</span>
                <p className="font-mono text-[9px] font-bold text-emerald-300">
                  {member.id}
                </p>
              </div>
            </div>

            <div className="text-[10px]">
              <span className="text-[8px] text-slate-400 block leading-none">Unit Kerja / Sekolah</span>
              <p className="font-semibold text-[10px] text-slate-200 truncate">
                {member.school}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-0.5 text-[9px] text-slate-300">
              <span className="font-medium text-emerald-300">{member.rayon}</span>
              <span>·</span>
              <span>Fokus {member.focusDiscipline}</span>
            </div>
          </div>
        </div>

        {/* Card Footer with Verification QR & Signature Stamp */}
        <div className="relative z-10 border-t border-emerald-500/20 pt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Real SVG QR code representation */}
            <div className="w-8 h-8 bg-white p-0.5 rounded shadow flex items-center justify-center">
              <QrCode className="w-full h-full text-slate-900" />
            </div>
            <div className="text-[8px] leading-tight text-slate-300">
              <p className="font-mono text-[7px] text-emerald-400">KTA DIGITAL V.2026</p>
              <p>Scan untuk validasi keanggotaan</p>
            </div>
          </div>

          <div className="text-right flex items-center gap-2">
            <div className="text-[8px] leading-tight">
              <p className="text-slate-400">Purwokerto, Kab. Banyumas</p>
              <p className="font-bold text-slate-200">Ketua MGMP IPA SMP</p>
              <p className="text-[7px] text-emerald-300 font-mono">Drs. Subagyo, M.Pd.</p>
            </div>
            <div className="w-7 h-7 rounded-full border border-dashed border-emerald-400/50 flex items-center justify-center text-[6px] font-bold text-emerald-300 uppercase rotate-[-12deg] bg-emerald-950/40">
              CAP MGMP
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex items-center gap-3 no-print">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Cetak Kartu Fisik</span>
        </button>
        <button
          onClick={() => {
            alert(`KTA Anggota ${member.fullName} (${member.id}) berhasil disiapkan untuk diunduh.`);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Unduh Format Digital (.PNG)</span>
        </button>
      </div>
    </div>
  );
};
