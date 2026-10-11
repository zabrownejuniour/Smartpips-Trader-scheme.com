import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';

export const RiskDisclaimerBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-950/40 border-b border-amber-900/50 px-4 py-2 text-xs text-amber-200/90 flex items-center justify-between transition-all">
      <div className="flex items-center gap-2 max-w-5xl mx-auto">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="leading-snug">
          <strong>Regulatory Risk Notice:</strong> Smartpips Traderscheme.com is an independent algorithmic technology and educational platform, NOT an investment broker or financial advisor. We never accept investor deposits or hold custody of trading capital. MT5 bridging routes solely to user-owned accounts at regulated, WikiFX-verified brokers. Forex and CFD trading carry high financial risk.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-amber-400 hover:text-amber-200 p-1 shrink-0 ml-2"
        title="Dismiss notice"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
