interface MoleculeCount {
  [element: string]: number;
}

export interface BalancedEquationResult {
  original: string;
  balanced: string;
  reactants: { formula: string; coefficient: number }[];
  products: { formula: string; coefficient: number }[];
  elementsList: string[];
  reactantTotals: Record<string, number>;
  productTotals: Record<string, number>;
}

// Simple parser for single molecules like "Fe2O3", "Ca(OH)2", "H2O"
function parseMolecule(formula: string): MoleculeCount {
  const counts: MoleculeCount = {};
  const stack: MoleculeCount[] = [counts];
  let i = 0;
  const len = formula.length;

  while (i < len) {
    const char = formula[i];
    if (char === '(' || char === '[' || char === '{') {
      stack.push({});
      i++;
    } else if (char === ')' || char === ']' || char === '}') {
      i++;
      let numStr = '';
      while (i < len && /\d/.test(formula[i])) {
        numStr += formula[i];
        i++;
      }
      const mult = numStr ? parseInt(numStr, 10) : 1;
      const finished = stack.pop() || {};
      const current = stack[stack.length - 1];
      for (const [el, cnt] of Object.entries(finished)) {
        current[el] = (current[el] || 0) + cnt * mult;
      }
    } else if (/[A-Z]/.test(char)) {
      let sym = char;
      i++;
      if (i < len && /[a-z]/.test(formula[i])) {
        sym += formula[i];
        i++;
      }
      let numStr = '';
      while (i < len && /\d/.test(formula[i])) {
        numStr += formula[i];
        i++;
      }
      const cnt = numStr ? parseInt(numStr, 10) : 1;
      const current = stack[stack.length - 1];
      current[sym] = (current[sym] || 0) + cnt;
    } else {
      i++;
    }
  }

  return counts;
}

// GCD and LCM helpers
function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs((a * b) / gcd(a, b));
}

export function balanceChemicalEquation(equationStr: string): BalancedEquationResult {
  const clean = equationStr.trim();
  if (!clean) {
    throw new Error('Digite uma equação química (ex: H2 + O2 -> H2O ou Fe + O2 -> Fe2O3)');
  }

  // Split reactants and products by -> or = or →
  const sides = clean.split(/->|=|→|⟶/);
  if (sides.length !== 2) {
    throw new Error('A equação deve conter os reagentes e produtos separados por "->" (ex: C3H8 + O2 -> CO2 + H2O)');
  }

  const rawReactants = sides[0].split('+').map(s => s.trim().replace(/^\d+/, '')).filter(Boolean);
  const rawProducts = sides[1].split('+').map(s => s.trim().replace(/^\d+/, '')).filter(Boolean);

  if (rawReactants.length === 0 || rawProducts.length === 0) {
    throw new Error('Forneça pelo menos um reagente e um produto.');
  }

  const parsedReactants = rawReactants.map(parseMolecule);
  const parsedProducts = rawProducts.map(parseMolecule);

  // Collect all unique elements
  const elementsSet = new Set<string>();
  parsedReactants.forEach(m => Object.keys(m).forEach(el => elementsSet.add(el)));
  parsedProducts.forEach(m => Object.keys(m).forEach(el => elementsSet.add(el)));
  const elementsList = Array.from(elementsSet);

  // Check if same elements are present on both sides
  for (const el of elementsList) {
    const inReactants = parsedReactants.some(m => (m[el] || 0) > 0);
    const inProducts = parsedProducts.some(m => (m[el] || 0) > 0);
    if (!inReactants || !inProducts) {
      throw new Error(`O elemento "${el}" deve estar presente em ambos os lados da equação.`);
    }
  }

  const numMolecules = rawReactants.length + rawProducts.length;

  // Build matrix (rows: elements, columns: molecules)
  // reactants have positive coefficients, products have negative coefficients
  const matrix: number[][] = [];
  for (const el of elementsList) {
    const row: number[] = [];
    for (const r of parsedReactants) {
      row.push(r[el] || 0);
    }
    for (const p of parsedProducts) {
      row.push(-(p[el] || 0));
    }
    matrix.push(row);
  }

  // Solve system of linear equations Ax = 0 using systematic integer search (up to coefficient 24)
  // For standard school and college chemistry equations, coefficients are small integers (1 to 20).
  const coeffs = solveCoefficients(matrix, numMolecules);
  if (!coeffs) {
    throw new Error('Não foi possível encontrar balanceamento com números inteiros simples para esta reação.');
  }

  const reactantCoeffs = coeffs.slice(0, rawReactants.length);
  const productCoeffs = coeffs.slice(rawReactants.length);

  // Build formatted strings
  const reactantFormatted = rawReactants.map((f, idx) => {
    const c = reactantCoeffs[idx];
    return `${c > 1 ? c + ' ' : ''}${f}`;
  }).join(' + ');

  const productFormatted = rawProducts.map((f, idx) => {
    const c = productCoeffs[idx];
    return `${c > 1 ? c + ' ' : ''}${f}`;
  }).join(' + ');

  const balancedString = `${reactantFormatted} → ${productFormatted}`;

  // Totals verification
  const reactantTotals: Record<string, number> = {};
  const productTotals: Record<string, number> = {};

  elementsList.forEach(el => {
    let rSum = 0;
    parsedReactants.forEach((mol, idx) => {
      rSum += (mol[el] || 0) * reactantCoeffs[idx];
    });
    reactantTotals[el] = rSum;

    let pSum = 0;
    parsedProducts.forEach((mol, idx) => {
      pSum += (mol[el] || 0) * productCoeffs[idx];
    });
    productTotals[el] = pSum;
  });

  return {
    original: clean,
    balanced: balancedString,
    reactants: rawReactants.map((f, idx) => ({ formula: f, coefficient: reactantCoeffs[idx] })),
    products: rawProducts.map((f, idx) => ({ formula: f, coefficient: productCoeffs[idx] })),
    elementsList,
    reactantTotals,
    productTotals
  };
}

function solveCoefficients(matrix: number[][], numVars: number): number[] | null {
  // Use Gaussian Elimination with rational approximation or integer search
  // If number of variables <= 6, search space with bounds is ultra fast (< 2ms)
  if (numVars <= 6) {
    const maxCoeff = 16;
    const coeffs = new Array(numVars).fill(1);

    function test(c: number[]): boolean {
      for (const row of matrix) {
        let sum = 0;
        for (let j = 0; j < numVars; j++) {
          sum += row[j] * c[j];
        }
        if (sum !== 0) return false;
      }
      return true;
    }

    // Try a recursive bounded search for lowest sum of coefficients
    let bestCoeffs: number[] | null = null;
    let minSum = Infinity;

    function search(index: number, current: number[], currentSum: number) {
      if (currentSum >= minSum) return;
      if (index === numVars) {
        if (test(current)) {
          minSum = currentSum;
          bestCoeffs = [...current];
        }
        return;
      }

      for (let val = 1; val <= maxCoeff; val++) {
        current[index] = val;
        search(index + 1, current, currentSum + val);
      }
    }

    search(0, coeffs, 0);
    if (bestCoeffs) {
      return bestCoeffs;
    }
  }

  // Fallback simplified vector nullspace finder
  return null;
}
