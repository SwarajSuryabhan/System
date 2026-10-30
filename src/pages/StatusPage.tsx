import React from 'react';
import { useGame } from '../context/GameContext';
import { SystemWindow } from '../components/SystemWindow';
import { RankBadge } from '../components/RankBadge';
import { ProgressBar } from '../components/ProgressBar';
import { PenaltyOverlay } from '../components/PenaltyOverlay';
import {
  getXpRequiredForLevel,
  calculateMaxHp,
  calculateMaxMp,
  STAT_INFO,
} from '../game/gameLogic';
import { PlayerStatKey } from '../types';
import {
  Dumbbell,
  Brain,
  Heart,
  Zap,
  ShieldCheck,
  Plus,
  Flame,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const StatusPage: React.FC = () => {
  const { gameState, allocateStatPoint, setActiveTab } = useGame();
  const { player, quests } = gameState;

  const xpRequired = getXpRequiredForLevel(player.level);
  const maxHp = calculateMaxHp(player.stats.VIT);
  const maxMp = calculateMaxMp(player.stats.INT);

  const dailyQuests = quests.filter((q) => q.type === 'daily');
  const completedDailyCount = dailyQuests.filter((q) => q.completed).length;

  const statIcons: Record<PlayerStatKey, React.ReactNode> = {
    STR: <Dumbbell className="w-4 h-4 text-rose-400" />,
    INT: <Brain className="w-4 h-4 text-cyan-400" />,
    VIT: <Heart className="w-4 h-4 text-emerald-400" />,
    AGI: <Zap className="w-4 h-4 text-amber-400" />,
    DIS: <ShieldCheck className="w-4 h-4 text-purple-400" />,
  };

  const statKeys: PlayerStatKey[] = ['STR', 'AGI', 'INT', 'VIT', 'DIS'];

  return (
    <div className="space-y-6">
      <PenaltyOverlay />

      {/* Main Status Window */}
      <SystemWindow
        title="HUNTER STATUS WINDOW"
        subtitle="SYSTEM ID: #000-SHADOW-PLAYER"
        badge={<RankBadge rank={player.rank} size="md" showLabel />}
      >
        {/* Hunter Identity Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-b border-cyan-500/20 font-mono-tech text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">NAME</span>
            <span className="text-sm sm:text-base font-bold text-white font-heading">
              {player.name}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">LEVEL</span>
            <span className="text-sm sm:text-base font-black text-cyan-300 font-heading">
              {player.level.toString().padStart(2, '0')}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">TITLE</span>
            <span className="text-xs sm:text-sm font-semibold text-amber-300 truncate block">
              {player.activeTitle}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">JOB</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-300">
              None (Player)
            </span>
          </div>
        </div>

        {/* Vital Gauges (HP, MP, XP) */}
        <div className="space-y-3.5 my-4">
          <ProgressBar label="HP (HEALTH POINTS)" current={maxHp} max={maxHp} variant="hp" />
          <ProgressBar label="MP (MANA POINTS)" current={maxMp} max={maxMp} variant="mp" />
          <ProgressBar
            label="XP (EXPERIENCE)"
            current={player.currentXP}
            max={xpRequired}
            variant="xp"
            unit=" XP"
          />
        </div>

        {/* Attribute Distribution Header */}
        <div className="flex items-center justify-between pt-3 pb-2 border-t border-cyan-500/20">
          <h4 className="text-xs font-bold font-heading text-cyan-300 tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            ATTRIBUTES / STATS
          </h4>
          <div className="text-xs font-mono-tech">
            <span className="text-slate-400">AVAILABLE POINTS: </span>
            <span
              className={`font-black px-2 py-0.5 rounded ${
                player.availableStatPoints > 0
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 box-glow-blue animate-pulse'
                  : 'text-slate-400 bg-slate-900 border border-slate-700'
              }`}
            >
              {player.availableStatPoints}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
          {statKeys.map((key) => {
            const info = STAT_INFO[key];
            const value = player.stats[key];
            const canAllocate = player.availableStatPoints > 0;

            return (
              <div
                key={key}
                className="flex items-center justify-between p-2.5 rounded bg-slate-900/60 border border-cyan-500/20 hover:border-cyan-500/40 transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded bg-slate-950 border border-cyan-500/30">
                    {statIcons[key]}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-200 font-heading">
                        {key}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono-tech hidden xs:inline">
                        ({info.name})
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono-tech line-clamp-1">
                      {info.description}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-heading font-black text-base sm:text-lg text-cyan-300 font-mono-tech w-8 text-right">
                    {value}
                  </span>

                  <button
                    onClick={() => allocateStatPoint(key)}
                    disabled={!canAllocate}
                    className={`w-7 h-7 rounded flex items-center justify-center transition-all ${
                      canAllocate
                        ? 'bg-cyan-500/30 hover:bg-cyan-400 text-cyan-200 hover:text-slate-950 border border-cyan-400 box-glow-blue active:scale-90'
                        : 'bg-slate-800 text-slate-600 border border-slate-700/50 cursor-not-allowed opacity-40'
                    }`}
                    title={canAllocate ? `Add point to ${key}` : 'No stat points available'}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </SystemWindow>

      {/* Daily Progress & Streak Quick Widget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Daily Quests Status Card */}
        <div
          onClick={() => setActiveTab('quests')}
          className="p-4 rounded-sm bg-system-panel border border-cyan-500/30 hover:border-cyan-400 box-glow-blue cursor-pointer transition-all hover:scale-[1.01] group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-wider font-bold">
              TODAY'S QUESTS
            </span>
            <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-heading text-white">
              {completedDailyCount} / {dailyQuests.length}
            </span>
            <span className="text-xs font-mono-tech text-slate-400">
              {dailyQuests.length > 0 && completedDailyCount === dailyQuests.length
                ? 'ALL COMPLETE'
                : 'PENDING'}
            </span>
          </div>

          <div className="mt-3">
            <ProgressBar
              label=""
              current={completedDailyCount}
              max={dailyQuests.length || 1}
              variant={completedDailyCount === dailyQuests.length ? 'xp' : 'amber'}
              showValues={false}
            />
          </div>
        </div>

        {/* Streak Counter Card */}
        <div className="p-4 rounded-sm bg-system-panel border border-cyan-500/30 box-glow-blue flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-wider font-bold">
              DAILY STREAK
            </span>
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
          </div>

          <div className="my-2">
            <span className="text-3xl font-black font-heading text-amber-300">
              {player.dailyStreak} {player.dailyStreak === 1 ? 'DAY' : 'DAYS'}
            </span>
            <p className="text-xs text-slate-400 font-mono-tech mt-0.5">
              Best record: <span className="text-white font-bold">{player.bestStreak} days</span>
            </p>
          </div>

          <p className="text-[10px] text-slate-400 font-mono-tech">
            Complete all daily quests before midnight to maintain streak and avoid the Penalty Zone.
          </p>
        </div>
      </div>
    </div>
  );
};
