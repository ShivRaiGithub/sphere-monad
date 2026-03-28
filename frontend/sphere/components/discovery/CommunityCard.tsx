import Image from 'next/image';
import Link from 'next/link';
import type { Community } from '@/context/SphereContext';

interface CommunityCardProps {
  community: Community;
}

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function CommunityCard({ community }: CommunityCardProps) {
  const variant = Number(community.id % 3n);

  return (
    <Link
      href={`/${community.id.toString()}`}
      className="group relative overflow-hidden rounded-2xl border border-white/25 bg-white/10 p-6 backdrop-blur-xl shadow-[0_20px_50px_rgba(12,40,93,0.3)] transition duration-300 hover:-translate-y-1.5 hover:scale-[1.035] hover:border-emerald-200/70 hover:brightness-110 hover:shadow-[0_24px_56px_rgba(74,222,128,0.35)]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-cyan-200/12 to-transparent" />

      <div className="relative mb-6 h-44 overflow-hidden rounded-xl border border-white/20 bg-slate-900/20">

        <div className="absolute left-1/2 top-[56%] h-24 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/30 blur-xl transition duration-300 group-hover:bg-emerald-200/45" />

        <Image
          src="/nature/grassTiles.png"
          alt="Community terrain"
          width={190}
          height={140}
          className="absolute left-1/2 top-[54%] w-[11.6rem] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_14px_18px_rgba(6,78,59,0.28)]"
        />

        {variant !== 1 && (
          <Image
            src="/nature/pond.png"
            alt=""
            width={100}
            height={70}
            className="absolute left-[24%] top-[48%] w-16 opacity-85"
          />
        )}

        <Image
          src="/nature/rocks.png"
          alt=""
          width={112}
          height={72}
          className={`absolute opacity-85 ${variant === 2 ? 'left-[56%] top-[45%] w-[4.6rem]' : 'left-[58%] top-[52%] w-[4.3rem]'}`}
        />

        <div className="absolute left-[38%] top-[58%] h-2.5 w-20 rotate-[-14deg] rounded-full bg-[linear-gradient(90deg,rgba(245,245,220,0.24),rgba(234,179,8,0.22),rgba(245,245,220,0.2))] blur-[0.4px]" />
      </div>

      <div className="space-y-2">
        <h3 className="line-clamp-1 text-lg font-semibold text-white">{community.name}</h3>
        <p className="text-xs text-cyan-100/75">Creator: <span className="font-mono text-cyan-50/95">{truncateAddress(community.creator)}</span></p>
        <div className="flex items-center justify-between pt-2">
          <span className="rounded-lg border border-cyan-100/30 bg-cyan-400/10 px-2 py-1 text-xs text-cyan-50/90">ID #{community.id.toString()}</span>
        </div>
      </div>
    </Link>
  );
}