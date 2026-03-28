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
    <div className="min-h-screen relative flex flex-col bg-bg-primary font-body overflow-x-hidden">
      {/* Background ambient layer */}
      <div className="absolute inset-0 pointer-events-none z-0 fixed">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(29,65,113,0.4)_0%,transparent_60%)]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_bottom_left,rgba(74,222,128,0.05)_0%,transparent_70%)]" />
      </div>

      {/* Header */}
      <header className="flex justify-between items-center px-6 lg:px-10 py-5 border-b border-border/40 bg-bg-secondary/60 sticky top-0 z-40 backdrop-blur-xl shadow-sm">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-accent-dim/30 border border-border-accent flex items-center justify-center shadow-[0_0_15px_rgba(74,222,128,0.15)] group-hover:bg-accent-dim transition-all duration-300">
             <span className="relative w-4 h-4 bg-accent-glow rounded-full shadow-[0_0_12px_#22c55e]" />
          </div>
          <span className="font-pixel text-[1.2rem] text-text-primary tracking-widest group-hover:text-white transition-colors">Sphere</span>
        </Link>
        <ConnectButton showBalance={false} />
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto p-6 lg:p-12 relative z-10 flex flex-col">
        
        {/* Title & Actions Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="font-pixel text-3xl md:text-4xl text-white mb-4 uppercase tracking-widest drop-shadow-md">Discover Communities</h1>
            <p className="text-base md:text-lg text-text-secondary max-w-xl leading-relaxed">Explore vibrant living spaces waiting to be populated. Each community is a unique environment.</p>
          </div>
          <button
            onClick={() => { setShowCreate(true); resetWrite(); }}
            className="font-pixel text-[0.7rem] uppercase tracking-widest px-8 py-4 bg-accent text-[#064e3b] border-2 border-accent-glow hover:bg-accent-glow cursor-pointer transition-all duration-300 rounded-xl hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(74,222,128,0.3)] shadow-lg active:translate-y-0"
          >
            + Lay Foundation
          </button>
        </div>

        {/* Create Modal */}
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-[#0f172a]/70 backdrop-blur-md" onClick={() => setShowCreate(false)} />
            
            <div 
              className="relative w-full max-w-lg bg-bg-secondary border border-border/80 rounded-3xl p-8 shadow-2xl overflow-hidden" 
              style={{ animation: 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
              {/* Modal decorative background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,rgba(74,222,128,0.15)_0%,transparent_70%)] pointer-events-none" />

              <button 
                onClick={() => setShowCreate(false)}
                className="absolute top-6 right-6 text-text-muted hover:text-white transition-colors font-body text-xl"
              >
                ✕
              </button>

              <h3 className="font-pixel text-xl text-accent-glow mb-2 uppercase tracking-widest">Establish New Land</h3>
              <p className="text-text-secondary text-sm mb-8">Define the parameters of a new living environment.</p>
              
              <form onSubmit={handleCreate} className="flex flex-col gap-6 relative z-10">
                <div className="flex flex-col gap-2">
                  <label className="font-pixel text-[0.6rem] text-text-muted uppercase tracking-[0.15em]">Community Name</label>
                  <input
                    type="text"
                    value={communityName}
                    onChange={(e) => setCommunityName(e.target.value)}
                    placeholder="e.g. Coral Reefs"
                    className="w-full px-5 py-4 bg-bg-primary/80 border border-border rounded-xl text-text-primary text-base outline-none transition-all focus:border-accent shadow-inner focus:shadow-[0_0_15px_rgba(74,222,128,0.1)]"
                    required
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="font-pixel text-[0.6rem] text-text-muted uppercase tracking-[0.15em]">
                    Creator Address <span className="text-text-secondary/50 lowercase font-body tracking-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={creatorAddress}
                    onChange={(e) => setCreatorAddress(e.target.value)}
                    placeholder={address ? `${address.slice(0, 10)}...` : '0x...'}
                    className="w-full px-5 py-4 bg-bg-primary/50 border border-border/50 rounded-xl text-text-secondary font-mono text-sm outline-none transition-all focus:border-accent shadow-inner placeholder:text-text-muted/50"
                  />
                </div>
                
                <div className="pt-4 flex flex-col gap-4">
                  <button
                    type="submit"
                    disabled={isPending || isConfirming}
                    className="w-full px-6 py-4 bg-gradient-to-r from-accent to-accent-glow text-[#064e3b] border-none rounded-xl font-pixel text-[0.7rem] uppercase tracking-widest cursor-pointer transition-all duration-300 hover:shadow-[0_10px_30px_rgba(74,222,128,0.4)] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isPending ? 'Confirming Transaction...' : isConfirming ? 'Laying Foundation...' : 'Create Foundation'}
                  </button>
                  
                  {isSuccess && (
                    <div className="p-4 bg-accent-dim/30 border border-border-accent rounded-xl flex items-center justify-between animate-pulse">
                      <p className="text-sm font-pixel text-accent-glow tracking-widest uppercase">
                        New land established!
                      </p>
                      <button onClick={() => { refetch(); resetWrite(); setShowCreate(false); }} className="text-white hover:text-accent-glow transition-colors border-none bg-transparent cursor-pointer font-pixel text-[0.6rem] uppercase">
                        View Now
                      </button>
                    </div>
                  )}
                  
                  {writeError && (
                    <p className="text-sm font-mono text-red-200 bg-red-900/40 px-4 py-3 rounded-xl border border-red-500/30 leading-relaxed overflow-x-auto">
                      {writeError.message.slice(0, 120)}...
                    </p>
                  )}
                </div>
                
                <p className="text-xs font-mono text-text-muted mt-2 text-center opacity-70">
                  Note: Limited to protocol owner.
                </p>
              </form>
            </div>
          </div>
        )}

        {/* Community Grid */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 py-32 text-text-secondary">
            <div className="relative w-16 h-16">
               <div className="absolute inset-0 border-4 border-border/40 rounded-full" />
               <div className="absolute inset-0 border-4 border-transparent border-t-accent rounded-full animate-spin" />
            </div>
            <p className="font-pixel text-[0.7rem] tracking-widest uppercase text-accent animate-pulse">Surveying Landscapes...</p>
          </div>
        ) : communities.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-24 px-6 text-text-muted">
             <div className="max-w-xl text-center bg-bg-card/40 backdrop-blur-sm border border-border/40 rounded-3xl p-12 shadow-xl">
              <div className="w-32 h-32 mx-auto mb-8 opacity-40 filter grayscale drop-shadow-lg" style={{ animation: 'float 6s infinite ease-in-out' }}>
                 <img src="/nature/grassTiles.png" alt="Empty land" className="w-full h-full object-contain pixel-img" />
              </div>
              <h3 className="font-pixel text-2xl text-white mb-4 tracking-widest uppercase">Untouched Wilderness</h3>
              <p className="text-text-secondary text-lg mb-8 max-w-md mx-auto leading-relaxed">No communities exist yet. Be the first to lay the foundation and create a new living environment.</p>
              <button
                onClick={() => setShowCreate(true)}
                className="font-pixel text-[0.65rem] uppercase tracking-widest px-8 py-3 bg-bg-panel text-white border border-border hover:border-accent hover:text-accent rounded-lg cursor-pointer transition-all duration-300 shadow-md hover:shadow-accent/10"
              >
                Start Surveying
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10 pb-20">
            {communities.map((c) => (
              <CommunityCard key={c.id.toString()} community={c} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
