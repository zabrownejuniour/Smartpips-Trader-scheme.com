import React from 'react';
import { DemoAccount } from '../../types.ts';
import { Wallet, TrendingUp, ShieldCheck, DollarSign, RotateCcw, Plus } from 'lucide-react';

interface Props {
  account: DemoAccount;
  onResetBalance: () => void;
  onOpenNewOrder: () => void;
}

export const DemoAccountSummary: React.FC<Props> = ({
  account,
  onResetBalance,
  onOpenNewOrder,
}) => {
  const positions = account?.positions || [];
  const history = account?.history || [];
  const balance = account?.balance ?? 10000;
  const equity = account?.equity ?? balance;
  const margin = account?.margin ?? 0;
  const freeMargin = account?.freeMargin ?? balance;
  const marginLevel = account?.marginLevel ?? Infinity;

  const floatingTotal = positions.reduce((acc, p) => acc + (p?.floatingProfit ?? 0), 0);
  const isProfit = floatingTotal >= 0;

  const totalClosed = history.length;
  const winningTrades = history.filter((t) => (t?.profit ?? 0) > 0).length;
  const winRate = totalClosed > 0 ? ((winningTrades / totalClosed) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Demo Trading Terminal</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                Real Market Prices · Fake Capital
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Risk-free practice execution connected to live quotes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetBalance}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
            title="Reset balance to initial $10,000"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Balance</span>
          </button>

          <button
            onClick={onOpenNewOrder}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Order</span>
          </button>
        </div>
      </div>

      {/* Account Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Balance */}
        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-medium">Balance</div>
          <div className="text-base sm:text-lg font-bold font-mono tabular-nums text-white mt-1">
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">Realized Capital</div>
        </div>

        {/* Equity */}
        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-medium">Equity</div>
          <div className="text-base sm:text-lg font-bold font-mono tabular-nums text-white mt-1">
            ${equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">Live Account Value</div>
        </div>

        {/* Floating P&L */}
        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-medium">Floating P&L</div>
          <div
            className={`text-base sm:text-lg font-bold font-mono tabular-nums mt-1 ${
              isProfit ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isProfit ? '+' : ''}
            ${floatingTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            {positions.length} open position{positions.length === 1 ? '' : 's'}
          </div>
        </div>

        {/* Free Margin */}
        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-medium">Free Margin</div>
          <div className="text-base sm:text-lg font-bold font-mono tabular-nums text-slate-200 mt-1">
            ${freeMargin.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            Margin: ${(margin != null ? Number(margin) : 0).toFixed(2)}
          </div>
        </div>

        {/* Margin Level */}
        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-medium">Margin Level</div>
          <div className="text-base sm:text-lg font-bold font-mono tabular-nums text-slate-200 mt-1">
            {marginLevel === Infinity || marginLevel == null ? '∞' : `${Number(marginLevel).toFixed(1)}%`}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">1:100 Leverage</div>
        </div>

        {/* Win Rate */}
        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-medium">Win Rate</div>
          <div className="text-base sm:text-lg font-bold font-mono tabular-nums text-emerald-400 mt-1">
            {winRate}%
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            {winningTrades}/{totalClosed} closed wins
          </div>
        </div>
      </div>
    </div>
  );
};
