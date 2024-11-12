/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customGreen: '#97ff9c', // добавляем пользовательский цвет
        customBlue:'#284A7E'
      },
    },
  },
  plugins: [],
}

