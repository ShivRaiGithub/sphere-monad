'use client';

import { Member } from '@/context/SphereContext';

interface HoverCardProps {
  member: Member | null;
  position: { x: number; y: number } | null;
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

export default function HoverCard({ member, position }: HoverCardProps) {
  if (!member || !position) return null;

  return (
    <div
      className="fixed -translate-x-1/2 -translate-y-full bg-bg-card border border-border rounded-xl p-4 min-w-[220px] max-w-[280px] pointer-events-none z-[100] shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
      style={{
        left: position.x,
        top: position.y,
        animation: 'hoverAppear 0.2s ease',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-pixel text-[0.55rem] text-accent-glow">{member.name}</span>
        <span className="font-pixel text-[0.45rem] text-text-muted">#{Number(member.serial)}</span>
      </div>
      {member.intro && (
        <p className="text-sm text-text-secondary mb-3 leading-snug">{member.intro}</p>
      )}
      <div className="flex flex-col gap-1 border-t border-border pt-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-text-muted">Wallet</span>
          <span className="font-mono text-xs text-text-secondary">{truncateAddress(member.wallet)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-text-muted">Joined</span>
          <span className="font-mono text-xs text-text-secondary">{formatDate(member.joinedAt)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-text-muted">Status</span>
          <span className={`font-pixel text-[0.4rem] px-2 py-0.5 rounded-full ${member.status === 0 ? 'bg-accent/15 text-accent-glow' : 'bg-red-400/15 text-red-400'}`}>
            {member.status === 0 ? 'Active' : 'Removed'}
          </span>
        </div>
      </div>
    </div>
  );
}
