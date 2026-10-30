import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  GameState,
  Quest,
  PlayerStatKey,
  SystemNotification,
  HunterRank,
  QuestDifficulty
} from '../types';
import {
  storageService,
  generateId,
} from '../services/storageService';
import {
  evaluateLevelUp,
  getRankForLevel,
  getQuestRewards,
  calculatePenalty,
  generatePenaltyQuest,
  getTodayDateString,
} from '../game/gameLogic';
import { systemAudio } from '../audio/systemAudio';

interface LevelUpInfo {
  previousLevel: number;
  newLevel: number;
  levelsGained: number;
  statPointsEarned: number;
  previousRank: HunterRank;
  newRank: HunterRank;
}

interface GameContextType {
  gameState: GameState;
  activeTab: 'status' | 'quests' | 'records' | 'settings';
  setActiveTab: (tab: 'status' | 'quests' | 'records' | 'settings') => void;
  notifications: SystemNotification[];
  dismissNotification: (id: string) => void;
  pendingLevelUp: LevelUpInfo | null;
  dismissLevelUp: () => void;
  pendingRankUp: { rank: HunterRank } | null;
  dismissRankUp: () => void;
  completeQuest: (questId: string) => void;
  uncompleteQuest: (questId: string) => void;
  addQuest: (quest: {
    title: string;
    description?: string;
    category: PlayerStatKey;
    difficulty: QuestDifficulty;
    type: 'daily' | 'custom';
    deadline?: string;
  }) => void;
  deleteQuest: (questId: string) => void;
  allocateStatPoint: (stat: PlayerStatKey) => void;
  setActiveTitle: (titleName: string) => void;
  updatePlayerName: (name: string) => void;
  toggleSound: () => void;
  completePenaltyQuest: () => void;
  checkMidnightReset: () => void;
  devSimulateMidnight: (forceFailDaily?: boolean) => void;
  devAddXp: (amount: number) => void;
  resetAllData: () => void;
  exportData: () => string;
  importData: (jsonStr: string) => void;
  completeOnboarding: (name: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(() => storageService.loadGameState());
  const [activeTab, setActiveTab] = useState<'status' | 'quests' | 'records' | 'settings'>('status');
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [pendingLevelUp, setPendingLevelUp] = useState<LevelUpInfo | null>(null);
  const [pendingRankUp, setPendingRankUp] = useState<{ rank: HunterRank } | null>(null);

  // Sync sound settings with audio engine
  useEffect(() => {
    systemAudio.enabled = gameState.player.soundEnabled;
  }, [gameState.player.soundEnabled]);

  // Persist state changes
  useEffect(() => {
    storageService.saveGameState(gameState);
  }, [gameState]);

  // Toast notification dispatcher
  const pushNotification = useCallback((
    title: string,
    message: string,
    type: SystemNotification['type'] = 'system'
  ) => {
    const id = generateId();
    const notification: SystemNotification = {
      id,
      title,
      message,
      type,
      timestamp: Date.now(),
    };
    setNotifications((prev) => [...prev.slice(-3), notification]);

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4500);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Title unlock check
  const evaluateTitleAndAchievements = useCallback((state: GameState): GameState => {
    const player = state.player;
    const quests = state.quests;
    let titlesChanged = false;
    let achievementsChanged = false;

    const updatedTitles = state.titles.map((t) => {
      let shouldUnlock = t.unlocked;

      if (!t.unlocked) {
        if (t.id === 'iron_will' && player.dailyStreak >= 7) shouldUnlock = true;
        if (t.id === 'scholar' && player.stats.INT >= 25) shouldUnlock = true;
        if (t.id === 'beast' && player.stats.STR >= 25) shouldUnlock = true;
        if (t.id === 'shadow_monarch' && player.rank === 'S') shouldUnlock = true;
      }

      if (shouldUnlock && !t.unlocked) {
        titlesChanged = true;
        pushNotification('[TITLE UNLOCKED]', `New Title Acquired: "${t.name}"!`, 'reward');
        return { ...t, unlocked: true, unlockedAt: new Date().toISOString() };
      }
      return t;
    });

    const completedQuestsCount = quests.filter((q) => q.completed).length;

    const updatedAchievements = state.achievements.map((a) => {
      let progress = a.progress;
      let unlocked = a.unlocked;

      if (a.id === 'first_quest') {
        progress = Math.min(a.maxProgress, completedQuestsCount);
        if (progress >= a.maxProgress) unlocked = true;
      } else if (a.id === 'streak_3') {
        progress = Math.min(a.maxProgress, player.dailyStreak);
        if (progress >= a.maxProgress) unlocked = true;
      } else if (a.id === 'streak_7') {
        progress = Math.min(a.maxProgress, player.dailyStreak);
        if (progress >= a.maxProgress) unlocked = true;
      } else if (a.id === 'reach_rank_d') {
        progress = Math.min(a.maxProgress, player.level);
        if (progress >= a.maxProgress) unlocked = true;
      } else if (a.id === 'reach_rank_c') {
        progress = Math.min(a.maxProgress, player.level);
        if (progress >= a.maxProgress) unlocked = true;
      } else if (a.id === 'stat_25') {
        const highestStat = Math.max(...Object.values(player.stats));
        progress = Math.min(a.maxProgress, highestStat);
        if (progress >= a.maxProgress) unlocked = true;
      }

      if (unlocked && !a.unlocked) {
        achievementsChanged = true;
        pushNotification('[ACHIEVEMENT UNLOCKED]', `${a.title}: ${a.description}`, 'reward');
        return { ...a, progress, unlocked: true, unlockedAt: new Date().toISOString() };
      }

      return { ...a, progress, unlocked };
    });

    if (titlesChanged || achievementsChanged) {
      return {
        ...state,
        titles: updatedTitles,
        achievements: updatedAchievements,
      };
    }

    return state;
  }, [pushNotification]);

  // Complete a quest
  const completeQuest = useCallback((questId: string) => {
    setGameState((prev) => {
      const targetQuest = prev.quests.find((q) => q.id === questId);
      if (!targetQuest || targetQuest.completed) return prev;

      systemAudio.playQuestComplete();

      const { xp: xpReward, statGain } = getQuestRewards(targetQuest.difficulty);
      const isEarlyMorning = new Date().getHours() < 8;

      // Update Quests list
      const updatedQuests = prev.quests.map((q) =>
        q.id === questId
          ? { ...q, completed: true, completedAt: new Date().toISOString() }
          : q
      );

      // Stat gain
      const updatedStats = {
        ...prev.player.stats,
        [targetQuest.category]: prev.player.stats[targetQuest.category] + statGain,
      };

      // XP & Level calculations
      const newTotalXp = prev.player.currentXP + xpReward;
      const levelResult = evaluateLevelUp(prev.player.level, newTotalXp);
      const newRank = getRankForLevel(levelResult.newLevel);
      const previousRank = prev.player.rank;

      let player = {
        ...prev.player,
        stats: updatedStats,
        currentXP: levelResult.remainingXP,
        level: levelResult.newLevel,
        availableStatPoints: prev.player.availableStatPoints + levelResult.statPointsEarned,
        rank: newRank,
      };

      // Trigger Level-Up sequence if leveled up
      if (levelResult.levelsGained > 0) {
        setTimeout(() => {
          systemAudio.playLevelUp();
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#00f0ff', '#00b4d8', '#ffffff', '#38bdf8'],
            });
          } catch {}
          setPendingLevelUp({
            previousLevel: prev.player.level,
            newLevel: levelResult.newLevel,
            levelsGained: levelResult.levelsGained,
            statPointsEarned: levelResult.statPointsEarned,
            previousRank,
            newRank,
          });
        }, 300);
      }

      // Check Rank-Up
      if (newRank !== previousRank) {
        setTimeout(() => {
          systemAudio.playRankUp();
          setPendingRankUp({ rank: newRank });
        }, 1200);
      }

      // Check Early Riser title
      let updatedTitles = prev.titles;
      if (isEarlyMorning) {
        updatedTitles = updatedTitles.map((t) =>
          t.id === 'early_riser' && !t.unlocked
            ? { ...t, unlocked: true, unlockedAt: new Date().toISOString() }
            : t
        );
      }

      // Activity log entry
      const logEntry = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        type: 'quest' as const,
        title: `Completed Quest: ${targetQuest.title}`,
        description: `Difficulty [${targetQuest.difficulty}] — Awarded +${xpReward} XP & +${statGain} ${targetQuest.category}`,
        xpChange: xpReward,
        statGained: {
          stat: targetQuest.category,
          amount: statGain,
        },
      };

      pushNotification(
        '[SYSTEM] Quest Completed',
        `+${xpReward} XP earned. ${targetQuest.category} increased by +${statGain}!`,
        'reward'
      );

      const nextState: GameState = {
        ...prev,
        player,
        quests: updatedQuests,
        titles: updatedTitles,
        activityLogs: [logEntry, ...prev.activityLogs.slice(0, 99)],
      };

      return evaluateTitleAndAchievements(nextState);
    });
  }, [pushNotification, evaluateTitleAndAchievements]);

  // Uncomplete quest (for accidental clicks)
  const uncompleteQuest = useCallback((questId: string) => {
    setGameState((prev) => {
      const targetQuest = prev.quests.find((q) => q.id === questId);
      if (!targetQuest || !targetQuest.completed) return prev;

      const { xp: xpReward, statGain } = getQuestRewards(targetQuest.difficulty);

      const updatedQuests = prev.quests.map((q) =>
        q.id === questId ? { ...q, completed: false, completedAt: undefined } : q
      );

      const updatedStats = {
        ...prev.player.stats,
        [targetQuest.category]: Math.max(10, prev.player.stats[targetQuest.category] - statGain),
      };

      const newXP = Math.max(0, prev.player.currentXP - xpReward);

      return {
        ...prev,
        player: {
          ...prev.player,
          stats: updatedStats,
          currentXP: newXP,
        },
        quests: updatedQuests,
      };
    });
  }, []);

  // Add custom or daily quest
  const addQuest = useCallback((questData: {
    title: string;
    description?: string;
    category: PlayerStatKey;
    difficulty: QuestDifficulty;
    type: 'daily' | 'custom';
    deadline?: string;
  }) => {
    systemAudio.playClick();
    const newQuest: Quest = {
      id: generateId(),
      title: questData.title.trim(),
      description: questData.description?.trim(),
      category: questData.category,
      difficulty: questData.difficulty,
      type: questData.type,
      completed: false,
      deadline: questData.deadline,
    };

    setGameState((prev) => ({
      ...prev,
      quests: [newQuest, ...prev.quests],
    }));

    pushNotification(
      '[SYSTEM] New Quest Assigned',
      `"${newQuest.title}" [Rank ${newQuest.difficulty}] has been registered in the System.`,
      'system'
    );
  }, [pushNotification]);

  // Delete quest
  const deleteQuest = useCallback((questId: string) => {
    systemAudio.playClick();
    setGameState((prev) => ({
      ...prev,
      quests: prev.quests.filter((q) => q.id !== questId),
    }));
    pushNotification('[SYSTEM]', 'Quest removed from log.', 'system');
  }, [pushNotification]);

  // Allocate stat point
  const allocateStatPoint = useCallback((stat: PlayerStatKey) => {
    setGameState((prev) => {
      if (prev.player.availableStatPoints <= 0) return prev;

      systemAudio.playStatUp();

      const updatedPlayer = {
        ...prev.player,
        availableStatPoints: prev.player.availableStatPoints - 1,
        stats: {
          ...prev.player.stats,
          [stat]: prev.player.stats[stat] + 1,
        },
      };

      const logEntry = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        type: 'stat' as const,
        title: `Attribute Raised: ${stat}`,
        description: `Player allocated 1 Stat Point into ${stat}. Current value: ${updatedPlayer.stats[stat]}`,
      };

      const nextState: GameState = {
        ...prev,
        player: updatedPlayer,
        activityLogs: [logEntry, ...prev.activityLogs.slice(0, 99)],
      };

      return evaluateTitleAndAchievements(nextState);
    });
  }, [evaluateTitleAndAchievements]);

  // Set active title
  const setActiveTitle = useCallback((titleName: string) => {
    systemAudio.playClick();
    setGameState((prev) => ({
      ...prev,
      player: {
        ...prev.player,
        activeTitle: titleName,
      },
    }));
    pushNotification('[TITLE EQUIPPED]', `Active Title updated to "${titleName}".`, 'system');
  }, [pushNotification]);

  // Update player name
  const updatePlayerName = useCallback((name: string) => {
    const cleanName = name.trim() || 'Hunter';
    setGameState((prev) => ({
      ...prev,
      player: {
        ...prev.player,
        name: cleanName,
      },
    }));
    pushNotification('[PLAYER PROFILE]', `Hunter identity updated to "${cleanName}".`, 'system');
  }, [pushNotification]);

  // Sound toggle
  const toggleSound = useCallback(() => {
    setGameState((prev) => {
      const nextSound = !prev.player.soundEnabled;
      systemAudio.enabled = nextSound;
      if (nextSound) systemAudio.playClick();
      return {
        ...prev,
        player: {
          ...prev.player,
          soundEnabled: nextSound,
        },
      };
    });
  }, []);

  // Complete penalty survival quest
  const completePenaltyQuest = useCallback(() => {
    systemAudio.playQuestComplete();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        colors: ['#00e5ff', '#ffffff'],
      });
    } catch {}

    setGameState((prev) => {
      const updatedTitles = prev.titles.map((t) =>
        t.id === 'survivor' ? { ...t, unlocked: true, unlockedAt: new Date().toISOString() } : t
      );

      const updatedAchievements = prev.achievements.map((a) =>
        a.id === 'survive_penalty' ? { ...a, progress: 1, unlocked: true, unlockedAt: new Date().toISOString() } : a
      );

      const updatedQuests = prev.quests.filter((q) => q.type !== 'penalty');

      const logEntry = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        type: 'penalty' as const,
        title: 'Cleared Penalty Zone',
        description: 'Survival trial conquered. The Player has escaped the Penalty Zone alive.',
      };

      pushNotification(
        '[SYSTEM] PENALTY ZONE CLEARED',
        'You have survived the survival trial. Penalty Zone dismissed.',
        'reward'
      );

      return {
        ...prev,
        player: {
          ...prev.player,
          penaltyActive: false,
          penaltyCleared: true,
        },
        quests: updatedQuests,
        titles: updatedTitles,
        achievements: updatedAchievements,
        activityLogs: [logEntry, ...prev.activityLogs.slice(0, 99)],
      };
    });
  }, [pushNotification]);

  // Midnight Daily Reset Logic
  const checkMidnightReset = useCallback(() => {
    const today = getTodayDateString();

    setGameState((prev) => {
      if (prev.player.lastActiveDate === today) {
        return prev; // Already updated today
      }

      const dailyQuests = prev.quests.filter((q) => q.type === 'daily');
      const allDailyCompleted = dailyQuests.length > 0 && dailyQuests.every((q) => q.completed);

      let newStreak = prev.player.dailyStreak;
      let quests = [...prev.quests];
      let player = { ...prev.player };
      const logs = [...prev.activityLogs];

      if (allDailyCompleted) {
        // Daily streak maintained!
        newStreak += 1;
        const bestStreak = Math.max(newStreak, player.bestStreak);
        const streakBonusXp = 50 * newStreak;

        player.dailyStreak = newStreak;
        player.bestStreak = bestStreak;
        player.currentXP += streakBonusXp;

        logs.unshift({
          id: generateId(),
          timestamp: new Date().toISOString(),
          type: 'quest',
          title: `Daily Reset: Streak ${newStreak} Days!`,
          description: `All daily obligations met! Awarded +${streakBonusXp} XP streak bonus.`,
          xpChange: streakBonusXp,
        });

        pushNotification(
          '[SYSTEM] Daily Reset Complete',
          `Streak extended to ${newStreak} days! Bonus +${streakBonusXp} XP awarded.`,
          'reward'
        );
      } else {
        // Failed daily obligations -> Penalty Zone initiated!
        systemAudio.playPenaltyAlert();
        newStreak = 0;

        const { xpDeducted, newXP } = calculatePenalty(player.level, player.currentXP);
        player.currentXP = newXP;
        player.dailyStreak = 0;
        player.penaltyActive = true;
        player.penaltyCleared = false;

        // Add penalty survival quest if none exists
        if (!quests.some((q) => q.type === 'penalty' && !q.completed)) {
          quests.unshift(generatePenaltyQuest());
        }

        logs.unshift({
          id: generateId(),
          timestamp: new Date().toISOString(),
          type: 'penalty',
          title: '[PENALTY ZONE TRIGGERED]',
          description: `Daily obligations failed. Deducted ${xpDeducted} XP and reset daily streak. Survival quest issued.`,
          xpChange: -xpDeducted,
        });

        pushNotification(
          '[SYSTEM WARNING] PENALTY ZONE',
          `Daily quests incomplete. -${xpDeducted} XP deducted. Survival quest initiated.`,
          'penalty'
        );
      }

      // Reset daily quest checkboxes for the new day
      quests = quests.map((q) =>
        q.type === 'daily'
          ? { ...q, completed: false, completedAt: undefined }
          : q
      );

      player.lastActiveDate = today;

      return {
        ...prev,
        player,
        quests,
        activityLogs: logs.slice(0, 100),
      };
    });
  }, [pushNotification]);

  // Initial check on mount
  useEffect(() => {
    checkMidnightReset();
  }, [checkMidnightReset]);

  // Developer simulation: Simulate Next Day / Midnight Reset
  const devSimulateMidnight = useCallback((forceFailDaily: boolean = false) => {
    systemAudio.playClick();
    setGameState((prev) => {
      // Simulate yesterday's date
      const d = new Date();
      d.setDate(d.getDate() - 1);
      const yesterday = d.toISOString().split('T')[0];

      let modifiedQuests = prev.quests;
      if (forceFailDaily) {
        modifiedQuests = prev.quests.map((q) =>
          q.type === 'daily' ? { ...q, completed: false } : q
        );
      }

      return {
        ...prev,
        player: {
          ...prev.player,
          lastActiveDate: yesterday,
        },
        quests: modifiedQuests,
      };
    });

    setTimeout(() => {
      checkMidnightReset();
    }, 100);
  }, [checkMidnightReset]);

  // Developer XP boost
  const devAddXp = useCallback((amount: number) => {
    setGameState((prev) => {
      const newTotalXp = prev.player.currentXP + amount;
      const levelResult = evaluateLevelUp(prev.player.level, newTotalXp);
      const newRank = getRankForLevel(levelResult.newLevel);
      const previousRank = prev.player.rank;

      if (levelResult.levelsGained > 0) {
        systemAudio.playLevelUp();
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch {}
        setPendingLevelUp({
          previousLevel: prev.player.level,
          newLevel: levelResult.newLevel,
          levelsGained: levelResult.levelsGained,
          statPointsEarned: levelResult.statPointsEarned,
          previousRank,
          newRank,
        });
      }

      if (newRank !== previousRank) {
        setTimeout(() => {
          systemAudio.playRankUp();
          setPendingRankUp({ rank: newRank });
        }, 1200);
      }

      const nextPlayer = {
        ...prev.player,
        level: levelResult.newLevel,
        currentXP: levelResult.remainingXP,
        availableStatPoints: prev.player.availableStatPoints + levelResult.statPointsEarned,
        rank: newRank,
      };

      pushNotification('[DEV CONSOLE]', `Granted +${amount} XP to Player.`, 'reward');

      const nextState: GameState = {
        ...prev,
        player: nextPlayer,
      };

      return evaluateTitleAndAchievements(nextState);
    });
  }, [pushNotification, evaluateTitleAndAchievements]);

  // Reset all data
  const resetAllData = useCallback(() => {
    systemAudio.playClick();
    const fresh = storageService.resetGameState();
    setGameState(fresh);
    pushNotification('[SYSTEM]', 'Game data reset to factory defaults.', 'system');
  }, [pushNotification]);

  // Export & Import
  const exportData = useCallback(() => {
    return storageService.exportStateToJson(gameState);
  }, [gameState]);

  const importData = useCallback((jsonStr: string) => {
    try {
      const imported = storageService.importStateFromJson(jsonStr);
      setGameState(imported);
      pushNotification('[SYSTEM RESTORE]', 'Game data successfully restored from backup.', 'reward');
    } catch (e: unknown) {
      const err = e as Error;
      pushNotification('[RESTORE FAILED]', err.message || 'Corrupted file', 'warning');
    }
  }, [pushNotification]);

  // Onboarding completion
  const completeOnboarding = useCallback((name: string) => {
    systemAudio.playLevelUp();
    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch {}

    const cleanName = name.trim() || 'Hunter';
    setGameState((prev) => ({
      ...prev,
      player: {
        ...prev.player,
        name: cleanName,
        onboarded: true,
      },
    }));

    pushNotification('[SYSTEM]', 'Player initialization complete. Quests assigned.', 'reward');
  }, [pushNotification]);

  return (
    <GameContext.Provider
      value={{
        gameState,
        activeTab,
        setActiveTab,
        notifications,
        dismissNotification,
        pendingLevelUp,
        dismissLevelUp: () => setPendingLevelUp(null),
        pendingRankUp,
        dismissRankUp: () => setPendingRankUp(null),
        completeQuest,
        uncompleteQuest,
        addQuest,
        deleteQuest,
        allocateStatPoint,
        setActiveTitle,
        updatePlayerName,
        toggleSound,
        completePenaltyQuest,
        checkMidnightReset,
        devSimulateMidnight,
        devAddXp,
        resetAllData,
        exportData,
        importData,
        completeOnboarding,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
