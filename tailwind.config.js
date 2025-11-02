/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'marian-blue': {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#bae0ff',
          300: '#7cc8ff',
          400: '#36acff',
          500: '#0a91ff',
          600: '#0074e6',
          700: '#005bb8',
          800: '#004d97',
          900: '#003366',
          950: '#002040',
        },
        'sacred-gold': {
          50: '#fffdf0',
          100: '#fffae0',
          200: '#fff4c2',
          300: '#ffe888',
          400: '#ffd700',
          500: '#f5c842',
          600: '#e6a827',
          700: '#d1901a',
          800: '#b87817',
          900: '#9f6518',
          950: '#5c3a0a',
        },
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.3s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          'from': { opacity: '1' },
          'to': { opacity: '0' },
        },
        backgroundPulse: {
          '0%, 100%': { backgroundColor: 'rgba(240, 247, 255, 0.7)' }, // marian-blue-50 with backdrop
          '50%': { backgroundColor: 'rgba(224, 239, 255, 0.9)' }, // marian-blue-100 with backdrop
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
};
