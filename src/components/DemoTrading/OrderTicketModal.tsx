import React, { useState, useEffect } from 'react';
import { CurrencyPair, ScanResult } from '../../types.ts';
import { X, ArrowUpRight, ArrowDownRight, Shield, Target, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pairs: CurrencyPair[];
  defaultPairKey: string;
  prefillSignal?: ScanResult | null;
  onExecuteTrade: (params: {
    pairKey: string;
    type: 'BUY' | 'SELL';
    lots: number;
    stopLoss?: number;
    takeProfit?: number;
  }) => void;
}

export const OrderTicketModal: React.FC<Props> = ({
  isOpen,
  onClose,
  pairs,
  defaultPairKey,
  prefillSignal,
  onExecuteTrade,
}) => {
  const [selectedKey, setSelectedKey] = useState<string>(defaultPairKey);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [lots, setLots] = useState<number>(0.1);
  const [stopLoss, setStopLoss] = useState<string>('');
  const [takeProfit, setTakeProfit] = useState<string>('');

  const currentPair = pairs.find((p) => p.key === selectedKey) || pairs[0];

  // Sync when prefillSignal changes
  useEffect(() => {
    if (prefillSignal) {
      const type = prefillSignal.signal.includes('BUY') ? 'BUY' : 'SELL';
      setTradeType(type);
      setStopLoss(prefillSignal.stopLoss ? prefillSignal.stopLoss.toString() : '');
      setTakeProfit(prefillSignal.takeProfit1 ? prefillSignal.takeProfit1.toString() : '');
    }
  }, [prefillSignal]);

  useEffect(() => {
    if (defaultPairKey) {
      setSelectedKey(defaultPairKey);
    }
  }, [defaultPairKey]);

  if (!isOpen || !currentPair) return null;

  const executionPrice = tradeType === 'BUY' ? currentPair.ask : currentPair.bid;
  const standardLotUnits = 100000;
  const contractSize = lots * standardLotUnits;
  // Margin required with 1:100 leverage
  const marginRequired = (contractSize * currentPair.bid) / 100;
  // Pip value approx ($10 per standard lot for USD quote pairs)
  const pipValue = (lots * 10).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExecuteTrade({
      pairKey: selectedKey,
      type: tradeType,
      lots: Number(lots),
      stopLoss: stopLoss ? parseFloat(stopLoss) : undefined,
      takeProfit: takeProfit ? parseFloat(takeProfit) : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">New Demo Order Ticket</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 border border-blue-500/20 text-blue-400">
              Demo Execution
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Pair Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Currency Pair
            </label>
            <select
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-blue-500 focus:outline-hidden"
            >
              {pairs.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.symbol} ({p.name}) · Bid: {p.bid.toFixed(p.decimals)} / Ask: {p.ask.toFixed(p.decimals)}
                </option>
              ))}
            </select>
          </div>

          {/* Trade Direction Selector (BUY vs SELL) */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTradeType('BUY')}
              className={`p-3 rounded-xl border text-center transition-all ${
                tradeType === 'BUY'
                  ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md shadow-emerald-950/50'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-center gap-1 font-bold text-emerald-400 text-sm">
                <ArrowUpRight className="w-4 h-4" />
                <span>BUY (Ask)</span>
              </div>
              <div className="text-base font-mono tabular-nums font-bold text-white mt-1">
                {currentPair.ask.toFixed(currentPair.decimals)}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTradeType('SELL')}
              className={`p-3 rounded-xl border text-center transition-all ${
                tradeType === 'SELL'
                  ? 'bg-rose-950/60 border-rose-500 text-white shadow-md shadow-rose-950/50'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-center gap-1 font-bold text-rose-400 text-sm">
                <ArrowDownRight className="w-4 h-4" />
                <span>SELL (Bid)</span>
              </div>
              <div className="text-base font-mono tabular-nums font-bold text-white mt-1">
                {currentPair.bid.toFixed(currentPair.decimals)}
              </div>
            </button>
          </div>

          {/* Volume (Lot Size) */}
          <div>
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <span className="font-semibold text-slate-300">Volume (Lots)</span>
              <span className="text-slate-400 font-mono">
                {contractSize.toLocaleString()} units (~${pipValue}/pip)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="10.0"
                value={lots}
                onChange={(e) => setLots(Math.max(0.01, parseFloat(e.target.value) || 0.01))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm font-mono font-bold focus:border-blue-500 focus:outline-hidden"
              />
              <div className="flex items-center gap-1">
                {[0.05, 0.1, 0.5, 1.0].map((quickLot) => (
                  <button
                    key={quickLot}
                    type="button"
                    onClick={() => setLots(quickLot)}
                    className="px-2 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700 transition"
                  >
                    {quickLot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stop Loss & Take Profit Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-rose-400" />
                <span>Stop Loss (Optional)</span>
              </label>
              <input
                type="number"
                step="0.00001"
                placeholder="Price"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>Take Profit (Optional)</span>
              </label>
              <input
                type="number"
                step="0.00001"
                placeholder="Price"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Pre-Execution Specs */}
          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] font-mono text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Execution Price:</span>
              <span className="text-white font-bold">{executionPrice.toFixed(currentPair.decimals)}</span>
            </div>
            <div className="flex justify-between">
              <span>Required Margin (1:100):</span>
              <span className="text-slate-200">${marginRequired.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Spread:</span>
              <span className="text-slate-200">{currentPair.spread} pips</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-bold text-sm text-white transition-all shadow-lg ${
              tradeType === 'BUY'
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/50'
                : 'bg-rose-600 hover:bg-rose-500 shadow-rose-950/50'
            }`}
          >
            Confirm Market {tradeType} ({lots} Lot{lots === 1 ? '' : 's'})
          </button>
        </form>
      </div>
    </div>
  );
};
