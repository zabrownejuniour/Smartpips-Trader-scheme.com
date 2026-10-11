import React from 'react';

interface Props {
  timeframe: string;
  onChangeTimeframe: (tf: string) => void;
  disabled?: boolean;
}

const TIMEFRAMES = [
  { key: 'M15', label: '15 Min', desc: 'Scalping & intraday entries' },
  { key: 'H1', label: '1 Hour', desc: 'Primary institutional swing' },
  { key: 'H4', label: '4 Hours', desc: 'Higher timeframe trend' },
  { key: 'D1', label: '1 Day', desc: 'Macro structural bias' },
];

export const TimeframeSelector: React.FC<Props> = ({
  timeframe,
  onChangeTimeframe,
  disabled = false,
}) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-slate-900/80 border border-slate-800 rounded-lg">
      {TIMEFRAMES.map((tf) => {
        const isActive = timeframe === tf.key;
        return (
          <button
            key={tf.key}
            disabled={disabled}
            onClick={() => onChangeTimeframe(tf.key)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              isActive
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={tf.desc}
          >
            {tf.key}
          </button>
        );
      })}
    </div>
  );
};
