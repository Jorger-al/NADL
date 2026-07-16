import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["react-globe.gl", "three"],
  },
  server: {
    proxy: {
      '/directus-api': {
        target: 'https://directus-production-7b95.up.railway.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/directus-api/, '')
      }
    }
  }
})
