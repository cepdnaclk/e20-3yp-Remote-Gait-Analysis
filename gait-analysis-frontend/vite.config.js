import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',           // Simulates browser environment
    setupFiles: './src/test/setup.js',
  },
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@services': path.resolve(__dirname, 'src/services'),
    },
  },
})
