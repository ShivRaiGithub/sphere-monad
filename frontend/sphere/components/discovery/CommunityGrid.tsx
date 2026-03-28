import type { Community } from '@/context/SphereContext';
import CommunityCard from './CommunityCard';
import CreateCommunityCard from './CreateCommunityCard';

interface CommunityGridProps {
  communities: Community[];
  isLoading: boolean;
  onCreateCommunity: () => void;
}

export default function CommunityGrid({ communities, isLoading, onCreateCommunity }: CommunityGridProps) {
  if (isLoading) {
    return (
      <section className="flex min-h-88 items-center justify-center rounded-3xl border border-white/20 bg-white/10 backdrop-blur-lg">
        <div className="flex flex-col items-center gap-4 text-cyan-50/90">
          <div className="relative h-14 w-14">
            <div className="absolute inset-0 rounded-full border-4 border-cyan-100/30" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-emerald-300" />
          </div>
          <p className="text-sm font-medium tracking-wide">Loading floating environments...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
      <CreateCommunityCard onCreateCommunity={onCreateCommunity} />

      {communities.map((community) => (
        <CommunityCard key={community.id.toString()} community={community} />
      ))}
    </section>
  );
}