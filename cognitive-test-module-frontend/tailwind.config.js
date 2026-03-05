/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#541A75',
          light: '#7E3CA3',
          dark: '#3A1153'
        },
        secondary: '#7E7F9A',
        accent: '#CB1527',
        success: '#00635D',
        warning: '#E6A800',
        info: '#2A6EBB',
        bg: {
          primary: '#F0F0F0',
          card: '#FFFFFF',
          sidebar: '#2C1B47'
        },
        text: {
          dark: '#1A1A2E',
          medium: '#4A4A6A',
          light: '#7E7F9A'
        },
        border: '#E1E3EB'
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      boxShadow: {
        DEFAULT: '0 4px 12px rgba(84, 26, 117, 0.08)',
      }
    },
  },
  plugins: [],
}
