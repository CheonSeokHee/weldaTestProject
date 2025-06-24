import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['9867-221-141-145-2.ngrok-free.app'], // ✅ 여기에 추가
  },
})
