import type {
  HunterRank,
  QuestDifficulty,
  PlayerStatKey,
  Title,
  Achievement,
  Quest
} from '../types/index.ts';

/**
 * ============================================================================
 * SOLO LEVELING "SYSTEM" GAME LOGIC & CONFIGURATION
 * 
 * All game balance equations, XP thresholds, rank milestones,
 * rewards, and penalty calculations are defined here.
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// 1. XP CURVE & LEVELING CALCULATIONS
// ----------------------------------------------------------------------------

/**
 * Calculates the total XP required to advance from the given level to the next.
 * Progressive scaling formula: XP_req(level) = floor(100 * (level ^ 1.4))
 * 
 * Examples:
 * Level 1  -> 100 XP
 * Level 2  -> 263 XP
 * Level 5  -> 951 XP
 * Level 10 -> 2,511 XP
 * Level 20 -> 6,628 XP
 * Level 50 -> 24,115 XP
 */
export function getXpRequiredForLevel(level: number): number {
  if (level <= 1) return 100;
  return Math.max(100, Math.floor(100 * Math.pow(level, 1.4)));
}

/**
 * Evaluates whether current XP is sufficient to level up,
 * processing potential multi-level jumps if massive XP was gained.
 */
export function evaluateLevelUp(
  currentLevel: number,
  currentXP: number
): {
  newLevel: number;
  remainingXP: number;
  levelsGained: number;
  statPointsEarned: number;
} {
  let level = currentLevel;
  let xp = currentXP;
  let levelsGained = 0;
  const STAT_POINTS_PER_LEVEL = 3;

  while (true) {
    const required = getXpRequiredForLevel(level);
    if (xp >= required) {
      xp -= required;
      level += 1;
      levelsGained += 1;
    } else {
      break;
    }
  }

  return {
    newLevel: level,
    remainingXP: xp,
    levelsGained,
    statPointsEarned: levelsGained * STAT_POINTS_PER_LEVEL,
  };
}

// ----------------------------------------------------------------------------
// 2. HUNTER RANK TIERS & THRESHOLDS
// ----------------------------------------------------------------------------

export interface RankInfo {
  rank: HunterRank;
  minLevel: number;
  maxLevel: number;
  label: string;
  badgeColor: string;
  glowColor: string;
}

export const RANK_TIERS: Record<HunterRank, RankInfo> = {
  E: {
    rank: 'E',
    minLevel: 1,
    maxLevel: 9,
    label: 'Novice Hunter',
    badgeColor: 'text-slate-400 border-slate-400 bg-slate-900/50',
    glowColor: 'rgba(148, 163, 184, 0.4)',
  },
  D: {
    rank: 'D',
    minLevel: 10,
    maxLevel: 19,
    label: 'Junior Hunter',
    badgeColor: 'text-emerald-400 border-emerald-400 bg-emerald-950/50',
    glowColor: 'rgba(52, 211, 153, 0.4)',
  },
  C: {
    rank: 'C',
    minLevel: 20,
    maxLevel: 34,
    label: 'Adept Hunter',
    badgeColor: 'text-cyan-400 border-cyan-400 bg-cyan-950/50',
    glowColor: 'rgba(56, 189, 248, 0.5)',
  },
  B: {
    rank: 'B',
    minLevel: 35,
    maxLevel: 49,
    label: 'Elite Hunter',
    badgeColor: 'text-purple-400 border-purple-400 bg-purple-950/50',
    glowColor: 'rgba(168, 85, 247, 0.5)',
  },
  A: {
    rank: 'A',
    minLevel: 50,
    maxLevel: 69,
    label: 'Master Hunter',
    badgeColor: 'text-rose-500 border-rose-500 bg-rose-950/50',
    glowColor: 'rgba(244, 63, 94, 0.6)',
  },
  S: {
    rank: 'S',
    minLevel: 70,
    maxLevel: 999,
    label: 'National Level / Monarch',
    badgeColor: 'text-amber-400 border-amber-400 bg-amber-950/50 shadow-rank-s',
    glowColor: 'rgba(251, 191, 36, 0.8)',
  },
};

/**
 * Determines a player's Rank based strictly on their current Level.
 */
export function getRankForLevel(level: number): HunterRank {
  if (level >= 70) return 'S';
  if (level >= 50) return 'A';
  if (level >= 35) return 'B';
  if (level >= 20) return 'C';
  if (level >= 10) return 'D';
  return 'E';
}

// ----------------------------------------------------------------------------
// 3. QUEST REWARD MATRICES
// ----------------------------------------------------------------------------

export interface DifficultyReward {
  xp: number;
  statGain: number;
  label: string;
}

export const DIFFICULTY_REWARDS: Record<QuestDifficulty, DifficultyReward> = {
  E: { xp: 25, statGain: 1, label: 'Quick Routine Task' },
  D: { xp: 60, statGain: 1, label: 'Standard Daily Habit' },
  C: { xp: 150, statGain: 2, label: 'Challenging Effort' },
  B: { xp: 320, statGain: 3, label: 'Intense Deep Session' },
  A: { xp: 700, statGain: 4, label: 'Major Milestone' },
  S: { xp: 1500, statGain: 6, label: 'Monumental Feat' },
};

/**
 * Returns XP and primary stat increase earned upon completing a quest.
 */
export function getQuestRewards(difficulty: QuestDifficulty) {
  return DIFFICULTY_REWARDS[difficulty] || DIFFICULTY_REWARDS.E;
}

// ----------------------------------------------------------------------------
// 4. PLAYER DERIVED STATS (HP, MP)
// ----------------------------------------------------------------------------

export function calculateMaxHp(vitality: number): number {
  return 100 + vitality * 15;
}

export function calculateMaxMp(intelligence: number): number {
  return 50 + intelligence * 10;
}

export const STAT_INFO: Record<PlayerStatKey, { name: string; description: string; icon: string }> = {
  STR: {
    name: 'Strength',
    description: 'Physical prowess, strength workouts, bodyweight sets & raw power.',
    icon: 'Dumbbell',
  },
  INT: {
    name: 'Intelligence',
    description: 'Mental acuity, deep study, coding, technical research & reading.',
    icon: 'Brain',
  },
  VIT: {
    name: 'Vitality',
    description: 'Health recovery, sleep schedule, healthy nutrition & bodily stamina.',
    icon: 'Heart',
  },
  AGI: {
    name: 'Agility',
    description: 'Speed, responsiveness, cardiovascular pacing, steps & rapid execution.',
    icon: 'Zap',
  },
  DIS: {
    name: 'Discipline',
    description: 'Mental resilience, resisting impulse, meditation & consistent routines.',
    icon: 'ShieldCheck',
  },
};

// ----------------------------------------------------------------------------
// 5. PENALTY ZONE SYSTEM
// ----------------------------------------------------------------------------

/**
 * Penalty triggered when daily quests are left uncompleted at midnight reset.
 * XP is reduced by (level * 40), but NEVER drops below 0.
 * Daily streak resets to 0.
 */
export function calculatePenalty(level: number, currentXP: number): {
  xpDeducted: number;
  newXP: number;
} {
  const penaltyAmount = Math.max(30, level * 40);
  const xpDeducted = Math.min(currentXP, penaltyAmount);
  const newXP = Math.max(0, currentXP - xpDeducted);

  return { xpDeducted, newXP };
}

/**
 * Survival Penalty Quest generated when entering the Penalty Zone.
 */
export function generatePenaltyQuest(): Quest {
  return {
    id: `penalty-${Date.now()}`,
    title: 'Survive the Penalty Zone',
    description: '[SYSTEM WARNING] Daily requirements were neglected. Perform 50 squats, 30 push-ups, or 15 mins of intense cardio to escape the Penalty Zone.',
    category: 'DIS',
    difficulty: 'C',
    type: 'penalty',
    completed: false,
  };
}

// ----------------------------------------------------------------------------
// 6. DEFAULT DATA & INITIAL SEEDING
// ----------------------------------------------------------------------------

export const DEFAULT_DAILY_QUESTS: Omit<Quest, 'id'>[] = [
  {
    title: 'Physical Training: Push-ups & Core',
    description: 'Complete 3 sets of push-ups or core bodyweight workout.',
    category: 'STR',
    difficulty: 'D',
    type: 'daily',
    completed: false,
    targetCount: 30,
    currentCount: 0,
    unit: 'reps',
  },
  {
    title: 'Deep Work: 1 Hour High Focus',
    description: 'Study, code, or read without opening distracting tabs or social media.',
    category: 'INT',
    difficulty: 'C',
    type: 'daily',
    completed: false,
    targetCount: 60,
    currentCount: 0,
    unit: 'mins',
  },
  {
    title: 'Recovery Protocol: 8 Hours Sleep',
    description: 'Rest sufficiently to allow cellular regeneration and stamina recovery.',
    category: 'VIT',
    difficulty: 'D',
    type: 'daily',
    completed: false,
  },
  {
    title: 'Agility Drill: 7,000 Steps / Cardio',
    description: 'Maintain mobility and cardiovascular capacity throughout the day.',
    category: 'AGI',
    difficulty: 'D',
    type: 'daily',
    completed: false,
  },
  {
    title: 'Mental Fortitude: 2L Hydration & Mindfulness',
    description: 'Drink at least 2 liters of water and practice 5 minutes of focused breathing.',
    category: 'DIS',
    difficulty: 'E',
    type: 'daily',
    completed: false,
  },
];

export const INITIAL_TITLES: Title[] = [
  {
    id: 'awakened',
    name: 'The Awakened',
    description: 'You have survived the trial and were chosen by the System.',
    unlocked: true,
  },
  {
    id: 'early_riser',
    name: 'Early Riser',
    description: 'Completed a quest before 8:00 AM.',
    unlocked: false,
  },
  {
    id: 'iron_will',
    name: 'Iron Will',
    description: 'Maintained an unbroken daily streak of 7 days.',
    unlocked: false,
  },
  {
    id: 'survivor',
    name: 'Survivor of the Pit',
    description: 'Successfully cleared a Penalty Zone quest.',
    unlocked: false,
  },
  {
    id: 'scholar',
    name: 'Scholar of the Void',
    description: 'Elevated Intelligence stat to 25 or higher.',
    unlocked: false,
  },
  {
    id: 'beast',
    name: 'Iron Beast',
    description: 'Elevated Strength stat to 25 or higher.',
    unlocked: false,
  },
  {
    id: 'centurion',
    name: 'Centurion',
    description: 'Completed 100 total quests.',
    unlocked: false,
  },
  {
    id: 'shadow_monarch',
    name: 'Shadow Monarch',
    description: 'Ascended to Hunter Rank S.',
    unlocked: false,
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_quest',
    title: 'First Step as a Player',
    description: 'Complete your first quest.',
    icon: 'Flame',
    category: 'quest',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'streak_3',
    title: 'Building Momentum',
    description: 'Reach a 3-day daily quest streak.',
    icon: 'Zap',
    category: 'streak',
    unlocked: false,
    progress: 0,
    maxProgress: 3,
  },
  {
    id: 'streak_7',
    title: 'Indomitable Routine',
    description: 'Maintain a 7-day daily quest streak.',
    icon: 'Shield',
    category: 'streak',
    unlocked: false,
    progress: 0,
    maxProgress: 7,
  },
  {
    id: 'reach_rank_d',
    title: 'D-Rank Hunter',
    description: 'Reach Level 10 and ascend to Rank D.',
    icon: 'Award',
    category: 'level',
    unlocked: false,
    progress: 1,
    maxProgress: 10,
  },
  {
    id: 'reach_rank_c',
    title: 'C-Rank Hunter',
    description: 'Reach Level 20 and ascend to Rank C.',
    icon: 'Award',
    category: 'level',
    unlocked: false,
    progress: 1,
    maxProgress: 20,
  },
  {
    id: 'stat_25',
    title: 'Specialized Discipline',
    description: 'Raise any single attribute to 25 points.',
    icon: 'Activity',
    category: 'stat',
    unlocked: false,
    progress: 10,
    maxProgress: 25,
  },
  {
    id: 'survive_penalty',
    title: 'Trial of the Damned',
    description: 'Clear a Penalty Zone quest.',
    icon: 'Skull',
    category: 'survival',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
];

// Helper to get today's local date string YYYY-MM-DD
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
