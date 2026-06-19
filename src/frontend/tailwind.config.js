/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#fdf2f8', 100: '#fce7f3', 400: '#f472b6', 500: '#ec4899', 600: '#db2777', 700: '#be185d',
        },
        secondary: {
          50: '#f0fdfa', 100: '#ccfbf1', 500: '#14b8a6', 600: '#0d9488',
        },
        dark: {
          900: '#18181b', 800: '#27272a', 500: '#71717a', 400: '#a1a1aa',
        },
        surface: '#ffffff',
        background: '#f4f4f5',
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
        'card': '0 4px 20px rgba(0,0,0,0.05)',
        'glow': '0 0 25px rgba(236, 72, 153, 0.4)',
        'toast': '0 8px 30px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        '4xl': '2.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideLeft: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
