/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        primary: { DEFAULT: '#4f46e5', 600: '#4f46e5' },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#f43f5e',
      },
      borderRadius: { xl: '0.75rem', '2xl': '1rem' },
      transitionDuration: { 200: '200ms' },
    },
  },
  plugins: [],
};
