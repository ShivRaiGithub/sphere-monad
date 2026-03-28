import Image from 'next/image';

interface CreateCommunityCardProps {
  onCreateCommunity: () => void;
}

export default function CreateCommunityCard({ onCreateCommunity }: CreateCommunityCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-dashed border-emerald-200/55 bg-emerald-300/10 p-6 backdrop-blur-xl shadow-[0_20px_50px_rgba(6,78,59,0.2)] transition duration-300 hover:-translate-y-1.5 hover:scale-[1.03] hover:border-emerald-200/80 hover:bg-emerald-300/15">
      <div className="relative mb-6 h-44 overflow-hidden rounded-xl border border-white/20 bg-slate-900/20">
        <div className="absolute left-1/2 top-[56%] h-24 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/35 blur-xl transition duration-300 group-hover:bg-emerald-200/50" />

        <Image
          src="/nature/grassTiles.png"
          alt="Empty environment"
          width={185}
          height={132}
          className="absolute left-1/2 top-[54%] w-[11.2rem] -translate-x-1/2 -translate-y-1/2 opacity-85"
        />

        <div className="absolute left-1/2 top-[48%] flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-emerald-100/70 bg-emerald-300/35 text-2xl font-semibold text-white shadow-[0_0_26px_rgba(74,222,128,0.48)]">
          +
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">Establish New Land</h3>
        <p className="text-sm leading-6 text-emerald-50/88">Create a fresh environment and shape the next community from the ground up.</p>
        <button
          onClick={onCreateCommunity}
          className="mt-2 w-full rounded-xl border border-emerald-200/65 bg-emerald-400/85 px-4 py-3 text-sm font-semibold text-emerald-950 transition duration-300 hover:shadow-[0_15px_30px_rgba(74,222,128,0.4)]"
        >
          Create Community
        </button>
      </div>

    </div>
  );
}