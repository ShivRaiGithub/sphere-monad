'use client';

import { useState, useRef } from 'react';
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicFile, setMusicFile] = useState<string | null>(null);
  const [musicName, setMusicName] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMusicFile(url);
      setMusicName(file.name);
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current || !musicFile) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const updateThreshold = (key: keyof StageThresholds, value: number) => {
    onThresholdsChange({ ...thresholds, [key]: value });
  };

  // Audio element lives OUTSIDE the collapsed/hidden conditional so it never unmounts
  return (
    <>
      {musicFile && <audio ref={audioRef} src={musicFile} loop />}

      {!hidden && (
        <div className={`relative z-10 flex flex-col border-r border-emerald-100/30 bg-[linear-gradient(180deg,rgba(30,58,138,0.2),rgba(16,185,129,0.08))] shadow-[12px_0_36px_rgba(7,28,63,0.25)] backdrop-blur-xl transition-all duration-300 after:pointer-events-none after:absolute after:inset-0 after:shadow-[inset_0_1px_0_rgba(255,255,255,0.24)] ${collapsed ? 'w-12' : 'w-70'}`}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand' : 'Collapse'}
            className="absolute -right-4 top-1/2 z-20 h-12 w-8 -translate-y-1/2 rounded-r-lg border border-emerald-100/35 bg-cyan-100/20 text-[0.55rem] font-semibold uppercase tracking-widest text-cyan-50 shadow-md transition-all duration-300 hover:-translate-y-1/2 hover:brightness-110 hover:shadow-[0_10px_20px_rgba(56,189,248,0.2)]"
          >
            {collapsed ? 'Open' : 'Hide'}
          </button>

          {!collapsed && (
            <div className="p-6 overflow-y-auto flex-1 font-body">
              <h3 className="mb-6 border-b border-white/20 pb-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-cyan-50/95">Controls</h3>

              {/* Grid Size */}
              <div className="mb-6 rounded-2xl border border-white/20 bg-cyan-100/10 p-5 shadow-[0_14px_30px_rgba(15,23,42,0.14)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:brightness-110">
                <label className="mb-4 block text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-cyan-100/90">
                  Grid Size: <span className="ml-1 text-slate-50">{gridSize} x {gridSize}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={gridSize}
                  onChange={(e) => onGridSizeChange(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/20 accent-emerald-300"
                />
                <div className="mt-3 flex justify-between font-mono text-[0.65rem] text-cyan-100/70">
                  <span>1×1</span>
                  <span>10×10</span>
                </div>
              </div>

              {/* Stage Thresholds */}
              <div className="mb-6 rounded-2xl border border-white/20 bg-cyan-100/10 p-5 shadow-[0_14px_30px_rgba(15,23,42,0.14)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:brightness-110">
                <h4 className="mb-4 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-emerald-200">Stage Thresholds</h4>
                <p className="mb-4 text-[0.64rem] text-cyan-100/75">Points needed to reach each stage.</p>
                <div className="flex flex-col gap-3">
                  {STAGE_LABELS.map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="w-20 truncate text-[0.62rem] font-medium text-cyan-50/90">{label}</span>
                      <input
                        type="number"
                        min={0}
                        max={999}
                        value={thresholds[key]}
                        onChange={(e) => updateThreshold(key, Math.max(0, Number(e.target.value)))}
                        className="w-16 flex-1 rounded-lg border border-white/25 bg-white/10 px-2 py-1.5 text-center font-mono text-xs text-slate-50 outline-none transition duration-300 focus:border-emerald-300/80 focus:shadow-[0_0_0_2px_rgba(74,222,128,0.2)]"
                      />
                      <span className="text-[0.55rem] text-cyan-100/65">pts</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Music */}
              <div className="mb-6 rounded-2xl border border-white/20 bg-cyan-100/10 p-5 shadow-[0_14px_30px_rgba(15,23,42,0.14)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:brightness-110">
                <label className="mb-4 block text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-cyan-100/90">Ambient Audio</label>
                <label className="block cursor-pointer rounded-xl border border-dashed border-white/30 bg-white/8 py-3 text-center text-sm text-cyan-50/90 shadow-inner backdrop-blur-sm transition duration-300 hover:border-emerald-300/70 hover:bg-white/14 hover:text-white">
                  Upload Track
                  <input type="file" accept="audio/*" onChange={handleMusicUpload} className="hidden" />
                </label>
                {musicFile && (
                  <div className="mt-4">
                    <p className="mb-3 overflow-hidden text-ellipsis whitespace-nowrap rounded-md border border-white/25 bg-white/10 px-2 py-1.5 font-mono text-[0.65rem] text-cyan-100/80">{musicName}</p>
                    <button
                      onClick={toggleMusic}
                      className="w-full rounded-xl border border-emerald-200/60 bg-linear-to-r from-emerald-300/75 to-cyan-300/70 py-2.5 text-sm font-semibold tracking-wide text-emerald-950 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_22px_rgba(74,222,128,0.35)]"
                    >
                      {isPlaying ? 'Pause' : 'Play'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
