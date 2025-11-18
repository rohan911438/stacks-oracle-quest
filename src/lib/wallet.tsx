import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';

type WalletType = 'leather' | 'xverse';

type WalletContextValue = {
  isConnected: boolean;
  walletAddress: string | null;
  walletType: WalletType | null;
  connect: (wallet: WalletType) => Promise<boolean>;
  disconnect: () => void;
};

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<WalletType | null>(null);
  const appConfig = useMemo(() => new AppConfig(['store_write', 'publish_data']), []);
  const userSession = useMemo(() => new UserSession({ appConfig }), [appConfig]);

  const resolveStacksAddress = () => {
    try {
      const data: any = userSession.loadUserData();
      const net = (import.meta as any)?.env?.VITE_STACKS_NETWORK || 'mainnet';
      const profileAddr = data?.profile?.stxAddress;
      return (
        profileAddr?.[net] || profileAddr?.mainnet || profileAddr?.testnet || null
      ) as string | null;
    } catch {
      return null;
    }
  };

  const connect = async (wallet: WalletType): Promise<boolean> => {
    try {
      if (!userSession.isUserSignedIn()) {
        await new Promise<void>((resolve) => {
          showConnect({
            userSession,
            appDetails: {
              name: 'OracleQuest',
              icon: `${window.location.origin}/favicon.ico`,
            },
            onFinish: () => resolve(),
            onCancel: () => resolve(),
          });
        });
      }

      if (userSession.isUserSignedIn()) {
        const addr = resolveStacksAddress();
        if (addr) {
          setWalletType(wallet);
          setWalletAddress(addr);
          setIsConnected(true);
          return true;
        }
      }
      // If still not signed in, guide to install based on choice
      const provider: any = (globalThis as any)?.StacksProvider;
      const isLeather = !!(provider?.isHiroWallet || provider?.isLeather);
      const isXverse = !!(provider?.isXverse || provider?.name === 'Xverse');
      if (wallet === 'leather' && !isLeather) {
        window.open('https://leather.io/', '_blank', 'noopener');
      }
      if (wallet === 'xverse' && !isXverse) {
        window.open('https://www.xverse.app/download', '_blank', 'noopener');
      }
      return false;
    } catch (e) {
      console.error('Wallet connect error:', e);
      return false;
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setWalletAddress(null);
    setWalletType(null);
    try {
      if (userSession.isUserSignedIn()) {
        userSession.signUserOut();
      }
    } catch {}
  };

  // Ensure pending sign-ins are completed and restore state on reloads
  useEffect(() => {
    let mounted = true;
    const finalize = (w: WalletType | null) => {
      const addr = resolveStacksAddress();
      if (!mounted) return;
      if (addr) {
        setWalletType(w);
        setWalletAddress(addr);
        setIsConnected(true);
      }
    };

    (async () => {
      try {
        if (userSession.isSignInPending()) {
          await userSession.handlePendingSignIn();
          finalize(walletType);
          return;
        }
        if (userSession.isUserSignedIn()) {
          finalize(walletType);
        }
      } catch (e) {
        console.error('Wallet pending sign-in error:', e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userSession]);

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
