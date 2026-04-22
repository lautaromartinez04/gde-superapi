import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/duyamis/',
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.0.25:6500',
        changeOrigin: true,
      }
    }
  }
})
