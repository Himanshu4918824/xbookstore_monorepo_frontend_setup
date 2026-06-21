import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // We can run the admin dashboard on a different port
    port: 5174, 
    proxy: {
      // Proxy API requests to your Django backend
      '/api': {
        target: 'https://xbookstore.xoffencerpublication.in/',
        // target: 'http://127.0.0.1:8000/',
        changeOrigin: true,
      },
      // Also proxy media file requests
      '/media': {
        target: 'https://xbookstore.xoffencerpublication.in/media',
        // target: 'http://127.0.0.1:8000/media',
        changeOrigin: true,
      }
    }
  }
})