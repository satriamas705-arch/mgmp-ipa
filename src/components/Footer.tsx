import React from 'react';
import { Atom, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-16 bg-white border-t border-slate-200 text-slate-600 text-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
                <Atom className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-900">
                MGMP IPA SMP Kabupaten Banyumas
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed text-xs">
              Organisasi musyawarah profesi guru mata pelajaran Ilmu Pengetahuan Alam (IPA) jenjang SMP/MTs Kabupaten Banyumas di bawah naungan Dinas Pendidikan Kabupaten Banyumas.
            </p>
            <div className="space-y-1 text-slate-600 pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <span>Gedung Guru Kab. Banyumas, Jl. Perintis Kemerdekaan No. 32, Purwokerto 53141</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>sekretariat@mgmp-ipa.banyumaskab.go.id</span>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
              Layanan Portal
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => onNavigate('daftar')}
                  className="hover:text-emerald-700 transition-colors text-left"
                >
                  Registrasi Anggota & KTA Digital
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('jadwal')}
                  className="hover:text-emerald-700 transition-colors text-left"
                >
                  Jadwal Kegiatan & Undangan Resmi
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('perangkat')}
                  className="hover:text-emerald-700 transition-colors text-left"
                >
                  Repositori Modul Ajar Fase D
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('progres')}
                  className="hover:text-emerald-700 transition-colors text-left"
                >
                  Dashboard Progres Bab Pelajaran
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('forum')}
                  className="hover:text-emerald-700 transition-colors text-left"
                >
                  Forum Tanya Jawab Guru IPA
                </button>
              </li>
            </ul>
          </div>

          {/* Sub-Rayon Info */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
              Wilayah Koordinasi 7 Sub-Rayon
            </h4>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Rayon Purwokerto · Rayon Banyumas · Rayon Ajibarang · Rayon Wangon · Rayon Sokaraja · Rayon Jatilawang · Rayon Sumpiuh
            </p>
            <div className="pt-2">
              <span className="text-[11px] text-slate-400 block">
                Didukung oleh:
              </span>
              <span className="font-semibold text-slate-700 text-xs">
                Dinas Pendidikan Kabupaten Banyumas & Balai Guru Penggerak Jawa Tengah
              </span>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <p>© 2026 MGMP IPA Kabupaten Banyumas. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-4">
            <span>Standar Kurikulum Merdeka</span>
            <span>·</span>
            <span>Fase D (SMP/MTs)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
