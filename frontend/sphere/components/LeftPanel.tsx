'use client';

import { useState, useRef } from 'react';

interface LeftPanelProps {
  gridSize: number;
  onGridSizeChange: (size: number) => void;
}

export default function LeftPanel({ gridSize, onGridSizeChange }: LeftPanelProps) {
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

  return (
    <div className={`relative bg-bg-panel/60 backdrop-blur-md border-r border-border/50 transition-all duration-300 flex flex-col z-10 shadow-[10px_0_30px_rgba(0,0,0,0.1)] ${collapsed ? 'w-10' : 'w-[280px]'}`}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? 'Expand' : 'Collapse'}
        className="absolute top-1/2 -translate-y-1/2 -right-3 bg-bg-card border border-border text-text-secondary w-6 h-12 flex items-center justify-center cursor-pointer text-xs transition-all duration-200 rounded-r-md z-10 hover:bg-bg-hover hover:text-white hover:border-accent shadow-md"
      >
        {collapsed ? '▶' : '◀'}
      </button>

      {!collapsed && (
        <div className="p-6 overflow-y-auto flex-1 font-body">
          <h3 className="font-pixel text-[0.8rem] text-accent-glow mb-6 border-b border-border/40 pb-3 uppercase tracking-widest">Controls</h3>

          {/* Grid Size */}
          <div className="mb-8 p-4 bg-bg-card/40 rounded-xl border border-border/30">
            <label className="block text-[0.65rem] text-text-secondary uppercase tracking-[0.15em] font-bold mb-4">
              Grid Size: <span className="text-text-primary tracking-normal ml-1">{gridSize} × {gridSize}</span>
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={gridSize}
              onChange={(e) => onGridSizeChange(Number(e.target.value))}
              className="w-full h-1.5 bg-bg-panel rounded-lg appearance-none cursor-pointer accent-accent"
            />
            <div className="flex justify-between font-mono text-[0.65rem] text-text-muted mt-3">
              <span>1×1</span>
              <span>10×10</span>
            </div>
          </div>

          {/* Music */}
          <div className="mb-8 p-4 bg-bg-card/40 rounded-xl border border-border/30">
            <label className="block text-[0.65rem] text-text-secondary uppercase tracking-[0.15em] font-bold mb-4">Ambient Audio</label>
            <label className="block text-center py-3 bg-bg-card/50 backdrop-blur-sm border border-dashed border-border/60 rounded-xl text-sm font-body text-text-secondary cursor-pointer transition-all duration-300 hover:border-accent/60 hover:text-accent-glow hover:bg-bg-card shadow-inner">
              <span className="mr-2">🎵</span> Upload Track
              <input type="file" accept="audio/*" onChange={handleMusicUpload} className="hidden" />
            </label>
            {musicFile && (
              <div className="mt-4 animate-slideDown">
                <p className="text-[0.65rem] font-mono text-text-muted mb-3 overflow-hidden text-ellipsis whitespace-nowrap bg-bg-panel/50 px-2 py-1.5 rounded-md border border-border/40">{musicName}</p>
                <button
                  onClick={toggleMusic}
                  className="w-full py-2.5 bg-accent/10 border border-accent/20 text-accent-glow rounded-xl font-body text-sm font-semibold tracking-wide cursor-pointer transition-all duration-300 hover:bg-accent/20 hover:text-white hover:border-accent/40 shadow-sm flex items-center justify-center gap-2"
                >
                  {isPlaying ? '⏸ Pause' : '▶ Play'}
                </button>
                <audio ref={audioRef} src={musicFile} loop />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
