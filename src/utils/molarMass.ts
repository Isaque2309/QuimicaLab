import { ALL_118_ELEMENTS_SUMMARY } from '../data/elementsData';

export interface ElementComposition {
  symbol: string;
  name: string;
  atomicMass: number;
  count: number;
  totalMass: number;
  percentage: number;
}

export interface MolarMassResult {
  formula: string;
  formattedFormula: string;
  totalMolarMass: number;
  elements: ElementComposition[];
  totalAtoms: number;
}

// Map symbols to masses and names
const ELEMENT_MAP = new Map<string, { mass: number; name: string }>();
ALL_118_ELEMENTS_SUMMARY.forEach(el => {
  ELEMENT_MAP.set(el.sym, { mass: el.mass, name: el.name });
});

/**
 * Parses a chemical formula into element counts.
 * Handles nested parentheses e.g. Ca(OH)2, (NH4)2SO4, Fe2(SO4)3, and hydrates like CuSO4*5H2O or CuSO4·5H2O.
 */
export function calculateMolarMass(rawFormula: string): MolarMassResult {
  const formula = rawFormula.trim();
  if (!formula) {
    throw new Error('Por favor, digite uma fórmula química válida (ex: H2SO4, Ca(OH)2, C6H12O6).');
  }

  // Handle hydrate dot or asterisk
  const parts = formula.split(/[*·•]/);
  const mainPart = parts[0];
  const hydratePart = parts[1] || null;

  const elementCounts = parseFormulaPart(mainPart);

  if (hydratePart) {
    // e.g. 5H2O or H2O
    const match = hydratePart.match(/^(\d*)(.*)$/);
    const multiplier = match && match[1] ? parseInt(match[1], 10) : 1;
    const waterFormula = match && match[2] ? match[2] : hydratePart;

    const waterCounts = parseFormulaPart(waterFormula);
    for (const [sym, count] of Object.entries(waterCounts)) {
      elementCounts[sym] = (elementCounts[sym] || 0) + count * multiplier;
    }
  }

  // Calculate total mass
  let totalMass = 0;
  let totalAtoms = 0;
  const elementsBreakdown: ElementComposition[] = [];

  for (const [sym, count] of Object.entries(elementCounts)) {
    const info = ELEMENT_MAP.get(sym);
    if (!info) {
      throw new Error(`Elemento "${sym}" não reconhecido na tabela periódica.`);
    }

    const itemMass = info.mass * count;
    totalMass += itemMass;
    totalAtoms += count;

    elementsBreakdown.push({
      symbol: sym,
      name: info.name,
      atomicMass: info.mass,
      count,
      totalMass: itemMass,
      percentage: 0 // calculate below
    });
  }

  if (totalMass === 0) {
    throw new Error('Fórmula química vazia ou inválida.');
  }

  // Calculate percentages
  elementsBreakdown.forEach(el => {
    el.percentage = (el.totalMass / totalMass) * 100;
  });

  // Sort descending by percentage
  elementsBreakdown.sort((a, b) => b.percentage - a.percentage);

  return {
    formula,
    formattedFormula: formatChemicalFormula(formula),
    totalMolarMass: Number(totalMass.toFixed(4)),
    elements: elementsBreakdown,
    totalAtoms
  };
}

function parseFormulaPart(formula: string): Record<string, number> {
  const counts: Record<string, number> = {};
  const stack: Record<string, number>[] = [counts];

  let i = 0;
  const len = formula.length;

  while (i < len) {
    const char = formula[i];

    if (char === '(' || char === '[' || char === '{') {
      const newGroup: Record<string, number> = {};
      stack.push(newGroup);
      i++;
    } else if (char === ')' || char === ']' || char === '}') {
      if (stack.length <= 1) {
        throw new Error('Parênteses desbalanceados na fórmula.');
      }
      i++;
      // Check for multiplier after parenthesis
      let numStr = '';
      while (i < len && /\d/.test(formula[i])) {
        numStr += formula[i];
        i++;
      }
      const multiplier = numStr ? parseInt(numStr, 10) : 1;
      const finishedGroup = stack.pop()!;
      const current = stack[stack.length - 1];

      for (const [elem, count] of Object.entries(finishedGroup)) {
        current[elem] = (current[elem] || 0) + count * multiplier;
      }
    } else if (/[A-Z]/.test(char)) {
      // Element symbol starts with uppercase letter
      let sym = char;
      i++;
      if (i < len && /[a-z]/.test(formula[i])) {
        sym += formula[i];
        i++;
      }

      if (!ELEMENT_MAP.has(sym)) {
        throw new Error(`Símbolo químico "${sym}" não encontrado.`);
      }

      // Check for count
      let numStr = '';
      while (i < len && /\d/.test(formula[i])) {
        numStr += formula[i];
        i++;
      }
      const count = numStr ? parseInt(numStr, 10) : 1;
      const current = stack[stack.length - 1];
      current[sym] = (current[sym] || 0) + count;
    } else if (/\s/.test(char)) {
      i++; // ignore spaces
    } else {
      throw new Error(`Caractere inválido "${char}" na fórmula.`);
    }
  }

  if (stack.length !== 1) {
    throw new Error('Parênteses não fechados na fórmula.');
  }

  return counts;
}

/**
 * Formats a formula with subscript HTML/Unicode representation
 */
export function formatChemicalFormula(formula: string): string {
  return formula.replace(/(\d+)/g, (match) => {
    const subscriptDigits: Record<string, string> = {
      '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
      '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
    };
    return match.split('').map(d => subscriptDigits[d] || d).join('');
  });
}
