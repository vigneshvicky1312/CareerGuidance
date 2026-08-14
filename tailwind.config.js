/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B1220',
        navy: {
          950: '#0A1330',
          900: '#0F1B42',
          800: '#152657',
          700: '#1B3273',
          600: '#22409A',
          500: '#2B52C4',
        },
        sky: {
          400: '#4FB6E8',
          500: '#2FA0DA',
        },
        gold: {
          400: '#E8B24D',
          500: '#D89B2C',
        },
        paper: '#F7F9FC',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        'navy-gradient': 'linear-gradient(135deg, #0A1330 0%, #1B3273 55%, #2B52C4 100%)',
        'ticket-perforation': 'radial-gradient(circle, transparent 0, transparent 4px, #F7F9FC 4px)',
      },
      boxShadow: {
        card: '0 10px 30px -12px rgba(15, 27, 66, 0.25)',
      },
    },
  },
  plugins: [],
}
