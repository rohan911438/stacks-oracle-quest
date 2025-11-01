import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Flame, Sparkles } from 'lucide-react';
import MarketCard from '@/components/markets/MarketCard';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

const Markets = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('liquidity');

  const { data: markets, isLoading } = useQuery({
    queryKey: ['markets', statusFilter, searchQuery, sortBy],
    queryFn: () => api.markets.list({ status: statusFilter, search: searchQuery, sort: sortBy }),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-2 text-4xl font-bold">Markets</h1>
          <p className="text-muted-foreground">Browse and trade on prediction markets</p>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs shadow-card"><Sparkles className="h-3.5 w-3.5 text-primary"/> New</div>
          <div className="flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs shadow-card"><Flame className="h-3.5 w-3.5 text-primary"/> Trending</div>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search markets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="liquidity">Most Liquid</SelectItem>
            <SelectItem value="volume">Highest Volume</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-muted-foreground">Loading markets…</div>
      ) : !markets || markets.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">No markets found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {markets.map((market: any) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Markets;
