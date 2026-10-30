import React from 'react';

interface ProgressBarProps {
  label: string;
  current: number;
  max: number;
  variant?: 'xp' | 'hp' | 'mp' | 'crimson' | 'amber';
  showValues?: boolean;
  unit?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  current,
  max,
  variant = 'xp',
  showValues = true,
  unit = '',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, max > 0 ? (current / max) * 100 : 0));

  const styles = {
    xp: {
      bar: 'bg-gradient-to-r from-cyan-600 via-sky-400 to-cyan-300',
      glow: 'shadow-[0_0_12px_rgba(0,240,255,0.7)]',
      textColor: 'text-cyan-400',
      border: 'border-cyan-500/30',
    },
    hp: {
      bar: 'bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-300',
      glow: 'shadow-[0_0_12px_rgba(52,211,153,0.7)]',
      textColor: 'text-emerald-400',
      border: 'border-emerald-500/30',
    },
    mp: {
      bar: 'bg-gradient-to-r from-violet-600 via-purple-400 to-fuchsia-300',
      glow: 'shadow-[0_0_12px_rgba(168,85,247,0.7)]',
      textColor: 'text-purple-400',
      border: 'border-purple-500/30',
    },
    crimson: {
      bar: 'bg-gradient-to-r from-rose-700 via-red-500 to-rose-400',
      glow: 'shadow-[0_0_12px_rgba(244,63,94,0.7)]',
      textColor: 'text-rose-400',
      border: 'border-rose-500/30',
    },
    amber: {
      bar: 'bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-300',
      glow: 'shadow-[0_0_12px_rgba(251,191,36,0.7)]',
      textColor: 'text-amber-400',
      border: 'border-amber-500/30',
    },
  };

  const currentStyle = styles[variant];

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between text-xs mb-1 font-mono-tech">
        <span className={`font-bold tracking-wider ${currentStyle.textColor}`}>{label}</span>
        {showValues && (
          <span className="text-slate-300">
            <span className="font-semibold text-white">{current.toLocaleString()}</span>
            <span className="text-slate-400"> / {max.toLocaleString()}{unit}</span>
            <span className="text-xs text-slate-400 ml-1.5 font-sans">({percentage.toFixed(0)}%)</span>
          </span>
        )}
      </div>
      <div className={`relative h-2.5 sm:h-3 w-full bg-slate-900/90 rounded-sm border ${currentStyle.border} overflow-hidden p-[1px]`}>
        <div
          className={`h-full rounded-sm transition-all duration-500 ease-out ${currentStyle.bar} ${currentStyle.glow}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
