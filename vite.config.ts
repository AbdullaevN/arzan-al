import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',  // Убедитесь, что это соответствует пути на сервере
  build: {
    outDir: 'dist',  // Папка, в которую будет собираться ваш проект
  },
  server: {
    // Настройки локального сервера
    port: 3000,  // Порт для локальной разработки
  },
})
