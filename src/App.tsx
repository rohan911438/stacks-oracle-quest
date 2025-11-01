import { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import Markets from './pages/Markets';
import MarketDetail from './pages/MarketDetail';
import Portfolio from './pages/Portfolio';
import CreateMarket from './pages/CreateMarket';
import NotFound from './pages/NotFound';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ConnectWalletDialog from './components/wallet/ConnectWalletDialog';
import { toast } from 'sonner';

const queryClient = new QueryClient();

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [showWalletDialog, setShowWalletDialog] = useState(false);

  const handleConnectWallet = () => {
    setShowWalletDialog(true);
  };

  const handleWalletConnect = (wallet: 'leather' | 'xverse') => {
    const mockAddress =
      wallet === 'leather'
        ? 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7'
        : 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE';

    setWalletAddress(mockAddress);
    setIsConnected(true);
    setShowWalletDialog(false);

    toast.success(`Connected with ${wallet === 'leather' ? 'Leather' : 'Xverse'} Wallet`);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/markets"
              element={
                isConnected ? (
                  <div className="flex min-h-screen flex-col">
                    <Navbar
                      isConnected={isConnected}
                      walletAddress={walletAddress}
                      onConnectWallet={handleConnectWallet}
                    />
                    <main className="flex-1">
                      <Markets />
                    </main>
                    <Footer />
                  </div>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/market/:id"
              element={
                isConnected ? (
                  <div className="flex min-h-screen flex-col">
                    <Navbar
                      isConnected={isConnected}
                      walletAddress={walletAddress}
                      onConnectWallet={handleConnectWallet}
                    />
                    <main className="flex-1">
                      <MarketDetail />
                    </main>
                    <Footer />
                  </div>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/portfolio"
              element={
                isConnected ? (
                  <div className="flex min-h-screen flex-col">
                    <Navbar
                      isConnected={isConnected}
                      walletAddress={walletAddress}
                      onConnectWallet={handleConnectWallet}
                    />
                    <main className="flex-1">
                      <Portfolio />
                    </main>
                    <Footer />
                  </div>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/create"
              element={
                isConnected ? (
                  <div className="flex min-h-screen flex-col">
                    <Navbar
                      isConnected={isConnected}
                      walletAddress={walletAddress}
                      onConnectWallet={handleConnectWallet}
                    />
                    <main className="flex-1">
                      <CreateMarket />
                    </main>
                    <Footer />
                  </div>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ConnectWalletDialog
            open={showWalletDialog}
            onOpenChange={setShowWalletDialog}
            onConnect={handleWalletConnect}
          />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
