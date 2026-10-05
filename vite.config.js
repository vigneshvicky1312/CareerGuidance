import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function apiServerPlugin() {
  let appInstance = null
  return {
    name: 'api-server-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || ''
        if (url.startsWith('/api') || url.startsWith('/uploads')) {
          try {
            if (!appInstance) {
              const mod = await import('./server/app.js')
              appInstance = mod.default
            }
            return appInstance(req, res, next)
          } catch (err) {
            console.error('API middleware error:', err)
            return next(err)
          }
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), apiServerPlugin()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-icons': ['lucide-react'],
          'vendor-qr': ['qrcode.react', 'html5-qrcode'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
