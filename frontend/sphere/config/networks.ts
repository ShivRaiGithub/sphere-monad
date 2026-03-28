import { defineChain } from 'viem';

export const anvil = defineChain({
  id: 31337,
  name: 'Anvil',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
  },
  testnet: true,
});

export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'Monad', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://testnet.monadexplorer.com' },
  },
  testnet: true,
});

const chains = {
  anvil,
  monad: monadTestnet,
} as const;

export type ChainKey = keyof typeof chains;

export function getActiveChain(): (typeof chains)[ChainKey] {
  const key = (process.env.NEXT_PUBLIC_CHAIN || 'anvil') as ChainKey;
  return chains[key] || anvil;
}

export function getAllChains() {
  return [anvil, monadTestnet] as const;
}
