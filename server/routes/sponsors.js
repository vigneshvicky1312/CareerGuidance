import express from 'express'
import crypto from 'crypto'
import path from 'path'
import fs from 'fs'
import multer from 'multer'
import { getPool } from '../config/db.js'

const router = express.Router()

import os from 'os'

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME)
const uploadsDir = isServerless
  ? path.join(os.tmpdir(), 'cgp2026-uploads')
  : path.join(process.cwd(), 'server', 'uploads')

try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
  }
} catch (err) {
  console.warn('Could not initialize uploadsDir:', err.message)
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const uniqueName = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`
    cb(null, uniqueName)
  },
})

const upload = multer({ storage })

function mapRowToSponsor(row) {
  return {
    id: row.doc_id,
    docId: row.doc_id,
    name: row.name,
    tier: row.tier,
    category: row.category,
    logoUrl: row.logo_url,
    websiteUrl: row.website_url,
    order: row.order_num,
    active: Boolean(row.active),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
  }
}

function mapRowToEnquiry(row) {
  return {
    id: row.doc_id,
    docId: row.doc_id,
    companyName: row.company_name,
    contactPerson: row.contact_person,
    email: row.email,
    phone: row.phone,
    tier: row.tier,
    message: row.message,
    status: row.status,
    submittedAt: row.submitted_at ? new Date(row.submitted_at).toISOString() : null,
  }
}

const EXCLUDED_SPONSOR_DOC_IDS = ['sponsor-1', 'sponsor-2', 'sponsor-3', 'seed-title', 'seed-gold-1', 'seed-knowledge']
const EXCLUDED_SPONSOR_NAMES = ['TCS iON', 'HCL TechBee', 'Sivagangai Educational Trust', 'Meridian Technologies', 'Nova Finserv', 'BrightPath Institute']

// GET /api/sponsors - All sponsors
router.get('/', async (req, res) => {
  try {
    const pool = getPool()
    const [rows] = await pool.query('SELECT * FROM sponsors ORDER BY order_num ASC, created_at DESC')
    const filtered = (rows || []).filter(
      (r) => !EXCLUDED_SPONSOR_DOC_IDS.includes(r.doc_id) && !EXCLUDED_SPONSOR_NAMES.includes(r.name)
    )
    res.json(filtered.map(mapRowToSponsor))
  } catch (err) {
    console.error('Error fetching sponsors:', err)
    res.status(500).json({ error: 'Failed to fetch sponsors' })
  }
})

// GET /api/sponsors/active - Active sponsors only
router.get('/active', async (req, res) => {
  try {
    const pool = getPool()
    const [rows] = await pool.query('SELECT * FROM sponsors WHERE active = 1 ORDER BY order_num ASC')
    const filtered = (rows || []).filter(
      (r) => !EXCLUDED_SPONSOR_DOC_IDS.includes(r.doc_id) && !EXCLUDED_SPONSOR_NAMES.includes(r.name)
    )
    res.json(filtered.map(mapRowToSponsor))
  } catch (err) {
    console.error('Error fetching active sponsors:', err)
    res.status(500).json({ error: 'Failed to fetch sponsors' })
  }
})

// POST /api/sponsors - Add a new sponsor
router.post('/', async (req, res) => {
  const { name, tier, category, logoUrl, websiteUrl, order, active } = req.body
  if (!name) return res.status(400).json({ error: 'Name is required' })

  const docId = crypto.randomUUID()
  const pool = getPool()

  try {
    await pool.query(
      `INSERT INTO sponsors (doc_id, name, tier, category, logo_url, website_url, order_num, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        docId,
        name,
        tier || '',
        category || '',
        logoUrl || '',
        websiteUrl || '',
        Number(order) || 0,
        active !== false ? 1 : 0,
      ]
    )

    const [rows] = await pool.query('SELECT * FROM sponsors WHERE doc_id = ?', [docId])
    res.status(201).json(mapRowToSponsor(rows[0]))
  } catch (err) {
    console.error('Error adding sponsor:', err)
    res.status(500).json({ error: 'Failed to add sponsor' })
  }
})

// PUT /api/sponsors/:id - Update sponsor
router.put('/:id', async (req, res) => {
  const { name, tier, category, logoUrl, websiteUrl, order, active } = req.body
  const pool = getPool()

  try {
    await pool.query(
      `UPDATE sponsors SET name = ?, tier = ?, category = ?, logo_url = ?, website_url = ?, order_num = ?, active = ?
       WHERE doc_id = ?`,
      [
        name,
        tier || '',
        category || '',
        logoUrl || '',
        websiteUrl || '',
        Number(order) || 0,
        active ? 1 : 0,
        req.params.id,
      ]
    )

    const [rows] = await pool.query('SELECT * FROM sponsors WHERE doc_id = ?', [req.params.id])
    if (rows.length === 0) return res.status(404).json({ error: 'Sponsor not found' })

    res.json(mapRowToSponsor(rows[0]))
  } catch (err) {
    console.error('Error updating sponsor:', err)
    res.status(500).json({ error: 'Failed to update sponsor' })
  }
})

// DELETE /api/sponsors/:id - Delete sponsor
router.delete('/:id', async (req, res) => {
  try {
    const pool = getPool()
    await pool.query('DELETE FROM sponsors WHERE doc_id = ?', [req.params.id])
    res.json({ success: true })
  } catch (err) {
    console.error('Error deleting sponsor:', err)
    res.status(500).json({ error: 'Failed to delete sponsor' })
  }
})

// POST /api/sponsors/upload - Upload sponsor logo image
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }
  const fileUrl = `/uploads/${req.file.filename}`
  res.json({ url: fileUrl })
})

// POST /api/sponsors/enquiry - Submit sponsor enquiry
router.post('/enquiry', async (req, res) => {
  const { companyName, contactPerson, email, phone, tier, message } = req.body
  if (!companyName) return res.status(400).json({ error: 'Company name is required' })

  const docId = crypto.randomUUID()
  const pool = getPool()

  try {
    await pool.query(
      `INSERT INTO sponsor_enquiries (doc_id, company_name, contact_person, email, phone, tier, message, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'new')`,
      [docId, companyName, contactPerson || '', email || '', phone || '', tier || '', message || '']
    )

    const [rows] = await pool.query('SELECT * FROM sponsor_enquiries WHERE doc_id = ?', [docId])
    res.status(201).json(mapRowToEnquiry(rows[0]))
  } catch (err) {
    console.error('Error submitting enquiry:', err)
    res.status(500).json({ error: 'Failed to submit enquiry' })
  }
})

// GET /api/sponsors/enquiries - List sponsor enquiries
router.get('/enquiries', async (req, res) => {
  try {
    const pool = getPool()
    const [rows] = await pool.query('SELECT * FROM sponsor_enquiries ORDER BY submitted_at DESC')
    res.json(rows.map(mapRowToEnquiry))
  } catch (err) {
    console.error('Error fetching enquiries:', err)
    res.status(500).json({ error: 'Failed to fetch enquiries' })
  }
})

export default router
