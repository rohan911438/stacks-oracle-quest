export type TradeOutcome = 'yes' | 'no';

const json = (res: Response) => {
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};

export const api = {
  markets: {
    list: (params?: { status?: string; search?: string; sort?: string }) => {
      const url = new URL('/api/markets', window.location.origin);
      if (params?.status) url.searchParams.set('status', params.status);
      if (params?.search) url.searchParams.set('search', params.search);
      if (params?.sort) url.searchParams.set('sort', params.sort);
      return fetch(url.toString(), { credentials: 'omit' }).then(json);
    },
    get: (id: string) => fetch(`/api/markets/${id}`).then(json),
    create: (payload: any) =>
      fetch('/api/markets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then(json),
  },
  portfolio: {
    byWallet: (wallet: string) => fetch(`/api/portfolio/${wallet}`).then(json),
  },
  trades: {
    place: (payload: { walletAddress: string; marketId: string; outcome: TradeOutcome; amount: number }) =>
      fetch('/api/trades', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then(json),
  },
  redeem: (payload: { walletAddress: string; marketId: string }) =>
    fetch('/api/redeem', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then(json),
};
