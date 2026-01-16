import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // You. First brand colors
        brand: {
          primary: '#3B82F6', // Blue
          secondary: '#1E293B', // Dark slate
          accent: '#22C55E', // Green for success
        },
      },
    },
  },
  plugins: [],
};

export default config;
