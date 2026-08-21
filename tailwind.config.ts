import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: '#D4AF37',
        'gold-dim': '#8B7530',
        'electric-blue': '#00D4FF',
        crimson: '#FF0040',
        surface: '#0a0a0a',
        'surface-elevated': '#1a1a1a',
        'text-secondary': '#B0B0B0',
        'text-muted': '#6B6B6B',
      },
    },
  },
  plugins: [],
};

export default config;
