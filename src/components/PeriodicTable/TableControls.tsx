import React from 'react';
import { ElementData, CATEGORY_NAMES, CATEGORY_COLORS } from '../../data/elementsData';
import { HeatmapMetric } from './ElementCell';
import { METRIC_CONFIGS } from './HeatmapControls';
import { useTheme } from '../../context/ThemeContext';
import { Search, Flame, Box, RotateCcw, Filter, Palette, Star, ArrowLeftRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export type TableFilterMode = 'families' | 'heatmap' | 'states';

interface TableControlsProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterMode: TableFilterMode;
  setFilterMode: (m: TableFilterMode) => void;
  selectedCategory: ElementData['category'] | 'all';
  setSelectedCategory: (c: ElementData['category'] | 'all') => void;
  selectedPhase: ElementData['phase'] | 'all';
  setSelectedPhase: (p: ElementData['phase'] | 'all') => void;
  heatmapMetric: HeatmapMetric;
  setHeatmapMetric: (m: HeatmapMetric) => void;
  onRandomElement: () => void;
  onCompareClick?: () => void;
}

export const TableControls: React.FC<TableControlsProps> = ({
  searchQuery,
  setSearchQuery,
  filterMode,
  setFilterMode,
  selectedCategory,
  setSelectedCategory,
  selectedPhase,
  setSelectedPhase,
  heatmapMetric,
  setHeatmapMetric,
  onRandomElement,
  onCompareClick
}) => {
  const { isDark } = useTheme();
  const categories = Object.keys(CATEGORY_NAMES) as ElementData['category'][];
  const currentHeatmapConfig = METRIC_CONFIGS[heatmapMetric];

  const handleRandom = () => {
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.55 }
    });
    onRandomElement();
  };

  return (
    <div className={`border rounded-[24px] p-4 sm:p-5 transition-all duration-200 relative backdrop-blur-xl ${
      isDark
        ? 'bg-[#040816]/90 border-[rgba(56,189,248,0.4)] shadow-[0_0_30px_rgba(56,189,248,0.2)] text-slate-100'
        : 'bg-white/95 border-slate-200 text-slate-900 shadow-xl'
    }`}>
      {/* Top Row: Search (Height 48px) + Segmented Switcher + Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search Input: Exact 48px height with neon border and glow on focus */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none ${
            isDark ? 'text-sky-400' : 'text-sky-600'
          }`} />
          <input
            type="text"
            placeholder="Buscar elemento (Ex: Fe, Ferro, 26)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full h-12 pl-12 pr-10 border rounded-2xl text-sm font-medium focus:outline-none transition-all ${
              isDark
                ? 'bg-[#050b1e] border-sky-500/50 text-white placeholder-slate-400 focus:border-sky-400 focus:shadow-[0_0_20px_rgba(56,189,248,0.5)]'
                : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-sky-500 focus:shadow-[0_0_15px_rgba(14,165,233,0.3)]'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs transition p-1 rounded-full cursor-pointer text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Center Mode Switcher: Famílias / Mapas de Calor / Estados */}
        <div className={`flex items-center gap-1.5 p-1 rounded-2xl border ${
          isDark ? 'bg-[#050b1e] border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          {/* Famílias Button */}
          <button
            onClick={() => {
              setFilterMode('families');
              setHeatmapMetric('none');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
              filterMode === 'families'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_18px_rgba(56,189,248,0.6)]'
                : isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Famílias</span>
          </button>

          {/* Mapas de Calor Button */}
          <button
            onClick={() => {
              setFilterMode('heatmap');
              if (heatmapMetric === 'none') {
                setHeatmapMetric('electronegativity');
              }
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
              filterMode === 'heatmap'
                ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-[0_0_18px_rgba(244,63,94,0.6)]'
                : isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-300" />
            <span>Mapas de Calor</span>
          </button>

          {/* Estados Button */}
          <button
            onClick={() => {
              setFilterMode('states');
              setHeatmapMetric('none');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
              filterMode === 'states'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-[0_0_18px_rgba(6,182,212,0.6)]'
                : isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>Estados</span>
          </button>
        </div>

        {/* Right Action Buttons: Golden Sortear & Purple Comparar (Section F) */}
        <div className="flex items-center gap-2.5">
          {/* Sortear Dourado: #f59e0b -> #fbbf24 */}
          <button
            onClick={handleRandom}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all hover:scale-105 active:scale-95 cursor-pointer text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.55)] border border-yellow-200"
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
            }}
            title="Sortear um elemento aleatório para estudar"
          >
            <Star className="w-4 h-4 fill-current text-slate-950" />
            <span>Sortear</span>
          </button>

          {/* Comparar Roxo: #7c3aed -> #a855f7 */}
          {onCompareClick && (
            <button
              onClick={onCompareClick}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all hover:scale-105 active:scale-95 cursor-pointer text-white shadow-[0_0_20px_rgba(168,85,247,0.55)] border border-purple-300"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)'
              }}
              title="Comparar dois elementos lado a lado"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Comparar</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-bar: Family Chips with Glowing Dot, Auto-wrap, 8px Spacing (Section F) */}
      <div className={`mt-3.5 pt-3.5 border-t ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
        {/* Mode 1: Famílias Químicas */}
        {filterMode === 'families' && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? isDark
                    ? 'bg-sky-500/30 border-sky-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.5)]'
                    : 'bg-sky-500 border-sky-600 text-white shadow-md ring-2 ring-sky-300'
                  : isDark
                    ? 'bg-[#050b1e] border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-xs'
              }`}
            >
              <Filter className={`w-3.5 h-3.5 ${selectedCategory === 'all' && !isDark ? 'text-white' : 'text-sky-400'}`} />
              <span>Todos os Elementos</span>
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const col = CATEGORY_COLORS[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(isSelected ? 'all' : cat)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? isDark
                        ? 'border-white text-white font-bold ring-2 ring-white/50'
                        : 'border-slate-800 text-slate-950 font-black ring-2 ring-slate-400 shadow-sm'
                      : isDark
                        ? 'bg-[#050b1e]/85 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                        : 'bg-white border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-50 shadow-xs'
                  }`}
                  style={{
                    backgroundColor: isSelected ? (isDark ? `${col.glow}40` : `${col.glow}25`) : undefined,
                    borderColor: isSelected ? col.glow : undefined,
                    boxShadow: isSelected ? (isDark ? `0 0 16px ${col.glow}` : `0 2px 8px ${col.glow}40`) : undefined
                  }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: col.glow,
                      boxShadow: `0 0 10px ${col.glow}, 0 0 4px ${col.glow}`
                    }}
                  />
                  <span>{CATEGORY_NAMES[cat]}</span>
                </button>
              );
            })}

            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className={`flex items-center gap-1 text-xs font-bold ml-auto transition cursor-pointer px-2.5 py-1 rounded-lg ${
                  isDark ? 'text-sky-400 hover:text-sky-300 bg-sky-950/50' : 'text-sky-600 hover:text-sky-800 bg-sky-50'
                }`}
              >
                <RotateCcw className="w-3 h-3" />
                Limpar
              </button>
            )}
          </div>
        )}

        {/* Mode 2: Mapas de Calor */}
        {filterMode === 'heatmap' && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {(
                [
                  { key: 'electronegativity', label: 'Eletronegatividade', unit: 'Pauling' },
                  { key: 'atomicRadius', label: 'Raio Atômico', unit: 'pm' },
                  { key: 'ionizationEnergy', label: '1ª Energia de Ionização', unit: 'kJ/mol' },
                  { key: 'density', label: 'Densidade', unit: 'g/cm³' },
                  { key: 'meltingPoint', label: 'Ponto de Fusão', unit: 'K' }
                ] as const
              ).map((m) => {
                const isActive = heatmapMetric === m.key;
                return (
                  <button
                    key={m.key}
                    onClick={() => setHeatmapMetric(m.key)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-500/30 border-amber-400 text-amber-200 ring-2 ring-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                        : isDark
                          ? 'bg-[#050b1e] border-slate-800 text-slate-400 hover:text-slate-200'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{m.label}</span>
                    <span className="text-[11px] opacity-75">({m.unit})</span>
                  </button>
                );
              })}
            </div>

            {/* Scientific Thermal Scale Bar */}
            {heatmapMetric !== 'none' && (
              <div className={`p-3 rounded-2xl border flex flex-col gap-1.5 text-xs ${
                isDark ? 'bg-[#050b1e] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-cyan-400">
                    Mín: {currentHeatmapConfig.min} {currentHeatmapConfig.unit}
                  </span>
                  <span className={`font-medium text-center truncate max-w-md px-2 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    {currentHeatmapConfig.description}
                  </span>
                  <span className="font-mono font-bold text-rose-400">
                    Máx: {currentHeatmapConfig.max} {currentHeatmapConfig.unit}
                  </span>
                </div>

                <div className="relative w-full h-2.5 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="w-full h-full"
                    style={{
                      background:
                        heatmapMetric === 'atomicRadius'
                          ? 'linear-gradient(to right, #0284c7, #0d9488, #8b5cf6)'
                          : 'linear-gradient(to right, #0284c7, #059669, #d97706, #dc2626)'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mode 3: Estados Físicos */}
        {filterMode === 'states' && (
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs sm:text-sm font-semibold mr-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Estado físico a 25 °C (1 atm):
            </span>
            {(
              [
                { key: 'all', label: 'Todos os Estados' },
                { key: 'solid', label: '🧱 Sólidos' },
                { key: 'liquid', label: '💧 Líquidos (Hg, Br)' },
                { key: 'gas', label: '💨 Gases' },
                { key: 'unknown', label: '⚙️ Sintéticos' }
              ] as const
            ).map((p) => {
              const isSelected = selectedPhase === p.key;
              return (
                <button
                  key={p.key}
                  onClick={() => setSelectedPhase(p.key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : isDark
                        ? 'bg-[#050b1e] border-slate-800 text-slate-400 hover:text-slate-200'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
