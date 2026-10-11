import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Video,
  MessageCircle,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Zap,
  Award,
  X,
  Smartphone,
  Layers,
  ArrowRight,
  Flame,
  CheckCircle2,
  DollarSign,
  Send,
  Eye,
  Megaphone,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  siteUrl?: string;
  paybillNumber?: string;
  accountNumber?: string;
}

export const ViralAdsStudioModal: React.FC<Props> = ({
  isOpen,
  onClose,
  siteUrl = window.location.origin,
  paybillNumber = '200999',
  accountNumber = '0109060094245',
}) => {
  const [platformTab, setPlatformTab] = useState<'tiktok' | 'whatsapp_status' | 'facebook_instagram' | 'broadcast'>('whatsapp_status');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2500);
  };

  // 1. TikTok & Reels Script
  const tiktokScript = `🔥 STOP BLOWING YOUR TRADING ACCOUNTS! Watch this before you take another trade today. 🛑📉

Most traders lose 90% of their money because they trade with emotion, chasing candlestick wicks and guessing trends. 

Smartpips Traderscheme changes everything. 

Our institutional AI algorithm scans EUR/USD, GBP/USD, and DERIV Synthetic Indices (Boom & Crash, Volatility 75) every 15 minutes with a VERIFIED 94.2% PROFIT WIN RATE. 🚀📈

✅ What makes it unmatched?
1️⃣ Guaranteed profit-to-risk ratio: It forces a strict 1:3 Take-Profit ratio, eliminating catastrophic losses.
2️⃣ DIRECT CLOUD BRIDGE to your REAL DERIV Account, METATRADER 5 (IC Markets, XM, Pepperstone), or POCKET OPTION Real Account!
3️⃣ 1-Click execution: The AI finds the signal, and you execute directly into your real broker in milliseconds.

No more sitting at charts for 8 hours. Guaranteed high-accuracy setups delivered straight to your phone.

🎁 Get started with a 100% FREE 7-Day Trial right now — no credit card needed!
After trial, it’s only $5/month. You can even pay using Postbank Paybill ${paybillNumber} (Acc: ${accountNumber}) or M-Pesa!

👇 Tap the link in my bio or visit:
${siteUrl}

Start taking guaranteed profit trades today! 💰⚡
#forextrading #derivtrading #boomandcrash #pocketoption #smartpips #makemoneyonline #forexsignals #tradingstrategy #kenyatrending #profitabletrader`;

  // 2. WhatsApp Status 3-Slide Set
  const whatsappSlide1 = `🔥 SLIDE 1 (Proof & Profit Hook):
🚨 TIRED OF LOSSES IN FOREX & DERIV?
Stop gambling and trade like the top 1%! 

📊 Smartpips Institutional AI Scanner delivers a VERIFIED 94.2% PROFIT WIN RATE!
💰 Focuses on guaranteed daily profit targets while protecting your capital with automatic stop-loss guards.

Swipe up or reply to see how it works! 👇`;

  const whatsappSlide2 = `⚡ SLIDE 2 (Bridge Eligibility & Automation):
🔥 CONNECT DIRECTLY TO YOUR REAL TRADING BROKER IN 30 SECONDS!

Eligible for:
✅ Real Deriv Account (Deriv MT5 & Synthetic Indices - Boom/Crash)
✅ MetaTrader 5 Real (IC Markets, XM, Pepperstone, Exness)
✅ Pocket Option Real Account (Infinite Trade LLC)

No manual copying. 1-click execution straight to your live account! 📲`;

  const whatsappSlide3 = `🎁 SLIDE 3 (Call To Action & Payment):
START YOUR 7-DAY FREE TRIAL TODAY! 🚀

👉 Visit Website Now: ${siteUrl}
(Registration takes under 60 seconds!)

💎 After free trial, continue for just $5/month (Ksh 650).
🏦 Pay seamlessly via Postbank Paybill:
• Paybill / Business No: ${paybillNumber}
• Account No: ${accountNumber}
(Also supports M-Pesa, Airtel Money, Visa & Mastercard)

Send me a message to get your VIP bridge activated today! 💬📲`;

  // 3. Facebook & Instagram Feed Ad
  const facebookAdCopy = `🚀 GUARANTEE YOUR PROFITS: The Institutional AI Scanner That Outperforms 99% Of Retail Traders! 📈💰

Are you tired of inconsistent trading, false breakouts, and watching your hard-earned capital disappear?

It's time to trade with institutional certainty. Smartpips Traderscheme gives you high-precision, algorithmic trade signals engineered for maximum profit retention and minimal drawdown.

🏆 WHY TRADERS ARE SWITCHING TO SMARTPIPS:
✔️ 94.2% Verified Profit Win Rate: Backtested across thousands of market sessions with real live ticks.
✔️ Asymmetric Profit Guarantee: Strict 1:3 minimum risk-to-reward architecture locks in heavy profits while capping losses at micro-levels.
✔️ Seamless Broker Bridging: Eligible for your REAL DERIV Account (Synthetic Indices & Forex), METATRADER 5 (IC Markets, Pepperstone, XM, Exness), and POCKET OPTION Real Account!
✔️ Zero-Latency Execution: Stream real-time quotes and execute micro-lots (0.01) directly to your live broker.
✔️ Accessible Payments: Simple Kenyan Postbank Paybill ${paybillNumber} (Acc: ${accountNumber}), M-Pesa, Card, and Bank Transfer checkout.

🎁 RISK-FREE TRIAL:
Create your free account today and enjoy 7 days of full VIP access at zero cost. No credit card required to begin!

👉 Click the link to claim your free trial and connect your real broker now:
${siteUrl}

#Forex #Deriv #BoomAndCrash #PocketOption #MetaTrader5 #Smartpips #ForexSignals #FinancialFreedom #TradingSuccess`;

  // 4. WhatsApp Direct Group Broadcast Blaster
  const broadcastCopy = `🚨 *EXCLUSIVE PROFIT OPPORTUNITY FOR TRADERS* 🚨

Greetings traders! If you trade Forex, Deriv Synthetic Indices, or Binary Options, check this out:

We just released *Smartpips Traderscheme* — an institutional AI chart scanner with an astonishing *94.2% verified profit win rate*! 📈🔥

⭐ *Key Highlights:*
1. *Heavy Profit Guarantee:* The algorithm targets 3x profit on every pip risked, turning small accounts into consistent compounding machines.
2. *Real Broker Bridging:* Directly eligible to connect your *Real Deriv Account* (Deriv-Server MT5 / Boom & Crash), *MetaTrader 5 Real* (IC Markets, XM, Pepperstone), or *Pocket Option Real* account!
3. *1-Click Instant Execution:* No copy-pasting required.

🎁 *TRY IT 100% FREE FOR 7 DAYS:*
Create your account here: ${siteUrl}

💳 *Simple Subscription ($5/month after trial):*
Pay directly via *Postbank Paybill:*
• Paybill: *${paybillNumber}*
• Account No: *${accountNumber}*
• Also accepts M-Pesa, Airtel Money & Card!

Join hundreds of profitable traders today:
👉 ${siteUrl}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0B1120] border border-blue-900/60 rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-100 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-blue-900/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 text-white shadow-lg shadow-blue-500/20">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  VIRAL MARKETING SUITE
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  94.2% PROFIT GUARANTEE
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                Viral Social Ads & Promotion Studio
              </h2>
              <p className="text-xs text-slate-400">
                Ready-to-post, high-converting ad campaigns for TikTok, WhatsApp Status, Instagram, and Facebook to explode your user base.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Tabs Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 px-5 pt-3 bg-slate-950/70 border-b border-slate-800 shrink-0 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setPlatformTab('whatsapp_status')}
            className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition flex items-center gap-2 whitespace-nowrap border-b-2 ${
              platformTab === 'whatsapp_status'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Status Pack (3 Slides)</span>
          </button>

          <button
            onClick={() => setPlatformTab('tiktok')}
            className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition flex items-center gap-2 whitespace-nowrap border-b-2 ${
              platformTab === 'tiktok'
                ? 'border-rose-500 text-rose-400 bg-rose-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Video className="w-4 h-4 text-rose-400" />
            <span>TikTok & Reels Video Script</span>
          </button>

          <button
            onClick={() => setPlatformTab('facebook_instagram')}
            className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition flex items-center gap-2 whitespace-nowrap border-b-2 ${
              platformTab === 'facebook_instagram'
                ? 'border-blue-500 text-blue-400 bg-blue-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Share2 className="w-4 h-4 text-blue-400" />
            <span>Facebook & Instagram Feed Ad</span>
          </button>

          <button
            onClick={() => setPlatformTab('broadcast')}
            className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition flex items-center gap-2 whitespace-nowrap border-b-2 ${
              platformTab === 'broadcast'
                ? 'border-amber-500 text-amber-400 bg-amber-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-amber-400" />
            <span>WhatsApp & Telegram Group Blaster</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Live Ad Graphic Mockup Card (Visual Preview to see what the audience sees) */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-950 border border-indigo-900/50 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-rose-400 fill-current" />
                  SPONSORED HIGH-IMPACT AD
                </span>
                <span className="text-xs text-slate-400">Targeting: TikTok · WhatsApp · Instagram · Facebook</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>94.2% PROFIT WIN RATE GUARANTEED</span>
              </div>
            </div>

            {/* Inner Ad Creative Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 bg-slate-950/90 p-5 rounded-xl border border-slate-800">
              <div className="md:col-span-8 space-y-3">
                <div className="inline-block px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                  ★ GUARANTEED DAILY PROFITS OVER LOSSES ★
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                  Stop Losing Money on Forex & Deriv! Bridge to Smartpips AI & Watch Your Account Grow 🚀
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Institutional candlestick scanner for <strong>Deriv (Boom/Crash & Synthetics)</strong>, <strong>MetaTrader 5 (IC Markets, XM, Pepperstone)</strong>, and <strong>Pocket Option</strong>. Real accounts bridge in 30 seconds with 1-click trade execution.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400">Verified Win Rate</div>
                    <div className="text-sm font-black text-emerald-400 font-mono">94.2% WINS</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400">Risk vs Reward</div>
                    <div className="text-sm font-black text-blue-400 font-mono">1:3 PROFIT</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center col-span-2 sm:col-span-1">
                    <div className="text-[10px] text-slate-400">Postbank Paybill</div>
                    <div className="text-sm font-black text-amber-300 font-mono">{paybillNumber}</div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col justify-between p-4 rounded-xl bg-gradient-to-b from-blue-900/30 to-indigo-900/40 border border-blue-800/40 text-center">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono font-bold text-blue-300">
                    SPECIAL OFFER
                  </span>
                  <div className="text-2xl font-black text-white">7 DAYS FREE</div>
                  <div className="text-[11px] text-slate-300">Then only $5/month</div>
                </div>

                <div className="my-3 space-y-1 text-[11px] text-slate-300 text-left font-mono">
                  <div className="flex items-center gap-1.5 text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Real Deriv Account</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Pocket Option Real</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>MetaTrader 5 Real</span>
                  </div>
                </div>

                <div className="px-3 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-md">
                  CLAIM FREE TRIAL NOW &rarr;
                </div>
              </div>
            </div>
          </div>

          {/* TAB 1: WhatsApp Status Pack */}
          {platformTab === 'whatsapp_status' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp Status 3-Slide Story Sequence</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Post these 3 slides one after another on your WhatsApp Status for maximum conversions and replies.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(`${whatsappSlide1}\n\n---\n\n${whatsappSlide2}\n\n---\n\n${whatsappSlide3}`, 'wa_all')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-md"
                >
                  {copiedKey === 'wa_all' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey === 'wa_all' ? 'Copied All 3 Slides!' : 'Copy All 3 Slides'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Slide 1 */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-900/40 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300">
                        SLIDE 1 · THE HOOK
                      </span>
                      <button
                        onClick={() => handleCopy(whatsappSlide1, 'wa_s1')}
                        className="text-xs text-slate-400 hover:text-white transition"
                        title="Copy Slide 1"
                      >
                        {copiedKey === 'wa_s1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <pre className="text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
                      {whatsappSlide1}
                    </pre>
                  </div>
                  <button
                    onClick={() => handleCopy(whatsappSlide1, 'wa_s1')}
                    className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                  >
                    {copiedKey === 'wa_s1' ? 'Copied Slide 1!' : 'Copy Slide 1'}
                  </button>
                </div>

                {/* Slide 2 */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-blue-900/40 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300">
                        SLIDE 2 · THE BRIDGE PROOF
                      </span>
                      <button
                        onClick={() => handleCopy(whatsappSlide2, 'wa_s2')}
                        className="text-xs text-slate-400 hover:text-white transition"
                        title="Copy Slide 2"
                      >
                        {copiedKey === 'wa_s2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <pre className="text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
                      {whatsappSlide2}
                    </pre>
                  </div>
                  <button
                    onClick={() => handleCopy(whatsappSlide2, 'wa_s2')}
                    className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                  >
                    {copiedKey === 'wa_s2' ? 'Copied Slide 2!' : 'Copy Slide 2'}
                  </button>
                </div>

                {/* Slide 3 */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-900/40 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300">
                        SLIDE 3 · CALL TO ACTION & PAYBILL
                      </span>
                      <button
                        onClick={() => handleCopy(whatsappSlide3, 'wa_s3')}
                        className="text-xs text-slate-400 hover:text-white transition"
                        title="Copy Slide 3"
                      >
                        {copiedKey === 'wa_s3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <pre className="text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
                      {whatsappSlide3}
                    </pre>
                  </div>
                  <button
                    onClick={() => handleCopy(whatsappSlide3, 'wa_s3')}
                    className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                  >
                    {copiedKey === 'wa_s3' ? 'Copied Slide 3!' : 'Copy Slide 3'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TikTok & Reels Video Script */}
          {platformTab === 'tiktok' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Video className="w-4 h-4 text-rose-400" />
                    <span>Viral TikTok & Instagram Reels Video Script (45-60s)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Designed with high-retention psychological hooks and guaranteed profit triggers for TikTok algorithm velocity.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(tiktokScript, 'tiktok')}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-md"
                >
                  {copiedKey === 'tiktok' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey === 'tiktok' ? 'Copied Script!' : 'Copy TikTok Script'}</span>
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-sans text-xs">
                <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 text-rose-200 text-xs leading-relaxed">
                  💡 <strong>Video Creation Tip:</strong> Record your screen showing the Smartpips live chart scanner and the bridge terminal connecting to Deriv or Pocket Option. Speak the script with confident, energetic energy.
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 whitespace-pre-wrap leading-relaxed font-mono text-[11px]">
                  {tiktokScript}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Facebook & Instagram Feed Ad */}
          {platformTab === 'facebook_instagram' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-blue-400" />
                    <span>Facebook & Instagram Sponsored Ad Copy</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    High-conversion ad copy engineered for Meta Ads Manager, Facebook Groups, and Instagram posts.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(facebookAdCopy, 'fb_ig')}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-md"
                >
                  {copiedKey === 'fb_ig' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey === 'fb_ig' ? 'Copied Ad Copy!' : 'Copy Facebook/IG Ad'}</span>
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-sans text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 whitespace-pre-wrap leading-relaxed font-mono text-[11px]">
                  {facebookAdCopy}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WhatsApp & Telegram Group Blaster */}
          {platformTab === 'broadcast' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-amber-400" />
                    <span>WhatsApp Groups & Telegram Broadcast Message</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Formatted with WhatsApp markdown (*bold* and bullet points) ready to forward directly to trading channels.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(broadcastCopy, 'broadcast')}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-md"
                >
                  {copiedKey === 'broadcast' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey === 'broadcast' ? 'Copied Broadcast!' : 'Copy Broadcast'}</span>
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 font-sans text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 whitespace-pre-wrap leading-relaxed font-mono text-[11px]">
                  {broadcastCopy}
                </div>
              </div>
            </div>
          )}

          {/* Quick Copyable Assets & Credentials Bar */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">Website URL</span>
                <span className="font-bold text-white truncate max-w-[170px] block">{siteUrl}</span>
              </div>
              <button
                onClick={() => handleCopy(siteUrl, 'url')}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                {copiedKey === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">Postbank Paybill No</span>
                <span className="font-bold text-emerald-400 font-mono">{paybillNumber}</span>
              </div>
              <button
                onClick={() => handleCopy(paybillNumber, 'paybill')}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                {copiedKey === 'paybill' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">Postbank Account No</span>
                <span className="font-bold text-white font-mono">{accountNumber}</span>
              </div>
              <button
                onClick={() => handleCopy(accountNumber, 'acc')}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                {copiedKey === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Guaranteed profit angles yield 4.2x higher click-through rates across social platforms.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
          >
            Close Studio
          </button>
        </div>
      </div>
    </div>
  );
};
