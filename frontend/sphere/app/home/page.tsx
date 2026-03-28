'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { useCommunities } from '@/hooks/useCommunities';
import { useSphere } from '@/context/SphereContext';
import Navbar from '@/components/discovery/Navbar';
import PageHeader from '@/components/discovery/PageHeader';
import CommunityGrid from '@/components/discovery/CommunityGrid';

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
    <div className="relative min-h-screen overflow-x-hidden text-slate-50">
      <div className="absolute inset-0">
        <Image src="/bg.png" alt="World map background" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.25)_0%,rgba(30,58,138,0.35)_52%,rgba(22,163,74,0.22)_100%)]" />
        <div className="absolute inset-0 backdrop-blur-[1.2px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.23),transparent_38%),radial-gradient(circle_at_76%_22%,rgba(34,197,94,0.2),transparent_41%),radial-gradient(circle_at_50%_90%,rgba(2,132,199,0.26),transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(15,23,42,0.36)_100%)]" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-1 overflow-hidden">
        {Array.from({ length: 16 }, (_, i) => (
          <span
            key={`particle-${i}`}
            className="absolute size-1 rounded-full bg-cyan-200/55 shadow-[0_0_14px_rgba(56,189,248,0.7)]"
            style={{
              left: `${8 + (i % 8) * 11}%`,
              top: `${12 + (i % 5) * 17}%`,
              opacity: i % 3 === 0 ? 0.6 : 0.35,
              animation: `particleDrift ${10 + i * 0.7}s ease-in-out ${i * 0.35}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-8 lg:px-12">
        <Navbar onCreateCommunity={() => { setShowCreate(true); resetWrite(); }} />

        <main className="flex-1 pb-10 pt-8 sm:pt-10">
          <PageHeader
            title="Discover Communities"
            subtitle="Explore living spaces waiting to be populated"
          />

          <CommunityGrid
            communities={communities}
            isLoading={isLoading}
            onCreateCommunity={() => { setShowCreate(true); resetWrite(); }}
          />
        </main>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/55 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
          <div className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-slate-900/65 p-7 shadow-[0_30px_80px_rgba(8,47,73,0.45)] backdrop-blur-xl sm:p-8">
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-emerald-300/25 blur-2xl" />

            <button
              onClick={() => setShowCreate(false)}
              className="absolute right-5 top-4 rounded-full px-2 py-1 text-sm text-slate-200 transition hover:bg-white/10 hover:text-white"
            >
              Close
            </button>

            <h3 className="text-2xl font-semibold tracking-tight text-white">Establish New Land</h3>
            <p className="mt-2 text-sm text-cyan-50/80">Create an empty environment and invite the first settlers.</p>

            <form onSubmit={handleCreate} className="mt-7 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-[0.14em] text-cyan-100/85">Community Name</label>
                <input
                  type="text"
                  value={communityName}
                  onChange={(e) => setCommunityName(e.target.value)}
                  placeholder="ex. Azure Valley"
                  className="w-full rounded-xl border border-white/25 bg-slate-800/70 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-300/80 focus:shadow-[0_0_0_3px_rgba(34,197,94,0.2)]"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-[0.14em] text-cyan-100/85">Creator Address (Optional)</label>
                <input
                  type="text"
                  value={creatorAddress}
                  onChange={(e) => setCreatorAddress(e.target.value)}
                  placeholder={address ? `${address.slice(0, 8)}...` : '0x...'}
                  className="w-full rounded-xl border border-white/25 bg-slate-800/70 px-4 py-3 font-mono text-sm text-slate-100 outline-none transition focus:border-cyan-300/80 focus:shadow-[0_0_0_3px_rgba(56,189,248,0.2)]"
                />
              </div>

              <button
                type="submit"
                disabled={isPending || isConfirming}
                className="w-full rounded-xl border border-emerald-300/70 bg-emerald-400/85 px-5 py-3 text-sm font-semibold text-emerald-950 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_34px_rgba(74,222,128,0.45)] disabled:cursor-not-allowed disabled:opacity-55"
              >
                {isPending ? 'Confirm Wallet Transaction...' : isConfirming ? 'Creating Community...' : 'Create Community'}
              </button>

              {isSuccess && (
                <div className="rounded-xl border border-emerald-300/55 bg-emerald-300/20 p-3 text-sm text-emerald-100">
                  Community created successfully.
                  <button
                    onClick={() => {
                      refetch();
                      resetWrite();
                      setShowCreate(false);
                    }}
                    className="ml-2 font-semibold text-white underline decoration-emerald-200 underline-offset-4"
                  >
                    Refresh map
                  </button>
                </div>
              )}

              {writeError && (
                <p className="rounded-xl border border-rose-300/45 bg-rose-950/40 px-3 py-2 font-mono text-xs text-rose-100/95">
                  {writeError.message.slice(0, 170)}...
                </p>
              )}
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes particleDrift {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-10px) translateX(6px);
          }
        }
      `}</style>
    </div>
  );
}
