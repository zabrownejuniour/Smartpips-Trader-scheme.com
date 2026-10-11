import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Candle, TechnicalIndicators, ScanResult } from '../../types.ts';
import { ZoomIn, ZoomOut, RotateCcw, Activity, Layers } from 'lucide-react';

interface Props {
  symbol: string;
  timeframe: string;
  candles: Candle[];
  indicators: TechnicalIndicators;
  decimals: number;
  scanResult?: ScanResult | null;
  livePrice?: number;
}

export const CandlestickChart: React.FC<Props> = ({
  symbol,
  timeframe,
  candles,
  indicators,
  decimals,
  scanResult,
  livePrice,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 420 });
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showRsiSubplot, setShowRsiSubplot] = useState<boolean>(true);
  const [showEma, setShowEma] = useState<boolean>(true);

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: Math.max(400, entry.contentRect.width),
          height: 420,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Filtered view based on zoom
  const visibleCandles = useMemo(() => {
    const minCount = 20;
    const maxCount = candles.length;
    const count = Math.max(minCount, Math.round(maxCount / zoomLevel));
    return candles.slice(-count);
  }, [candles, zoomLevel]);

  // Layout parameters
  const paddingRight = 70;
  const paddingLeft = 12;
  const paddingTop = 24;
  const mainHeight = showRsiSubplot ? 300 : 380;
  const rsiHeight = showRsiSubplot ? 80 : 0;
  const rsiTop = mainHeight + 20;

  // Price Bounds
  const { minPrice, maxPrice, priceRange } = useMemo(() => {
    if (!visibleCandles.length) return { minPrice: 1, maxPrice: 2, priceRange: 1 };
    let min = Math.min(...visibleCandles.map((c) => c.low));
    let max = Math.max(...visibleCandles.map((c) => c.high));

    if (scanResult) {
      if (scanResult.stopLoss) min = Math.min(min, scanResult.stopLoss);
      if (scanResult.takeProfit2) max = Math.max(max, scanResult.takeProfit2);
      if (scanResult.entryPrice) {
        min = Math.min(min, scanResult.entryPrice);
        max = Math.max(max, scanResult.entryPrice);
      }
    }

    const pad = (max - min) * 0.08 || 0.001;
    min -= pad;
    max += pad;
    return { minPrice: min, maxPrice: max, priceRange: max - min };
  }, [visibleCandles, scanResult]);

  // Coordinate converters
  const candleWidth = Math.max(3, (dimensions.width - paddingLeft - paddingRight) / visibleCandles.length);
  const candleGap = Math.max(1, candleWidth * 0.25);
  const candleBodyWidth = Math.max(2, candleWidth - candleGap);

  const getX = (index: number) => paddingLeft + index * candleWidth + candleWidth / 2;
  const getY = (price: number) => {
    return paddingTop + (1 - (price - minPrice) / priceRange) * (mainHeight - paddingTop);
  };

  // EMA series calculations for visible candles
  const ema20Points = useMemo(() => {
    if (!showEma || visibleCandles.length < 5) return '';
    const points: string[] = [];
    // Approximate rolling EMA curve
    let prev = visibleCandles[0].close;
    visibleCandles.forEach((c, idx) => {
      const k = 2 / 21;
      prev = c.close * k + prev * (1 - k);
      const x = getX(idx);
      const y = getY(prev);
      points.push(`${x},${y}`);
    });
    return points.join(' ');
  }, [visibleCandles, minPrice, priceRange, showEma]);

  const ema50Points = useMemo(() => {
    if (!showEma || visibleCandles.length < 5) return '';
    const points: string[] = [];
    let prev = visibleCandles[0].close;
    visibleCandles.forEach((c, idx) => {
      const k = 2 / 51;
      prev = c.close * k + prev * (1 - k);
      const x = getX(idx);
      const y = getY(prev);
      points.push(`${x},${y}`);
    });
    return points.join(' ');
  }, [visibleCandles, minPrice, priceRange, showEma]);

  // Hover candle
  const hoveredCandle = hoverIndex !== null && visibleCandles[hoverIndex] ? visibleCandles[hoverIndex] : visibleCandles[visibleCandles.length - 1];

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - paddingLeft;
    const idx = Math.floor(mouseX / candleWidth);
    if (idx >= 0 && idx < visibleCandles.length) {
      setHoverIndex(idx);
    } else {
      setHoverIndex(null);
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  // Price scale ticks
  const priceTicks = useMemo(() => {
    const count = 5;
    const ticks: number[] = [];
    for (let i = 0; i <= count; i++) {
      ticks.push(minPrice + (priceRange / count) * i);
    }
    return ticks;
  }, [minPrice, priceRange]);

  return (
    <div className="relative flex flex-col bg-slate-950/80 border border-slate-800/80 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm">
      {/* Chart Top Header & Controls */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 border-b border-slate-800/80 bg-slate-900/60 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-slate-100">
            <span className="text-sm font-bold tracking-tight text-white">{symbol}</span>
            <span className="px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[10px]">
              {timeframe}
            </span>
          </div>

          {hoveredCandle && (
            <div className="hidden sm:flex items-center gap-3 text-slate-400 font-mono tabular-nums text-[11px]">
              <span>O: <strong className="text-slate-200">{hoveredCandle.open.toFixed(decimals)}</strong></span>
              <span>H: <strong className="text-emerald-400">{hoveredCandle.high.toFixed(decimals)}</strong></span>
              <span>L: <strong className="text-rose-400">{hoveredCandle.low.toFixed(decimals)}</strong></span>
              <span>C: <strong className={hoveredCandle.close >= hoveredCandle.open ? 'text-emerald-400' : 'text-rose-400'}>
                {hoveredCandle.close.toFixed(decimals)}
              </strong></span>
            </div>
          )}
        </div>

        {/* Chart View Toggles & Zoom */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEma(!showEma)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              showEma ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
            title="Toggle EMA 20 & 50"
          >
            <Activity className="w-3 h-3" />
            <span>EMA (20/50)</span>
          </button>

          <button
            onClick={() => setShowRsiSubplot(!showRsiSubplot)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              showRsiSubplot ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
            title="Toggle RSI Oscillator"
          >
            <Layers className="w-3 h-3" />
            <span>RSI (14)</span>
          </button>

          <div className="flex items-center border border-slate-800 rounded bg-slate-900">
            <button
              onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
              className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
              className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main SVG Chart Canvas */}
      <div ref={containerRef} className="w-full relative select-none">
        <svg
          width={dimensions.width}
          height={dimensions.height}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="cursor-crosshair block"
        >
          <defs>
            <linearGradient id="rsiGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {priceTicks.map((p, i) => {
            const y = getY(p);
            return (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={dimensions.width - paddingRight}
                  y2={y}
                  stroke="#1E293B"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                {/* Price Label on right scale */}
                <text
                  x={dimensions.width - paddingRight + 8}
                  y={y + 3}
                  fill="#64748B"
                  fontSize="10"
                  fontFamily="monospace"
                  className="tabular-nums"
                >
                  {p.toFixed(decimals)}
                </text>
              </g>
            );
          })}

          {/* Technical Key Support & Resistance Level Overlays */}
          {indicators.support && (
            <g>
              <line
                x1={paddingLeft}
                y1={getY(indicators.support)}
                x2={dimensions.width - paddingRight}
                y2={getY(indicators.support)}
                stroke="#10B981"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.6"
              />
              <rect
                x={dimensions.width - paddingRight + 6}
                y={getY(indicators.support) - 8}
                width={58}
                height={16}
                rx="3"
                fill="#064E3B"
              />
              <text
                x={dimensions.width - paddingRight + 9}
                y={getY(indicators.support) + 3}
                fill="#34D399"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
              >
                SUPP {indicators.support.toFixed(decimals)}
              </text>
            </g>
          )}

          {indicators.resistance && (
            <g>
              <line
                x1={paddingLeft}
                y1={getY(indicators.resistance)}
                x2={dimensions.width - paddingRight}
                y2={getY(indicators.resistance)}
                stroke="#F43F5E"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.6"
              />
              <rect
                x={dimensions.width - paddingRight + 6}
                y={getY(indicators.resistance) - 8}
                width={58}
                height={16}
                rx="3"
                fill="#881337"
              />
              <text
                x={dimensions.width - paddingRight + 9}
                y={getY(indicators.resistance) + 3}
                fill="#FDA4AF"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
              >
                RES {indicators.resistance.toFixed(decimals)}
              </text>
            </g>
          )}

          {/* AI Signal Overlay Targets (Entry, Stop Loss, Take Profit 1, Take Profit 2) */}
          {scanResult && (
            <g>
              {/* Entry Price */}
              {scanResult.entryPrice && (
                <g>
                  <line
                    x1={paddingLeft}
                    y1={getY(scanResult.entryPrice)}
                    x2={dimensions.width - paddingRight}
                    y2={getY(scanResult.entryPrice)}
                    stroke="#3B82F6"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                  <rect
                    x={paddingLeft + 6}
                    y={getY(scanResult.entryPrice) - 9}
                    width={84}
                    height={18}
                    rx="4"
                    fill="#1D4ED8"
                  />
                  <text
                    x={paddingLeft + 12}
                    y={getY(scanResult.entryPrice) + 3}
                    fill="#FFFFFF"
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    ENTRY {scanResult.entryPrice.toFixed(decimals)}
                  </text>
                </g>
              )}

              {/* Stop Loss */}
              {scanResult.stopLoss && (
                <g>
                  <line
                    x1={paddingLeft}
                    y1={getY(scanResult.stopLoss)}
                    x2={dimensions.width - paddingRight}
                    y2={getY(scanResult.stopLoss)}
                    stroke="#EF4444"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                  <rect
                    x={paddingLeft + 6}
                    y={getY(scanResult.stopLoss) - 9}
                    width={72}
                    height={18}
                    rx="4"
                    fill="#991B1B"
                  />
                  <text
                    x={paddingLeft + 12}
                    y={getY(scanResult.stopLoss) + 3}
                    fill="#FEE2E2"
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    SL {scanResult.stopLoss.toFixed(decimals)}
                  </text>
                </g>
              )}

              {/* Take Profit 1 */}
              {scanResult.takeProfit1 && (
                <g>
                  <line
                    x1={paddingLeft}
                    y1={getY(scanResult.takeProfit1)}
                    x2={dimensions.width - paddingRight}
                    y2={getY(scanResult.takeProfit1)}
                    stroke="#10B981"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                  <rect
                    x={paddingLeft + 6}
                    y={getY(scanResult.takeProfit1) - 9}
                    width={76}
                    height={18}
                    rx="4"
                    fill="#065F46"
                  />
                  <text
                    x={paddingLeft + 12}
                    y={getY(scanResult.takeProfit1) + 3}
                    fill="#D1FAE5"
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    TP1 {scanResult.takeProfit1.toFixed(decimals)}
                  </text>
                </g>
              )}
            </g>
          )}

          {/* EMA Curves */}
          {showEma && ema20Points && (
            <polyline
              fill="none"
              stroke="#06B6D4"
              strokeWidth="1.5"
              points={ema20Points}
              opacity="0.8"
            />
          )}
          {showEma && ema50Points && (
            <polyline
              fill="none"
              stroke="#F59E0B"
              strokeWidth="1.5"
              points={ema50Points}
              opacity="0.8"
            />
          )}

          {/* Candlesticks Rendering */}
          {visibleCandles.map((c, i) => {
            const x = getX(i);
            const isBullish = c.close >= c.open;
            const candleColor = isBullish ? '#10B981' : '#EF4444';
            const openY = getY(c.open);
            const closeY = getY(c.close);
            const highY = getY(c.high);
            const lowY = getY(c.low);
            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.max(2, Math.abs(openY - closeY));

            return (
              <g key={c.time} className="transition-opacity">
                {/* Wick */}
                <line
                  x1={x}
                  y1={highY}
                  x2={x}
                  y2={lowY}
                  stroke={candleColor}
                  strokeWidth="1.2"
                />
                {/* Body */}
                <rect
                  x={x - candleBodyWidth / 2}
                  y={bodyTop}
                  width={candleBodyWidth}
                  height={bodyHeight}
                  fill={candleColor}
                  rx="1"
                />
              </g>
            );
          })}

          {/* Current Live Market Ticker Line */}
          {livePrice && (
            <g>
              <line
                x1={paddingLeft}
                y1={getY(livePrice)}
                x2={dimensions.width - paddingRight}
                y2={getY(livePrice)}
                stroke="#60A5FA"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <rect
                x={dimensions.width - paddingRight}
                y={getY(livePrice) - 9}
                width={68}
                height={18}
                fill="#2563EB"
                rx="3"
              />
              <text
                x={dimensions.width - paddingRight + 5}
                y={getY(livePrice) + 4}
                fill="#FFFFFF"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {livePrice.toFixed(decimals)}
              </text>
            </g>
          )}

          {/* Interactive Crosshair Tracking Cursor */}
          {hoverIndex !== null && visibleCandles[hoverIndex] && (
            <g pointerEvents="none">
              <line
                x1={getX(hoverIndex)}
                y1={paddingTop}
                x2={getX(hoverIndex)}
                y2={dimensions.height - 24}
                stroke="#94A3B8"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.7"
              />
              <line
                x1={paddingLeft}
                y1={getY(visibleCandles[hoverIndex].close)}
                x2={dimensions.width - paddingRight}
                y2={getY(visibleCandles[hoverIndex].close)}
                stroke="#94A3B8"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.7"
              />
              {/* Horizontal crosshair price badge */}
              <rect
                x={dimensions.width - paddingRight}
                y={getY(visibleCandles[hoverIndex].close) - 8}
                width={65}
                height={16}
                fill="#334155"
                rx="2"
              />
              <text
                x={dimensions.width - paddingRight + 4}
                y={getY(visibleCandles[hoverIndex].close) + 4}
                fill="#F8FAFC"
                fontSize="9.5"
                fontFamily="monospace"
              >
                {visibleCandles[hoverIndex].close.toFixed(decimals)}
              </text>
            </g>
          )}

          {/* RSI Subplot Panel */}
          {showRsiSubplot && (
            <g>
              {/* RSI Subplot border */}
              <line
                x1={paddingLeft}
                y1={rsiTop}
                x2={dimensions.width - paddingRight}
                y2={rsiTop}
                stroke="#334155"
                strokeWidth="1"
              />

              {/* 70 Overbought band */}
              <line
                x1={paddingLeft}
                y1={rsiTop + rsiHeight * 0.3}
                x2={dimensions.width - paddingRight}
                y2={rsiTop + rsiHeight * 0.3}
                stroke="#EF4444"
                strokeWidth="0.8"
                strokeDasharray="2 2"
                opacity="0.4"
              />
              <text
                x={dimensions.width - paddingRight + 6}
                y={rsiTop + rsiHeight * 0.3 + 3}
                fill="#EF4444"
                fontSize="9"
                fontFamily="monospace"
              >
                70
              </text>

              {/* 30 Oversold band */}
              <line
                x1={paddingLeft}
                y1={rsiTop + rsiHeight * 0.7}
                x2={dimensions.width - paddingRight}
                y2={rsiTop + rsiHeight * 0.7}
                stroke="#10B981"
                strokeWidth="0.8"
                strokeDasharray="2 2"
                opacity="0.4"
              />
              <text
                x={dimensions.width - paddingRight + 6}
                y={rsiTop + rsiHeight * 0.7 + 3}
                fill="#10B981"
                fontSize="9"
                fontFamily="monospace"
              >
                30
              </text>

              {/* RSI 50 center line */}
              <line
                x1={paddingLeft}
                y1={rsiTop + rsiHeight * 0.5}
                x2={dimensions.width - paddingRight}
                y2={rsiTop + rsiHeight * 0.5}
                stroke="#475569"
                strokeWidth="0.8"
                strokeDasharray="2 2"
                opacity="0.3"
              />

              {/* RSI Label */}
              <text
                x={paddingLeft + 6}
                y={rsiTop + 14}
                fill="#38BDF8"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                RSI(14): {indicators.rsi}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Chart Footer Indicator Legends */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2 border-t border-slate-800/80 bg-slate-900/40 text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-cyan-400 inline-block rounded"></span>
            <span>EMA 20: {indicators.ema20.toFixed(decimals)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-amber-400 inline-block rounded"></span>
            <span>EMA 50: {indicators.ema50.toFixed(decimals)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-emerald-400 inline-block rounded"></span>
            <span>RSI: {indicators.rsi}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <span>Real-time Market Feed</span>
          <span>·</span>
          <span>Ultra-low Latency</span>
        </div>
      </div>
    </div>
  );
};
