'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="landing-rk relative min-h-screen overflow-hidden text-slate-50">
      <div className="absolute inset-0">
        <Image src="/bg.png" alt="Sphere world backdrop" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,23,42,0.38)_0%,rgba(30,58,138,0.46)_55%,rgba(56,189,248,0.22)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(56,189,248,0.25),transparent_40%),radial-gradient(circle_at_78%_62%,rgba(34,197,94,0.25),transparent_42%),radial-gradient(circle_at_50%_85%,rgba(125,211,252,0.15),transparent_48%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-425 items-center px-[clamp(3.25rem,8vw,9.5rem)] py-10">
        <main className="grid w-full items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(460px,0.95fr)]">
          <section className="mx-auto max-w-xl space-y-9 px-6 sm:px-10 lg:mx-0 lg:ml-20 xl:ml-28 2xl:ml-36">
            <Image
              src="/logo.png"
              alt="Sphere logo"
              width={180}
              height={180}
              className="h-28 w-28 drop-shadow-[0_16px_24px_rgba(8,47,73,0.35)] sm:h-32 sm:w-32"
            />

            <div className="mt-3 mb-4 space-y-6 pr-3 sm:pr-5">
              <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:pl-2 lg:text-7xl lg:mb-2">
                Sphere
              </h1>
              <h2 className="text-xl font-medium text-emerald-200 sm:text-2xl lg:pl-3 lg:mb-2">Grow your presence on-chain</h2>
              <p className="max-w-lg text-pretty text-base leading-8 text-slate-100/90 sm:text-lg lg:pl-3 lg:mb-4">
                Enter a calm, living on-chain world where communities become environments and participation shapes
                the landscape over time.
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-5 pt-5 lg:pl-3">
              <div className="rounded-2xl border border-emerald-300/55 bg-emerald-400/20 p-1.5 shadow-[0_10px_40px_rgba(34,197,94,0.35)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_14px_52px_rgba(34,197,94,0.5)]">
                <ConnectButton label="Connect Wallet" showBalance={false} />
              </div>
              <Link
                href="/home"
                className="inline-flex min-h-14 items-center justify-center whitespace-nowrap rounded-2xl border border-cyan-200/55 bg-white/8 px-14 py-5 text-lg font-semibold leading-none tracking-wide text-cyan-50 backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300/80 hover:bg-white/16 hover:shadow-[0_12px_34px_rgba(56,189,248,0.25)]"
              >
                Explore Communities
              </Link>
            </div>
          </section>

          <section className="relative flex justify-center lg:justify-end">
            <div className="absolute h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(103,232,249,0.4)_0%,rgba(52,211,153,0.22)_42%,transparent_75%)] blur-2xl" />

            <div className="relative w-full max-w-150">
              <div className="asset-float-slow absolute -left-10 top-6 z-8 w-36 rounded-3xl border border-cyan-100/35 bg-cyan-100/8 p-3 shadow-[0_16px_38px_rgba(8,47,73,0.3)] sm:w-40">
                <Image src="/nature/pond.png" alt="Pond terrain" width={260} height={170} className="h-auto w-full" />
              </div>

              <div className="asset-float-fast absolute -right-12 top-8 z-8 w-34 rounded-3xl border border-emerald-100/35 bg-emerald-100/8 p-3 shadow-[0_16px_38px_rgba(8,47,73,0.3)] sm:w-36">
                <Image src="/nature/rocks.png" alt="Rock terrain" width={240} height={160} className="h-auto w-full" />
              </div>

              <div className="asset-float-slow absolute -right-9 bottom-5 z-8 w-36 rounded-3xl border border-cyan-100/35 bg-cyan-100/8 p-3 shadow-[0_16px_38px_rgba(8,47,73,0.3)] sm:w-40">
                <Image src="/nature/grassTiles.png" alt="Grass terrain" width={260} height={170} className="h-auto w-full" />
              </div>

              <div className="forest-float relative z-6 mx-auto w-full max-w-140 rounded-[2.5rem] border border-cyan-200/35 bg-white/4 p-4 shadow-[0_24px_80px_rgba(14,55,130,0.35)] backdrop-blur-[1px]">
              <Image
                src="/nature/forestArea.png"
                alt="Floating community world"
                width={860}
                height={620}
                priority
                className="h-auto w-full"
              />
              </div>
            </div>
          </section>
        </main>
      </div>

      <style jsx>{`
        .landing-rk :global([data-rk] button) {
          background: rgba(17, 94, 89, 0.8);
          border: 1px solid rgba(167, 243, 208, 0.38);
          color: #ecfeff;
          padding: 14px 24px;
          font-size: 20px;
          font-weight: 600;
          border-radius: 14px;
          box-shadow: 0 8px 26px rgba(6, 95, 70, 0.28);
          transition: all 0.28s ease;
        }

        .landing-rk :global([data-rk] button:hover) {
          background: rgba(20, 130, 115, 0.88);
          border-color: rgba(110, 231, 183, 0.72);
          transform: translateY(-1px);
          box-shadow: 0 12px 30px rgba(6, 95, 70, 0.36);
        }

        .forest-float {
          animation: forestFloat 6.8s ease-in-out infinite;
        }

        .asset-float-slow {
          animation: assetFloatSlow 7.8s ease-in-out infinite;
        }

        .asset-float-fast {
          animation: assetFloatFast 5.8s ease-in-out infinite;
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

        @keyframes assetFloatSlow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes assetFloatFast {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }
      `}</style>
    </div>
  );
}
