import React from 'react';
import { useGame } from '../context/GameContext';
import { ArrowUpRight, Zap, Shield, Sparkles } from 'lucide-react';
import { RankBadge } from './RankBadge';

export const LevelUpModal: React.FC = () => {
  const { pendingLevelUp, dismissLevelUp, setActiveTab } = useGame();

  if (!pendingLevelUp) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-6 bg-slate-950/95 border-2 border-cyan-400 rounded-sm box-glow-blue text-center animate-level-up">
        {/* Holographic Top Corner Brackets */}
        <span className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-300" />
        <span className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-300" />
        <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-300" />
        <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-300" />

        {/* System Header */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 text-xs font-mono-tech tracking-wider">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>[SYSTEM ANNOUNCEMENT]</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black font-heading tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-cyan-400 glow-cyan">
          LEVEL UP!
        </h2>
        <p className="text-sm text-cyan-200/80 mt-1 font-mono-tech">
          The Player has overcome physical limitations.
        </p>

        {/* Level Progression Display */}
        <div className="flex items-center justify-center gap-4 my-6 py-4 px-6 bg-slate-900/80 border border-cyan-500/30 rounded">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 font-mono-tech">PREVIOUS</span>
            <span className="text-2xl font-black font-heading text-slate-400">
              LV. {pendingLevelUp.previousLevel}
            </span>
          </div>

          <ArrowUpRight className="w-8 h-8 text-cyan-400 animate-pulse" />

          <div className="flex flex-col items-center">
            <span className="text-[10px] text-cyan-400 font-mono-tech font-bold">CURRENT</span>
            <span className="text-3xl sm:text-4xl font-black font-heading text-cyan-300 glow-cyan">
              LV. {pendingLevelUp.newLevel}
            </span>
          </div>
        </div>

        {/* Rewards Breakdown */}
        <div className="space-y-2 mb-6 text-left">
          <div className="flex items-center justify-between p-2.5 rounded bg-cyan-950/30 border border-cyan-500/20 text-xs font-mono-tech">
            <span className="text-slate-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Stat Points Earned:
            </span>
            <span className="font-bold text-cyan-300">+{pendingLevelUp.statPointsEarned} POINTS</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded bg-cyan-950/30 border border-cyan-500/20 text-xs font-mono-tech">
            <span className="text-slate-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              Hunter Rank:
            </span>
            <RankBadge rank={pendingLevelUp.newRank} size="sm" showLabel />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              dismissLevelUp();
              setActiveTab('status');
            }}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-heading font-black text-sm tracking-wider uppercase rounded shadow-lg shadow-cyan-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Allocate Stats
          </button>
          <button
            onClick={dismissLevelUp}
            className="py-3 px-4 bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 font-mono-tech text-xs tracking-wider uppercase rounded transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
