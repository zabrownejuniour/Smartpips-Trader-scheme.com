import React, { useState } from 'react';
import { User } from '../../types.ts';
import { X, CheckCircle2, AlertTriangle, CreditCard, Shield, ExternalLink } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onCancelSub: () => void;
  onOpenCheckout: () => void;
}

export const SubscriptionPortalModal: React.FC<Props> = ({
  isOpen,
  onClose,
  user,
  onCancelSub,
  onOpenCheckout,
}) => {
  const [cancelling, setCancelling] = useState(false);

  if (!isOpen) return null;

  const isSubscribed = user.subscriptionStatus === 'active';
  const isCancelled = user.subscriptionStatus === 'cancelled';

  const handleCancelClick = async () => {
    if (confirm('Are you sure you want to cancel your recurring subscription? You will retain access until the end of the current billing cycle.')) {
      setCancelling(true);
      await onCancelSub();
      setCancelling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">Billing & Subscription Portal</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Plan Card */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Current Plan</span>
                <h4 className="text-base font-bold text-white mt-0.5">Smartpips Traderscheme Pro Trader</h4>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold font-mono text-emerald-400">$5.00 / month</span>
                <div className="text-[10px] text-slate-500 font-mono">Recurring via Stripe</div>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Status:</span>
                {isSubscribed ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Active (Auto-renewing)
                  </span>
                ) : isCancelled ? (
                  <span className="inline-flex items-center gap-1 text-amber-400 font-bold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Cancelled (Active until cycle ends)
                  </span>
                ) : (
                  <span className="text-blue-400 font-bold">7-Day Free Trial Mode</span>
                )}
              </div>

              <div className="text-slate-400 font-mono text-[11px]">
                Account ID: #{user.id.slice(0, 8)}
              </div>
            </div>
          </div>

          {/* Payment Method & Payout Details */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
              <div className="flex items-center gap-2 text-slate-300">
                <CreditCard className="w-4 h-4 text-blue-400" />
                <span>Payment Mode: {
                  user.paymentMethod === 'mpesa' ? 'M-Pesa Mobile Money' :
                  user.paymentMethod === 'airtel_money' ? 'Airtel Money' :
                  user.paymentMethod === 'bank_transfer' ? 'Direct Bank Transfer' :
                  user.paymentMethod === 'crypto' ? 'USDT Crypto' :
                  'Stripe Card / Auto-Debit'
                }</span>
              </div>
              <span className="text-emerald-400 font-mono text-[11px] font-bold">Verified</span>
            </div>

            {/* Owner Bank Settlement Account */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/90 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400">Postbank Payout & Paybill Account</span>
                <div className="text-sm font-bold font-mono text-emerald-400">
                  Paybill: 200999 · Acc: 0109060094245
                </div>
                <div className="text-[10px] text-slate-400">Bank: Postbank Kenya · Beneficiary: zabrowne4@gmail.com</div>
              </div>
              <div className="text-right text-[11px]">
                <span className="text-emerald-400 font-medium font-mono">100% Direct Deposit</span>
                <div className="text-[10px] text-slate-400">Paybill / Mobile / Wire</div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              <strong>Universal Settlement:</strong> Subscriptions are routed into the site owner's Postbank account (Paybill <strong>200999</strong>, Account <strong>0109060094245</strong>). Supported payment rails: M-Pesa, Airtel Money, Direct Bank Wire, Card, and Mobile Wallets.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            {isSubscribed ? (
              <button
                onClick={handleCancelClick}
                disabled={cancelling}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 text-xs font-semibold transition"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
              </button>
            ) : isCancelled ? (
              <button
                onClick={onOpenCheckout}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
              >
                Reactivate Subscription ($5/mo)
              </button>
            ) : (
              <button
                onClick={onOpenCheckout}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
              >
                Upgrade to Pro ($5/mo)
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition ml-auto"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
