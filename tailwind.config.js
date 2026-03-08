/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm wood palette — RoomCraft brand
        wood: {
          50:  '#FAF7F2',
          100: '#F3EDE3',
          200: '#E8DDD0',
          300: '#C9B99A',
          400: '#C8A882',
          500: '#A67C52',   // primary accent
          600: '#7A5230',   // dark walnut
          700: '#4A2F12',   // espresso
          800: '#2E1A08',
          900: '#1C1006',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      boxShadow: {
        'wood-sm': '0 1px 3px rgba(74, 47, 18, 0.08)',
        'wood-md': '0 4px 12px rgba(74, 47, 18, 0.10)',
        'wood-lg': '0 8px 24px rgba(74, 47, 18, 0.12)',
        'wood-xl': '0 16px 48px rgba(74, 47, 18, 0.18)',
      },
      height: {
        navbar: '64px',
      },
      width: {
        sidebar: '280px',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.4s ease forwards',
        'fade-in':    'fadeIn 0.3s ease forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}