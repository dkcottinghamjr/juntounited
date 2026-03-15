import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream:      '#faf8f5',
        charcoal:   '#2c2c2c',
        terracotta: { DEFAULT: '#c2714f', light: '#d4896a', dark: '#a85d3f' },
        olive:      { DEFAULT: '#6b7c4e', light: '#8a9a6d', dark: '#556340' },
        ochre:      { DEFAULT: '#c49a3c', light: '#d4b060', dark: '#a8832e' },
        sand:       '#e8e0d0',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body:    ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        sans:    ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:       '0 1px 3px rgba(44,44,44,0.06), 0 4px 16px rgba(44,44,44,0.04)',
        'card-hover': '0 4px 12px rgba(44,44,44,0.10), 0 8px 32px rgba(44,44,44,0.06)',
      },
    },
  },
  plugins: [],
}

export default config
