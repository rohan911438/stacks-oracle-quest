import { useEffect, useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Index from './pages/Index';
import Markets from './pages/Markets';
import MarketDetail from './pages/MarketDetail';
import Portfolio from './pages/Portfolio';
import CreateMarket from './pages/CreateMarket';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ConnectWalletDialog from './components/wallet/ConnectWalletDialog';
import { toast } from 'sonner';
import { WalletProvider, useWallet } from './lib/wallet';

const queryClient = new QueryClient();

const Shell = () => {
  const { isConnected, connect } = useWallet();
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleConnectWallet = () => setShowWalletDialog(true);

  const handleWalletConnect = async (wallet: 'leather' | 'xverse') => {
    const ok = await connect(wallet);
    setShowWalletDialog(false);
    if (ok) {
      toast.success(`Connected with ${wallet === 'leather' ? 'Leather' : 'Xverse'} Wallet`);
      navigate('/dashboard');
    } else {
      toast.message('Wallet not detected', {
        description: `We opened the ${wallet === 'leather' ? 'Leather' : 'Xverse'} site in a new tab to install it. Come back here to connect after installing.`,
      });
    }
  };

  const Protected = ({ children }: { children: React.ReactNode }) =>
    isConnected ? (
      <div className="flex min-h-screen flex-col">
        <Navbar onConnectWallet={handleConnectWallet} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    ) : (
      <Navigate to="/" replace />
    );

  return (
    <>
      <Routes>
        <Route path="/" element={<Index onConnectWallet={handleConnectWallet} />} />
        <Route
          path="/dashboard"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route
          path="/markets"
          element={
            <Protected>
              <Markets />
            </Protected>
          }
        />
        <Route
          path="/market/:id"
          element={
            <Protected>
              <MarketDetail />
            </Protected>
          }
        />
        <Route
          path="/portfolio"
          element={
            <Protected>
              <Portfolio />
            </Protected>
          }
        />
        <Route
          path="/create"
          element={
            <Protected>
              <CreateMarket />
            </Protected>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ConnectWalletDialog
        open={showWalletDialog}
        onOpenChange={setShowWalletDialog}
        onConnect={handleWalletConnect}
      />
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <WalletProvider>
            <Shell />
          </WalletProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
