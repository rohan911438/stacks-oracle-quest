import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { getMarkets, getMarket, createMarket, getPortfolio, trade, redeem } from './store.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.get('/api/markets', (req, res) => {
  const { status = 'all', search = '', sort = 'liquidity' } = req.query;
  res.json(getMarkets({ status, search, sort }));
});

app.get('/api/markets/:id', (req, res) => {
  const m = getMarket(req.params.id);
  if (!m) return res.status(404).json({ error: 'Not found' });
  res.json(m);
});

app.post('/api/markets', (req, res) => {
  try {
    const created = createMarket(req.body || {});
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/api/portfolio/:wallet', (req, res) => {
  res.json(getPortfolio(req.params.wallet));
});

app.post('/api/trades', (req, res) => {
  try {
    const { walletAddress, marketId, outcome, amount } = req.body || {};
    const result = trade({ walletAddress, marketId, outcome, amount });
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/redeem', (req, res) => {
  try {
    const { walletAddress, marketId } = req.body || {};
    const result = redeem({ walletAddress, marketId });
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
