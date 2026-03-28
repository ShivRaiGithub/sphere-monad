'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useCallback,
} from 'react';
import {
  useReadContract,
  useWriteContract,
  useAccount,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { SPHERE_ABI, getContractAddress } from '@/config/contract';

// ── Types ──

export interface Community {
  id: bigint;
  name: string;
  creator: `0x${string}`;
  exists: boolean;
}

export interface Member {
  wallet: `0x${string}`;
  serial: bigint;
  name: string;
  intro: string;
  joinedAt: bigint;
  lastMessageAt: bigint;
  messageCount: bigint;
  status: number; // 0 = Active, 1 = Removed
}

interface SphereContextType {
  contractAddress: `0x${string}`;
  abi: typeof SPHERE_ABI;
  // write helpers
  createCommunity: (name: string, creator: `0x${string}`) => void;
  register: (communityId: bigint, name: string, intro: string) => void;
  sendMessage: (communityId: bigint, message: string) => void;
  // write state
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  txHash: `0x${string}` | undefined;
  writeError: Error | null;
  resetWrite: () => void;
}

const SphereContext = createContext<SphereContextType | null>(null);

// ── Provider ──

export function SphereProvider({ children }: { children: ReactNode }) {
  const contractAddress = getContractAddress();
  const {
    writeContract,
    data: txHash,
    isPending,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const createCommunity = useCallback(
    (name: string, creator: `0x${string}`) => {
      writeContract({
        address: contractAddress,
        abi: SPHERE_ABI,
        functionName: 'createCommunity',
        args: [name, creator],
      });
    },
    [writeContract, contractAddress]
  );

  const register = useCallback(
    (communityId: bigint, name: string, intro: string) => {
      writeContract({
        address: contractAddress,
        abi: SPHERE_ABI,
        functionName: 'register',
        args: [communityId, name, intro],
      });
    },
    [writeContract, contractAddress]
  );

  const sendMessage = useCallback(
    (communityId: bigint, message: string) => {
      writeContract({
        address: contractAddress,
        abi: SPHERE_ABI,
        functionName: 'sendMessage',
        args: [communityId, message],
      });
    },
    [writeContract, contractAddress]
  );

  return (
    <SphereContext.Provider
      value={{
        contractAddress,
        abi: SPHERE_ABI,
        createCommunity,
        register,
        sendMessage,
        isPending,
        isConfirming,
        isSuccess,
        txHash,
        writeError: writeError ?? null,
        resetWrite,
      }}
    >
      {children}
    </SphereContext.Provider>
  );
}

// ── Hook ──

export function useSphere() {
  const ctx = useContext(SphereContext);
  if (!ctx) throw new Error('useSphere must be used within SphereProvider');
  return ctx;
}
