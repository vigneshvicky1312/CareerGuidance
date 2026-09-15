import express from 'express'
import crypto from 'crypto'
import { getPool, initialScheduleSettings, initialScheduleItems } from '../config/db.js'

const router = express.Router()

function mapRowToSetting(row) {
  if (!row) {
    return {
      eventId: initialScheduleSettings.event_id,
      eyebrow: initialScheduleSettings.eyebrow,
      title: initialScheduleSettings.title,
      description: initialScheduleSettings.description,
      footerNote: initialScheduleSettings.footer_note,
    }
  }
  return {
    eventId: row.event_id || 'CGP2026',
    eyebrow: row.eyebrow || 'Complete Program Schedule',
    title: row.title || 'A Day Engineered For Your Future',
    description: row.description || '',
    footerNote: row.footer_note || '',
  }
}

function mapRowToItem(row) {
  return {
    id: row.doc_id,
    docId: row.doc_id,
    eventId: row.event_id || 'CGP2026',
    time: row.time || '',
    period: row.period || 'morning',
    track: row.track || 'general',
    title: row.title || '',
    speaker: row.speaker || '',
    venue: row.venue || '',
    badge: row.badge || '',
    badgeColor: row.badge_color || 'sky',
    description: row.description || '',
    order: Number(row.order_num) || 0,
    active: Boolean(row.active === 1 || row.active === true),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
  }
}

// GET /api/schedule - Full schedule settings & items
router.get('/', async (req, res) => {
  try {
    const pool = getPool()
    const [settingsRows] = await pool.query('SELECT * FROM schedule_settings LIMIT 1')
    const [itemRows] = await pool.query('SELECT * FROM schedule_items ORDER BY order_num ASC')

    const settings = settingsRows && settingsRows.length > 0 ? mapRowToSetting(settingsRows[0]) : mapRowToSetting(null)
    const items = (itemRows || []).map(mapRowToItem)

    res.json({
      settings,
      items,
    })
  } catch (err) {
    console.error('Error fetching schedule:', err)
    res.status(500).json({ error: 'Failed to fetch schedule' })
  }
})

// GET /api/schedule/active - Active items only (for public site if desired)
router.get('/active', async (req, res) => {
  try {
    const pool = getPool()
    const [settingsRows] = await pool.query('SELECT * FROM schedule_settings LIMIT 1')
    const [itemRows] = await pool.query('SELECT * FROM schedule_items WHERE active = 1 ORDER BY order_num ASC')

    const settings = settingsRows && settingsRows.length > 0 ? mapRowToSetting(settingsRows[0]) : mapRowToSetting(null)
    const items = (itemRows || []).map(mapRowToItem)

    res.json({
      settings,
      items,
    })
  } catch (err) {
    console.error('Error fetching active schedule:', err)
    res.status(500).json({ error: 'Failed to fetch active schedule' })
  }
})

// PUT /api/schedule/settings - Update header & description settings
router.put('/settings', async (req, res) => {
  const { eyebrow, title, description, footerNote } = req.body
  const eventId = req.body.eventId || 'CGP2026'
  const pool = getPool()

  try {
    const [existing] = await pool.query('SELECT * FROM schedule_settings LIMIT 1')
    if (!existing || existing.length === 0) {
      await pool.query(
        `INSERT INTO schedule_settings (event_id, eyebrow, title, description, footer_note)
         VALUES (?, ?, ?, ?, ?)`,
        [eventId, eyebrow || '', title || '', description || '', footerNote || '']
      )
    } else {
      await pool.query(
        `UPDATE schedule_settings SET eyebrow = ?, title = ?, description = ?, footer_note = ?
         WHERE event_id = ?`,
        [eyebrow || '', title || '', description || '', footerNote || '', eventId]
      )
    }

    const [updated] = await pool.query('SELECT * FROM schedule_settings LIMIT 1')
    res.json(mapRowToSetting(updated[0]))
  } catch (err) {
    console.error('Error updating schedule settings:', err)
    res.status(500).json({ error: 'Failed to update schedule settings' })
  }
})

// POST /api/schedule/items - Add a new session item
router.post('/items', async (req, res) => {
  const {
    time,
    period,
    track,
    title,
    speaker,
    venue,
    badge,
    badgeColor,
    description,
    order,
    active,
  } = req.body

  if (!title) {
    return res.status(400).json({ error: 'Session title is required' })
  }
  if (!time) {
    return res.status(400).json({ error: 'Session time is required' })
  }

  const docId = `session-${crypto.randomUUID()}`
  const eventId = req.body.eventId || 'CGP2026'
  const pool = getPool()

  try {
    await pool.query(
      `INSERT INTO schedule_items (
        doc_id, event_id, time, period, track, title, speaker, venue, badge, badge_color, description, order_num, active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        docId,
        eventId,
        time,
        period || 'morning',
        track || 'general',
        title,
        speaker || '',
        venue || '',
        badge || '',
        badgeColor || 'sky',
        description || '',
        Number(order) || 0,
        active !== false ? 1 : 0,
      ]
    )

    const [rows] = await pool.query('SELECT * FROM schedule_items WHERE doc_id = ?', [docId])
    res.status(201).json(mapRowToItem(rows[0]))
  } catch (err) {
    console.error('Error adding schedule item:', err)
    res.status(500).json({ error: 'Failed to add schedule item' })
  }
})

// PUT /api/schedule/items/:id - Update an existing session item
router.put('/items/:id', async (req, res) => {
  const {
    time,
    period,
    track,
    title,
    speaker,
    venue,
    badge,
    badgeColor,
    description,
    order,
    active,
  } = req.body

  const pool = getPool()

  try {
    await pool.query(
      `UPDATE schedule_items SET
        time = ?, period = ?, track = ?, title = ?, speaker = ?, venue = ?, badge = ?, badge_color = ?, description = ?, order_num = ?, active = ?
       WHERE doc_id = ?`,
      [
        time || '',
        period || 'morning',
        track || 'general',
        title || '',
        speaker || '',
        venue || '',
        badge || '',
        badgeColor || 'sky',
        description || '',
        Number(order) || 0,
        active ? 1 : 0,
        req.params.id,
      ]
    )

    const [rows] = await pool.query('SELECT * FROM schedule_items WHERE doc_id = ?', [req.params.id])
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Schedule session not found' })
    }

    res.json(mapRowToItem(rows[0]))
  } catch (err) {
    console.error('Error updating schedule item:', err)
    res.status(500).json({ error: 'Failed to update schedule item' })
  }
})

// DELETE /api/schedule/items/:id - Delete a session item
router.delete('/items/:id', async (req, res) => {
  try {
    const pool = getPool()
    await pool.query('DELETE FROM schedule_items WHERE doc_id = ?', [req.params.id])
    res.json({ success: true, id: req.params.id })
  } catch (err) {
    console.error('Error deleting schedule item:', err)
    res.status(500).json({ error: 'Failed to delete schedule item' })
  }
})

// POST /api/schedule/reorder - Reorder session items in bulk
router.post('/reorder', async (req, res) => {
  const { orderedIds } = req.body
  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ error: 'orderedIds array is required' })
  }

  const pool = getPool()
  try {
    for (let i = 0; i < orderedIds.length; i++) {
      const id = orderedIds[i]
      await pool.query('UPDATE schedule_items SET order_num = ? WHERE doc_id = ?', [i + 1, id])
    }

    const [rows] = await pool.query('SELECT * FROM schedule_items ORDER BY order_num ASC')
    res.json((rows || []).map(mapRowToItem))
  } catch (err) {
    console.error('Error reordering schedule items:', err)
    res.status(500).json({ error: 'Failed to reorder schedule items' })
  }
})

// POST /api/schedule/reset - Reset schedule settings and items to defaults
router.post('/reset', async (req, res) => {
  const pool = getPool()
  try {
    await pool.query('DELETE FROM schedule_items')
    await pool.query('DELETE FROM schedule_settings')

    await pool.query(
      `INSERT INTO schedule_settings (event_id, eyebrow, title, description, footer_note)
       VALUES (?, ?, ?, ?, ?)`,
      [
        initialScheduleSettings.event_id,
        initialScheduleSettings.eyebrow,
        initialScheduleSettings.title,
        initialScheduleSettings.description,
        initialScheduleSettings.footer_note,
      ]
    )

    for (const item of initialScheduleItems) {
      await pool.query(
        `INSERT INTO schedule_items (
          doc_id, event_id, time, period, track, title, speaker, venue, badge, badge_color, description, order_num, active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.doc_id,
          item.event_id,
          item.time,
          item.period,
          item.track,
          item.title,
          item.speaker,
          item.venue,
          item.badge,
          item.badge_color,
          item.description,
          item.order_num,
          item.active,
        ]
      )
    }

    const [settingsRows] = await pool.query('SELECT * FROM schedule_settings LIMIT 1')
    const [itemRows] = await pool.query('SELECT * FROM schedule_items ORDER BY order_num ASC')

    res.json({
      settings: mapRowToSetting(settingsRows[0]),
      items: (itemRows || []).map(mapRowToItem),
      message: 'Schedule reset to initial defaults successfully',
    })
  } catch (err) {
    console.error('Error resetting schedule:', err)
    res.status(500).json({ error: 'Failed to reset schedule' })
  }
})

export default router
