import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import os from 'os'
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
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME)
const uploadsDir = isServerless
  ? path.join(os.tmpdir(), 'cgp2026-uploads')
  : path.join(process.cwd(), 'server', 'uploads')
app.use('/uploads', express.static(uploadsDir))

// Lazy DB initialization middleware for serverless invocations (Vercel)
app.use(async (req, res, next) => {
  try {
    await initDatabase()
  } catch (err) {
    console.error('Database initialization error:', err)
  }
  next()
})

// API Routes (mounted with and without /api prefix for Vercel rewrite compatibility)
app.use('/api/auth', authRoutes)
app.use('/auth', authRoutes)

app.use('/api/students', studentRoutes)
app.use('/students', studentRoutes)

app.use('/api/sponsors', sponsorRoutes)
app.use('/sponsors', sponsorRoutes)

// Health check endpoint
const healthCheck = (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.VERCEL ? 'vercel-serverless' : 'node-server',
    time: new Date().toISOString(),
  })
}

app.get('/api/health', healthCheck)
app.get('/health', healthCheck)
app.get('/api', healthCheck)

// Root fallback for direct API access
app.get('/', (req, res) => {
  if (req.headers['accept']?.includes('application/json')) {
    return healthCheck(req, res)
  }
  res.status(200).send('CGP2026 API Server is running')
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('API Error:', err)
  res.status(500).json({ error: err.message || 'Internal Server Error' })
})

export default app
