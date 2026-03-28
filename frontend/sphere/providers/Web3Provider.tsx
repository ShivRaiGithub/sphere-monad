'use client';

import { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { getActiveChain, getAllChains } from '@/config/networks';

const chains = getAllChains();
const activeChain = getActiveChain();

const config = createConfig({
  chains: chains,
  transports: {
    [anvil.id]: http(anvil.rpcUrls.default.http[0]),
    [monadTestnet.id]: http(monadTestnet.rpcUrls.default.http[0]),
  },
});

const queryClient = new QueryClient();

// Need to import these for the transport keys
import { anvil, monadTestnet } from '@/config/networks';

export default function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={lightTheme({
            accentColor: '#14b8a6',
            accentColorForeground: '#f0fdfa',
            borderRadius: 'medium',
            fontStack: 'system',
          })}
          initialChain={activeChain}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
