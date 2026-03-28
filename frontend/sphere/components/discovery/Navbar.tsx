'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { getAllChains } from '@/config/networks';

interface NavbarProps {
  onCreateCommunity: () => void;
}

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function Navbar({ onCreateCommunity }: NavbarProps) {
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();
  const chains = getAllChains();

  return (
    <header className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-xl shadow-[0_8px_35px_rgba(14,55,130,0.2)] sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Sphere logo" width={42} height={42} className="h-10 w-10 rounded-lg bg-white/20 p-1" />
          <span className="text-xl font-semibold tracking-wide text-white">Sphere</span>
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <label className="sr-only" htmlFor="network-selector">
            Network selector
          </label>
          <select
            id="network-selector"
            value={chainId}
            onChange={(e) => switchChain({ chainId: Number(e.target.value) })}
            disabled={isPending}
            className="rounded-xl border border-cyan-200/45 bg-slate-800/45 px-3 py-2 text-sm text-cyan-50 outline-none backdrop-blur transition hover:border-cyan-200/70"
          >
            {chains.map((chain) => (
              <option key={chain.id} value={chain.id} className="bg-slate-900 text-slate-100">
                {chain.name}
              </option>
            ))}
          </select>

          <div className="rounded-xl border border-white/25 bg-slate-800/50 px-3 py-2 font-mono text-sm text-slate-100">
            {address ? truncateAddress(address) : 'Wallet not connected'}
          </div>

          <button
            onClick={onCreateCommunity}
            className="rounded-xl border border-emerald-300/75 bg-emerald-400/90 px-4 py-2 text-sm font-semibold text-emerald-950 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(74,222,128,0.45)]"
          >
            + Create Community
          </button>
        </div>
      </div>
    </header>
  );
}