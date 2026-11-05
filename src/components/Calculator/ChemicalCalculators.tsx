import React, { useState } from 'react';
import { calculateMolarMass, MolarMassResult, formatChemicalFormula } from '../../utils/molarMass';
import { balanceChemicalEquation, BalancedEquationResult } from '../../utils/equationBalancer';
import { useTheme } from '../../context/ThemeContext';
import { Calculator, Scale, Droplet, Wind, Zap, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ChemicalCalculatorsProps {
  initialFormula?: string;
}

export const ChemicalCalculators: React.FC<ChemicalCalculatorsProps> = ({ initialFormula = 'H2SO4' }) => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'molarmass' | 'balancer' | 'solutions' | 'gases' | 'ph'>('molarmass');

  // Molar Mass State
  const [formulaInput, setFormulaInput] = useState<string>(initialFormula);
  const [molarResult, setMolarResult] = useState<MolarMassResult | null>(() => {
    try {
      return calculateMolarMass(initialFormula);
    } catch {
      return null;
    }
  });
  const [molarError, setMolarError] = useState<string | null>(null);
  const [sampleMass, setSampleMass] = useState<string>('98.08'); // default 1 mol of H2SO4

  // Equation Balancer State
  const [eqInput, setEqInput] = useState<string>('C3H8 + O2 -> CO2 + H2O');
  const [eqResult, setEqResult] = useState<BalancedEquationResult | null>(() => {
    try {
      return balanceChemicalEquation('C3H8 + O2 -> CO2 + H2O');
    } catch {
      return null;
    }
  });
  const [eqError, setEqError] = useState<string | null>(null);

  const handleBalance = (eq: string) => {
    try {
      setEqError(null);
      const res = balanceChemicalEquation(eq);
      setEqResult(res);
    } catch (err: any) {
      setEqError(err.message || 'Erro ao balancear equação.');
      setEqResult(null);
    }
  };

  // Solution Prep State: M = m / (MM * V)
  const [solMass, setSolMass] = useState<string>('5.84'); // g of NaCl
  const [solMM, setSolMM] = useState<string>('58.44'); // g/mol
  const [solVol, setSolVol] = useState<string>('0.5'); // L

  // Dilution State: C1 * V1 = C2 * V2
  const [dilC1, setDilC1] = useState<string>('2.0'); // mol/L
  const [dilV1, setDilV1] = useState<string>('50'); // mL
  const [dilC2, setDilC2] = useState<string>('0.5'); // mol/L

  // Ideal Gas State: P * V = n * R * T (R = 0.08206 atm*L/mol*K)
  const [gasP, setGasP] = useState<string>('1.0'); // atm
  const [gasN, setGasN] = useState<string>('1.0'); // mol
  const [gasT, setGasT] = useState<string>('273.15'); // K (0 °C)

  // pH and pOH State
  const [phInput, setPhInput] = useState<string>('7.0');

  // Molar mass calculation handler
  const handleCalcMolarMass = (f: string) => {
    try {
      setMolarError(null);
      const res = calculateMolarMass(f);
      setMolarResult(res);
      setSampleMass(res.totalMolarMass.toString());
    } catch (err: any) {
      setMolarError(err.message || 'Fórmula inválida.');
    }
  };

  // Quick preset formula loader
  const loadPresetFormula = (preset: string) => {
    setFormulaInput(preset);
    handleCalcMolarMass(preset);
  };

  // Convert mass to moles
  const currentMassNum = parseFloat(sampleMass) || 0;
  const currentMoles = molarResult && molarResult.totalMolarMass > 0 ? currentMassNum / molarResult.totalMolarMass : 0;
  const currentMolecules = currentMoles * 6.022e23;
  const currentGasVolumeSTP = currentMoles * 22.4; // L at STP

  // Solutions: calculate Molarity M = m / (MM * V)
  const calcMolarityVal = () => {
    const m = parseFloat(solMass);
    const mm = parseFloat(solMM);
    const v = parseFloat(solVol);
    if (m && mm && v) {
      return (m / (mm * v)).toFixed(4);
    }
    return '—';
  };

  // Dilution: calculate V2 needed = (C1 * V1) / C2
  const calcDilutionV2 = () => {
    const c1 = parseFloat(dilC1);
    const v1 = parseFloat(dilV1);
    const c2 = parseFloat(dilC2);
    if (c1 && v1 && c2 && c2 > 0) {
      return ((c1 * v1) / c2).toFixed(2);
    }
    return '—';
  };

  // Gas law solver for V = (n * R * T) / P
  const calcGasVolume = () => {
    const n = parseFloat(gasN);
    const t = parseFloat(gasT);
    const p = parseFloat(gasP);
    if (n && t && p && p > 0) {
      return ((n * 0.08206 * t) / p).toFixed(3);
    }
    return '—';
  };

  // pH Calculations
  const phVal = Math.min(14, Math.max(0, parseFloat(phInput) || 7));
  const pohVal = 14 - phVal;
  const hConc = Math.pow(10, -phVal);
  const ohConc = Math.pow(10, -pohVal);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className={`p-4 border rounded-2xl flex flex-wrap items-center justify-between gap-4 transition-colors ${
        isDark ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calculator className="w-5 h-5 text-sky-500" />
            Central de Cálculos & Balanceamento Químico
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Massa molar, balanceamento de equações (Lavoisier), soluções, diluição, gases ideais (PV=nRT) e pH/pOH.
          </p>
        </div>

        {/* Tab pills */}
        <div className={`flex flex-wrap gap-1 p-1 rounded-xl border text-xs font-semibold ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            onClick={() => setActiveTab('molarmass')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'molarmass'
                ? isDark ? 'bg-sky-500 text-white shadow-sm' : 'bg-white text-sky-700 shadow-sm border border-slate-200'
                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            Massa Molar & %
          </button>
          <button
            onClick={() => setActiveTab('balancer')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'balancer'
                ? isDark ? 'bg-sky-500 text-white shadow-sm' : 'bg-white text-sky-700 shadow-sm border border-slate-200'
                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Balanceamento de Equações
          </button>
          <button
            onClick={() => setActiveTab('solutions')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'solutions'
                ? isDark ? 'bg-sky-500 text-white shadow-sm' : 'bg-white text-sky-700 shadow-sm border border-slate-200'
                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Droplet className="w-3.5 h-3.5" />
            Soluções & Diluição
          </button>
          <button
            onClick={() => setActiveTab('gases')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'gases'
                ? isDark ? 'bg-sky-500 text-white shadow-sm' : 'bg-white text-sky-700 shadow-sm border border-slate-200'
                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            Gases Ideais (PV=nRT)
          </button>
          <button
            onClick={() => setActiveTab('ph')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ph'
                ? isDark ? 'bg-sky-500 text-white shadow-sm' : 'bg-white text-sky-700 shadow-sm border border-slate-200'
                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            pH & pOH
          </button>
        </div>
      </div>

      {/* Tab 1: Molar Mass & Percentage Breakdown */}
      {activeTab === 'molarmass' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Formula Input Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`p-5 border rounded-2xl shadow-sm space-y-4 transition-colors ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <label className={`block text-xs font-bold uppercase tracking-wider ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Digite a Fórmula Molecular:
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={formulaInput}
                  onChange={(e) => {
                    setFormulaInput(e.target.value);
                    handleCalcMolarMass(e.target.value);
                  }}
                  placeholder="Ex: H2SO4, Ca(OH)2, C6H12O6, CuSO4*5H2O"
                  className={`flex-1 px-4 py-2.5 border rounded-xl font-mono text-base focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {molarError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-500 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{molarError}</span>
                </div>
              )}

              {/* Quick Preset Buttons */}
              <div>
                <span className={`text-[11px] block mb-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Exemplos Rápidos:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['H2SO4', 'Ca(OH)2', 'C6H12O6', 'CuSO4*5H2O', 'KMnO4', 'Fe2(SO4)3', 'NaCl', 'C2H5OH'].map((f) => (
                    <button
                      key={f}
                      onClick={() => loadPresetFormula(f)}
                      className={`px-2.5 py-1 text-xs rounded-lg font-mono transition cursor-pointer border ${
                        isDark
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mass Converter Calculator */}
              {molarResult && (
                <div className={`pt-4 border-t space-y-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                  <label className={`block text-xs font-bold uppercase tracking-wider ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Conversor Rápido de Massa ↔ Mols:
                  </label>

                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <span className={`text-[10px] block mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Massa da Amostra (g):
                      </span>
                      <input
                        type="number"
                        value={sampleMass}
                        onChange={(e) => setSampleMass(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg font-mono text-sm ${
                          isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 mt-4" />
                    <div className="flex-1">
                      <span className={`text-[10px] block mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Quantidade (mol):
                      </span>
                      <div className={`px-3 py-2 border rounded-lg font-mono font-bold text-sm ${
                        isDark ? 'bg-slate-950 border-slate-800 text-sky-400' : 'bg-slate-50 border-slate-200 text-sky-700'
                      }`}>
                        {currentMoles.toFixed(4)} mol
                      </div>
                    </div>
                  </div>

                  {/* Derived stoichiometric metrics */}
                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                    <div className={`p-2.5 rounded-lg border ${
                      isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Número de Moléculas</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-300 font-bold">
                        {currentMolecules > 0 ? currentMolecules.toExponential(3) : 0}
                      </span>
                      <span className={`text-[9px] block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Constante de Avogadro</span>
                    </div>

                    <div className={`p-2.5 rounded-lg border ${
                      isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Volume gasoso CNTP</span>
                      <span className="font-mono text-cyan-600 dark:text-cyan-300 font-bold">
                        {currentGasVolumeSTP > 0 ? `${currentGasVolumeSTP.toFixed(2)} L` : '0 L'}
                      </span>
                      <span className={`text-[9px] block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>A 0 °C e 1 atm (22,4 L/mol)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results & Composition Card */}
          <div className="lg:col-span-7 space-y-4">
            {molarResult ? (
              <div className={`p-5 border rounded-2xl shadow-sm space-y-5 transition-colors ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                {/* Header Mass banner */}
                <div className={`flex items-center justify-between p-4 rounded-xl border ${
                  isDark
                    ? 'bg-gradient-to-r from-sky-950/60 via-slate-900 to-indigo-950/60 border-sky-500/30'
                    : 'bg-gradient-to-r from-sky-50 via-slate-50 to-indigo-50 border-sky-200'
                }`}>
                  <div>
                    <span className={`text-xs font-mono font-medium ${isDark ? 'text-sky-300' : 'text-sky-700'}`}>
                      Substância Analisada:
                    </span>
                    <h3 className={`text-2xl font-black font-mono mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {molarResult.formattedFormula}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs block font-sans ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Massa Molar Total:
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold font-mono text-sky-600 dark:text-sky-400">
                      {molarResult.totalMolarMass}
                    </span>
                    <span className={`text-xs ml-1 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>g/mol</span>
                  </div>
                </div>

                {/* Percentage Composition Table */}
                <div>
                  <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Composição Centesimal em Massa (%):
                  </h4>

                  <div className="space-y-2.5">
                    {molarResult.elements.map((el) => (
                      <div key={el.symbol} className={`p-3 rounded-xl border ${
                        isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-600 dark:text-sky-300 font-mono font-bold flex items-center justify-center text-xs">
                              {el.symbol}
                            </span>
                            <div>
                              <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{el.name}</span>
                              <span className={`text-[11px] ml-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                ({el.count} átomo{el.count > 1 ? 's' : ''} × {el.atomicMass.toFixed(2)} u)
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-mono font-bold text-sky-600 dark:text-sky-300 text-sm">
                              {el.percentage.toFixed(2)}%
                            </span>
                            <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              {el.totalMass.toFixed(2)} g/mol
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                          <div
                            className="bg-sky-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${el.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Theoretical Explanatory Box */}
                <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                  isDark ? 'bg-slate-950/40 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <span className="font-bold block mb-1">💡 Como este cálculo é feito:</span>
                  A massa molar é a soma das massas atômicas de cada elemento multiplicada pela sua quantidade estequiométrica na fórmula. A porcentagem de cada elemento é dada por: <code className="font-mono text-sky-600 dark:text-sky-300">%X = (massa de X / massa total) × 100</code>.
                </div>
              </div>
            ) : (
              <div className={`p-12 text-center border border-dashed rounded-2xl ${
                isDark ? 'text-slate-500 border-slate-800' : 'text-slate-400 border-slate-300'
              }`}>
                Digite uma fórmula válida para ver a análise completa.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Equation Balancer */}
      {activeTab === 'balancer' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Equation Input Card with Symbol Keypad */}
          <div className={`p-5 border rounded-2xl shadow-sm space-y-4 transition-colors ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <label className={`block text-xs font-bold uppercase tracking-wider ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Digite a Equação Química para Balancear:
            </label>

            <div className="flex gap-3">
              <input
                type="text"
                value={eqInput}
                onChange={(e) => {
                  setEqInput(e.target.value);
                  handleBalance(e.target.value);
                }}
                placeholder="Ex: C3H8 + O2 -> CO2 + H2O ou Fe + O2 -> Fe2O3"
                className={`flex-1 px-4 py-3 border rounded-xl font-mono text-base focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
              <button
                onClick={() => handleBalance(eqInput)}
                className="px-5 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-sm"
              >
                Balancear
              </button>
            </div>

            {/* Quick Chemical Symbols Toolbar */}
            <div className={`p-3 rounded-xl border flex flex-col gap-2 ${
              isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Teclado de Símbolos Químicos:
                </span>
                <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Clique para inserir na equação
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { sym: ' + ', label: '+ Reagir' },
                  { sym: ' -> ', label: '→ Produzir' },
                  { sym: ' ⇌ ', label: '⇌ Equilíbrio' },
                  { sym: '(', label: '(' },
                  { sym: ')', label: ')' },
                  { sym: '·', label: '· Aduto' },
                  { sym: 'Δ', label: 'Δ Calor' },
                  { sym: '(s)', label: '(s) Sólido' },
                  { sym: '(l)', label: '(l) Líquido' },
                  { sym: '(g)', label: '(g) Gás' },
                  { sym: '(aq)', label: '(aq) Aquoso' },
                  { sym: '2', label: '2' },
                  { sym: '3', label: '3' },
                  { sym: '4', label: '4' }
                ].map((s) => (
                  <button
                    key={s.sym}
                    type="button"
                    onClick={() => {
                      const updated = eqInput + s.sym;
                      setEqInput(updated);
                      handleBalance(updated);
                    }}
                    className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border transition cursor-pointer hover:scale-105 active:scale-95 ${
                      isDark
                        ? 'bg-slate-800/90 hover:bg-slate-700 text-sky-300 border-slate-700'
                        : 'bg-white hover:bg-slate-100 text-sky-700 border-slate-300 shadow-xs'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const updated = eqInput.slice(0, -1);
                    setEqInput(updated);
                    handleBalance(updated);
                  }}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition cursor-pointer ${
                    isDark
                      ? 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border-rose-800/60'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-300'
                  }`}
                  title="Apagar último caractere"
                >
                  ⌫ Apagar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEqInput('');
                    setEqResult(null);
                  }}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition cursor-pointer ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border-slate-700'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700 border-slate-300'
                  }`}
                >
                  ✕ Limpar
                </button>
              </div>
            </div>

            {eqError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-500 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{eqError}</span>
              </div>
            )}

            {/* Presets */}
            <div>
              <span className={`text-[11px] block mb-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Equações Frequentes de Vestibulares:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'C3H8 + O2 -> CO2 + H2O',
                  'Fe + O2 -> Fe2O3',
                  'Al + HCl -> AlCl3 + H2',
                  'N2 + H2 -> NH3',
                  'NaOH + H2SO4 -> Na2SO4 + H2O',
                  'KClO3 -> KCl + O2'
                ].map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setEqInput(p);
                      handleBalance(p);
                    }}
                    className={`px-2.5 py-1 text-xs rounded-lg font-mono transition cursor-pointer border ${
                      isDark
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {eqResult && (() => {
            // Calculate stoichiometric masses for reactants & products
            const safeMolarMass = (f: string) => {
              try {
                return calculateMolarMass(f).totalMolarMass;
              } catch {
                return 0;
              }
            };

            const reactantCards = eqResult.reactants.map(r => {
              const mm = safeMolarMass(r.formula);
              const totalMass = Number((r.coefficient * mm).toFixed(2));
              return { ...r, mm, totalMass };
            });

            const productCards = eqResult.products.map(p => {
              const mm = safeMolarMass(p.formula);
              const totalMass = Number((p.coefficient * mm).toFixed(2));
              return { ...p, mm, totalMass };
            });

            const totalReactantMass = Number(reactantCards.reduce((acc, cur) => acc + cur.totalMass, 0).toFixed(2));
            const totalProductMass = Number(productCards.reduce((acc, cur) => acc + cur.totalMass, 0).toFixed(2));

            return (
              <div className={`p-5 border rounded-2xl shadow-sm space-y-6 animate-in fade-in duration-200 transition-colors ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                {/* Balanced Equation Banner */}
                <div className={`p-5 rounded-2xl border text-center ${
                  isDark
                    ? 'bg-gradient-to-r from-emerald-950/60 via-slate-900 to-sky-950/60 border-emerald-500/40 shadow-lg'
                    : 'bg-gradient-to-r from-emerald-50 via-slate-50 to-sky-50 border-emerald-300 shadow-sm'
                }`}>
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center justify-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Equação Química Balanceada:
                  </span>
                  <span className={`text-xl sm:text-2xl font-black font-mono tracking-wide block mt-2 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {eqResult.balanced}
                  </span>
                </div>

                {/* DEDICATED QUADRADINHO / CARDS: REAGENTES VS PRODUTOS */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-bold uppercase tracking-wider ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Classificação Detalhada: Reagentes vs Produtos
                    </h4>
                    <span className={`text-xs font-mono font-bold ${
                      isDark ? 'text-sky-400' : 'text-sky-700'
                    }`}>
                      Lei de Lavoisier (Massa Conservada)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Card: REAGENTES */}
                    <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
                      isDark ? 'bg-blue-950/20 border-blue-500/40' : 'bg-blue-50/70 border-blue-200'
                    }`}>
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wide bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/30">
                            🔵 Reagentes
                          </span>
                          <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Substâncias Consumidas
                          </span>
                        </div>

                        <div className="space-y-2">
                          {reactantCards.map((r, i) => (
                            <div key={i} className={`p-3 rounded-xl border flex items-center justify-between ${
                              isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-blue-200/60 shadow-xs'
                            }`}>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-black text-sm text-blue-600 dark:text-blue-400">
                                    {r.coefficient} mol{r.coefficient > 1 ? 's' : ''} de
                                  </span>
                                  <span className="font-mono font-bold text-base">
                                    {r.formula}
                                  </span>
                                </div>
                                <span className={`text-[11px] font-mono block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                  Massa molar unitária: <strong>{r.mm} g/mol</strong>
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="font-mono font-bold text-sm text-blue-600 dark:text-blue-300 block">
                                  {r.totalMass} g
                                </span>
                                <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                  ({r.coefficient} × {r.mm})
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className={`mt-4 pt-3 border-t flex justify-between items-center text-xs font-bold ${
                        isDark ? 'border-blue-900/40 text-blue-300' : 'border-blue-200 text-blue-900'
                      }`}>
                        <span>Massa Total dos Reagentes:</span>
                        <span className="font-mono text-base">{totalReactantMass} g</span>
                      </div>
                    </div>

                    {/* Right Card: PRODUTOS */}
                    <div className={`p-4 rounded-2xl border flex flex-col justify-between ${
                      isDark ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-emerald-50/70 border-emerald-200'
                    }`}>
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wide bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                            🟢 Produtos
                          </span>
                          <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Substâncias Formadas
                          </span>
                        </div>

                        <div className="space-y-2">
                          {productCards.map((p, i) => (
                            <div key={i} className={`p-3 rounded-xl border flex items-center justify-between ${
                              isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-emerald-200/60 shadow-xs'
                            }`}>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                                    {p.coefficient} mol{p.coefficient > 1 ? 's' : ''} de
                                  </span>
                                  <span className="font-mono font-bold text-base">
                                    {p.formula}
                                  </span>
                                </div>
                                <span className={`text-[11px] font-mono block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                  Massa molar unitária: <strong>{p.mm} g/mol</strong>
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-300 block">
                                  {p.totalMass} g
                                </span>
                                <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                  ({p.coefficient} × {p.mm})
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className={`mt-4 pt-3 border-t flex justify-between items-center text-xs font-bold ${
                        isDark ? 'border-emerald-900/40 text-emerald-300' : 'border-emerald-200 text-emerald-900'
                      }`}>
                        <span>Massa Total dos Produtos:</span>
                        <span className="font-mono text-base">{totalProductMass} g</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Atom conservation verification */}
                <div>
                  <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Verificação da Conservação dos Átomos (Reagentes vs Produtos):
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {eqResult.elementsList.map((el) => {
                      const rCount = eqResult.reactantTotals[el];
                      const pCount = eqResult.productTotals[el];
                      const isConserved = rCount === pCount;

                      return (
                        <div key={el} className={`p-3 border rounded-xl text-center ${
                          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}>
                          <span className="text-sm font-bold font-mono text-sky-600 dark:text-sky-300 block">{el}</span>
                          <div className="flex items-center justify-center gap-2 mt-1 text-xs font-mono">
                            <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{rCount}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400" />
                            <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{pCount}</span>
                          </div>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
                            {isConserved ? '✓ Conservado' : '✗ Desbalanceado'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                  isDark ? 'bg-slate-950/40 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <span className="font-bold block mb-1">⚖️ Lei de Antoine Lavoisier (1789):</span>
                  Em um sistema fechado, a massa total antes da reação química ({totalReactantMass} g) é rigorosamente igual à massa total após a reação ({totalProductMass} g). Na natureza, nada se cria, nada se perde, tudo se transforma!
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Tab 3: Solutions & Dilutions */}
      {activeTab === 'solutions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Molarity Preparation */}
          <div className={`p-5 border rounded-2xl shadow-sm space-y-4 transition-colors ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className={`border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Droplet className="w-4 h-4 text-sky-500" />
                Preparo de Solução: Concentração Molar (M)
              </h3>
              <span className="font-mono text-xs text-sky-600 dark:text-sky-400 mt-1 block">
                Fórmula: M = m / (MM × V)
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className={`block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Massa do Soluto (m em gramas):</label>
                <input
                  type="number"
                  value={solMass}
                  onChange={(e) => setSolMass(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg font-mono ${
                    isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Massa Molar do Soluto (MM em g/mol):</label>
                <input
                  type="number"
                  value={solMM}
                  onChange={(e) => setSolMM(e.target.value)}
                  placeholder="Ex: 58.44 para NaCl"
                  className={`w-full px-3 py-2 border rounded-lg font-mono ${
                    isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Volume Final da Solução (V em Litros):</label>
                <input
                  type="number"
                  value={solVol}
                  onChange={(e) => setSolVol(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg font-mono ${
                    isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className={`p-4 rounded-xl border text-center mt-4 ${
                isDark ? 'bg-sky-950/40 border-sky-500/30' : 'bg-sky-50 border-sky-200'
              }`}>
                <span className={`text-[11px] block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Concentração Molar Resultante:</span>
                <span className="text-3xl font-extrabold font-mono text-sky-600 dark:text-sky-400 block mt-1">
                  {calcMolarityVal()} mol/L (M)
                </span>
              </div>
            </div>
          </div>

          {/* Dilution Calculator */}
          <div className={`p-5 border rounded-2xl shadow-sm space-y-4 transition-colors ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className={`border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <h3 className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Scale className="w-4 h-4 text-emerald-500" />
                Diluição de Soluções
              </h3>
              <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 mt-1 block">
                Fórmula: C₁ × V₁ = C₂ × V₂
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Concentração Inicial (C₁):</label>
                  <input
                    type="number"
                    value={dilC1}
                    onChange={(e) => setDilC1(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg font-mono ${
                      isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Volume Inicial (V₁ em mL):</label>
                  <input
                    type="number"
                    value={dilV1}
                    onChange={(e) => setDilV1(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg font-mono ${
                      isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Concentração Desejada (C₂):</label>
                <input
                  type="number"
                  value={dilC2}
                  onChange={(e) => setDilC2(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg font-mono ${
                    isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className={`p-4 rounded-xl border text-center mt-4 ${
                isDark ? 'bg-emerald-950/40 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
              }`}>
                <span className={`text-[11px] block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Volume Final Necessário (V₂):</span>
                <span className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 block mt-1">
                  {calcDilutionV2()} mL
                </span>
                <span className={`text-[10px] mt-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Adicionar {parseFloat(calcDilutionV2()) > parseFloat(dilV1) ? (parseFloat(calcDilutionV2()) - parseFloat(dilV1)).toFixed(2) : 0} mL de solvente (água)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Ideal Gas Law PV = nRT */}
      {activeTab === 'gases' && (
        <div className={`p-5 border rounded-2xl shadow-sm max-w-2xl mx-auto space-y-4 transition-colors ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Wind className="w-5 h-5 text-sky-500" />
              Equação Geral dos Gases Ideais (Clapeyron)
            </h3>
            <span className="font-mono text-sm text-sky-600 dark:text-sky-400 mt-1 block">
              P × V = n × R × T (R = 0,08206 atm·L / mol·K)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className={`block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Pressão (P em atm):</label>
              <input
                type="number"
                value={gasP}
                onChange={(e) => setGasP(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg font-mono ${
                  isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Número de Mols (n):</label>
              <input
                type="number"
                value={gasN}
                onChange={(e) => setGasN(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg font-mono ${
                  isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Temperatura Absoluta (T em Kelvin):</label>
              <input
                type="number"
                value={gasT}
                onChange={(e) => setGasT(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg font-mono ${
                  isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
              <span className={`text-[10px] mt-0.5 block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {parseFloat(gasT) ? `${(parseFloat(gasT) - 273.15).toFixed(1)} °C` : ''}
              </span>
            </div>

            <div>
              <label className={`block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Constante dos Gases (R):</label>
              <div className={`w-full px-3 py-2 border rounded-lg font-mono ${
                isDark ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                0.08206 atm·L/(mol·K)
              </div>
            </div>
          </div>

          <div className={`p-5 rounded-xl border text-center mt-4 ${
            isDark ? 'bg-sky-950/40 border-sky-500/40' : 'bg-sky-50 border-sky-300'
          }`}>
            <span className={`text-xs block font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Volume Ocupado pelo Gás (V):
            </span>
            <span className="text-4xl font-black font-mono text-sky-600 dark:text-sky-400 block mt-1">
              {calcGasVolume()} Litros
            </span>
            <span className={`text-xs mt-1 block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Nas condições padrão (0 °C e 1 atm), 1 mol ocupa 22,4 L.
            </span>
          </div>
        </div>
      )}

      {/* Tab 5: pH & pOH Equilibrium */}
      {activeTab === 'ph' && (
        <div className={`p-5 border rounded-2xl shadow-sm max-w-2xl mx-auto space-y-5 transition-colors ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Zap className="w-5 h-5 text-amber-500" />
              Equilíbrio Iônico: Escala de pH e pOH
            </h3>
            <span className="font-mono text-xs text-amber-600 dark:text-amber-400 mt-1 block">
              pH = -log[H⁺] · pOH = -log[OH⁻] · pH + pOH = 14 (a 25 °C)
            </span>
          </div>

          <div>
            <div className={`flex justify-between text-xs mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <span>Selecione ou digite o valor de pH:</span>
              <span className={`font-mono font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {phVal.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="14"
              step="0.1"
              value={phVal}
              onChange={(e) => setPhInput(e.target.value)}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Universal pH color gradient bar */}
          <div className="relative w-full h-8 rounded-xl overflow-hidden shadow-inner flex items-center justify-between px-2 text-[10px] font-bold text-white drop-shadow">
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to right, #ef4444 0%, #f97316 25%, #eab308 45%, #22c55e 50%, #06b6d4 65%, #3b82f6 80%, #8b5cf6 100%)'
              }}
            />
            <span className="relative z-10">0 (Ácido Forte)</span>
            <span className="relative z-10">7 (Neutro)</span>
            <span className="relative z-10">14 (Base Forte)</span>
          </div>

          {/* Results grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>pH</span>
              <span className={`text-xl font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{phVal.toFixed(2)}</span>
            </div>
            <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>pOH</span>
              <span className="text-xl font-bold font-mono text-sky-600 dark:text-sky-400">{pohVal.toFixed(2)}</span>
            </div>
            <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>[H⁺] Concentração</span>
              <span className="text-xs font-mono text-rose-600 dark:text-rose-300 font-bold block mt-1">
                {hConc.toExponential(2)} M
              </span>
            </div>
            <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>[OH⁻] Concentração</span>
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-300 font-bold block mt-1">
                {ohConc.toExponential(2)} M
              </span>
            </div>
          </div>

          <div className={`p-3.5 rounded-xl border text-xs text-center ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            Classificação do meio:{' '}
            <strong className={phVal < 6.8 ? 'text-rose-500 dark:text-rose-400' : phVal > 7.2 ? 'text-indigo-600 dark:text-indigo-400' : 'text-emerald-600 dark:text-emerald-400'}>
              {phVal < 3 ? '🔴 Extremamente Ácido' : phVal < 6.8 ? '🟠 Moderadamente Ácido' : phVal > 11 ? '🟣 Fortemente Básico (Alcalino)' : phVal > 7.2 ? '🔵 Levemente Básico' : '🟢 Neutro (pH = 7,0)'}
            </strong>
          </div>
        </div>
      )}
    </div>
  );
};
