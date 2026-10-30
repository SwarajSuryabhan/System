/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        system: {
          darkest: '#030712',
          dark: '#070d1e',
          panel: 'rgba(8, 18, 40, 0.88)',
          card: 'rgba(13, 27, 60, 0.75)',
          border: 'rgba(0, 229, 255, 0.35)',
          borderGlow: 'rgba(0, 240, 255, 0.8)',
          blue: '#00e5ff',
          cyan: '#38bdf8',
          electric: '#00b4d8',
          amber: '#fbbf24',
          crimson: '#ff0055',
          warning: '#ef4444',
          purple: '#a855f7',
        },
        rank: {
          E: '#94a3b8',
          D: '#34d399',
          C: '#38bdf8',
          B: '#a855f7',
          A: '#f43f5e',
          S: '#fbbf24',
        }
      },
      boxShadow: {
        'system-glow': '0 0 15px rgba(0, 229, 255, 0.35)',
        'system-glow-lg': '0 0 30px rgba(0, 229, 255, 0.55)',
        'system-crimson': '0 0 20px rgba(255, 0, 85, 0.5)',
        'rank-s': '0 0 25px rgba(251, 191, 36, 0.6)',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'level-up': 'levelUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'glitch': 'glitch 0.4s ease-in-out',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(0.995)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        levelUp: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, -2px)' },
          '60%': { transform: 'translate(-1px, -1px)' },
          '80%': { transform: 'translate(1px, 1px)' },
          '100%': { transform: 'translate(0)' },
        }
      }
    },
  },
  plugins: [],
}
