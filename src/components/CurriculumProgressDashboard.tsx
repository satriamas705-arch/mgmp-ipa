import React, { useState } from 'react';
import { ChapterProgress, GradeLevel } from '../types';
import { CheckCircle2, Clock, AlertCircle, BarChart3, TrendingUp, Layers, Award, Printer, Check, Edit3 } from 'lucide-react';

interface CurriculumProgressDashboardProps {
  progressData: ChapterProgress[];
  onUpdateChapterStatus: (id: string, updates: Partial<ChapterProgress>) => void;
}

export const CurriculumProgressDashboard: React.FC<CurriculumProgressDashboardProps> = ({
  progressData,
  onUpdateChapterStatus,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('Semua');
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);

  // Status options
  const statusOptions = ['Selesai', 'Dalam Telaah', 'Proses'] as const;

  const filteredChapters = progressData.filter((item) => {
    if (selectedGrade === 'Semua') return true;
    return item.grade === selectedGrade;
  });

  // Calculate statistics
  const totalChapters = progressData.length;
  const completedChapters = progressData.filter((c) => c.completionPercentage === 100).length;
  const averageCompletion = Math.round(
    progressData.reduce((acc, curr) => acc + curr.completionPercentage, 0) / totalChapters
  );

  const grade7Items = progressData.filter((c) => c.grade === 'Kelas 7');
  const grade8Items = progressData.filter((c) => c.grade === 'Kelas 8');
  const grade9Items = progressData.filter((c) => c.grade === 'Kelas 9');

  const grade7Avg = Math.round(grade7Items.reduce((acc, c) => acc + c.completionPercentage, 0) / grade7Items.length);
  const grade8Avg = Math.round(grade8Items.reduce((acc, c) => acc + c.completionPercentage, 0) / grade8Items.length);
  const grade9Avg = Math.round(grade9Items.reduce((acc, c) => acc + c.completionPercentage, 0) / grade9Items.length);

  // Component statuses counts
  const totalModulDone = progressData.filter((c) => c.modulAjarStatus === 'Selesai').length;
  const totalAtpDone = progressData.filter((c) => c.atpStatus === 'Selesai').length;
  const totalLkpdDone = progressData.filter((c) => c.lkpdStatus === 'Selesai').length;
  const totalAsesmenDone = progressData.filter((c) => c.asesmenStatus === 'Selesai').length;

  const handleQuickStatusChange = (
    chapterId: string,
    field: 'modulAjarStatus' | 'atpStatus' | 'lkpdStatus' | 'asesmenStatus',
    newStatus: 'Selesai' | 'Dalam Telaah' | 'Proses'
  ) => {
    const target = progressData.find((c) => c.id === chapterId);
    if (!target) return;

    const updatedObj = { ...target, [field]: newStatus };
    // Recalculate completion
    let score = 0;
    const calcScore = (st: string) => (st === 'Selesai' ? 25 : st === 'Dalam Telaah' ? 15 : 5);
    score =
      calcScore(updatedObj.modulAjarStatus) +
      calcScore(updatedObj.atpStatus) +
      calcScore(updatedObj.lkpdStatus) +
      calcScore(updatedObj.asesmenStatus);

    onUpdateChapterStatus(chapterId, {
      [field]: newStatus,
      completionPercentage: score,
      lastUpdated: new Date().toISOString().split('T')[0],
    });
  };

  const getStatusBadge = (status: 'Selesai' | 'Dalam Telaah' | 'Proses') => {
    switch (status) {
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Selesai</span>
          </span>
        );
      case 'Dalam Telaah':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700">
            <Clock className="w-3 h-3 text-amber-500" />
            <span>Telaah</span>
          </span>
        );
      case 'Proses':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
            <AlertCircle className="w-3 h-3 text-slate-400" />
            <span>Penyusunan</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Print Report Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard Progres Perangkat Ajar Kurikulum Merdeka
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitoring penyusunan Modul Ajar, ATP, LKPD, dan Asesmen Fase D IPA se-Kabupaten Banyumas.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs no-print shrink-0"
        >
          <Printer className="w-3.5 h-3.5 text-slate-500" />
          <span>Cetak Rekap Progres</span>
        </button>
      </div>

      {/* Top Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Rata-rata Kelengkapan */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Kelengkapan Total Fase D</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-slate-900 tabular-nums">
              {averageCompletion}%
            </span>
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Target 100%
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${averageCompletion}%` }} />
          </div>
        </div>

        {/* Card 2: Fase D Kelas 7 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Kelas 7 (7 Bab Pelajaran)</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-slate-900 tabular-nums">
              {grade7Avg}%
            </span>
            <span className="text-[11px] text-slate-500">
              {grade7Items.filter((c) => c.completionPercentage === 100).length} dari 7 Selesai
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${grade7Avg}%` }} />
          </div>
        </div>

        {/* Card 3: Fase D Kelas 8 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Kelas 8 (5 Bab Pelajaran)</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-slate-900 tabular-nums">
              {grade8Avg}%
            </span>
            <span className="text-[11px] text-slate-500">
              {grade8Items.filter((c) => c.completionPercentage === 100).length} dari 5 Selesai
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${grade8Avg}%` }} />
          </div>
        </div>

        {/* Card 4: Fase D Kelas 9 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Kelas 9 (4 Bab Pelajaran)</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-slate-900 tabular-nums">
              {grade9Avg}%
            </span>
            <span className="text-[11px] text-slate-500">
              {grade9Items.filter((c) => c.completionPercentage === 100).length} dari 4 Selesai
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${grade9Avg}%` }} />
          </div>
        </div>
      </div>

      {/* Component Level Breakdown Strip */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
          Rincian Status 4 Komponen Wajib Perangkat Ajar (Total {totalChapters} Bab)
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500">1. Modul Ajar (RPP Plus)</span>
            <p className="text-lg font-bold font-mono text-emerald-800 mt-1 tabular-nums">
              {totalModulDone} / {totalChapters} ({Math.round((totalModulDone / totalChapters) * 100)}%)
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500">2. Alur Tujuan (ATP & CP)</span>
            <p className="text-lg font-bold font-mono text-emerald-800 mt-1 tabular-nums">
              {totalAtpDone} / {totalChapters} ({Math.round((totalAtpDone / totalChapters) * 100)}%)
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500">3. LKPD Praktikum Lab</span>
            <p className="text-lg font-bold font-mono text-emerald-800 mt-1 tabular-nums">
              {totalLkpdDone} / {totalChapters} ({Math.round((totalLkpdDone / totalChapters) * 100)}%)
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500">4. Bank Soal & Asesmen</span>
            <p className="text-lg font-bold font-mono text-emerald-800 mt-1 tabular-nums">
              {totalAsesmenDone} / {totalChapters} ({Math.round((totalAsesmenDone / totalChapters) * 100)}%)
            </p>
          </div>
        </div>
      </div>

      {/* Filter by Grade */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
          {['Semua', 'Kelas 7', 'Kelas 8', 'Kelas 9'].map((gr) => (
            <button
              key={gr}
              onClick={() => setSelectedGrade(gr)}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedGrade === gr
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {gr}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-500">
          Klik status untuk memperbarui progres secara langsung
        </span>
      </div>

      {/* Progress Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                <th className="py-3 px-4">Tingkat & Bab</th>
                <th className="py-3 px-4">Ruang Lingkup Materi IPA</th>
                <th className="py-3 px-4">Penyusun / Rayon</th>
                <th className="py-3 px-3 text-center">Modul Ajar</th>
                <th className="py-3 px-3 text-center">ATP</th>
                <th className="py-3 px-3 text-center">LKPD</th>
                <th className="py-3 px-3 text-center">Asesmen</th>
                <th className="py-3 px-4 text-right">Kelengkapan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredChapters.map((ch) => (
                <tr key={ch.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-semibold text-slate-900 block">{ch.grade}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Bab {ch.chapterNumber} · {ch.semester}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-900 max-w-xs">
                    <p className="line-clamp-2">{ch.chapterTitle}</p>
                    <span className="text-[10px] text-emerald-800 font-normal">
                      {ch.domain}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                    <p className="font-medium text-slate-800">{ch.leadAuthor}</p>
                    <span className="text-[10px] text-slate-500">{ch.leadSchool}</span>
                  </td>

                  {/* Modul Ajar Toggle */}
                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => {
                        const next =
                          ch.modulAjarStatus === 'Selesai'
                            ? 'Dalam Telaah'
                            : ch.modulAjarStatus === 'Dalam Telaah'
                            ? 'Proses'
                            : 'Selesai';
                        handleQuickStatusChange(ch.id, 'modulAjarStatus', next);
                      }}
                      className="cursor-pointer hover:opacity-80 p-1 rounded"
                      title="Klik untuk ubah status"
                    >
                      {getStatusBadge(ch.modulAjarStatus)}
                    </button>
                  </td>

                  {/* ATP Toggle */}
                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => {
                        const next =
                          ch.atpStatus === 'Selesai'
                            ? 'Dalam Telaah'
                            : ch.atpStatus === 'Dalam Telaah'
                            ? 'Proses'
                            : 'Selesai';
                        handleQuickStatusChange(ch.id, 'atpStatus', next);
                      }}
                      className="cursor-pointer hover:opacity-80 p-1 rounded"
                      title="Klik untuk ubah status"
                    >
                      {getStatusBadge(ch.atpStatus)}
                    </button>
                  </td>

                  {/* LKPD Toggle */}
                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => {
                        const next =
                          ch.lkpdStatus === 'Selesai'
                            ? 'Dalam Telaah'
                            : ch.lkpdStatus === 'Dalam Telaah'
                            ? 'Proses'
                            : 'Selesai';
                        handleQuickStatusChange(ch.id, 'lkpdStatus', next);
                      }}
                      className="cursor-pointer hover:opacity-80 p-1 rounded"
                      title="Klik untuk ubah status"
                    >
                      {getStatusBadge(ch.lkpdStatus)}
                    </button>
                  </td>

                  {/* Asesmen Toggle */}
                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => {
                        const next =
                          ch.asesmenStatus === 'Selesai'
                            ? 'Dalam Telaah'
                            : ch.asesmenStatus === 'Dalam Telaah'
                            ? 'Proses'
                            : 'Selesai';
                        handleQuickStatusChange(ch.id, 'asesmenStatus', next);
                      }}
                      className="cursor-pointer hover:opacity-80 p-1 rounded"
                      title="Klik untuk ubah status"
                    >
                      {getStatusBadge(ch.asesmenStatus)}
                    </button>
                  </td>

                  {/* Completion percentage */}
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums">
                    <span
                      className={`font-bold ${
                        ch.completionPercentage === 100
                          ? 'text-emerald-700'
                          : ch.completionPercentage >= 80
                          ? 'text-slate-800'
                          : 'text-amber-600'
                      }`}
                    >
                      {ch.completionPercentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
