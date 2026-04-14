import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        calm: {
          50: '#f4f8f8',
          100: '#e9f1f1',
          500: '#2e7373',
          700: '#205253',
          900: '#123233'
        }
      }
    }
  },
  plugins: []
};

export default config;
