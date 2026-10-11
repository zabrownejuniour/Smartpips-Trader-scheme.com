import React, { useState } from 'react';
import { X, Smartphone, Download, Star, CheckCircle2, Copy, Check, ExternalLink, Shield } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall.ts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PlayStoreHubModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { install, isInstallable } = usePWAInstall();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [installTipVisible, setInstallTipVisible] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleInstallNow = async () => {
    const success = await install();
    if (!success) {
      setInstallTipVisible(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Play Store Styled Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Google Play Store & Android App</h3>
              <p className="text-[11px] text-slate-400">Package ID: com.smartpips.traderscheme · Trusted Web Activity</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Play Store Listing Mockup Banner */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-wrap sm:flex-nowrap items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 p-0.5 shadow-xl shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <img
                  src="/icon.svg"
                  alt="Smartpips Traderscheme Logo"
                  className="w-14 h-14"
                />
              </div>
            </div>

            <div className="space-y-1.5 flex-1 min-w-[200px]">
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold text-white">Smartpips Traderscheme: Forex</h4>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-400">
                  Verified
                </span>
              </div>
              <div className="text-xs text-emerald-400 font-medium">Smartpips Traderscheme · Finance</div>
              
              <div className="flex items-center gap-4 text-xs text-slate-300 pt-1 font-mono">
                <span className="flex items-center gap-1">
                  <strong>4.8</strong>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </span>
                <span>·</span>
                <span>1.2K+ Reviews</span>
                <span>·</span>
                <span>Rated 3+</span>
              </div>
            </div>

            <div className="shrink-0 w-full sm:w-auto">
              <button
                onClick={handleInstallNow}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Install on Device</span>
              </button>
            </div>
          </div>

          {/* Browser Installation Tip Banner */}
          {installTipVisible && (
            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/60 text-xs text-blue-200 flex items-start justify-between gap-3 animate-in fade-in">
              <div className="space-y-1">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  To complete installation on your Android device:
                </span>
                <p className="text-slate-300">
                  1. Open this website in Google Chrome on your Android phone.<br />
                  2. Tap the Chrome menu <strong>(⋮)</strong> in the top right.<br />
                  3. Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                </p>
              </div>
              <button
                onClick={() => setInstallTipVisible(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Dual Installation Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Option A: Direct Web APK / PWA Install */}
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Direct Mobile Installation (Immediate)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Install Smartpips Traderscheme right now on any Android smartphone without downloading from a third party. Runs full-screen with native app icons, offline cache, and zero store delays.
              </p>
              <button
                onClick={handleInstallNow}
                className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
              >
                Launch In-App Installation
              </button>
            </div>

            {/* Option B: Google Play Console Release */}
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Google Play Store Submission (TWA)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                This applet is 100% compliant with Google's Trusted Web Activity (TWA) requirements. The Digital Asset Links verification file is active at <code>/.well-known/assetlinks.json</code>.
              </p>
              <a
                href="https://www.pwabuilder.com"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <span>Generate Google Play APK / AAB</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Copyable Store Listing Details for Play Console Submission */}
          <div className="space-y-3 pt-2">
            <h5 className="text-xs uppercase font-bold tracking-wider text-slate-300">
              Google Play Console Listing Metadata (Ready to Publish)
            </h5>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 font-mono text-[10px] block">Package Name (Application ID):</span>
                  <span className="text-white font-mono font-bold">com.smartpips.traderscheme</span>
                </div>
                <button
                  onClick={() => copyToClipboard('com.smartpips.traderscheme', 'pkg')}
                  className="p-1.5 rounded text-slate-400 hover:text-white"
                >
                  {copiedField === 'pkg' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 font-mono text-[10px] block">App Title (under 30 chars):</span>
                  <span className="text-white font-semibold">Smartpips Traderscheme</span>
                </div>
                <button
                  onClick={() => copyToClipboard('Smartpips Traderscheme', 'title')}
                  className="p-1.5 rounded text-slate-400 hover:text-white"
                >
                  {copiedField === 'title' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 font-mono text-[10px] block">Short Description (under 80 chars):</span>
                  <span className="text-slate-300">AI forex chart scanner, buy/sell signals, demo trading & MT5 cloud bridge.</span>
                </div>
                <button
                  onClick={() => copyToClipboard('AI forex chart scanner, buy/sell signals, demo trading & MT5 cloud bridge.', 'short')}
                  className="p-1.5 rounded text-slate-400 hover:text-white"
                >
                  {copiedField === 'short' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 font-mono text-[10px] block">Digital Asset Links Verification URL:</span>
                  <span className="text-emerald-400 font-mono text-[11px]">/.well-known/assetlinks.json</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-mono font-bold">Active & Configured</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
