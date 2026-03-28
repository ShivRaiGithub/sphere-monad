'use client';
import Link from 'next/link';
import type { Community } from '@/context/SphereContext';
import AmbientLayer from './AmbientLayer';

interface CommunityCardProps {
  community: Community;
}

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function CommunityCard({ community }: CommunityCardProps) {
  return (
    <Link
      href={`/${community.id.toString()}`}
      className="group block bg-gradient-to-br from-bg-card to-bg-panel border border-border/50 rounded-2xl overflow-hidden transition-all duration-300 hover:border-accent-glow/40 hover:scale-[1.04] hover:shadow-[0_15px_40px_rgba(74,222,128,0.15)] relative"
    >
      <div className="absolute inset-0 bg-accent-dim/0 group-hover:bg-accent-dim/10 transition-colors duration-300 z-0 pointer-events-none" />
      
      <div className="relative w-full h-[140px] flex items-center justify-center overflow-hidden border-b border-border/30 group-hover:border-accent-glow/20 transition-colors duration-300 z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent z-0 opacity-50" />
        <AmbientLayer seed={Number(community.id)} />
      </div>

      <div className="p-6 relative z-10 flex flex-col gap-3">
        <h3 className="font-pixel text-[0.95rem] tracking-widest text-text-primary group-hover:text-accent-glow transition-colors">{community.name}</h3>
        
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
          <span className="text-sm text-text-secondary font-body">
            By <span className="font-mono text-text-muted">{truncateAddress(community.creator)}</span>
          </span>
          <div className="font-pixel text-[0.55rem] bg-bg-primary text-accent px-3 py-1.5 rounded-lg border border-border/50 group-hover:border-accent/30 transition-colors shadow-inner">
            ID #{community.id.toString()}
          </div>
        </div>
      </div>
    </Link>
  );
}
