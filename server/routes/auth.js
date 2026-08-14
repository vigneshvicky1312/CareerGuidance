import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getPool } from '../config/db.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'cgp2026_secret_key_change_in_production'

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Access token required' })

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' })
    req.user = user
    next()
  })
}

router.post('/login', async (req, res) => {
  const { email, username, password } = req.body
  const identifier = (email || username || '').trim().toLowerCase()
  if (!identifier || !password) {
    return res.status(400).json({ error: 'Username and password required' })
  }

  try {
    const pool = getPool()
    const [rows] = await pool.query('SELECT * FROM admin_users WHERE email = ?', [identifier])
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }

    const admin = rows[0]
    const valid = await bcrypt.compare(password, admin.password_hash)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }

    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: admin.id, email: admin.email } })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/me', authenticateToken, (req, res) => {
  res.json({ user: req.user })
})

export default router
