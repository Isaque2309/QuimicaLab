import React, { useRef } from 'react';
import { CATEGORY_COLORS, ElementBasicInfo } from '../../data/elementsData';
import { useTheme } from '../../context/ThemeContext';

export type HeatmapMetric = 'none' | 'electronegativity' | 'atomicRadius' | 'ionizationEnergy' | 'density' | 'meltingPoint';

interface ElementCellProps {
  element: ElementBasicInfo;
  isSelected?: boolean;
  isHighlighted?: boolean;
  heatmapMetric: HeatmapMetric;
  heatmapColor?: string | null;
  heatmapValue?: string | number | null;
  onClick: () => void;
  onHover?: (el: ElementBasicInfo | null) => void;
}

const LIGHT_CATEGORY_STYLES: Record<string, {
  bg: string;
  border: string;
  symbolColor: string;
  nameColor: string;
  numBg: string;
  numColor: string;
  massColor: string;
  shadow: string;
}> = {
  'nonmetal': {
    bg: 'linear-gradient(150deg, #f0fdf4 0%, #dcfce7 100%)',
    border: '#10b981',
    symbolColor: '#064e3b',
    nameColor: '#047857',
    numBg: 'rgba(16, 185, 129, 0.22)',
    numColor: '#064e3b',
    massColor: '#047857',
    shadow: '0 2px 6px rgba(16, 185, 129, 0.25)'
  },
  'noble-gas': {
    bg: 'linear-gradient(150deg, #faf5ff 0%, #ede9fe 100%)',
    border: '#a855f7',
    symbolColor: '#4c1d95',
    nameColor: '#6b21a8',
    numBg: 'rgba(168, 85, 247, 0.22)',
    numColor: '#3b0764',
    massColor: '#7e22ce',
    shadow: '0 2px 6px rgba(168, 85, 247, 0.25)'
  },
  'alkali-metal': {
    bg: 'linear-gradient(150deg, #fff1f2 0%, #ffe4e6 100%)',
    border: '#f43f5e',
    symbolColor: '#881337',
    nameColor: '#9f1239',
    numBg: 'rgba(244, 63, 94, 0.22)',
    numColor: '#4c0519',
    massColor: '#be123c',
    shadow: '0 2px 6px rgba(244, 63, 94, 0.25)'
  },
  'alkaline-earth': {
    bg: 'linear-gradient(150deg, #fffbeb 0%, #fef3c7 100%)',
    border: '#f59e0b',
    symbolColor: '#78350f',
    nameColor: '#92400e',
    numBg: 'rgba(245, 158, 11, 0.25)',
    numColor: '#451a03',
    massColor: '#b45309',
    shadow: '0 2px 6px rgba(245, 158, 11, 0.25)'
  },
  'metalloid': {
    bg: 'linear-gradient(150deg, #ecfdf5 0%, #ccfbf1 100%)',
    border: '#14b8a6',
    symbolColor: '#134e4a',
    nameColor: '#0f766e',
    numBg: 'rgba(20, 184, 166, 0.22)',
    numColor: '#042f2e',
    massColor: '#0f766e',
    shadow: '0 2px 6px rgba(20, 184, 166, 0.25)'
  },
  'halogen': {
    bg: 'linear-gradient(150deg, #ecfeff 0%, #cffafe 100%)',
    border: '#06b6d4',
    symbolColor: '#164e63',
    nameColor: '#0e7490',
    numBg: 'rgba(6, 182, 212, 0.22)',
    numColor: '#083344',
    massColor: '#0891b2',
    shadow: '0 2px 6px rgba(6, 182, 212, 0.25)'
  },
  'transition': {
    bg: 'linear-gradient(150deg, #eff6ff 0%, #dbeafe 100%)',
    border: '#3b82f6',
    symbolColor: '#1e3a8a',
    nameColor: '#1d4ed8',
    numBg: 'rgba(59, 130, 246, 0.22)',
    numColor: '#172554',
    massColor: '#2563eb',
    shadow: '0 2px 6px rgba(59, 130, 246, 0.25)'
  },
  'post-transition': {
    bg: 'linear-gradient(150deg, #f0f9ff 0%, #e0f2fe 100%)',
    border: '#0284c7',
    symbolColor: '#0c4a6e',
    nameColor: '#0369a1',
    numBg: 'rgba(2, 132, 199, 0.22)',
    numColor: '#082f49',
    massColor: '#0284c7',
    shadow: '0 2px 6px rgba(2, 132, 199, 0.25)'
  },
  'lanthanide': {
    bg: 'linear-gradient(150deg, #fdf4ff 0%, #fae8ff 100%)',
    border: '#d946ef',
    symbolColor: '#701a75',
    nameColor: '#86198f',
    numBg: 'rgba(217, 70, 239, 0.22)',
    numColor: '#4a044e',
    massColor: '#a21caf',
    shadow: '0 2px 6px rgba(217, 70, 239, 0.25)'
  },
  'actinide': {
    bg: 'linear-gradient(150deg, #f5f3ff 0%, #ede9fe 100%)',
    border: '#8b5cf6',
    symbolColor: '#4c1d95',
    nameColor: '#5b21b6',
    numBg: 'rgba(139, 92, 246, 0.22)',
    numColor: '#2e1065',
    massColor: '#6d28d9',
    shadow: '0 2px 6px rgba(139, 92, 246, 0.25)'
  }
};

export const ElementCell: React.FC<ElementCellProps> = ({
  element,
  isSelected,
  isHighlighted = true,
  heatmapMetric,
  heatmapColor,
  heatmapValue,
  onClick,
  onHover
}) => {
  const { isDark, isEcoMode } = useTheme();
  const categoryConfig = CATEGORY_COLORS[element.cat] || CATEGORY_COLORS.nonmetal;
  const isHeatmapActive = heatmapMetric !== 'none';
  const glowColor = isHeatmapActive && heatmapColor ? heatmapColor : categoryConfig.glow;
  const lightStyle = LIGHT_CATEGORY_STYLES[element.cat] || LIGHT_CATEGORY_STYLES.nonmetal;

  const isRadioactive = element.num === 43 || element.num === 61 || element.num >= 84;
  const formattedMass = element.mass < 100 ? element.mass.toFixed(1) : Math.round(element.mass).toString();

  // Long press timer para toque no celular
  const timerRef = useRef<number | null>(null);
  const isLongPress = useRef(false);

  const handleTouchStart = () => {
    isLongPress.current = false;
    timerRef.current = window.setTimeout(() => {
      isLongPress.current = true;
      if (onHover) onHover(element);
    }, 400);
  };

  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!isLongPress.current) {
      onClick();
    }
  };

  // Font size e tracking calculados com a fonte condensada Rajdhani para caber o nome 100% por extenso sem reticências (...)
  const nameLength = element.name.length;
  const nameFontSize = nameLength <= 5
    ? 'clamp(0.55rem, 0.72vw, 0.65rem)'
    : nameLength <= 7
    ? 'clamp(0.48rem, 0.62vw, 0.58rem)'
    : nameLength <= 9
    ? 'clamp(0.43rem, 0.54vw, 0.51rem)'
    : 'clamp(0.38rem, 0.46vw, 0.45rem)';

  const letterSpacing = nameLength >= 11
    ? '-0.035em'
    : nameLength >= 9
    ? '-0.02em'
    : '-0.01em';

  const cellStyle: React.CSSProperties = isDark
    ? {
        ['--cell-glow' as any]: glowColor,
        border: `2px solid ${glowColor}`,
        borderRadius: '11px',
        background: isHeatmapActive && heatmapColor
          ? heatmapColor
          : `linear-gradient(160deg, ${glowColor}59, rgba(5, 10, 30, 0.92))`,
        boxShadow: isEcoMode
          ? `0 0 6px ${glowColor}`
          : isSelected
          ? `0 0 0 2.5px #ffffff, 0 0 14px ${glowColor}, 0 0 35px ${glowColor}, inset 0 0 18px ${glowColor}80`
          : `0 0 6px ${glowColor}, 0 0 18px ${glowColor}8c, inset 0 0 14px ${glowColor}47`
      }
    : {
        ['--cell-glow' as any]: glowColor,
        border: `1.5px solid ${isHeatmapActive && heatmapColor ? heatmapColor : lightStyle.border}`,
        borderRadius: '11px',
        background: isHeatmapActive && heatmapColor ? heatmapColor : lightStyle.bg,
        boxShadow: isSelected
          ? `0 0 0 2.5px #0284c7, 0 4px 14px ${lightStyle.border}60`
          : lightStyle.shadow
      };

  return (
    <button
      onClick={() => {
        if (!('ontouchstart' in window)) {
          onClick();
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => onHover && onHover(element)}
      onMouseLeave={() => onHover && onHover(null)}
      style={cellStyle}
      className={`element-cell-block element-cell-hoverable landscape-cell relative w-full h-full p-1 sm:px-1.5 sm:py-1 flex flex-col justify-between cursor-pointer text-left overflow-hidden transition-transform duration-150 ${
        !isHighlighted
          ? 'opacity-20 grayscale-[90%]'
          : 'opacity-100 hover:brightness-110'
      } ${
        isSelected ? 'z-30 scale-[1.12]' : ''
      }`}
      title={`${element.name} (${element.sym}) — Z: ${element.num} — Massa: ${element.mass} u`}
    >
      {/* Reflexo de Vidro sutil (apenas no modo escuro) */}
      {isDark && (
        <div
          className="absolute inset-0 rounded-[9px] pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, transparent 45%)'
          }}
        />
      )}

      {/* Topo: Número atômico à esquerda com badge compacto, massa à direita sem sobreposição */}
      <div className="w-full flex items-center justify-between leading-none pointer-events-none z-10 shrink-0">
        <div className="flex items-center gap-0.5">
          <span
            className="cell-num-mass font-mono text-[9px] sm:text-[10px] font-bold px-1 py-0.2 rounded leading-none"
            style={{
              backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : lightStyle.numBg,
              color: isDark ? '#ffffff' : lightStyle.numColor
            }}
          >
            {element.num}
          </span>
          {isRadioactive && !isHeatmapActive && (
            <span
              className="text-[7.5px] font-bold leading-none"
              style={{ color: isDark ? '#facc15' : '#b45309' }}
              title="Radioativo"
            >
              ☢
            </span>
          )}
        </div>

        {isHeatmapActive ? (
          <span
            className="cell-num-mass text-[8px] sm:text-[8.5px] font-mono font-bold px-1 py-0.2 rounded tabular-nums"
            style={{
              backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.85)',
              color: isDark ? '#ffffff' : '#0f172a'
            }}
          >
            {heatmapValue ?? '—'}
          </span>
        ) : (
          <div className="flex items-center gap-0.5">
            <span
              className="cell-num-mass font-mono text-[8px] sm:text-[9px] font-bold leading-none tabular-nums tracking-tight"
              style={{
                color: isDark ? '#fbbf24' : lightStyle.massColor,
                textShadow: isDark ? '0 0 4px rgba(251,191,36,0.5)' : undefined
              }}
            >
              {formattedMass}
            </span>
            {element.phase === 'liquid' && (
              <span
                className="text-[7.5px] leading-none"
                style={{ color: isDark ? '#7dd3fc' : '#0284c7' }}
                title="Líquido"
              >
                💧
              </span>
            )}
          </div>
        )}
      </div>

      {/* Centro: Símbolo em Orbitron em negrito com proporção correta e contraste impecável */}
      <div className="flex items-center justify-center my-auto pointer-events-none z-10">
        <span
          className="cell-symbol font-orbitron font-extrabold leading-none tracking-tight text-center"
          style={{
            fontSize: element.sym.length === 1 ? 'clamp(1.05rem, 1.6vw, 1.45rem)' : 'clamp(0.92rem, 1.35vw, 1.25rem)',
            color: isDark ? '#ffffff' : lightStyle.symbolColor,
            textShadow: isDark ? (isEcoMode ? undefined : `0 0 10px ${glowColor}, 0 0 20px ${glowColor}80`) : undefined
          }}
        >
          {element.sym}
        </span>
      </div>

      {/* Embaixo: Nome por extenso com tipografia Rajdhani condensada (100% visível, SEM reticências) */}
      <div className="w-full flex items-center justify-center leading-none pointer-events-none z-10 px-0.5 shrink-0">
        <span
          className="font-rajdhani font-bold text-center leading-none whitespace-nowrap block w-full"
          style={{
            fontSize: nameFontSize,
            letterSpacing,
            color: isDark ? '#ffffff' : lightStyle.nameColor,
            textShadow: isDark ? '0 1px 2px rgba(0,0,0,0.95)' : undefined
          }}
        >
          {element.name}
        </span>
      </div>
    </button>
  );
};
