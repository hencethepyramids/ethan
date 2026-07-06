import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proxy /api to the ASP.NET Core backend (server/ runs on :5050).
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5050',
        changeOrigin: true,
      },
    },
  },
})
