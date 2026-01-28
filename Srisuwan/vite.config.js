import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Software-Engineering-Projects/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',   
    port: 5173       
  }
})
