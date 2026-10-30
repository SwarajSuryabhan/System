import React, { useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Navigation } from './components/Navigation';
import { NotificationToast } from './components/NotificationToast';
import { LevelUpModal } from './components/LevelUpModal';
import { RankUpModal } from './components/RankUpModal';
import { OnboardingModal } from './components/OnboardingModal';
import { StatusPage } from './pages/StatusPage';
import { QuestsPage } from './pages/QuestsPage';
import { RecordsPage } from './pages/RecordsPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { activeTab } = useGame();

  // Register PWA Service Worker for offline support
  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('Service worker registration failed:', err);
        });
      });
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-system-darkest text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      {/* Background Ambience & Cyber Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,229,255,0.08)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.05)_0%,transparent_50%)]" />
        <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />
      </div>

      {/* App Structure */}
      <div className="relative z-10 flex-1 flex flex-col">
        <Navigation />

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 pb-28 sm:pb-24">
          {activeTab === 'status' && <StatusPage />}
          {activeTab === 'quests' && <QuestsPage />}
          {activeTab === 'records' && <RecordsPage />}
          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Floating System Modals & Overlays */}
      <NotificationToast />
      <LevelUpModal />
      <RankUpModal />
      <OnboardingModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
};

export default App;
