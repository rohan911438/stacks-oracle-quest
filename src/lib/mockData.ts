export interface Market {
  id: string;
  question: string;
  yesPrice: number;
  noPrice: number;
  liquidity: number;
  endDate: Date;
  oracle: string;
  status: 'open' | 'pending' | 'resolved';
  resolvedOutcome?: 'yes' | 'no';
  volume: number;
  category: string;
}

export interface UserPosition {
  marketId: string;
  market: Market;
  yesShares: number;
  noShares: number;
  totalInvested: number;
  currentValue: number;
  pnl: number;
  canRedeem: boolean;
}

export const mockMarkets: Market[] = [
  {
    id: '1',
    question: 'Will Bitcoin exceed $100,000 by December 2025?',
    yesPrice: 0.68,
    noPrice: 0.32,
    liquidity: 2500000,
    endDate: new Date('2025-12-31'),
    oracle: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
    status: 'open',
    volume: 8450000,
    category: 'Crypto',
  },
  {
    id: '2',
    question: 'Will Ethereum merge to proof-of-stake in Q2 2025?',
    yesPrice: 0.42,
    noPrice: 0.58,
    liquidity: 1800000,
    endDate: new Date('2025-06-30'),
    oracle: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
    status: 'open',
    volume: 3200000,
    category: 'Crypto',
  },
  {
    id: '3',
    question: 'Will the US Fed raise interest rates in March 2025?',
    yesPrice: 0.75,
    noPrice: 0.25,
    liquidity: 4200000,
    endDate: new Date('2025-03-15'),
    oracle: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
    status: 'open',
    volume: 12000000,
    category: 'Finance',
  },
  {
    id: '4',
    question: 'Will Apple release a VR headset in 2025?',
    yesPrice: 0.55,
    noPrice: 0.45,
    liquidity: 950000,
    endDate: new Date('2025-12-31'),
    oracle: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
    status: 'open',
    volume: 2100000,
    category: 'Tech',
  },
  {
    id: '5',
    question: 'Will global temperatures rise by 1.5°C by end of 2025?',
    yesPrice: 0.38,
    noPrice: 0.62,
    liquidity: 720000,
    endDate: new Date('2025-12-31'),
    oracle: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
    status: 'open',
    volume: 1500000,
    category: 'Climate',
  },
  {
    id: '6',
    question: 'Did Bitcoin reach $50k in January 2025?',
    yesPrice: 1.0,
    noPrice: 0.0,
    liquidity: 500000,
    endDate: new Date('2025-01-31'),
    oracle: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
    status: 'resolved',
    resolvedOutcome: 'yes',
    volume: 1200000,
    category: 'Crypto',
  },
];

export const mockUserPositions: UserPosition[] = [
  {
    marketId: '1',
    market: mockMarkets[0],
    yesShares: 1200,
    noShares: 0,
    totalInvested: 720,
    currentValue: 816,
    pnl: 96,
    canRedeem: false,
  },
  {
    marketId: '3',
    market: mockMarkets[2],
    yesShares: 0,
    noShares: 800,
    totalInvested: 240,
    currentValue: 200,
    pnl: -40,
    canRedeem: false,
  },
  {
    marketId: '6',
    market: mockMarkets[5],
    yesShares: 500,
    noShares: 0,
    totalInvested: 300,
    currentValue: 500,
    pnl: 200,
    canRedeem: true,
  },
];

export const formatCurrency = (amount: number): string => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(2)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toFixed(2)}`;
};

export const formatPrice = (price: number): string => {
  return `${(price * 100).toFixed(0)}¢`;
};

export const calculateTimeRemaining = (endDate: Date): string => {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  
  if (diff <= 0) return 'Ended';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
};
