import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';
import { Download, Smartphone, X, Monitor, CheckCircle2 } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  // If already running as an installed PWA standalone app, don't show prompt
  if (isInstalled) {
    return (
      <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        <span>App Mode</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition shadow-sm"
        title="Install Smartpips Traderscheme Application to your desktop or mobile home screen"
      >
        {isIOS ? <Smartphone className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
        <span>{isIOS ? 'Install on iOS' : 'Install App'}</span>
      </button>

      {/* Cross-Platform App Installation Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 text-slate-100 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Install Smartpips Traderscheme</h3>
                  <p className="text-[11px] text-slate-400">Full native desktop & mobile app experience</p>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              {isIOS ? (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-white font-semibold">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>iPhone & iPad Safari</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1 leading-relaxed">
                    <li>Tap the <strong>Share</strong> button (square with arrow up) at the bottom.</li>
                    <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                    <li>Tap <strong>Add</strong> in the top right corner.</li>
                  </ol>
                </div>
              ) : (
                <>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <Smartphone className="w-4 h-4 text-emerald-400" />
                      <span>Android / Chrome</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Tap the 3 dots <strong>(⋮)</strong> in Chrome at the top right, then select <strong>Install App</strong> or <strong>Add to Home screen</strong>.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <Monitor className="w-4 h-4 text-blue-400" />
                      <span>Desktop (Chrome, Edge, Brave)</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Click the <strong>Install</strong> icon in the browser address bar (top right) to launch in dedicated app window.
                    </p>
                  </div>
                </>
              )}

              <div className="flex items-center gap-2 text-[11px] text-emerald-400/90 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Instant launch, offline-ready caching, zero browser address bar.</span>
              </div>
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 text-xs font-semibold rounded-xl bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 transition"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};
