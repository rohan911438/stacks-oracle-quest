import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, TrendingUp, DollarSign, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

const CreateMarket = () => {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('');
  const [endDate, setEndDate] = useState<Date>();
  const [oracle, setOracle] = useState('');
  const [liquidity, setLiquidity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const createMutation = useMutation({
    mutationFn: () => api.markets.create({
      question,
      category,
      endDate,
      oracle,
      liquidity: parseFloat(liquidity),
    }),
    onSuccess: (created: any) => {
      toast.success('Market created successfully!', {
        description: `Question: ${question.substring(0, 50)}...`,
      });
      navigate(`/market/${created.id}`);
    },
    onError: (e: any) => toast.error(e?.message || 'Create failed'),
    onSettled: () => setIsSubmitting(false),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!question.trim()) {
      toast.error('Please enter a market question');
      return;
    }
    if (question.length < 10) {
      toast.error('Question must be at least 10 characters long');
      return;
    }
    if (!category) {
      toast.error('Please select a category');
      return;
    }
    if (!endDate) {
      toast.error('Please select an end date');
      return;
    }
    if (!oracle.trim()) {
      toast.error('Please enter an oracle address');
      return;
    }
    if (!liquidity || parseFloat(liquidity) <= 0) {
      toast.error('Please enter a valid liquidity amount');
      return;
    }

    setIsSubmitting(true);
    createMutation.mutate();
  };

  const isFormValid = question && category && endDate && oracle && liquidity;

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Create New Market</h1>
          <p className="text-muted-foreground">Set up a new prediction market and start trading</p>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 bg-gradient-card border-border shadow-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Min Liquidity</div>
                <div className="text-sm font-semibold">100 STX</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-card border-border shadow-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Creation Fee</div>
                <div className="text-sm font-semibold">10 STX</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-card border-border shadow-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Resolution</div>
                <div className="text-sm font-semibold">Oracle-based</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Form */}
        <Card className="p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question */}
            <div className="space-y-2">
              <Label htmlFor="question" className="text-base font-semibold">
                Market Question *
              </Label>
              <Textarea
                id="question"
                placeholder="Will Bitcoin exceed $100,000 by December 2025?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[100px] text-base"
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Make your question clear and specific with a yes/no answer
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-base font-semibold">
                Category *
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crypto">Crypto</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="tech">Tech</SelectItem>
                  <SelectItem value="climate">Climate</SelectItem>
                  <SelectItem value="politics">Politics</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">
                Market End Date *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Markets must end at a future date
              </p>
            </div>

            {/* Oracle Address */}
            <div className="space-y-2">
              <Label htmlFor="oracle" className="text-base font-semibold">
                Oracle Address *
              </Label>
              <Input
                id="oracle"
                placeholder="SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7"
                value={oracle}
                onChange={(e) => setOracle(e.target.value)}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                The oracle will resolve this market based on real-world outcomes
              </p>
            </div>

            {/* Initial Liquidity */}
            <div className="space-y-2">
              <Label htmlFor="liquidity" className="text-base font-semibold">
                Initial Liquidity (STX) *
              </Label>
              <div className="relative">
                <Input
                  id="liquidity"
                  type="number"
                  placeholder="1000"
                  value={liquidity}
                  onChange={(e) => setLiquidity(e.target.value)}
                  className="text-base pl-10"
                  min="100"
                  step="10"
                />
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Minimum 100 STX required. Higher liquidity attracts more traders
              </p>
            </div>

            {/* Summary */}
            {isFormValid && (
              <Card className="p-4 bg-primary/5 border-primary/20 animate-scale-in">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <div className="font-semibold">Ready to Create</div>
                    <div className="text-sm text-muted-foreground">
                      You'll deposit {liquidity} STX as initial liquidity + 10 STX creation fee
                    </div>
                    <div className="text-sm font-semibold text-primary">
                      Total: {parseFloat(liquidity || '0') + 10} STX
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-pulse">Creating Market...</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Create Market
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateMarket;
