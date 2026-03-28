'use client';

import { useReadContract } from 'wagmi';
import { useSphereContract } from './useSphereContract';
import { useMemo } from 'react';
import type { Member } from '@/context/SphereContext';

export function useMembers(communityId: bigint, gridSize: number = 3) {
  const contract = useSphereContract();
  const maxTiles = gridSize * gridSize;

  // Step 1: get member count
  const {
    data: countData,
    isLoading: countLoading,
    refetch: refetchCount,
  } = useReadContract({
    ...contract,
    functionName: 'memberCount',
    args: [communityId],
  });

  const totalMembers = countData ? Number(countData) : 0;
  const fetchTo = Math.min(totalMembers, maxTiles);

  // Step 2: get members in range
  const {
    data: membersData,
    isLoading: membersLoading,
    refetch: refetchMembers,
  } = useReadContract({
    ...contract,
    functionName: 'getMembersInRange',
    args: [communityId, BigInt(0), BigInt(fetchTo)],
    query: {
      enabled: fetchTo > 0,
    },
  });

  const members: Member[] = useMemo(() => {
    if (!membersData) return [];
    const [wallets, serials, names, intros, joinedAts, lastMessageAts, statuses] =
      membersData as [
        `0x${string}`[],
        bigint[],
        string[],
        string[],
        bigint[],
        bigint[],
        number[],
      ];

    return wallets.map((wallet, i) => ({
      wallet,
      serial: serials[i],
      name: names[i],
      intro: intros[i],
      joinedAt: joinedAts[i],
      lastMessageAt: lastMessageAts[i],
      status: statuses[i],
    }));
  }, [membersData]);

  const refetch = () => {
    refetchCount();
    refetchMembers();
  };

  return {
    members,
    totalMembers,
    isLoading: countLoading || membersLoading,
    refetch,
  };
}
