import React from 'react';
import { useGame } from '../context/GameContext';
import { X, Bell, Zap, AlertOctagon } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notifications, dismissNotification } = useGame();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
      {notifications.map((item) => {
        const isWarning = item.type === 'warning' || item.type === 'penalty';
        const isReward = item.type === 'reward' || item.type === 'levelup';

        const borderStyle = isWarning
          ? 'border-rose-500 bg-rose-950/90 text-rose-100 box-glow-red'
          : isReward
          ? 'border-cyan-400 bg-slate-900/95 text-cyan-50 box-glow-blue'
          : 'border-cyan-500/50 bg-slate-900/90 text-slate-100';

        const IconComponent = isWarning
          ? AlertOctagon
          : isReward
          ? Zap
          : Bell;

        return (
          <div
            key={item.id}
            className={`pointer-events-auto relative flex items-start gap-3 p-3.5 rounded border ${borderStyle} backdrop-blur-lg shadow-2xl transition-all duration-300 animate-pulse-subtle`}
          >
            {/* Tech Corner accents */}
            <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-current opacity-80" />
            <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-current opacity-80" />

            <div className={`mt-0.5 p-1 rounded ${isWarning ? 'text-rose-400' : 'text-cyan-400'}`}>
              <IconComponent className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0 pr-4">
              <h4 className="text-xs font-bold tracking-wider font-heading uppercase text-cyan-300">
                {item.title}
              </h4>
              <p className="text-xs text-slate-200 mt-0.5 font-mono-tech leading-snug break-words">
                {item.message}
              </p>
            </div>

            <button
              onClick={() => dismissNotification(item.id)}
              className="text-slate-400 hover:text-white transition-colors p-1"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
