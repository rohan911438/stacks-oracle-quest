export type TradeOutcome = 'yes' | 'no';

const json = (res: Response) => {
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};

// Optional override for API base, e.g. https://api.example.com
const API_BASE = (import.meta as any)?.env?.VITE_API_URL?.replace(/\/$/, '') || '';
const withBase = (path: string) => (API_BASE ? `${API_BASE}${path}` : path);

export const api = {
  markets: {
    list: (params?: { status?: string; search?: string; sort?: string }) => {
      const url = new URL(withBase('/api/markets'), typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
      if (params?.status) url.searchParams.set('status', params.status);
      if (params?.search) url.searchParams.set('search', params.search);
      if (params?.sort) url.searchParams.set('sort', params.sort);
      return fetch(url.toString(), { credentials: 'omit' }).then(json);
    },
    get: (id: string) => fetch(withBase(`/api/markets/${id}`)).then(json),
    create: (payload: any) =>
      fetch(withBase('/api/markets'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then(json),
  },
  portfolio: {
    byWallet: (wallet: string) => fetch(withBase(`/api/portfolio/${wallet}`)).then(json),
  },
  trades: {
    place: (payload: { walletAddress: string; marketId: string; outcome: TradeOutcome; amount: number }) =>
      fetch(withBase('/api/trades'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then(json),
  },
  redeem: (payload: { walletAddress: string; marketId: string }) =>
    fetch(withBase('/api/redeem'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then(json),
};
