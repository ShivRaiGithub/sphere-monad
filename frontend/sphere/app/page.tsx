'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export default function LandingPage() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push('/home');
    }
  }, [isConnected, router]);

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-bg-primary overflow-hidden">
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(16,185,129,0.08)_0%,transparent_60%)]" />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent rounded-full opacity-0"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ${Math.random() * 5}s infinite ease-in-out`,
            }}
          />
        ))}
      </div>

      <main className="text-center z-10 px-6 max-w-[700px] w-full">
        {/* Tree icons */}
        <div className="flex items-end justify-center gap-6 mb-6">
          <img src="/forest/sprout.png" alt="sprout" className="w-12 h-12 pixel-img drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" style={{ animation: 'tree-bob 3s ease-in-out infinite' }} />
          <img src="/forest/mtree.png" alt="tree" className="w-16 h-16 pixel-img drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" style={{ animation: 'tree-bob 3s 0.5s ease-in-out infinite' }} />
          <img src="/forest/etree.png" alt="elder" className="w-12 h-12 pixel-img drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" style={{ animation: 'tree-bob 3s 1s ease-in-out infinite' }} />
        </div>

        {/* Title */}
        <h1 className="font-pixel text-4xl tracking-wider mb-3">
          <span className="bg-gradient-to-br from-accent via-accent-glow to-emerald-200 bg-clip-text text-transparent">
            Sphere
          </span>
        </h1>

        <p className="font-pixel text-[0.65rem] text-accent uppercase tracking-[0.2em] mb-4">
          Interactive on-chain community platform
        </p>

        <p className="text-text-secondary text-base leading-7 max-w-md mx-auto mb-6">
          Join communities. Plant your tree. Grow together.
          <br />
          Each member is a tree that grows over time on an isometric grid.
        </p>

        {/* Connect */}
        <div className="mb-10">
          <ConnectButton label="🌱 Connect Wallet" showBalance={false} />
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '🌳', title: 'Grow Together', desc: 'Your tree grows as you participate in the community' },
            { icon: '🗺️', title: 'Isometric Grid', desc: 'Visual community map with pixel-art trees' },
            { icon: '⛓️', title: 'On-Chain', desc: 'All data lives on the blockchain permanently' },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-bg-card border border-border rounded-xl p-5 text-center transition-all duration-300 hover:border-border-accent hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(16,185,129,0.08)]"
            >
              <span className="text-2xl block mb-2">{f.icon}</span>
              <h3 className="font-pixel text-[0.55rem] text-text-primary mb-2">{f.title}</h3>
              <p className="text-sm text-text-secondary leading-snug">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
