'use client';

import { useState, use } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useMembers } from '@/hooks/useMembers';
import Grid from '@/components/Grid';
import LeftPanel from '@/components/LeftPanel';
import RightPanel from '@/components/RightPanel';
import Link from 'next/link';
import { useReadContract } from 'wagmi';
import { useSphereContract } from '@/hooks/useSphereContract';

interface CommunityPageProps {
  params: Promise<{ id: string }>;
}

export default function CommunityPage({ params }: CommunityPageProps) {
  const { id } = use(params);
  const communityId = BigInt(id);
  const [gridSize, setGridSize] = useState(3);

  const contract = useSphereContract();
  const { members, totalMembers, isLoading } = useMembers(communityId, gridSize);

  const { data: communityData } = useReadContract({
    ...contract,
    functionName: 'communities',
    args: [communityId],
  });

  const communityName =
    communityData && Array.isArray(communityData)
      ? (communityData[1] as string)
      : `Community #${id}`;

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-border bg-bg-secondary backdrop-blur-sm z-50">
        <div className="flex items-center gap-4">
          <Link href="/home" className="font-pixel text-[0.55rem] text-text-secondary px-3 py-2 rounded-lg transition-all duration-200 hover:text-accent hover:bg-bg-hover">
            ← Back
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-pixel text-[0.7rem] text-text-primary">{communityName}</h1>
            <span className="text-sm text-text-secondary">
              🌿 {totalMembers} member{totalMembers !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <ConnectButton showBalance={false} />
      </header>

      {/* 3-Panel Layout */}
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel gridSize={gridSize} onGridSizeChange={setGridSize} />

        <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-text-secondary">
              <div className="w-8 h-8 border-3 border-border border-t-accent rounded-full" style={{ animation: 'spin 0.8s linear infinite' }} />
              <p>Loading members...</p>
            </div>
          ) : (
            <Grid members={members} gridSize={gridSize} />
          )}
        </div>

        <RightPanel communityId={communityId} />
      </div>
    </div>
  );
}
