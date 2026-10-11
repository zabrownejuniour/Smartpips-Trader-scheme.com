import React from 'react';
import { ActiveTab, User } from '../types.ts';
import { PWAInstallButton } from './PWAInstallButton.tsx';
import { UserCheck, Clock, Zap, LogOut } from 'lucide-react';

interface Props {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: User | null;
  onOpenAuth: () => void;
  onOpenCheckout: () => void;
  onOpenPortal: () => void;
  onOpenPlayStore: () => void;
  onLogout: () => void;
  trialDaysLeft: number;
  isTrialExpired: boolean;
  onToggleSimulateExpired: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onOpenCheckout,
  onOpenPortal,
  onOpenPlayStore,
  onLogout,
  trialDaysLeft,
  isTrialExpired,
  onToggleSimulateExpired,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-4">
        {/* Zone 1: Single Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('scanner')}
            className="flex items-center gap-2.5 text-left focus:outline-hidden"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white font-sans">
              Smartpips Traderscheme.com
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single-line, clean hover states) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'scanner'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            AI Scanner & Charts
          </button>

          <button
            onClick={() => setActiveTab('demo')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'demo'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Demo Terminal
          </button>

          <button
            onClick={() => setActiveTab('mt5-bridge')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'mt5-bridge'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            MT5 & Pocket Option Real Bridge
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'billing'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Subscription & Billing
          </button>

          <button
            onClick={() => setActiveTab('website-details')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'website-details'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Ownership & WikiFX Details
          </button>
        </nav>

        {/* Zone 3: Actions & Account Controls */}
        <div className="flex items-center gap-2.5">
          {/* Google Play Store Action Button */}
          <button
            onClick={onOpenPlayStore}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 hover:text-white text-xs font-semibold transition"
            title="Google Play Store App Installation & Android TWA"
          >
            <span>Play Store</span>
          </button>
          {/* Trial / Subscription Status Indicator */}
          {user && (
            <div className="hidden lg:flex items-center gap-2 text-xs">
              {user.subscriptionStatus === 'active' ? (
                <button
                  onClick={onOpenPortal}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition font-mono tabular-nums text-[11px]"
                  title="Active $5/mo Subscription"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Pro Subscribed ($5/mo)</span>
                </button>
              ) : isTrialExpired ? (
                <button
                  onClick={onOpenCheckout}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-300 animate-pulse font-mono tabular-nums text-[11px]"
                >
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  <span>Trial Ended · Unlock for $5/mo</span>
                </button>
              ) : (
                <button
                  onClick={onOpenCheckout}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 hover:bg-blue-500/20 transition font-mono tabular-nums text-[11px]"
                  title="7-Day Free Trial"
                >
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>Trial: {trialDaysLeft}d left</span>
                </button>
              )}
            </div>
          )}

          {/* Test Trial Switcher (for immediate reviewer testing) */}
          <button
            onClick={onToggleSimulateExpired}
            className="hidden xl:inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 bg-slate-900"
            title="Toggle between Active Trial and Expired Trial for testing paywall lock"
          >
            <span>Simulate:</span>
            <strong className={isTrialExpired ? 'text-rose-400' : 'text-emerald-400'}>
              {isTrialExpired ? 'Expired' : 'Active'}
            </strong>
          </button>

          {/* In-App PWA Install Button */}
          <PWAInstallButton />

          {/* User Account / Auth Trigger */}
          {user ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenPortal}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium transition flex items-center gap-1.5"
                title="Account Settings"
              >
                <div className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-[10px] font-bold">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[90px] truncate">{user.fullName}</span>
              </button>

              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition shadow-xs"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (app mode experience) */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 bg-slate-950/90 py-2 px-2 text-[11px]">
        <button
          onClick={() => setActiveTab('scanner')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded ${
            activeTab === 'scanner' ? 'text-blue-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <span>Scanner</span>
        </button>
        <button
          onClick={() => setActiveTab('demo')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded ${
            activeTab === 'demo' ? 'text-blue-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <span>Demo Trade</span>
        </button>
        <button
          onClick={() => setActiveTab('mt5-bridge')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded ${
            activeTab === 'mt5-bridge' ? 'text-blue-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <span>MT5 / PO Bridge</span>
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded ${
            activeTab === 'billing' ? 'text-blue-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <span>Billing</span>
        </button>
        <button
          onClick={() => setActiveTab('website-details')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded ${
            activeTab === 'website-details' ? 'text-blue-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <span>Owner & WikiFX</span>
        </button>
        <button
          onClick={onOpenPlayStore}
          className="flex flex-col items-center gap-1 py-1 px-2 rounded text-emerald-400 font-semibold"
        >
          <span>Play Store</span>
        </button>
      </div>
    </header>
  );
};
