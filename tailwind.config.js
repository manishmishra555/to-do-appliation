// tailwind.config.js (simplified version)
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#137fec',
        'background-light': '#f6f7f8',
        'background-dark': '#101922',
        'surface-light': '#ffffff',
        'surface-dark': '#1a2632',
        'text-main-light': '#111418',
        'text-main-dark': '#e0e6ed',
        'text-secondary-light': '#617589',
        'text-secondary-dark': '#94a3b8',
        'border-light': '#dbe0e6',
        'border-dark': '#2d3a4a',
      },
      fontFamily: {
        'display': ['Inter', 'sans-serif']
      },
    },
  },
  plugins: [],
}