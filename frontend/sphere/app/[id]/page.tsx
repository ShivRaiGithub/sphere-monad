'use client';

import { useState, useCallback, use } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useMembers } from '@/hooks/useMembers';
import Grid from '@/components/Grid';
import LeftPanel from '@/components/LeftPanel';
import RightPanel from '@/components/RightPanel';
import Link from 'next/link';
import { useReadContract } from 'wagmi';
import { useSphereContract } from '@/hooks/useSphereContract';
import type { Member } from '@/context/SphereContext';
import { computePoints, getGrowthStage, DEFAULT_THRESHOLDS, DEFAULT_WEIGHTS } from '@/components/Tile';
import type { StageThresholds, PointWeights } from '@/components/Tile';

interface CommunityPageProps {
  params: Promise<{ id: string }>;
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

export default function CommunityPage({ params }: CommunityPageProps) {
  const { id } = use(params);
  const communityId = BigInt(id);
  const [gridSize, setGridSize] = useState(3);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [thresholds, setThresholds] = useState<StageThresholds>(DEFAULT_THRESHOLDS);
  const [weights, setWeights] = useState<PointWeights>(DEFAULT_WEIGHTS);
  const [shuffledOrder, setShuffledOrder] = useState<number[] | null>(null);

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

  const handleShuffle = useCallback(() => {
    const totalTiles = gridSize * gridSize;
    const indices = Array.from({ length: totalTiles }, (_, i) => i);
    // Fisher-Yates shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setShuffledOrder(indices);
  }, [gridSize]);

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary font-body">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-border/40 bg-bg-secondary/60 backdrop-blur-md z-40 shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/home" className="font-body text-sm font-medium text-text-secondary px-4 py-2 rounded-lg transition-all duration-300 hover:text-white hover:bg-bg-hover">
            ← Back
          </Link>
          <div className="flex items-center gap-4 border-l border-border/50 pl-6">
            <h1 className="font-pixel text-[0.8rem] text-white tracking-widest uppercase">{communityName}</h1>
            <span className="text-sm font-body text-text-secondary bg-bg-card/50 px-3 py-1 rounded-full border border-border/50">
              {totalMembers} member{totalMembers !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <ConnectButton showBalance={false} />
      </header>

      {/* 3-Panel Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        <LeftPanel
          gridSize={gridSize}
          onGridSizeChange={(s) => { setGridSize(s); setShuffledOrder(null); }}
          thresholds={thresholds}
          onThresholdsChange={setThresholds}
        />

        <div className="flex-1 flex items-center justify-center p-6 overflow-auto relative z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,222,128,0.03)_0%,transparent_60%)] pointer-events-none" />
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-5 py-16 text-text-secondary z-10">
              <div className="w-12 h-12 border-4 border-border/40 border-t-accent rounded-full animate-spin" />
              <p className="font-pixel text-[0.6rem] uppercase tracking-widest text-accent-glow animate-pulse">Loading members...</p>
            </div>
          ) : (
            <div className="z-10">
              <Grid
                members={members}
                gridSize={gridSize}
                onMemberClick={setSelectedMember}
                weights={weights}
                thresholds={thresholds}
                shuffledOrder={shuffledOrder}
              />
            </div>
          )}
        </div>

        <RightPanel
          communityId={communityId}
          weights={weights}
          onWeightsChange={setWeights}
          onShuffle={handleShuffle}
        />
      </div>

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedMember(null)} 
          />
          
          <div 
            className="relative w-full max-w-sm bg-bg-secondary/90 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl" 
            style={{ animation: 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <button 
              onClick={() => setSelectedMember(null)}
              className="absolute top-6 right-6 text-text-muted hover:text-white transition-colors text-xl font-body cursor-pointer"
            >
              ✕
            </button>
            
            <div className="flex items-center gap-5 mb-6">
               <div className="w-16 h-16 bg-bg-card/80 border border-border/60 rounded-2xl flex items-center justify-center shadow-inner">
                 <span className="text-3xl drop-shadow-md">🌳</span>
               </div>
               <div>
                 <h2 className="font-pixel text-[1.1rem] text-accent-glow mb-2 uppercase tracking-wide">{selectedMember.name}</h2>
                 <span className="inline-block font-body text-xs font-semibold tracking-wider text-accent bg-accent/10 px-2 py-1 rounded-md border border-accent/20">
                    MEMBER #{Number(selectedMember.serial)}
                 </span>
               </div>
            </div>

            {/* Points Bar */}
            <div className="flex items-center gap-3 mb-6 p-3 bg-accent/10 rounded-xl border border-accent/20">
              <span className="font-pixel text-[0.8rem] text-accent-glow">{computePoints(selectedMember, weights)} pts</span>
              <span className="text-text-muted">→</span>
              <span className="font-pixel text-[0.8rem] text-text-primary uppercase">{getGrowthStage(selectedMember, weights, thresholds)}</span>
              <span className="text-[0.7rem] text-text-muted ml-auto">{Number(selectedMember.messageCount)} msgs</span>
            </div>
            
            {selectedMember.intro ? (
              <div className="mb-6 p-4 bg-bg-card/40 rounded-xl border border-border/40">
                <p className="text-sm text-text-secondary leading-relaxed font-body italic">&ldquo;{selectedMember.intro}&rdquo;</p>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-bg-card/20 rounded-xl border border-border/20">
                <p className="text-sm text-text-muted leading-relaxed font-body italic text-center">No introduction provided.</p>
              </div>
            )}
            
            <div className="flex flex-col gap-1 font-body text-sm">
              <div className="flex justify-between items-center py-3 border-b border-border/30">
                <span className="text-text-muted font-medium">Wallet</span>
                <span className="font-mono text-text-primary bg-bg-panel/50 px-2 py-1 rounded-md">{truncateAddress(selectedMember.wallet)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border/30">
                <span className="text-text-muted font-medium">Joined</span>
                <span className="font-mono text-text-primary">{formatDate(selectedMember.joinedAt)}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-text-muted font-medium">Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase ${selectedMember.status === 0 ? 'bg-accent/15 text-accent-glow border border-accent/20' : 'bg-red-400/15 text-red-400 border border-red-400/20'}`}>
                  {selectedMember.status === 0 ? 'Active' : 'Removed'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
