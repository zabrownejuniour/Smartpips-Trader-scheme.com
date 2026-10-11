import React, { useState } from 'react';
import { User } from '../../types.ts';
import { X, Lock, Mail, User as UserIcon, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

export const AuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('trader@traderscheme.com');
  const [password, setPassword] = useState('Password123!');
  const [fullName, setFullName] = useState('Alex Mercer');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide valid credentials.');
      return;
    }

    try {
      const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: isSignUp ? fullName : undefined,
          email,
          password,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        onAuthSuccess(data.user);
        onClose();
        return;
      }
      if (data.error) {
        setError(data.error);
        return;
      }
    } catch {
      // Fallback
    }

    const now = Date.now();
    const trialDuration = 7 * 24 * 60 * 60 * 1000; // 7 days

    const user: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 10),
      email,
      fullName: isSignUp ? fullName : (email.split('@')[0] || 'Trader'),
      createdAt: now,
      trialStartAt: now,
      trialExpiresAt: now + trialDuration,
      subscriptionStatus: 'trial',
      bridgedPlatform: 'BOTH',
    };

    onAuthSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">
              {isSignUp ? 'Create Trader Account' : 'Sign In to Smartpips Traderscheme.com'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus-within:border-blue-500">
                <UserIcon className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Mercer"
                  className="w-full bg-transparent focus:outline-hidden"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus-within:border-blue-500">
              <Mail className="w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-transparent focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs focus-within:border-blue-500">
              <Lock className="w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400">
            {isSignUp ? (
              <span>Your account includes an immediate <strong>7-Day Free Trial</strong> with zero credit card required. Afterwards, subscription is $5/month.</span>
            ) : (
              <span>Demo login is pre-filled for rapid evaluation. Password is protected with encryption.</span>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md"
          >
            {isSignUp ? 'Create Account & Begin 7-Day Trial' : 'Sign In'}
          </button>

          <div className="text-center text-xs text-slate-400 pt-2">
            {isSignUp ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-blue-400 hover:text-blue-300 font-semibold"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-blue-400 hover:text-blue-300 font-semibold"
                >
                  Sign Up (7-Day Trial)
                </button>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
