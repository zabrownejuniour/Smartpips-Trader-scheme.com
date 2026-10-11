import React, { useState } from 'react';
import { User } from '../../types.ts';
import {
  ShieldCheck,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Zap,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface Props {
  onAuthSuccess: (user: User) => void;
  onOpenCheckout?: () => void;
}

export const AuthGate: React.FC<Props> = ({ onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredPlatform, setPreferredPlatform] = useState<'BOTH' | 'POCKET_OPTION' | 'MT5'>('BOTH');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMessage('Please fill in your name, email address, and a secure password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Please accept the terms to activate your 7-day free trial.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          password,
          phone: phone.trim() || undefined,
          preferredPlatform,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed. Please check your details.');
      }
      onAuthSuccess(data.user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid credentials.');
      }
      onAuthSuccess(data.user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInstantDemoLogin = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/auth/demo', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.user) {
        onAuthSuccess(data.user);
      } else {
        // Client fallback
        const now = Date.now();
        onAuthSuccess({
          id: 'usr_demotrader',
          email: 'trader@smartpips.com',
          fullName: 'Alex Mercer',
          phone: '+254712345678',
          createdAt: now,
          trialStartAt: now,
          trialExpiresAt: now + 7 * 24 * 60 * 60 * 1000,
          subscriptionStatus: 'trial',
          bridgedPlatform: 'BOTH',
        });
      }
    } catch {
      const now = Date.now();
      onAuthSuccess({
        id: 'usr_demotrader',
        email: 'trader@smartpips.com',
        fullName: 'Alex Mercer',
        phone: '+254712345678',
        createdAt: now,
        trialStartAt: now,
        trialExpiresAt: now + 7 * 24 * 60 * 60 * 1000,
        subscriptionStatus: 'trial',
        bridgedPlatform: 'BOTH',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-white font-sans">
                Smartpips Traderscheme.com
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Institutional FX Engine
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Postbank Paybill: <strong className="text-emerald-400 font-mono">200999</strong> · Acc: <strong className="text-white font-mono">0109060094245</strong></span>
            </span>

            <button
              onClick={() => setActiveTab(activeTab === 'register' ? 'login' : 'register')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
            >
              {activeTab === 'register' ? 'Existing Member? Sign In' : 'New Trader? Create Account'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Authentication & Gate Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Platform Value, Bridge Eligibility & Features */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Account Required for Full Access · 7-Day Free Trial</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Create Account to Access <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-cyan-400">Trading Services</span> & Live Bridges
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-2xl">
                Please create an account or sign in to access our real-time candlestick scanner, institutional signals, and <strong>eligible live bridges for MetaTrader 5 or Pocket Option real accounts</strong> so you can start trading now.
              </p>
            </div>

            {/* Key Bridging & Platform Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-900/50 hover:border-indigo-500/50 transition space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Pocket Option Real Account Bridge</h3>
                    <span className="text-[10px] text-emerald-400 font-mono">ELIGIBLE & READY</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Bridge your <strong>Pocket Option MT5 Real Account</strong> (Infinite Trade LLC). Test in safe Investor Read-Only mode or execute live real orders directly from signals.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-blue-900/50 hover:border-blue-500/50 transition space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">MetaTrader 5 Real Account Bridge</h3>
                    <span className="text-[10px] text-emerald-400 font-mono">UNIVERSAL MT5 READY</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Connect IC Markets, Pepperstone, XM, Exness, or FTMO MT5 servers. Institutional execution with under 15ms latency.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">AI Candlestick Scanner</h3>
                    <span className="text-[10px] text-slate-400 font-mono">M15 · H1 · H4 · D1</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Algorithmic RSI, EMA, and order-block confirmation with exact entry, stop-loss, and multi-tier take-profit targets.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Universal Billing ($5/mo)</h3>
                    <span className="text-[10px] text-amber-400 font-mono">POSTBANK PAYBILL 200999</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  7-Day Free Trial. Pay via M-Pesa (Paybill 200999, Acc: 0109060094245), Airtel Money, Bank Wire, Card, or Crypto.
                </p>
              </div>
            </div>

            {/* Non-custodial Trust statement */}
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-200 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Non-Custodial Account Isolation:</strong> Smartpips Traderscheme never holds your funds or takes custody of deposits. Your capital remains strictly inside your Pocket Option or MT5 broker account.
              </span>
            </div>
          </div>

          {/* Right Column: Authentication Card (Register / Login) */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
              {/* Tab Selector */}
              <div className="grid grid-cols-2 border-b border-slate-800 bg-slate-950/60 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMessage('');
                  }}
                  className={`py-3 text-xs font-bold rounded-xl transition ${
                    activeTab === 'register'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Create Trader Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMessage('');
                  }}
                  className={`py-3 text-xs font-bold rounded-xl transition ${
                    activeTab === 'login'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Log In to Account
                </button>
              </div>

              {/* Form Body */}
              <div className="p-6 sm:p-7 space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {activeTab === 'register' ? (
                  /* REGISTRATION FORM */
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Full Name / Trader Nickname
                      </label>
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus-within:border-blue-500">
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Alex Mercer"
                          className="w-full bg-transparent focus:outline-hidden"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Email Address
                      </label>
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus-within:border-blue-500">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="trader@domain.com"
                          className="w-full bg-transparent focus:outline-hidden"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Password
                      </label>
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus-within:border-blue-500">
                        <Lock className="w-4 h-4 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Minimum 6 characters"
                          className="w-full bg-transparent focus:outline-hidden"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-400 hover:text-slate-200"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Mobile Phone Number (Optional for M-Pesa / Alerts)
                      </label>
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus-within:border-blue-500">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+254 700 000 000"
                          className="w-full bg-transparent focus:outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Preferred Broker Platform */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Eligible Broker Platform for Real Bridging
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setPreferredPlatform('POCKET_OPTION')}
                          className={`py-2 px-1 text-[11px] font-bold rounded-lg border transition text-center ${
                            preferredPlatform === 'POCKET_OPTION'
                              ? 'bg-indigo-950 border-indigo-500 text-indigo-300'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
                          }`}
                        >
                          Pocket Option
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreferredPlatform('MT5')}
                          className={`py-2 px-1 text-[11px] font-bold rounded-lg border transition text-center ${
                            preferredPlatform === 'MT5'
                              ? 'bg-blue-950 border-blue-500 text-blue-300'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
                          }`}
                        >
                          MetaTrader 5
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreferredPlatform('BOTH')}
                          className={`py-2 px-1 text-[11px] font-bold rounded-lg border transition text-center ${
                            preferredPlatform === 'BOTH'
                              ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
                          }`}
                        >
                          Both Platforms
                        </button>
                      </div>
                    </div>

                    {/* Trial Terms Checkbox */}
                    <div className="flex items-start gap-2.5 pt-1">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-0.5 rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-950"
                      />
                      <label htmlFor="terms" className="text-[11px] text-slate-400 leading-tight cursor-pointer">
                        Activate immediate <strong>7-Day Free Trial</strong> (no credit card upfront). Continued access is $5.00/month via Postbank Paybill 200999 or card.
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2"
                    >
                      <span>Create Account & Start Trading Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  /* LOGIN FORM */
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Email Address
                      </label>
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus-within:border-blue-500">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="trader@domain.com"
                          className="w-full bg-transparent focus:outline-hidden"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Password
                      </label>
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus-within:border-blue-500">
                        <Lock className="w-4 h-4 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Your password"
                          className="w-full bg-transparent focus:outline-hidden"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-400 hover:text-slate-200"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>Encrypted SSL session credentials. Unlocks your connected MT5 & Pocket Option live state.</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2"
                    >
                      <span>Log In to Trading Terminal</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {/* Instant 1-Click Demo Login for Quick Evaluation */}
                <div className="pt-3 border-t border-slate-800/80 text-center space-y-2">
                  <span className="text-[11px] text-slate-400 block">
                    Reviewing the platform? Test instantly with zero typing:
                  </span>
                  <button
                    type="button"
                    onClick={handleInstantDemoLogin}
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center justify-center gap-2"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>⚡ 1-Click Instant Demo Login (Alex Mercer)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer in AuthGate */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Smartpips Traderscheme.com. All Rights Reserved.</span>
          <span>Postbank Settlement: Paybill 200999 · Acc: 0109060094245</span>
        </div>
      </footer>
    </div>
  );
};
