import React from 'react';
import { useGame } from '../context/GameContext';
import { User, ScrollText, Trophy, Settings, Volume2, VolumeX, Flame, LucideIcon } from 'lucide-react';
import { RankBadge } from './RankBadge';

interface NavItem {
  id: 'status' | 'quests' | 'records' | 'settings';
  label: string;
  icon: LucideIcon;
  badge?: number;
}

export const Navigation: React.FC = () => {
  const { gameState, activeTab, setActiveTab, toggleSound } = useGame();
  const { player, quests } = gameState;

  const pendingDailyCount = quests.filter((q) => q.type === 'daily' && !q.completed).length;

  const navItems: NavItem[] = [
    { id: 'status', label: 'STATUS', icon: User },
    { id: 'quests', label: 'QUESTS', icon: ScrollText, badge: pendingDailyCount > 0 ? pendingDailyCount : undefined },
    { id: 'records', label: 'RECORDS', icon: Trophy },
    { id: 'settings', label: 'SYSTEM', icon: Settings },
  ];

  return (
    <>
      {/* Top Header Bar for Desktop & Mobile */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-cyan-500/20 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded border border-cyan-400 bg-cyan-950/50 flex items-center justify-center box-glow-blue overflow-hidden">
              <span className="font-heading font-black text-cyan-300 text-sm">SL</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-cyan-400 font-mono-tech tracking-widest font-bold">THE SYSTEM</span>
                <span className="text-slate-600 font-mono-tech text-xs">|</span>
                <span className="text-xs text-slate-300 font-mono-tech">HUNTER {player.name}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono-tech flex items-center gap-1.5">
                <span>LV. {player.level}</span>
                <span>•</span>
                <span className="text-cyan-400">{player.activeTitle}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Streak Counter Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-cyan-500/30 text-xs font-mono-tech">
              <Flame className={`w-3.5 h-3.5 ${player.dailyStreak > 0 ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} />
              <span className={player.dailyStreak > 0 ? 'text-amber-300 font-bold' : 'text-slate-400'}>
                {player.dailyStreak} {player.dailyStreak === 1 ? 'DAY' : 'DAYS'}
              </span>
            </div>

            {/* Rank Badge */}
            <RankBadge rank={player.rank} size="sm" />

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className="p-1.5 rounded bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 text-slate-400 hover:text-cyan-300 transition-colors"
              title={player.soundEnabled ? 'Mute System Audio' : 'Unmute System Audio'}
              aria-label="Toggle Audio"
            >
              {player.soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Navigation Bar (Mobile First) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-lg border-t border-cyan-500/30 pb-safe">
        <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded transition-all duration-200 ${
                  isActive
                    ? 'text-cyan-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200 font-medium'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
                )}

                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-300 glow-cyan' : ''}`} />
                  {item.badge !== undefined && (
                    <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-mono-tech flex items-center justify-center font-bold">
                      {item.badge}
                    </span>
                  )}
                </div>

                <span className="text-[10px] font-heading tracking-wider mt-1">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
