import React, { createContext, ReactNode, useContext, useState } from "react";
import { useConnect, useDisconnect } from "wagmi";
import { Popup } from "./Popup";
import { ButtonWithLoader } from "./ButtonWithLoader";

interface ConnectWalletPopupType {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const ConnectWalletPopupContext = createContext<
  ConnectWalletPopupType | undefined
>(undefined);

export const useConnectWalletPopup = () => {
  const ctx = useContext(ConnectWalletPopupContext);
  if (!ctx)
    throw new Error(
      "useConnectWalletPopup must be used within a ConnectWalletPopupProvider"
    );
  return ctx;
};

export const ConnectWalletPopupProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [connectingConnectorId, setConnectingConnectorId] = useState<
    string | null
  >(null);
  const { connectors, connectAsync, error, isPending } = useConnect();

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <ConnectWalletPopupContext.Provider value={{ open, close, isOpen }}>
      {children}
      <Popup popupTitle="Connect Wallet" isOpen={isOpen} onClose={close}>
        <div className="flex flex-col gap-2">
          {connectors.map((connector) => (
            <ButtonWithLoader
              key={connector.id}
              isLoading={isPending && connector.id === connectingConnectorId}
              disabled={isPending && connector.id !== connectingConnectorId}
              onClick={async () => {
                setConnectingConnectorId(connector.id);
                try {
                  await connectAsync({
                    connector,
                  });
                  close();
                } catch (err) {
                  console.error("Failed to connect:", err);
                } finally {
                  setConnectingConnectorId(null);
                }
              }}
              className="mb-2"
            >
              {connector.name}
            </ButtonWithLoader>
          ))}
          {error && <span className="text-red-500">{error.message}</span>}
        </div>
      </Popup>
    </ConnectWalletPopupContext.Provider>
  );
};
