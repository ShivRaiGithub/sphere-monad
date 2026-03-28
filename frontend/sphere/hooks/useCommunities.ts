'use client';

import { useReadContract, useReadContracts } from 'wagmi';
import { useSphereContract } from './useSphereContract';
import { useMemo } from 'react';
import type { Community } from '@/context/SphereContext';

export function useCommunities() {
  const contract = useSphereContract();

  // Step 1: get total community count
  const {
    data: countData,
    isLoading: countLoading,
    refetch: refetchCount,
  } = useReadContract({
    ...contract,
    functionName: 'communityCount',
  });

  const count = countData ? Number(countData) : 0;

  // Step 2: fetch all communities
  const communityContracts = useMemo(() => {
    if (count === 0) return [];
    return Array.from({ length: count }, (_, i) => ({
      ...contract,
      functionName: 'communities' as const,
      args: [BigInt(i + 1)] as const,
    }));
  }, [count, contract]);

  const {
    data: communitiesData,
    isLoading: communitiesLoading,
    refetch: refetchCommunities,
  } = useReadContracts({
    contracts: communityContracts,
    query: {
      enabled: count > 0,
    },
  });

  const communities: Community[] = useMemo(() => {
    if (!communitiesData) return [];
    return communitiesData
      .map((result, i) => {
        if (result.status !== 'success' || !result.result) return null;
        const [id, name, creator, exists] = result.result as [bigint, string, `0x${string}`, boolean];
        return { id, name, creator, exists };
      })
      .filter((c): c is Community => c !== null && c.exists);
  }, [communitiesData]);

  const refetch = () => {
    refetchCount();
    refetchCommunities();
  };

  return {
    communities,
    count,
    isLoading: countLoading || communitiesLoading,
    refetch,
  };
}
