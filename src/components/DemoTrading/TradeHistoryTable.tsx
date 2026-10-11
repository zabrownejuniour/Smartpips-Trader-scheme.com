import React from 'react';
import { ClosedTrade } from '../../types.ts';
import { History, CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Props {
  history: ClosedTrade[];
}

export const TradeHistoryTable: React.FC<Props> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 text-center text-slate-400 text-xs">
        <History className="w-5 h-5 mx-auto mb-2 text-slate-500" />
        <span>No closed trades yet in this demo session. Closed positions will appear here with audited P&L records.</span>
      </div>
    );
  }

  const totalRealizedPnl = history.reduce((sum, t) => sum + t.profit, 0);
  const isOverallProfit = totalRealizedPnl >= 0;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl backdrop-blur-md">
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/40 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-slate-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Closed Trade Journal & Audit
          </h4>
        </div>
        <div className="text-xs font-mono tabular-nums">
          <span className="text-slate-400 mr-2">Total Realized P&L:</span>
          <strong className={isOverallProfit ? 'text-emerald-400' : 'text-rose-400'}>
            {isOverallProfit ? '+' : ''}${totalRealizedPnl.toFixed(2)}
          </strong>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800/80 bg-slate-950/60 text-[10px] uppercase tracking-wider text-slate-400 font-mono">
              <th className="py-2.5 px-3">Ticket</th>
              <th className="py-2.5 px-3">Pair</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Lots</th>
              <th className="py-2.5 px-3 text-right">Open</th>
              <th className="py-2.5 px-3 text-right">Close</th>
              <th className="py-2.5 px-3 text-right">Pips</th>
              <th className="py-2.5 px-3 text-right">Realized P&L</th>
              <th className="py-2.5 px-3 text-center">Outcome</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 font-mono tabular-nums text-slate-300">
            {history.map((t) => {
              const isProfit = t.profit > 0;
              const isBuy = t.type === 'BUY';

              return (
                <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-3 text-slate-500 text-[11px]">#{t.ticket}</td>
                  <td className="py-2.5 px-3 font-sans font-bold text-white">{t.symbol}</td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-bold">
                      {isBuy ? (
                        <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 text-rose-400" />
                      )}
                      <span>{t.type}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3">{t.lots.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right">{t.openPrice}</td>
                  <td className="py-2.5 px-3 text-right font-medium text-slate-200">{t.closePrice}</td>
                  <td className={`py-2.5 px-3 text-right font-semibold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isProfit ? '+' : ''}{t.pips.toFixed(1)}p
                  </td>
                  <td className={`py-2.5 px-3 text-right font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isProfit ? '+' : ''}${t.profit.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        isProfit
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {isProfit ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{isProfit ? 'WIN' : 'LOSS'}</span>
                    </span>
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
