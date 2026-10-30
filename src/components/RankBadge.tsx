import React from 'react';
import { HunterRank } from '../types';
import { RANK_TIERS } from '../game/gameLogic';

interface RankBadgeProps {
  rank: HunterRank;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

export const RankBadge: React.FC<RankBadgeProps> = ({
  rank,
  size = 'md',
  showLabel = false,
}) => {
  const tier = RANK_TIERS[rank] || RANK_TIERS.E;

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs font-bold',
    md: 'w-8 h-8 text-sm font-bold',
    lg: 'w-12 h-12 text-xl font-black',
    xl: 'w-16 h-16 text-3xl font-black',
  };

  return (
    <div className="inline-flex items-center gap-2">
      <div
        className={`relative flex items-center justify-center rounded-sm border ${tier.badgeColor} ${sizeClasses[size]} font-heading transition-transform hover:scale-105 select-none`}
        style={{
          boxShadow: `0 0 12px ${tier.glowColor}`,
        }}
      >
        <span>{rank}</span>
        {/* Subtle inner corner accent */}
        <span className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-current opacity-80" />
      </div>
      {showLabel && (
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-mono-tech leading-none">RANK</span>
          <span className="text-xs font-bold text-slate-200">{tier.label}</span>
        </div>
      )}
    </div>
  );
};
