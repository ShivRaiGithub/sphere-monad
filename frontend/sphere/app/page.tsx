'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import HeroEnvironment from '@/components/HeroEnvironment';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex relative overflow-hidden text-text-primary">
      {/* Full screen background environment */}
      <HeroEnvironment />

      {/* Content wrapper with pointer events */}
      <div className="relative z-40 flex-1 flex flex-col w-full max-w-[1400px] mx-auto px-6 lg:px-12 pointer-events-none">
        
        {/* Header/Nav space if needed */}
        <div className="h-24" />

        <main className="flex-1 flex flex-col justify-center pointer-events-auto max-w-xl pb-32">
          <h1 className="font-pixel text-6xl md:text-7xl tracking-widest mb-6 drop-shadow-md text-white">
            Sphere
          </h1>
          
          <h2 className="font-pixel text-[1.2rem] text-accent-glow mb-8 leading-relaxed uppercase tracking-widest drop-shadow">
            Grow your presence on-chain
          </h2>

          <div className="text-text-secondary text-lg leading-relaxed mb-12 space-y-6 backdrop-blur-sm bg-bg-card/40 p-10 rounded-3xl border border-border/50 shadow-xl shadow-bg-primary/20">
            <p className="text-text-primary text-xl">
              Sphere is a persistent, on-chain social layer where communities take shape as living environments.
            </p>
            <p className="text-blue-100/90 text-base leading-relaxed">
              Each member is represented by a tree that grows over time through participation. 
              The longer you stay, the more your presence evolves.
            </p>
            <p className="font-bold text-white pt-4 font-pixel text-sm tracking-widest uppercase opacity-90">
              Communities are not lists — they are landscapes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="scale-105 origin-left transition-transform duration-300 hover:scale-[1.08] drop-shadow-xl shadow-accent/20">
              <ConnectButton label="Connect Wallet" showBalance={false} />
            </div>
            <Link 
              href="/home" 
              className="font-pixel text-[0.75rem] uppercase tracking-widest text-text-primary hover:text-white transition-all duration-300 px-8 py-4 border border-border/80 hover:border-accent-glow/60 rounded-xl bg-bg-panel/60 backdrop-blur-md hover:bg-bg-hover shadow-lg hover:shadow-accent/10"
            >
              Explore Communities
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
