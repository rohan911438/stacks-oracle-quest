import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Landing from './Landing';
import ConnectWalletDialog from '@/components/wallet/ConnectWalletDialog';
import { toast } from 'sonner';

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [showWalletDialog, setShowWalletDialog] = useState(false);

  const handleConnectWallet = () => {
    setShowWalletDialog(true);
  };

  const handleWalletConnect = (wallet: 'leather' | 'xverse') => {
    const mockAddress = wallet === 'leather' 
      ? 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7'
      : 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE';
    
    setWalletAddress(mockAddress);
    setIsConnected(true);
    setShowWalletDialog(false);
    
    toast.success(`Connected with ${wallet === 'leather' ? 'Leather' : 'Xverse'} Wallet`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        isConnected={isConnected}
        walletAddress={walletAddress}
        onConnectWallet={handleConnectWallet}
      />
      <main className="flex-1">
        <Landing onConnectWallet={handleConnectWallet} />
      </main>
      <Footer />
      <ConnectWalletDialog
        open={showWalletDialog}
        onOpenChange={setShowWalletDialog}
        onConnect={handleWalletConnect}
      />
    </div>
  );
};

export default Index;
