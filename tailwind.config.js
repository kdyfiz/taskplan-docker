/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/main/webapp/**/*.{js,ts,jsx,tsx}', './src/main/webapp/index.html'],
  theme: {
    extend: {
      colors: {
        border: 'oklch(0.922 0 0)',
        input: 'oklch(0.922 0 0)',
        ring: 'oklch(0.708 0 0)',
        background: 'oklch(1 0 0)',
        foreground: 'oklch(0.145 0 0)',
        primary: {
          DEFAULT: 'oklch(0.55 0.22 263)',
          foreground: 'oklch(0.985 0 0)',
        },
        secondary: {
          DEFAULT: 'oklch(0.97 0 0)',
          foreground: 'oklch(0.205 0 0)',
        },
        destructive: {
          DEFAULT: 'oklch(0.577 0.245 27.325)',
          foreground: 'oklch(0.985 0 0)',
        },
        muted: {
          DEFAULT: 'oklch(0.97 0 0)',
          foreground: 'oklch(0.556 0 0)',
        },
        accent: {
          DEFAULT: 'oklch(0.97 0 0)',
          foreground: 'oklch(0.205 0 0)',
        },
        popover: {
          DEFAULT: 'oklch(1 0 0)',
          foreground: 'oklch(0.145 0 0)',
        },
        card: {
          DEFAULT: 'oklch(1 0 0)',
          foreground: 'oklch(0.145 0 0)',
        },
      },
      borderRadius: {
        lg: '0.625rem',
        md: 'calc(0.625rem - 2px)',
        sm: 'calc(0.625rem - 4px)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
  darkMode: ['class'],
  corePlugins: {
    preflight: false, // Disable to avoid conflicts with Bootstrap
  },
};
