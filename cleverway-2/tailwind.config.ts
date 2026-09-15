import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0b',
        bg: '#0d0d0f',
        bg2: '#111114',
        fg: '#f4f1ea',
        muted: '#9a968f',
        paper: '#f5f1e8',
        gold: { 1: '#e7ca8e', 2: '#c99f60', 3: '#a87c3e' },
      },
      fontFamily: {
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        elegant: ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
