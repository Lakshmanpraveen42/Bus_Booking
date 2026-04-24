/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--primary-50, #fef2f2)',
          100: 'var(--primary-100, #fee2e2)',
          200: 'var(--primary-200, #fecaca)',
          300: 'var(--primary-300, #fca5a5)',
          400: 'var(--primary-400, #f87171)',
          500: 'var(--primary)', // Map 500 to our variable
          600: 'var(--primary-hover)',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        accent: {
          500: 'var(--accent)',
          600: '#ea580c',
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-border': 'var(--card-border)',
        surface: 'var(--surface)',
        muted: 'var(--muted)',
        'muted-light': 'var(--muted-light)',
        'input-bg': 'var(--input-bg)',
        border: 'var(--input-border)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.12)',
        modal: '0 20px 60px rgba(0,0,0,0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'pulse-soft': 'pulseSoft 1.8s ease-in-out infinite',
        'spin-slow': 'spin 1.5s linear infinite',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.22,1,0.36,1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '60%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
