import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { SystemWindow } from '../components/SystemWindow';
import { ProgressBar } from '../components/ProgressBar';
import {
  Trophy,
  Award,
  Scroll,
  CheckCircle2,
  Lock,
  Flame,
  Zap,
  Shield,
  Activity,
  Skull,
  Clock,
  Sparkles,
} from 'lucide-react';

export const RecordsPage: React.FC = () => {
  const { gameState, setActiveTitle } = useGame();
  const { titles, achievements, activityLogs, player } = gameState;

  const [activeSection, setActiveSection] = useState<'titles' | 'achievements' | 'logs'>('titles');
  const [logFilter, setLogFilter] = useState<string>('ALL');

  const achievementIcons: Record<string, React.ReactNode> = {
    Flame: <Flame className="w-5 h-5 text-amber-400" />,
    Zap: <Zap className="w-5 h-5 text-cyan-400" />,
    Shield: <Shield className="w-5 h-5 text-purple-400" />,
    Award: <Award className="w-5 h-5 text-emerald-400" />,
    Activity: <Activity className="w-5 h-5 text-rose-400" />,
    Skull: <Skull className="w-5 h-5 text-rose-500" />,
  };

  const filteredLogs = activityLogs.filter((log) => {
    if (logFilter === 'ALL') return true;
    return log.type === logFilter;
  });

  return (
    <div className="space-y-6">
      {/* Records Hub Navigation */}
      <SystemWindow
        title="HUNTER ARCHIVES & RECORDS"
        subtitle="ACHIEVEMENTS, EQUIPPED TITLES & ACTIVITY CHRONOLOGY"
      >
        <div className="flex border-b border-cyan-500/20 mb-5 font-heading text-xs sm:text-sm">
          <button
            onClick={() => setActiveSection('titles')}
            className={`flex-1 py-2.5 px-3 text-center border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeSection === 'titles'
                ? 'border-cyan-400 text-cyan-300 font-bold bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>TITLES ({titles.filter((t) => t.unlocked).length}/{titles.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('achievements')}
            className={`flex-1 py-2.5 px-3 text-center border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeSection === 'achievements'
                ? 'border-cyan-400 text-cyan-300 font-bold bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>ACHIEVEMENTS ({achievements.filter((a) => a.unlocked).length}/{achievements.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('logs')}
            className={`flex-1 py-2.5 px-3 text-center border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeSection === 'logs'
                ? 'border-cyan-400 text-cyan-300 font-bold bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scroll className="w-4 h-4" />
            <span>SYSTEM LOGS</span>
          </button>
        </div>

        {/* SECTION 1: TITLES */}
        {activeSection === 'titles' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400 font-mono-tech mb-3">
              Equip an unlocked title to reflect your Hunter identity in the Status Window.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {titles.map((title) => {
                const isEquipped = player.activeTitle === title.name;

                return (
                  <div
                    key={title.id}
                    className={`p-3.5 rounded-sm border transition-all ${
                      title.unlocked
                        ? isEquipped
                          ? 'bg-cyan-950/40 border-cyan-400 box-glow-blue'
                          : 'bg-slate-900/70 border-cyan-500/30 hover:border-cyan-500/60'
                        : 'bg-slate-950/60 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {title.unlocked ? (
                          <Sparkles className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-600" />
                        )}
                        <h4
                          className={`font-heading font-bold text-sm ${
                            title.unlocked ? 'text-amber-300' : 'text-slate-500'
                          }`}
                        >
                          {title.name}
                        </h4>
                      </div>

                      {title.unlocked && (
                        <button
                          onClick={() => setActiveTitle(title.name)}
                          disabled={isEquipped}
                          className={`px-2.5 py-1 rounded text-[10px] font-heading font-bold transition-all ${
                            isEquipped
                              ? 'bg-cyan-400 text-slate-950 cursor-default'
                              : 'bg-slate-800 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          }`}
                        >
                          {isEquipped ? 'EQUIPPED' : 'EQUIP'}
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 font-mono-tech mt-2 leading-snug">
                      {title.description}
                    </p>

                    <div className="mt-2 text-[10px] font-mono-tech text-slate-500">
                      {title.unlocked ? (
                        <span className="text-emerald-400">UNLOCKED</span>
                      ) : (
                        <span>LOCKED — Meet trial requirement</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 2: ACHIEVEMENTS */}
        {activeSection === 'achievements' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {achievements.map((ach) => {
                return (
                  <div
                    key={ach.id}
                    className={`p-3.5 rounded-sm border transition-all ${
                      ach.unlocked
                        ? 'bg-slate-900/70 border-emerald-500/40'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded border ${
                          ach.unlocked
                            ? 'bg-emerald-950/40 border-emerald-500/50'
                            : 'bg-slate-900 border-slate-800 opacity-50'
                        }`}
                      >
                        {achievementIcons[ach.icon] || <Trophy className="w-5 h-5 text-cyan-400" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`font-heading font-bold text-xs sm:text-sm ${
                              ach.unlocked ? 'text-white' : 'text-slate-400'
                            }`}
                          >
                            {ach.title}
                          </h4>
                          {ach.unlocked && (
                            <span className="text-[10px] font-mono-tech text-emerald-400 flex items-center gap-1 font-bold">
                              <CheckCircle2 className="w-3 h-3" />
                              UNLOCKED
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-400 font-mono-tech mt-1 leading-snug">
                          {ach.description}
                        </p>

                        {!ach.unlocked && (
                          <div className="mt-2.5">
                            <ProgressBar
                              label=""
                              current={ach.progress}
                              max={ach.maxProgress}
                              variant="xp"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 3: SYSTEM ACTIVITY LOGS */}
        {activeSection === 'logs' && (
          <div className="space-y-4">
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2 font-mono-tech text-xs">
              {['ALL', 'quest', 'stat', 'penalty'].map((type) => (
                <button
                  key={type}
                  onClick={() => setLogFilter(type)}
                  className={`px-3 py-1 rounded text-xs transition-all ${
                    logFilter === type
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {filteredLogs.length === 0 ? (
                <div className="py-8 text-center text-slate-500 font-mono-tech text-xs">
                  No activity log entries found.
                </div>
              ) : (
                filteredLogs.map((log) => {
                  const isPenalty = log.type === 'penalty';
                  const isStat = log.type === 'stat';

                  return (
                    <div
                      key={log.id}
                      className={`p-3 rounded border font-mono-tech text-xs transition-all ${
                        isPenalty
                          ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                          : isStat
                          ? 'bg-slate-900/60 border-purple-500/30 text-purple-200'
                          : 'bg-slate-900/50 border-cyan-500/20 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold font-heading text-white text-xs">
                          {log.title}
                        </span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(log.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <p className="text-slate-400 text-xs">{log.description}</p>

                      {log.xpChange !== undefined && (
                        <div className="mt-1 text-[11px] font-bold">
                          <span
                            className={
                              log.xpChange > 0 ? 'text-cyan-400' : 'text-rose-400'
                            }
                          >
                            {log.xpChange > 0 ? `+${log.xpChange} XP` : `${log.xpChange} XP`}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </SystemWindow>
    </div>
  );
};
