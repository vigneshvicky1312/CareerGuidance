import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { initDatabase } from './config/db.js'

import authRoutes from './routes/auth.js'
import studentRoutes from './routes/students.js'
import sponsorRoutes from './routes/sponsors.js'

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static file serving for uploaded sponsor logos
const uploadsDir = path.join(process.cwd(), 'server', 'uploads')
app.use('/uploads', express.static(uploadsDir))

// Lazy DB initialization middleware for serverless invocations (Vercel)
let dbInitialized = false
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await initDatabase()
      dbInitialized = true
    } catch (err) {
      console.error('Database initialization error:', err)
    }
  }
  next()
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/sponsors', sponsorRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.VERCEL ? 'vercel-serverless' : 'node-server',
    time: new Date().toISOString(),
  })
})

export default app
