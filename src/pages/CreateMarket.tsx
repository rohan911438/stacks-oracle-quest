import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const CreateMarket = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [endDate, setEndDate] = useState<Date>();
  const [oracleAddress, setOracleAddress] = useState('');
  const [collateral, setCollateral] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question || !endDate || !oracleAddress || !collateral) {
      toast.error('Please fill in all fields');
      return;
    }

    toast.success('Market created successfully!', {
      description: 'Your market is now live and ready for trading.',
    });

    setTimeout(() => {
      navigate('/markets');
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Create Market</h1>
          <p className="text-muted-foreground">Set up a new prediction market</p>
        </div>

        <Card className="p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="question">Market Question</Label>
              <Textarea
                id="question"
                placeholder="Will Bitcoin exceed $100,000 by December 2025?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={3}
                required
              />
              <p className="text-xs text-muted-foreground">
                Make your question clear and unambiguous. It should be answerable with YES or NO.
              </p>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                The date when trading ends and the market can be resolved.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="oracle">Oracle Address</Label>
              <Input
                id="oracle"
                placeholder="SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7"
                value={oracleAddress}
                onChange={(e) => setOracleAddress(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Stacks address that will resolve the market outcome.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="collateral">Initial Liquidity (STX)</Label>
              <Input
                id="collateral"
                type="number"
                placeholder="1000"
                value={collateral}
                onChange={(e) => setCollateral(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Amount of STX to provide as initial liquidity for the market.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium mb-1">Market Creation Fee</p>
                  <p className="text-muted-foreground">
                    Creating a market requires a small fee to prevent spam. Your initial liquidity will be
                    locked until the market is resolved.
                  </p>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Create Market
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateMarket;
