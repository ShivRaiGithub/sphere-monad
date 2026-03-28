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
    <div className={`relative bg-bg-panel border-r border-border transition-all duration-300 flex flex-col ${collapsed ? 'w-10' : 'w-[260px]'}`}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? 'Expand' : 'Collapse'}
        className="absolute top-1/2 -translate-y-1/2 -right-3 bg-bg-card border border-border text-text-secondary w-6 h-12 flex items-center justify-center cursor-pointer text-xs transition-all duration-200 rounded-r-md z-10 hover:bg-accent-dim hover:text-accent hover:border-accent"
      >
        {collapsed ? '▶' : '◀'}
      </button>

      {!collapsed && (
        <div className="p-5 overflow-y-auto flex-1">
          <h3 className="font-pixel text-[0.6rem] text-accent mb-5 uppercase tracking-widest">Controls</h3>

          {/* Grid Size */}
          <div className="mb-6">
            <label className="block font-pixel text-[0.5rem] text-text-secondary mb-2">
              Grid Size: {gridSize}×{gridSize}
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={gridSize}
              onChange={(e) => onGridSizeChange(Number(e.target.value))}
              className="w-full accent-accent cursor-pointer"
            />
            <div className="flex justify-between text-[0.65rem] text-text-muted mt-1">
              <span>1×1</span>
              <span>10×10</span>
            </div>
          </div>

          {/* Music */}
          <div className="mb-6">
            <label className="block font-pixel text-[0.5rem] text-text-secondary mb-2">Music</label>
            <label className="block text-center py-2.5 bg-bg-card border border-dashed border-border rounded-lg text-sm text-text-secondary cursor-pointer transition-all duration-200 hover:border-accent hover:text-accent">
              🎵 Upload Music
              <input type="file" accept="audio/*" onChange={handleMusicUpload} className="hidden" />
            </label>
            {musicFile && (
              <>
                <p className="text-xs text-text-muted mt-2 overflow-hidden text-ellipsis whitespace-nowrap">{musicName}</p>
                <button
                  onClick={toggleMusic}
                  className="w-full mt-2 py-2 bg-accent-dim text-accent-glow border-none rounded-lg text-sm cursor-pointer transition-all duration-200 hover:bg-accent hover:text-black"
                >
                  {isPlaying ? '⏸ Pause' : '▶ Play'}
                </button>
                <audio ref={audioRef} src={musicFile} loop />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
