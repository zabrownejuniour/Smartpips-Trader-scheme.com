import React from 'react';
import { ShieldCheck, Zap } from 'lucide-react';

interface Props {
  onOpenCheckout: () => void;
  onOpenPortal: () => void;
}

export const Footer: React.FC<Props> = ({ onOpenCheckout, onOpenPortal }) => {
  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-slate-950 py-10 px-4 sm:px-6 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-bold text-white tracking-tight">Smartpips Traderscheme.com</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Institutional algorithmic forex scanner delivering probabilistic market analysis, automated support/resistance identification, and risk-managed demo practice terminals.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Payments routed securely via Stripe Merchant Services</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-200 mb-3">Platform Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#scanner" className="hover:text-white transition-colors">AI Chart Scanner</a></li>
              <li><a href="#demo" className="hover:text-white transition-colors">Demo Trading Terminal</a></li>
              <li><a href="#mt5" className="hover:text-white transition-colors">MetaTrader 5 Bridge (Stage 2)</a></li>
              <li>
                <button onClick={onOpenPortal} className="hover:text-white transition-colors text-left">
                  Billing & Customer Portal
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-200 mb-3">Membership & Terms</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenCheckout} className="text-blue-400 hover:text-blue-300 font-semibold">
                  Subscribe ($5.00/month)
                </button>
              </li>
              <li><span>7-Day Free Trial Policy</span></li>
              <li><span>Zero-Lockin 1-Click Cancellation</span></li>
              <li><span>Stripe Merchant Payout Terms</span></li>
            </ul>
          </div>
        </div>

        {/* Regulatory Risk Disclaimer */}
        <div className="pt-6 border-t border-slate-900 text-[11px] text-slate-500 leading-relaxed space-y-2">
          <p>
            <strong>IMPORTANT REGULATORY RISK DISCLOSURE:</strong> The information provided by Smartpips Traderscheme.com is strictly for educational and informational purposes and does not constitute financial, investment, legal, or tax advice. Foreign exchange and CFD trading on margin involve significant risk and may not be suitable for all investors. High leverage can work against you as well as for you. Past performance or algorithmic signal probability is not indicative of future market results.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-[11px] text-slate-500">
            <span>© {new Date().getFullYear()} Smartpips Traderscheme.com Technologies · Owner: zabrowne4@gmail.com</span>
            <span>WikiFX Safe Harbor Compliant: Pure Non-Custodial SaaS. Zero client fund pooling.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
