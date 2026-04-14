import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        calm: {
          50: "#f8fbfb",
          100: "#eaf3f3",
          200: "#d3e3e3",
          300: "#b7cfcf",
          400: "#8fb0b0",
          500: "#6f9191",
          600: "#557575",
          700: "#3f5a5a",
          800: "#314747",
          900: "#223333",
        },
      },
    },
  },
  plugins: [],
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
