import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp } from 'lucide-react';
import { Market, formatCurrency, calculateTimeRemaining, formatPrice } from '@/lib/mockData';
import { Link } from 'react-router-dom';

interface MarketCardProps {
  market: Market;
}

const MarketCard = ({ market }: MarketCardProps) => {
  const statusBadge = market.status === 'resolved' 
    ? <Badge variant={market.resolvedOutcome === 'yes' ? 'default' : 'destructive'} className="animate-scale-in">
        {market.resolvedOutcome === 'yes' ? '✓ YES Won' : '✗ NO Won'}
      </Badge>
    : market.status === 'pending'
    ? <Badge variant="outline" className="border-accent text-accent">Pending Resolution</Badge>
    : null;

  return (
    <Link to={`/market/${market.id}`}>
      <Card className="group cursor-pointer overflow-hidden border-border bg-gradient-card p-6 shadow-card transition-all duration-300 hover:shadow-hover hover:-translate-y-1 animate-fade-in">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {market.category}
                </Badge>
                {statusBadge}
              </div>
              <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {market.question}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative rounded-lg bg-success/10 p-4 border border-success/20 transition-all group-hover:bg-success/15 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-success opacity-0 group-hover:opacity-10 transition-opacity" />
              <div className="relative">
                <div className="text-xs font-medium text-success/70 mb-1 uppercase tracking-wide">YES</div>
                <div className="text-2xl font-bold text-success">{formatPrice(market.yesPrice)}</div>
              </div>
            </div>
            <div className="relative rounded-lg bg-destructive/10 p-4 border border-destructive/20 transition-all group-hover:bg-destructive/15 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-destructive opacity-0 group-hover:opacity-10 transition-opacity" />
              <div className="relative">
                <div className="text-xs font-medium text-destructive/70 mb-1 uppercase tracking-wide">NO</div>
                <div className="text-2xl font-bold text-destructive">{formatPrice(market.noPrice)}</div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border/50">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="font-medium">{formatCurrency(market.liquidity)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium">{calculateTimeRemaining(market.endDate)}</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Volume: {formatCurrency(market.volume)}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default MarketCard;
