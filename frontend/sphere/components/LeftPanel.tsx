'use client';

import { useState } from 'react';
import type { StageThresholds } from './Tile';

interface LeftPanelProps {
  gridSize: number;
  onGridSizeChange: (size: number) => void;
  thresholds: StageThresholds;
  onThresholdsChange: (t: StageThresholds) => void;
  hidden?: boolean;
}

const STAGE_LABELS: { key: keyof StageThresholds; label: string }[] = [
  { key: 'sprout', label: 'Sprout' },
  { key: 'stree', label: 'Small Tree' },
  { key: 'mtree', label: 'Medium Tree' },
  { key: 'ltree', label: 'Large Tree' },
  { key: 'etree', label: 'Elder Tree' },
];

export default function LeftPanel({ gridSize, onGridSizeChange, thresholds, onThresholdsChange, hidden }: LeftPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  const updateThreshold = (key: keyof StageThresholds, value: number) => {
    onThresholdsChange({ ...thresholds, [key]: value });
  };

  return (
    !hidden && (
      <div className={`relative z-40 flex flex-col border-r border-emerald-100/30 bg-[linear-gradient(180deg,rgba(30,58,138,0.22),rgba(16,185,129,0.11))] shadow-[12px_0_36px_rgba(7,28,63,0.25)] backdrop-blur-xl transition-all duration-300 after:pointer-events-none after:absolute after:inset-0 after:shadow-[inset_0_1px_0_rgba(255,255,255,0.24)] ${collapsed ? 'w-14' : 'w-90'}`}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand' : 'Collapse'}
            className="absolute -right-4 top-1/2 z-20 h-14 w-9 -translate-y-1/2 rounded-r-lg border border-emerald-100/35 bg-cyan-100/20 text-[0.64rem] font-semibold uppercase tracking-widest text-cyan-50 shadow-md transition-all duration-300 hover:-translate-y-1/2 hover:brightness-110 hover:shadow-[0_10px_20px_rgba(56,189,248,0.2)]"
          >
            {collapsed ? 'Open' : 'Hide'}
          </button>

          {!collapsed && (
            <div className="p-7 overflow-y-auto flex-1 font-body">
              <h3 className="mb-7 border-b border-white/20 pb-3 text-[0.86rem] font-semibold uppercase tracking-[0.16em] text-cyan-50/95">Controls</h3>

              {/* Grid Size */}
              <div className="mb-7 rounded-2xl border border-white/20 bg-cyan-100/10 p-6 shadow-[0_14px_30px_rgba(15,23,42,0.14)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:brightness-110">
                <label className="mb-4 block text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-cyan-100/90">
                  Grid Size: <span className="ml-1 text-slate-50">{gridSize} x {gridSize}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={gridSize}
                  onChange={(e) => onGridSizeChange(Number(e.target.value))}
                  className="h-3 w-full cursor-pointer appearance-none rounded-lg bg-white/20 accent-emerald-300"
                />
                <div className="mt-3 flex justify-between font-mono text-[0.8rem] text-cyan-100/72">
                  <span>1×1</span>
                  <span>10×10</span>
                </div>
              </div>

              {/* Stage Thresholds */}
              <div className="mb-7 rounded-2xl border border-white/20 bg-cyan-100/10 p-6 shadow-[0_14px_30px_rgba(15,23,42,0.14)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:brightness-110">
                <h4 className="mb-4 text-[0.78rem] font-semibold uppercase tracking-[0.15em] text-emerald-200">Stage Thresholds</h4>
                <p className="mb-5 text-[0.82rem] text-cyan-100/78">Points needed to reach each stage.</p>
                <div className="flex flex-col gap-3">
                  {STAGE_LABELS.map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className="w-24 truncate text-[0.76rem] font-medium text-cyan-50/95">{label}</span>
                      <input
                        type="number"
                        min={0}
                        max={999}
                        value={thresholds[key]}
                        onChange={(e) => updateThreshold(key, Math.max(0, Number(e.target.value)))}
                        className="w-18 flex-1 rounded-lg border border-white/25 bg-white/10 px-2 py-2 text-center font-mono text-sm text-slate-50 outline-none transition duration-300 focus:border-emerald-300/80 focus:shadow-[0_0_0_2px_rgba(74,222,128,0.2)]"
                      />
                      <span className="text-[0.68rem] text-cyan-100/70">pts</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Music hint */}
              <div className="mb-7 rounded-2xl border border-white/20 bg-cyan-100/10 p-6 shadow-[0_14px_30px_rgba(15,23,42,0.14)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:brightness-110">
                <h4 className="mb-3 text-[0.78rem] font-semibold uppercase tracking-[0.15em] text-emerald-200">Ambient Audio</h4>
                <p className="text-[0.82rem] leading-relaxed text-cyan-100/78">Spring track plays by default. Use the right panel to mute or unmute.</p>
              </div>
            </div>
          )}
      </div>
    )
  );
}
