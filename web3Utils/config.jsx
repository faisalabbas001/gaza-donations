/* eslint-disable no-unused-vars */
import { createAppKit } from '@reown/appkit/react';

import { WagmiProvider } from 'wagmi';
import { arbitrum, fantomTestnet, hardhat } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

// 0. Setup queryClient
const queryClient = new QueryClient();

const VITE_PROJECT_ID = import.meta.env.VITE_API_URL;

// 1. Get projectId from https://cloud.reown.com
const projectId = 'e027df9958b6dce7d145f0c89ebb49c4';

// 2. Create a metadata object - optional
const metadata = {
  name: 'give Gaza',
  description: 'give Gaza',
  url: 'http://localhost:5173/', // origin must match your domain & subdomain
  icons: [''],
};

// 3. Set the networks
const networks = [fantomTestnet, hardhat];

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

export const config = wagmiAdapter.wagmiConfig;

export function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
