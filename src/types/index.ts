export type HunterRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export type PlayerStatKey = 'STR' | 'INT' | 'VIT' | 'AGI' | 'DIS';

export interface PlayerStats {
  STR: number; // Strength (Fitness, workouts)
  INT: number; // Intelligence (Study, reading, coding)
  VIT: number; // Vitality (Sleep, hydration, nutrition)
  AGI: number; // Agility (Punctuality, cardio, fast tasks)
  DIS: number; // Discipline (Focus, meditation, consistency)
}

export type QuestDifficulty = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
export type QuestType = 'daily' | 'custom' | 'penalty';

export interface Quest {
  id: string;
  title: string;
  description?: string;
  category: PlayerStatKey;
  difficulty: QuestDifficulty;
  type: QuestType;
  completed: boolean;
  completedAt?: string; // ISO date string
  deadline?: string; // Optional time or ISO date
  targetCount?: number;
  currentCount?: number;
  unit?: string;
}

export interface Title {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'quest' | 'streak' | 'level' | 'stat' | 'survival';
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedAt?: string;
}

export type ActivityType = 'quest' | 'levelup' | 'rankup' | 'penalty' | 'title' | 'stat';

export interface ActivityLogItem {
  id: string;
  timestamp: string; // ISO string
  type: ActivityType;
  title: string;
  description: string;
  xpChange?: number;
  statGained?: {
    stat: PlayerStatKey;
    amount: number;
  };
}

export interface PlayerProfile {
  name: string;
  activeTitle: string;
  level: number;
  currentXP: number;
  availableStatPoints: number;
  stats: PlayerStats;
  rank: HunterRank;
  dailyStreak: number;
  bestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  penaltyActive: boolean;
  penaltyCleared: boolean;
  onboarded: boolean;
  soundEnabled: boolean;
  createdAt: string;
}

export interface GameState {
  player: PlayerProfile;
  quests: Quest[];
  titles: Title[];
  achievements: Achievement[];
  activityLogs: ActivityLogItem[];
}

export interface SystemNotification {
  id: string;
  type: 'system' | 'reward' | 'levelup' | 'rankup' | 'warning' | 'penalty';
  title: string;
  message: string;
  timestamp: number;
}

// Future Extensions ready for expansion
export interface DungeonBoss {
  id: string;
  name: string;
  rank: HunterRank;
  hp: number;
  maxHp: number;
  deadlineDays: number;
  rewards: {
    xp: number;
    titleId?: string;
    item?: string;
  };
}

export interface ShadowSoldier {
  id: string;
  name: string;
  habitName: string;
  masteryDays: number;
  powerLevel: number;
  extractedAt: string;
}
