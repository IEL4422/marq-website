/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#eef1f8',
          100: '#d5ddef',
          200: '#aabade',
          300: '#7a96cc',
          400: '#4f73b9',
          500: '#3356a3',
          600: '#26428a',
          700: '#1c3070',
          800: '#152459',
          900: '#0B1437',
          950: '#060c22',
        },
        gold: {
          50:  '#fdf9ec',
          100: '#faf0cc',
          200: '#f5de95',
          300: '#efc85a',
          400: '#e8b52a',
          500: '#D4AF37',
          600: '#c49a1c',
          700: '#a07c17',
          800: '#7d6119',
          900: '#674f19',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
