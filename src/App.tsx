import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  CurrencyPair,
  Candle,
  TechnicalIndicators,
  ScanResult,
  DemoPosition,
  ClosedTrade,
  DemoAccount,
  User,
  ActiveTab,
  Mt5LiveAccount,
} from './types.ts';
import { INITIAL_PAIRS } from './data/forexPairs.ts';
import {
  fetchLiveQuotes,
  fetchCandles,
  scanMarketChart,
  connectMt5Account,
  fetchMt5Account,
  disconnectMt5Account,
  executeMt5Trade,
  closeMt5Position,
} from './services/api.ts';
import { RiskDisclaimerBanner } from './components/RiskDisclaimerBanner.tsx';
import { Navbar } from './components/Navbar.tsx';
import { PairSelector } from './components/ChartScanner/PairSelector.tsx';
import { TimeframeSelector } from './components/ChartScanner/TimeframeSelector.tsx';
import { CandlestickChart } from './components/ChartScanner/CandlestickChart.tsx';
import { ScanResultCard } from './components/ChartScanner/ScanResultCard.tsx';
import { DemoAccountSummary } from './components/DemoTrading/DemoAccountSummary.tsx';
import { OrderTicketModal } from './components/DemoTrading/OrderTicketModal.tsx';
import { PositionsTable } from './components/DemoTrading/PositionsTable.tsx';
import { TradeHistoryTable } from './components/DemoTrading/TradeHistoryTable.tsx';
import { TrialGateModal } from './components/TrialGateModal.tsx';
import { StripeCheckoutModal, PaymentRailType } from './components/Subscription/StripeCheckoutModal.tsx';
import { SubscriptionPortalModal } from './components/Subscription/SubscriptionPortalModal.tsx';
import { AuthModal } from './components/Auth/AuthModal.tsx';
import { AuthGate } from './components/Auth/AuthGate.tsx';
import { LiveMT5Terminal } from './components/MT5Bridge/LiveMT5Terminal.tsx';
import { PlayStoreHubModal } from './components/PlayStore/PlayStoreHubModal.tsx';
import { WebsiteDetailsView } from './components/WebsiteDetailsView.tsx';
import { Footer } from './components/Footer.tsx';
import { Search, Loader2, Sparkles, RefreshCw, Building2, CreditCard, Copy, Check, ShieldCheck, Lock, Smartphone, Radio, Coins } from 'lucide-react';

const LOCAL_STORAGE_KEY_USER = 'smartpips_forex_user_v1';
const LOCAL_STORAGE_KEY_DEMO = 'smartpips_forex_demo_v1';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('scanner');

  // Forex Market Data State
  const [pairs, setPairs] = useState<CurrencyPair[]>(INITIAL_PAIRS);
  const [selectedPairKey, setSelectedPairKey] = useState<string>('EURUSD');
  const [timeframe, setTimeframe] = useState<string>('H1');
  const [candles, setCandles] = useState<Candle[]>([]);
  const [indicators, setIndicators] = useState<TechnicalIndicators>({
    rsi: 54.2,
    ema20: 1.0848,
    ema50: 1.0835,
    trendBias: 'BULLISH',
    macd: 'Bullish crossover (+0.0012)',
    support: 1.0815,
    resistance: 1.0875,
  });
  const [isLoadingCandles, setIsLoadingCandles] = useState<boolean>(false);

  // AI Scanner State
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [prefillOrderSignal, setPrefillOrderSignal] = useState<ScanResult | null>(null);

  // User & Trial State (Registration and Log In Gate enforced)
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch {}
    // Require account creation or sign in to access website services
    return null;
  });

  // Simulated trial expired override (for testing trial paywall lock)
  const [simulatedTrialExpired, setSimulatedTrialExpired] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 5000);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [checkoutMethod, setCheckoutMethod] = useState<PaymentRailType>('mpesa');
  const [copiedBillingBank, setCopiedBillingBank] = useState<boolean>(false);
  const [isPortalOpen, setIsPortalOpen] = useState<boolean>(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [isPlayStoreOpen, setIsPlayStoreOpen] = useState<boolean>(false);

  // Stage 2: Live MT5 State
  const [mt5Account, setMt5Account] = useState<Mt5LiveAccount | null>(null);

  // Demo Trading State
  const [demoAccount, setDemoAccount] = useState<DemoAccount>(() => {
    const fallback: DemoAccount = {
      balance: 10000.0,
      equity: 10000.0,
      margin: 0,
      freeMargin: 10000.0,
      marginLevel: Infinity,
      positions: [],
      history: [
        {
          id: 't_seed_1',
          ticket: 81042,
          pairKey: 'EURUSD',
          symbol: 'EUR/USD',
          type: 'BUY',
          lots: 0.5,
          openPrice: 1.0812,
          closePrice: 1.0845,
          openTime: Date.now() - 3600000 * 5,
          closeTime: Date.now() - 3600000 * 2,
          profit: 165.0,
          pips: 33.0,
          status: 'WIN',
        },
      ],
    };

    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_DEMO);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            balance: typeof parsed.balance === 'number' ? parsed.balance : 10000.0,
            equity: typeof parsed.equity === 'number' ? parsed.equity : (typeof parsed.balance === 'number' ? parsed.balance : 10000.0),
            margin: typeof parsed.margin === 'number' ? parsed.margin : 0,
            freeMargin: typeof parsed.freeMargin === 'number' ? parsed.freeMargin : 10000.0,
            marginLevel: typeof parsed.marginLevel === 'number' ? parsed.marginLevel : Infinity,
            positions: Array.isArray(parsed.positions) ? parsed.positions : [],
            history: Array.isArray(parsed.history) ? parsed.history : fallback.history,
          };
        }
      }
    } catch {}
    return fallback;
  });

  // Save user and demo state
  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_DEMO, JSON.stringify(demoAccount));
  }, [demoAccount]);

  // Selected pair object
  const currentPair = useMemo(() => {
    return pairs.find((p) => p.key === selectedPairKey) || pairs[0];
  }, [pairs, selectedPairKey]);

  // Load candles when pair or timeframe changes
  const loadCandleData = useCallback(async () => {
    setIsLoadingCandles(true);
    try {
      const data = await fetchCandles(selectedPairKey, timeframe);
      setCandles(data.candles);
      setIndicators(data.indicators);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingCandles(false);
    }
  }, [selectedPairKey, timeframe]);

  useEffect(() => {
    loadCandleData();
  }, [loadCandleData]);

  // Periodic Live Quotes Fetch & Tick updates
  useEffect(() => {
    const fetchInterval = setInterval(async () => {
      try {
        const latest = await fetchLiveQuotes();
        if (latest && latest.length > 0) {
          setPairs(latest);
        }
      } catch (err) {
        console.warn('Quote poll error:', err);
      }
    }, 3000);

    return () => clearInterval(fetchInterval);
  }, []);

  // Poll MT5 live account status if connected
  useEffect(() => {
    if (!user) return;
    const pollMt5 = async () => {
      const res = await fetchMt5Account(user.id);
      if (res.success && res.connected && res.account) {
        setMt5Account(res.account);
      }
    };
    pollMt5();
    const mt5Interval = setInterval(pollMt5, 4000);
    return () => clearInterval(mt5Interval);
  }, [user]);

  // Update open demo positions floating P&L when prices update
  useEffect(() => {
    setDemoAccount((prev) => {
      if (prev.positions.length === 0) return prev;

      let totalFloatingProfit = 0;
      let totalUsedMargin = 0;

      const updatedPositions = prev.positions.map((pos) => {
        const pair = pairs.find((p) => p.key === pos.pairKey) || currentPair;
        const currentPrice = pos.type === 'BUY' ? pair.bid : pair.ask;
        const pipDiff =
          pos.type === 'BUY'
            ? (currentPrice - pos.openPrice) / pair.pipSize
            : (pos.openPrice - currentPrice) / pair.pipSize;

        const floatingProfit = Number((pipDiff * (pos.lots * 10)).toFixed(2));
        totalFloatingProfit += floatingProfit;

        const positionMargin = (pos.lots * 100000 * currentPrice) / 100;
        totalUsedMargin += positionMargin;

        return {
          ...pos,
          currentPrice,
          pips: Number(pipDiff.toFixed(1)),
          floatingProfit,
        };
      });

      const equity = Number((prev.balance + totalFloatingProfit).toFixed(2));
      const freeMargin = Number((equity - totalUsedMargin).toFixed(2));
      const marginLevel = totalUsedMargin > 0 ? (equity / totalUsedMargin) * 100 : Infinity;

      return {
        ...prev,
        equity,
        margin: Number(totalUsedMargin.toFixed(2)),
        freeMargin,
        marginLevel,
        positions: updatedPositions,
      };
    });
  }, [pairs, currentPair]);

  // Trial Calculations
  const now = Date.now();
  const trialDaysLeft = user ? Math.max(0, Math.ceil((user.trialExpiresAt - now) / (1000 * 60 * 60 * 24))) : 0;
  const isTrialActuallyExpired = user ? now >= user.trialExpiresAt && user.subscriptionStatus !== 'active' : false;
  const isTrialExpired = simulatedTrialExpired || isTrialActuallyExpired;

  // Run AI Scan
  const handleScanChart = async () => {
    if (isTrialExpired) {
      setIsCheckoutOpen(true);
      return;
    }

    setIsScanning(true);
    try {
      const data = await scanMarketChart(selectedPairKey, timeframe);
      setScanResult(data.analysis);
      setIndicators(data.indicators);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  // Copy signal into Demo Trade
  const handleExecuteDemoFromSignal = (signal: ScanResult) => {
    if (isTrialExpired) {
      setIsCheckoutOpen(true);
      return;
    }
    setPrefillOrderSignal(signal);
    setIsOrderModalOpen(true);
  };

  // Execute Live MT5 Trade from AI Scanner Signal
  const handleExecuteMT5LiveFromSignal = async (signal: ScanResult) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    if (isTrialExpired) {
      setIsCheckoutOpen(true);
      return;
    }
    if (!mt5Account) {
      // Direct user to Stage 2 tab to connect their MT5 broker
      setActiveTab('mt5-bridge');
      return;
    }

    try {
      const type = signal.signal.includes('BUY') ? 'BUY' : 'SELL';
      await executeMt5Trade({
        userId: user.id,
        pairKey: selectedPairKey,
        type,
        lots: 0.1,
        stopLoss: signal.stopLoss,
        takeProfit: signal.takeProfit1,
      });
      // Refresh MT5 account and navigate to live terminal
      const res = await fetchMt5Account(user.id);
      if (res.success && res.account) {
        setMt5Account(res.account);
      }
      setActiveTab('mt5-bridge');
    } catch (err: any) {
      setToastMessage({
        text: err.message || 'Failed to route trade to MT5 bridge',
        isError: true,
      });
    }
  };

  // Execute Demo Trade
  const handleExecuteTrade = (params: {
    pairKey: string;
    type: 'BUY' | 'SELL';
    lots: number;
    stopLoss?: number;
    takeProfit?: number;
  }) => {
    const pair = pairs.find((p) => p.key === params.pairKey) || currentPair;
    const executionPrice = params.type === 'BUY' ? pair.ask : pair.bid;
    const ticket = Math.floor(100000 + Math.random() * 900000);

    const newPosition: DemoPosition = {
      id: 'pos_' + Math.random().toString(36).substring(2, 9),
      ticket,
      pairKey: pair.key,
      symbol: pair.symbol,
      type: params.type,
      lots: params.lots,
      openPrice: executionPrice,
      currentPrice: executionPrice,
      stopLoss: params.stopLoss,
      takeProfit: params.takeProfit,
      openTime: Date.now(),
      floatingProfit: 0,
      pips: 0,
    };

    setDemoAccount((prev) => ({
      ...prev,
      positions: [newPosition, ...prev.positions],
    }));

    setActiveTab('demo');
  };

  // Close Demo Position
  const handleClosePosition = (positionId: string) => {
    setDemoAccount((prev) => {
      const target = prev.positions.find((p) => p.id === positionId);
      if (!target) return prev;

      const remainingPositions = prev.positions.filter((p) => p.id !== positionId);
      const newBalance = Number((prev.balance + target.floatingProfit).toFixed(2));

      const closedTrade: ClosedTrade = {
        id: 'cl_' + Math.random().toString(36).substring(2, 9),
        ticket: target.ticket,
        pairKey: target.pairKey,
        symbol: target.symbol,
        type: target.type,
        lots: target.lots,
        openPrice: target.openPrice,
        closePrice: target.currentPrice,
        openTime: target.openTime,
        closeTime: Date.now(),
        profit: target.floatingProfit,
        pips: target.pips,
        status: target.floatingProfit > 0 ? 'WIN' : target.floatingProfit < 0 ? 'LOSS' : 'BREAKEVEN',
      };

      const floatingTotal = remainingPositions.reduce((acc, p) => acc + p.floatingProfit, 0);
      const equity = Number((newBalance + floatingTotal).toFixed(2));

      return {
        ...prev,
        balance: newBalance,
        equity,
        positions: remainingPositions,
        history: [closedTrade, ...prev.history],
      };
    });
  };

  // Reset Demo Balance
  const handleResetBalance = () => {
    if (confirm('Reset your demo equity to initial $10,000.00? Open positions will be closed.')) {
      setDemoAccount({
        balance: 10000.0,
        equity: 10000.0,
        margin: 0,
        freeMargin: 10000.0,
        marginLevel: Infinity,
        positions: [],
        history: demoAccount.history,
      });
    }
  };

  // MT5 Bridge Handlers
  const handleConnectMt5 = async (params: {
    login: string;
    server: string;
    password?: string;
    token?: string;
    accountType?: 'REAL' | 'DEMO';
    isReadOnly?: boolean;
    balance?: number;
    platformType?: 'MT5' | 'POCKET_OPTION';
  }) => {
    if (!user) return;
    const res = await connectMt5Account({
      userId: user.id,
      ...params,
    });
    if (res.success && res.account) {
      setMt5Account(res.account);
      setToastMessage({
        text: res.message || `${res.account.brokerName} real account connected successfully!`,
      });
    } else {
      throw new Error(res.error || 'Connection failed');
    }
  };

  const handleDisconnectMt5 = async () => {
    if (!user) return;
    await disconnectMt5Account(user.id);
    setMt5Account(null);
  };

  const handleExecuteMt5TradeFromTerminal = async (params: {
    pairKey: string;
    type: 'BUY' | 'SELL';
    lots: number;
    stopLoss?: number;
    takeProfit?: number;
  }) => {
    if (!user) return;
    await executeMt5Trade({
      userId: user.id,
      ...params,
    });
    const res = await fetchMt5Account(user.id);
    if (res.success && res.account) {
      setMt5Account(res.account);
    }
  };

  const handleCloseMt5Position = async (ticket: number) => {
    if (!user) return;
    await closeMt5Position(user.id, ticket);
    const res = await fetchMt5Account(user.id);
    if (res.success && res.account) {
      setMt5Account(res.account);
    }
  };

  // Subscribed callback from Stripe
  const handleSubscriptionSuccess = () => {
    if (user) {
      setUser({
        ...user,
        subscriptionStatus: 'active',
        subscriptionExpiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      });
      setSimulatedTrialExpired(false);
    }
  };

  // Cancel subscription
  const handleCancelSubscription = () => {
    if (user) {
      setUser({
        ...user,
        subscriptionStatus: 'cancelled',
      });
    }
  };

  // Reset trial for testing
  const handleResetTrial = () => {
    if (user) {
      const now = Date.now();
      setUser({
        ...user,
        trialStartAt: now,
        trialExpiresAt: now + 7 * 24 * 60 * 60 * 1000,
        subscriptionStatus: 'trial',
      });
    }
    setSimulatedTrialExpired(false);
  };

  // If user is not authenticated, gate access to website services
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0E17] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
        <RiskDisclaimerBanner />
        {toastMessage && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-xl border shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
              toastMessage.isError
                ? 'bg-rose-950/90 border-rose-700 text-rose-200'
                : 'bg-emerald-950/90 border-emerald-700 text-emerald-200'
            }`}
          >
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span className="text-xs font-semibold">{toastMessage.text}</span>
          </div>
        )}
        <AuthGate
          onAuthSuccess={(newUser) => {
            setUser(newUser);
            localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(newUser));
            setToastMessage({
              text: `Welcome, ${newUser.fullName}! Your trading account & 7-day trial are active.`,
            });
          }}
          onOpenCheckout={() => setIsCheckoutOpen(true)}
        />
        {isCheckoutOpen && (
          <StripeCheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            onSuccess={handleSubscriptionSuccess}
            defaultMethod={checkoutMethod}
            userEmail="trader@smartpips.com"
            userId="usr_demotrader"
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E17] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Regulatory Risk Disclaimer Banner */}
      <RiskDisclaimerBanner />

      {/* Top Bar Navigation Contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onOpenPortal={() => setIsPortalOpen(true)}
        onOpenPlayStore={() => setIsPlayStoreOpen(true)}
        onLogout={() => {
          localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
          setUser(null);
          setMt5Account(null);
        }}
        trialDaysLeft={trialDaysLeft}
        isTrialExpired={isTrialExpired}
        onToggleSimulateExpired={() => setSimulatedTrialExpired(!simulatedTrialExpired)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* TAB 1: AI CHART SCANNER & ANALYSIS */}
        {activeTab === 'scanner' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Currency Pair Ticker Ribbon */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Live Forex Quote Tickers</span>
                <span className="font-mono text-[11px] text-slate-500">Click a pair to scan chart</span>
              </div>
              <PairSelector
                pairs={pairs}
                selectedPairKey={selectedPairKey}
                onSelectPair={(k) => setSelectedPairKey(k)}
              />
            </div>

            {/* Action Control Bar: Timeframe & AI Scan Button */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
              <div className="flex items-center gap-3">
                <TimeframeSelector
                  timeframe={timeframe}
                  onChangeTimeframe={(tf) => setTimeframe(tf)}
                />

                <button
                  onClick={loadCandleData}
                  disabled={isLoadingCandles}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title="Refresh Candle Data"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingCandles ? 'animate-spin text-blue-400' : ''}`} />
                </button>
              </div>

              {/* Primary AI Scan Button */}
              <button
                onClick={handleScanChart}
                disabled={isScanning}
                className="flex items-center gap-2.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-blue-950/60"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Scanning {currentPair.symbol} with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-300 fill-current" />
                    <span>Scan {currentPair.symbol} ({timeframe}) with AI</span>
                  </>
                )}
              </button>
            </div>

            {/* Interactive Candlestick Chart */}
            <CandlestickChart
              symbol={currentPair.symbol}
              timeframe={timeframe}
              candles={candles}
              indicators={indicators}
              decimals={currentPair.decimals}
              scanResult={scanResult}
              livePrice={currentPair.bid}
            />

            {/* AI Signal Output Card */}
            {scanResult ? (
              <ScanResultCard
                symbol={currentPair.symbol}
                timeframe={timeframe}
                result={scanResult}
                decimals={currentPair.decimals}
                pipSize={currentPair.pipSize}
                onExecuteDemo={handleExecuteDemoFromSignal}
                onExecuteMT5Live={handleExecuteMT5LiveFromSignal}
                isMt5Connected={!!mt5Account}
              />
            ) : (
              <div className="p-8 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-blue-600/10 text-blue-400 flex items-center justify-center mx-auto">
                  <Search className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-white">Ready for AI Market Scanning</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Click the <strong>"Scan {currentPair.symbol} with AI"</strong> button above to run real-time technical analysis, calculate high-probability entry/SL/TP levels, and reveal algorithmic market structure.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DEMO TRADING TERMINAL */}
        {activeTab === 'demo' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Account Financials Header */}
            <DemoAccountSummary
              account={demoAccount}
              onResetBalance={handleResetBalance}
              onOpenNewOrder={() => {
                setPrefillOrderSignal(null);
                setIsOrderModalOpen(true);
              }}
            />

            {/* Active Positions */}
            <PositionsTable
              positions={demoAccount.positions}
              onClosePosition={handleClosePosition}
              onOpenNewOrder={() => {
                setPrefillOrderSignal(null);
                setIsOrderModalOpen(true);
              }}
            />

            {/* Closed Trade Journal */}
            <TradeHistoryTable history={demoAccount.history} />
          </div>
        )}

        {/* TAB 3: STAGE 2 LIVE METATRADER 5 BRIDGING TERMINAL */}
        {activeTab === 'mt5-bridge' && (
          <div className="animate-in fade-in duration-150">
            <LiveMT5Terminal
              account={mt5Account}
              pairs={pairs}
              isSubscribed={user?.subscriptionStatus === 'active'}
              onConnect={handleConnectMt5}
              onDisconnect={handleDisconnectMt5}
              onExecuteTrade={handleExecuteMt5TradeFromTerminal}
              onClosePosition={handleCloseMt5Position}
              onOpenCheckout={() => setIsCheckoutOpen(true)}
              prefillSignal={scanResult}
            />
          </div>
        )}

        {/* TAB 4: PRICING & SUBSCRIPTION DETAILS */}
        {activeTab === 'billing' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
            <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-semibold">
                  Transparent Pricing
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  7-Day Free Trial, Then $5 / Month
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-2xl mx-auto">
                  Institutional forex chart scanning and demo execution at an accessible recurring rate. Subscriptions can be paid through <strong>M-Pesa</strong>, <strong>Airtel Money</strong>, <strong>Credit/Debit Card</strong>, or <strong>Direct Bank Wire</strong> to the verified site owner bank account (<strong>0109060094245</strong>).
                </p>
              </div>

              {/* Pricing Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* Plan Card */}
                <div className="p-6 rounded-xl bg-slate-950/80 border border-slate-800 space-y-5 text-center flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <span className="text-xs font-mono uppercase text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Universal Payment Accepted
                      </span>
                    </div>
                    <div className="text-base font-bold text-white">Pro Trader All-Access</div>
                    <div className="text-3xl font-black font-mono text-emerald-400 mt-2">$5.00</div>
                    <div className="text-xs text-slate-400">per month (~650 KES / mobile money or card)</div>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-300 text-left pt-2 border-t border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>7-Day Free Trial (No Card or Bank Needed to Start)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>Unlimited AI chart scans across 8 major currency pairs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>$10,000 demo trading terminal with live tick feeds</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>Stage 2 live MetaTrader 5 cloud bridge order execution</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>Pay seamlessly with M-Pesa, Airtel Money, Cards, or Bank Wire</span>
                    </div>
                  </div>

                  <div className="pt-2 space-y-2">
                    {user?.subscriptionStatus === 'active' ? (
                      <button
                        onClick={() => setIsPortalOpen(true)}
                        className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
                      >
                        Manage Active Subscription
                      </button>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => {
                              setCheckoutMethod('mpesa');
                              setIsCheckoutOpen(true);
                            }}
                            className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md shadow-emerald-950 flex items-center justify-center gap-1.5"
                          >
                            <Smartphone className="w-4 h-4 shrink-0" />
                            <span>Pay with M-Pesa</span>
                          </button>

                          <button
                            onClick={() => {
                              setCheckoutMethod('airtel');
                              setIsCheckoutOpen(true);
                            }}
                            className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition shadow-md shadow-red-950 flex items-center justify-center gap-1.5"
                          >
                            <Radio className="w-4 h-4 shrink-0" />
                            <span>Airtel Money</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => {
                              setCheckoutMethod('card');
                              setIsCheckoutOpen(true);
                            }}
                            className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                          >
                            <CreditCard className="w-3.5 h-3.5 shrink-0" />
                            <span>Credit / Debit Card</span>
                          </button>

                          <button
                            onClick={() => {
                              setCheckoutMethod('bank');
                              setIsCheckoutOpen(true);
                            }}
                            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5"
                          >
                            <Building2 className="w-3.5 h-3.5 shrink-0" />
                            <span>Bank Wire</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Owner Bank Settlement & Direct Payment Card */}
                <div className="p-6 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-4 text-left flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <Building2 className="w-4 h-4" />
                        Owner Bank Settlement Account
                      </span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                        Active Receiver
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-2">
                      Postbank Settlement: Paybill 200999 · Acc: 0109060094245
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      All subscription payments—whether initiated through M-Pesa, Airtel Money, credit/debit card, or wire—deposit directly into your verified Postbank account:
                    </p>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    {/* Paybill Box */}
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-emerald-400 uppercase font-mono font-semibold">Postbank Paybill Number</div>
                        <div className="text-base font-extrabold font-mono text-emerald-300 tracking-wider">
                          200999
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText('200999');
                          setCopiedBillingBank(true);
                          setTimeout(() => setCopiedBillingBank(false), 2000);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 text-xs flex items-center gap-1 transition"
                      >
                        {copiedBillingBank ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy Paybill</span>
                      </button>
                    </div>

                    {/* Account Box */}
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-mono font-semibold">Bank Account Number</div>
                        <div className="text-base font-extrabold font-mono text-emerald-300 tracking-wider">
                          0109060094245
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText('0109060094245');
                          setCopiedBillingBank(true);
                          setTimeout(() => setCopiedBillingBank(false), 2000);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 text-xs flex items-center gap-1 transition"
                      >
                        {copiedBillingBank ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy Acc</span>
                      </button>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Financial Institution:</span>
                        <span className="text-white font-medium">Postbank (Kenya Post Office Savings Bank)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Account Beneficiary:</span>
                        <span className="text-white font-medium">zabrowne4@gmail.com</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Mobile Money Paybill:</span>
                        <span className="text-emerald-400 font-mono font-medium">200999 (Acc: 0109060094245)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Supported Rails:</span>
                        <span className="text-slate-200">M-Pesa · Airtel · Card · Wire · USDT</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCheckoutMethod('mpesa');
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-2"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Pay with Mobile Money or Card Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: WEBSITE DETAILS & PLATFORM SUMMARY */}
        {activeTab === 'website-details' && (
          <WebsiteDetailsView
            onOpenPlayStore={() => setIsPlayStoreOpen(true)}
            onOpenCheckout={() => setIsCheckoutOpen(true)}
          />
        )}
      </main>

      {/* Trial Gate Paywall (Locks access when trial expires) */}
      <TrialGateModal
        isOpen={isTrialExpired && user?.subscriptionStatus !== 'active'}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onResetTrial={handleResetTrial}
      />

      {/* Order Ticket Modal */}
      <OrderTicketModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        pairs={pairs}
        defaultPairKey={selectedPairKey}
        prefillSignal={prefillOrderSignal}
        onExecuteTrade={handleExecuteTrade}
      />

      {/* Stripe Checkout Modal */}
      <StripeCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        userEmail={user?.email || 'trader@smartpips.com'}
        userId={user?.id || 'usr_demotrader'}
        defaultMethod={checkoutMethod}
        onSuccess={handleSubscriptionSuccess}
      />

      {/* Subscription Portal Modal */}
      {user && (
        <SubscriptionPortalModal
          isOpen={isPortalOpen}
          onClose={() => setIsPortalOpen(false)}
          user={user}
          onCancelSub={handleCancelSubscription}
          onOpenCheckout={() => {
            setIsPortalOpen(false);
            setIsCheckoutOpen(true);
          }}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(newUser) => {
          setUser(newUser);
          setSimulatedTrialExpired(false);
        }}
      />

      {/* Google Play Store Modal */}
      <PlayStoreHubModal
        isOpen={isPlayStoreOpen}
        onClose={() => setIsPlayStoreOpen(false)}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm p-4 rounded-xl shadow-2xl border flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 bg-slate-900 border-slate-700 text-slate-100">
          <div className="text-xs font-medium">
            <span className={toastMessage.isError ? 'text-rose-400 font-bold block mb-0.5' : 'text-emerald-400 font-bold block mb-0.5'}>
              {toastMessage.isError ? 'Notice' : 'Success'}
            </span>
            <span className="text-slate-300">{toastMessage.text}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 rounded text-slate-400 hover:text-white shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* Compliance & Regulatory Disclaimer Footer */}
      <Footer
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onOpenPortal={() => setIsPortalOpen(true)}
      />
    </div>
  );
}
