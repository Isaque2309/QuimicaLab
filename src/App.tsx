import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar, ActiveView } from './components/Navbar';
import { PeriodicTable } from './components/PeriodicTable/PeriodicTable';
import { ChemicalCalculators } from './components/Calculator/ChemicalCalculators';
import { ElementComparator } from './components/ElementComparator/ElementComparator';
import { FlaskConical } from 'lucide-react';

function AppContent() {
  const { isDark } = useTheme();
  const [activeView, setActiveView] = useState<ActiveView>('table');
  const [targetCalculatorFormula, setTargetCalculatorFormula] = useState<string>('H2SO4');
  const [compareEl1, setCompareEl1] = useState<number>(11);
  const [compareEl2, setCompareEl2] = useState<number>(19);

  const handleSendToCalculator = (symbol: string) => {
    const diatomic = ['H', 'N', 'O', 'F', 'Cl', 'Br', 'I'];
    const formula = diatomic.includes(symbol) ? `${symbol}2` : symbol;
    setTargetCalculatorFormula(formula);
    setActiveView('calculator');
  };

  const handleCompareElements = (num1: number, num2: number) => {
    setCompareEl1(num1);
    setCompareEl2(num2);
    setActiveView('comparator');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative text-slate-100 selection:bg-sky-500/30 selection:text-sky-200">
      {/* Camadas de Fundo Cósmico Fixo de Alto Desempenho */}
      <div className="cosmic-bg-layer" />
      <div className="cosmic-pattern-layer" />

      {/* Top Navbar */}
      <div className="relative z-40">
        <Navbar activeView={activeView} setActiveView={setActiveView} />
      </div>

      {/* Main Content Area: max-width 1600px, 16px lateral padding e respeito a notch */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-3 sm:px-4 pl-[max(12px,env(safe-area-inset-left))] pr-[max(12px,env(safe-area-inset-right))] py-2 sm:py-4 relative z-10">
        {activeView === 'table' && (
          <PeriodicTable
            onSendToCalculator={handleSendToCalculator}
            onCompareElements={handleCompareElements}
          />
        )}

        {activeView === 'calculator' && (
          <ChemicalCalculators initialFormula={targetCalculatorFormula} />
        )}

        {activeView === 'comparator' && (
          <ElementComparator initialEl1={compareEl1} initialEl2={compareEl2} />
        )}
      </main>

      {/* Rodapé (escondido em celular horizontal para não roubar espaço de tela) */}
      <footer className={`landscape-hide mt-auto border-t py-3.5 text-xs transition-colors duration-200 relative z-10 ${
        isDark ? 'border-slate-800/80 bg-[#040816]/85 backdrop-blur-md text-slate-400' : 'border-slate-200 bg-white/90 text-slate-600'
      }`}>
        <div className="max-w-[1600px] mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-sky-400" />
            <span className="font-extrabold text-slate-900 dark:text-white font-orbitron">QuímicaLab</span>
            <span className="opacity-50">•</span>
            <span>Explore a tabela periódica de forma interativa!</span>
          </div>
          <div className="flex flex-col items-end text-right leading-tight text-[11px]">
            <span className="font-semibold opacity-90">Desenvolvido por Isaque Rocha</span>
            <span className="opacity-60">Tecnologia &amp; Desenvolvimento Web</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
