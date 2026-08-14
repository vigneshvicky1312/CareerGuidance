import express from 'express'
import crypto from 'crypto'
import { getPool } from '../config/db.js'

const router = express.Router()

const EVENT_ID = process.env.VITE_EVENT_ID || 'CGP2026'

const MATERIALS_KEYS = ['kit', 'bag', 'notepad', 'pen', 'certificate', 'badge']

function mapRowToStudent(row) {
  let materials = {}
  if (row.materials) {
    try {
      materials = typeof row.materials === 'string' ? JSON.parse(row.materials) : row.materials
    } catch {
      materials = {}
    }
  }

  return {
    id: row.doc_id,
    sqlId: row.id,
    docId: row.doc_id,
    registrationId: row.registration_id,
    eventId: row.event_id,
    name: row.name,
    gender: row.gender,
    college: row.college,
    degree: row.degree,
    department: row.department,
    year: row.year,
    mobile: row.mobile,
    email: row.email,
    district: row.district,
    careerInterest: row.career_interest,
    foodPreference: row.food_preference,
    registeredAt: row.registered_at ? new Date(row.registered_at).toISOString() : null,
    checkedIn: Boolean(row.checked_in),
    checkInTime: row.check_in_time ? new Date(row.check_in_time).toISOString() : null,
    materialsDistributed: Boolean(row.materials_distributed),
    materialDistributionTime: row.material_distribution_time ? new Date(row.material_distribution_time).toISOString() : null,
    materials,
  }
}

// POST /api/students - Register a new student
router.post('/', async (req, res) => {
  const formData = req.body
  const pool = getPool()
  const conn = await pool.getConnection()

  try {
    await conn.beginTransaction()

    // 1. Get next sequence atomically using FOR UPDATE
    const [counterRows] = await conn.query(
      'SELECT value FROM counters WHERE event_id = ? FOR UPDATE',
      [EVENT_ID]
    )

    let currentVal = 0
    if (counterRows.length > 0) {
      currentVal = counterRows[0].value
    } else {
      await conn.query('INSERT INTO counters (event_id, value) VALUES (?, 0)', [EVENT_ID])
    }

    const nextVal = currentVal + 1
    await conn.query('UPDATE counters SET value = ? WHERE event_id = ?', [nextVal, EVENT_ID])

    const registrationId = `${EVENT_ID}-${String(nextVal).padStart(4, '0')}`
    const docId = crypto.randomUUID()

    const materialsObj = {}
    MATERIALS_KEYS.forEach((key) => {
      materialsObj[key] = false
    })

    const name = formData.name ? formData.name.trim() : ''
    const gender = formData.gender || ''
    const college = formData.college || ''
    const degree = formData.degree ? formData.degree.trim() : ''
    const department = formData.department ? formData.department.trim() : ''
    const year = formData.year || ''
    const mobile = formData.mobile ? formData.mobile.trim() : ''
    const email = formData.email ? formData.email.trim().toLowerCase() : ''
    const district = formData.district ? formData.district.trim() : ''
    const careerInterest = formData.careerInterest || ''
    const foodPreference = formData.foodPreference || null

    await conn.query(
      `INSERT INTO students (
        doc_id, registration_id, event_id, name, gender, college, degree,
        department, year, mobile, email, district, career_interest, food_preference,
        checked_in, materials_distributed, materials
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?)`,
      [
        docId,
        registrationId,
        EVENT_ID,
        name,
        gender,
        college,
        degree,
        department,
        year,
        mobile,
        email,
        district,
        careerInterest,
        foodPreference,
        JSON.stringify(materialsObj),
      ]
    )

    await conn.commit()

    const [insertedRows] = await pool.query('SELECT * FROM students WHERE doc_id = ?', [docId])
    const student = mapRowToStudent(insertedRows[0])
    res.status(201).json(student)
  } catch (err) {
    await conn.rollback()
    console.error('Error registering student:', err)
    res.status(500).json({ error: 'Failed to register student' })
  } finally {
    conn.release()
  }
})

// GET /api/students - List all students
router.get('/', async (req, res) => {
  try {
    const pool = getPool()
    const [rows] = await pool.query('SELECT * FROM students ORDER BY registered_at DESC')
    const list = rows.map(mapRowToStudent)
    res.json(list)
  } catch (err) {
    console.error('Error fetching students:', err)
    res.status(500).json({ error: 'Failed to fetch students' })
  }
})

// GET /api/students/by-reg-id/:regId - Find student by registration ID
router.get('/by-reg-id/:regId', async (req, res) => {
  try {
    const regId = req.params.regId.trim().toUpperCase()
    const pool = getPool()
    const [rows] = await pool.query('SELECT * FROM students WHERE registration_id = ?', [regId])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' })
    }
    res.json(mapRowToStudent(rows[0]))
  } catch (err) {
    console.error('Error finding student:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/students/:id - Get single student by doc_id
router.get('/:id', async (req, res) => {
  try {
    const pool = getPool()
    const [rows] = await pool.query('SELECT * FROM students WHERE doc_id = ?', [req.params.id])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' })
    }
    res.json(mapRowToStudent(rows[0]))
  } catch (err) {
    console.error('Error fetching student:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// PATCH /api/students/:id/check-in - Confirm or undo attendance
router.patch('/:id/check-in', async (req, res) => {
  const { checkedIn } = req.body
  try {
    const pool = getPool()
    if (checkedIn) {
      await pool.query(
        'UPDATE students SET checked_in = 1, check_in_time = CURRENT_TIMESTAMP WHERE doc_id = ?',
        [req.params.id]
      )
    } else {
      await pool.query(
        'UPDATE students SET checked_in = 0, check_in_time = NULL WHERE doc_id = ?',
        [req.params.id]
      )
    }

    const [rows] = await pool.query('SELECT * FROM students WHERE doc_id = ?', [req.params.id])
    if (rows.length === 0) return res.status(404).json({ error: 'Student not found' })

    res.json(mapRowToStudent(rows[0]))
  } catch (err) {
    console.error('Error updating attendance:', err)
    res.status(500).json({ error: 'Failed to update attendance' })
  }
})

// PATCH /api/students/:id/materials - Update material distribution
router.patch('/:id/materials', async (req, res) => {
  const { materials, distributed } = req.body
  try {
    const pool = getPool()
    const materialsJson = JSON.stringify(materials || {})

    if (distributed) {
      await pool.query(
        'UPDATE students SET materials = ?, materials_distributed = 1, material_distribution_time = CURRENT_TIMESTAMP WHERE doc_id = ?',
        [materialsJson, req.params.id]
      )
    } else {
      await pool.query(
        'UPDATE students SET materials = ?, materials_distributed = 0, material_distribution_time = NULL WHERE doc_id = ?',
        [materialsJson, req.params.id]
      )
    }

    const [rows] = await pool.query('SELECT * FROM students WHERE doc_id = ?', [req.params.id])
    if (rows.length === 0) return res.status(404).json({ error: 'Student not found' })

    res.json(mapRowToStudent(rows[0]))
  } catch (err) {
    console.error('Error updating materials:', err)
    res.status(500).json({ error: 'Failed to update materials' })
  }
})

// DELETE /api/students/:id - Remove a student registration
router.delete('/:id', async (req, res) => {
  try {
    const pool = getPool()
    await pool.query('DELETE FROM students WHERE doc_id = ?', [req.params.id])
    res.json({ success: true, message: 'Student removed successfully' })
  } catch (err) {
    console.error('Error deleting student:', err)
    res.status(500).json({ error: 'Failed to delete student' })
  }
})

export default router
