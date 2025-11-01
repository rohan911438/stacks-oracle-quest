import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BarChart3, ShoppingBag, PlusCircle, Wallet, Sparkles } from 'lucide-react';
import MarketCard from '@/components/markets/MarketCard';
import { formatCurrency } from '@/lib/mockData';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useWallet } from '@/lib/wallet';

const Dashboard = () => {
  const { walletAddress } = useWallet();
  const { data: markets } = useQuery({ queryKey: ['markets', 'open', '', 'liquidity'], queryFn: () => api.markets.list({ status: 'open', sort: 'liquidity' }) });
  const featured = (markets || []).slice(0, 3);
  const { data: positions } = useQuery({ queryKey: ['portfolio', walletAddress], queryFn: () => api.portfolio.byWallet(walletAddress!), enabled: !!walletAddress });
  const invested = (positions || []).reduce((s: number, p: any) => s + p.totalInvested, 0);
  const current = (positions || []).reduce((s: number, p: any) => s + p.currentValue, 0);
  const pnl = current - invested;

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="mb-2 text-3xl md:text-4xl font-bold">Welcome to OracleQuest</h1>
            <p className="text-muted-foreground">Your hub for decentralized prediction markets</p>
          </div>
          <div className="flex gap-2">
            <Link to="/create"><Button className="gap-2"><PlusCircle className="h-4 w-4"/>Create Market</Button></Link>
            <Link to="/markets"><Button variant="outline" className="gap-2"><ShoppingBag className="h-4 w-4"/>Browse Markets</Button></Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="p-6 shadow-card">
          <div className="text-sm text-muted-foreground mb-1">Total Invested</div>
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary"/>
            <div className="text-2xl font-bold">{formatCurrency(invested)}</div>
          </div>
        </Card>
        <Card className="p-6 shadow-card">
          <div className="text-sm text-muted-foreground mb-1">Current Value</div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary"/>
            <div className="text-2xl font-bold">{formatCurrency(current)}</div>
          </div>
        </Card>
        <Card className="p-6 shadow-card">
          <div className="text-sm text-muted-foreground mb-1">P&L</div>
          <div className={`text-2xl font-bold ${pnl >= 0 ? 'text-success' : 'text-destructive'}`}>{pnl >= 0 ? '+' : ''}{formatCurrency(pnl)}</div>
        </Card>
        <Card className="p-6 shadow-card">
          <div className="text-sm text-muted-foreground mb-1">Active Positions</div>
          <div className="text-2xl font-bold">{(positions || []).filter((p: any)=>!p.canRedeem).length}</div>
        </Card>
      </div>

      {/* Quick actions */}
      <Card className="p-6 mb-8 bg-gradient-card border-border shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><Sparkles className="h-5 w-5 text-primary"/></div>
            <div>
              <div className="font-semibold">Get started in seconds</div>
              <div className="text-sm text-muted-foreground">Create a market or explore trending ones</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/markets"><Button variant="outline">Explore Markets</Button></Link>
            <Link to="/create"><Button>Create Market</Button></Link>
          </div>
        </div>
      </Card>

      {/* Featured */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Featured Markets</h2>
        <Link to="/markets"><Button variant="ghost">See all</Button></Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((m: any) => (
          <MarketCard key={m.id} market={m} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
