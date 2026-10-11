import React from 'react';
import { ScanResult } from '../../types.ts';
import { TrendingUp, TrendingDown, Target, Shield, ArrowRight, Play, Info } from 'lucide-react';

interface Props {
  symbol: string;
  timeframe: string;
  result: ScanResult;
  decimals: number;
  pipSize: number;
  onExecuteDemo: (signal: ScanResult) => void;
  onExecuteMT5Live?: (signal: ScanResult) => void;
  isMt5Connected?: boolean;
}

export const ScanResultCard: React.FC<Props> = ({
  symbol,
  timeframe,
  result,
  decimals,
  pipSize,
  onExecuteDemo,
  onExecuteMT5Live,
  isMt5Connected,
}) => {
  const isBuy = result.signal.includes('BUY');
  const isSell = result.signal.includes('SELL');

  const slPips = Math.abs(Math.round((result.entryPrice - result.stopLoss) / pipSize));
  const tp1Pips = Math.abs(Math.round((result.takeProfit1 - result.entryPrice) / pipSize));
  const tp2Pips = Math.abs(Math.round((result.takeProfit2 - result.entryPrice) / pipSize));

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Signal Header Banner */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/40">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg flex items-center justify-center ${
                isBuy
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : isSell
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-slate-700/20 text-slate-300 border border-slate-700/30'
              }`}
            >
              {isBuy ? (
                <TrendingUp className="w-5 h-5" />
              ) : isSell ? (
                <TrendingDown className="w-5 h-5" />
              ) : (
                <Info className="w-5 h-5" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-base sm:text-lg font-black tracking-wide ${
                    isBuy ? 'text-emerald-400' : isSell ? 'text-rose-400' : 'text-slate-300'
                  }`}
                >
                  {result.signal}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {symbol} · {timeframe}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 max-w-xl">{result.summary}</p>
            </div>
          </div>

          {/* Confidence Score & Execution Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-right mr-1">
              <div className="text-xs text-slate-400">AI Confidence</div>
              <div className="text-sm sm:text-base font-bold font-mono tabular-nums text-white flex items-center justify-end gap-1.5">
                <span>{result.confidence}%</span>
                <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden inline-block">
                  <div
                    className={`h-full rounded-full ${
                      result.confidence > 80
                        ? 'bg-emerald-500'
                        : result.confidence > 70
                        ? 'bg-blue-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">{result.validity}</div>
            </div>

            <button
              onClick={() => onExecuteDemo(result)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition"
              title="Execute with simulated money in Demo Terminal"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Copy to Demo</span>
            </button>

            {onExecuteMT5Live && (
              <button
                onClick={() => onExecuteMT5Live(result)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-950/50"
                title="Route order directly into connected MetaTrader 5 or Pocket Option broker"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Execute Live Bridge {isMt5Connected ? '(Live)' : '(MT5 / PO)'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Target Levels Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-px bg-slate-800/60 p-px">
        {/* Entry */}
        <div className="bg-slate-900/90 p-3 sm:p-4 text-center">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-center gap-1">
            <Target className="w-3 h-3 text-blue-400" />
            <span>Entry Price</span>
          </div>
          <div className="text-sm sm:text-base font-bold font-mono tabular-nums text-white mt-1">
            {result.entryPrice.toFixed(decimals)}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">Market Execution</div>
        </div>

        {/* Stop Loss */}
        <div className="bg-slate-900/90 p-3 sm:p-4 text-center">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-center gap-1">
            <Shield className="w-3 h-3 text-rose-400" />
            <span>Stop Loss</span>
          </div>
          <div className="text-sm sm:text-base font-bold font-mono tabular-nums text-rose-400 mt-1">
            {result.stopLoss.toFixed(decimals)}
          </div>
          <div className="text-[10px] text-rose-400/80 font-mono mt-0.5">-{slPips} pips risk</div>
        </div>

        {/* Take Profit 1 */}
        <div className="bg-slate-900/90 p-3 sm:p-4 text-center">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>Take Profit 1</span>
          </div>
          <div className="text-sm sm:text-base font-bold font-mono tabular-nums text-emerald-400 mt-1">
            {result.takeProfit1.toFixed(decimals)}
          </div>
          <div className="text-[10px] text-emerald-400/80 font-mono mt-0.5">+{tp1Pips} pips (primary)</div>
        </div>

        {/* Take Profit 2 */}
        <div className="bg-slate-900/90 p-3 sm:p-4 text-center">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>Take Profit 2</span>
          </div>
          <div className="text-sm sm:text-base font-bold font-mono tabular-nums text-emerald-300 mt-1">
            {result.takeProfit2.toFixed(decimals)}
          </div>
          <div className="text-[10px] text-emerald-400/80 font-mono mt-0.5">+{tp2Pips} pips (runner)</div>
        </div>

        {/* Risk : Reward */}
        <div className="col-span-2 sm:col-span-1 bg-slate-900/90 p-3 sm:p-4 text-center">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            Risk : Reward
          </div>
          <div className="text-sm sm:text-base font-bold font-mono tabular-nums text-cyan-300 mt-1">
            {result.riskReward}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">Asymmetric R:R</div>
        </div>
      </div>

      {/* Structured AI Analysis Breakdown */}
      <div className="p-4 sm:p-5 space-y-4">
        <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400">
          AI Technical & Structural Analysis
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span>Market Structure & Trend Dynamics</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans">{result.structure.trend}</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Momentum & Oscillator Confluence</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans">{result.structure.momentum}</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>Key Support & Resistance Confluences</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans">{result.structure.keyLevels}</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
            <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              <span>Risk Management & Invalidation</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans">{result.structure.riskNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
