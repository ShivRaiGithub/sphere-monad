'use client';
import { useMemo } from 'react';

export default function AmbientLayer({ seed = 0 }: { seed?: number }) {
  const s = useMemo(() => {
    let current = seed + 1234.5;
    return () => {
      current = Math.sin(current) * 10000;
      return current - Math.floor(current);
    };
  }, [seed]);

  const hasPond = s() > 0.4;
  const numRocks = Math.floor(s() * 2) + 1; // 1 to 2 rocks

  return (
    <div className="relative w-full h-[140px] flex items-center justify-center pointer-events-none">
      <div 
        className="relative w-[120px] h-[80px] translate-y-4" 
        style={{ animation: 'tree-bob 6s infinite ease-in-out', animationDelay: `${s() * 2}s` }}
      >
        <img 
          src="/nature/grassTiles.png" 
          alt="Grass Base" 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120px] pixel-img drop-shadow-[0_10px_15px_rgba(0,0,0,0.2)]" 
          style={{ zIndex: 1 }}
        />

        {hasPond && (
          <img 
            src="/nature/pond.png" 
            alt="Pond" 
            className="absolute bottom-[15px] left-[15px] w-[45px] pixel-img drop-shadow-sm opacity-90" 
            style={{ zIndex: 2 }}
          />
        )}

        {Array.from({ length: numRocks }).map((_, i) => (
          <img 
            key={i}
            src="/nature/rocks.png" 
            alt="Rocks" 
            className="absolute pixel-img drop-shadow-sm opacity-80" 
            style={{ 
              width: `${15 + s() * 20}px`,
              bottom: `${10 + s() * 20}px`,
              left: `${20 + s() * 60}px`,
              zIndex: 3,
              transform: s() > 0.5 ? 'scaleX(-1)' : 'none'
            }}
          />
        ))}
      </div>
    </div>
  );
}
