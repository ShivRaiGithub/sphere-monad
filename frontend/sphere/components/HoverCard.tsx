'use client';

import { Member } from '@/context/SphereContext';
import { getGrowthStage, computePoints, type PointWeights, type StageThresholds } from './Tile';

interface HoverCardProps {
  member: Member | null;
  position: { x: number; y: number } | null;
  weights: PointWeights;
  thresholds: StageThresholds;
}

function formatDate(timestamp: bigint): string {
  if (timestamp === BigInt(0)) return 'N/A';
  return new Date(Number(timestamp) * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function HoverCard({ member, position, weights, thresholds }: HoverCardProps) {
  if (!member || !position) return null;

  const stage = getGrowthStage(member, weights, thresholds);
  const pts = computePoints(member, weights);

  return (
    <div
      className="fixed -translate-x-1/2 -translate-y-[115%] bg-bg-card/85 backdrop-blur-md border border-border/60 rounded-2xl p-5 min-w-[260px] max-w-[300px] pointer-events-none z-[100] shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
      style={{
        left: position.x,
        top: position.y,
        animation: 'hoverAppear 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-2xl opacity-50 z-0" />
      
      <div className="relative z-10 font-body">
        <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
          <span className="font-pixel text-[0.8rem] text-accent-glow tracking-wide">{member.name}</span>
          <span className="text-[0.65rem] font-bold text-text-secondary bg-bg-panel px-2 py-0.5 rounded-md border border-border/50 font-mono">
            #{Number(member.serial)}
          </span>
        </div>
        
        {member.intro && (
          <p className="text-[0.85rem] text-text-secondary mb-4 leading-relaxed italic pr-2">&ldquo;{member.intro}&rdquo;</p>
        )}
        
        {/* Points & Stage */}
        <div className="flex items-center gap-3 mb-4 p-2 bg-accent/10 rounded-lg border border-accent/20">
          <span className="font-pixel text-[0.7rem] text-accent-glow">{pts} pts</span>
          <span className="text-[0.65rem] text-text-muted">→</span>
          <span className="font-pixel text-[0.7rem] text-text-primary uppercase">{stage}</span>
          <span className="text-[0.65rem] text-text-muted ml-auto">{Number(member.messageCount)} msgs</span>
        </div>
        
        <div className="flex flex-col gap-2 pt-1 text-sm bg-bg-panel/20 p-3 rounded-xl border border-border/30 shadow-inner">
          <div className="flex justify-between items-center">
            <span className="text-text-muted font-medium text-xs uppercase tracking-wider">Wallet</span>
            <span className="font-mono text-text-primary text-xs bg-bg-panel/70 px-1.5 py-0.5 rounded">{truncateAddress(member.wallet)}</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-text-muted font-medium text-xs uppercase tracking-wider">Joined</span>
            <span className="font-mono text-text-primary text-xs bg-bg-panel/70 px-1.5 py-0.5 rounded">{formatDate(member.joinedAt)}</span>
          </div>
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-border/30">
            <span className="text-text-muted font-medium text-xs uppercase tracking-wider">Status</span>
            <span className={`px-2 py-0.5 rounded-md font-bold tracking-wider uppercase text-[0.65rem] ${member.status === 0 ? 'bg-accent/15 text-accent-glow border border-accent/20' : 'bg-red-400/15 text-red-400 border border-red-400/20'}`}>
              {member.status === 0 ? 'Active' : 'Removed'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
