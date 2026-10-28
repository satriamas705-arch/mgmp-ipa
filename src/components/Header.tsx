import React from 'react';
import { Atom, UserPlus, Bell, Calendar, BookOpen, MessageSquare, BarChart3, Users } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadEmailCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, unreadEmailCount }) => {
  const navItems = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'jadwal', label: 'Jadwal Kegiatan' },
    { id: 'perangkat', label: 'Perangkat Ajar' },
    { id: 'progres', label: 'Dashboard Progres' },
    { id: 'forum', label: 'Forum Guru' },
    { id: 'anggota', label: 'Direktori Anggota' },
    { id: 'notifikasi', label: 'Email Notifikasi', badge: unreadEmailCount },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark with subtle science brand mark */}
          <button 
            onClick={() => setActiveTab('beranda')}
            className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-md shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-sm">
              <Atom className="w-5 h-5 animate-[spin_12s_linear_infinite]" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 leading-none whitespace-nowrap">
                MGMP IPA Banyumas
              </span>
              <span className="text-[11px] font-medium text-emerald-700 leading-tight whitespace-nowrap mt-0.5">
                Portal Resmi Guru IPA SMP
              </span>
            </div>
          </button>

          {/* Zone 2: Concise single-line navigation links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-emerald-700 bg-emerald-50/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-mono bg-amber-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('daftar')}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-600 whitespace-nowrap shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Daftar Anggota</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary tab scroller */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2.5 border-t border-slate-100 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 flex items-center gap-1 ${
                  isActive
                    ? 'text-emerald-800 bg-emerald-100/70 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1 text-[10px] font-mono bg-amber-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
