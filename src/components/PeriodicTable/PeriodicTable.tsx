import React, { useState, useMemo } from 'react';
import {
  ALL_118_ELEMENTS_SUMMARY,
  getElementGridPosition,
  ElementBasicInfo,
  ElementData,
  getElement,
  CATEGORY_NAMES,
  CATEGORY_COLORS
} from '../../data/elementsData';
import { ElementCell, HeatmapMetric } from './ElementCell';
import { TableControls, TableFilterMode } from './TableControls';
import { getHeatmapColorAndValue } from './HeatmapControls';
import { ElementDetailModal } from './ElementDetailModal';
import { LabTestTubesAccent } from './LabGlasswareAccents';
import { useTheme } from '../../context/ThemeContext';
import { Info, Maximize2 } from 'lucide-react';

interface PeriodicTableProps {
  onSendToCalculator?: (elementSymbol: string) => void;
  onCompareElements?: (el1: number, el2: number) => void;
}

export const PeriodicTable: React.FC<PeriodicTableProps> = ({
  onSendToCalculator,
  onCompareElements
}) => {
  const { isDark, isEcoMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<TableFilterMode>('families');
  const [selectedCategory, setSelectedCategory] = useState<ElementData['category'] | 'all'>('all');
  const [selectedPhase, setSelectedPhase] = useState<ElementData['phase'] | 'all'>('all');
  const [heatmapMetric, setHeatmapMetric] = useState<HeatmapMetric>('none');
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const [hoveredElement, setHoveredElement] = useState<ElementBasicInfo | null>(null);
  const [showRotateBanner, setShowRotateBanner] = useState(true);

  // Filter elements: non-matching elements become opacity 0.15
  const filteredElementsMap = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const map = new Map<number, boolean>();

    ALL_118_ELEMENTS_SUMMARY.forEach((el) => {
      let matches = true;

      if (query) {
        const matchesNum = el.num.toString() === query;
        const matchesSym = el.sym.toLowerCase() === query;
        const matchesName = el.name.toLowerCase().includes(query);
        matches = matchesNum || matchesSym || matchesName;
      }

      if (matches && filterMode === 'families' && selectedCategory !== 'all') {
        matches = el.cat === selectedCategory;
      }

      if (matches && filterMode === 'states' && selectedPhase !== 'all') {
        matches = el.phase === selectedPhase;
      }

      map.set(el.num, matches);
    });

    return map;
  }, [searchQuery, filterMode, selectedCategory, selectedPhase]);

  const handleRandomElement = () => {
    const randomNum = Math.floor(Math.random() * 118) + 1;
    setSelectedElement(getElement(randomNum));
  };

  const mainTableElements = useMemo(() => {
    return ALL_118_ELEMENTS_SUMMARY.filter((el) => {
      const pos = getElementGridPosition(el.num);
      return pos.row <= 7;
    });
  }, []);

  const lanthanides = useMemo(() => {
    return ALL_118_ELEMENTS_SUMMARY.filter((el) => el.num >= 57 && el.num <= 71);
  }, []);

  const actinides = useMemo(() => {
    return ALL_118_ELEMENTS_SUMMARY.filter((el) => el.num >= 89 && el.num <= 103);
  }, []);

  // Fullscreen toggle with orientation lock attempt
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        if (screen.orientation && (screen.orientation as any).lock) {
          await (screen.orientation as any).lock('landscape').catch(() => {});
        }
      } else {
        await document.exitFullscreen();
      }
    } catch {}
  };

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      {/* Aviso em Retrato (Celular em pé) */}
      {showRotateBanner && (
        <div className="sm:hidden flex items-center justify-between p-2.5 rounded-xl border border-sky-500/40 bg-sky-950/70 text-sky-200 text-xs shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-base animate-pulse">🔄</span>
            <span>Gire o celular na horizontal para ver a tabela inteira!</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="px-2 py-1 rounded bg-sky-600 text-white font-bold text-[10px]"
            >
              Tela cheia
            </button>
            <button
              onClick={() => setShowRotateBanner(false)}
              className="text-slate-400 p-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 1. Barra de busca, filtros e ações (ACIMA da moldura) */}
      <div className="w-full">
        <TableControls
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterMode={filterMode}
          setFilterMode={setFilterMode}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedPhase={selectedPhase}
          setSelectedPhase={setSelectedPhase}
          heatmapMetric={heatmapMetric}
          setHeatmapMetric={setHeatmapMetric}
          onRandomElement={handleRandomElement}
          onCompareClick={onCompareElements ? () => onCompareElements(11, 19) : undefined}
        />
      </div>

      {/* 2. Faixa de Dica / Inspetor Rápido (ACIMA da moldura) */}
      <div className={`landscape-hide h-12 px-4 sm:px-5 rounded-2xl border flex items-center justify-between transition-colors duration-150 overflow-hidden select-none backdrop-blur-xl ${
        isDark
          ? 'bg-[#040816]/85 border-[rgba(56,189,248,0.35)] text-slate-100 shadow-[0_0_20px_rgba(56,189,248,0.15)]'
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
      }`}>
        {hoveredElement ? (
          <div className="flex items-center justify-between w-full gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="w-8 h-8 rounded-lg font-mono font-black text-white flex items-center justify-center text-xs shadow-sm shrink-0 border border-white/20"
                style={{
                  backgroundColor: CATEGORY_COLORS[hoveredElement.cat].glow,
                  boxShadow: `0 0 10px ${CATEGORY_COLORS[hoveredElement.cat].glow}`
                }}
              >
                {hoveredElement.sym}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm tracking-tight truncate font-orbitron">
                    {hoveredElement.name}
                  </span>
                  <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    (Z = {hoveredElement.num} · {hoveredElement.mass} u)
                  </span>
                </div>
                <span className={`text-[11px] block truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {CATEGORY_NAMES[hoveredElement.cat]} · Config: <strong className="font-mono text-sky-400 font-bold">{hoveredElement.config}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono shrink-0">
              <div className="text-right">
                <span className="block text-[9px] uppercase font-sans font-semibold opacity-70">
                  Eletronegatividade
                </span>
                <span className={`font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>
                  {hoveredElement.en ?? '—'}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-[9px] uppercase font-sans font-semibold opacity-70">
                  Raio Atômico
                </span>
                <span className={`font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                  {hoveredElement.rad ? `${hoveredElement.rad} pm` : '—'}
                </span>
              </div>
              <div className="text-right hidden sm:block">
                <span className="block text-[9px] uppercase font-sans font-semibold opacity-70">
                  1ª Ionização
                </span>
                <span className={`font-bold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                  {hoveredElement.ie ? `${hoveredElement.ie} kJ/mol` : '—'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm">
              <Info className="w-4 h-4 text-sky-500 shrink-0" />
              <span className={isDark ? 'text-slate-300' : 'text-slate-700 font-medium'}>
                Passe o mouse ou toque sobre qualquer elemento para inspecionar ou clique para abrir o Modelo de Bohr.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleFullscreen}
                className={`p-1.5 rounded-xl border transition cursor-pointer ${
                  isDark
                    ? 'border-slate-700 bg-slate-800/60 text-slate-300 hover:text-white'
                    : 'border-slate-300 bg-slate-100 text-slate-700 hover:text-slate-950 shadow-xs'
                }`}
                title="Tela Cheia"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. MOLDURA DA TABELA */}
      <div
        className="landscape-table-frame w-full relative transition-all duration-200 overflow-x-auto lg:overflow-x-visible scrollbar-thin p-3 sm:p-4 md:p-5"
        style={{
          borderRadius: '26px',
          border: '1.5px solid rgba(56, 189, 248, 0.55)',
          boxShadow: isEcoMode
            ? '0 0 15px rgba(56, 189, 248, 0.2)'
            : '0 0 40px rgba(56, 189, 248, 0.28), inset 0 0 70px rgba(37, 99, 235, 0.18)',
          backgroundColor: isDark ? 'rgba(4, 8, 22, 0.75)' : 'rgba(255, 255, 255, 0.94)',
          backdropFilter: isEcoMode ? undefined : 'blur(8px)'
        }}
      >
        {/* UNIFIED 18-COLUMN CSS GRID COM PROPORÇÃO RIGOROSA */}
        <div
          className="landscape-grid-table w-full min-w-[1040px] lg:min-w-full"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
            gap: 'var(--gap-table, 5px)',
            alignItems: 'stretch'
          }}
        >
          {/* ELEMENTOS PRINCIPAIS (Períodos 1 a 7) */}
          {mainTableElements.map((el) => {
            const pos = getElementGridPosition(el.num);
            const isHighlighted = filteredElementsMap.get(el.num) ?? true;
            const { color: hmColor, value: hmVal } = getHeatmapColorAndValue(el, heatmapMetric);

            return (
              <div
                key={el.num}
                style={{
                  gridRow: pos.row,
                  gridColumn: pos.col
                }}
                className="w-full aspect-[1/1.15]"
              >
                <ElementCell
                  element={el}
                  isSelected={selectedElement?.number === el.num}
                  isHighlighted={isHighlighted}
                  heatmapMetric={heatmapMetric}
                  heatmapColor={hmColor}
                  heatmapValue={hmVal}
                  onClick={() => setSelectedElement(getElement(el.num))}
                  onHover={setHoveredElement}
                />
              </div>
            );
          })}

          {/* CALLOUT 57-71 (Linha 6, Coluna 3) - Rigorosamente idêntico a um cubo normal */}
          <div
            style={{
              gridRow: 6,
              gridColumn: 3
            }}
            className="w-full aspect-[1/1.15]"
          >
            <div
              style={{
                aspectRatio: '1 / 1.15',
                border: isDark ? '2px solid #d946ef' : '1.5px solid #d946ef',
                borderRadius: '11px',
                background: isDark
                  ? 'linear-gradient(160deg, rgba(217, 70, 239, 0.35), rgba(5, 10, 30, 0.92))'
                  : 'linear-gradient(150deg, #fdf4ff 0%, #fae8ff 100%)',
                boxShadow: isDark
                  ? (isEcoMode ? '0 0 6px #d946ef' : '0 0 6px #d946ef, 0 0 18px rgba(217, 70, 239, 0.55), inset 0 0 14px rgba(217, 70, 239, 0.28)')
                  : '0 2px 6px rgba(217, 70, 239, 0.25)'
              }}
              className="element-cell-block landscape-cell relative w-full h-full p-1 sm:px-1.5 sm:py-1 flex flex-col justify-between select-none cursor-pointer text-left transition-transform duration-180 hover:scale-[1.14] z-10 overflow-hidden"
              title="Lantanídeos (57-71)"
            >
              {isDark && (
                <div
                  className="absolute inset-0 rounded-[9px] pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, transparent 45%)'
                  }}
                />
              )}
              <div className="w-full flex items-center justify-between leading-none pointer-events-none z-10 shrink-0">
                <span
                  className="cell-num-mass font-mono text-[9px] sm:text-[10px] font-bold px-1 py-0.2 rounded leading-none"
                  style={{
                    backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(217, 70, 239, 0.22)',
                    color: isDark ? '#ffffff' : '#701a75'
                  }}
                >
                  57
                </span>
                <span
                  className="cell-num-mass font-mono text-[8px] sm:text-[9px] font-bold leading-none tabular-nums"
                  style={{
                    color: isDark ? '#f0abfc' : '#a21caf'
                  }}
                >
                  71
                </span>
              </div>
              <div className="flex items-center justify-center my-auto pointer-events-none z-10">
                <span
                  className="cell-symbol font-orbitron font-extrabold text-[11px] sm:text-xs md:text-sm leading-none tracking-tight whitespace-nowrap"
                  style={{
                    color: isDark ? '#ffffff' : '#701a75',
                    textShadow: isDark ? '0 0 8px #d946ef' : undefined
                  }}
                >
                  La-Lu
                </span>
              </div>
              <div className="w-full flex items-center justify-center leading-none pointer-events-none z-10 px-0.5 shrink-0">
                <span
                  className="font-rajdhani font-bold text-center text-[8.5px] sm:text-[9.5px] whitespace-nowrap block w-full leading-none tracking-tight"
                  style={{
                    color: isDark ? '#f0abfc' : '#86198f'
                  }}
                >
                  Lantanídeos
                </span>
              </div>
            </div>
          </div>

          {/* CALLOUT 89-103 (Linha 7, Coluna 3) - Rigorosamente idêntico a um cubo normal */}
          <div
            style={{
              gridRow: 7,
              gridColumn: 3
            }}
            className="w-full aspect-[1/1.15]"
          >
            <div
              style={{
                aspectRatio: '1 / 1.15',
                border: isDark ? '2px solid #8b5cf6' : '1.5px solid #8b5cf6',
                borderRadius: '11px',
                background: isDark
                  ? 'linear-gradient(160deg, rgba(139, 92, 246, 0.35), rgba(5, 10, 30, 0.92))'
                  : 'linear-gradient(150deg, #f5f3ff 0%, #ede9fe 100%)',
                boxShadow: isDark
                  ? (isEcoMode ? '0 0 6px #8b5cf6' : '0 0 6px #8b5cf6, 0 0 18px rgba(139, 92, 246, 0.55), inset 0 0 14px rgba(139, 92, 246, 0.28)')
                  : '0 2px 6px rgba(139, 92, 246, 0.25)'
              }}
              className="element-cell-block landscape-cell relative w-full h-full p-1 sm:px-1.5 sm:py-1 flex flex-col justify-between select-none cursor-pointer text-left transition-transform duration-180 hover:scale-[1.14] z-10 overflow-hidden"
              title="Actinídeos (89-103)"
            >
              {isDark && (
                <div
                  className="absolute inset-0 rounded-[9px] pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, transparent 45%)'
                  }}
                />
              )}
              <div className="w-full flex items-center justify-between leading-none pointer-events-none z-10 shrink-0">
                <span
                  className="cell-num-mass font-mono text-[9px] sm:text-[10px] font-bold px-1 py-0.2 rounded leading-none"
                  style={{
                    backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(139, 92, 246, 0.22)',
                    color: isDark ? '#ffffff' : '#4c1d95'
                  }}
                >
                  89
                </span>
                <span
                  className="cell-num-mass font-mono text-[8px] sm:text-[9px] font-bold leading-none tabular-nums"
                  style={{
                    color: isDark ? '#c4b5fd' : '#6d28d9'
                  }}
                >
                  103
                </span>
              </div>
              <div className="flex items-center justify-center my-auto pointer-events-none z-10">
                <span
                  className="cell-symbol font-orbitron font-extrabold text-[11px] sm:text-xs md:text-sm leading-none tracking-tight whitespace-nowrap"
                  style={{
                    color: isDark ? '#ffffff' : '#4c1d95',
                    textShadow: isDark ? '0 0 8px #8b5cf6' : undefined
                  }}
                >
                  Ac-Lr
                </span>
              </div>
              <div className="w-full flex items-center justify-center leading-none pointer-events-none z-10 px-0.5 shrink-0">
                <span
                  className="font-rajdhani font-bold text-center text-[8.5px] sm:text-[9.5px] whitespace-nowrap block w-full leading-none tracking-tight"
                  style={{
                    color: isDark ? '#c4b5fd' : '#5b21b6'
                  }}
                >
                  Actinídeos
                </span>
              </div>
            </div>
          </div>

          {/* LINHA 8: ESPAÇO SEPARADOR DE 24PX */}
          <div
            style={{
              gridRow: 8,
              gridColumn: '1 / span 18',
              height: '24px'
            }}
            className="pointer-events-none"
          />

          {/* LINHA 9: LANTANÍDEOS (RÓTULO NAS COLS 1-2 E ELEMENTOS NAS COLS 3-17) */}
          <div
            style={{
              gridRow: 9,
              gridColumn: '1 / span 2'
            }}
            className="flex items-center justify-end pr-2 sm:pr-3 select-none pointer-events-none"
          >
            <span className="font-orbitron font-bold text-[10px] sm:text-xs text-[#d946ef] text-right drop-shadow-[0_0_8px_rgba(217,70,239,0.7)]">
              Lantanídeos:
            </span>
          </div>

          {lanthanides.map((el, idx) => {
            const isHighlighted = filteredElementsMap.get(el.num) ?? true;
            const { color: hmColor, value: hmVal } = getHeatmapColorAndValue(el, heatmapMetric);

            return (
              <div
                key={el.num}
                style={{
                  gridRow: 9,
                  gridColumn: 3 + idx
                }}
                className="w-full aspect-[1/1.15]"
              >
                <ElementCell
                  element={el}
                  isSelected={selectedElement?.number === el.num}
                  isHighlighted={isHighlighted}
                  heatmapMetric={heatmapMetric}
                  heatmapColor={hmColor}
                  heatmapValue={hmVal}
                  onClick={() => setSelectedElement(getElement(el.num))}
                  onHover={setHoveredElement}
                />
              </div>
            );
          })}

          {/* LINHA 10: ACTINÍDEOS (RÓTULO NAS COLS 1-2 E ELEMENTOS NAS COLS 3-17) */}
          <div
            style={{
              gridRow: 10,
              gridColumn: '1 / span 2'
            }}
            className="flex items-center justify-end pr-2 sm:pr-3 select-none pointer-events-none"
          >
            <span className="font-orbitron font-bold text-[10px] sm:text-xs text-[#8b5cf6] text-right drop-shadow-[0_0_8px_rgba(139,92,246,0.7)]">
              Actinídeos:
            </span>
          </div>

          {actinides.map((el, idx) => {
            const isHighlighted = filteredElementsMap.get(el.num) ?? true;
            const { color: hmColor, value: hmVal } = getHeatmapColorAndValue(el, heatmapMetric);

            return (
              <div
                key={el.num}
                style={{
                  gridRow: 10,
                  gridColumn: 3 + idx
                }}
                className="w-full aspect-[1/1.15]"
              >
                <ElementCell
                  element={el}
                  isSelected={selectedElement?.number === el.num}
                  isHighlighted={isHighlighted}
                  heatmapMetric={heatmapMetric}
                  heatmapColor={hmColor}
                  heatmapValue={hmVal}
                  onClick={() => setSelectedElement(getElement(el.num))}
                  onHover={setHoveredElement}
                />
              </div>
            );
          })}

          {/* LINHAS 9 E 10, COLUNA 18: TUBOS DE ENSAIO */}
          <div
            style={{
              gridRow: '9 / span 2',
              gridColumn: 18
            }}
            className="landscape-hide flex items-end justify-center pointer-events-none select-none pb-1"
          >
            <LabTestTubesAccent />
          </div>
        </div>
      </div>

      {/* Modal Detalhado do Elemento */}
      <ElementDetailModal
        element={selectedElement}
        onClose={() => setSelectedElement(null)}
        onSendToCalculator={onSendToCalculator}
        onCompare={(num) => onCompareElements && onCompareElements(num, num === 11 ? 19 : 11)}
      />
    </div>
  );
};
