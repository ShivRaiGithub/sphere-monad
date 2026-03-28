'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useCommunities } from '@/hooks/useCommunities';
import { useSphere } from '@/context/SphereContext';
import CommunityCard from '@/components/CommunityCard';
import Link from 'next/link';

export default function HomePage() {
  const { address } = useAccount();
  const { communities, isLoading, refetch } = useCommunities();
  const { createCommunity, isPending, isConfirming, isSuccess, writeError, resetWrite } = useSphere();

  const [showCreate, setShowCreate] = useState(false);
  const [communityName, setCommunityName] = useState('');
  const [creatorAddress, setCreatorAddress] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!communityName.trim()) return;
    const creator = (creatorAddress.trim() || address) as `0x${string}`;
    createCommunity(communityName.trim(), creator);
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-bg-secondary sticky top-0 z-50 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🌳</span>
          <span className="font-pixel text-sm text-accent">Sphere</span>
        </Link>
        <ConnectButton showBalance={false} />
      </header>

      {/* Main */}
      <main className="max-w-[1100px] mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-pixel text-base text-text-primary">Communities</h1>
          <button
            onClick={() => { setShowCreate(!showCreate); resetWrite(); }}
            className="font-pixel text-[0.55rem] px-5 py-3 bg-accent text-black border-none rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent-glow hover:-translate-y-px"
          >
            {showCreate ? '✕ Cancel' : '+ Create Community'}
          </button>
        </div>

        {/* Create Form */}
        {showCreate && (
          <div className="bg-bg-card border border-border rounded-xl p-6 mb-6" style={{ animation: 'slideDown 0.3s ease' }}>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-pixel text-[0.45rem] text-text-secondary uppercase tracking-widest">Community Name</label>
                <input
                  type="text"
                  value={communityName}
                  onChange={(e) => setCommunityName(e.target.value)}
                  placeholder="e.g. Forest Dwellers"
                  className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-lg text-text-primary text-sm outline-none transition-colors focus:border-accent"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-pixel text-[0.45rem] text-text-secondary uppercase tracking-widest">Creator Address (optional)</label>
                <input
                  type="text"
                  value={creatorAddress}
                  onChange={(e) => setCreatorAddress(e.target.value)}
                  placeholder={address || '0x...'}
                  className="w-full px-3 py-2.5 bg-bg-secondary border border-border rounded-lg text-text-primary text-sm outline-none transition-colors focus:border-accent"
                />
              </div>
              <button
                type="submit"
                disabled={isPending || isConfirming}
                className="px-4 py-3 bg-accent text-black border-none rounded-lg font-pixel text-[0.5rem] cursor-pointer transition-all duration-200 hover:bg-accent-glow hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? 'Confirming...' : isConfirming ? 'Creating...' : '🌱 Create'}
              </button>
              {isSuccess && (
                <p className="text-sm text-accent-glow text-center">
                  Community created!{' '}
                  <button onClick={() => { refetch(); resetWrite(); setShowCreate(false); }} className="text-accent underline bg-transparent border-none cursor-pointer text-sm">
                    Refresh
                  </button>
                </p>
              )}
              {writeError && (
                <p className="text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">{writeError.message.slice(0, 120)}</p>
              )}
              <p className="text-xs text-text-muted italic">Note: Only the contract owner can create communities.</p>
            </form>
          </div>
        )}

        {/* Community Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-text-secondary">
            <div className="w-8 h-8 border-3 border-border border-t-accent rounded-full" style={{ animation: 'spin 0.8s linear infinite' }} />
            <p>Loading communities...</p>
          </div>
        ) : communities.length === 0 ? (
          <div className="text-center py-16 text-text-muted">
            <span className="text-5xl block mb-4">🌿</span>
            <h3 className="font-pixel text-[0.7rem] text-text-secondary mb-2">No communities yet</h3>
            <p>Be the first to create a community and start growing!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {communities.map((c) => (
              <CommunityCard key={c.id.toString()} community={c} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
