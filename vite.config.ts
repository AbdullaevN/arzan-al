import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',  // Keep this as '/' for root path
  // build: {
  //   outDir: 'dist',  // Correct output directory
  // },
  // server: {
  //   port: 3000,  // Local development port
  // },
})
