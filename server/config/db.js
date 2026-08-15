import fs from 'fs'
import path from 'path'
import os from 'os'
import bcrypt from 'bcryptjs'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

let dbConfig = {
  host: process.env.MYSQL_HOST || '127.0.0.1',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  port: Number(process.env.MYSQL_PORT) || 3306,
  database: process.env.MYSQL_DATABASE || 'cgp2026',
}

// Support connection strings like mysql://user:pass@host:port/dbname
if (process.env.MYSQL_URL) {
  try {
    const parsed = new URL(process.env.MYSQL_URL)
    dbConfig = {
      host: parsed.hostname,
      user: parsed.username,
      password: parsed.password,
      port: Number(parsed.port) || 3306,
      database: parsed.pathname.replace('/', '') || 'cgp2026',
    }
  } catch (err) {
    console.warn('Could not parse MYSQL_URL:', err.message)
  }
}

const isRemoteDb =
  dbConfig.host !== '127.0.0.1' &&
  dbConfig.host !== 'localhost' &&
  dbConfig.host !== '0.0.0.0'

const useSSL =
  process.env.MYSQL_SSL === 'true' ||
  (isRemoteDb && (process.env.MYSQL_SSL !== 'false' || dbConfig.port === 4000))

const host = dbConfig.host
const user = dbConfig.user
const password = dbConfig.password
const port = dbConfig.port
const database = dbConfig.database

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME)
const dbDir = isServerless
  ? path.join(os.tmpdir(), 'cgp2026-data')
  : path.join(process.cwd(), 'server', 'data')
const dbFile = path.join(dbDir, 'db.json')

let useMySQL = false
let mysqlPool = null
let dbInitPromise = null
let memoryData = null

const initialSampleStudents = [
  {
    doc_id: 'sample-student-1',
    registration_id: 'CGP2026-0001',
    event_id: 'CGP2026',
    name: 'Anitha R',
    gender: 'Female',
    college: 'Alagappa Government Arts College, Karaikudi',
    degree: 'B.Sc',
    department: 'Computer Science',
    year: 'Final Year',
    mobile: '9876543210',
    email: 'anitha.r@example.com',
    district: 'Karaikudi',
    career_interest: 'Software & Information Technology',
    food_preference: 'Vegetarian',
    registered_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    checked_in: 1,
    check_in_time: new Date(Date.now() - 3600000 * 5).toISOString(),
    materials_distributed: 1,
    material_distribution_time: new Date(Date.now() - 3600000 * 4).toISOString(),
    materials: JSON.stringify({ kit: true, bag: true, notepad: true, pen: true, certificate: true }),
  },
  {
    doc_id: 'sample-student-2',
    registration_id: 'CGP2026-0002',
    event_id: 'CGP2026',
    name: 'Karthik M',
    gender: 'Male',
    college: 'Raja Doraisingam Govt Arts College, Sivagangai',
    degree: 'B.Com',
    department: 'Commerce',
    year: 'Final Year',
    mobile: '9876543211',
    email: 'karthik.m@example.com',
    district: 'Sivagangai',
    career_interest: 'Banking, Finance & Accounting',
    food_preference: 'Non-Vegetarian',
    registered_at: new Date(Date.now() - 3600000 * 24 * 1.5).toISOString(),
    checked_in: 1,
    check_in_time: new Date(Date.now() - 3600000 * 3).toISOString(),
    materials_distributed: 0,
    material_distribution_time: null,
    materials: JSON.stringify({ kit: true, bag: true, notepad: false, pen: false, certificate: false }),
  },
  {
    doc_id: 'sample-student-3',
    registration_id: 'CGP2026-0003',
    event_id: 'CGP2026',
    name: 'Priya S',
    gender: 'Female',
    college: 'Seethalakshmi Achi College for Women, Pallathur',
    degree: 'B.A',
    department: 'English Literature',
    year: 'Pre-Final Year',
    mobile: '9876543212',
    email: 'priya.s@example.com',
    district: 'Karaikudi',
    career_interest: 'Civil Services & Public Administration (TNPSC/UPSC)',
    food_preference: 'Vegetarian',
    registered_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    checked_in: 0,
    check_in_time: null,
    materials_distributed: 0,
    material_distribution_time: null,
    materials: JSON.stringify({ kit: false, bag: false, notepad: false, pen: false, certificate: false }),
  },
  {
    doc_id: 'sample-student-4',
    registration_id: 'CGP2026-0004',
    event_id: 'CGP2026',
    name: 'Suresh Kumar P',
    gender: 'Male',
    college: 'Dr. Zakir Husain College, Ilayangudi',
    degree: 'B.Sc',
    department: 'Physics',
    year: 'Final Year',
    mobile: '9876543213',
    email: 'suresh.p@example.com',
    district: 'Ilayangudi',
    career_interest: 'Higher Studies & Research (M.Sc/M.Tech/Ph.D)',
    food_preference: 'Non-Vegetarian',
    registered_at: new Date(Date.now() - 3600000 * 10).toISOString(),
    checked_in: 1,
    check_in_time: new Date(Date.now() - 3600000 * 2).toISOString(),
    materials_distributed: 1,
    material_distribution_time: new Date(Date.now() - 3600000 * 1).toISOString(),
    materials: JSON.stringify({ kit: true, bag: true, notepad: true, pen: true, certificate: true }),
  },
  {
    doc_id: 'sample-student-5',
    registration_id: 'CGP2026-0005',
    event_id: 'CGP2026',
    name: 'Divya V',
    gender: 'Female',
    college: 'Subbalakshmi Lakshmipathy College of Science',
    degree: 'B.B.A',
    department: 'Business Administration',
    year: 'Pre-Final Year',
    mobile: '9876543214',
    email: 'divya.v@example.com',
    district: 'Devakottai',
    career_interest: 'Entrepreneurship & Business Startups',
    food_preference: 'Vegetarian',
    registered_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    checked_in: 0,
    check_in_time: null,
    materials_distributed: 0,
    material_distribution_time: null,
    materials: JSON.stringify({ kit: false, bag: false, notepad: false, pen: false, certificate: false }),
  },
]

const initialSampleSponsors = [
  {
    doc_id: 'sponsor-1',
    name: 'TCS iON',
    tier: 'Title Sponsor',
    category: 'Title Sponsor',
    logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    website_url: 'https://tcs.com',
    order_num: 1,
    active: 1,
    created_at: new Date().toISOString(),
  },
  {
    doc_id: 'sponsor-2',
    name: 'HCL TechBee',
    tier: 'Gold Sponsor',
    category: 'Gold Sponsor',
    logo_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80',
    website_url: 'https://hcltech.com',
    order_num: 2,
    active: 1,
    created_at: new Date().toISOString(),
  },
  {
    doc_id: 'sponsor-3',
    name: 'Sivagangai Educational Trust',
    tier: 'Silver Sponsor',
    category: 'Silver Sponsor',
    logo_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200&auto=format&fit=crop&q=80',
    website_url: '',
    order_num: 3,
    active: 1,
    created_at: new Date().toISOString(),
  },
]

function getDefaultData() {
  return {
    admin_users: [],
    counters: [{ event_id: 'CGP2026', value: 5 }],
    students: initialSampleStudents,
    sponsors: initialSampleSponsors,
    sponsor_enquiries: [],
  }
}

function ensureDbFile() {
  try {
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true })
    }
    if (!fs.existsSync(dbFile)) {
      fs.writeFileSync(dbFile, JSON.stringify(getDefaultData(), null, 2))
    }
  } catch {
    // If read-only fs on serverless, fallback cleanly to memory
  }
}

function readData() {
  if (memoryData) return memoryData
  ensureDbFile()
  try {
    const raw = fs.readFileSync(dbFile, 'utf8')
    const data = JSON.parse(raw)

    if (!data.students || data.students.length === 0) {
      data.students = initialSampleStudents
      if (!data.counters) data.counters = []
      data.counters = [{ event_id: 'CGP2026', value: 5 }]
    }
    if (!data.sponsors || data.sponsors.length === 0) {
      data.sponsors = initialSampleSponsors
    }
    memoryData = data
    return data
  } catch {
    if (!memoryData) {
      memoryData = getDefaultData()
    }
    return memoryData
  }
}

function writeData(data) {
  memoryData = data
  try {
    ensureDbFile()
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2))
  } catch {
    // Read-only filesystem fallback in memory
  }
}

async function initDefaultAdminJson(data) {
  if (!data.admin_users) data.admin_users = []
  const defaultPassword = process.env.ADMIN_PASSWORD || 'cgp2026'
  const hashed = await bcrypt.hash(defaultPassword, 10)
  
  // Ensure 'admin' user entry
  const foundAdmin = data.admin_users.find((u) => u.email === 'admin' || u.username === 'admin')
  if (!foundAdmin) {
    data.admin_users.push({
      id: 1,
      email: 'admin',
      username: 'admin',
      password_hash: hashed,
      created_at: new Date().toISOString(),
    })
  } else {
    foundAdmin.password_hash = hashed
  }

  // Ensure 'admin@cgp2026.org' user entry as alias
  const foundEmail = data.admin_users.find((u) => u.email === 'admin@cgp2026.org')
  if (!foundEmail) {
    data.admin_users.push({
      id: 2,
      email: 'admin@cgp2026.org',
      password_hash: hashed,
      created_at: new Date().toISOString(),
    })
  } else {
    foundEmail.password_hash = hashed
  }

  writeData(data)
  console.log(`✅ Default admin user created/synced (username: admin / password: ${defaultPassword})`)
}

export async function initDatabase() {
  if (useMySQL && mysqlPool) return
  if (dbInitPromise) return dbInitPromise

  dbInitPromise = (async () => {
    // If no MySQL host configured, fallback immediately without failing
    if (!host || (host === '127.0.0.1' && isServerless)) {
      useMySQL = false
      const data = readData()
      await initDefaultAdminJson(data)
      return
    }

    const poolConfig = {
      host,
      user,
      password,
      port,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 5000,
      ...(useSSL ? { ssl: { rejectUnauthorized: false } } : {}),
    }

    try {
      // Attempt database creation if user has root/admin rights
      try {
        const rootConn = await mysql.createConnection({
          host,
          user,
          password,
          port,
          connectTimeout: 3000,
          ...(useSSL ? { ssl: { rejectUnauthorized: false } } : {}),
        })
        await rootConn.query(
          `CREATE DATABASE IF NOT EXISTS \`${database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
        )
        await rootConn.end()
      } catch {
        // Ignored if user lacks root CREATE DATABASE permission on managed cloud databases
      }

      mysqlPool = mysql.createPool(poolConfig)
      const connection = await mysqlPool.getConnection()

      await connection.query(`
        CREATE TABLE IF NOT EXISTS admin_users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
      `)

      await connection.query(`
        CREATE TABLE IF NOT EXISTS counters (
          event_id VARCHAR(100) PRIMARY KEY,
          value INT NOT NULL DEFAULT 0
        ) ENGINE=InnoDB;
      `)

      await connection.query(`
        CREATE TABLE IF NOT EXISTS students (
          id INT AUTO_INCREMENT PRIMARY KEY,
          doc_id VARCHAR(64) NOT NULL UNIQUE,
          registration_id VARCHAR(64) NOT NULL UNIQUE,
          event_id VARCHAR(64) NOT NULL,
          name VARCHAR(255) NOT NULL,
          gender VARCHAR(50),
          college VARCHAR(255),
          degree VARCHAR(100),
          department VARCHAR(100),
          year VARCHAR(50),
          mobile VARCHAR(20),
          email VARCHAR(255),
          district VARCHAR(100),
          career_interest VARCHAR(100),
          food_preference VARCHAR(50),
          registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          checked_in TINYINT(1) DEFAULT 0,
          check_in_time DATETIME NULL,
          materials_distributed TINYINT(1) DEFAULT 0,
          material_distribution_time DATETIME NULL,
          materials JSON,
          INDEX idx_registration_id (registration_id),
          INDEX idx_event_id (event_id)
        ) ENGINE=InnoDB;
      `)

      await connection.query(`
        CREATE TABLE IF NOT EXISTS sponsors (
          id INT AUTO_INCREMENT PRIMARY KEY,
          doc_id VARCHAR(64) NOT NULL UNIQUE,
          name VARCHAR(255) NOT NULL,
          tier VARCHAR(100),
          category VARCHAR(100),
          logo_url TEXT,
          website_url TEXT,
          order_num INT DEFAULT 0,
          active TINYINT(1) DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
      `)

      await connection.query(`
        CREATE TABLE IF NOT EXISTS sponsor_enquiries (
          id INT AUTO_INCREMENT PRIMARY KEY,
          doc_id VARCHAR(64) NOT NULL UNIQUE,
          company_name VARCHAR(255) NOT NULL,
          contact_person VARCHAR(255),
          email VARCHAR(255),
          phone VARCHAR(50),
          tier VARCHAR(100),
          message TEXT,
          status VARCHAR(50) DEFAULT 'new',
          submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;
      `)

      const defaultPassword = process.env.ADMIN_PASSWORD || 'cgp2026'
      const hashed = await bcrypt.hash(defaultPassword, 10)
      
      // MySQL sync for admin & admin@cgp2026.org
      const [users] = await connection.query(`SELECT * FROM admin_users WHERE email IN (?, ?)`, ['admin', 'admin@cgp2026.org'])
      if (users.length === 0) {
        await connection.query(`INSERT INTO admin_users (email, password_hash) VALUES (?, ?)`, ['admin', hashed])
        console.log(`✅ Default admin user created in MySQL (username: admin / password: ${defaultPassword})`)
      } else {
        await connection.query(`UPDATE admin_users SET password_hash = ? WHERE email IN (?, ?)`, [hashed, 'admin', 'admin@cgp2026.org'])
        console.log(`✅ Admin password synced in MySQL (username: admin / password: ${defaultPassword})`)
      }

      // Seed initial sponsors in MySQL if empty
      const [sponsorRows] = await connection.query('SELECT COUNT(*) as count FROM sponsors')
      if (sponsorRows[0].count === 0) {
        for (const sp of initialSampleSponsors) {
          await connection.query(
            `INSERT INTO sponsors (doc_id, name, tier, category, logo_url, website_url, order_num, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [sp.doc_id, sp.name, sp.tier, sp.category, sp.logo_url, sp.website_url, sp.order_num, sp.active]
          )
        }
        console.log('✅ Seeded initial sample sponsors in MySQL')
      }

      // Seed initial students in MySQL if empty
      const [studentRows] = await connection.query('SELECT COUNT(*) as count FROM students')
      if (studentRows[0].count === 0) {
        for (const st of initialSampleStudents) {
          await connection.query(
            `INSERT INTO students (
              doc_id, registration_id, event_id, name, gender, college, degree,
              department, year, mobile, email, district, career_interest, food_preference,
              checked_in, check_in_time, materials_distributed, material_distribution_time, materials, registered_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              st.doc_id, st.registration_id, st.event_id, st.name, st.gender, st.college, st.degree,
              st.department, st.year, st.mobile, st.email, st.district, st.career_interest, st.food_preference,
              st.checked_in, st.check_in_time, st.materials_distributed, st.material_distribution_time, st.materials, st.registered_at
            ]
          )
        }
        await connection.query(
          `INSERT INTO counters (event_id, value) VALUES ('CGP2026', 5) ON DUPLICATE KEY UPDATE value = GREATEST(value, 5)`
        )
        console.log('✅ Seeded initial sample students in MySQL')
      }

      connection.release()
      useMySQL = true
      console.log(`✅ MySQL database '${database}' initialized successfully.`)
    } catch (err) {
      console.warn(`⚠️ Could not connect to MySQL server (${err.message}). Using persistent fallback database engine.`)
      useMySQL = false
      const data = readData()
      await initDefaultAdminJson(data)
    }
  })()

  return dbInitPromise
}

// Custom JSON SQL Query Emulator for fallback
function executeJsonQuery(sql, params = []) {
  const data = readData()
  const cleanSql = sql.trim().replace(/\s+/g, ' ')

  // 1. SELECT * FROM admin_users WHERE email = ?
  if (cleanSql.toUpperCase().startsWith('SELECT * FROM ADMIN_USERS WHERE EMAIL =') || cleanSql.toUpperCase().includes('FROM ADMIN_USERS WHERE')) {
    const identifier = (params[0] || '').toLowerCase()
    const user = (data.admin_users || []).find((u) => {
      const uEmail = (u.email || '').toLowerCase()
      const uName = (u.username || '').toLowerCase()
      return (
        uEmail === identifier ||
        uName === identifier ||
        (identifier === 'admin' && uEmail === 'admin@cgp2026.org') ||
        (identifier === 'admin@cgp2026.org' && uEmail === 'admin')
      )
    })
    return [[user].filter(Boolean), []]
  }

  // 2. SELECT value FROM counters WHERE event_id = ? FOR UPDATE
  if (cleanSql.toUpperCase().includes('FROM COUNTERS WHERE EVENT_ID =')) {
    const eventId = params[0]
    const counter = (data.counters || []).find((c) => c.event_id === eventId)
    return [[counter].filter(Boolean), []]
  }

  // 3. INSERT INTO counters (event_id, value) VALUES (?, 0)
  if (cleanSql.toUpperCase().startsWith('INSERT INTO COUNTERS')) {
    const [eventId] = params
    if (!data.counters) data.counters = []
    const existing = data.counters.find((c) => c.event_id === eventId)
    if (!existing) {
      data.counters.push({ event_id: eventId, value: 0 })
      writeData(data)
    }
    return [{ affectedRows: 1 }, []]
  }

  // 4. UPDATE counters SET value = ? WHERE event_id = ?
  if (cleanSql.toUpperCase().startsWith('UPDATE COUNTERS SET VALUE =')) {
    const [val, eventId] = params
    if (!data.counters) data.counters = []
    const existing = data.counters.find((c) => c.event_id === eventId)
    if (existing) {
      existing.value = val
    } else {
      data.counters.push({ event_id: eventId, value: val })
    }
    writeData(data)
    return [{ affectedRows: 1 }, []]
  }

  // 5. INSERT INTO students (...) VALUES (...)
  if (cleanSql.toUpperCase().startsWith('INSERT INTO STUDENTS')) {
    const [
      docId, registrationId, eventId, name, gender, college, degree,
      department, year, mobile, email, district, careerInterest, foodPreference, materialsStr,
    ] = params

    if (!data.students) data.students = []
    const id = data.students.length + 1
    const newStudent = {
      id,
      doc_id: docId,
      registration_id: registrationId,
      event_id: eventId,
      name,
      gender,
      college,
      degree,
      department,
      year,
      mobile,
      email,
      district,
      career_interest: careerInterest,
      food_preference: foodPreference,
      registered_at: new Date().toISOString(),
      checked_in: 0,
      check_in_time: null,
      materials_distributed: 0,
      material_distribution_time: null,
      materials: materialsStr,
    }
    data.students.push(newStudent)
    writeData(data)
    return [{ affectedRows: 1, insertId: id }, []]
  }

  // 6. SELECT * FROM students ORDER BY registered_at DESC
  if (cleanSql.toUpperCase().startsWith('SELECT * FROM STUDENTS ORDER BY REGISTERED_AT DESC')) {
    const list = [...(data.students || [])].sort((a, b) => new Date(b.registered_at) - new Date(a.registered_at))
    return [list, []]
  }

  // 7. SELECT * FROM students WHERE registration_id = ?
  if (cleanSql.toUpperCase().includes('FROM STUDENTS WHERE REGISTRATION_ID =')) {
    const regId = params[0]
    const list = (data.students || []).filter((s) => s.registration_id === regId)
    return [list, []]
  }

  // 8. SELECT * FROM students WHERE doc_id = ?
  if (cleanSql.toUpperCase().includes('FROM STUDENTS WHERE DOC_ID =')) {
    const docId = params[0]
    const list = (data.students || []).filter((s) => s.doc_id === docId)
    return [list, []]
  }

  // 9. UPDATE students SET checked_in = ... WHERE doc_id = ?
  if (cleanSql.toUpperCase().startsWith('UPDATE STUDENTS SET CHECKED_IN =')) {
    const docId = params[params.length - 1]
    const checkedIn = params[0]
    const student = (data.students || []).find((s) => s.doc_id === docId)
    if (student) {
      student.checked_in = checkedIn ? 1 : 0
      student.check_in_time = checkedIn ? new Date().toISOString() : null
      writeData(data)
    }
    return [{ affectedRows: student ? 1 : 0 }, []]
  }

  // 10. UPDATE students SET materials = ... WHERE doc_id = ?
  if (cleanSql.toUpperCase().startsWith('UPDATE STUDENTS SET MATERIALS =')) {
    const docId = params[params.length - 1]
    const materialsStr = params[0]
    const distributed = params[1]
    const student = (data.students || []).find((s) => s.doc_id === docId)
    if (student) {
      student.materials = materialsStr
      student.materials_distributed = distributed ? 1 : 0
      student.material_distribution_time = distributed ? new Date().toISOString() : null
      writeData(data)
    }
    return [{ affectedRows: student ? 1 : 0 }, []]
  }

  // 11. SELECT * FROM sponsors ORDER BY order_num ASC
  if (cleanSql.toUpperCase().startsWith('SELECT * FROM SPONSORS')) {
    let list = [...(data.sponsors || [])]
    if (cleanSql.toUpperCase().includes('WHERE ACTIVE = 1')) {
      list = list.filter((s) => s.active === 1 || s.active === true)
    }
    list.sort((a, b) => (a.order_num || 0) - (b.order_num || 0))
    return [list, []]
  }

  // 12. INSERT INTO sponsors
  if (cleanSql.toUpperCase().startsWith('INSERT INTO SPONSORS')) {
    const [docId, name, tier, category, logoUrl, websiteUrl, orderNum, active] = params
    if (!data.sponsors) data.sponsors = []
    const newSponsor = {
      id: data.sponsors.length + 1,
      doc_id: docId,
      name,
      tier,
      category,
      logo_url: logoUrl,
      website_url: websiteUrl,
      order_num: orderNum,
      active: active ? 1 : 0,
      created_at: new Date().toISOString(),
    }
    data.sponsors.push(newSponsor)
    writeData(data)
    return [{ affectedRows: 1 }, []]
  }

  // 13. UPDATE sponsors
  if (cleanSql.toUpperCase().startsWith('UPDATE SPONSORS SET')) {
    const docId = params[params.length - 1]
    const [name, tier, category, logoUrl, websiteUrl, orderNum, active] = params
    const sponsor = (data.sponsors || []).find((s) => s.doc_id === docId)
    if (sponsor) {
      sponsor.name = name
      sponsor.tier = tier
      sponsor.category = category
      sponsor.logo_url = logoUrl
      sponsor.website_url = websiteUrl
      sponsor.order_num = orderNum
      sponsor.active = active ? 1 : 0
      writeData(data)
    }
    return [{ affectedRows: sponsor ? 1 : 0 }, []]
  }

  // 14. DELETE FROM sponsors WHERE doc_id = ?
  if (cleanSql.toUpperCase().startsWith('DELETE FROM SPONSORS WHERE DOC_ID =')) {
    const docId = params[0]
    data.sponsors = (data.sponsors || []).filter((s) => s.doc_id !== docId)
    writeData(data)
    return [{ affectedRows: 1 }, []]
  }

  // 14b. DELETE FROM students WHERE doc_id = ?
  if (cleanSql.toUpperCase().startsWith('DELETE FROM STUDENTS WHERE DOC_ID =')) {
    const docId = params[0]
    const initialLen = (data.students || []).length
    data.students = (data.students || []).filter((s) => s.doc_id !== docId)
    writeData(data)
    return [{ affectedRows: initialLen !== (data.students || []).length ? 1 : 0 }, []]
  }

  // 15. INSERT INTO sponsor_enquiries
  if (cleanSql.toUpperCase().startsWith('INSERT INTO SPONSOR_ENQUIRIES')) {
    const [docId, companyName, contactPerson, email, phone, tier, message] = params
    if (!data.sponsor_enquiries) data.sponsor_enquiries = []
    const newEnquiry = {
      id: data.sponsor_enquiries.length + 1,
      doc_id: docId,
      company_name: companyName,
      contact_person: contactPerson,
      email,
      phone,
      tier,
      message,
      status: 'new',
      submitted_at: new Date().toISOString(),
    }
    data.sponsor_enquiries.push(newEnquiry)
    writeData(data)
    return [{ affectedRows: 1 }, []]
  }

  // 16. SELECT * FROM sponsor_enquiries ORDER BY submitted_at DESC
  if (cleanSql.toUpperCase().startsWith('SELECT * FROM SPONSOR_ENQUIRIES')) {
    const list = [...(data.sponsor_enquiries || [])].sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))
    return [list, []]
  }

  return [[], []]
}

export function getPool() {
  if (useMySQL && mysqlPool) {
    return mysqlPool
  }

  // Return fallback client wrapper conforming to mysql2 promise interface
  return {
    async query(sql, params = []) {
      return executeJsonQuery(sql, params)
    },
    async getConnection() {
      return {
        async beginTransaction() {},
        async commit() {},
        async rollback() {},
        async release() {},
        async query(sql, params = []) {
          return executeJsonQuery(sql, params)
        },
      }
    },
  }
}
