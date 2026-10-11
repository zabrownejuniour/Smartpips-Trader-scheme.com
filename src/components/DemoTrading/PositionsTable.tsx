import React from 'react';
import { DemoPosition } from '../../types.ts';
import { ArrowUpRight, ArrowDownRight, X, TrendingUp } from 'lucide-react';

interface Props {
  positions: DemoPosition[];
  onClosePosition: (positionId: string) => void;
  onOpenNewOrder: () => void;
}

export const PositionsTable: React.FC<Props> = ({
  positions,
  onClosePosition,
  onOpenNewOrder,
}) => {
  if (positions.length === 0) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-8 text-center backdrop-blur-md">
        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-3">
          <TrendingUp className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-white">No Open Demo Positions</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
          Open a simulated position to test strategies using live currency prices and risk management rules.
        </p>
        <button
          onClick={onOpenNewOrder}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
        >
          Open First Demo Position
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl backdrop-blur-md">
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Open Market Positions
          </h4>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/10 text-blue-400">
            {positions.length} Active
          </span>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">Real-Time P&L Tracking</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800/80 bg-slate-950/60 text-[10px] uppercase tracking-wider text-slate-400 font-mono">
              <th className="py-2.5 px-3">Ticket</th>
              <th className="py-2.5 px-3">Pair</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Lots</th>
              <th className="py-2.5 px-3 text-right">Open Price</th>
              <th className="py-2.5 px-3 text-right">Current</th>
              <th className="py-2.5 px-3 text-right">SL / TP</th>
              <th className="py-2.5 px-3 text-right">Pips</th>
              <th className="py-2.5 px-3 text-right">Floating P&L</th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 font-mono tabular-nums text-slate-200">
            {positions.map((pos) => {
              const isProfit = pos.floatingProfit >= 0;
              const isBuy = pos.type === 'BUY';

              return (
                <tr key={pos.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 text-slate-500 text-[11px]">#{pos.ticket}</td>
                  <td className="py-3 px-3 font-sans font-bold text-white">{pos.symbol}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                        isBuy
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {isBuy ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {pos.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-300">{pos.lots.toFixed(2)}</td>
                  <td className="py-3 px-3 text-right">{pos.openPrice}</td>
                  <td className="py-3 px-3 text-right font-bold text-white">{pos.currentPrice}</td>
                  <td className="py-3 px-3 text-right text-[11px] text-slate-400">
                    <div>{pos.stopLoss ? `SL: ${pos.stopLoss}` : '-'}</div>
                    <div>{pos.takeProfit ? `TP: ${pos.takeProfit}` : '-'}</div>
                  </td>
                  <td className={`py-3 px-3 text-right font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isProfit ? '+' : ''}{pos.pips.toFixed(1)}p
                  </td>
                  <td className={`py-3 px-3 text-right font-bold text-sm ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isProfit ? '+' : ''}${pos.floatingProfit.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => onClosePosition(pos.id)}
                      className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-700 text-[11px] font-sans transition flex items-center gap-1 mx-auto"
                      title="Close market order and realize profit/loss"
                    >
                      <X className="w-3 h-3" />
                      <span>Close</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
