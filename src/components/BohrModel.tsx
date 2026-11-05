import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Info } from 'lucide-react';

interface BohrModelProps {
  atomicNumber: number;
  symbol: string;
  name: string;
  shells: number[];
  atomicMass?: number;
  color?: string;
}

export const BohrModel: React.FC<BohrModelProps> = ({
  atomicNumber,
  symbol,
  name,
  shells,
  atomicMass,
  color = '#0284c7'
}) => {
  const { isDark } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const animFrameId = useRef<number | null>(null);
  const angleRef = useRef<number>(0);

  // Number of neutrons: A - Z (mass rounded minus atomic number; for H, mass is 1.008 -> 0)
  const approxMass = atomicMass ? Math.round(atomicMass) : Math.round(atomicNumber * 2.1);
  const numNeutrons = Math.max(0, approxMass - atomicNumber);
  const totalElectrons = shells.reduce((a, b) => a + b, 0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const numShells = shells.length;
    const maxRadius = Math.min(centerX, centerY) - 20;
    const minRadius = 38;
    const radiusStep = numShells > 1 ? (maxRadius - minRadius) / (numShells - 1) : 0;

    const shellRadii = shells.map((_, idx) => (numShells === 1 ? (minRadius + maxRadius) / 2 : minRadius + idx * radiusStep));

    // Generate fixed nucleus cluster particles (protons and neutrons)
    const nucleusParticles: { x: number; y: number; type: 'proton' | 'neutron' }[] = [];
    const clusterCount = Math.min(18, atomicNumber + numNeutrons);
    for (let i = 0; i < clusterCount; i++) {
      const type: 'proton' | 'neutron' = i % 2 === 0 ? 'proton' : 'neutron';
      const angle = (i * 2.39996); // golden ratio angle
      const dist = Math.sqrt(i / clusterCount) * 14;
      nucleusParticles.push({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        type
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Background subtle canvas circle
      ctx.fillStyle = isDark ? '#090d16' : '#f8fafc';
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius + 14, 0, Math.PI * 2);
      ctx.fill();

      // Draw orbital paths with energy level indicators (K, L, M, N, O, P, Q)
      shellRadii.forEach((r, idx) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? 'rgba(56, 189, 248, 0.22)' : 'rgba(2, 132, 199, 0.25)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Shell label e.g. K (n=1): 2e⁻
        const shellNames = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];
        ctx.fillStyle = isDark ? 'rgba(148, 163, 184, 0.75)' : 'rgba(71, 85, 105, 0.85)';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`${shellNames[idx] || idx + 1}: ${shells[idx]}e⁻`, centerX + r - 8, centerY - 6);
      });

      // Draw Nucleus Halo & Cluster
      const nucleusRadius = 22;
      const grad = ctx.createRadialGradient(centerX, centerY, 4, centerX, centerY, nucleusRadius + 10);
      grad.addColorStop(0, '#f59e0b');
      grad.addColorStop(0.5, '#ef4444');
      grad.addColorStop(1, 'rgba(239, 68, 68, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, nucleusRadius + 8, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Nucleus boundary container
      ctx.beginPath();
      ctx.arc(centerX, centerY, nucleusRadius, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? '#450a0a' : '#fee2e2';
      ctx.fill();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw individual Protons (🔴) and Neutrons (🟡) inside the nucleus
      nucleusParticles.forEach((p) => {
        const px = centerX + p.x;
        const py = centerY + p.y;
        const pr = 4;

        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        if (p.type === 'proton') {
          ctx.fillStyle = '#ef4444'; // Red Carmine Proton
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        } else {
          ctx.fillStyle = '#f59e0b'; // Amber Gold Neutron
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      });

      // Center Overlay badge with element symbol
      ctx.beginPath();
      ctx.arc(centerX, centerY, 11, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)';
      ctx.fill();
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
      ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(symbol, centerX, centerY);

      // Draw revolving Electrons (🔵 Electric Sky Blue) in each shell
      const baseAngle = angleRef.current;

      shells.forEach((electronCount, shellIdx) => {
        const radius = shellRadii[shellIdx];
        const speedMultiplier = 1 / (shellIdx + 1);
        const direction = shellIdx % 2 === 0 ? 1 : -1;
        const currentShellAngle = baseAngle * speedMultiplier * direction;

        for (let i = 0; i < electronCount; i++) {
          const electronAngle = currentShellAngle + (i * 2 * Math.PI) / electronCount;
          const ex = centerX + radius * Math.cos(electronAngle);
          const ey = centerY + radius * Math.sin(electronAngle);

          // Glow around electron
          const eGrad = ctx.createRadialGradient(ex, ey, 1, ex, ey, 7);
          eGrad.addColorStop(0, '#38bdf8');
          eGrad.addColorStop(0.7, '#0284c7');
          eGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');

          ctx.beginPath();
          ctx.arc(ex, ey, 7, 0, Math.PI * 2);
          ctx.fillStyle = eGrad;
          ctx.fill();

          // Electron core
          ctx.beginPath();
          ctx.arc(ex, ey, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#38bdf8';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      if (isPlaying) {
        angleRef.current += 0.016;
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [atomicNumber, symbol, shells, numNeutrons, isPlaying, color, isDark]);

  return (
    <div className={`flex flex-col items-center p-4 rounded-2xl border transition-colors duration-200 w-full ${
      isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200 shadow-sm'
    }`}>
      {/* Interactive Bohr Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          className="rounded-full max-w-full drop-shadow-[0_0_16px_rgba(56,189,248,0.2)]"
        />
        <button
          onClick={() => setIsPlaying(p => !p)}
          className={`absolute bottom-2 right-2 text-xs px-2.5 py-1 rounded-xl border font-bold transition cursor-pointer shadow-sm ${
            isDark
              ? 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700'
              : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
          }`}
          title={isPlaying ? "Pausar rotação dos elétrons" : "Retomar rotação"}
        >
          {isPlaying ? '⏸ Pausar' : '▶ Animar'}
        </button>
      </div>

      {/* Visual Subatomic Particles Legend with Distinct Colors */}
      <div className={`mt-3 w-full p-2.5 rounded-xl border text-xs ${
        isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <span className={`block text-[10px] uppercase font-bold tracking-wider mb-2 text-center ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Legenda das Partículas Subatômicas:
        </span>
        <div className="grid grid-cols-3 gap-2 text-center">
          {/* Protons */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
              <span className="font-bold text-rose-500 text-[11px]">Prótons (p⁺)</span>
            </div>
            <span className="text-xs font-mono font-bold mt-0.5">{atomicNumber}</span>
            <span className={`text-[9px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>no núcleo (+)</span>
          </div>

          {/* Neutrons */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
              <span className="font-bold text-amber-500 text-[11px]">Nêutrons (n⁰)</span>
            </div>
            <span className="text-xs font-mono font-bold mt-0.5">{numNeutrons}</span>
            <span className={`text-[9px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>no núcleo (0)</span>
          </div>

          {/* Electrons */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-sky-400 shadow-sm shadow-sky-400/50" />
              <span className="font-bold text-sky-400 text-[11px]">Elétrons (e⁻)</span>
            </div>
            <span className="text-xs font-mono font-bold mt-0.5">{totalElectrons}</span>
            <span className={`text-[9px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>nas camadas (-)</span>
          </div>
        </div>
      </div>

      {/* Summarized Explanation of What Electron Shells Are */}
      <div className={`mt-3 w-full p-3 rounded-xl border text-xs leading-relaxed ${
        isDark ? 'bg-sky-950/20 border-sky-500/30 text-slate-300' : 'bg-sky-50/80 border-sky-200 text-slate-700'
      }`}>
        <div className="flex items-center gap-1.5 font-bold mb-1 text-sky-600 dark:text-sky-300">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>O que são as Camadas Eletrônicas?</span>
        </div>
        <p className="text-[11px]">
          São os <strong>7 níveis principais de energia (K, L, M, N, O, P, Q)</strong> onde os elétrons orbitam ao redor do núcleo. Quanto mais externa a camada, maior seu nível energético. A camada mais externa é a <strong>camada de valência</strong>, que determina a reatividade e as ligações químicas do átomo.
        </p>
      </div>
    </div>
  );
};
