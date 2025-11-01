import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TrendingUp, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWallet } from '@/lib/wallet';

interface NavbarProps {
  onConnectWallet: () => void;
}

const Navbar = ({ onConnectWallet }: NavbarProps) => {
  const { isConnected, walletAddress } = useWallet();
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard', requiresWallet: true },
    { label: 'Markets', path: '/markets', requiresWallet: true },
    { label: 'Portfolio', path: '/portfolio', requiresWallet: true },
    { label: 'Create Market', path: '/create', requiresWallet: true },
  ];

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">OracleQuest</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              if (item.requiresWallet && !isConnected) return null;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    className={cn(
                      'text-muted-foreground hover:text-foreground',
                      location.pathname === item.path && 'bg-secondary text-foreground'
                    )}
                  >
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          <div>
            {isConnected ? (
              <Button variant="outline" className="gap-2">
                <Wallet className="h-4 w-4" />
                {walletAddress && formatAddress(walletAddress)}
              </Button>
            ) : (
              <Button onClick={onConnectWallet} className="gap-2">
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
