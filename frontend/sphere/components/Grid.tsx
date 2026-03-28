'use client';

import { useState, useCallback } from 'react';
import Tile from './Tile';
import HoverCard from './HoverCard';
import { Member } from '@/context/SphereContext';

interface GridProps {
  members: Member[];
  gridSize: number;
}

export default function Grid({ members, gridSize }: GridProps) {
  const [hoveredMember, setHoveredMember] = useState<Member | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);

  const handleHover = useCallback((member: Member | null, rect: DOMRect | null) => {
    setHoveredMember(member);
    if (rect) {
      setHoverPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      });
    } else {
      setHoverPosition(null);
    }
  }, []);

  const totalTiles = gridSize * gridSize;
  const tileSize = Math.max(60, Math.min(100, 400 / gridSize));

  const tiles = Array.from({ length: totalTiles }, (_, i) => {
    const member = i < members.length ? members[i] : null;
    return (
      <Tile key={i} index={i} member={member} onHover={handleHover} />
    );
  });

  return (
    <div className="relative">
      <div
        className="isometric-grid grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, ${tileSize}px)`,
          gridTemplateRows: `repeat(${gridSize}, ${tileSize}px)`,
        }}
      >
        {tiles}
      </div>
      <HoverCard member={hoveredMember} position={hoverPosition} />
    </div>
  );
}
