import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  preview: {
    host: '0.0.0.0',
    port: 8080,
    strictPort: false,
    allowedHosts: true,
  },
})
