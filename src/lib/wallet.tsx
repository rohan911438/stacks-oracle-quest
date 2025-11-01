import { createContext, useContext, useMemo, useState, ReactNode } from 'react';

type WalletType = 'leather' | 'xverse';

type WalletContextValue = {
  isConnected: boolean;
  walletAddress: string | null;
  walletType: WalletType | null;
  connect: (wallet: WalletType) => void;
  disconnect: () => void;
};

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<WalletType | null>(null);

  const connect = (wallet: WalletType) => {
    // Mock addresses for now
    const mockAddress =
      wallet === 'leather'
        ? 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7'
        : 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE';
    setWalletType(wallet);
    setWalletAddress(mockAddress);
    setIsConnected(true);
  };

  const disconnect = () => {
    setIsConnected(false);
    setWalletAddress(null);
    setWalletType(null);
  };

  const value = useMemo(
    () => ({ isConnected, walletAddress, walletType, connect, disconnect }),
    [isConnected, walletAddress, walletType]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within a WalletProvider');
  return ctx;
};
