import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 由于本机可能残留旧后端实例（例如 3001），这里强制默认指向 3002
// 确保 /api/leaderboard 等路由能正确命中“新后端”。
const apiPort = process.env.VITE_API_PORT ? Number(process.env.VITE_API_PORT) : 3002

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: `http://localhost:${Number.isFinite(apiPort) ? apiPort : 3002}`,
        changeOrigin: true
      }
    }
  }
})

