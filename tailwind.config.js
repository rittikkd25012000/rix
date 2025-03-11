/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#622d6a',
          light: '#c387c9',
          dark: '#36013f'
        },
        'accent': {
          DEFAULT: '#FF7061',
          light: '#ff8f83',
          dark: '#8f0010'
        },
        'background': '#000000',
        'surface': '#0a0a0a',
        'text': {
          primary: '#FFFFFF',
          secondary: '#e0e0e0'
        },
        'bg': {
          100: '#000000',
          200: '#0a0a0a',
          300: '#121212'
        }
      },
      fontFamily: {
        sans: ['var(--font-bebas-neue)', 'system-ui', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '2rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
} 
