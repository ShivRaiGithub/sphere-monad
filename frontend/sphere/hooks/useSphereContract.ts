import { SPHERE_ABI, getContractAddress } from '@/config/contract';

export function useSphereContract() {
  return {
    address: getContractAddress(),
    abi: SPHERE_ABI,
  } as const;
}
