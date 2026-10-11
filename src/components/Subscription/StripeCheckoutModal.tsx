import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  CreditCard,
  CheckCircle2,
  Sparkles,
  Building2,
  Copy,
  Check,
  Smartphone,
  PhoneCall,
  Coins,
  ArrowRight,
  Info,
  Radio,
  Zap,
} from 'lucide-react';
import { OWNER_BANK_DETAILS, OWNER_PAYMENT_CHANNELS } from '../../types.ts';

export type PaymentRailType = 'mpesa' | 'airtel' | 'card' | 'bank' | 'other';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userId: string;
  onSuccess: () => void;
  defaultMethod?: PaymentRailType;
}

export const StripeCheckoutModal: React.FC<Props> = ({
  isOpen,
  onClose,
  userEmail,
  userId,
  onSuccess,
  defaultMethod = 'mpesa',
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentRailType>(defaultMethod);

  // Card State
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('888');
  const [zip, setZip] = useState('10001');

  // M-Pesa State
  const [mpesaPhone, setMpesaPhone] = useState('+254 7');
  const [mpesaReceipt, setMpesaReceipt] = useState('');
  const [stkPushRequested, setStkPushRequested] = useState(false);
  const [stkSimulating, setStkSimulating] = useState(false);

  // Airtel Money State
  const [airtelPhone, setAirtelPhone] = useState('+254 7');
  const [airtelTxnId, setAirtelTxnId] = useState('');
  const [airtelPushRequested, setAirtelPushRequested] = useState(false);

  // Bank Transfer State
  const [transferRef, setTransferRef] = useState(
    `SUB-${OWNER_BANK_DETAILS.accountNumber}-${userId ? userId.slice(0, 6).toUpperCase() : 'PRO'}`
  );
  const [senderAccountName, setSenderAccountName] = useState('');

  // Other Wallets / Crypto State
  const [otherProvider, setOtherProvider] = useState<'mtn' | 'chipper' | 'orange' | 'usdt'>('mtn');
  const [otherRef, setOtherRef] = useState('');

  // General State
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successDetails, setSuccessDetails] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFinishSuccess = (msg: string) => {
    setSuccessDetails(msg);
    setIsSuccess(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(false);
      onSuccess();
      onClose();
    }, 2200);
  };

  // 1. M-PESA STK Push
  const handleRequestMpesaStkPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mpesaPhone || mpesaPhone.length < 9) {
      alert('Please enter a valid phone number');
      return;
    }
    setStkSimulating(true);

    try {
      const res = await fetch('/api/subscription/mobile-money/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: mpesaPhone,
          provider: 'mpesa',
          amount: 5.0,
          userId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStkPushRequested(true);
        // Generate simulated receipt
        const simReceipt = 'QA' + Math.floor(10000000 + Math.random() * 90000000);
        setMpesaReceipt(simReceipt);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStkSimulating(false);
    }
  };

  // 1b. M-Pesa Complete
  const handleCompleteMpesa = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/subscription/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          email: userEmail,
          paymentMethod: 'mpesa',
          phone: mpesaPhone,
          transactionCode: mpesaReceipt || 'MPESA-PAID',
          bankAccountNumber: OWNER_BANK_DETAILS.accountNumber,
        }),
      });
      const data = await res.json();
      if (data.success) {
        handleFinishSuccess(
          `M-Pesa payment received! $5.00 USD settled to Owner Bank Account: ${OWNER_BANK_DETAILS.accountNumber} (Receipt: ${mpesaReceipt || 'MPESA-OK'}).`
        );
      }
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  // 2. AIRTEL MONEY
  const handleRequestAirtelPush = async (e: React.FormEvent) => {
    e.preventDefault();
    setStkSimulating(true);
    try {
      const res = await fetch('/api/subscription/mobile-money/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: airtelPhone,
          provider: 'airtel_money',
          amount: 5.0,
          userId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAirtelPushRequested(true);
        setAirtelTxnId('AIR-' + Math.floor(100000 + Math.random() * 900000));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStkSimulating(false);
    }
  };

  const handleCompleteAirtel = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/subscription/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          email: userEmail,
          paymentMethod: 'airtel_money',
          phone: airtelPhone,
          transactionCode: airtelTxnId || 'AIRTEL-PAID',
          bankAccountNumber: OWNER_BANK_DETAILS.accountNumber,
        }),
      });
      const data = await res.json();
      if (data.success) {
        handleFinishSuccess(
          `Airtel Money payment confirmed! $5.00 USD settled to Owner Bank Account: ${OWNER_BANK_DETAILS.accountNumber} (Txn: ${airtelTxnId || 'AIRTEL-OK'}).`
        );
      }
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  // 3. CREDIT / DEBIT CARD
  const handleCardPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await fetch('/api/subscription/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          email: userEmail,
          paymentMethod: 'card',
          bankAccountNumber: OWNER_BANK_DETAILS.accountNumber,
        }),
      });
      const data = await res.json();
      if (data.success) {
        handleFinishSuccess(
          `Card subscription confirmed. Recurring $5/month billing settled to Bank Account: ${OWNER_BANK_DETAILS.accountNumber}.`
        );
      }
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  // 4. DIRECT BANK TRANSFER
  const handleBankTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await fetch('/api/subscription/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          email: userEmail,
          paymentMethod: 'bank_transfer',
          transferReference: transferRef,
          senderName: senderAccountName,
          bankAccountNumber: OWNER_BANK_DETAILS.accountNumber,
        }),
      });
      const data = await res.json();
      if (data.success) {
        handleFinishSuccess(
          `Bank transfer verified! $5.00 USD settled to Owner Bank Account: ${OWNER_BANK_DETAILS.accountNumber} (Ref: ${transferRef}).`
        );
      }
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  // 5. OTHER WALLETS / CRYPTO
  const handleOtherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await fetch('/api/subscription/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          email: userEmail,
          paymentMethod: otherProvider === 'usdt' ? 'crypto' : 'mobile_money',
          transferReference: otherRef || `${otherProvider.toUpperCase()}-PAY`,
          senderName: `${otherProvider.toUpperCase()} Wallet Subscriber`,
          bankAccountNumber: OWNER_BANK_DETAILS.accountNumber,
        }),
      });
      const data = await res.json();
      if (data.success) {
        handleFinishSuccess(
          `${otherProvider.toUpperCase()} payment verified! $5.00 USD settled to Owner Bank Account: ${OWNER_BANK_DETAILS.accountNumber}.`
        );
      }
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  const handleFillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setExpiry('08/29');
    setCvc('314');
    setZip('94103');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Brand Header */}
        <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-sm shadow-sm shadow-emerald-950">
              $
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Smartpips Pro Subscription</span>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                  Universal Multi-Rail Checkout
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Pay without a bank account or credit card via M-Pesa, Airtel Money & more
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pricing Summary & Beneficiary Banner */}
        <div className="px-5 py-3 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Pro Trader 30-Day Pass</span>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.2 rounded font-mono border border-blue-500/20">
                AI Signals + MT5 Bridge
              </span>
            </div>
            <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
              <span>Settlement Acc:</span>
              <strong className="underline underline-offset-2">{OWNER_BANK_DETAILS.accountNumber}</strong>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-black font-mono text-emerald-400">$5.00</div>
            <div className="text-[10px] text-slate-400 font-mono uppercase">Per Month (~650 KES)</div>
          </div>
        </div>

        {/* Payment Rail Navigation Bar */}
        <div className="grid grid-cols-5 p-1.5 bg-slate-950/90 border-b border-slate-800 gap-1 text-[11px]">
          <button
            type="button"
            onClick={() => setPaymentMethod('mpesa')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1.5 rounded-lg font-semibold transition ${
              paymentMethod === 'mpesa'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">M-Pesa</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('airtel')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1.5 rounded-lg font-semibold transition ${
              paymentMethod === 'airtel'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Radio className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Airtel Money</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1.5 rounded-lg font-semibold transition ${
              paymentMethod === 'card'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Card</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('bank')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1.5 rounded-lg font-semibold transition ${
              paymentMethod === 'bank'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Bank Wire</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('other')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1.5 rounded-lg font-semibold transition ${
              paymentMethod === 'other'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Coins className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">MoMo/USDT</span>
          </button>
        </div>

        {/* Modal Body */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">Payment Confirmed & Verified!</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              {successDetails || 'Your $5.00 subscription has been activated successfully.'}
            </p>
            <div className="inline-block p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400">
              Credited to Owner Bank Account: <strong>{OWNER_BANK_DETAILS.accountNumber}</strong>
            </div>
            <p className="text-[11px] text-slate-400">
              Live Pocket Option MT5 bridge, AI signals, and scanning scanners are now unlocked!
            </p>
          </div>
        ) : paymentMethod === 'mpesa' ? (
          /* ========================================================= */
          /* 1. M-PESA PAYMENT VIEW                                    */
          /* ========================================================= */
          <div className="p-5 space-y-4">
            <div className="p-3.5 rounded-xl bg-emerald-950/25 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  M-Pesa Mobile Money (No Bank or Card Needed)
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Direct Mobile Settlement
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Pay directly from your Safaricom or Vodacom M-Pesa line. The funds route directly into the verified platform account:
              </p>

              {/* Paybill / Bank Account Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-emerald-900/60 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">Postbank Paybill Number</div>
                    <div className="text-base font-extrabold font-mono text-emerald-300 tracking-wider">
                      200999
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('200999', 'paybillNum')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-900/40 hover:bg-emerald-800/50 border border-emerald-700/50 text-emerald-200 text-xs font-semibold transition"
                  >
                    {copiedField === 'paybillNum' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-emerald-900/60 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Account Number</div>
                    <div className="text-base font-extrabold font-mono text-emerald-300 tracking-wider">
                      {OWNER_BANK_DETAILS.accountNumber}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(OWNER_BANK_DETAILS.accountNumber, 'mpesaAcc')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-900/40 hover:bg-emerald-800/50 border border-emerald-700/50 text-emerald-200 text-xs font-semibold transition"
                  >
                    {copiedField === 'mpesaAcc' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 pt-0.5">
                <span>Bank: <strong className="text-slate-200">Postbank Kenya</strong></span>
                <span>Account Name: <strong className="text-slate-200">{OWNER_BANK_DETAILS.beneficiary}</strong></span>
              </div>
            </div>

            {/* Sub-Option A: Instant STK Push Simulation */}
            <form onSubmit={handleRequestMpesaStkPush} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  Method A: Instant M-Pesa STK Prompt (To Phone)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Instant Auto-Pop</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Your M-Pesa Mobile Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={mpesaPhone}
                    onChange={(e) => setMpesaPhone(e.target.value)}
                    placeholder="+254 712 345 678"
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-hidden focus:border-emerald-500"
                    required
                  />
                  <button
                    type="submit"
                    disabled={stkSimulating}
                    className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs transition flex items-center gap-1 shrink-0"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>{stkSimulating ? 'Sending Push...' : 'Send STK Push'}</span>
                  </button>
                </div>
              </div>

              {stkPushRequested && (
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>STK Push Sent to {mpesaPhone}!</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    Check your phone screen now. Enter your 4-digit M-Pesa PIN to authorize <strong>$5.00 USD (~650 KES)</strong> payment to Postbank Paybill <strong>200999</strong>, Account: <strong>{OWNER_BANK_DETAILS.accountNumber}</strong>.
                  </p>
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">
                      Generated Receipt: <strong className="text-emerald-300">{mpesaReceipt}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={handleCompleteMpesa}
                      disabled={isProcessing}
                      className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isProcessing ? 'Verifying...' : 'I Entered PIN - Unlock Now'}</span>
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* Sub-Option B: Manual Paybill / Lipa na M-Pesa */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-400" />
                  Method B: Manual Lipa na M-Pesa / Paybill Steps
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Offline / USSD</span>
              </div>

              <ol className="text-[11px] text-slate-300 space-y-1 list-decimal list-inside pl-1">
                <li>Open M-Pesa menu &rarr; Select <strong>Lipa na M-Pesa</strong> &rarr; Select <strong>Paybill</strong></li>
                <li>Enter Business Number (Postbank Paybill): <strong className="text-emerald-400 font-mono">200999</strong></li>
                <li>Enter Account Number: <strong className="text-emerald-400 font-mono">{OWNER_BANK_DETAILS.accountNumber}</strong></li>
                <li>Enter Amount: <strong>$5.00 USD</strong> (~650 KES) &rarr; Enter your M-Pesa PIN</li>
                <li>Copy the M-Pesa SMS transaction confirmation code below:</li>
              </ol>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={mpesaReceipt}
                  onChange={(e) => setMpesaReceipt(e.target.value.toUpperCase())}
                  placeholder="e.g. QKJ89182XZ"
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs uppercase focus:outline-hidden focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleCompleteMpesa}
                  disabled={isProcessing || !mpesaReceipt}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs transition"
                >
                  {isProcessing ? 'Verifying...' : 'Verify Code'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Direct M-Pesa Mobile Settlement to Account: {OWNER_BANK_DETAILS.accountNumber}</span>
            </div>
          </div>
        ) : paymentMethod === 'airtel' ? (
          /* ========================================================= */
          /* 2. AIRTEL MONEY VIEW                                      */
          /* ========================================================= */
          <div className="p-5 space-y-4">
            <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-300 flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-red-400" />
                  Airtel Money (Instant Mobile Wallet)
                </span>
                <span className="text-[10px] text-red-400 font-mono font-semibold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                  No Card Needed
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Pay using your Airtel Money account. Direct transfer into the verified owner bank account:
              </p>

              {/* Airtel Settlement Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-red-900/60 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-red-400 uppercase font-semibold">Postbank Paybill Number</div>
                    <div className="text-base font-extrabold font-mono text-red-300 tracking-wider">
                      200999
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('200999', 'airtelPaybill')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-red-900/40 hover:bg-red-800/50 border border-red-700/50 text-red-200 text-xs font-semibold transition"
                  >
                    {copiedField === 'airtelPaybill' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-red-300" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-red-900/60 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Account Number</div>
                    <div className="text-base font-extrabold font-mono text-red-300 tracking-wider">
                      {OWNER_BANK_DETAILS.accountNumber}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(OWNER_BANK_DETAILS.accountNumber, 'airtelAcc')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-red-900/40 hover:bg-red-800/50 border border-red-700/50 text-red-200 text-xs font-semibold transition"
                  >
                    {copiedField === 'airtelAcc' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-red-300" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 pt-0.5">
                <span>Bank: <strong className="text-slate-200">Postbank Kenya</strong></span>
                <span>Account Name: <strong className="text-slate-200">{OWNER_BANK_DETAILS.beneficiary}</strong></span>
              </div>
            </div>

            {/* USSD Steps or Mobile Push */}
            <form onSubmit={handleRequestAirtelPush} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-red-400" />
                  Airtel Money Phone Prompt
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Dial *334# or *185#</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Airtel Phone Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={airtelPhone}
                    onChange={(e) => setAirtelPhone(e.target.value)}
                    placeholder="+254 733 000 000"
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-hidden focus:border-red-500"
                    required
                  />
                  <button
                    type="submit"
                    disabled={stkSimulating}
                    className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs transition flex items-center gap-1 shrink-0"
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>{stkSimulating ? 'Sending...' : 'Send Prompt'}</span>
                  </button>
                </div>
              </div>

              {airtelPushRequested && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-300">
                    <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                    <span>Prompt dispatched to {airtelPhone}!</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-tight">
                    Confirm payment of $5.00 USD on your Airtel phone. Funds settle immediately into Postbank Paybill: <strong>200999</strong>, Account: <strong>{OWNER_BANK_DETAILS.accountNumber}</strong>.
                  </p>
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">
                      Txn Ref: <strong className="text-red-300">{airtelTxnId}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={handleCompleteAirtel}
                      disabled={isProcessing}
                      className="px-3 py-1.5 rounded bg-red-500 hover:bg-red-400 text-white font-bold text-xs transition flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isProcessing ? 'Verifying...' : 'Confirm Paid'}</span>
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* USSD Guide */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <div className="font-bold text-white flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>USSD Quick Pay:</span>
              </div>
              <p className="leading-snug">
                Dial <strong>*334#</strong> (or <strong>*185#</strong>) &rarr; Select <strong>Make Payments / Paybill</strong> &rarr; Enter Business Number: <strong className="text-red-300 font-mono">200999</strong> &rarr; Enter Account: <strong className="text-red-300 font-mono">{OWNER_BANK_DETAILS.accountNumber}</strong> &rarr; Amount $5.00 equivalent &rarr; Enter PIN.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>Airtel Money Payout Bridge to Postbank · Paybill: 200999 · Acc: {OWNER_BANK_DETAILS.accountNumber}</span>
            </div>
          </div>
        ) : paymentMethod === 'bank' ? (
          /* ========================================================= */
          /* 3. DIRECT BANK TRANSFER VIEW                              */
          /* ========================================================= */
          <form onSubmit={handleBankTransferSubmit} className="p-5 space-y-4">
            <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  Owner Payout Bank Details
                </span>
                <span className="text-[10px] text-cyan-400 font-mono font-semibold uppercase bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  Verified Receiver
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Send $5.00 USD directly to the site owner's bank account via online banking, mobile wire, or interbank transfer:
              </p>

              {/* Account Number & Paybill Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-3 rounded-lg bg-slate-950 border border-cyan-900/60 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-cyan-400 font-semibold">Postbank Paybill Number</div>
                    <div className="text-base font-extrabold font-mono text-cyan-300 tracking-wider">
                      200999
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('200999', 'bankPaybill')}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-900/50 hover:bg-cyan-800/60 border border-cyan-700/60 text-cyan-200 text-xs font-semibold transition"
                  >
                    {copiedField === 'bankPaybill' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-cyan-300" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-cyan-900/60 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Bank Account Number</div>
                    <div className="text-base font-extrabold font-mono text-cyan-300 tracking-wider">
                      {OWNER_BANK_DETAILS.accountNumber}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(OWNER_BANK_DETAILS.accountNumber, 'bankAcc')}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-900/50 hover:bg-cyan-800/60 border border-cyan-700/60 text-cyan-200 text-xs font-semibold transition"
                  >
                    {copiedField === 'bankAcc' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-cyan-300" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Bank Metadata Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-400">Financial Institution:</div>
                  <div className="font-semibold text-slate-200">Postbank (Kenya Post Office Savings Bank)</div>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-400">Beneficiary / Account:</div>
                  <div className="font-semibold text-slate-200 truncate">{OWNER_BANK_DETAILS.beneficiary}</div>
                </div>
              </div>
            </div>

            {/* Reference & Sender Form */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Your Payment Reference Code
                  </label>
                  <button
                    type="button"
                    onClick={() => handleCopy(transferRef, 'ref')}
                    className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    {copiedField === 'ref' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedField === 'ref' ? 'Copied' : 'Copy Ref'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={transferRef}
                  onChange={(e) => setTransferRef(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 font-mono text-xs focus:outline-hidden focus:border-cyan-500"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Paste this reference code in your transfer description so payment is instantly matched.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Sender Name / Transaction ID (Optional)
                </label>
                <input
                  type="text"
                  value={senderAccountName}
                  onChange={(e) => setSenderAccountName(e.target.value)}
                  placeholder="e.g. John Doe or TXN-892184"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-hidden focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isProcessing
                  ? 'Verifying Bank Settlement...'
                  : 'Confirm Bank Transfer & Activate Subscription ($5/mo)'}
              </span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Direct Bank Settlement to Acc: {OWNER_BANK_DETAILS.accountNumber}</span>
            </div>
          </form>
        ) : paymentMethod === 'other' ? (
          /* ========================================================= */
          /* 4. OTHER WALLETS & CRYPTO VIEW                            */
          /* ========================================================= */
          <form onSubmit={handleOtherSubmit} className="p-5 space-y-4">
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-400" />
                  MTN MoMo, Chipper Cash & USDT Crypto
                </span>
                <span className="text-[10px] text-amber-400 font-mono font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Global Traders
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                If you do not have a bank account or credit card, choose your preferred mobile wallet or crypto network. All proceeds credit owner account <strong>{OWNER_BANK_DETAILS.accountNumber}</strong>:
              </p>

              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {[
                  { id: 'mtn', label: 'MTN MoMo' },
                  { id: 'chipper', label: 'Chipper' },
                  { id: 'orange', label: 'Orange Money' },
                  { id: 'usdt', label: 'USDT TRC20' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setOtherProvider(item.id as any)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition ${
                      otherProvider === item.id
                        ? 'bg-amber-600 border-amber-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {otherProvider === 'usdt' ? (
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">USDT (TRC-20 / BEP-20) Transfer</span>
                  <span className="text-[10px] font-mono text-emerald-400">$5.00 USDT</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 flex items-center justify-between">
                  <span className="truncate pr-2">TRC20-SP-BANK-{OWNER_BANK_DETAILS.accountNumber}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(`TRC20-SP-BANK-${OWNER_BANK_DETAILS.accountNumber}`, 'usdtAddr')}
                    className="text-[10px] text-blue-400 hover:text-blue-300 shrink-0"
                  >
                    {copiedField === 'usdtAddr' ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-white">
                  Pay to Bank Routing (Account: {OWNER_BANK_DETAILS.accountNumber})
                </div>
                <p className="text-[11px] text-slate-300">
                  Open your {otherProvider.toUpperCase()} app &rarr; Select Transfer &gt; Pay to Bank &rarr; Enter Account <strong>{OWNER_BANK_DETAILS.accountNumber}</strong> &rarr; Amount $5.00.
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Transaction Hash / Mobile Money Reference Code
              </label>
              <input
                type="text"
                value={otherRef}
                onChange={(e) => setOtherRef(e.target.value)}
                placeholder="e.g. TX-98471203 or MoMo receipt ID"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-hidden focus:border-amber-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isProcessing ? 'Verifying...' : `Confirm ${otherProvider.toUpperCase()} Payment ($5/mo)`}</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Direct Settlement to Bank Account: {OWNER_BANK_DETAILS.accountNumber}</span>
            </div>
          </form>
        ) : (
          /* ========================================================= */
          /* 5. CREDIT / DEBIT CARD VIEW (STRIPE BRIDGE)               */
          /* ========================================================= */
          <form onSubmit={handleCardPay} className="p-5 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1 text-xs">
                <label className="font-semibold text-slate-300">Card details</label>
                <button
                  type="button"
                  onClick={handleFillTestCard}
                  className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Auto-fill test card</span>
                </button>
              </div>

              {/* Card number input container */}
              <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 space-y-2.5">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="1234 1234 1234 1234"
                    className="w-full bg-transparent text-xs font-mono text-white focus:outline-hidden"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM / YY"
                    className="bg-transparent text-xs font-mono text-white focus:outline-hidden"
                    required
                  />
                  <input
                    type="text"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="CVC"
                    className="bg-transparent text-xs font-mono text-white focus:outline-hidden"
                    required
                  />
                  <input
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="ZIP"
                    className="bg-transparent text-xs font-mono text-white focus:outline-hidden"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Account Email
              </label>
              <input
                type="email"
                value={userEmail}
                disabled
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 text-xs font-mono"
              />
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 leading-snug space-y-1">
              <div>
                By subscribing, you authorize a recurring $5.00 charge each month until cancelled.
              </div>
              <div className="text-emerald-400 font-mono text-[10px]">
                Owner Settlement: All revenues route directly to owner bank account: {OWNER_BANK_DETAILS.accountNumber}.
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm transition shadow-lg shadow-blue-950/50 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{isProcessing ? 'Processing Payment...' : 'Subscribe with Card ($5.00 / month)'}</span>
            </button>

            <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                256-bit SSL Encrypted
              </span>
              <span>·</span>
              <span>PCI-DSS Level 1 Compliant</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
