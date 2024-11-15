import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression';


// https://vitejs.dev/config/
export default defineConfig(
  
  
  {
  plugins: [react(),
 

    viteCompression({
      algorithm: 'gzip',      // Используем алгоритм сжатия gzip
      ext: '.gz',             // Расширение для сжатых файлов
      threshold: 1024,        // Минимальный размер файла для сжатия в байтах
      deleteOriginFile: false // Оставляем исходные файлы для fallback
    }),
    viteCompression({
      algorithm: 'brotliCompress', // Добавляем Brotli-сжатие
      ext: '.br'                   // Расширение для Brotli-файлов
    })
  ],
  base: '/',  // Keep this as '/' for root path
  // build: {
  //   outDir: 'dist',  // Correct output directory
  // },
  // server: {
  //   port: 3000,  // Local development port
  // },
  
})
