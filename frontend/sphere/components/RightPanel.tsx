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
  isMusicMuted: boolean;
  onToggleMusicMute: () => void;
  timeOfDay: 'day' | 'night' | 'rain';
  onTimeOfDayChange: (t: 'day' | 'night' | 'rain') => void;
  hidden?: boolean;
}

export default function RightPanel({
  communityId,
  weights,
  onWeightsChange,
  onShuffle,
  onFullscreen,
  isMusicMuted,
  onToggleMusicMute,
  timeOfDay,
  onTimeOfDayChange,
  hidden,
}: RightPanelProps) {
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
    <div className={`relative z-40 flex flex-col border-l border-emerald-100/30 bg-[linear-gradient(180deg,rgba(30,58,138,0.22),rgba(16,185,129,0.11))] shadow-[-12px_0_36px_rgba(7,28,63,0.25)] backdrop-blur-xl transition-all duration-300 after:pointer-events-none after:absolute after:inset-0 after:shadow-[inset_0_1px_0_rgba(255,255,255,0.24)] ${collapsed ? 'w-14' : 'w-90'}`}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? 'Expand' : 'Collapse'}
        className="absolute -left-4 top-1/2 z-20 h-14 w-9 -translate-y-1/2 rounded-l-lg border border-emerald-100/35 bg-cyan-100/20 text-[0.64rem] font-semibold uppercase tracking-widest text-cyan-50 shadow-md transition-all duration-300 hover:-translate-y-1/2 hover:brightness-110 hover:shadow-[0_10px_20px_rgba(56,189,248,0.2)]"
      >
        {collapsed ? 'Open' : 'Hide'}
      </button>

      {!collapsed && (
        <div className="p-7 overflow-y-auto flex-1 font-body">

          {/* Environment */}
          <div className="mb-7 rounded-2xl border border-white/20 bg-cyan-100/10 p-6 shadow-[0_14px_30px_rgba(15,23,42,0.14)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:brightness-110">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[0.78rem] font-semibold uppercase tracking-[0.15em] text-emerald-200">Environment</h4>
              <button
                onClick={onToggleMusicMute}
                className="text-[0.65rem] font-semibold uppercase tracking-wider text-cyan-100/80 hover:text-white transition-colors border border-cyan-100/30 rounded px-2 py-1"
                title={isMusicMuted ? "Unmute Music" : "Mute Music"}
              >
                {isMusicMuted ? '🔇' : '🔊'}
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onTimeOfDayChange('day')}
                className={`w-full rounded-xl border py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition duration-300 ${timeOfDay === 'day' ? 'bg-emerald-400/20 border-emerald-300/60 text-emerald-100 shadow-[0_0_15px_rgba(52,211,153,0.3)]' : 'bg-white/5 border-cyan-100/20 text-cyan-50 hover:bg-white/12 hover:border-cyan-100/45'}`}
              >
                Day
              </button>
              <button
                onClick={() => onTimeOfDayChange('night')}
                className={`w-full rounded-xl border py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition duration-300 ${timeOfDay === 'night' ? 'bg-indigo-500/30 border-indigo-400/60 text-indigo-100 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-white/5 border-cyan-100/20 text-cyan-50 hover:bg-white/12 hover:border-cyan-100/45'}`}
              >
                Night
              </button>
              <button
                onClick={() => onTimeOfDayChange('rain')}
                className={`w-full rounded-xl border py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition duration-300 ${timeOfDay === 'rain' ? 'bg-blue-500/30 border-blue-400/60 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-white/5 border-cyan-100/20 text-cyan-50 hover:bg-white/12 hover:border-cyan-100/45'}`}
              >
                Rain
              </button>
            </div>
          </div>

          {/* Fullscreen */}
          <div className="mb-7">
            <button
              onClick={onFullscreen}
              className="w-full rounded-xl border border-cyan-100/45 bg-white/12 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-cyan-50 transition duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_10px_22px_rgba(56,189,248,0.25)]"
            >
              Fullscreen Grid
            </button>
          </div>

          {/* Point Weights */}
          <div className="mb-7 rounded-2xl border border-white/20 bg-cyan-100/10 p-6 shadow-[0_14px_30px_rgba(15,23,42,0.14)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:brightness-110">
            <h4 className="mb-4 text-[0.78rem] font-semibold uppercase tracking-[0.15em] text-emerald-200">Point Weights</h4>
            <p className="mb-5 text-[0.82rem] text-cyan-100/78">Defines how points are calculated.</p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="mb-1 block text-[0.78rem] font-medium text-cyan-50/95">Per Hour Age</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={weights.agePerHour}
                    onChange={(e) => onWeightsChange({ ...weights, agePerHour: Math.max(0, Number(e.target.value)) })}
                    className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2.5 font-mono text-sm text-slate-50 outline-none transition duration-300 focus:border-emerald-300/80 focus:shadow-[0_0_0_2px_rgba(74,222,128,0.2)]"
                  />
                </div>
                <span className="mt-6 text-[0.68rem] text-cyan-100/70">pts/hr</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="mb-1 block text-[0.78rem] font-medium text-cyan-50/95">Per Message</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={weights.perMessage}
                    onChange={(e) => onWeightsChange({ ...weights, perMessage: Math.max(0, Number(e.target.value)) })}
                    className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2.5 font-mono text-sm text-slate-50 outline-none transition duration-300 focus:border-emerald-300/80 focus:shadow-[0_0_0_2px_rgba(74,222,128,0.2)]"
                  />
                </div>
                <span className="mt-6 text-[0.68rem] text-cyan-100/70">pts/msg</span>
              </div>
            </div>
          </div>

          {/* Shuffle */}
          <div className="mb-7">
            <button
              onClick={onShuffle}
              className="w-full rounded-xl border border-cyan-100/45 bg-white/12 py-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-cyan-50 transition duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_10px_22px_rgba(56,189,248,0.25)]"
            >
              Shuffle Tiles
            </button>
          </div>

          <hr className="mb-7 border-white/20" />

          {/* Interaction Forms — only shown if wallet connected */}
          {!address ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/20 bg-white/8 px-5 py-9 text-center text-cyan-100/75 backdrop-blur-sm">
              <p className="mb-1 text-base leading-relaxed">Connect your wallet to join or send messages.</p>
              <p className="text-[0.8rem] text-cyan-100/65">Reading is available without a wallet.</p>
            </div>
          ) : !isMember ? (
            <div>
              <h3 className="mb-6 border-b border-white/20 pb-3 text-[0.86rem] font-semibold uppercase tracking-[0.16em] text-cyan-50/95">Join Community</h3>
              <form onSubmit={handleJoin} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-cyan-100/90">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Satoshi"
                    className="w-full rounded-xl border border-white/25 bg-white/10 px-4 py-3.5 text-base text-slate-50 outline-none shadow-inner transition duration-300 focus:border-emerald-300/80 focus:shadow-[0_0_0_2px_rgba(74,222,128,0.2)]"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-cyan-100/90">Introduction</label>
                  <textarea
                    value={intro}
                    onChange={(e) => setIntro(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="min-h-24 w-full resize-y rounded-xl border border-white/25 bg-white/10 px-4 py-3.5 text-base text-slate-50 outline-none shadow-inner transition duration-300 focus:border-emerald-300/80 focus:shadow-[0_0_0_2px_rgba(74,222,128,0.2)]"
                    rows={3}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isPending || isConfirming}
                  className="w-full rounded-xl border border-emerald-200/65 bg-linear-to-r from-emerald-300/80 to-cyan-300/75 px-5 py-4 text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-emerald-950 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(74,222,128,0.35)] disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none"
                >
                  {isPending ? 'Confirming...' : isConfirming ? 'Waiting...' : 'Form Roots'}
                </button>
                {isSuccess && <p className="rounded-xl border border-emerald-200/40 bg-emerald-300/20 py-3 text-center text-base text-emerald-100 animate-pulse">Welcome!</p>}
                {writeError && !isCooldownError && (
                  <p className="text-sm font-mono text-red-200 bg-red-900/40 px-4 py-3 rounded-xl border border-red-500/30 leading-relaxed overflow-x-auto">{writeError.message.slice(0, 100)}</p>
                )}
              </form>
            </div>
          ) : (
            <div>
              <h3 className="mb-6 border-b border-white/20 pb-3 text-[0.86rem] font-semibold uppercase tracking-[0.16em] text-cyan-50/95">Send Message</h3>
              <form onSubmit={handleSendMessage} className="flex flex-col gap-5">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Broadcast to the community..."
                  className="min-h-28 w-full resize-y rounded-xl border border-white/25 bg-white/10 px-4 py-3.5 text-base text-slate-50 outline-none shadow-inner transition duration-300 focus:border-cyan-300/80 focus:shadow-[0_0_0_2px_rgba(56,189,248,0.2)]"
                  rows={4}
                  required
                />
                <button
                  type="submit"
                  disabled={isPending || isConfirming}
                  className="w-full rounded-xl border border-cyan-100/45 bg-white/12 px-5 py-4 text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-cyan-50 transition duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_12px_24px_rgba(56,189,248,0.22)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending ? 'Confirming...' : isConfirming ? 'Sending...' : 'Send Broadcast'}
                </button>
                {isSuccess && <p className="rounded-xl border border-cyan-100/35 bg-cyan-300/20 py-3 text-center text-base text-cyan-50 animate-pulse">Sent!</p>}
                {isCooldownError && (
                  <div className="rounded-xl border border-amber-500/35 bg-amber-500/12 p-4 text-base text-amber-200 shadow-inner">
                    <p className="mt-1 font-mono text-sm leading-relaxed">Wait 12 hours between broadcasts.</p>
                  </div>
                )}
                {writeError && !isCooldownError && (
                  <p className="text-sm font-mono text-red-200 bg-red-900/40 px-4 py-3 rounded-xl border border-red-500/30 leading-relaxed overflow-x-auto">{writeError.message.slice(0, 100)}</p>
                )}
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
