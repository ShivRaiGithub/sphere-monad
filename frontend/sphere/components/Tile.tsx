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
}

export default function Tile({ member, index, onHover }: TileProps) {
  const stage: GrowthStage = member ? getGrowthStage(member.joinedAt) : 'grass';
  const imageSrc = STAGE_IMAGES[stage];

  return (
    <div
      className="relative aspect-square cursor-pointer group"
      onMouseEnter={(e) => {
        if (member) {
          const rect = e.currentTarget.getBoundingClientRect();
          onHover(member, rect);
        }
      }}
      onMouseLeave={() => onHover(null, null)}
    >
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#0d1a0d] border border-[#1a3a1a] rounded relative transition-all duration-250 overflow-hidden group-hover:border-accent group-hover:shadow-[0_0_16px_rgba(16,185,129,0.2)] group-hover:scale-105 group-hover:z-10">
        <img
          src={imageSrc}
          alt={member ? `${member.name} (${stage})` : 'Empty tile'}
          className="w-[70%] h-[70%] object-contain pixel-img transition-transform duration-300 group-hover:scale-115"
          draggable={false}
        />
        {member && (
          <div className="absolute bottom-0.5 font-pixel text-[0.3rem] text-accent-glow opacity-0 group-hover:opacity-100 transition-opacity duration-250" style={{ textShadow: '0 1px 2px #000' }}>
            {member.name}
          </div>
        )}
      </div>
    </div>
  );
}
