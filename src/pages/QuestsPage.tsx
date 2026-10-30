import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { SystemWindow } from '../components/SystemWindow';
import { RankBadge } from '../components/RankBadge';
import { PenaltyOverlay } from '../components/PenaltyOverlay';
import {
  QuestDifficulty,
  PlayerStatKey,
} from '../types';
import {
  getQuestRewards,
} from '../game/gameLogic';
import {
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Clock,
  Filter,
  Sparkles,
  Calendar,
  X,
  Dumbbell,
  Brain,
  Heart,
  Zap,
  ShieldCheck,
} from 'lucide-react';

export const QuestsPage: React.FC = () => {
  const { gameState, completeQuest, uncompleteQuest, addQuest, deleteQuest } = useGame();
  const { quests } = gameState;

  const [questTab, setQuestTab] = useState<'daily' | 'custom'>('daily');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('ALL');
  const [filterStat, setFilterStat] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for New Quest Modal
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<QuestDifficulty>('D');
  const [newCategory, setNewCategory] = useState<PlayerStatKey>('INT');
  const [newDeadline, setNewDeadline] = useState('');
  const [newType, setNewType] = useState<'daily' | 'custom'>('custom');

  // Countdown timer to midnight
  const [timeToMidnight, setTimeToMidnight] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);

      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeToMidnight(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addQuest({
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      difficulty: newDifficulty,
      category: newCategory,
      type: newType,
      deadline: newDeadline || undefined,
    });

    setNewTitle('');
    setNewDescription('');
    setNewDeadline('');
    setShowAddModal(false);
  };

  // Filter quests
  const displayedQuests = quests
    .filter((q) => q.type === questTab || (questTab === 'daily' && q.type === 'penalty'))
    .filter((q) => filterDifficulty === 'ALL' || q.difficulty === filterDifficulty)
    .filter((q) => filterStat === 'ALL' || q.category === filterStat);

  const dailyQuests = quests.filter((q) => q.type === 'daily');
  const completedDailyCount = dailyQuests.filter((q) => q.completed).length;

  const statIcons: Record<PlayerStatKey, React.ReactNode> = {
    STR: <Dumbbell className="w-3.5 h-3.5 text-rose-400" />,
    INT: <Brain className="w-3.5 h-3.5 text-cyan-400" />,
    VIT: <Heart className="w-3.5 h-3.5 text-emerald-400" />,
    AGI: <Zap className="w-3.5 h-3.5 text-amber-400" />,
    DIS: <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />,
  };

  return (
    <div className="space-y-6">
      <PenaltyOverlay />

      {/* Quest Control Window */}
      <SystemWindow
        title="QUEST LOG & DUTIES"
        subtitle="COMPLETE TO ACCELERATE GROWTH"
        badge={
          <button
            onClick={() => {
              setNewType(questTab);
              setShowAddModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-400 text-cyan-300 hover:text-slate-950 border border-cyan-400 rounded text-xs font-heading font-bold transition-all box-glow-blue active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>NEW QUEST</span>
          </button>
        }
      >
        {/* Tab Switcher: Daily vs Custom */}
        <div className="flex border-b border-cyan-500/20 mb-4 font-heading text-xs sm:text-sm">
          <button
            onClick={() => setQuestTab('daily')}
            className={`flex-1 py-2.5 px-4 text-center border-b-2 transition-all flex items-center justify-center gap-2 ${
              questTab === 'daily'
                ? 'border-cyan-400 text-cyan-300 font-bold bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>DAILY QUESTS</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono-tech bg-slate-800 text-slate-300">
              {completedDailyCount}/{dailyQuests.length}
            </span>
          </button>

          <button
            onClick={() => setQuestTab('custom')}
            className={`flex-1 py-2.5 px-4 text-center border-b-2 transition-all flex items-center justify-center gap-2 ${
              questTab === 'custom'
                ? 'border-cyan-400 text-cyan-300 font-bold bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>CUSTOM QUESTS</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono-tech bg-slate-800 text-slate-300">
              {quests.filter((q) => q.type === 'custom').length}
            </span>
          </button>
        </div>

        {/* Midnight Reset Banner (Only shown for Daily Quests) */}
        {questTab === 'daily' && (
          <div className="flex items-center justify-between p-3 rounded bg-slate-900/80 border border-cyan-500/30 mb-4 font-mono-tech text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>MIDNIGHT SYSTEM RESET IN:</span>
            </div>
            <span className="text-cyan-300 font-bold tracking-widest text-sm glow-cyan">
              {timeToMidnight}
            </span>
          </div>
        )}

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-4 font-mono-tech text-xs">
          <div className="flex items-center gap-1 text-slate-400 mr-1">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] uppercase">Filter:</span>
          </div>

          {/* Difficulty Filter */}
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="bg-slate-900 border border-cyan-500/30 text-cyan-200 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Ranks (E - S)</option>
            <option value="E">Rank E</option>
            <option value="D">Rank D</option>
            <option value="C">Rank C</option>
            <option value="B">Rank B</option>
            <option value="A">Rank A</option>
            <option value="S">Rank S</option>
          </select>

          {/* Stat Category Filter */}
          <select
            value={filterStat}
            onChange={(e) => setFilterStat(e.target.value)}
            className="bg-slate-900 border border-cyan-500/30 text-cyan-200 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Stats</option>
            <option value="STR">STR (Strength)</option>
            <option value="INT">INT (Intelligence)</option>
            <option value="VIT">VIT (Vitality)</option>
            <option value="AGI">AGI (Agility)</option>
            <option value="DIS">DIS (Discipline)</option>
          </select>
        </div>

        {/* Quests List */}
        <div className="space-y-3">
          {displayedQuests.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-mono-tech text-xs space-y-2">
              <p>[SYSTEM] No quests found matching current filter parameters.</p>
              <button
                onClick={() => {
                  setNewType(questTab);
                  setShowAddModal(true);
                }}
                className="text-cyan-400 underline hover:text-cyan-300 font-semibold"
              >
                Create your first {questTab} quest now
              </button>
            </div>
          ) : (
            displayedQuests.map((quest) => {
              const rewards = getQuestRewards(quest.difficulty);
              const isPenalty = quest.type === 'penalty';

              return (
                <div
                  key={quest.id}
                  className={`group relative p-3.5 sm:p-4 rounded-sm border transition-all duration-200 ${
                    quest.completed
                      ? 'bg-slate-950/60 border-slate-800 opacity-75'
                      : isPenalty
                      ? 'bg-rose-950/40 border-rose-500/60 box-glow-red'
                      : 'bg-slate-900/70 border-cyan-500/30 hover:border-cyan-400/70 box-glow-blue'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Completion Checkbox Button */}
                    <button
                      onClick={() =>
                        quest.completed ? uncompleteQuest(quest.id) : completeQuest(quest.id)
                      }
                      className="mt-0.5 text-cyan-400 hover:scale-110 active:scale-95 transition-transform"
                      aria-label={quest.completed ? 'Mark incomplete' : 'Complete quest'}
                    >
                      {quest.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-cyan-400 fill-cyan-950" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500 group-hover:text-cyan-400" />
                      )}
                    </button>

                    {/* Quest Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-sm sm:text-base font-bold font-heading ${
                            quest.completed
                              ? 'line-through text-slate-500'
                              : isPenalty
                              ? 'text-rose-300'
                              : 'text-white'
                          }`}
                        >
                          {quest.title}
                        </span>

                        <RankBadge rank={quest.difficulty} size="sm" />

                        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 text-[10px] font-mono-tech text-slate-300">
                          {statIcons[quest.category]}
                          <span>{quest.category}</span>
                        </div>

                        {quest.deadline && (
                          <span className="text-[10px] font-mono-tech text-amber-400/90 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {quest.deadline}
                          </span>
                        )}
                      </div>

                      {quest.description && (
                        <p className="text-xs text-slate-400 font-mono-tech mt-1 leading-snug">
                          {quest.description}
                        </p>
                      )}

                      {/* Rewards summary footer */}
                      <div className="flex items-center gap-3 mt-2 text-[10px] font-mono-tech text-slate-400">
                        <span className="text-cyan-300 font-bold">
                          +{rewards.xp} XP
                        </span>
                        <span>•</span>
                        <span className="text-slate-300">
                          +{rewards.statGain} {quest.category}
                        </span>
                        {quest.completed && (
                          <span className="ml-auto text-emerald-400 font-bold">
                            ✓ COMPLETED
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Delete action */}
                    {!isPenalty && (
                      <button
                        onClick={() => deleteQuest(quest.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-1 transition-all"
                        title="Delete Quest"
                        aria-label="Delete Quest"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </SystemWindow>

      {/* Add Quest Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md p-6 bg-slate-950 border-2 border-cyan-400 rounded-sm box-glow-blue">
            {/* Modal Corner Accents */}
            <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-300" />
            <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-300" />
            <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-300" />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-300" />

            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/30 mb-4">
              <h3 className="font-heading font-black text-cyan-300 text-base tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>CREATE SYSTEM QUEST</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuest} className="space-y-4 font-mono-tech text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-bold">QUEST TITLE *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Read 20 pages of Algorithms"
                  className="w-full px-3 py-2 bg-slate-900 border border-cyan-500/40 rounded text-sm text-white focus:outline-none focus:border-cyan-400"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">DESCRIPTION (OPTIONAL)</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Provide context or constraints..."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-900 border border-cyan-500/40 rounded text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">DIFFICULTY RANK</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as QuestDifficulty)}
                    className="w-full px-2.5 py-2 bg-slate-900 border border-cyan-500/40 rounded text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="E">Rank E (+25 XP)</option>
                    <option value="D">Rank D (+60 XP)</option>
                    <option value="C">Rank C (+150 XP)</option>
                    <option value="B">Rank B (+320 XP)</option>
                    <option value="A">Rank A (+700 XP)</option>
                    <option value="S">Rank S (+1500 XP)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-bold">TARGET ATTRIBUTE</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as PlayerStatKey)}
                    className="w-full px-2.5 py-2 bg-slate-900 border border-cyan-500/40 rounded text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="STR">STR (Strength)</option>
                    <option value="INT">INT (Intelligence)</option>
                    <option value="VIT">VIT (Vitality)</option>
                    <option value="AGI">AGI (Agility)</option>
                    <option value="DIS">DIS (Discipline)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-bold">QUEST TYPE</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as 'daily' | 'custom')}
                    className="w-full px-2.5 py-2 bg-slate-900 border border-cyan-500/40 rounded text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="custom">Custom Quest</option>
                    <option value="daily">Daily Reset Quest</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">DEADLINE (OPTIONAL)</label>
                  <input
                    type="text"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    placeholder="e.g. By 6:00 PM"
                    className="w-full px-2.5 py-2 bg-slate-900 border border-cyan-500/40 rounded text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-heading font-black text-xs tracking-wider uppercase rounded shadow-lg shadow-cyan-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Register Quest
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-3 px-4 bg-slate-900 border border-slate-700 text-slate-400 hover:text-white rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
