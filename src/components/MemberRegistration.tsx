import React, { useState } from 'react';
import { Member, RayonBanyumas, DisciplineFocus, GradeLevel } from '../types';
import { BANYUMAS_RAYONS, SCHOOL_SUGGESTIONS } from '../data/mockData';
import { KtaCard } from './KtaCard';
import { Search, UserPlus, CheckCircle, Shield, Building2, MapPin, Mail, Phone, BookOpen, Filter, IdCard, Users } from 'lucide-react';

interface MemberRegistrationProps {
  members: Member[];
  onAddMember: (newMember: Member) => void;
  onSendEmailNotification: (log: {
    recipientEmail: string;
    recipientName: string;
    subject: string;
    eventType: 'Registrasi Anggota';
    bodyPreview: string;
  }) => void;
}

export const MemberRegistration: React.FC<MemberRegistrationProps> = ({
  members,
  onAddMember,
  onSendEmailNotification,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'form' | 'direktori'>('form');
  const [selectedMemberForKta, setSelectedMemberForKta] = useState<Member | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRayon, setFilterRayon] = useState<string>('Semua');
  const [filterDiscipline, setFilterDiscipline] = useState<string>('Semua');
  const [isSuccessRegistered, setIsSuccessRegistered] = useState(false);
  const [newlyCreatedMember, setNewlyCreatedMember] = useState<Member | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [nip, setNip] = useState('');
  const [school, setSchool] = useState('');
  const [customSchool, setCustomSchool] = useState('');
  const [rayon, setRayon] = useState<RayonBanyumas>('Rayon Purwokerto');
  const [focusDiscipline, setFocusDiscipline] = useState<DisciplineFocus>('Fisika');
  const [teachingGrades, setTeachingGrades] = useState<GradeLevel[]>(['Kelas 7']);
  const [employmentStatus, setEmploymentStatus] = useState<'PNS' | 'PPPK' | 'GTT / Yayasan'>('PNS');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const toggleGrade = (grade: GradeLevel) => {
    if (teachingGrades.includes(grade)) {
      if (teachingGrades.length > 1) {
        setTeachingGrades(teachingGrades.filter((g) => g !== grade));
      }
    } else {
      setTeachingGrades([...teachingGrades, grade]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !nip) return;

    const chosenSchool = school === 'Lainnya' ? customSchool : school || 'SMP Negeri 1 Purwokerto';
    const nextSeq = members.length + 1;
    const padded = nextSeq.toString().padStart(3, '0');
    const newId = `MGMP-IPA-BMS-${padded}`;

    const newMemberObj: Member = {
      id: newId,
      fullName,
      nip,
      school: chosenSchool,
      rayon,
      focusDiscipline,
      teachingGrades,
      employmentStatus,
      email,
      phone: phone || '0812-xxxx-xxxx',
      registeredAt: new Date().toISOString().split('T')[0],
      status: 'Aktif',
    };

    onAddMember(newMemberObj);
    setNewlyCreatedMember(newMemberObj);
    setIsSuccessRegistered(true);

    // Trigger automatic confirmation email
    onSendEmailNotification({
      recipientEmail: email,
      recipientName: fullName,
      subject: `[MGMP IPA BMS] Pendaftaran Berhasil & KTA Digital Diterbitkan (${newId})`,
      eventType: 'Registrasi Anggota',
      bodyPreview: `Selamat Bapak/Ibu ${fullName}, data keanggotaan Anda di MGMP IPA Kabupaten Banyumas telah diverifikasi. Nomor KTA: ${newId}, Unit Kerja: ${chosenSchool}.`,
    });
  };

  const handleResetForm = () => {
    setFullName('');
    setNip('');
    setSchool('');
    setCustomSchool('');
    setEmail('');
    setPhone('');
    setIsSuccessRegistered(false);
    setNewlyCreatedMember(null);
  };

  // Filtered members for directory
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.nip.includes(searchQuery);
    const matchesRayon = filterRayon === 'Semua' || m.rayon === filterRayon;
    const matchesDiscipline = filterDiscipline === 'Semua' || m.focusDiscipline === filterDiscipline;
    return matchesSearch && matchesRayon && matchesDiscipline;
  });

  return (
    <div className="space-y-6">
      {/* Sub navigation bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Keanggotaan Guru IPA Banyumas
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Registrasi resmi guru IPA SMP se-Kabupaten Banyumas, kartu tanda anggota (KTA) digital, dan direktori.
          </p>
        </div>

        {/* Tab switch buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => setActiveSubTab('form')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeSubTab === 'form'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Formulir Pendaftaran
          </button>
          <button
            onClick={() => setActiveSubTab('direktori')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'direktori'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Direktori Anggota</span>
            <span className="px-1.5 py-0.2 text-[10px] font-mono bg-slate-200 text-slate-800 rounded-full">
              {members.length}
            </span>
          </button>
        </div>
      </div>

      {/* View 1: Form Pendaftaran */}
      {activeSubTab === 'form' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 sm:p-7 shadow-xs">
            {!isSuccessRegistered ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">
                    Formulir Registrasi Anggota Baru
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pastikan NIP/NUPTK dan data sekolah sesuai dengan pangkalan data Dapodik / Simpatika.
                  </p>
                </div>

                {/* Nama Lengkap & Gelar */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap beserta Gelar Akademik <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Dra. Sri Wahyuningsih, M.Pd."
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                </div>

                {/* NIP & Status Kepegawaian */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      NIP / NUPTK / PegID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={nip}
                      onChange={(e) => setNip(e.target.value)}
                      placeholder="19820510 200903 2 007"
                      className="w-full px-3.5 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Status Kepegawaian
                    </label>
                    <select
                      value={employmentStatus}
                      onChange={(e) => setEmploymentStatus(e.target.value as any)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="PNS">PNS (Pegawai Negeri Sipil)</option>
                      <option value="PPPK">PPPK (P3K Kemdikbud)</option>
                      <option value="GTT / Yayasan">GTT / Guru Tetap Yayasan</option>
                    </select>
                  </div>
                </div>

                {/* Sekolah & Rayon */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Asal Unit Kerja / Sekolah <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="">-- Pilih Sekolah di Banyumas --</option>
                      {SCHOOL_SUGGESTIONS.map((sch) => (
                        <option key={sch} value={sch}>
                          {sch}
                        </option>
                      ))}
                      <option value="Lainnya">Sekolah Lainnya (Ketik Manual)</option>
                    </select>
                    {school === 'Lainnya' && (
                      <input
                        type="text"
                        placeholder="Ketik nama sekolah lengkap..."
                        value={customSchool}
                        onChange={(e) => setCustomSchool(e.target.value)}
                        className="mt-2 w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Wilayah Sub-Rayon MGMP
                    </label>
                    <select
                      value={rayon}
                      onChange={(e) => setRayon(e.target.value as RayonBanyumas)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      {BANYUMAS_RAYONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Fokus & Jenjang */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Fokus Keilmuan / Peminatan
                    </label>
                    <select
                      value={focusDiscipline}
                      onChange={(e) => setFocusDiscipline(e.target.value as DisciplineFocus)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="Fisika">Fisika SMP</option>
                      <option value="Biologi">Biologi & Ekologi</option>
                      <option value="Kimia Dasar">Kimia Dasar & Zat</option>
                      <option value="IPAS Terpadu">IPAS Terpadu / Kurikulum Merdeka</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Jenjang Kelas yang Diampu
                    </label>
                    <div className="flex items-center gap-2 pt-1">
                      {(['Kelas 7', 'Kelas 8', 'Kelas 9'] as GradeLevel[]).map((grade) => (
                        <button
                          type="button"
                          key={grade}
                          onClick={() => toggleGrade(grade)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                            teachingGrades.includes(grade)
                              ? 'bg-emerald-700 text-white border-emerald-700'
                              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                          }`}
                        >
                          {grade}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Kontak Email & WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Alamat Email Aktif <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama.guru@gmail.com"
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      KTA digital & notifikasi resmi dikirimkan ke email ini.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nomor WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0812-3456-7890"
                      className="w-full px-3.5 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Data tersimpan aman di database MGMP IPA Banyumas.
                  </span>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors shadow-sm focus:ring-2 focus:ring-emerald-600"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Daftar & Terbitkan KTA</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Success screen */
              <div className="py-6 space-y-5 text-center">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    Pendaftaran Berhasil & KTA Terbit!
                  </h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Selamat, Anda telah terdaftar resmi dalam Musyawarah Guru Mata Pelajaran IPA Kabupaten Banyumas.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-left max-w-md mx-auto text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">ID Anggota Resmi:</span>
                    <span className="font-mono font-bold text-emerald-800">{newlyCreatedMember?.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nama Lengkap:</span>
                    <span className="font-semibold text-slate-900">{newlyCreatedMember?.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Unit Kerja:</span>
                    <span className="text-slate-800">{newlyCreatedMember?.school}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Notifikasi Email:</span>
                    <span className="text-emerald-700 font-medium">Otomatis Terkirim</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleResetForm}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                  >
                    Daftarkan Guru Lain
                  </button>
                  <button
                    onClick={() => setActiveSubTab('direktori')}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800"
                  >
                    Lihat Direktori Anggota
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live KTA Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <IdCard className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Pratinjau KTA Digital
                  </h4>
                </div>
                <span className="text-[11px] text-slate-500">
                  Format Standar Banyumas
                </span>
              </div>

              {/* Display either newly registered member or default preview */}
              <KtaCard
                member={
                  newlyCreatedMember || {
                    id: 'MGMP-IPA-BMS-PREVIEW',
                    fullName: fullName || 'Nama Lengkap Guru, S.Pd.',
                    nip: nip || '19xxxxxxxx xxxxxx x xxx',
                    school: (school === 'Lainnya' ? customSchool : school) || 'SMP Negeri di Banyumas',
                    rayon: rayon,
                    focusDiscipline: focusDiscipline,
                    teachingGrades: teachingGrades,
                    employmentStatus: employmentStatus,
                    email: email || 'guru.ipa@banyumas.sch.id',
                    phone: phone || '0812-xxxx-xxxx',
                    registeredAt: '2026-10-26',
                    status: 'Aktif',
                  }
                }
              />
            </div>

            {/* Quick Informational Box */}
            <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-xl p-4 text-xs text-emerald-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <Shield className="w-4 h-4 text-emerald-700" />
                <span>Manfaat Keanggotaan Resmi MGMP IPA</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                <li>Akses penuh repositori Modul Ajar Kurikulum Merdeka Fase D resmi.</li>
                <li>Hak mendapatkan surat tugas & sertifikat resmi Diklat 32 JP dari Dindik.</li>
                <li>Bimbingan olimpiade sains (OSN) dan praktikum laboratorium terpadu.</li>
                <li>Partisipasi dalam forum telaah kisi-kisi asesmen sumatif Kabupaten.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Direktori Anggota */}
      {activeSubTab === 'direktori' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama guru, NIP, atau sekolah..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={filterRayon}
                onChange={(e) => setFilterRayon(e.target.value)}
                className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
              >
                <option value="Semua">Semua Sub-Rayon</option>
                {BANYUMAS_RAYONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              <select
                value={filterDiscipline}
                onChange={(e) => setFilterDiscipline(e.target.value)}
                className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
              >
                <option value="Semua">Semua Fokus Keilmuan</option>
                <option value="Fisika">Fisika</option>
                <option value="Biologi">Biologi</option>
                <option value="Kimia Dasar">Kimia Dasar</option>
                <option value="IPAS Terpadu">IPAS Terpadu</option>
              </select>
            </div>
          </div>

          {/* Directory Table / Cards */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    <th className="py-3 px-4">ID & Nama Guru</th>
                    <th className="py-3 px-4">NIP / NUPTK</th>
                    <th className="py-3 px-4">Asal Sekolah</th>
                    <th className="py-3 px-4">Sub-Rayon</th>
                    <th className="py-3 px-4">Peminatan</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                            {member.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">
                              {member.fullName}
                            </p>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {member.id}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 tabular-nums">
                        {member.nip}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {member.school}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {member.rayon}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-emerald-800 font-medium">
                          {member.focusDiscipline}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[11px] text-slate-600 font-medium">
                          {member.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedMemberForKta(member)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded transition-colors"
                        >
                          Lihat KTA
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredMembers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                        Tidak ditemukan anggota yang sesuai kriteria pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Member KTA Modal */}
      {selectedMemberForKta && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Kartu Tanda Anggota (KTA) - {selectedMemberForKta.fullName}
              </h3>
              <button
                onClick={() => setSelectedMemberForKta(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <KtaCard member={selectedMemberForKta} />

            <div className="mt-5 text-right">
              <button
                onClick={() => setSelectedMemberForKta(null)}
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
