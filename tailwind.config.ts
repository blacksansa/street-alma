import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        preto: '#0B0A09',
        carvao: '#161412',
        grafite: '#221F1C',
        laranja: '#FF5C00',
        'laranja-claro': '#FF8A3D',
        areia: '#F4EFE8',
        cinza: '#9C948A',
      },
      fontFamily: {
        display: ['"Big Shoulders Display"', 'sans-serif'],
        body: ['Archivo', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
