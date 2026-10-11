import React from 'react';
import { Lock, CheckCircle2, ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onOpenCheckout: () => void;
  onResetTrial: () => void;
}

export const TrialGateModal: React.FC<Props> = ({
  isOpen,
  onOpenCheckout,
  onResetTrial,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight">
          Your 7-Day Free Trial Has Concluded
        </h3>
        
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
          Access to AI market scans and live demo terminal features is locked. Continue institutional analysis with our low-cost recurring subscription.
        </p>

        {/* Pricing Box */}
        <div className="my-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="text-sm font-bold text-white">Pro Trader Membership</div>
              <div className="text-xs text-slate-400">Full platform access · Auto-renews monthly</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black font-mono text-emerald-400">$5.00</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Per Month</div>
            </div>
          </div>

          <div className="mt-3 space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Unlimited AI chart scans across 8 major currency pairs</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Complete demo trading terminal with real-time price feeds</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>High-probability entry, stop loss, and take profit levels</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Priority eligibility for Stage 2 real MT5 account bridging</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onOpenCheckout}
          className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2"
        >
          <span>Upgrade to Pro ($5/month) · M-Pesa, Airtel, Card, or Wire</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>Postbank Paybill: 200999 · Acc: 0109060094245 (M-Pesa, Airtel, Card, Wire) · Instant Activation</span>
        </div>

        {/* Reviewer / Testing convenience option */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-center">
          <button
            onClick={onResetTrial}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Tester: Reset 7-Day Trial for Review</span>
          </button>
        </div>
      </div>
    </div>
  );
};
