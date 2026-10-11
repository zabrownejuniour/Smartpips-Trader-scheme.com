import { CurrencyPair, Candle, TechnicalIndicators, ScanResult } from '../types.ts';
import { INITIAL_PAIRS } from '../data/forexPairs.ts';

export async function fetchLiveQuotes(): Promise<CurrencyPair[]> {
  try {
    const res = await fetch('/api/forex/quotes');
    if (!res.ok) throw new Error('Failed to fetch quotes');
    const data = await res.json();
    return data.quotes || INITIAL_PAIRS;
  } catch (err) {
    console.warn('API fetch quotes fallback:', err);
    return INITIAL_PAIRS;
  }
}

export async function fetchCandles(pairKey: string, timeframe: string): Promise<{
  candles: Candle[];
  indicators: TechnicalIndicators;
  currentPrice: number;
  decimals: number;
  pipSize: number;
}> {
  try {
    const res = await fetch(`/api/forex/candles?pair=${pairKey}&timeframe=${timeframe}`);
    if (!res.ok) throw new Error('Failed to fetch candles');
    const data = await res.json();
    return {
      candles: data.candles,
      indicators: data.indicators,
      currentPrice: data.currentPrice,
      decimals: data.decimals || 5,
      pipSize: data.pipSize || 0.0001,
    };
  } catch (err) {
    console.warn('API fetch candles fallback:', err);
    throw err;
  }
}

export async function scanMarketChart(pairKey: string, timeframe: string): Promise<{
  analysis: ScanResult;
  indicators: TechnicalIndicators;
  currentPrice: number;
}> {
  try {
    const res = await fetch('/api/forex/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pairKey, timeframe }),
    });
    if (!res.ok) throw new Error('Failed to run AI scan');
    const data = await res.json();
    return {
      analysis: data.analysis,
      indicators: data.indicators,
      currentPrice: data.currentPrice,
    };
  } catch (err) {
    console.warn('API scan fallback:', err);
    throw err;
  }
}

export async function createSubscription(params: {
  userId: string;
  email: string;
  paymentMethod?: 'card' | 'bank_transfer' | 'mpesa' | 'airtel_money' | 'mobile_money' | 'crypto';
  transferReference?: string;
  phone?: string;
  transactionCode?: string;
  senderName?: string;
  bankAccountNumber?: string;
} | string, emailFallback?: string) {
  const payload = typeof params === 'string'
    ? { userId: params, email: emailFallback, paymentMethod: 'card' }
    : params;

  const res = await fetch('/api/subscription/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function requestMobileMoneyPush(phone: string, provider: 'mpesa' | 'airtel_money', userId?: string) {
  const res = await fetch('/api/subscription/mobile-money/stk-push', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, provider, amount: 5.0, userId }),
  });
  return res.json();
}

export async function fetchOwnerBankDetails() {
  try {
    const res = await fetch('/api/subscription/bank-details');
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch bank details:', err);
    return {
      success: true,
      bankDetails: {
        bankName: 'Postbank (Kenya Post Office Savings Bank)',
        paybillNumber: '200999',
        accountNumber: '0109060094245',
        beneficiary: 'zabrowne4@gmail.com',
      },
    };
  }
}

export async function cancelSubscription(subscriptionId: string) {
  const res = await fetch('/api/subscription/cancel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscriptionId }),
  });
  return res.json();
}

// User Authentication (Registration & Login)
export async function registerAccount(params: {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  preferredPlatform?: 'MT5' | 'POCKET_OPTION' | 'DERIV' | 'ALL' | 'BOTH';
}) {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch (err: any) {
    console.warn('API register fallback to client:', err);
    const now = Date.now();
    return {
      success: true,
      user: {
        id: 'usr_' + Math.random().toString(36).substring(2, 10),
        email: params.email,
        fullName: params.fullName,
        phone: params.phone,
        createdAt: now,
        trialStartAt: now,
        trialExpiresAt: now + 7 * 24 * 60 * 60 * 1000,
        subscriptionStatus: 'trial',
        bridgedPlatform: params.preferredPlatform || 'BOTH',
      },
    };
  }
}

export async function loginAccount(params: { email: string; password: string }) {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch (err: any) {
    console.warn('API login fallback to client:', err);
    const now = Date.now();
    return {
      success: true,
      user: {
        id: 'usr_' + Math.random().toString(36).substring(2, 10),
        email: params.email,
        fullName: params.email.split('@')[0] || 'Trader',
        createdAt: now,
        trialStartAt: now,
        trialExpiresAt: now + 7 * 24 * 60 * 60 * 1000,
        subscriptionStatus: 'trial',
        bridgedPlatform: 'BOTH',
      },
    };
  }
}

export async function loginDemoAccount() {
  try {
    const res = await fetch('/api/auth/demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return await res.json();
  } catch (err: any) {
    console.warn('API demo login fallback:', err);
    const now = Date.now();
    return {
      success: true,
      user: {
        id: 'usr_demotrader',
        email: 'trader@smartpips.com',
        fullName: 'Alex Mercer',
        phone: '+254712345678',
        createdAt: now,
        trialStartAt: now,
        trialExpiresAt: now + 6 * 24 * 60 * 60 * 1000,
        subscriptionStatus: 'trial',
        bridgedPlatform: 'BOTH',
      },
    };
  }
}

// Stage 2 MT5 & Pocket Option Bridge API calls
export async function connectMt5Account(params: {
  userId: string;
  login: string;
  server: string;
  password?: string;
  token?: string;
  accountType?: 'REAL' | 'DEMO';
  isReadOnly?: boolean;
  balance?: number;
  platformType?: 'MT5' | 'POCKET_OPTION' | 'DERIV';
}) {
  const res = await fetch('/api/mt5/connect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function fetchMt5Account(userId: string) {
  try {
    const res = await fetch(`/api/mt5/account/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch MT5 account');
    return res.json();
  } catch (err) {
    console.warn('MT5 account fetch error:', err);
    return { success: false, connected: false, account: null };
  }
}

export async function disconnectMt5Account(userId: string) {
  const res = await fetch('/api/mt5/disconnect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  return res.json();
}

export async function executeMt5Trade(params: {
  userId: string;
  pairKey: string;
  type: 'BUY' | 'SELL';
  lots: number;
  stopLoss?: number;
  takeProfit?: number;
}) {
  const res = await fetch('/api/mt5/trade', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function closeMt5Position(userId: string, ticket: number) {
  const res = await fetch('/api/mt5/close', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, ticket }),
  });
  return res.json();
}

export async function fetchSiteDetails() {
  const res = await fetch('/api/site-details');
  return res.json();
}

