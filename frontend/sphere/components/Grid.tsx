'use client';

import { useState, useCallback, useMemo } from 'react';
import Tile from './Tile';
import HoverCard from './HoverCard';
import { Member } from '@/context/SphereContext';
import type { PointWeights, StageThresholds } from './Tile';

const TILE_WIDTH = 110;
const TILE_HEIGHT = 55;

interface GridProps {
  members: Member[];
  gridSize: number;
  onMemberClick?: (member: Member) => void;
  weights: PointWeights;
  thresholds: StageThresholds;
  shuffledOrder: number[] | null;
}

export default function Grid({ members, gridSize, onMemberClick, weights, thresholds, shuffledOrder }: GridProps) {
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

  const gridDimensions = useMemo(() => {
    const totalWidth = gridSize * TILE_WIDTH;
    const totalHeight = gridSize * TILE_HEIGHT;
    const offsetX = (gridSize - 1) * (TILE_WIDTH / 2);
    const offsetY = 0;
    return { totalWidth, totalHeight, offsetX, offsetY };
  }, [gridSize]);

  const orderedMembers = useMemo(() => {
    if (!shuffledOrder) return members;
    // Map shuffled indices to members (null if out of bounds)
    return shuffledOrder.map(i => i < members.length ? members[i] : null);
  }, [members, shuffledOrder]);

  const tiles = useMemo(() => {
    const result = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const i = row * gridSize + col;
        const member = i < orderedMembers.length ? orderedMembers[i] : null;
        const screenX = (col - row) * (TILE_WIDTH / 2) + gridDimensions.offsetX;
        const screenY = (col + row) * (TILE_HEIGHT / 2) + gridDimensions.offsetY;
        const zIndex = row + col;
        result.push({ row, col, member, screenX, screenY, zIndex, index: i });
      }
    }
    return result;
  }, [gridSize, orderedMembers, gridDimensions]);

  return (
    <div className="relative" style={{
      width: gridDimensions.totalWidth,
      height: gridDimensions.totalHeight + TILE_HEIGHT,
    }}>
      {tiles.map((tile) => (
        <div
          key={tile.index}
          className="absolute"
          style={{
            left: tile.screenX,
            top: tile.screenY,
            width: TILE_WIDTH,
            height: TILE_HEIGHT,
            zIndex: tile.zIndex,
          }}
        >
          <Tile
            member={tile.member}
            index={tile.index}
            onHover={handleHover}
            onClick={onMemberClick}
            weights={weights}
            thresholds={thresholds}
          />
        </div>
      ))}
      <HoverCard member={hoveredMember} position={hoverPosition} weights={weights} thresholds={thresholds} />
    </div>
  );
}
