import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { SystemWindow } from '../components/SystemWindow';
import {
  Download,
  Upload,
  Volume2,
  VolumeX,
  AlertTriangle,
  User,
  ShieldAlert,
  Zap,
  Calendar,
  Save,
  Info,
  Sparkles,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    gameState,
    updatePlayerName,
    toggleSound,
    resetAllData,
    exportData,
    importData,
    devSimulateMidnight,
    devAddXp,
  } = useGame();

  const { player } = gameState;
  const [nameInput, setNameInput] = useState(player.name);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [showImportArea, setShowImportArea] = useState(false);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      updatePlayerName(nameInput.trim());
    }
  };

  const handleExport = () => {
    const dataStr = exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `solo-leveling-system-save-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importData(content);
      }
    };
    reader.readAsText(file);
  };

  const handleManualImport = () => {
    if (!importJson.trim()) return;
    importData(importJson);
    setImportJson('');
    setShowImportArea(false);
  };

  return (
    <div className="space-y-6">
      {/* Hunter Identity Settings */}
      <SystemWindow title="HUNTER IDENTIFICATION & AUDIO">
        <form onSubmit={handleSaveName} className="space-y-4 font-mono-tech text-xs">
          <div>
            <label className="block text-slate-300 mb-1.5 font-bold flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>HUNTER NAME</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                maxLength={24}
                className="flex-1 px-3 py-2 bg-slate-900 border border-cyan-500/40 rounded text-sm text-white focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-400 text-cyan-300 hover:text-slate-950 border border-cyan-400 rounded text-xs font-heading font-bold transition-all flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>SAVE</span>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-cyan-500/20 flex items-center justify-between">
            <div>
              <span className="text-white font-bold block text-sm">System Synthesizer Audio</span>
              <span className="text-slate-400 text-[11px]">
                Low-latency procedural audio cues for quests, level-ups, and alerts
              </span>
            </div>
            <button
              type="button"
              onClick={toggleSound}
              className={`p-2 rounded border transition-all ${
                player.soundEnabled
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 box-glow-blue'
                  : 'bg-slate-900 text-slate-500 border-slate-700'
              }`}
            >
              {player.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        </form>
      </SystemWindow>

      {/* Data Backup & Migration */}
      <SystemWindow title="DATA PERSISTENCE & BACKUP">
        <div className="space-y-4 font-mono-tech text-xs">
          <p className="text-slate-400 leading-relaxed">
            All Hunter data is stored locally in your browser storage. You can export a portable JSON backup file or restore your progress across devices.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExport}
              className="px-4 py-2.5 bg-slate-900 hover:bg-cyan-950/40 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 rounded flex items-center gap-2 font-heading text-xs font-bold transition-all"
            >
              <Download className="w-4 h-4" />
              <span>EXPORT BACKUP JSON</span>
            </button>

            <label className="px-4 py-2.5 bg-slate-900 hover:bg-cyan-950/40 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 rounded flex items-center gap-2 font-heading text-xs font-bold transition-all cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>RESTORE FROM FILE</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>

            <button
              onClick={() => setShowImportArea(!showImportArea)}
              className="px-3 py-2.5 text-slate-400 hover:text-slate-200 underline text-xs"
            >
              {showImportArea ? 'Hide Raw JSON' : 'Paste Raw JSON'}
            </button>
          </div>

          {showImportArea && (
            <div className="space-y-2 pt-2">
              <textarea
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder="Paste backup JSON string here..."
                rows={4}
                className="w-full px-3 py-2 bg-slate-900 border border-cyan-500/30 rounded text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={handleManualImport}
                className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded text-xs uppercase"
              >
                Apply Imported Data
              </button>
            </div>
          )}
        </div>
      </SystemWindow>

      {/* Developer Testing Console (For Verification & Testing) */}
      <SystemWindow
        title="DEVELOPER TRIAL MATRIX (TEST CONSOLE)"
        subtitle="SIMULATE REAL-TIME GAME STATES INSTANTLY"
        variant="gold"
      >
        <div className="space-y-3 font-mono-tech text-xs">
          <p className="text-amber-200/90 leading-relaxed">
            Use these controls to test complete game flows (midnight reset streak, penalty trigger, level-up and rank-up fanfare) without waiting 24 hours.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            <button
              onClick={() => devAddXp(250)}
              className="p-2.5 rounded bg-amber-950/40 hover:bg-amber-950/70 border border-amber-500/40 text-amber-300 flex items-center gap-2 transition-all text-left"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <div>
                <span className="font-bold block">+250 XP Boost</span>
                <span className="text-[10px] text-slate-400">Triggers level-up check</span>
              </div>
            </button>

            <button
              onClick={() => devAddXp(2500)}
              className="p-2.5 rounded bg-amber-950/40 hover:bg-amber-950/70 border border-amber-500/40 text-amber-300 flex items-center gap-2 transition-all text-left"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <div>
                <span className="font-bold block">+2,500 XP Massive Boost</span>
                <span className="text-[10px] text-slate-400">Triggers rank ascension check</span>
              </div>
            </button>

            <button
              onClick={() => devSimulateMidnight(false)}
              className="p-2.5 rounded bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 flex items-center gap-2 transition-all text-left"
            >
              <Calendar className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="font-bold block">Simulate Midnight Reset</span>
                <span className="text-[10px] text-slate-400">Tests streak increment / bonus</span>
              </div>
            </button>

            <button
              onClick={() => devSimulateMidnight(true)}
              className="p-2.5 rounded bg-rose-950/40 hover:bg-rose-950/70 border border-rose-500/40 text-rose-300 flex items-center gap-2 transition-all text-left"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <div>
                <span className="font-bold block">Force Penalty Zone</span>
                <span className="text-[10px] text-slate-400">Fails daily obligations & triggers penalty</span>
              </div>
            </button>
          </div>
        </div>
      </SystemWindow>

      {/* About Section */}
      <SystemWindow title="ABOUT THE SYSTEM" subtitle="PROTOCOL SPECIFICATION & CREATOR">
        <div className="space-y-3 font-mono-tech text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded bg-slate-900/80 border border-cyan-500/30 box-glow-blue">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
                <Sparkles className="w-5 h-5 text-cyan-300" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block tracking-widest uppercase font-bold">
                  System Architect
                </span>
                <span className="text-sm sm:text-base font-black font-heading text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-cyan-400 glow-cyan">
                  Created by Swaraj Suryabhan
                </span>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-slate-400 block">PROTOCOL STATUS</span>
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 sm:justify-end">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                v1.0.0 (PWA Offline Ready)
              </span>
            </div>
          </div>

          <div className="p-3 rounded bg-slate-900/40 border border-slate-800 text-slate-400 leading-relaxed text-[11px] space-y-1">
            <p>
              &gt; Inspired by the mysterious &quot;System&quot; from <span className="text-slate-200 font-semibold">Solo Leveling</span>.
            </p>
            <p>
              &gt; Engineered to turn real-world daily productivity, fitness, and discipline into a progressive Hunter awakening.
            </p>
          </div>
        </div>
      </SystemWindow>

      {/* Dangerous Operations */}
      <SystemWindow title="SYSTEM OVERRIDE & RESET" variant="crimson">
        <div className="flex items-center justify-between font-mono-tech text-xs">
          <div>
            <span className="font-bold text-rose-300 block text-sm">Factory Reset Game Data</span>
            <span className="text-slate-400 text-[11px]">
              Wipes all levels, stats, custom quests, and streak logs back to initial awakening
            </span>
          </div>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3.5 py-2 bg-rose-950 border border-rose-500 text-rose-300 hover:bg-rose-900 font-heading font-bold rounded text-xs tracking-wider transition-all"
          >
            RESET ALL
          </button>
        </div>

        {/* Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative w-full max-w-sm p-6 bg-slate-950 border-2 border-rose-500 rounded text-center box-glow-red">
              <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-3 animate-bounce" />
              <h3 className="text-lg font-heading font-black text-rose-400 mb-2">
                CONFIRM SYSTEM PURGE?
              </h3>
              <p className="text-xs text-slate-300 font-mono-tech mb-5">
                This will eradicate all accumulated Hunter progress and stats. This action cannot be reversed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    resetAllData();
                    setShowResetConfirm(false);
                  }}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-heading font-bold text-xs uppercase rounded"
                >
                  Confirm Purge
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="py-2.5 px-4 bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </SystemWindow>
    </div>
  );
};
