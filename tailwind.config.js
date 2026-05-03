/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:   ['PoppinsLight', 'sans-serif'],
        medium: ['PoppinsMedium', 'sans-serif'],
        title:  ['PoppinsMedium', 'sans-serif'],
      },
      colors: {
        brand:          '#FF4B27',
        'brand-dark':   '#6D301D',
        'brand-light':  '#FF7A5A',
        'ha-dark':      '#1A1A1A',
        'ha-gray':      '#676767',
        'ha-border':    '#EBEBEB',
        'ha-bg':        '#F7F4F3',
        'ha-melon':     '#FFBBAE',
        'ha-cream':     '#FFF0ED',
        'ha-peach':     '#FFE4DC',
      },
      borderRadius: {
        'xl':  '12px',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      }
    },
  },
  plugins: [],
}
