import React from 'react';
import { Atom, Compass, BookOpen, Calendar, ShieldCheck, ChevronRight, Users, Sparkles, FileText } from 'lucide-react';

interface HeroBannerProps {
  onNavigate: (tab: string) => void;
  memberCount: number;
  docCount: number;
  activityCount: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onNavigate,
  memberCount,
  docCount,
  activityCount,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-10 shadow-lg border border-emerald-500/20">
      {/* Decorative subtle scientific wave & mountain grid */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      
      {/* Subtle organic contour representing Mount Slamet & Serayu River */}
      <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-4">
        {/* Unboxed natural editorial kicker */}
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold tracking-wide">
          <span>Kabupaten Banyumas</span>
          <span aria-hidden="true">·</span>
          <span>Dinas Pendidikan Kab. Banyumas</span>
          <span aria-hidden="true">·</span>
          <span>Kurikulum Merdeka Fase D</span>
        </div>

        {/* Hero Title with balance */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15] text-balance">
          Pusat Kolaborasi & Inovasi Guru IPA Kabupaten Banyumas
        </h1>

        {/* Lead Paragraph */}
        <p className="text-xs sm:text-base text-slate-300 leading-relaxed max-w-2xl">
          Wadah profesional Musyawarah Guru Mata Pelajaran (MGMP) IPA SMP se-Banyumas untuk berbagi perangkat ajar berdiferensiasi, riset laboratorium terpadu, pemantauan kurikulum, dan koordinasi pelatihan dinas.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-3">
          <button
            onClick={() => onNavigate('daftar')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-md focus:ring-2 focus:ring-emerald-400"
          >
            <span>Daftar Anggota & KTA Digital</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('perangkat')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Repositori Perangkat Ajar</span>
          </button>

          <button
            onClick={() => onNavigate('jadwal')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:text-emerald-300 transition-colors"
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Lihat Agenda Terdekat</span>
          </button>
        </div>
      </div>

      {/* Quantitative Rigor Strip (Proof metrics placed adjacent to claims) */}
      <div className="relative z-10 mt-8 pt-6 border-t border-emerald-500/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
        <div>
          <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-300 tabular-nums">
            {memberCount}+
          </span>
          <p className="text-[11px] text-slate-300 mt-0.5">Guru IPA Terdaftar</p>
        </div>
        <div>
          <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-300 tabular-nums">
            7
          </span>
          <p className="text-[11px] text-slate-300 mt-0.5">Sub-Rayon se-Banyumas</p>
        </div>
        <div>
          <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-300 tabular-nums">
            {docCount}
          </span>
          <p className="text-[11px] text-slate-300 mt-0.5">Modul & LKPD Tervalidasi</p>
        </div>
        <div>
          <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-300 tabular-nums">
            94%
          </span>
          <p className="text-[11px] text-slate-300 mt-0.5">Progres Kurikulum Fase D</p>
        </div>
      </div>
    </div>
  );
};
