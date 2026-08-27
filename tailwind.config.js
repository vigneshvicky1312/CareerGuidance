/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#090E1A',
        navy: {
          950: '#060B18',
          900: '#0A1330',
          850: '#0D193E',
          800: '#122254',
          700: '#182E6E',
          600: '#203E94',
          500: '#2A51BD',
          400: '#3D68DF',
        },
        sky: {
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
        },
        cyan: {
          400: '#22D3EE',
          500: '#06B6D4',
        },
        gold: {
          300: '#FDE047',
          400: '#FACC15',
          500: '#EAB308',
          600: '#CA8A04',
        },
        paper: '#F8FAFC',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', '"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        'navy-gradient': 'linear-gradient(135deg, #060B18 0%, #0A1330 35%, #122254 75%, #182E6E 100%)',
        'navy-radial': 'radial-gradient(ellipse at top, #122254 0%, #0A1330 50%, #060B18 100%)',
        'gold-gradient': 'linear-gradient(135deg, #FDE047 0%, #EAB308 50%, #CA8A04 100%)',
        'ticket-perforation': 'radial-gradient(circle, transparent 0, transparent 4px, #F8FAFC 4px)',
      },
      boxShadow: {
        card: '0 10px 30px -10px rgba(6, 11, 24, 0.08), 0 2px 6px -1px rgba(6, 11, 24, 0.04)',
        'card-hover': '0 20px 40px -15px rgba(6, 11, 24, 0.14), 0 8px 16px -4px rgba(6, 11, 24, 0.06)',
        'glow-sky': '0 0 35px -5px rgba(56, 189, 248, 0.35)',
        'glow-gold': '0 0 35px -5px rgba(234, 179, 8, 0.35)',
        'pass-3d': '0 30px 60px -15px rgba(6, 11, 24, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.15)',
      },
      animation: {
        'marquee-slow': 'marquee 35s linear infinite',
        'marquee-reverse': 'marquee-reverse 35s linear infinite',
        'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'shimmer-sweep': 'shimmer 2.5s infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
