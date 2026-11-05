import React from 'react';
import { ElementData, CATEGORY_NAMES, CATEGORY_COLORS } from '../../data/elementsData';

interface CategoryLegendProps {
  selectedCategory: ElementData['category'] | 'all';
  onSelectCategory: (category: ElementData['category'] | 'all') => void;
  selectedPhase: ElementData['phase'] | 'all';
  onSelectPhase: (phase: ElementData['phase'] | 'all') => void;
}

export const CategoryLegend: React.FC<CategoryLegendProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedPhase,
  onSelectPhase
}) => {
  const categories = Object.keys(CATEGORY_NAMES) as ElementData['category'][];

  return (
    <div className="flex flex-col gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
      {/* Category Pills */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Famílias Químicas:
          </span>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => onSelectCategory('all')}
              className="text-[11px] text-sky-400 hover:underline cursor-pointer"
            >
              Limpar filtro
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-2.5 py-1 text-xs rounded-lg border transition font-medium cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:text-slate-200'
            }`}
          >
            Todas as Famílias
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const colors = CATEGORY_COLORS[cat];
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(isSelected ? 'all' : cat)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border transition font-medium cursor-pointer ${
                  isSelected
                    ? `${colors.bg} ${colors.border} ${colors.text} ring-1 ring-white/20`
                    : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: colors.glow }}
                />
                <span>{CATEGORY_NAMES[cat]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* State / Phase Selector */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60 text-xs">
        <span className="text-slate-400 font-medium">Estado físico a 25 °C:</span>
        <div className="flex gap-1.5 flex-wrap">
          {(
            [
              { key: 'all', label: 'Todos' },
              { key: 'solid', label: '🧱 Sólidos' },
              { key: 'liquid', label: '💧 Líquidos' },
              { key: 'gas', label: '💨 Gases' },
              { key: 'unknown', label: '❓ Sintéticos' }
            ] as const
          ).map((p) => (
            <button
              key={p.key}
              onClick={() => onSelectPhase(p.key)}
              className={`px-2 py-0.5 rounded text-xs border transition cursor-pointer ${
                selectedPhase === p.key
                  ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 font-semibold'
                  : 'bg-slate-800/30 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
