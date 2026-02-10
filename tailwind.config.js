/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Medical Blue Palette (Primary) - Soft Milky Medical Blue
        'medical': {
          50: '#fdfefe',
          100: '#f7fbfc',
          200: '#eaf5f7',
          300: '#d6ecf0',
          400: '#bcdde5',
          500: '#9bc9d4',
          600: '#7bb5c2',
          700: '#5ea1b0',
          800: '#4a8694',
          900: '#3b6b78',
        },
        // Sage Green Palette (Secondary) - Soft Milky Medical Green
        'sage': {
          50: '#fdfefd',
          100: '#f8faf8',
          200: '#eff4f0',
          300: '#e1eae3',
          400: '#ced9d1',
          500: '#b5c4b8',
          600: '#9cafa0',
          700: '#849a88',
          800: '#6b8570',
          900: '#566b5a',
        },
        // Soft Coral (Accent) - Muted Medical Coral
        'coral': {
          50: '#fefefd',
          100: '#fcfaf9',
          200: '#f7f1f0',
          300: '#f0e5e3',
          400: '#e6d5d2',
          500: '#dac0bc',
          600: '#cdaba6',
          700: '#c09691',
          800: '#a37f7a',
          900: '#876964',
        },
        // Clinical Gray (Neutral)
        'clinical': {
          50: '#fefefe',
          100: '#fdfdfd',
          200: '#fafafa',
          300: '#f7f7f7',
          400: '#f1f1f1',
          500: '#e5e5e5',
          600: '#d1d1d1',
          700: '#a3a3a3',
          800: '#737373',
          900: '#525252',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      }
    },
  },
  plugins: [],
}