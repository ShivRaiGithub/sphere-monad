'use client';

import Link from 'next/link';
import type { Community } from '@/context/SphereContext';

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
      className="block bg-bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:border-accent hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(16,185,129,0.12)]"
    >
      <div className="p-6 text-center">
        <div className="text-4xl mb-3">🌳</div>
        <h3 className="font-pixel text-[0.7rem] text-text-primary mb-3">{community.name}</h3>
        <div className="mb-3">
          <span className="text-xs text-text-secondary">
            Created by {truncateAddress(community.creator)}
          </span>
        </div>
        <div className="inline-block font-pixel text-[0.45rem] bg-accent-dim text-accent-glow px-3 py-1.5 rounded-full">
          ID #{community.id.toString()}
        </div>
      </div>
    </Link>
  );
}
