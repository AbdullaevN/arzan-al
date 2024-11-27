// vite.config.ts
import { defineConfig } from "file:///C:/Users/nno/Desktop/my-cargo-app/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/nno/Desktop/my-cargo-app/node_modules/@vitejs/plugin-react/dist/index.mjs";
import viteCompression from "file:///C:/Users/nno/Desktop/my-cargo-app/node_modules/vite-plugin-compression/dist/index.mjs";
var vite_config_default = defineConfig(
  {
    server: {
      proxy: {
        "/delete": "https://cargo-back.onrender.com"
      }
    },
    plugins: [
      react(),
      viteCompression({
        algorithm: "gzip",
        // Используем алгоритм сжатия gzip
        ext: ".gz",
        // Расширение для сжатых файлов
        threshold: 1024,
        // Минимальный размер файла для сжатия в байтах
        deleteOriginFile: false
        // Оставляем исходные файлы для fallback
      }),
      viteCompression({
        algorithm: "brotliCompress",
        // Добавляем Brotli-сжатие
        ext: ".br"
        // Расширение для Brotli-файлов
      })
    ],
    base: "/"
    // Keep this as '/' for root path
    // build: {
    //   outDir: 'dist',  // Correct output directory
    // },
    // server: {
    //   port: 3000,  // Local development port
    // },
  }
);
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxubm9cXFxcRGVza3RvcFxcXFxteS1jYXJnby1hcHBcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXG5ub1xcXFxEZXNrdG9wXFxcXG15LWNhcmdvLWFwcFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvbm5vL0Rlc2t0b3AvbXktY2FyZ28tYXBwL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCB2aXRlQ29tcHJlc3Npb24gZnJvbSAndml0ZS1wbHVnaW4tY29tcHJlc3Npb24nO1xuXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoXG4gIFxuICBcbiAge1xuICAgIHNlcnZlcjoge1xuICAgICAgcHJveHk6IHtcbiAgICAgICAgJy9kZWxldGUnOiAnaHR0cHM6Ly9jYXJnby1iYWNrLm9ucmVuZGVyLmNvbScsXG4gICAgICB9LFxuICAgIH0sXG4gIHBsdWdpbnM6IFtyZWFjdCgpLFxuIFxuXG4gICAgdml0ZUNvbXByZXNzaW9uKHtcbiAgICAgIGFsZ29yaXRobTogJ2d6aXAnLCAgICAgIC8vIFx1MDQxOFx1MDQ0MVx1MDQzRlx1MDQzRVx1MDQzQlx1MDQ0Q1x1MDQzN1x1MDQ0M1x1MDQzNVx1MDQzQyBcdTA0MzBcdTA0M0JcdTA0MzNcdTA0M0VcdTA0NDBcdTA0MzhcdTA0NDJcdTA0M0MgXHUwNDQxXHUwNDM2XHUwNDMwXHUwNDQyXHUwNDM4XHUwNDRGIGd6aXBcbiAgICAgIGV4dDogJy5neicsICAgICAgICAgICAgIC8vIFx1MDQyMFx1MDQzMFx1MDQ0MVx1MDQ0OFx1MDQzOFx1MDQ0MFx1MDQzNVx1MDQzRFx1MDQzOFx1MDQzNSBcdTA0MzRcdTA0M0JcdTA0NEYgXHUwNDQxXHUwNDM2XHUwNDMwXHUwNDQyXHUwNDRCXHUwNDQ1IFx1MDQ0NFx1MDQzMFx1MDQzOVx1MDQzQlx1MDQzRVx1MDQzMlxuICAgICAgdGhyZXNob2xkOiAxMDI0LCAgICAgICAgLy8gXHUwNDFDXHUwNDM4XHUwNDNEXHUwNDM4XHUwNDNDXHUwNDMwXHUwNDNCXHUwNDRDXHUwNDNEXHUwNDRCXHUwNDM5IFx1MDQ0MFx1MDQzMFx1MDQzN1x1MDQzQ1x1MDQzNVx1MDQ0MCBcdTA0NDRcdTA0MzBcdTA0MzlcdTA0M0JcdTA0MzAgXHUwNDM0XHUwNDNCXHUwNDRGIFx1MDQ0MVx1MDQzNlx1MDQzMFx1MDQ0Mlx1MDQzOFx1MDQ0RiBcdTA0MzIgXHUwNDMxXHUwNDMwXHUwNDM5XHUwNDQyXHUwNDMwXHUwNDQ1XG4gICAgICBkZWxldGVPcmlnaW5GaWxlOiBmYWxzZSAvLyBcdTA0MUVcdTA0NDFcdTA0NDJcdTA0MzBcdTA0MzJcdTA0M0JcdTA0NEZcdTA0MzVcdTA0M0MgXHUwNDM4XHUwNDQxXHUwNDQ1XHUwNDNFXHUwNDM0XHUwNDNEXHUwNDRCXHUwNDM1IFx1MDQ0NFx1MDQzMFx1MDQzOVx1MDQzQlx1MDQ0QiBcdTA0MzRcdTA0M0JcdTA0NEYgZmFsbGJhY2tcbiAgICB9KSxcbiAgICB2aXRlQ29tcHJlc3Npb24oe1xuICAgICAgYWxnb3JpdGhtOiAnYnJvdGxpQ29tcHJlc3MnLCAvLyBcdTA0MTRcdTA0M0VcdTA0MzFcdTA0MzBcdTA0MzJcdTA0M0JcdTA0NEZcdTA0MzVcdTA0M0MgQnJvdGxpLVx1MDQ0MVx1MDQzNlx1MDQzMFx1MDQ0Mlx1MDQzOFx1MDQzNVxuICAgICAgZXh0OiAnLmJyJyAgICAgICAgICAgICAgICAgICAvLyBcdTA0MjBcdTA0MzBcdTA0NDFcdTA0NDhcdTA0MzhcdTA0NDBcdTA0MzVcdTA0M0RcdTA0MzhcdTA0MzUgXHUwNDM0XHUwNDNCXHUwNDRGIEJyb3RsaS1cdTA0NDRcdTA0MzBcdTA0MzlcdTA0M0JcdTA0M0VcdTA0MzJcbiAgICB9KVxuICBdLFxuICBiYXNlOiAnLycsICAvLyBLZWVwIHRoaXMgYXMgJy8nIGZvciByb290IHBhdGhcbiAgLy8gYnVpbGQ6IHtcbiAgLy8gICBvdXREaXI6ICdkaXN0JywgIC8vIENvcnJlY3Qgb3V0cHV0IGRpcmVjdG9yeVxuICAvLyB9LFxuICAvLyBzZXJ2ZXI6IHtcbiAgLy8gICBwb3J0OiAzMDAwLCAgLy8gTG9jYWwgZGV2ZWxvcG1lbnQgcG9ydFxuICAvLyB9LFxuICBcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQStSLFNBQVMsb0JBQW9CO0FBQzVULE9BQU8sV0FBVztBQUNsQixPQUFPLHFCQUFxQjtBQUk1QixJQUFPLHNCQUFRO0FBQUEsRUFHYjtBQUFBLElBQ0UsUUFBUTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0wsV0FBVztBQUFBLE1BQ2I7QUFBQSxJQUNGO0FBQUEsSUFDRixTQUFTO0FBQUEsTUFBQyxNQUFNO0FBQUEsTUFHZCxnQkFBZ0I7QUFBQSxRQUNkLFdBQVc7QUFBQTtBQUFBLFFBQ1gsS0FBSztBQUFBO0FBQUEsUUFDTCxXQUFXO0FBQUE7QUFBQSxRQUNYLGtCQUFrQjtBQUFBO0FBQUEsTUFDcEIsQ0FBQztBQUFBLE1BQ0QsZ0JBQWdCO0FBQUEsUUFDZCxXQUFXO0FBQUE7QUFBQSxRQUNYLEtBQUs7QUFBQTtBQUFBLE1BQ1AsQ0FBQztBQUFBLElBQ0g7QUFBQSxJQUNBLE1BQU07QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBUVI7QUFBQzsiLAogICJuYW1lcyI6IFtdCn0K
