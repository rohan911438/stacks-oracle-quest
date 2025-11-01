import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, TrendingUp, User, BarChart3, Users, DollarSign, Info } from 'lucide-react';
import { mockMarkets, formatCurrency, calculateTimeRemaining, formatPrice } from '@/lib/mockData';
import { toast } from 'sonner';

const MarketDetail = () => {
  const { id } = useParams();
  const market = mockMarkets.find(m => m.id === id);
  const [yesAmount, setYesAmount] = useState('');
  const [noAmount, setNoAmount] = useState('');

  if (!market) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">Market not found</h1>
        <Link to="/markets">
          <Button>Back to Markets</Button>
        </Link>
      </div>
    );
  }

  const handleTrade = (outcome: 'yes' | 'no', amount: string) => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    toast.success(`Trade placed: ${amount} STX on ${outcome.toUpperCase()}`);
    if (outcome === 'yes') setYesAmount('');
    else setNoAmount('');
  };

  const handleRedeem = () => {
    toast.success('Winnings redeemed successfully!');
  };

  const isResolved = market.status === 'resolved';

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <Link to="/markets">
        <Button variant="ghost" className="mb-6 gap-2 hover:gap-3 transition-all">
          <ArrowLeft className="h-4 w-4" />
          Back to Markets
        </Button>
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Market Info Card */}
          <Card className="p-6 shadow-card animate-scale-in">
            <div className="flex items-start justify-between mb-4">
              <Badge variant="secondary" className="text-sm">
                {market.category}
              </Badge>
              {market.status === 'resolved' && (
                <Badge variant={market.resolvedOutcome === 'yes' ? 'default' : 'destructive'}>
                  {market.resolvedOutcome === 'yes' ? '✓ YES Won' : '✗ NO Won'}
                </Badge>
              )}
            </div>
            
            <h1 className="mb-6 text-3xl md:text-4xl font-bold leading-tight">{market.question}</h1>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-gradient-card p-4 border border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span>Liquidity</span>
                </div>
                <div className="text-xl font-bold">{formatCurrency(market.liquidity)}</div>
              </div>
              
              <div className="rounded-lg bg-gradient-card p-4 border border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span>Volume</span>
                </div>
                <div className="text-xl font-bold">{formatCurrency(market.volume)}</div>
              </div>
              
              <div className="rounded-lg bg-gradient-card p-4 border border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Time Left</span>
                </div>
                <div className="text-xl font-bold">{calculateTimeRemaining(market.endDate)}</div>
              </div>
              
              <div className="rounded-lg bg-gradient-card p-4 border border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>Status</span>
                </div>
                <div className="text-xl font-bold capitalize">{market.status}</div>
              </div>
            </div>

            {/* Oracle Info */}
            <div className="mt-6 rounded-lg bg-muted/50 p-4 border border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <User className="h-4 w-4" />
                <span className="font-medium">Oracle Address</span>
              </div>
              <code className="text-xs break-all bg-background px-2 py-1 rounded">{market.oracle}</code>
            </div>
          </Card>

          {/* Price Chart Card */}
          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Market Probability</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                <span>Real-time prices</span>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* YES Price */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-success" />
                    <span className="text-sm font-medium">YES</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-success">{formatPrice(market.yesPrice)}</div>
                    <div className="text-xs text-muted-foreground">{(market.yesPrice * 100).toFixed(1)}% probability</div>
                  </div>
                </div>
                <div className="relative h-6 rounded-full bg-success/20 overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-success transition-all duration-500 ease-out"
                    style={{ width: `${market.yesPrice * 100}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-success-foreground mix-blend-difference">
                    {(market.yesPrice * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* NO Price */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-destructive" />
                    <span className="text-sm font-medium">NO</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-destructive">{formatPrice(market.noPrice)}</div>
                    <div className="text-xs text-muted-foreground">{(market.noPrice * 100).toFixed(1)}% probability</div>
                  </div>
                </div>
                <div className="relative h-6 rounded-full bg-destructive/20 overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-destructive transition-all duration-500 ease-out"
                    style={{ width: `${market.noPrice * 100}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-destructive-foreground mix-blend-difference">
                    {(market.noPrice * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Trading Panel */}
        <div className="space-y-4">
          {isResolved ? (
            <Card className="p-6 shadow-glow animate-pulse-glow">
              <Badge variant={market.resolvedOutcome === 'yes' ? 'default' : 'destructive'} className="mb-4">
                Market Resolved
              </Badge>
              <h3 className="mb-4 text-lg font-semibold">
                {market.resolvedOutcome === 'yes' ? '✓ YES' : '✗ NO'} won this market
              </h3>
              <Button onClick={handleRedeem} className="w-full" size="lg">
                Redeem Winnings
              </Button>
            </Card>
          ) : (
            <>
              {/* Buy YES Card */}
              <Card className="p-6 border-success/30 bg-success/5 shadow-card hover:shadow-hover transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-success">Buy YES</h3>
                  <Badge variant="outline" className="border-success text-success">
                    {formatPrice(market.yesPrice)}
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-muted-foreground">
                      Amount (STX)
                    </label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={yesAmount}
                      onChange={(e) => setYesAmount(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  
                  <div className="rounded-lg bg-success/10 p-4 border border-success/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Estimated Shares</span>
                      <DollarSign className="h-4 w-4 text-success" />
                    </div>
                    <div className="text-2xl font-bold text-success">
                      {yesAmount ? (parseFloat(yesAmount) / market.yesPrice).toFixed(2) : '0.00'}
                    </div>
                    {yesAmount && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Potential win: {(parseFloat(yesAmount) / market.yesPrice).toFixed(2)} STX
                      </div>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => handleTrade('yes', yesAmount)}
                    className="w-full bg-success hover:bg-success/90 text-success-foreground"
                    size="lg"
                    disabled={!yesAmount || parseFloat(yesAmount) <= 0}
                  >
                    Buy YES Shares
                  </Button>
                </div>
              </Card>

              {/* Buy NO Card */}
              <Card className="p-6 border-destructive/30 bg-destructive/5 shadow-card hover:shadow-hover transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-destructive">Buy NO</h3>
                  <Badge variant="outline" className="border-destructive text-destructive">
                    {formatPrice(market.noPrice)}
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-muted-foreground">
                      Amount (STX)
                    </label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={noAmount}
                      onChange={(e) => setNoAmount(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                  
                  <div className="rounded-lg bg-destructive/10 p-4 border border-destructive/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Estimated Shares</span>
                      <DollarSign className="h-4 w-4 text-destructive" />
                    </div>
                    <div className="text-2xl font-bold text-destructive">
                      {noAmount ? (parseFloat(noAmount) / market.noPrice).toFixed(2) : '0.00'}
                    </div>
                    {noAmount && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Potential win: {(parseFloat(noAmount) / market.noPrice).toFixed(2)} STX
                      </div>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => handleTrade('no', noAmount)}
                    className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    size="lg"
                    disabled={!noAmount || parseFloat(noAmount) <= 0}
                  >
                    Buy NO Shares
                  </Button>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketDetail;
