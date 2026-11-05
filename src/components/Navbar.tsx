import React from 'react';
import { Atom, Calculator, Scale, FlaskConical } from 'lucide-react';

export type ActiveView = 'table' | 'calculator' | 'comparator';

interface NavbarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeView, setActiveView }) => {
  const navItems: { id: ActiveView; label: string; shortLabel: string; icon: React.ReactNode }[] = [
    { id: 'table', label: 'Tabela Periódica', shortLabel: 'Tabela', icon: <FlaskConical className="w-4 h-4 text-sky-400" /> },
    { id: 'calculator', label: 'Cálculos & Balanceamento', shortLabel: 'Cálculos', icon: <Calculator className="w-4 h-4 text-emerald-400" /> },
    { id: 'comparator', label: 'Comparador', shortLabel: 'Comparar', icon: <Scale className="w-4 h-4 text-purple-400" /> }
  ];

  return (
    <header className="landscape-compact-nav sticky top-0 z-40 transition-colors duration-200 border-b backdrop-blur-xl shadow-lg bg-[#040816]/90 border-slate-800/80 text-slate-100">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 pl-[max(12px,env(safe-area-inset-left))] pr-[max(12px,env(safe-area-inset-right))]">
        <div className="flex items-center justify-between h-13 sm:h-15 gap-2 sm:gap-3">
          {/* Brand Logo - Futuristic Neon Glass Badge */}
          <div 
            onClick={() => setActiveView('table')}
            className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
          >
            <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl p-[2px] transition-transform group-hover:scale-105 shadow-md bg-gradient-to-tr from-sky-500 via-indigo-500 to-cyan-400 shadow-[0_0_15px_rgba(14,165,233,0.4)]">
              <div className="w-full h-full rounded-[10px] flex items-center justify-center bg-[#040816]">
                <Atom className="w-4 sm:w-5 h-4 sm:h-5 text-sky-400 animate-spin-slow" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-orbitron font-black text-sm sm:text-lg tracking-tight text-white">
                QuímicaLab
              </span>
              <span className="text-[9px] sm:text-[10px] font-black uppercase px-1.5 sm:px-2 py-0.5 rounded-full border bg-sky-500/20 text-sky-400 border-sky-500/40 shadow-[0_0_8px_rgba(14,165,233,0.3)]">
                PRO
              </span>
            </div>
          </div>

          {/* Center Navigation Tabs (Compact on Landscape Mobile) */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 scrollbar-none">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.6)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                  }`}
                >
                  {item.icon}
                  <span className="hidden md:inline">{item.label}</span>
                  <span className="inline md:hidden">{item.shortLabel}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
