import React, { useState } from 'react';
import { ElementData, CATEGORY_NAMES, CATEGORY_COLORS } from '../../data/elementsData';
import { BohrModel } from '../BohrModel';
import { useTheme } from '../../context/ThemeContext';
import { X, Flame, Atom, Calculator, Sparkles, BookOpen, History, Layers, Zap, Compass, CheckCircle2 } from 'lucide-react';

interface ElementDetailModalProps {
  element: ElementData | null;
  onClose: () => void;
  onSendToCalculator?: (elementSymbol: string) => void;
  onCompare?: (elementNumber: number) => void;
}

export const ElementDetailModal: React.FC<ElementDetailModalProps> = ({
  element,
  onClose,
  onSendToCalculator,
  onCompare
}) => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'orbitals' | 'applications' | 'history'>('overview');

  // Trava a rolagem do body enquanto o modal estiver aberto (Section I)
  React.useEffect(() => {
    if (element) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [element]);

  if (!element) return null;

  const colors = CATEGORY_COLORS[element.category] || CATEGORY_COLORS.nonmetal;
  const categoryLabel = CATEGORY_NAMES[element.category] || element.category;

  // Derive subatomic particles
  const protons = element.number;
  const electrons = element.number;
  const massNumber = Math.round(element.atomicMass);
  const neutrons = Math.max(0, massNumber - protons);

  // Derive atomic block (s, p, d, f)
  const getBlock = () => {
    if (element.number === 2) return 's';
    if (element.category === 'lanthanide' || element.category === 'actinide') return 'f';
    if (element.group <= 2) return 's';
    if (element.group >= 13) return 'p';
    return 'd';
  };
  const block = getBlock();

  // Convert Kelvin to Celsius helper
  const kToC = (k: number | null) => (k !== null ? `${(k - 273.15).toFixed(1)} °C (${k} K)` : 'Desconhecido');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      style={{ overscrollBehavior: 'contain' }}
    >
      <div 
        className={`relative w-full max-w-5xl max-h-[96dvh] flex flex-col rounded-3xl shadow-2xl overflow-hidden border transition-all duration-200 ${
          isDark
            ? 'bg-[#050b18] border-sky-900/60 text-slate-100 shadow-[0_0_50px_rgba(2,132,199,0.25)]'
            : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
        }`}
        style={{ overscrollBehavior: 'contain' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner with Neon Element Badge */}
        <div className={`modal-header relative shrink-0 px-3 sm:px-6 py-2.5 sm:py-4 border-b flex items-center justify-between gap-2 sm:gap-4 ${
          isDark
            ? 'bg-[#030712] border-slate-800/80'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
            {/* Glowing Element Symbol Badge */}
            <div 
              className={`modal-badge w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl flex flex-col items-center justify-between p-1 border-[1.5px] font-mono shadow-lg relative overflow-hidden ${
                isDark ? `${colors.bg} ${colors.border}` : `${colors.lightBg} ${colors.lightBorder}`
              }`}
              style={{
                boxShadow: `0 0 20px ${colors.glow}45, inset 0 0 10px ${colors.glow}25`
              }}
            >
              <div className="w-full flex justify-between text-[10px] leading-none px-1">
                <span className={`font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{element.number}</span>
                <span className="text-amber-400 font-bold text-[9px]">{element.atomicMass < 100 ? element.atomicMass.toFixed(1) : Math.round(element.atomicMass)}</span>
              </div>
              <span className={`font-orbitron text-xl sm:text-2xl font-black leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {element.symbol}
              </span>
              <span className={`text-[8.5px] font-bold uppercase truncate px-0.5 leading-none ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Bloco {block}
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h2 className="text-xl sm:text-3xl font-black tracking-tight font-orbitron">{element.name}</h2>
                <span className={`text-xs px-3 py-1 rounded-full font-bold border ${
                  isDark ? `${colors.bg} ${colors.border} ${colors.text}` : `${colors.lightBg} ${colors.lightBorder} ${colors.lightText}`
                }`}>
                  {categoryLabel}
                </span>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${
                  isDark ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
                }`}>
                  {element.phase === 'gas' ? '💨 Gás' : element.phase === 'liquid' ? '💧 Líquido' : element.phase === 'solid' ? '🧱 Sólido' : '⚙️ Sintético'}
                </span>
              </div>
              <p className={`modal-subtitle text-[11px] sm:text-xs mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Período <strong>{element.period}</strong> · Grupo <strong>{element.group}</strong> · Bloco <strong>{block.toUpperCase()}</strong> · Família dos {categoryLabel}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {onCompare && (
              <button
                onClick={() => {
                  onCompare(element.number);
                  onClose();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm ${
                  isDark
                    ? 'bg-gradient-to-r from-purple-900/40 to-fuchsia-900/40 hover:from-purple-900/60 hover:to-fuchsia-900/60 text-purple-300 border-purple-500/50 shadow-purple-950/40'
                    : 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-300'
                }`}
                title="Comparar propriedades com outro elemento"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Comparar</span>
              </button>
            )}

            {onSendToCalculator && (
              <button
                onClick={() => {
                  onSendToCalculator(element.symbol);
                  onClose();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm ${
                  isDark
                    ? 'bg-gradient-to-r from-sky-900/40 to-blue-900/40 hover:from-sky-900/60 hover:to-blue-900/60 text-sky-300 border-sky-500/50 shadow-sky-950/40'
                    : 'bg-sky-50 hover:bg-sky-100 text-sky-800 border-sky-300'
                }`}
                title="Enviar para cálculo de massa molar ou equação"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Calculadora</span>
              </button>
            )}

            <button
              onClick={onClose}
              className={`p-2 rounded-xl border transition-all hover:scale-105 cursor-pointer ${
                isDark ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
              }`}
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`modal-tabs flex items-center shrink-0 border-b px-3 sm:px-6 text-xs font-bold overflow-x-auto overflow-y-hidden gap-2 py-1.5 scrollbar-none ${
          isDark ? 'border-slate-800 bg-[#030712]/90' : 'border-slate-200 bg-slate-50/90'
        }`}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`shrink-0 whitespace-nowrap flex items-center gap-1.5 py-2 px-3.5 rounded-xl border transition-all cursor-pointer ${
              activeTab === 'overview'
                ? isDark
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-[0_0_12px_rgba(14,165,233,0.3)]'
                  : 'bg-sky-500 text-white border-sky-600 shadow-sm'
                : 'border-transparent opacity-65 hover:opacity-100'
            }`}
          >
            <Atom className="w-4 h-4" />
            Visão Geral & Modelo Atômico
          </button>

          <button
            onClick={() => setActiveTab('orbitals')}
            className={`shrink-0 whitespace-nowrap flex items-center gap-1.5 py-2 px-3.5 rounded-xl border transition-all cursor-pointer ${
              activeTab === 'orbitals'
                ? isDark
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-[0_0_12px_rgba(99,102,241,0.3)]'
                  : 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                : 'border-transparent opacity-65 hover:opacity-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Distribuição de Linus Pauling
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`shrink-0 whitespace-nowrap flex items-center gap-1.5 py-2 px-3.5 rounded-xl border transition-all cursor-pointer ${
              activeTab === 'applications'
                ? isDark
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'bg-amber-600 text-white border-amber-700 shadow-sm'
                : 'border-transparent opacity-65 hover:opacity-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Aplicações no Cotidiano
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`shrink-0 whitespace-nowrap flex items-center gap-1.5 py-2 px-3.5 rounded-xl border transition-all cursor-pointer ${
              activeTab === 'history'
                ? isDark
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
            : 'border-transparent opacity-65 hover:opacity-100'
            }`}
          >
            <History className="w-4 h-4" />
            História & Curiosidades
          </button>
        </div>

        {/* Modal Scrollable Body - Completely eliminates blank voids */}
        <div className="overflow-y-auto min-h-0 p-4 sm:p-6 space-y-6 flex-1">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
              {/* Left Column: Bohr Model + Subatomic Particle Dossier */}
              <div className="md:col-span-5 flex flex-col justify-between space-y-4">
                <BohrModel
                  atomicNumber={element.number}
                  symbol={element.symbol}
                  name={element.name}
                  shells={element.shells}
                  atomicMass={element.atomicMass}
                  color={colors.glow}
                />

                {/* Subatomic Nuclear Composition Grid */}
                <div className={`p-3.5 rounded-2xl border text-xs ${
                  isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <h4 className="text-[11px] uppercase tracking-wider font-bold mb-2.5 flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      Núcleo & Eletrosfera
                    </span>
                    <span className="font-mono text-white text-xs">Massa A = {massNumber}</span>
                  </h4>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className={`p-2 rounded-xl border ${
                      isDark ? 'bg-rose-950/30 border-rose-500/30' : 'bg-rose-50 border-rose-200'
                    }`}>
                      <span className="text-[10px] text-rose-400 font-bold block">Prótons (p⁺)</span>
                      <span className="text-base font-black font-mono text-rose-500">{protons}</span>
                      <span className="text-[9px] opacity-70 block">Carga +{protons}</span>
                    </div>

                    <div className={`p-2 rounded-xl border ${
                      isDark ? 'bg-amber-950/30 border-amber-500/30' : 'bg-amber-50 border-amber-200'
                    }`}>
                      <span className="text-[10px] text-amber-400 font-bold block">Nêutrons (n⁰)</span>
                      <span className="text-base font-black font-mono text-amber-500">{neutrons}</span>
                      <span className="text-[9px] opacity-70 block">Carga Neutra</span>
                    </div>

                    <div className={`p-2 rounded-xl border ${
                      isDark ? 'bg-cyan-950/30 border-cyan-500/30' : 'bg-cyan-50 border-cyan-200'
                    }`}>
                      <span className="text-[10px] text-cyan-400 font-bold block">Elétrons (e⁻)</span>
                      <span className="text-base font-black font-mono text-cyan-400">{electrons}</span>
                      <span className="text-[9px] opacity-70 block">Carga -{electrons}</span>
                    </div>
                  </div>

                  {/* Shell Distribution & Valence */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="opacity-70">Camada de Valência:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {element.shells[element.shells.length - 1]} elétron{element.shells[element.shells.length - 1] > 1 ? 's' : ''} (Nível n = {element.period})
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="opacity-70">Configuração Resumida:</span>
                      <span className="font-mono font-bold text-sky-400">{element.electronConfiguration}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="opacity-70">Estados de Oxidação (Nox):</span>
                      <span className="font-mono font-bold text-amber-300">{element.oxidationStates || '0'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: High-density periodic metrics + Rich dossier (ZERO EMPTY SPACE) */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-3.5">
                {/* 9 Periodic Metrics Grid */}
                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <h4 className="text-xs uppercase tracking-wider font-bold mb-3 flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Atom className="w-4 h-4 text-sky-400" />
                      Propriedades Físico-Químicas Periódicas
                    </span>
                    <span className="text-[10px] font-mono text-sky-400 font-bold">118 Dados IUPAC</span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {/* 1: Eletronegatividade */}
                    <div className={`p-2.5 rounded-xl border ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                    }`}>
                      <span className="text-[10.5px] opacity-70 block font-medium">Eletronegatividade</span>
                      <span className="text-base font-black font-mono text-cyan-400">
                        {element.electronegativity ?? '—'}
                      </span>
                      <span className="text-[9.5px] opacity-60 block">Escala de Pauling</span>
                    </div>

                    {/* 2: Raio Atômico */}
                    <div className={`p-2.5 rounded-xl border ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                    }`}>
                      <span className="text-[10.5px] opacity-70 block font-medium">Raio Atômico</span>
                      <span className="text-base font-black font-mono text-emerald-400">
                        {element.atomicRadius ? `${element.atomicRadius} pm` : '—'}
                      </span>
                      <span className="text-[9.5px] opacity-60 block">Picômetros (10⁻¹² m)</span>
                    </div>

                    {/* 3: 1ª Ionização */}
                    <div className={`p-2.5 rounded-xl border ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                    }`}>
                      <span className="text-[10.5px] opacity-70 block font-medium">1ª Ionização</span>
                      <span className="text-base font-black font-mono text-amber-400">
                        {element.ionizationEnergy ? `${element.ionizationEnergy}` : '—'}
                      </span>
                      <span className="text-[9.5px] opacity-60 block">kJ/mol (gás neutro)</span>
                    </div>

                    {/* 4: Densidade */}
                    <div className={`p-2.5 rounded-xl border ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                    }`}>
                      <span className="text-[10.5px] opacity-70 block font-medium">Densidade</span>
                      <span className="text-base font-black font-mono text-purple-400">
                        {element.density !== null ? `${element.density} g/cm³` : '—'}
                      </span>
                      <span className="text-[9.5px] opacity-60 block">A 20 °C (1 atm)</span>
                    </div>

                    {/* 5: Ponto de Fusão */}
                    <div className={`p-2.5 rounded-xl border ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                    }`}>
                      <span className="text-[10.5px] opacity-70 block font-medium">Ponto de Fusão</span>
                      <span className="text-xs font-black font-mono text-orange-400 block mt-0.5">
                        {kToC(element.meltingPoint)}
                      </span>
                      <span className="text-[9.5px] opacity-60 block">Transição Sólido-Líquido</span>
                    </div>

                    {/* 6: Ponto de Ebulição */}
                    <div className={`p-2.5 rounded-xl border ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                    }`}>
                      <span className="text-[10.5px] opacity-70 block font-medium">Ponto de Ebulição</span>
                      <span className="text-xs font-black font-mono text-rose-400 block mt-0.5">
                        {kToC(element.boilingPoint)}
                      </span>
                      <span className="text-[9.5px] opacity-60 block">Transição Líquido-Vapor</span>
                    </div>

                    {/* 7: Bloco & Grupo */}
                    <div className={`p-2.5 rounded-xl border ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                    }`}>
                      <span className="text-[10.5px] opacity-70 block font-medium">Classificação</span>
                      <span className="text-sm font-black font-mono text-sky-400 block mt-0.5">
                        Bloco {block.toUpperCase()} · G{element.group}
                      </span>
                      <span className="text-[9.5px] opacity-60 block">Período {element.period}</span>
                    </div>

                    {/* 8: Estados de Oxidação */}
                    <div className={`p-2.5 rounded-xl border ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                    }`}>
                      <span className="text-[10.5px] opacity-70 block font-medium">Estados de Oxidação</span>
                      <span className="text-sm font-black font-mono text-emerald-300 block mt-0.5 truncate">
                        {element.oxidationStates || '0'}
                      </span>
                      <span className="text-[9.5px] opacity-60 block">Valências Principais</span>
                    </div>

                    {/* 9: Massa Atômica */}
                    <div className={`p-2.5 rounded-xl border ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                    }`}>
                      <span className="text-[10.5px] opacity-70 block font-medium">Massa Padrão</span>
                      <span className="text-sm font-black font-mono text-yellow-300 block mt-0.5">
                        {element.atomicMass} u
                      </span>
                      <span className="text-[9.5px] opacity-60 block">g/mol molar</span>
                    </div>
                  </div>
                </div>

                {/* Visão Geral & Comportamento Químico */}
                <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
                  isDark ? 'bg-slate-950/70 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}>
                  <h4 className="font-bold mb-1.5 flex items-center gap-1.5 text-sky-400">
                    <Compass className="w-4 h-4" />
                    Visão Geral & Comportamento Químico
                  </h4>
                  <p className="opacity-90">{element.summary}</p>
                </div>

                {/* Principais Aplicações no Mundo Real (Preenche o espaço perfeitamente) */}
                <div className={`p-3.5 rounded-2xl border text-xs ${
                  isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <h4 className="font-bold mb-2 flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Principais Aplicações Práticas
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {element.uses.slice(0, 3).map((use, i) => (
                      <div key={i} className={`flex items-start gap-2 p-2 rounded-xl border ${
                        isDark ? 'bg-slate-900/80 border-slate-800/80 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
                      }`}>
                        <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          ✓
                        </span>
                        <p className="text-[11px] leading-tight">{use}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Descoberta & Curiosidade Rápida */}
                <div className={`p-3 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
                  isDark ? 'bg-amber-950/20 border-amber-500/30 text-amber-200/90' : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}>
                  <div className="min-w-0">
                    <span className="font-bold text-[11px] block">Descoberto por {element.discoveredBy} ({element.yearDiscovered})</span>
                    <p className="text-[10.5px] opacity-80 truncate">{element.trivia}</p>
                  </div>
                  <span className="text-xl shrink-0">🔬</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orbitals' && (
            <div className="space-y-4">
              <div className={`p-5 rounded-2xl border ${
                isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <h4 className="text-sm font-bold mb-2 flex items-center gap-2 text-sky-400">
                  <Sparkles className="w-4 h-4" />
                  Diagrama dos Subníveis Energéticos (Princípio de Aufbau)
                </h4>
                <p className="text-xs opacity-75 mb-4">
                  Os elétrons preenchem os orbitais em ordem crescente de energia (1s → 2s → 2p → 3s → 3p → 4s → 3d...).
                </p>

                <div className={`p-4 rounded-2xl font-mono text-sm border flex items-center justify-between flex-wrap gap-2 ${
                  isDark ? 'bg-slate-900 text-sky-300 border-slate-800 shadow-[0_0_15px_rgba(14,165,233,0.15)]' : 'bg-white text-sky-700 border-slate-200 shadow-xs'
                }`}>
                  <div>
                    <span className="text-xs opacity-60 block font-sans font-medium">Configuração Eletrônica Completa:</span>
                    <span className="text-base font-black text-white">{element.electronConfiguration}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs opacity-60 block font-sans font-medium">Número Atômico (Z):</span>
                    <span className="text-base font-black text-amber-400">{element.number} elétrons</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {element.shells.map((electronsCount, index) => {
                    const shellLetters = ['K (n=1)', 'L (n=2)', 'M (n=3)', 'N (n=4)', 'O (n=5)', 'P (n=6)', 'Q (n=7)'];
                    const maxCap = [2, 8, 18, 32, 32, 18, 8][index];
                    const fillPct = Math.min(100, Math.round((electronsCount / maxCap) * 100));

                    return (
                      <div key={index} className={`p-3.5 rounded-xl border ${
                        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                      }`}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-bold">{shellLetters[index]}</span>
                          <span className="font-mono text-sky-400 font-black">{electronsCount} e⁻</span>
                        </div>
                        <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                          <div 
                            className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${fillPct}%` }} 
                          />
                        </div>
                        <div className="flex justify-between text-[10px] opacity-60 mt-1.5">
                          <span>Máx: {maxCap} e⁻</span>
                          <span>{fillPct}% preenchido</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="space-y-4">
              <div className={`p-5 rounded-2xl border ${
                isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <h4 className="text-sm font-bold mb-3 flex items-center gap-2 text-amber-400">
                  <Flame className="w-4 h-4" />
                  Aplicações Práticas na Vida Real, Tecnologia e Indústria
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {element.uses.map((use, i) => (
                    <div key={i} className={`flex items-start gap-3 p-3.5 rounded-xl border ${
                      isDark ? 'bg-slate-900/80 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-xs'
                    }`}>
                      <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-xs leading-relaxed font-medium">{use}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className={`p-5 rounded-2xl border ${
                isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <h4 className="text-sm font-bold mb-3 flex items-center gap-2 text-emerald-400">
                  <History className="w-4 h-4" />
                  Origem Histórica, Etimologia e Descoberta
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border ${
                    isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    <span className="text-[11px] opacity-70 block font-medium">Descobridor / Atribuição</span>
                    <span className="text-base font-black block mt-1 text-white">{element.discoveredBy}</span>
                  </div>

                  <div className={`p-4 rounded-xl border ${
                    isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    <span className="text-[11px] opacity-70 block font-medium">Ano da Descoberta</span>
                    <span className="text-base font-black text-emerald-400 font-mono block mt-1">
                      {element.yearDiscovered}
                    </span>
                  </div>
                </div>

                <div className={`mt-4 p-4 rounded-xl border text-xs leading-relaxed ${
                  isDark ? 'bg-amber-950/30 border-amber-500/40 text-amber-200' : 'bg-amber-50 border-amber-300 text-amber-900'
                }`}>
                  <strong className="block mb-1 font-bold text-amber-400 text-sm flex items-center gap-1.5">
                    💡 Curiosidade Científica & Relevância:
                  </strong>
                  <p className="opacity-95 text-xs">{element.trivia}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with quick dismiss */}
        <div className={`px-6 py-3 border-t flex justify-between items-center text-xs ${
          isDark ? 'border-slate-800 bg-[#030712] text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
        }`}>
          <span>Pressione <strong>Esc</strong> ou clique fora para voltar à tabela</span>
          <button
            onClick={onClose}
            className={`px-5 py-2 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
            }`}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
