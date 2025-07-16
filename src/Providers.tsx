import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { PropsWithChildren, type ReactNode, useState } from "react";
import { cookieToInitialState, type State, WagmiProvider } from "wagmi";
import { getConfig } from "./wagmi";
import { ConnectWalletPopupProvider } from "./components/general/ConnectWalletPopup";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});
const config = getConfig();

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  const initialState = cookieToInitialState(config, document.cookie);
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <ConnectWalletPopupProvider>{children}</ConnectWalletPopupProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
