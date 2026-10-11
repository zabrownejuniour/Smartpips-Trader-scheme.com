import React, { useState } from 'react';
import { Mt5LiveAccount, CurrencyPair, ScanResult } from '../../types.ts';
import {
  Server,
  ShieldCheck,
  CheckCircle2,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  AlertTriangle,
  Lock,
  Plus,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Zap,
  Info,
  DollarSign,
  HelpCircle,
} from 'lucide-react';

interface Props {
  account: Mt5LiveAccount | null;
  pairs: CurrencyPair[];
  isSubscribed: boolean;
  onConnect: (params: {
    login: string;
    server: string;
    password?: string;
    token?: string;
    accountType?: 'REAL' | 'DEMO';
    isReadOnly?: boolean;
    balance?: number;
    platformType?: 'MT5' | 'POCKET_OPTION' | 'DERIV';
  }) => Promise<void>;
  onDisconnect: () => Promise<void>;
  onExecuteTrade: (params: { pairKey: string; type: 'BUY' | 'SELL'; lots: number; stopLoss?: number; takeProfit?: number }) => Promise<void>;
  onClosePosition: (ticket: number) => Promise<void>;
  onOpenCheckout: () => void;
  prefillSignal?: ScanResult | null;
}

export const LiveMT5Terminal: React.FC<Props> = ({
  account,
  pairs,
  isSubscribed,
  onConnect,
  onDisconnect,
  onExecuteTrade,
  onClosePosition,
  onOpenCheckout,
  prefillSignal,
}) => {
  // Platform Bridge Selection (Deriv vs Pocket Option vs MetaTrader 5)
  const [selectedPlatform, setSelectedPlatform] = useState<'DERIV' | 'POCKET_OPTION' | 'MT5'>('DERIV');

  // Connection Form State
  const [login, setLogin] = useState('CR9418204');
  const [server, setServer] = useState('Deriv-Server');
  const [customServer, setCustomServer] = useState('');
  const [password, setPassword] = useState('••••••••••••');
  const [token, setToken] = useState('drv_live_deriv_9241');
  const [accountType, setAccountType] = useState<'REAL' | 'DEMO'>('REAL');
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [testBalance, setTestBalance] = useState('2500');
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeGuideTab, setActiveGuideTab] = useState<'deriv' | 'pocket-option' | 'mt5' | 'wikifx'>('deriv');

  // Live Order Placement state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderPairKey, setOrderPairKey] = useState('EURUSD');
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [orderLots, setOrderLots] = useState(0.01);
  const [orderSL, setOrderSL] = useState('');
  const [orderTP, setOrderTP] = useState('');
  const [isSendingOrder, setIsSendingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');

  const selectedPair = pairs.find((p) => p.key === orderPairKey) || pairs[0];

  const handleConnectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubscribed) {
      onOpenCheckout();
      return;
    }
    setIsConnecting(true);
    setErrorMsg('');
    try {
      const defaultFallbackServer = selectedPlatform === 'DERIV' ? 'Deriv-Server' : selectedPlatform === 'POCKET_OPTION' ? 'PocketOption-Live' : 'ICMarketsSC-Live01';
      const finalServer = server === 'CUSTOM' ? (customServer.trim() || defaultFallbackServer) : server;
      await onConnect({
        login,
        server: finalServer,
        password,
        token,
        accountType,
        isReadOnly,
        balance: parseFloat(testBalance) || (selectedPlatform === 'DERIV' ? 2500 : 1500),
        platformType: selectedPlatform,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to connect real broker bridge');
    } finally {
      setIsConnecting(false);
    }
  };

  // Quick Preset Handlers for Deriv Real Account (Deriv MT5 & Synthetics)
  const handleDerivLivePreset = (readOnlyMode: boolean) => {
    setSelectedPlatform('DERIV');
    setServer('Deriv-Server');
    setLogin('CR9418204');
    setPassword(readOnlyMode ? 'DerivInvPass#99' : 'DerivMaster#2026');
    setToken('drv_live_deriv_9241');
    setAccountType('REAL');
    setIsReadOnly(readOnlyMode);
    setTestBalance('2500');
  };

  const handleDerivFinancialPreset = () => {
    setSelectedPlatform('DERIV');
    setServer('Deriv-Server-02');
    setLogin('CR8129043');
    setPassword('DerivFinMaster#77');
    setToken('drv_live_fin_8820');
    setAccountType('REAL');
    setIsReadOnly(false);
    setTestBalance('3500');
  };

  const handleDerivDemoPreset = () => {
    setSelectedPlatform('DERIV');
    setServer('Deriv-Demo');
    setLogin('1049281');
    setPassword('DerivDemoPass99!');
    setToken('drv_demo_deriv_2201');
    setAccountType('DEMO');
    setIsReadOnly(false);
    setTestBalance('10000');
  };

  // Quick Preset Handlers for Pocket Option Real Account
  const handlePocketOptionLivePreset = (readOnlyMode: boolean) => {
    setSelectedPlatform('POCKET_OPTION');
    setServer('PocketOption-Live');
    setLogin('1048291');
    setPassword(readOnlyMode ? 'InvPassword#99' : 'TraderMaster#77');
    setToken('po_live_pocket_8391');
    setAccountType('REAL');
    setIsReadOnly(readOnlyMode);
    setTestBalance('1250');
  };

  const handlePocketOptionDemoPreset = () => {
    setSelectedPlatform('POCKET_OPTION');
    setServer('PocketOption-Demo');
    setLogin('601849');
    setPassword('DemoPass2026!');
    setToken('po_demo_pocket_2201');
    setAccountType('DEMO');
    setIsReadOnly(false);
    setTestBalance('10000');
  };

  // Quick Preset Handlers for MetaTrader 5 Real Account
  const handleICMarketsPreset = () => {
    setSelectedPlatform('MT5');
    setServer('ICMarketsSC-Live01');
    setLogin('5192840');
    setPassword('Tr4d3rM@sterPass!');
    setToken('mta_live_83910fbc39a1');
    setAccountType('REAL');
    setIsReadOnly(false);
    setTestBalance('2500');
  };

  const handlePepperstonePreset = () => {
    setSelectedPlatform('MT5');
    setServer('Pepperstone-Live01');
    setLogin('3891042');
    setPassword('PepEdgeMaster#1');
    setToken('mta_live_pep_9012');
    setAccountType('REAL');
    setIsReadOnly(false);
    setTestBalance('3000');
  };

  const handleXMPreset = () => {
    setSelectedPlatform('MT5');
    setServer('XMGlobal-MT5-7');
    setLogin('4401823');
    setPassword('XmUltraLow#2026');
    setToken('mta_live_xm_1829');
    setAccountType('REAL');
    setIsReadOnly(false);
    setTestBalance('1000');
  };

  const handleSendLiveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (account?.isReadOnly) {
      setOrderError('Account connected in Read-Only / Investor Mode. Order placement is locked to protect your Pocket Option real capital.');
      return;
    }
    setIsSendingOrder(true);
    setOrderError('');
    try {
      await onExecuteTrade({
        pairKey: orderPairKey,
        type: orderType,
        lots: orderLots,
        stopLoss: orderSL ? parseFloat(orderSL) : undefined,
        takeProfit: orderTP ? parseFloat(orderTP) : undefined,
      });
      setShowOrderModal(false);
    } catch (err: any) {
      setOrderError(err.message || 'Failed to execute live order');
    } finally {
      setIsSendingOrder(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner explaining Stage 2 Live MT5, Deriv & Pocket Option Bridging */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900/90 to-slate-900 border border-blue-800/40 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              STAGE 2 LIVE
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Deriv Real Ready
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Pocket Option Ready
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Deriv, MetaTrader 5 & Pocket Option Real Account Cloud Bridge
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Connect your <strong>Deriv Real Account</strong> (Synthetics, Boom & Crash, Forex), <strong>Pocket Option MT5 Real Account</strong>, or standard <strong>MetaTrader 5 Real Account</strong> (IC Markets, Pepperstone, XM). Test risk-free using an <strong>Investor Password (Read-Only)</strong> or start trading live now.
          </p>
        </div>

        {!isSubscribed && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-amber-300 font-semibold flex items-center justify-end gap-1">
                <Lock className="w-3.5 h-3.5" />
                <span>Pro Access</span>
              </div>
              <div className="text-[11px] text-slate-400">$5/month after 7-day trial</div>
            </div>
            <button
              onClick={onOpenCheckout}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md"
            >
              Activate Pro ($5/mo)
            </button>
          </div>
        )}
      </div>

      {/* Broker Testing Callout Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-800/40 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3 max-w-2xl">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0 mt-0.5">
              <Zap className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Eligible for Real Deriv Account & Synthetics?</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  YES · DERIV-SERVER CERTIFIED
                </span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                You can bridge your <strong>Real Deriv Account</strong> (Deriv MT5, Volatility 75, Boom & Crash, Step Index), <strong>Pocket Option Real</strong>, or <strong>MT5 broker</strong>. Use Investor / Read-Only mode for safe balance sync, or Live Execution to start trading immediately.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleDerivLivePreset(false)}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Preset Deriv Real Account</span>
            </button>
            <button
              type="button"
              onClick={() => handlePocketOptionLivePreset(true)}
              className="px-3 py-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-semibold border border-purple-700 transition"
            >
              Preset Pocket Option Safe
            </button>
            <button
              type="button"
              onClick={handleICMarketsPreset}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              Preset IC Markets MT5
            </button>
          </div>
        </div>
      </div>

      {!account ? (
        /* CONNECTION FORM (When no MT5 / Deriv / Pocket Option account is linked) */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
            {/* Platform Bridge Selection Tabs: Deriv vs Pocket Option vs MT5 */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Choose Eligible Real Broker Platform to Bridge:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* 1. Real Deriv Account */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlatform('DERIV');
                    handleDerivLivePreset(isReadOnly);
                  }}
                  className={`p-3 rounded-xl border transition flex items-center justify-between text-left ${
                    selectedPlatform === 'DERIV'
                      ? 'bg-gradient-to-r from-amber-950/90 to-red-950/70 border-amber-500 text-white shadow-lg shadow-amber-950/50'
                      : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg ${selectedPlatform === 'DERIV' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span>Real Deriv Account</span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">READY</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Synthetics & Deriv-Server</div>
                    </div>
                  </div>
                  {selectedPlatform === 'DERIV' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                </button>

                {/* 2. Pocket Option Real Account */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlatform('POCKET_OPTION');
                    handlePocketOptionLivePreset(isReadOnly);
                  }}
                  className={`p-3 rounded-xl border transition flex items-center justify-between text-left ${
                    selectedPlatform === 'POCKET_OPTION'
                      ? 'bg-gradient-to-r from-indigo-950/90 to-purple-950/70 border-indigo-500 text-white shadow-lg shadow-indigo-950/50'
                      : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg ${selectedPlatform === 'POCKET_OPTION' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span>Pocket Option Real</span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">READY</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Infinite Trade LLC MT5</div>
                    </div>
                  </div>
                  {selectedPlatform === 'POCKET_OPTION' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                </button>

                {/* 3. MetaTrader 5 Real Account */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlatform('MT5');
                    handleICMarketsPreset();
                  }}
                  className={`p-3 rounded-xl border transition flex items-center justify-between text-left ${
                    selectedPlatform === 'MT5'
                      ? 'bg-gradient-to-r from-blue-950/90 to-cyan-950/70 border-blue-500 text-white shadow-lg shadow-blue-950/50'
                      : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg ${selectedPlatform === 'MT5' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span>MetaTrader 5 Real</span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">READY</span>
                      </div>
                      <div className="text-[10px] text-slate-400">IC Markets, XM, Pepperstone</div>
                    </div>
                  </div>
                  {selectedPlatform === 'MT5' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                </button>
              </div>
            </div>

            {/* Quick 1-Click Presets Ribbon */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400 font-medium">
                1-Click Quick Presets ({selectedPlatform === 'DERIV' ? 'Deriv Real' : selectedPlatform === 'POCKET_OPTION' ? 'Pocket Option' : 'MT5'}):
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedPlatform === 'DERIV' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleDerivLivePreset(false)}
                      className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold shadow-xs transition"
                    >
                      Preset Deriv Real Synthetics (Boom/Crash)
                    </button>
                    <button
                      type="button"
                      onClick={handleDerivFinancialPreset}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium border border-slate-700 transition"
                    >
                      Preset Deriv Real Financial STP
                    </button>
                    <button
                      type="button"
                      onClick={handleDerivDemoPreset}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium border border-slate-700 transition"
                    >
                      Preset Deriv Demo
                    </button>
                  </>
                ) : selectedPlatform === 'POCKET_OPTION' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handlePocketOptionLivePreset(false)}
                      className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold shadow-xs transition"
                    >
                      Preset PO Real (Live Master)
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePocketOptionLivePreset(true)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium border border-slate-700 transition"
                    >
                      Preset PO Real (Safe Read-Only)
                    </button>
                    <button
                      type="button"
                      onClick={handlePocketOptionDemoPreset}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium border border-slate-700 transition"
                    >
                      Preset PO Demo
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleICMarketsPreset}
                      className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold shadow-xs transition"
                    >
                      Preset IC Markets Real MT5
                    </button>
                    <button
                      type="button"
                      onClick={handlePepperstonePreset}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium border border-slate-700 transition"
                    >
                      Preset Pepperstone Real MT5
                    </button>
                    <button
                      type="button"
                      onClick={handleXMPreset}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium border border-slate-700 transition"
                    >
                      Preset XM Global Real MT5
                    </button>
                  </>
                )}
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleConnectSubmit} className="space-y-4">
              {/* Account Security Mode Toggle */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Execution Security Mode</span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    {selectedPlatform === 'POCKET_OPTION' ? 'Pocket Option Protection' : 'MT5 Risk Control'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsReadOnly(false)}
                    className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 ${
                      !isReadOnly
                        ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md shadow-emerald-950/50'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <Zap className={`w-5 h-5 shrink-0 mt-0.5 ${!isReadOnly ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Live Execution Mode</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">START TRADING NOW</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 leading-normal font-sans">
                        Enables 1-click execution into your {selectedPlatform === 'POCKET_OPTION' ? 'Pocket Option' : 'MetaTrader 5'} real account. Supports micro-lots (0.01 lot).
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsReadOnly(true)}
                    className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 ${
                      isReadOnly
                        ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md shadow-indigo-950/50'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <ShieldCheck className={`w-5 h-5 shrink-0 mt-0.5 ${isReadOnly ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Investor Mode (Read-Only)</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">SAFE INSPECT</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 leading-normal font-sans">
                        Inspect live balances and quotes with <strong>zero execution risk</strong> using investor password.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {selectedPlatform === 'DERIV' ? 'Deriv Broker Server' : selectedPlatform === 'POCKET_OPTION' ? 'Pocket Option Server' : 'MT5 Broker Server'}
                  </label>
                  <select
                    value={server}
                    onChange={(e) => setServer(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-blue-500 focus:outline-hidden"
                  >
                    {selectedPlatform === 'DERIV' ? (
                      <>
                        <option value="Deriv-Server">Deriv-Server (Real Synthetic Indices & Boom/Crash)</option>
                        <option value="Deriv-Server-02">Deriv-Server-02 (Real Financial STP / Currencies)</option>
                        <option value="Deriv-Demo">Deriv-Demo (Deriv Practice Demo Server)</option>
                        <option value="CUSTOM">Custom Deriv Server Name...</option>
                      </>
                    ) : selectedPlatform === 'POCKET_OPTION' ? (
                      <>
                        <option value="PocketOption-Live">PocketOption-Live (Pocket Option Real Server)</option>
                        <option value="PocketOption-Demo">PocketOption-Demo (Pocket Option Demo Server)</option>
                        <option value="InfiniteTrade-Live">InfiniteTrade-Live (Infinite Trade LLC Real)</option>
                        <option value="InfiniteTrade-Demo">InfiniteTrade-Demo (Infinite Trade LLC Demo)</option>
                        <option value="CUSTOM">Custom Server Name...</option>
                      </>
                    ) : (
                      <>
                        <option value="ICMarketsSC-Live01">ICMarketsSC-Live01 (IC Markets Global Real)</option>
                        <option value="Pepperstone-Live01">Pepperstone-Live01 (Pepperstone Edge Real)</option>
                        <option value="XMGlobal-MT5-7">XMGlobal-MT5-7 (XM Ultra Low Real)</option>
                        <option value="ForexTime-Live02">ForexTime-Live02 (FXTM Advantage Real)</option>
                        <option value="FTMO-Server-01">FTMO-Server-01 (FTMO Prop Challenge)</option>
                        <option value="Exness-MT5Real">Exness-MT5Real (Exness Global Real)</option>
                        <option value="CUSTOM">Custom MT5 Server Name...</option>
                      </>
                    )}
                  </select>
                </div>

                {server === 'CUSTOM' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Enter Broker Server Name
                    </label>
                    <input
                      type="text"
                      value={customServer}
                      onChange={(e) => setCustomServer(e.target.value)}
                      placeholder={selectedPlatform === 'DERIV' ? 'e.g. Deriv-Server-03' : 'e.g. PocketOption-Live-02'}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-blue-500 focus:outline-hidden"
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Account Type Classification
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setAccountType('REAL')}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition border ${
                          accountType === 'REAL'
                            ? 'bg-rose-950/50 border-rose-600 text-rose-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        Real Account
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccountType('DEMO')}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition border ${
                          accountType === 'DEMO'
                            ? 'bg-blue-950/50 border-blue-600 text-blue-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        Demo Account
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {selectedPlatform === 'DERIV' ? 'Deriv Real Account ID (CR or MT5 Login)' : selectedPlatform === 'POCKET_OPTION' ? 'Pocket Option Account ID' : 'MetaTrader 5 Account Login'}
                  </label>
                  <input
                    type="text"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder={selectedPlatform === 'DERIV' ? 'e.g. CR9418204 or 10492819' : selectedPlatform === 'POCKET_OPTION' ? 'e.g. 1048291' : 'e.g. 5192840'}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-blue-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isReadOnly
                      ? `${selectedPlatform === 'DERIV' ? 'Deriv' : selectedPlatform === 'POCKET_OPTION' ? 'Pocket Option' : 'MT5'} Investor Password (Read-Only)`
                      : `${selectedPlatform === 'DERIV' ? 'Deriv' : selectedPlatform === 'POCKET_OPTION' ? 'Pocket Option' : 'MT5'} Master Password (Live Trading)`}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-blue-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Verification Account Balance ($)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={testBalance}
                    onChange={(e) => setTestBalance(e.target.value)}
                    placeholder="2500"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-blue-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {selectedPlatform === 'DERIV' ? 'Deriv API Token or MT5 Bridge Token' : selectedPlatform === 'POCKET_OPTION' ? 'Pocket Option Cloud Bridge Token' : 'MetaApi Cloud Bridge Gateway Token'}
                  </label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder={selectedPlatform === 'DERIV' ? 'drv_live_••••••••' : selectedPlatform === 'POCKET_OPTION' ? 'po_live_••••••••' : 'mta_live_••••••••'}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-blue-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              {/* Security notice */}
              <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-300 space-y-1 font-mono">
                <div className="flex items-center gap-1.5 text-white font-sans font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Non-Custodial Account Isolation Guarantee</span>
                </div>
                <p className="font-sans text-slate-400 leading-relaxed">
                  Smartpips Traderscheme never holds custody of deposits. Your capital stays 100% inside your {selectedPlatform === 'DERIV' ? 'Deriv Ltd' : selectedPlatform === 'POCKET_OPTION' ? 'Pocket Option' : 'MetaTrader 5 broker'} account.
                </p>
              </div>

              <button
                type="submit"
                disabled={isConnecting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Connecting Bridge to {selectedPlatform === 'DERIV' ? 'Deriv Real Account' : selectedPlatform === 'POCKET_OPTION' ? 'Pocket Option Real' : 'MetaTrader 5 Real'}...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>
                      Connect {selectedPlatform === 'DERIV' ? 'Deriv' : selectedPlatform === 'POCKET_OPTION' ? 'Pocket Option' : 'MetaTrader 5'} {accountType === 'REAL' ? 'Real' : 'Demo'} Account & Start Trading Now
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Setup Guide Card */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveGuideTab('deriv')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition whitespace-nowrap ${
                  activeGuideTab === 'deriv'
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Deriv Guide
              </button>
              <button
                type="button"
                onClick={() => setActiveGuideTab('pocket-option')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition whitespace-nowrap ${
                  activeGuideTab === 'pocket-option'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Pocket Option
              </button>
              <button
                type="button"
                onClick={() => setActiveGuideTab('mt5')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition whitespace-nowrap ${
                  activeGuideTab === 'mt5'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                MT5 Guide
              </button>
              <button
                type="button"
                onClick={() => setActiveGuideTab('wikifx')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition whitespace-nowrap ${
                  activeGuideTab === 'wikifx'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Safety & Audit
              </button>
            </div>

            {activeGuideTab === 'deriv' ? (
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
                <h4 className="text-xs uppercase tracking-wider font-bold text-white flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  <span>How to Connect Your Real Deriv Account:</span>
                </h4>
                <ol className="space-y-2.5 list-decimal list-inside text-slate-300">
                  <li>
                    <strong>Open Deriv Dashboard:</strong> Log into your Deriv account at <code className="text-amber-300 font-mono">app.deriv.com</code> or <code className="text-amber-300 font-mono">deriv.com</code>.
                  </li>
                  <li>
                    <strong>Traders Hub &rarr; CFDs (MT5):</strong> Under the CFDs tab, view your Deriv MT5 account (e.g. CR9418204 or MT5 login) and server: choose <code className="text-amber-300 font-mono">Deriv-Server</code> for Synthetic Indices (Boom/Crash, Volatility 75) or <code className="text-amber-300 font-mono">Deriv-Server-02</code> for Financial STP.
                  </li>
                  <li>
                    <strong>Deriv API Token (Optional):</strong> In Account Settings &rarr; API Token, create a token with Read & Trade permissions to enable instant low-latency cloud execution.
                  </li>
                  <li>
                    <strong>Execute Instant Orders:</strong> 1-click execution executes micro-lots (0.01) up to full lot sizes with automated SL/TP.
                  </li>
                </ol>
              </div>
            ) : activeGuideTab === 'pocket-option' ? (
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
                <h4 className="text-xs uppercase tracking-wider font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-indigo-400" />
                  <span>How to Connect Your Pocket Option Real Account:</span>
                </h4>
                <ol className="space-y-2.5 list-decimal list-inside text-slate-300">
                  <li>
                    <strong>Log into Pocket Option:</strong> Open your Pocket Option trading dashboard.
                  </li>
                  <li>
                    <strong>MT5 Profile Credentials:</strong> In Profile &rarr; MT5 Trading Accounts, view your account number (e.g. 1048291) and server (<code className="text-indigo-300 font-mono">PocketOption-Live</code>).
                  </li>
                  <li>
                    <strong>Choose Investor or Master Mode:</strong> Use Investor Password for risk-free quote and equity audits, or Master Password to start trading live now.
                  </li>
                  <li>
                    <strong>Execute Instant Orders:</strong> 1-click execution executes micro-lots (0.01) up to full lot sizes with automated SL/TP.
                  </li>
                </ol>
              </div>
            ) : activeGuideTab === 'mt5' ? (
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
                <h4 className="text-xs uppercase tracking-wider font-bold text-white flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-blue-400" />
                  <span>How to Connect MetaTrader 5 Real Broker:</span>
                </h4>
                <ol className="space-y-2.5 list-decimal list-inside text-slate-300">
                  <li>
                    <strong>Select Your MT5 Broker:</strong> Choose IC Markets, Pepperstone, XM Global, Exness, FTMO, or enter your custom server.
                  </li>
                  <li>
                    <strong>Enter Account & Password:</strong> Enter your MT5 login number and broker trader password.
                  </li>
                  <li>
                    <strong>MetaApi Gateway Token:</strong> Fast &lt;15ms low-latency order routing via our institutional cloud gateway.
                  </li>
                  <li>
                    <strong>Start Trading Now:</strong> Stream real quotes and execute orders with 1-click execution.
                  </li>
                </ol>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
                <h4 className="text-xs uppercase tracking-wider font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WikiFX Review & Protection Architecture</span>
                </h4>
                <p>
                  <strong>Broker Classification:</strong> Deriv (regulated by MFSA, LFSA, VFSC) and Pocket Option (Infinite Trade LLC) are supported alongside Tier-1 MT5 brokers like IC Markets and Pepperstone.
                </p>
                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 text-[11px]">
                  <strong>How Smartpips Protects You:</strong> Smartpips is an analytics & cloud bridge tool. We never hold your deposits or handle client withdrawals. Your capital remains exclusively in Deriv, Pocket Option, or your MT5 broker.
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* CONNECTED LIVE MT5 / DERIV / POCKET OPTION TERMINAL DASHBOARD */
        <div className="space-y-6">
          {/* Active Broker Connection Summary */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Activity className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-base font-bold text-white">{account.brokerName}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 font-bold">
                      LIVE SYNCED · {account.pingMs}ms
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      account.platformType === 'DERIV'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : account.platformType === 'POCKET_OPTION'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {account.platformType === 'DERIV'
                        ? 'DERIV REAL ACCOUNT BRIDGE'
                        : account.platformType === 'POCKET_OPTION'
                        ? 'POCKET OPTION REAL BRIDGE'
                        : 'METATRADER 5 REAL BRIDGE'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      account.accountType === 'REAL'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {account.accountType === 'REAL' ? 'REAL ACCOUNT' : 'DEMO ACCOUNT'}
                    </span>
                    {account.isReadOnly && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        INVESTOR READ-ONLY MODE (SAFE TEST)
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    Account: #{account.login} · Server: {account.server} · Leverage: 1:{account.leverage}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowOrderModal(true)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition shadow-md ${
                    account.isReadOnly
                      ? 'bg-indigo-700 hover:bg-indigo-600 text-white'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/60'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {account.isReadOnly
                      ? 'Inspect Safe Test Order'
                      : `⚡ Start Trading Now (Execute Live ${account.platformType === 'DERIV' ? 'Deriv' : account.platformType === 'POCKET_OPTION' ? 'PO' : 'MT5'} Order)`}
                  </span>
                </button>

                <button
                  onClick={onDisconnect}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300 text-xs font-semibold border border-slate-700 transition"
                >
                  Disconnect Bridge
                </button>
              </div>
            </div>

            {/* Read-Only Safety Notice if active */}
            {account.isReadOnly && (
              <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-800/60 text-xs text-indigo-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>
                    <strong>Safe Testing Active:</strong> Connected via Investor (Read-Only) credentials. You can monitor live market equity, spreads, and candles without risking real funds.
                  </span>
                </div>
                <button
                  onClick={onDisconnect}
                  className="px-2.5 py-1 rounded bg-indigo-900/60 hover:bg-indigo-800 text-[11px] font-bold text-white transition shrink-0"
                >
                  Switch to Live Execution
                </button>
              </div>
            )}

            {/* Broker Real Financial Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="text-[11px] text-slate-400">Live Balance</div>
                <div className="text-base font-bold font-mono tabular-nums text-white mt-1">
                  ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Broker Balance</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="text-[11px] text-slate-400">Live Equity</div>
                <div className="text-base font-bold font-mono tabular-nums text-white mt-1">
                  ${account.equity.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Real-time valuation</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="text-[11px] text-slate-400">Used Margin</div>
                <div className="text-base font-bold font-mono tabular-nums text-slate-200 mt-1">
                  ${(account.margin != null ? Number(account.margin) : 0).toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">1:{account.leverage || 100} leverage</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="text-[11px] text-slate-400">Free Margin</div>
                <div className="text-base font-bold font-mono tabular-nums text-slate-200 mt-1">
                  ${(account.freeMargin != null ? Number(account.freeMargin) : 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Available capital</div>
              </div>

              <div className="col-span-2 sm:col-span-1 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="text-[11px] text-slate-400">Margin Level</div>
                <div className="text-base font-bold font-mono tabular-nums text-emerald-400 mt-1">
                  {account.marginLevel === Infinity || account.marginLevel == null ? '∞' : `${Number(account.marginLevel).toFixed(1)}%`}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Liquidation safe</div>
              </div>
            </div>
          </div>

          {/* Active Broker Positions Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Live MT5 Open Positions
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 font-bold">
                  {account.positions.length} Active on {account.server}
                </span>
              </div>
            </div>

            {account.positions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No active open positions on {account.server}. Click <strong>"{account.isReadOnly ? 'Inspect Safe Test Order' : 'Execute Live MT5 Order'}"</strong> or use the AI Scanner to route a trade!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/60 text-[10px] uppercase font-mono text-slate-400">
                      <th className="py-2.5 px-3">Ticket</th>
                      <th className="py-2.5 px-3">Symbol</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Lots</th>
                      <th className="py-2.5 px-3 text-right">Open Price</th>
                      <th className="py-2.5 px-3 text-right">Current</th>
                      <th className="py-2.5 px-3 text-right">Profit</th>
                      <th className="py-2.5 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono text-xs">
                    {account.positions.map((pos) => {
                      const isProfit = pos.floatingProfit >= 0;
                      return (
                        <tr key={pos.ticket} className="hover:bg-slate-800/40 transition">
                          <td className="py-3 px-3 text-slate-400">#{pos.ticket}</td>
                          <td className="py-3 px-3 font-bold text-white">{pos.symbol}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                pos.type === 'BUY'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-rose-500/20 text-rose-300'
                              }`}
                            >
                              {pos.type}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-200">{pos.lots}</td>
                          <td className="py-3 px-3 text-right text-slate-300">
                            {pos.openPrice.toFixed(pos.symbol.includes('JPY') ? 3 : 5)}
                          </td>
                          <td className="py-3 px-3 text-right text-slate-200">
                            {pos.currentPrice.toFixed(pos.symbol.includes('JPY') ? 3 : 5)}
                          </td>
                          <td
                            className={`py-3 px-3 text-right font-bold tabular-nums ${
                              isProfit ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {isProfit ? '+' : ''}${pos.floatingProfit.toFixed(2)}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => onClosePosition(pos.ticket)}
                              className="px-2.5 py-1 rounded bg-rose-950/50 hover:bg-rose-900 border border-rose-700/60 text-rose-200 text-[11px] font-sans font-semibold transition"
                            >
                              Close at Broker
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Bridge Transmission Logs */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h5 className="text-[11px] uppercase tracking-wider font-mono text-slate-400 font-bold flex items-center justify-between">
              <span>Cloud Bridge Audit Logs</span>
              <span className="text-[10px] text-emerald-400 font-mono">MetaApi Tunnel: ACTIVE</span>
            </h5>
            <div className="space-y-1 font-mono text-[11px] text-slate-400 max-h-36 overflow-y-auto">
              {account.orderLog.map((log, i) => (
                <div key={i} className="flex items-center justify-between py-0.5 border-b border-slate-900">
                  <span>[{new Date(log.time).toLocaleTimeString()}] Ticket #{log.ticket}: {log.action} {log.symbol} {log.type} {log.lots > 0 ? `${log.lots} lots` : ''}</span>
                  <span className="text-emerald-400 font-bold">{log.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Live Order Placement Drawer */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Execute Real Order via MT5 Bridge</h4>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {account?.isReadOnly && (
              <div className="p-3 rounded-lg bg-amber-950/60 border border-amber-800 text-amber-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong>Protected Safe Mode Active:</strong>
                  <p className="text-[11px] text-amber-200/90 leading-normal">
                    You are connected with an <strong>Investor Password (Read-Only)</strong>. Real trade execution is blocked to safeguard your live capital. To execute live trades, disconnect and connect with your Pocket Option Master Password.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSendLiveOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Currency Pair</label>
                <select
                  value={orderPairKey}
                  onChange={(e) => setOrderPairKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                >
                  {pairs.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.symbol} (Ask: {p.ask.toFixed(p.decimals)} / Bid: {p.bid.toFixed(p.decimals)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrderType('BUY')}
                  className={`p-3 rounded-xl border text-center transition ${
                    orderType === 'BUY'
                      ? 'bg-emerald-950/60 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="font-bold text-emerald-400 text-xs">BUY (Ask)</span>
                  <div className="text-sm font-bold font-mono text-white mt-1">
                    {selectedPair.ask.toFixed(selectedPair.decimals)}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('SELL')}
                  className={`p-3 rounded-xl border text-center transition ${
                    orderType === 'SELL'
                      ? 'bg-rose-950/60 border-rose-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="font-bold text-rose-400 text-xs">SELL (Bid)</span>
                  <div className="text-sm font-bold font-mono text-white mt-1">
                    {selectedPair.bid.toFixed(selectedPair.decimals)}
                  </div>
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Volume (Lots)
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Micro-Lot Recommended: 0.01</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="10.0"
                  value={orderLots}
                  onChange={(e) => setOrderLots(Math.max(0.01, parseFloat(e.target.value) || 0.01))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Stop Loss</label>
                  <input
                    type="number"
                    step="0.00001"
                    placeholder="Price"
                    value={orderSL}
                    onChange={(e) => setOrderSL(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Take Profit</label>
                  <input
                    type="number"
                    step="0.00001"
                    placeholder="Price"
                    value={orderTP}
                    onChange={(e) => setOrderTP(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                  />
                </div>
              </div>

              {orderError && (
                <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center justify-between">
                  <span>{orderError}</span>
                  <button type="button" onClick={() => setOrderError('')} className="p-1 text-slate-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isSendingOrder || Boolean(account?.isReadOnly)}
                className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-white transition shadow-lg ${
                  account?.isReadOnly
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : orderType === 'BUY'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                {account?.isReadOnly
                  ? 'Locked: Read-Only Investor Mode Active'
                  : isSendingOrder
                  ? `Transmitting to ${account?.platformType === 'POCKET_OPTION' ? 'Pocket Option' : 'MT5'}...`
                  : `Send Live Real ${orderType} to ${account?.platformType === 'POCKET_OPTION' ? 'Pocket Option' : 'MT5'}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
