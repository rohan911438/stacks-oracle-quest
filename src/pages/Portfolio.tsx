import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { mockUserPositions, formatCurrency } from '@/lib/mockData';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const Portfolio = () => {
  const totalInvested = mockUserPositions.reduce((sum, pos) => sum + pos.totalInvested, 0);
  const totalValue = mockUserPositions.reduce((sum, pos) => sum + pos.currentValue, 0);
  const totalPnL = totalValue - totalInvested;
  const pnlPercentage = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  const handleRedeem = (marketId: string) => {
    toast.success('Winnings redeemed successfully!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">Portfolio</h1>
        <p className="text-muted-foreground">Track your positions and earnings</p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <Card className="p-6 bg-gradient-card shadow-card">
          <div className="text-sm text-muted-foreground mb-1">Total Invested</div>
          <div className="text-3xl font-bold">{formatCurrency(totalInvested)}</div>
        </Card>
        <Card className="p-6 bg-gradient-card shadow-card">
          <div className="text-sm text-muted-foreground mb-1">Current Value</div>
          <div className="text-3xl font-bold">{formatCurrency(totalValue)}</div>
        </Card>
        <Card className="p-6 bg-gradient-card shadow-card">
          <div className="text-sm text-muted-foreground mb-1">Total P&L</div>
          <div className={`flex items-center gap-2 text-3xl font-bold ${totalPnL >= 0 ? 'text-success' : 'text-destructive'}`}>
            {totalPnL >= 0 ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
            {formatCurrency(Math.abs(totalPnL))}
            <span className="text-sm">({pnlPercentage.toFixed(1)}%)</span>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Your Positions</h2>
        {mockUserPositions.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">You don't have any positions yet.</p>
            <Link to="/markets">
              <Button>Browse Markets</Button>
            </Link>
          </Card>
        ) : (
          mockUserPositions.map((position) => (
            <Card key={position.marketId} className="p-6 shadow-card">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Badge variant="secondary" className="mb-2">
                      {position.market.category}
                    </Badge>
                    <Link to={`/market/${position.marketId}`}>
                      <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                        {position.market.question}
                      </h3>
                    </Link>
                  </div>
                  {position.market.status === 'resolved' && (
                    <Badge variant={position.market.resolvedOutcome === 'yes' ? 'default' : 'destructive'}>
                      {position.market.resolvedOutcome === 'yes' ? 'YES Won' : 'NO Won'}
                    </Badge>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">YES Shares</div>
                    <div className="font-semibold text-success">{position.yesShares}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">NO Shares</div>
                    <div className="font-semibold text-destructive">{position.noShares}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Invested</div>
                    <div className="font-semibold">{formatCurrency(position.totalInvested)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Current Value</div>
                    <div className="font-semibold">{formatCurrency(position.currentValue)}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">P&L:</span>
                    <span className={`font-semibold ${position.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {position.pnl >= 0 ? '+' : ''}{formatCurrency(position.pnl)}
                    </span>
                  </div>
                  {position.canRedeem && (
                    <Button onClick={() => handleRedeem(position.marketId)} size="sm">
                      Redeem Winnings
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Portfolio;
