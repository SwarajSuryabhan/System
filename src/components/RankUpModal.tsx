import React from 'react';
import { useGame } from '../context/GameContext';
import { RankBadge } from './RankBadge';
import { RANK_TIERS } from '../game/gameLogic';
import { Sparkles } from 'lucide-react';

export const RankUpModal: React.FC = () => {
  const { pendingRankUp, dismissRankUp } = useGame();

  if (!pendingRankUp) return null;

  const tier = RANK_TIERS[pendingRankUp.rank] || RANK_TIERS.E;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-fade-in">
      <div className="relative w-full max-w-md p-6 bg-slate-950 border-2 border-amber-400 rounded-sm box-glow-gold text-center animate-level-up">
        {/* Holographic Accents */}
        <span className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-amber-300" />
        <span className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-amber-300" />
        <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-amber-300" />
        <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-amber-300" />

        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-400 text-xs font-mono-tech tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          <span>[SYSTEM RANK ASCENSION]</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black font-heading tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-500">
          RANK ASCENDED!
        </h2>
        <p className="text-sm text-amber-200/80 mt-1 font-mono-tech">
          The Hunter Association has reassessed your mana signature.
        </p>

        <div className="my-6 flex flex-col items-center justify-center py-6 px-4 bg-slate-900/90 border border-amber-500/40 rounded">
          <RankBadge rank={pendingRankUp.rank} size="xl" />
          <h3 className="mt-3 text-2xl font-black font-heading text-amber-300">
            {tier.label}
          </h3>
          <p className="text-xs text-slate-400 font-mono-tech mt-1">
            Hunter Rank {pendingRankUp.rank} Registered
          </p>
        </div>

        <button
          onClick={dismissRankUp}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-heading font-black text-sm tracking-wider uppercase rounded shadow-lg shadow-amber-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Accept Classification
        </button>
      </div>
    </div>
  );
};
