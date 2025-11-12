import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Proxy /api requests to the backend during development
    proxy: {
      '/api': {
        // Use IPv4 loopback to avoid systems resolving `localhost` to IPv6 ::1
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
