// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.', // Use current folder as root
  build: {
    outDir: 'build', // Required for Render deploy
  },
})
