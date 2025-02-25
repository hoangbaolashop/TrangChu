import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // Cấu hình base URL. Đổi nếu deploy vào subdirectory (ví dụ '/my-app/')
  plugins: [react()],
  server: {
    port: 3009, 
  },
  build: {
    outDir: 'dist', // Thư mục đầu ra sau khi build
    assetsDir: 'assets', // Thư mục chứa file tĩnh trong `dist`
  }, 
})
