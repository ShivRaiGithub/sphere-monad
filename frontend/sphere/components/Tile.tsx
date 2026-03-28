'use client';

import { Member } from '@/context/SphereContext';

export type GrowthStage = 'grass' | 'sprout' | 'stree' | 'mtree' | 'ltree' | 'etree';

export const STAGE_IMAGES: Record<GrowthStage, string> = {
  grass: '/forest/grass.png',
  sprout: '/forest/sprout.png',
  stree: '/forest/stree.png',
  mtree: '/forest/mtree.png',
  ltree: '/forest/ltree.png',
  etree: '/forest/etree.png',
};

export interface StageThresholds {
  sprout: number;
  stree: number;
  mtree: number;
  ltree: number;
  etree: number;
}

export interface PointWeights {
  agePerHour: number;      // points per hour of membership
  perMessage: number;      // points per messageCount
}

export const DEFAULT_THRESHOLDS: StageThresholds = {
  sprout: 0,
  stree: 10,
  mtree: 40,
  ltree: 70,
  etree: 100,
};

export const DEFAULT_WEIGHTS: PointWeights = {
  agePerHour: 1,
  perMessage: 5,
};

export function computePoints(member: Member, weights: PointWeights): number {
  const now = Math.floor(Date.now() / 1000);
  const ageHours = (now - Number(member.joinedAt)) / 3600;
  const agePoints = ageHours * weights.agePerHour;
  const msgPoints = Number(member.messageCount) * weights.perMessage;
  return Math.floor(agePoints + msgPoints);
}

export function getGrowthStage(member: Member, weights: PointWeights, thresholds: StageThresholds): GrowthStage {
  const pts = computePoints(member, weights);
  if (pts >= thresholds.etree) return 'etree';
  if (pts >= thresholds.ltree) return 'ltree';
  if (pts >= thresholds.mtree) return 'mtree';
  if (pts >= thresholds.stree) return 'stree';
  if (pts >= thresholds.sprout) return 'sprout';
  return 'grass';
}

function getStageScaleClass(stage: GrowthStage): string {
  switch (stage) {
    case 'stree':
      return 'scale-[1.22]';
    case 'mtree':
      return 'scale-[1.3]';
    case 'ltree':
      return 'scale-[1.4]';
    case 'etree':
      return 'scale-[1.48]';
    default:
      return 'scale-100';
  }
}

interface TileProps {
  member: Member | null;
  index: number;
  onHover: (member: Member | null, rect: DOMRect | null) => void;
  onClick?: (member: Member) => void;
  weights: PointWeights;
  thresholds: StageThresholds;
}

export default function Tile({ member, index, onHover, onClick, weights, thresholds }: TileProps) {
  const stage: GrowthStage = member ? getGrowthStage(member, weights, thresholds) : 'grass';
  const imageSrc = STAGE_IMAGES[stage];
  const stageScaleClass = getStageScaleClass(stage);

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
      <img
        src={imageSrc}
        alt={member ? `${member.name} (${stage})` : 'Empty tile'}
        className={`h-full w-full object-contain pixel-img transition-all duration-200 ${stageScaleClass} group-hover:brightness-125 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]`}
        draggable={false}
      />
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
