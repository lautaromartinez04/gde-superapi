import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/mharnes/',
  server: {
    host: '0.0.0.0', // permite que se exponga en la red
    port: 5173,       // podés cambiarlo si querés
  },
  assetsInclude: ['**/*.JPG'],
})
