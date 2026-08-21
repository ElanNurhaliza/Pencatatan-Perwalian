import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5ff',
          100: '#e0ebff',
          200: '#bae0ff',
          300: '#7cc2ff',
          400: '#369eff',
          500: '#1d4ed8', // Primary STMIK Royal Blue
          600: '#1e40af',
          700: '#1d3557',
          800: '#1e293b',
          900: '#0f172a',
        },
        sidebar: {
          bg: '#f8fafc',
          active: '#1d4ed8',
          text: '#475569',
          hover: '#e2e8f0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
