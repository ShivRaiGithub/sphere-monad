'use client';

import { Member } from '@/context/SphereContext';

export type GrowthStage = 'grass' | 'sprout' | 'stree' | 'mtree' | 'ltree' | 'etree';

const STAGE_IMAGES: Record<GrowthStage, string> = {
  grass: '/forest/grass.png',
  sprout: '/forest/sprout.png',
  stree: '/forest/stree.png',
  mtree: '/forest/mtree.png',
  ltree: '/forest/ltree.png',
  etree: '/forest/etree.png',
};

export function getGrowthStage(joinedAt: bigint): GrowthStage {
  const now = BigInt(Math.floor(Date.now() / 1000));
  const elapsed = now - joinedAt;
  const oneDay = BigInt(86400);

  if (elapsed < oneDay) return 'sprout';
  if (elapsed < oneDay * BigInt(3)) return 'stree';
  if (elapsed < oneDay * BigInt(7)) return 'mtree';
  if (elapsed < oneDay * BigInt(14)) return 'ltree';
  return 'etree';
}

interface TileProps {
  member: Member | null;
  index: number;
  onHover: (member: Member | null, rect: DOMRect | null) => void;
  onClick?: (member: Member) => void;
}

export default function Tile({ member, index, onHover, onClick }: TileProps) {
  const stage: GrowthStage = member ? getGrowthStage(member.joinedAt) : 'grass';
  const imageSrc = STAGE_IMAGES[stage];

  return (
    <div
      className="w-full h-full cursor-pointer group relative"
      onMouseEnter={(e) => {
        if (member) {
          const rect = e.currentTarget.getBoundingClientRect();
          onHover(member, rect);
        }
      }}
      onMouseLeave={() => onHover(null, null)}
      onClick={() => {
        if (member && onClick) onClick(member);
      }}
    >
      {/* The tile image — rendered at full size, no background/border/rotation */}
      <img
        src={imageSrc}
        alt={member ? `${member.name} (${stage})` : 'Empty tile'}
        className="w-full h-full object-contain pixel-img transition-all duration-200 group-hover:brightness-125 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]"
        draggable={false}
      />
      {/* Member name label */}
      {member && (
        <div
          className="absolute bottom-1 left-1/2 -translate-x-1/2 font-pixel text-[0.35rem] text-accent-glow opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none"
          style={{ textShadow: '0 1px 3px #000, 0 0 6px #000' }}
        >
          {member.name}
        </div>
      )}
    </div>
  );
}
