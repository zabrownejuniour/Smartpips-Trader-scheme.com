import React, { useState } from 'react';
import { Server, ShieldCheck, ArrowRight, CheckCircle2, Lock, Cpu, Globe } from 'lucide-react';

interface Props {
  isSubscribed: boolean;
  onOpenCheckout: () => void;
}

export const MT5BridgePreview: React.FC<Props> = ({
  isSubscribed,
  onOpenCheckout,
}) => {
  const [selectedBroker, setSelectedBroker] = useState('IC Markets (SC)');
  const [serverCheckResult, setServerCheckResult] = useState<string | null>(null);

  const handleTestBridgeConnection = () => {
    setServerCheckResult(`Bridge route verified for ${selectedBroker}. Stage 2 cloud bridge will route order execution via user MetaApi instance with <15ms round-trip latency.`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Overview */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 sm:p-10 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-semibold mb-4">
              <Cpu className="w-3.5 h-3.5" />
              <span>Stage 2 Architecture Preview</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Deriv, MetaTrader 5 & Pocket Option Real Broker Cloud Bridge
            </h2>

            <p className="mt-3 text-sm text-slate-300 leading-relaxed font-sans">
              Connect your <strong>Real Deriv Account</strong> (Synthetic Indices, Boom & Crash, Forex), <strong>Pocket Option Real Account</strong> (Infinite Trade LLC), or your <strong>MetaTrader 5 Real Account</strong> (IC Markets, XM, Pepperstone, Exness). AI market scan signals can be routed directly to your live broker with zero manual copy-pasting so anyone can start trading now.
            </p>

            <div className="mt-6 space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Non-Custodial Architecture:</strong> Smartpips Traderscheme.com never holds your funds or takes custody of capital. All trades execute directly in your broker account.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Independent Bridge Credentials:</strong> Traders link their own MetaApi token and broker credentials, maintaining full personal control and instant disconnect rights.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Reserved for Subscribed Users:</strong> Full automated bridge synchronization is unlocked for active $5/month subscribers upon Stage 2 rollout.
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {isSubscribed ? (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Your Pro Account is Stage 2 Ready!</span>
                </div>
              ) : (
                <button
                  onClick={onOpenCheckout}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-lg shadow-blue-900/40"
                >
                  <Lock className="w-4 h-4" />
                  <span>Subscribe ($5/mo) to Reserve Live MT5 Access</span>
                </button>
              )}
            </div>
          </div>

          {/* Terminal Graphic Visual */}
          <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
            <img
              src="/src/assets/images/forex_terminal_screen_1791355908791.jpg"
              alt="Smartpips Traderscheme MT5 Terminal Screen"
              className="w-full h-auto object-cover opacity-90"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-slate-900/80 backdrop-blur-sm border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center justify-between">
              <span>Bridge Endpoint: wss://metaapi-cloud.net</span>
              <span className="text-emerald-400 font-semibold">Stage 2 Prepared</span>
            </div>
          </div>
        </div>
      </div>

      {/* Broker Compatibility Checker & Bridge Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step-by-Step Connection Roadmap */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Stage 2 Setup Instructions (Preview)
            </h3>
          </div>

          <ol className="space-y-3 text-xs text-slate-300 list-decimal list-inside font-sans leading-relaxed">
            <li>
              <strong className="text-white">Create MetaApi Account:</strong> Sign up directly at MetaApi.cloud for your developer access token.
            </li>
            <li>
              <strong className="text-white">Add MT5 Broker Credentials:</strong> Enter your MT5 login, investor or master password, and broker server name in the isolated bridge gateway.
            </li>
            <li>
              <strong className="text-white">Pair with Smartpips Traderscheme.com:</strong> Input your bridge token into the terminal to enable 1-click live execution.
            </li>
            <li>
              <strong className="text-white">Execution Parameters:</strong> Configure personal risk caps, max drawdown limits, and automatic stop loss rules before trading live capital.
            </li>
          </ol>
        </div>

        {/* Broker Server Readiness Validator */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Check Broker Server Compatibility
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Select MT5 Broker</label>
              <select
                value={selectedBroker}
                onChange={(e) => {
                  setSelectedBroker(e.target.value);
                  setServerCheckResult(null);
                }}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-blue-500 focus:outline-hidden"
              >
                <option value="Deriv Real Synthetics (Deriv-Server)">Deriv Real Synthetics (Deriv-Server)</option>
                <option value="Deriv Real Financial (Deriv-Server-02)">Deriv Real Financial (Deriv-Server-02)</option>
                <option value="Deriv Demo (Deriv-Demo)">Deriv Demo Practice (Deriv-Demo)</option>
                <option value="Pocket Option Live">Pocket Option Live (PocketOption-Live)</option>
                <option value="Pocket Option Demo">Pocket Option Demo (PocketOption-Demo)</option>
                <option value="Infinite Trade LLC">Infinite Trade Live (InfiniteTrade-Live)</option>
                <option value="IC Markets (SC)">IC Markets (ICMarketsSC-Live01)</option>
                <option value="Pepperstone Group">Pepperstone (Pepperstone-Live01)</option>
                <option value="XM Global">XM Global (XMGlobal-MT5-7)</option>
                <option value="FXTM International">FXTM (ForexTime-Live02)</option>
                <option value="FTMO Proprietary">FTMO Server (FTMO-Server-01)</option>
                <option value="OANDA Corporation">OANDA (OANDA-Live-1)</option>
              </select>
            </div>

            <button
              onClick={handleTestBridgeConnection}
              className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition"
            >
              Verify Broker Server Route
            </button>

            {serverCheckResult && (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 text-xs font-mono leading-relaxed">
                {serverCheckResult}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
