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
      <section className="relative overflow-hidden py-20 md:py-32 animate-fade-in">
        <div className="absolute inset-0 bg-gradient-primary opacity-5" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl animate-pulse-glow" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        </div>
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center space-y-8">
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl animate-scale-in">
              Decentralized Prediction Markets on{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">Stacks</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Trade on the outcomes of future events. Powered by Bitcoin's security through Stacks blockchain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button onClick={onConnectWallet} size="lg" className="gap-2 shadow-glow">
                Connect Wallet
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="group rounded-xl border border-border bg-gradient-card p-6 shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 animate-fade-in">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary group-hover:shadow-glow transition-all">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold group-hover:text-primary transition-colors">Secure & Trustless</h3>
              <p className="text-muted-foreground">
                Built on Stacks, secured by Bitcoin. No intermediaries, fully decentralized.
              </p>
            </div>
            <div className="group rounded-xl border border-border bg-gradient-card p-6 shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary group-hover:shadow-glow transition-all">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold group-hover:text-primary transition-colors">Real-Time Trading</h3>
              <p className="text-muted-foreground">
                Buy and sell shares instantly with automated market makers and deep liquidity.
              </p>
            </div>
            <div className="group rounded-xl border border-border bg-gradient-card p-6 shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary group-hover:shadow-glow transition-all">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold group-hover:text-primary transition-colors">Low Fees</h3>
              <p className="text-muted-foreground">
                Minimal trading fees with fast finality. Create markets and trade efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center animate-fade-in">
            <h2 className="mb-3 text-3xl md:text-4xl font-bold">Featured Markets</h2>
            <p className="text-muted-foreground text-lg">Trending prediction markets with high volume</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredMarkets.map((market, index) => (
              <div key={market.id} style={{ animationDelay: `${index * 0.1}s` }}>
                <MarketCard market={market} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
