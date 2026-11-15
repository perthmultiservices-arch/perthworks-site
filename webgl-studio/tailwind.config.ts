import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF6EF',
        blush: '#F3D9D5',
        raspberry: '#B23A52',
        raspberry2: '#8C2A40',
        cocoa: '#2B1A17',
        cocoa2: '#1C110F',
        gold: '#C9A24C',
        goldLight: '#E6C878',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
