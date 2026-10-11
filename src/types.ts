export interface CurrencyPair {
  key: string;
  symbol: string;
  name: string;
  bid: number;
  ask: number;
  spread: number;
  change24h: number;
  high24h: number;
  low24h: number;
  decimals: number;
  pipSize: number;
  updatedAt: number;
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicators {
  rsi: number;
  ema20: number;
  ema50: number;
  trendBias: string;
  macd: string;
  support: number;
  resistance: number;
}

export interface ScanResult {
  signal: 'STRONG BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG SELL';
  confidence: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  riskReward: string;
  summary: string;
  validity: string;
  structure: {
    trend: string;
    momentum: string;
    keyLevels: string;
    riskNote: string;
  };
}

export interface DemoPosition {
  id: string;
  ticket: number;
  pairKey: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  lots: number;
  openPrice: number;
  currentPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  openTime: number;
  floatingProfit: number;
  pips: number;
}

export interface ClosedTrade {
  id: string;
  ticket: number;
  pairKey: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  lots: number;
  openPrice: number;
  closePrice: number;
  openTime: number;
  closeTime: number;
  profit: number;
  pips: number;
  status: 'WIN' | 'LOSS' | 'BREAKEVEN';
}

export interface DemoAccount {
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  positions: DemoPosition[];
  history: ClosedTrade[];
}

export const OWNER_BANK_DETAILS = {
  accountNumber: '0109060094245',
  paybillNumber: '200999',
  bankName: 'Postbank (Kenya Post Office Savings Bank)',
  beneficiary: 'zabrowne4@gmail.com',
  currency: 'USD',
  planFee: '$5.00 / month',
  routingNote: 'Postbank Paybill 200999 / Account 0109060094245 for Smartpips Traderscheme Subscriptions',
};

export const OWNER_PAYMENT_CHANNELS = {
  bankAccount: {
    bankName: 'Postbank (Kenya Post Office Savings Bank)',
    paybillNumber: '200999',
    accountNumber: '0109060094245',
    beneficiary: 'zabrowne4@gmail.com',
    currency: 'USD',
    memo: 'Smartpips Subscription 0109060094245',
  },
  mpesa: {
    name: 'M-Pesa (Safaricom / Vodacom)',
    paybillNumber: '200999',
    paybillToBank: '200999',
    accountNumber: '0109060094245',
    bankName: 'Postbank',
    beneficiary: 'zabrowne4@gmail.com',
    currencyEquivalent: '$5.00 USD (Approx. KES 650)',
    instantStkPush: true,
    ussdGuide: 'Lipa na M-Pesa > Paybill: 200999 > Account: 0109060094245',
  },
  airtelMoney: {
    name: 'Airtel Money',
    paybillNumber: '200999',
    accountNumber: '0109060094245',
    bankName: 'Postbank',
    beneficiary: 'zabrowne4@gmail.com',
    currencyEquivalent: '$5.00 USD (Approx. local currency equivalent)',
    instantPrompt: true,
    ussdGuide: 'Dial *334# or *185# > Make Payment / Paybill: 200999 > Acc: 0109060094245',
  },
  otherMobileWallets: {
    providers: ['MTN MoMo', 'Orange Money', 'Chipper Cash', 'Wave', 'Tigo Pesa'],
    paybillNumber: '200999',
    routingAccount: '0109060094245',
    bankName: 'Postbank',
    beneficiary: 'zabrowne4@gmail.com',
  },
  cryptoUsdt: {
    networks: ['USDT (TRC-20)', 'USDT (BEP-20)'],
    amount: '5.00 USDT',
  },
};

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  createdAt: number;
  trialStartAt: number;
  trialExpiresAt: number;
  subscriptionStatus: 'trial' | 'active' | 'cancelled' | 'expired';
  subscriptionId?: string;
  subscriptionExpiresAt?: number;
  paymentMethod?: 'card' | 'bank_transfer' | 'mpesa' | 'airtel_money' | 'mobile_money' | 'crypto';
  bankAccountNumber?: string;
  mobileMoneyPhone?: string;
  transactionReference?: string;
  bridgedPlatform?: 'MT5' | 'POCKET_OPTION' | 'DERIV' | 'ALL' | 'BOTH';
}

export interface Mt5LivePosition {
  ticket: number;
  symbol: string;
  pairKey: string;
  type: 'BUY' | 'SELL';
  lots: number;
  openPrice: number;
  currentPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  floatingProfit: number;
  pips: number;
  openTime: number;
}

export interface Mt5LiveAccount {
  userId: string;
  login: string;
  server: string;
  brokerName: string;
  platformType?: 'MT5' | 'POCKET_OPTION' | 'DERIV';
  tokenMasked: string;
  connectedAt: number;
  status: 'CONNECTED' | 'DISCONNECTED' | 'SYNCING';
  balance: number;
  equity: number;
  leverage: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  pingMs: number;
  positions: Mt5LivePosition[];
  accountType?: 'REAL' | 'DEMO';
  isReadOnly?: boolean;
  orderLog: Array<{
    ticket: number;
    action: string;
    time: number;
    symbol: string;
    type: string;
    lots: number;
    price: number;
    status: string;
  }>;
}

export type ActiveTab = 'scanner' | 'demo' | 'mt5-bridge' | 'viral-ads' | 'billing' | 'website-details';
