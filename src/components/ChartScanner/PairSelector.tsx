import React from 'react';
import { CurrencyPair } from '../../types.ts';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Props {
  pairs: CurrencyPair[];
  selectedPairKey: string;
  onSelectPair: (key: string) => void;
}

export const PairSelector: React.FC<Props> = ({
  pairs,
  selectedPairKey,
  onSelectPair,
}) => {
  return (
    <div className="w-full overflow-x-auto pb-1 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max">
        {pairs.map((p) => {
          const isSelected = p.key === selectedPairKey;
          const isPositive = p.change24h >= 0;

          return (
            <button
              key={p.key}
              onClick={() => onSelectPair(p.key)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-slate-900 border-blue-500/50 shadow-sm shadow-blue-500/10'
                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-100">{p.symbol}</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {p.spread.toFixed(1)}p
                  </span>
                </div>
                <div className="text-[11px] font-mono tabular-nums text-slate-300">
                  {p.bid.toFixed(p.decimals)}
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`flex items-center justify-end text-[11px] font-mono tabular-nums font-semibold ${
                    isPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 mr-0.5" />
                  )}
                  <span>
                    {isPositive ? '+' : ''}
                    {p.change24h.toFixed(2)}%
                  </span>
                </div>
                <span className="text-[9px] text-slate-500 uppercase tracking-wider block">
                  24h
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
