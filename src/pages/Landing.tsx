import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Lock, Zap } from 'lucide-react';
import MarketCard from '@/components/markets/MarketCard';
import { mockMarkets } from '@/lib/mockData';

interface LandingProps {
  onConnectWallet: () => void;
}

const Landing = ({ onConnectWallet }: LandingProps) => {
  const featuredMarkets = mockMarkets.filter(m => m.status === 'open').slice(0, 3);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-primary opacity-5" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              Decentralized Prediction Markets on{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">Stacks</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Trade on the outcomes of future events. Powered by Bitcoin's security through Stacks blockchain.
            </p>
            <Button onClick={onConnectWallet} size="lg" className="gap-2">
              Connect Wallet
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-gradient-card p-6 shadow-card">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Secure & Trustless</h3>
              <p className="text-muted-foreground">
                Built on Stacks, secured by Bitcoin. No intermediaries, fully decentralized.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-gradient-card p-6 shadow-card">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Real-Time Trading</h3>
              <p className="text-muted-foreground">
                Buy and sell shares instantly with automated market makers and deep liquidity.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-gradient-card p-6 shadow-card">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Low Fees</h3>
              <p className="text-muted-foreground">
                Minimal trading fees with fast finality. Create markets and trade efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold">Featured Markets</h2>
            <p className="text-muted-foreground">Trending prediction markets with high volume</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredMarkets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
