import React from 'react';
import { useGame } from '../context/GameContext';
import { Skull, CheckCircle2 } from 'lucide-react';

export const PenaltyOverlay: React.FC = () => {
  const { gameState, completePenaltyQuest, setActiveTab } = useGame();
  const { penaltyActive } = gameState.player;

  if (!penaltyActive) return null;

  const penaltyQuest = gameState.quests.find((q) => q.type === 'penalty');

  return (
    <div className="relative mb-6 p-4 sm:p-5 rounded-sm bg-gradient-to-b from-rose-950/80 to-slate-950/90 border-2 border-rose-500/80 box-glow-red overflow-hidden animate-pulse-subtle">
      {/* Corner Brackets */}
      <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-rose-400" />
      <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-rose-400" />
      <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-rose-400" />
      <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-rose-400" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded bg-rose-900/60 border border-rose-500/60 text-rose-400 animate-bounce">
            <Skull className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-tech px-2 py-0.5 rounded bg-rose-900/80 text-rose-300 font-bold">
                [SYSTEM WARNING]
              </span>
              <h3 className="font-heading font-black text-rose-400 text-sm sm:text-base tracking-wider glow-crimson">
                PENALTY ZONE ACTIVE
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-mono-tech mt-1.5 leading-relaxed">
              {penaltyQuest?.description ||
                'Daily quests were incomplete at reset. Survival quest initiated. Complete the physical survival trial to escape the Penalty Zone.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:self-center">
          <button
            onClick={() => {
              completePenaltyQuest();
              setActiveTab('quests');
            }}
            className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-heading font-bold text-xs uppercase tracking-wider rounded shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            Complete Survival Trial
          </button>
        </div>
      </div>
    </div>
  );
};
