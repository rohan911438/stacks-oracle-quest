import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, TrendingUp, User } from 'lucide-react';
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
    <div className="container mx-auto px-4 py-8">
      <Link to="/markets">
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Markets
        </Button>
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <Badge variant="secondary" className="mb-4">
              {market.category}
            </Badge>
            <h1 className="mb-6 text-3xl font-bold">{market.question}</h1>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Liquidity</div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="font-semibold">{formatCurrency(market.liquidity)}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Volume</div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="font-semibold">{formatCurrency(market.volume)}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Time Remaining</div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-semibold">{calculateTimeRemaining(market.endDate)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-muted p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <User className="h-4 w-4" />
                Oracle Address
              </div>
              <code className="text-xs break-all">{market.oracle}</code>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Price Chart</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-success">YES</span>
                  <span className="text-sm font-semibold text-success">{formatPrice(market.yesPrice)}</span>
                </div>
                <div className="h-4 rounded-full bg-success/20 overflow-hidden">
                  <div
                    className="h-full bg-success transition-all"
                    style={{ width: `${market.yesPrice * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-destructive">NO</span>
                  <span className="text-sm font-semibold text-destructive">{formatPrice(market.noPrice)}</span>
                </div>
                <div className="h-4 rounded-full bg-destructive/20 overflow-hidden">
                  <div
                    className="h-full bg-destructive transition-all"
                    style={{ width: `${market.noPrice * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {isResolved ? (
            <Card className="p-6">
              <Badge variant={market.resolvedOutcome === 'yes' ? 'default' : 'destructive'} className="mb-4">
                Market Resolved
              </Badge>
              <h3 className="mb-4 text-lg font-semibold">
                {market.resolvedOutcome === 'yes' ? 'YES' : 'NO'} won this market
              </h3>
              <Button onClick={handleRedeem} className="w-full">
                Redeem Winnings
              </Button>
            </Card>
          ) : (
            <>
              <Card className="p-6 border-success/20 bg-success/5">
                <h3 className="mb-4 text-lg font-semibold text-success">Buy YES</h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm text-muted-foreground">Amount (STX)</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={yesAmount}
                      onChange={(e) => setYesAmount(e.target.value)}
                    />
                  </div>
                  <div className="rounded-lg bg-success/10 p-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">You'll get</span>
                      <span className="font-semibold">
                        ~{yesAmount ? (parseFloat(yesAmount) / market.yesPrice).toFixed(2) : '0'} shares
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleTrade('yes', yesAmount)}
                    className="w-full bg-success hover:bg-success/90"
                  >
                    Buy YES
                  </Button>
                </div>
              </Card>

              <Card className="p-6 border-destructive/20 bg-destructive/5">
                <h3 className="mb-4 text-lg font-semibold text-destructive">Buy NO</h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm text-muted-foreground">Amount (STX)</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={noAmount}
                      onChange={(e) => setNoAmount(e.target.value)}
                    />
                  </div>
                  <div className="rounded-lg bg-destructive/10 p-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">You'll get</span>
                      <span className="font-semibold">
                        ~{noAmount ? (parseFloat(noAmount) / market.noPrice).toFixed(2) : '0'} shares
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleTrade('no', noAmount)}
                    className="w-full bg-destructive hover:bg-destructive/90"
                  >
                    Buy NO
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
