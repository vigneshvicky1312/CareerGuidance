import app from './app.js'
import { initDatabase } from './config/db.js'

const PORT = process.env.PORT || 5000

async function startServer() {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 CGP2026 MySQL Backend Server running on http://0.0.0.0:${PORT} (LAN: http://192.168.1.10:${PORT})`)
  })
  await initDatabase()
}

startServer()
