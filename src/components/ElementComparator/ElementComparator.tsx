import React, { useState } from 'react';
import { ALL_118_ELEMENTS_SUMMARY, getElement, ElementData, CATEGORY_NAMES } from '../../data/elementsData';
import { BohrModel } from '../BohrModel';
import { useTheme } from '../../context/ThemeContext';
import { Layers, TrendingUp } from 'lucide-react';

interface ElementComparatorProps {
  initialEl1?: number;
  initialEl2?: number;
}

export const ElementComparator: React.FC<ElementComparatorProps> = ({
  initialEl1 = 11, // Na
  initialEl2 = 19  // K
}) => {
  const { isDark } = useTheme();
  const [el1Num, setEl1Num] = useState<number>(initialEl1);
  const [el2Num, setEl2Num] = useState<number>(initialEl2);

  const el1 = getElement(el1Num);
  const el2 = getElement(el2Num);

  // Helper for comparative bars
  const renderCompareMetric = (
    label: string,
    val1: number | null,
    val2: number | null,
    unit: string,
    maxVal: number
  ) => {
    const p1 = val1 !== null ? Math.min(100, Math.round((val1 / maxVal) * 100)) : 0;
    const p2 = val2 !== null ? Math.min(100, Math.round((val2 / maxVal) * 100)) : 0;

    return (
      <div className={`p-3 rounded-xl border space-y-2 transition-colors ${
        isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200 shadow-xs'
      }`}>
        <div className="flex justify-between text-xs font-semibold">
          <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">
            {val1 !== null ? `${val1} ${unit}` : '—'}
          </span>
          <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{label}</span>
          <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
            {val2 !== null ? `${val2} ${unit}` : '—'}
          </span>
        </div>

        {/* Dual comparative bar */}
        <div className="grid grid-cols-2 gap-2">
          <div className={`w-full h-2 rounded-full overflow-hidden flex justify-end ${
            isDark ? 'bg-slate-800' : 'bg-slate-200'
          }`}>
            <div
              className="bg-sky-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${p1}%` }}
            />
          </div>
          <div className={`w-full h-2 rounded-full overflow-hidden ${
            isDark ? 'bg-slate-800' : 'bg-slate-200'
          }`}>
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${p2}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className={`p-4 border rounded-2xl flex flex-wrap items-center justify-between gap-4 transition-colors ${
        isDark ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            Comparador Lado a Lado de Propriedades Periódicas
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Analise raio atômico, eletronegatividade, energia de ionização e tendências periódicas.
          </p>
        </div>

        {/* Quick comparative presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[11px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Exemplos:</span>
          {[
            { label: 'Na vs K (Alcalinos)', e1: 11, e2: 19 },
            { label: 'F vs Cl (Halogênios)', e1: 9, e2: 17 },
            { label: 'C vs Si (Família 14)', e1: 6, e2: 14 },
            { label: 'Fe vs Cu (Metais)', e1: 26, e2: 29 }
          ].map((pair, idx) => (
            <button
              key={idx}
              onClick={() => {
                setEl1Num(pair.e1);
                setEl2Num(pair.e2);
              }}
              className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              {pair.label}
            </button>
          ))}
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={`p-4 border rounded-xl space-y-2 ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <label className="text-xs font-bold text-sky-500 block">Elemento 1:</label>
          <select
            value={el1Num}
            onChange={(e) => setEl1Num(parseInt(e.target.value, 10))}
            className={`w-full px-3 py-2 border rounded-lg font-medium text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${
              isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          >
            {ALL_118_ELEMENTS_SUMMARY.map((e) => (
              <option key={e.num} value={e.num}>
                {e.num}. {e.name} ({e.sym}) - {CATEGORY_NAMES[e.cat]}
              </option>
            ))}
          </select>
        </div>

        <div className={`p-4 border rounded-xl space-y-2 ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <label className="text-xs font-bold text-indigo-500 block">Elemento 2:</label>
          <select
            value={el2Num}
            onChange={(e) => setEl2Num(parseInt(e.target.value, 10))}
            className={`w-full px-3 py-2 border rounded-lg font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          >
            {ALL_118_ELEMENTS_SUMMARY.map((e) => (
              <option key={e.num} value={e.num}>
                {e.num}. {e.name} ({e.sym}) - {CATEGORY_NAMES[e.cat]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-side Bohr Models */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className={`p-5 border rounded-2xl shadow-sm flex flex-col items-center ${
          isDark ? 'bg-slate-900/80 border-sky-500/30' : 'bg-white border-sky-200'
        }`}>
          <div className="text-center mb-3">
            <span className="text-2xl font-black font-mono text-sky-600 dark:text-sky-400">
              {el1.name} ({el1.symbol})
            </span>
            <span className={`text-xs block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Z = {el1.number} · Período {el1.period} · Grupo {el1.group}
            </span>
          </div>
          <BohrModel
            atomicNumber={el1.number}
            symbol={el1.symbol}
            name={el1.name}
            shells={el1.shells}
            atomicMass={el1.atomicMass}
            color="#0284c7"
          />
        </div>

        <div className={`p-5 border rounded-2xl shadow-sm flex flex-col items-center ${
          isDark ? 'bg-slate-900/80 border-indigo-500/30' : 'bg-white border-indigo-200'
        }`}>
          <div className="text-center mb-3">
            <span className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">
              {el2.name} ({el2.symbol})
            </span>
            <span className={`text-xs block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Z = {el2.number} · Período {el2.period} · Grupo {el2.group}
            </span>
          </div>
          <BohrModel
            atomicNumber={el2.number}
            symbol={el2.symbol}
            name={el2.name}
            shells={el2.shells}
            atomicMass={el2.atomicMass}
            color="#4f46e5"
          />
        </div>
      </div>

      {/* Side-by-Side Metrics Bar Comparison */}
      <div className={`p-5 border rounded-2xl shadow-sm space-y-3 ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 text-center ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Comparação Gráfica Direta das Propriedades Periódicas
        </h3>

        {renderCompareMetric('Eletronegatividade (Pauling)', el1.electronegativity, el2.electronegativity, '', 4.0)}
        {renderCompareMetric('Raio Atômico', el1.atomicRadius, el2.atomicRadius, 'pm', 300)}
        {renderCompareMetric('1ª Energia de Ionização', el1.ionizationEnergy, el2.ionizationEnergy, 'kJ/mol', 2400)}
        {renderCompareMetric('Densidade a 20 °C', el1.density, el2.density, 'g/cm³', 23)}
        {renderCompareMetric('Ponto de Fusão', el1.meltingPoint, el2.meltingPoint, 'K', 3800)}
      </div>

      {/* Periodic Trend Insights */}
      <div className={`p-4 border rounded-xl text-xs leading-relaxed space-y-2 ${
        isDark ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
      }`}>
        <div className="flex items-center gap-1.5 font-bold">
          <TrendingUp className="w-4 h-4 text-sky-500" />
          Análise das Tendências Periódicas entre {el1.name} e {el2.name}:
        </div>
        <p>
          {el1.period !== el2.period
            ? `O ${el1.period > el2.period ? el1.name : el2.name} está no período ${Math.max(el1.period, el2.period)}, possuindo mais níveis energéticos (${el1.period > el2.period ? el1.shells.length : el2.shells.length} camadas), o que aumenta seu raio atômico devido ao efeito de blindagem eletrônica.`
            : `Ambos estão no mesmo período (${el1.period}). Ao longo do período da esquerda para a direita, a carga nuclear efetiva (Zef) aumenta, atraindo os elétrons mais fortemente para o núcleo, diminuindo o raio atômico e aumentando a energia de ionização.`}
        </p>
      </div>
    </div>
  );
};
