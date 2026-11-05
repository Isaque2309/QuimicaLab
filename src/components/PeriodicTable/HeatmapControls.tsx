import React from 'react';
import { HeatmapMetric } from './ElementCell';
import { ElementBasicInfo } from '../../data/elementsData';
import { Activity, Flame, Magnet, Compass, Layers } from 'lucide-react';

interface HeatmapControlsProps {
  currentMetric: HeatmapMetric;
  onChangeMetric: (metric: HeatmapMetric) => void;
}

export const METRIC_CONFIGS: Record<HeatmapMetric, {
  label: string;
  unit: string;
  min: number;
  max: number;
  lowColor: string;
  highColor: string;
  description: string;
}> = {
  none: {
    label: 'Cores Padrão',
    unit: '',
    min: 0,
    max: 0,
    lowColor: '',
    highColor: '',
    description: 'Coloração clássica dividida por famílias e blocos químicos.'
  },
  electronegativity: {
    label: 'Eletronegatividade',
    unit: 'Pauling',
    min: 0.7,
    max: 4.0,
    lowColor: '#1e3a8a', // dark blue for low EN (e.g. Fr, Cs)
    highColor: '#f43f5e', // bright red for high EN (e.g. F, O, N)
    description: 'Tendência do átomo de atrair pares de elétrons em uma ligação covalente.'
  },
  atomicRadius: {
    label: 'Raio Atômico',
    unit: 'pm',
    min: 30,
    max: 300,
    lowColor: '#047857', // green small
    highColor: '#a855f7', // purple large
    description: 'Tamanho médio da nuvem eletrônica em torno do núcleo atômico.'
  },
  ionizationEnergy: {
    label: 'Energia de Ionização',
    unit: 'kJ/mol',
    min: 350,
    max: 2400,
    lowColor: '#0284c7', // light blue
    highColor: '#e11d48', // red high
    description: 'Energia mínima requerida para arrancar o elétron mais fraco de um átomo gasoso isolado.'
  },
  density: {
    label: 'Densidade',
    unit: 'g/cm³',
    min: 0.0001,
    max: 22.6,
    lowColor: '#0f766e',
    highColor: '#f59e0b',
    description: 'Massa por unidade de volume à temperatura ambiente.'
  },
  meltingPoint: {
    label: 'Ponto de Fusão',
    unit: 'K',
    min: 1,
    max: 3700,
    lowColor: '#0284c7',
    highColor: '#ea580c',
    description: 'Temperatura na qual a estrutura sólida colapsa para o estado líquido.'
  }
};

export function getHeatmapColorAndValue(
  element: ElementBasicInfo,
  metric: HeatmapMetric
): { color: string | null; value: string | number | null } {
  if (metric === 'none') {
    return { color: null, value: null };
  }

  const config = METRIC_CONFIGS[metric];
  let rawValue: number | null = null;

  switch (metric) {
    case 'electronegativity':
      rawValue = element.en;
      break;
    case 'atomicRadius':
      rawValue = element.rad;
      break;
    case 'ionizationEnergy':
      rawValue = element.ie;
      break;
    case 'density':
      rawValue = element.density;
      break;
    case 'meltingPoint':
      rawValue = element.mp;
      break;
  }

  if (rawValue === null || rawValue === undefined) {
    return { color: 'rgba(51, 65, 85, 0.4)', value: '—' };
  }

  // Normalize between 0 and 1
  const t = Math.max(0, Math.min(1, (rawValue - config.min) / (config.max - config.min)));

  // Generate HSL color ramp from cold (240 or 180) to hot (0)
  // Or smooth interpolation
  let hue = 220 - t * 220; // 220 (blue) -> 0 (red)
  if (metric === 'atomicRadius') {
    hue = 150 + t * 140; // green to violet
  }

  const color = `hsla(${hue}, 85%, 45%, 0.75)`;

  let displayVal: string | number = rawValue;
  if (metric === 'density' && rawValue < 0.01) {
    displayVal = rawValue.toFixed(4);
  } else if (metric === 'electronegativity') {
    displayVal = rawValue.toFixed(2);
  } else {
    displayVal = Math.round(rawValue);
  }

  return { color, value: displayVal };
}

export const HeatmapControls: React.FC<HeatmapControlsProps> = ({
  currentMetric,
  onChangeMetric
}) => {
  const currentConfig = METRIC_CONFIGS[currentMetric];

  return (
    <div className="flex flex-col gap-2 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-sky-400" />
          Mapas de Calor Periódicos:
        </span>

        {currentMetric !== 'none' && (
          <span className="text-xs text-sky-300 font-medium">
            {currentConfig.label} ({currentConfig.unit})
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(
          [
            { key: 'none', label: '🎨 Famílias' },
            { key: 'electronegativity', label: '⚡ Eletronegatividade' },
            { key: 'atomicRadius', label: '⭕ Raio Atômico' },
            { key: 'ionizationEnergy', label: '💥 1ª Ionização' },
            { key: 'density', label: '⚖️ Densidade' },
            { key: 'meltingPoint', label: '🔥 Ponto de Fusão' }
          ] as const
        ).map((m) => (
          <button
            key={m.key}
            onClick={() => onChangeMetric(m.key)}
            className={`px-2.5 py-1 text-xs rounded-lg border transition font-medium cursor-pointer ${
              currentMetric === m.key
                ? 'bg-sky-500/20 border-sky-500 text-sky-300 ring-1 ring-sky-500/40'
                : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:text-slate-200'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {currentMetric !== 'none' && (
        <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-col gap-1.5 text-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Mín: {currentConfig.min} {currentConfig.unit}</span>
            <span className="text-slate-500 text-[10px] hidden sm:inline">{currentConfig.description}</span>
            <span>Máx: {currentConfig.max} {currentConfig.unit}</span>
          </div>

          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{
              background: currentMetric === 'atomicRadius'
                ? 'linear-gradient(to right, hsl(150, 85%, 45%), hsl(290, 85%, 45%))'
                : 'linear-gradient(to right, hsl(220, 85%, 45%), hsl(120, 85%, 45%), hsl(45, 85%, 45%), hsl(0, 85%, 45%))'
            }}
          />
        </div>
      )}
    </div>
  );
};
