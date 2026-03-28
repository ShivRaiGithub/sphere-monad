'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useSphere } from '@/context/SphereContext';
import { useSphereContract } from '@/hooks/useSphereContract';
import type { PointWeights } from './Tile';

interface RightPanelProps {
  communityId: bigint;
  weights: PointWeights;
  onWeightsChange: (w: PointWeights) => void;
  onShuffle: () => void;
  onFullscreen: () => void;
  hidden?: boolean;
}

export default function RightPanel({ communityId, weights, onWeightsChange, onShuffle, onFullscreen, hidden }: RightPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [name, setName] = useState('');
  const [intro, setIntro] = useState('');
  const [message, setMessage] = useState('');

  const { address } = useAccount();
  const contract = useSphereContract();
  const { register, sendMessage, isPending, isConfirming, isSuccess, writeError, resetWrite } = useSphere();

  const { data: memberData, refetch: refetchMember } = useReadContract({
    ...contract,
    functionName: 'members',
    args: address ? [communityId, address] : undefined,
    query: { enabled: !!address },
  });

  const isMember = memberData && Array.isArray(memberData) && memberData[3] !== BigInt(0);

  useEffect(() => {
    if (isSuccess) {
      refetchMember();
      setName('');
      setIntro('');
      setMessage('');
      const timer = setTimeout(() => resetWrite(), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, refetchMember, resetWrite]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return; // guard: wallet required
    if (!name.trim()) return;
    register(communityId, name.trim(), intro.trim());
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return; // guard: wallet required
    if (!message.trim()) return;
    sendMessage(communityId, message.trim());
  };

  const isCooldownError = writeError?.message?.includes('12 hours');

  if (hidden) return null;

  return (
    <div className={`relative bg-bg-panel/60 backdrop-blur-md border-l border-border/50 transition-all duration-300 flex flex-col z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.1)] ${collapsed ? 'w-10' : 'w-[320px]'}`}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? 'Expand' : 'Collapse'}
        className="absolute top-1/2 -translate-y-1/2 -left-3 bg-bg-card border border-border text-text-secondary w-6 h-12 flex items-center justify-center cursor-pointer text-xs transition-all duration-200 rounded-l-md z-10 hover:bg-bg-hover hover:text-white hover:border-accent shadow-md"
      >
        {collapsed ? '◀' : '▶'}
      </button>

      {!collapsed && (
        <div className="p-6 overflow-y-auto flex-1 font-body">

          {/* Fullscreen */}
          <div className="mb-6">
            <button
              onClick={onFullscreen}
              className="w-full py-3 bg-bg-card/60 border border-border/50 hover:border-accent/40 text-text-primary rounded-xl font-pixel text-[0.6rem] tracking-widest uppercase cursor-pointer transition-all duration-300 hover:bg-bg-hover hover:text-accent-glow hover:shadow-lg flex items-center justify-center gap-2"
            >
              🖥️ Fullscreen Grid
            </button>
          </div>

          {/* Point Weights */}
          <div className="mb-6 p-4 bg-bg-card/40 rounded-xl border border-border/30">
            <h4 className="font-pixel text-[0.65rem] text-accent mb-4 uppercase tracking-widest">Point Weights</h4>
            <p className="text-[0.6rem] text-text-muted mb-4">Defines how points are calculated:</p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm">⏰</span>
                <div className="flex-1">
                  <label className="block text-[0.6rem] text-text-secondary mb-1">Per Hour Age</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={weights.agePerHour}
                    onChange={(e) => onWeightsChange({ ...weights, agePerHour: Math.max(0, Number(e.target.value)) })}
                    className="w-full px-3 py-2 bg-bg-primary/60 border border-border/50 rounded-lg text-text-primary text-xs outline-none transition-colors focus:border-accent font-mono"
                  />
                </div>
                <span className="text-[0.55rem] text-text-muted mt-5">pts/hr</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm">💬</span>
                <div className="flex-1">
                  <label className="block text-[0.6rem] text-text-secondary mb-1">Per Message</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={weights.perMessage}
                    onChange={(e) => onWeightsChange({ ...weights, perMessage: Math.max(0, Number(e.target.value)) })}
                    className="w-full px-3 py-2 bg-bg-primary/60 border border-border/50 rounded-lg text-text-primary text-xs outline-none transition-colors focus:border-accent font-mono"
                  />
                </div>
                <span className="text-[0.55rem] text-text-muted mt-5">pts/msg</span>
              </div>
            </div>
          </div>

          {/* Shuffle */}
          <div className="mb-6">
            <button
              onClick={onShuffle}
              className="w-full py-3 bg-bg-card/60 border border-border/50 hover:border-accent/40 text-text-primary rounded-xl font-pixel text-[0.6rem] tracking-widest uppercase cursor-pointer transition-all duration-300 hover:bg-bg-hover hover:text-accent-glow hover:shadow-lg flex items-center justify-center gap-2"
            >
              🔀 Shuffle Tiles
            </button>
          </div>

          <hr className="border-border/30 mb-6" />

          {/* Interaction Forms — only shown if wallet connected */}
          {!address ? (
            <div className="text-center py-8 px-4 text-text-muted flex flex-col items-center justify-center bg-bg-card/20 rounded-xl border border-border/20">
              <span className="text-2xl block mb-4 opacity-50">🔌</span>
              <p className="leading-relaxed text-sm mb-1">Connect your wallet to join or send messages.</p>
              <p className="text-[0.6rem] text-text-muted">Reading is available without a wallet.</p>
            </div>
          ) : !isMember ? (
            <div>
              <h3 className="font-pixel text-[0.8rem] text-accent-glow mb-6 uppercase tracking-widest border-b border-border/40 pb-3">Join Community</h3>
              <form onSubmit={handleJoin} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[0.65rem] font-bold text-text-secondary uppercase tracking-[0.15em]">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Satoshi"
                    className="w-full px-4 py-3 bg-bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl text-text-primary text-sm outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_15px_rgba(74,222,128,0.1)] shadow-inner"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[0.65rem] font-bold text-text-secondary uppercase tracking-[0.15em]">Introduction</label>
                  <textarea
                    value={intro}
                    onChange={(e) => setIntro(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-3 bg-bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl text-text-primary text-sm outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_15px_rgba(74,222,128,0.1)] shadow-inner resize-y min-h-[80px]"
                    rows={3}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isPending || isConfirming}
                  className="w-full px-5 py-3.5 bg-gradient-to-r from-accent to-accent-glow text-[#064e3b] border-none rounded-xl font-pixel text-[0.65rem] tracking-widest uppercase cursor-pointer transition-all duration-300 hover:shadow-[0_8px_20px_rgba(74,222,128,0.3)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isPending ? 'Confirming...' : isConfirming ? 'Waiting...' : '🌱 Form Roots'}
                </button>
                {isSuccess && <p className="text-sm text-accent-glow text-center bg-accent/10 py-3 rounded-xl border border-accent/20 animate-pulse">Welcome! 🎉</p>}
                {writeError && !isCooldownError && (
                  <p className="text-xs font-mono text-red-200 bg-red-900/40 px-4 py-3 rounded-xl border border-red-500/30 leading-relaxed overflow-x-auto">{writeError.message.slice(0, 100)}</p>
                )}
              </form>
            </div>
          ) : (
            <div>
              <h3 className="font-pixel text-[0.8rem] text-accent-glow mb-6 uppercase tracking-widest border-b border-border/40 pb-3">Send Message</h3>
              <form onSubmit={handleSendMessage} className="flex flex-col gap-5">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Broadcast to the community..."
                  className="w-full px-4 py-3 bg-bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl text-text-primary text-sm outline-none transition-all duration-300 focus:border-accent focus:shadow-[0_0_15px_rgba(74,222,128,0.1)] shadow-inner resize-y min-h-[100px]"
                  rows={4}
                  required
                />
                <button
                  type="submit"
                  disabled={isPending || isConfirming}
                  className="w-full px-5 py-3.5 bg-bg-card border border-border/80 hover:border-accent/50 text-text-primary rounded-xl font-pixel text-[0.65rem] tracking-widest uppercase cursor-pointer transition-all duration-300 hover:bg-bg-hover disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                >
                  {isPending ? 'Confirming...' : isConfirming ? 'Sending...' : '💬 Send Broadcast'}
                </button>
                {isSuccess && <p className="text-sm text-accent-glow text-center bg-accent/10 py-3 rounded-xl border border-accent/20 animate-pulse">Sent! 📨</p>}
                {isCooldownError && (
                  <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl text-amber-200 text-sm shadow-inner">
                    <span className="text-xl">⏳</span>
                    <p className="leading-relaxed font-mono text-xs mt-1">Wait 12 hours between broadcasts.</p>
                  </div>
                )}
                {writeError && !isCooldownError && (
                  <p className="text-xs font-mono text-red-200 bg-red-900/40 px-4 py-3 rounded-xl border border-red-500/30 leading-relaxed overflow-x-auto">{writeError.message.slice(0, 100)}</p>
                )}
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
