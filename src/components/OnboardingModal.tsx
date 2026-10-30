import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Terminal, ChevronRight } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { gameState, completeOnboarding } = useGame();
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  if (gameState.player.onboarded) return null;

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setError('Please identify yourself, Hunter.');
      return;
    }
    completeOnboarding(playerName.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-fade-in scanlines">
      <div className="relative w-full max-w-lg p-6 sm:p-8 bg-system-panel border-2 border-cyan-400 rounded-sm box-glow-blue overflow-hidden">
        {/* Precision Corner Brackets */}
        <span className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-cyan-300" />
        <span className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-cyan-300" />
        <span className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-cyan-300" />
        <span className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-cyan-300" />

        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono-tech tracking-wider">
            <Terminal className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>[SYSTEM NOTIFICATION]</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-100 to-cyan-400 glow-cyan uppercase">
            You Have Been Chosen
          </h1>

          <div className="p-4 rounded bg-slate-950/80 border border-cyan-500/20 text-slate-300 font-mono-tech text-xs sm:text-sm text-left leading-relaxed space-y-2">
            <p className="text-cyan-400 font-semibold">
              &gt; [SYSTEM] Congratulations on becoming a Player.
            </p>
            <p>
              &gt; The System has selected you for growth. By completing real-life daily quests, you will gain Experience Points (XP), raise your attributes, and ascend from E-Rank to S-Rank.
            </p>
            <p className="text-rose-400">
              &gt; [WARNING] Failure to complete daily obligations before midnight triggers the Penalty Zone.
            </p>
          </div>

          <form onSubmit={handleStart} className="space-y-4 pt-2">
            <div className="text-left">
              <label className="block text-xs font-mono-tech uppercase tracking-wider text-cyan-400 mb-1.5">
                Designate Hunter Identity:
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => {
                  setPlayerName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. Sung Jin-Woo"
                maxLength={24}
                className="w-full px-4 py-3 bg-slate-900/90 border border-cyan-500/50 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded text-sm text-white font-mono-tech placeholder:text-slate-600 transition-all"
                autoFocus
              />
              {error && (
                <p className="text-xs text-rose-400 mt-1 font-mono-tech">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-heading font-black text-sm tracking-wider uppercase rounded shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Accept System Awakening</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
