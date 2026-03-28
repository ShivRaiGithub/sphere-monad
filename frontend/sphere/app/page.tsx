'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden text-slate-50">
      <div className="absolute inset-0">
        <Image src="/bg.png" alt="Sphere world backdrop" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,23,42,0.38)_0%,rgba(30,58,138,0.46)_55%,rgba(56,189,248,0.22)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(56,189,248,0.25),transparent_40%),radial-gradient(circle_at_78%_62%,rgba(34,197,94,0.25),transparent_42%),radial-gradient(circle_at_50%_85%,rgba(125,211,252,0.15),transparent_48%)]" />
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          src="/nature/rocks.png"
          alt=""
          width={240}
          height={160}
          className="absolute -left-10 top-[10%] rotate-[-8deg] opacity-40 blur-[0.2px]"
        />
        <Image
          src="/nature/grassTiles.png"
          alt=""
          width={290}
          height={160}
          className="absolute -right-16 top-[8%] rotate-10 opacity-30"
        />
        <Image
          src="/nature/pond.png"
          alt=""
          width={270}
          height={185}
          className="absolute left-[2%] bottom-[8%] opacity-28 scale-95"
        />
        <Image
          src="/nature/rocks.png"
          alt=""
          width={190}
          height={130}
          className="absolute right-[6%] bottom-[6%] rotate-12 opacity-35"
        />
        <Image
          src="/nature/grassTiles.png"
          alt=""
          width={220}
          height={120}
          className="absolute left-[45%] -bottom-6 opacity-20"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-10 sm:px-10 lg:px-14">
        <main className="grid w-full items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(460px,0.95fr)]">
          <section className="max-w-xl space-y-8">
            <Image
              src="/logo.png"
              alt="Sphere logo"
              width={80}
              height={80}
              className="h-16 w-16 rounded-xl bg-white/15 p-2 shadow-[0_14px_35px_rgba(10,40,100,0.35)] backdrop-blur"
            />

            <div className="space-y-5">
              <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Sphere
              </h1>
              <h2 className="text-xl font-medium text-emerald-200 sm:text-2xl">Grow your presence on-chain</h2>
              <p className="max-w-lg text-pretty text-base leading-7 text-slate-100/90 sm:text-lg">
                Enter a calm, living on-chain world where communities become environments and participation shapes
                the landscape over time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <div className="rounded-2xl border border-emerald-300/50 bg-emerald-400/20 p-1 shadow-[0_10px_40px_rgba(34,197,94,0.35)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_14px_52px_rgba(34,197,94,0.5)]">
                <ConnectButton label="Connect Wallet" showBalance={false} />
              </div>
              <Link
                href="/home"
                className="rounded-2xl border border-cyan-200/55 bg-white/8 px-6 py-3 text-sm font-medium tracking-wide text-cyan-50 backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300/80 hover:bg-white/16 hover:shadow-[0_12px_34px_rgba(56,189,248,0.25)]"
              >
                Explore Communities
              </Link>
            </div>
          </section>

          <section className="relative flex justify-center lg:justify-end">
            <div className="absolute h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(103,232,249,0.4)_0%,rgba(52,211,153,0.22)_42%,transparent_75%)] blur-2xl" />
            <div className="forest-float relative w-full max-w-140 rounded-[2.5rem] border border-cyan-200/35 bg-white/6 p-4 shadow-[0_24px_80px_rgba(14,55,130,0.35)] backdrop-blur-[2px]">
              <Image
                src="/nature/forestArea.png"
                alt="Floating community world"
                width={860}
                height={620}
                priority
                className="h-auto w-full"
              />
            </div>
          </section>
        </main>
      </div>

      <style jsx>{`
        .forest-float {
          animation: forestFloat 6.8s ease-in-out infinite;
        }

        @keyframes forestFloat {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
