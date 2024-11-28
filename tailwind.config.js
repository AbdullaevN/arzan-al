/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customGreen: '#97ff9c', 
        bgGreen: '#89e828', 
        bgOrange: '#CD6E00', 
        bgGray: '#d5dcd5', 
        bgBlue:'#87cdff',
        customBlue:'#284A7E'
        
      },
    },
  },
  plugins: [],
}

