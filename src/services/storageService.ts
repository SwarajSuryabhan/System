import { GameState, PlayerProfile, Quest } from '../types';
import {
  DEFAULT_DAILY_QUESTS,
  INITIAL_TITLES,
  INITIAL_ACHIEVEMENTS,
  getTodayDateString,
  getRankForLevel,
} from '../game/gameLogic';

const STORAGE_KEY = 'SOLO_LEVELING_SYSTEM_DATA_V1';

export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'id-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now();
}

export function createInitialGameState(playerName: string = 'Hunter'): GameState {
  const today = getTodayDateString();
  const initialQuests: Quest[] = DEFAULT_DAILY_QUESTS.map((q) => ({
    ...q,
    id: generateId(),
  }));

  const initialPlayer: PlayerProfile = {
    name: playerName,
    activeTitle: 'The Awakened',
    level: 1,
    currentXP: 0,
    availableStatPoints: 5, // 5 starter points to allocate!
    stats: {
      STR: 10,
      INT: 10,
      VIT: 10,
      AGI: 10,
      DIS: 10,
    },
    rank: getRankForLevel(1),
    dailyStreak: 0,
    bestStreak: 0,
    lastActiveDate: today,
    penaltyActive: false,
    penaltyCleared: false,
    onboarded: false,
    soundEnabled: true,
    createdAt: new Date().toISOString(),
  };

  return {
    player: initialPlayer,
    quests: initialQuests,
    titles: INITIAL_TITLES,
    achievements: INITIAL_ACHIEVEMENTS,
    activityLogs: [
      {
        id: generateId(),
        timestamp: new Date().toISOString(),
        type: 'quest',
        title: '[SYSTEM INITIALIZATION]',
        description: 'Player status initialized. Welcome to the System.',
      },
    ],
  };
}

export const storageService = {
  loadGameState(): GameState {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (!serialized) {
        const initial = createInitialGameState();
        this.saveGameState(initial);
        return initial;
      }
      const parsed = JSON.parse(serialized) as GameState;

      // Schema safeguards / upgrades
      if (!parsed.player || !parsed.quests) {
        const fallback = createInitialGameState();
        this.saveGameState(fallback);
        return fallback;
      }

      return parsed;
    } catch (err) {
      console.error('Failed to parse saved game state from localStorage:', err);
      const fallback = createInitialGameState();
      return fallback;
    }
  },

  saveGameState(state: GameState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('Failed to save game state to localStorage:', err);
    }
  },

  resetGameState(): GameState {
    localStorage.removeItem(STORAGE_KEY);
    const newState = createInitialGameState();
    this.saveGameState(newState);
    return newState;
  },

  exportStateToJson(state: GameState): string {
    return JSON.stringify(state, null, 2);
  },

  importStateFromJson(jsonString: string): GameState {
    const parsed = JSON.parse(jsonString) as GameState;
    if (!parsed.player || !parsed.player.name || !Array.isArray(parsed.quests)) {
      throw new Error('Invalid Solo Leveling backup JSON format');
    }
    this.saveGameState(parsed);
    return parsed;
  },
};
