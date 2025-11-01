// Simple in-memory store with seed data and naive pricing updates
import { nanoid } from 'nanoid';

const markets = [
  {
    id: '1',
    question: 'Will Bitcoin exceed $100,000 by December 2025?',
    yesPrice: 0.68,
    noPrice: 0.32,
    liquidity: 2500000,
    endDate: new Date('2025-12-31').toISOString(),
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
    endDate: new Date('2025-06-30').toISOString(),
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
    endDate: new Date('2025-03-15').toISOString(),
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
    endDate: new Date('2025-12-31').toISOString(),
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
    endDate: new Date('2025-12-31').toISOString(),
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
    endDate: new Date('2025-01-31').toISOString(),
    oracle: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
    status: 'resolved',
    resolvedOutcome: 'yes',
    volume: 1200000,
    category: 'Crypto',
  },
];

// Map of walletAddress -> positions array
const portfolios = new Map();

export function getMarkets({ status, search, sort }) {
  let res = [...markets];
  if (status && status !== 'all') res = res.filter(m => m.status === status);
  if (search) res = res.filter(m => m.question.toLowerCase().includes(search.toLowerCase()));
  if (sort === 'liquidity') res.sort((a,b)=>b.liquidity-a.liquidity);
  if (sort === 'volume') res.sort((a,b)=>b.volume-a.volume);
  if (sort === 'newest') res.sort((a,b)=>new Date(b.endDate)-new Date(a.endDate));
  return res;
}

export function getMarket(id) {
  return markets.find(m => m.id === id) || null;
}

export function createMarket(input) {
  const id = nanoid(8);
  const market = {
    id,
    question: input.question,
    yesPrice: 0.5,
    noPrice: 0.5,
    liquidity: Number(input.liquidity) || 1000,
    endDate: new Date(input.endDate).toISOString(),
    oracle: input.oracle,
    status: 'open',
    volume: 0,
    category: input.category || 'Other',
  };
  markets.push(market);
  return market;
}

export function getPortfolio(walletAddress) {
  const positions = portfolios.get(walletAddress) || [];
  return positions;
}

function ensurePortfolio(walletAddress) {
  if (!portfolios.has(walletAddress)) portfolios.set(walletAddress, []);
  return portfolios.get(walletAddress);
}

export function trade({ walletAddress, marketId, outcome, amount }) {
  const market = getMarket(marketId);
  if (!market || market.status !== 'open') throw new Error('Market not tradable');
  const amt = Number(amount);
  if (!(amt > 0)) throw new Error('Invalid amount');

  // naive price update: nudge price toward outcome by small factor of amount
  const nudge = Math.min(0.15, amt / 10000); // cap nudge
  if (outcome === 'yes') {
    market.yesPrice = Math.min(0.98, market.yesPrice + nudge);
  } else {
    market.yesPrice = Math.max(0.02, market.yesPrice - nudge);
  }
  market.noPrice = Number((1 - market.yesPrice).toFixed(2));
  market.yesPrice = Number(market.yesPrice.toFixed(2));
  market.volume += amt;

  // update portfolio position
  const positions = ensurePortfolio(walletAddress);
  let pos = positions.find(p => p.marketId === marketId);
  if (!pos) {
    pos = {
      marketId,
      market,
      yesShares: 0,
      noShares: 0,
      totalInvested: 0,
      currentValue: 0,
      pnl: 0,
      canRedeem: false,
    };
    positions.push(pos);
  }
  const shares = outcome === 'yes' ? amt / Math.max(market.yesPrice, 0.01) : amt / Math.max(market.noPrice, 0.01);
  if (outcome === 'yes') pos.yesShares += shares; else pos.noShares += shares;
  pos.totalInvested += amt;
  // simple current value calc
  pos.currentValue = pos.yesShares * market.yesPrice + pos.noShares * market.noPrice;
  pos.pnl = pos.currentValue - pos.totalInvested;

  return { market, position: pos };
}

export function redeem({ walletAddress, marketId }) {
  const market = getMarket(marketId);
  if (!market || market.status !== 'resolved') throw new Error('Market not resolved');
  const positions = ensurePortfolio(walletAddress);
  const pos = positions.find(p => p.marketId === marketId);
  if (!pos) throw new Error('No position');
  pos.canRedeem = false; // simulate redeemed
  return { success: true };
}

// ESM exports above
