import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/jumbrella/',

  plugins: [
    react(),
    tailwindcss(),
  ],

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },

  server: {
    host: true,
  },

  preview: {
    host: true,
  },
})
