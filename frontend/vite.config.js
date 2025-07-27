// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', // ✅ Crucial for relative paths on static hosts like Render
  plugins: [react()],
  root: '.', // Still fine
  build: {
    outDir: 'build', // ✅ Good for Render
  },
})

