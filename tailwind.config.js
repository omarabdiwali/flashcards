/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      height: {
        'quarter': '60vh',
        'body': '20vh'
      },
      width: {
        'cardfull': '22vw',
        'cardsmall': '40vw',
        'cardall': '95vw'
      },
      maxHeight: {
        'body': '35vh'
      },
      screens: {
        'xs': '376px',
        'xxs': '0px'
      }
    },
  },
  plugins: [],
}
