import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Wallet, DollarSign, BarChart3, Trophy } from 'lucide-react';
import { formatCurrency } from '@/lib/mockData';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useWallet } from '@/lib/wallet';

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { walletAddress } = useWallet();
  const { data: positions, isLoading } = useQuery({
    queryKey: ['portfolio', walletAddress],
    queryFn: () => api.portfolio.byWallet(walletAddress!),
    enabled: !!walletAddress,
  });

  const totalInvested = (positions || []).reduce((sum: number, p: any) => sum + p.totalInvested, 0);
  const totalCurrentValue = (positions || []).reduce((sum: number, p: any) => sum + p.currentValue, 0);
  const totalPnL = totalCurrentValue - totalInvested;
  const pnlPercentage = totalInvested > 0 ? ((totalPnL / totalInvested) * 100) : 0;
  const activePositions = (positions || []).filter((p: any) => !p.canRedeem);
  const redeemablePositions = (positions || []).filter((p: any) => p.canRedeem);

  const handleRedeem = (marketId: string) => {
    toast.success('Winnings redeemed successfully!');
  };

  const displayPositions = activeTab === 'all' 
    ? (positions || []) 
    : activeTab === 'active' 
    ? activePositions 
    : redeemablePositions;

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">Portfolio</h1>
        <p className="text-muted-foreground">Track your positions and earnings</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="p-6 shadow-card hover:shadow-hover transition-all animate-scale-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Total Invested</span>
            </div>
          </div>
          <div className="text-3xl font-bold">{formatCurrency(totalInvested)}</div>
        </Card>

        <Card className="p-6 shadow-card hover:shadow-hover transition-all animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Current Value</span>
            </div>
          </div>
          <div className="text-3xl font-bold">{formatCurrency(totalCurrentValue)}</div>
        </Card>

        <Card className={`p-6 shadow-card hover:shadow-hover transition-all animate-scale-in ${totalPnL >= 0 ? 'border-success/50' : 'border-destructive/50'}`} style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${totalPnL >= 0 ? 'bg-success/10' : 'bg-destructive/10'}`}>
                {totalPnL >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-success" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-destructive" />
                )}
              </div>
              <span className="text-sm text-muted-foreground">Total P&L</span>
            </div>
          </div>
          <div className={`text-3xl font-bold ${totalPnL >= 0 ? 'text-success' : 'text-destructive'}`}>
            {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}
          </div>
          <div className={`text-sm mt-1 ${totalPnL >= 0 ? 'text-success' : 'text-destructive'}`}>
            {pnlPercentage >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%
          </div>
        </Card>

        <Card className="p-6 shadow-card hover:shadow-hover transition-all animate-scale-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Active Markets</span>
            </div>
          </div>
          <div className="text-3xl font-bold">{activePositions.length}</div>
          <div className="text-sm text-muted-foreground mt-1">
            {redeemablePositions.length} redeemable
          </div>
        </Card>
      </div>

      {/* Positions List */}
      <Card className="p-6 shadow-card">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Your Positions</h2>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="redeemable">Redeemable</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="py-16 text-center text-muted-foreground">Loading positions…</div>
            ) : displayPositions.length === 0 ? (
              <div className="py-16 text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground mb-4">
                  {activeTab === 'redeemable' 
                    ? 'No positions ready to redeem' 
                    : 'No positions found'}
                </p>
                <Link to="/markets">
                  <Button>Browse Markets</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {displayPositions.map((position) => (
                  <Card
                    key={position.marketId}
                    className={`p-6 border transition-all hover:shadow-hover ${
                      position.canRedeem ? 'border-success/30 bg-success/5 animate-pulse-glow' : 'border-border'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                      {/* Market Info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <Badge variant="secondary" className="mb-2">
                              {position.market.category}
                            </Badge>
                            <h3 className="text-lg font-semibold leading-tight">
                              {position.market.question}
                            </h3>
                          </div>
                          {position.market.status === 'resolved' && (
                            <Badge variant={position.market.resolvedOutcome === 'yes' ? 'default' : 'destructive'}>
                              {position.market.resolvedOutcome === 'yes' ? '✓ YES Won' : '✗ NO Won'}
                            </Badge>
                          )}
                        </div>

                        {/* Shares */}
                        <div className="flex gap-4 text-sm">
                          {position.yesShares > 0 && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 border border-success/20">
                              <span className="text-success font-medium">YES:</span>
                              <span className="font-semibold">{position.yesShares} shares</span>
                            </div>
                          )}
                          {position.noShares > 0 && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/10 border border-destructive/20">
                              <span className="text-destructive font-medium">NO:</span>
                              <span className="font-semibold">{position.noShares} shares</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex flex-wrap lg:flex-nowrap gap-6 lg:gap-8">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Invested</div>
                          <div className="text-lg font-semibold">{formatCurrency(position.totalInvested)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Current Value</div>
                          <div className="text-lg font-semibold">{formatCurrency(position.currentValue)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">P&L</div>
                          <div className={`text-lg font-bold ${position.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {position.pnl >= 0 ? '+' : ''}{formatCurrency(position.pnl)}
                          </div>
                          <div className={`text-xs ${position.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {position.pnl >= 0 ? '+' : ''}
                            {((position.pnl / position.totalInvested) * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div className="flex items-center">
                          {position.canRedeem ? (
                            <Button
                              onClick={() => handleRedeem(position.marketId)}
                              className="bg-success hover:bg-success/90 text-success-foreground"
                            >
                              Redeem
                            </Button>
                          ) : (
                            <Link to={`/market/${position.marketId}`}>
                              <Button variant="outline">View Market</Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Portfolio;
