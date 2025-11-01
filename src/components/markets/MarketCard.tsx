import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp } from 'lucide-react';
import { Market, formatCurrency, calculateTimeRemaining, formatPrice } from '@/lib/mockData';
import { Link } from 'react-router-dom';

interface MarketCardProps {
  market: Market;
}

const MarketCard = ({ market }: MarketCardProps) => {
  return (
    <Link to={`/market/${market.id}`}>
      <Card className="group cursor-pointer overflow-hidden border-border bg-gradient-card p-6 shadow-card transition-all hover:shadow-hover">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Badge variant="secondary" className="mb-2">
                {market.category}
              </Badge>
              <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
                {market.question}
              </h3>
            </div>
            {market.status === 'resolved' && (
              <Badge variant={market.resolvedOutcome === 'yes' ? 'default' : 'destructive'}>
                {market.resolvedOutcome === 'yes' ? 'YES Won' : 'NO Won'}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-success/10 p-3 border border-success/20">
              <div className="text-xs font-medium text-success mb-1">YES</div>
              <div className="text-2xl font-bold text-success">{formatPrice(market.yesPrice)}</div>
            </div>
            <div className="rounded-lg bg-destructive/10 p-3 border border-destructive/20">
              <div className="text-xs font-medium text-destructive mb-1">NO</div>
              <div className="text-2xl font-bold text-destructive">{formatPrice(market.noPrice)}</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Liquidity: {formatCurrency(market.liquidity)}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{calculateTimeRemaining(market.endDate)}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default MarketCard;
