<div align="center">

# ⚔️ THE SYSTEM (Solo Leveling)
### Gamified Real-Life Productivity & Habit RPG Web App

> **"[SYSTEM] You have been chosen as a Player."**  
> *Architect: **Swaraj Suryabhan***

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline_Ready-00f0ff?style=for-the-badge&logo=pwa&logoColor=black)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

[**🌐 Live Web App**](https://swarajsuryabhan.github.io/System/) • [**📱 Install as PWA**](#-install-on-mobile--desktop-pwa) • [**⚡ Quickstart**](#-quickstart-guide) • [**🎮 Game Mechanics**](#-game-mechanics--rules)

</div>

---

## 🌌 Overview

**The System** is a mobile-first, offline-capable Progressive Web Application (PWA) inspired by the mysterious "System" interface from the anime and manhwa ***Solo Leveling***. 

Instead of an ordinary to-do list, your daily real-life obligations, fitness sets, deep work hours, and habits are transformed into **Quests**. Completing quests rewards Experience Points (**XP**), increases your character attributes, levels you up, and ascends your Hunter Rank from **E-Rank Novice** to **S-Rank Monarch**. 

Neglect your daily duties before midnight, and the System plunges you into the dreaded **Penalty Zone**!

---

## ✨ Key Features

### 1. 🪟 The Status Window
* Authentic holographic HUD with scanlines, glowing cyan borders, and corner brackets.
* Live status: **Hunter Name**, **Level**, **Rank Badge** (E $\rightarrow$ D $\rightarrow$ C $\rightarrow$ B $\rightarrow$ A $\rightarrow$ S), and **Equipped Title**.
* Vital gauges: **HP** (derived from Vitality), **MP** (derived from Intelligence), and animated **XP Progress Bar**.
* **5 Core Attributes**:
  * **STR (Strength)**: Fitness, strength workouts, bodyweight training.
  * **INT (Intelligence)**: Deep study, reading, programming, skill acquisition.
  * **VIT (Vitality)**: Sleep schedule, hydration, cellular recovery.
  * **AGI (Agility)**: Speed, cardio, punctuality, daily step targets.
  * **DIS (Discipline)**: Meditation, habit adherence, mental resilience.
* **Stat Allocation**: Earn **+3 unallocated Stat Points** every level-up to customize your build.

### 2. 📜 Quest System
* **Daily Quests**: Pre-seeded with healthy routines (Push-ups, 1-Hour Focus Study, 8-Hour Sleep, 7k Steps, Hydration & Meditation) that reset every midnight with an active countdown timer.
* **Custom Quests**: Create your own tasks with difficulty ratings (E, D, C, B, A, S), associated attributes, and optional deadlines.
* **Instant Rewards**: Earn scaled XP and attribute points upon checking off tasks.

### 3. ⚡ Leveling & Rank Ascension
* Progressive mathematical XP curve: $\text{XP}_{\text{req}}(L) = \lfloor 100 \times L^{1.4} \rfloor$.
* Cinematic `[SYSTEM] LEVEL UP!` modal with particle confetti and fanfare.
* Rank promotion notifications when crossing Hunter thresholds (E $\rightarrow$ D at Lv. 10, C at Lv. 20, B at Lv. 35, A at Lv. 50, S at Lv. 70).

### 4. 💀 The Penalty Zone
* If daily quests are left uncompleted at the midnight reset:
  * Triggers an ominous crimson **[SYSTEM WARNING]** overlay.
  * Deducts XP (never drops below 0) and resets your daily streak.
  * Issues a physical **Survival Trial** quest that must be cleared to exit the Penalty Zone.

### 5. 🏆 Records, Titles & Archives
* **Equippable Titles**: Unlock titles (*The Awakened*, *Early Riser*, *Iron Will*, *Survivor of the Pit*, *Scholar of the Void*, *Shadow Monarch*) that visibly equip in your Status Window.
* **Hunter Achievements**: Track progress toward milestones across quests, streaks, and attribute thresholds.
* **System Activity Log**: Filterable chronological history of completed quests, level-ups, stat gains, and penalties.

### 6. 🔊 Procedural Web Audio Engine
* High-tech sci-fi chimes, level-up fanfares, and penalty sirens generated dynamically using the browser's built-in **Web Audio API**.
* **Zero external audio downloads** — 100% offline, ultra-low latency, and fully muteable.

### 7. 💾 Local Data Layer & Portability
* Full game state persisted in `localStorage`.
* **Export & Import**: Download your progress as a clean `.json` file to restore or migrate across devices.
* Clean data abstraction (`storageService.ts`) ready to connect to cloud databases (Supabase / Firebase).

### 8. 🛠️ Developer Trial Matrix
* Built-in developer tools in the **SYSTEM** tab to instantly test midnight reset, simulate the Penalty Zone, or grant XP boosts without waiting 24 hours.

---

## 📁 Project Architecture

```
solo-leveling-system/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD workflow
├── public/
│   ├── icon.svg                # Hunter Crest vector app icon
│   ├── manifest.webmanifest    # PWA installable manifest
│   └── sw.js                   # Cache-First Service Worker for 100% offline access
├── src/
│   ├── audio/
│   │   └── systemAudio.ts      # Web Audio API procedural sound engine
│   ├── components/
│   │   ├── LevelUpModal.tsx    # Dramatic [SYSTEM] LEVEL UP! modal & confetti
│   │   ├── Navigation.tsx      # Mobile bottom bar & desktop header
│   │   ├── NotificationToast.tsx# System notification popups
│   │   ├── OnboardingModal.tsx # System Awakening introduction
│   │   ├── PenaltyOverlay.tsx  # Penalty Zone survival warning
│   │   ├── ProgressBar.tsx     # Animated HP / MP / XP gauges
│   │   ├── RankBadge.tsx       # E to S Rank badges with neon glows
│   │   ├── RankUpModal.tsx     # Rank tier ascension celebration
│   │   └── SystemWindow.tsx    # Translucent holographic window container
│   ├── context/
│   │   └── GameContext.tsx     # Centralized state management & game dispatcher
│   ├── game/
│   │   └── gameLogic.ts        # Pure game math (XP curve, ranks, penalties, rewards)
│   ├── pages/
│   │   ├── QuestsPage.tsx      # Daily & Custom quests manager
│   │   ├── RecordsPage.tsx     # Titles, Achievements & Activity Logs
│   │   ├── SettingsPage.tsx    # Data backup, Profile, Creator info & Dev matrix
│   │   └── StatusPage.tsx      # Iconic Hunter Status Window
│   ├── services/
│   │   └── storageService.ts   # LocalStorage data persistence layer
│   ├── types/
│   │   └── index.ts            # TypeScript definitions (Player, Quests, Stats, etc.)
│   ├── App.tsx                 # Root component
│   ├── index.css               # Cyberpunk styling, scanlines & neon utilities
│   └── main.tsx                # React entrypoint
├── index.html                  # HTML5 shell with PWA meta tags & fonts
├── tailwind.config.js          # Custom anime-inspired neon palette
├── vite.config.ts              # Vite configuration with relative base
└── package.json                # Project dependencies
```

---

## ⚡ Quickstart Guide

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.0.0 or later)
* [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### 1. Clone the Repository
```bash
git clone https://github.com/SwarajSuryabhan/System.git
cd System
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 4. Build for Production
```bash
npm run build
```
To test the built production files locally:
```bash
npm run preview
```

---

## 📱 Install on Mobile / Desktop (PWA)

This app is a certified **Progressive Web App (PWA)** and can be installed as a native-like app:

### On iPhone / iPad (Safari):
1. Open the app URL in **Safari**.
2. Tap the **Share** button (box with an upward arrow) at the bottom.
3. Scroll down and tap **"Add to Home Screen"**.
4. Tap **Add**. The System icon will appear on your home screen and run full-screen offline!

### On Android (Chrome):
1. Open the app URL in **Chrome**.
2. Tap the **three-dots menu** (⋮) at the top right.
3. Tap **"Install App"** or **"Add to Home screen"**.
4. Confirm installation.

### On Desktop (Chrome / Edge / Brave):
1. Look for the **Install icon** in the address bar (or menu $\rightarrow$ Install "Solo Leveling System").
2. The app will launch in its own standalone, distraction-free window.

---

## 🌐 Deploy to the Cloud

### Automated Deployment to GitHub Pages
This repository includes a preconfigured GitHub Actions workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):
1. Go to your repository **Settings** on GitHub: `https://github.com/SwarajSuryabhan/System/settings/pages`.
2. Under **Build and deployment** $\rightarrow$ **Source**, select **GitHub Actions**.
3. Push to the `main` branch:
   ```bash
   git add .
   git commit -m "Deploy System PWA"
   git push origin main
   ```
4. GitHub Actions will automatically build and publish your app at:
   `https://swarajsuryabhan.github.io/System/`

### Deploy to Vercel (One-Click)
1. Push this repository to your GitHub account.
2. Go to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your `System` repository.
4. Framework Preset will auto-detect **Vite**.
5. Click **Deploy**!

---

## 🎮 Game Mechanics & Rules

All game balance is decoupled in [`src/game/gameLogic.ts`](src/game/gameLogic.ts):

### Hunter Rank Tiers
| Rank | Required Level | Classification |
| :---: | :---: | :--- |
| **Rank E** | Lv. 1 – 9 | *Novice Hunter* |
| **Rank D** | Lv. 10 – 19 | *Junior Hunter* |
| **Rank C** | Lv. 20 – 34 | *Adept Hunter* |
| **Rank B** | Lv. 35 – 49 | *Elite Hunter* |
| **Rank A** | Lv. 50 – 69 | *Master Hunter* |
| **Rank S** | Lv. 70+ | *National Level / Monarch* |

### Quest Reward Matrix
| Quest Difficulty | Recommended Scope | Base XP | Stat Boost |
| :---: | :--- | :---: | :---: |
| **Rank E** | Quick routine (hydrate, stretch 5 min) | **+25 XP** | +1 |
| **Rank D** | Standard habit (read 15 min, 25 pushups) | **+60 XP** | +1 |
| **Rank C** | Focused workout, 45 min deep study | **+150 XP** | +2 |
| **Rank B** | 90 min deep work, intense gym session | **+320 XP** | +3 |
| **Rank A** | Major project sprint or milestone | **+700 XP** | +4 |
| **Rank S** | Life milestone, marathon, epic feat | **+1,500 XP** | +6 |

---

## 🔮 Future Roadmap (Ready for Expansion)

The code architecture includes pre-structured TypeScript models in [`src/types/index.ts`](src/types/index.ts) for:
* **Dungeon Boss Raids (`DungeonBoss`)**: Weekly time-limited bosses defeated by completing quest streaks.
* **Shadow Extraction (`ShadowSoldier`)**: Turn habits maintained for 30+ days into loyal Shadow Soldiers that boost passive stats.
* **Remote Cloud Sync**: Swap `storageService.ts` for Supabase/Firebase authentication.

---

## 👤 Author & Credits

* **Architect**: **Swaraj Suryabhan**
* **Inspiration**: *Solo Leveling* by Chugong & DUBU (REDICE Studio).
* **Sound Design**: Procedural Web Audio synthesizer engine.

---

<div align="center">
<sub>[SYSTEM] Player Status: Active. The hunt begins.</sub>
</div>
