// @ts-nocheck
import initSqlJs, { Database } from 'sql.js'
import fs from 'fs'

let db: Database | null = null
const dbPath = process.env.DATABASE_PATH || './database.sqlite'

// Initialize database
const initDb = async () => {
  const SQL = await initSqlJs()
  
  // Load existing database or create new one
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath)
    db = new SQL.Database(buffer)
  } else {
    db = new SQL.Database()
  }

  // Initialize schema
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      profile_complete INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      phone TEXT,
      location TEXT,
      bio TEXT,
      skills TEXT,
      experience TEXT,
      education TEXT,
      resume_url TEXT,
      linkedin_url TEXT,
      github_url TEXT,
      portfolio_url TEXT,
      college TEXT,
      degree TEXT,
      current_year TEXT,
      field_of_study TEXT,
      completed_skills TEXT,
      certifications TEXT,
      career_goal TEXT,
      career_dna TEXT,
      career_dna_last_run DATETIME,
      skill_gap_last_run DATETIME,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)

  // Add missing columns to existing profiles table (migration)
  const profileMigrations = [
    'ALTER TABLE profiles ADD COLUMN college TEXT',
    'ALTER TABLE profiles ADD COLUMN degree TEXT',
    'ALTER TABLE profiles ADD COLUMN current_year TEXT',
    'ALTER TABLE profiles ADD COLUMN field_of_study TEXT',
    'ALTER TABLE profiles ADD COLUMN completed_skills TEXT',
    'ALTER TABLE profiles ADD COLUMN certifications TEXT',
    'ALTER TABLE profiles ADD COLUMN career_goal TEXT',
    'ALTER TABLE profiles ADD COLUMN career_dna TEXT',
    'ALTER TABLE profiles ADD COLUMN career_dna_last_run DATETIME',
    'ALTER TABLE profiles ADD COLUMN skill_gap_last_run DATETIME',
    'ALTER TABLE profiles ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP',
  ]
  for (const migration of profileMigrations) {
    try { db.run(migration) } catch (_) { /* column already exists */ }
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      requirements TEXT NOT NULL,
      salary_range TEXT,
      posted_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'active'
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      job_title TEXT,
      company TEXT,
      job_url TEXT,
      status TEXT DEFAULT 'applied',
      notes TEXT,
      salary_offered TEXT,
      applied_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)

  // Add missing columns to existing applications table (migration)
  const appMigrations = [
    'ALTER TABLE applications ADD COLUMN job_title TEXT',
    'ALTER TABLE applications ADD COLUMN company TEXT',
    'ALTER TABLE applications ADD COLUMN job_url TEXT',
    'ALTER TABLE applications ADD COLUMN notes TEXT',
    'ALTER TABLE applications ADD COLUMN salary_offered TEXT',
    'ALTER TABLE applications ADD COLUMN applied_date TEXT',
    'ALTER TABLE applications ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP',
    'ALTER TABLE applications ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP',
  ]
  for (const migration of appMigrations) {
    try { db.run(migration) } catch (_) { /* column already exists */ }
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS career_assessments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      assessment_type TEXT NOT NULL,
      results TEXT NOT NULL,
      completed_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)

  // Add skill_gaps table
  db.run(`
    CREATE TABLE IF NOT EXISTS skill_gaps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      target_role TEXT,
      gaps TEXT,
      completed_skills TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)

  // Save database to file
  saveDb()
  console.log('✅ SQLite database initialized with full schema')
  
  return db
}

// Save database to file
const saveDb = () => {
  if (db) {
    const data = db.export()
    const buffer = Buffer.from(data)
    fs.writeFileSync(dbPath, buffer)
  }
}

// Convert PostgreSQL $1, $2... to SQLite ?
const convertQuery = (text: string): string => {
  return text.replace(/\$\d+/g, '?')
}

// Query function compatible with PostgreSQL-style queries
export const query = async (text: string, params?: any[]) => {
  if (!db) {
    await initDb()
  }

  const sqliteQuery = convertQuery(text)
  
  try {
    if (text.trim().toUpperCase().startsWith('SELECT')) {
      const stmt = db!.prepare(sqliteQuery)
      if (params && params.length > 0) {
        stmt.bind(params)
      }
      const rows: any[] = []
      while (stmt.step()) {
        rows.push(stmt.getAsObject())
      }
      stmt.free()
      return { rows, rowCount: rows.length }
    } else if (text.trim().toUpperCase().includes('RETURNING')) {
      // Handle INSERT/UPDATE with RETURNING
      const [mainQuery] = text.split(/RETURNING/i)
      const sqliteMainQuery = convertQuery(mainQuery)
      
      db!.run(sqliteMainQuery, params)
      saveDb()
      
      // Get the last inserted row
      const lastIdStmt = db!.prepare('SELECT last_insert_rowid() as id')
      lastIdStmt.step()
      const lastId = lastIdStmt.getAsObject().id
      lastIdStmt.free()
      
      // Get the inserted row data
      const tableName = mainQuery.match(/(?:INTO|UPDATE)\s+(\w+)/i)?.[1]
      const returningFields = text.split(/RETURNING/i)[1].trim()
      const selectStmt = db!.prepare(`SELECT ${returningFields} FROM ${tableName} WHERE id = ?`)
      selectStmt.bind([lastId])
      const rows: any[] = []
      while (selectStmt.step()) {
        rows.push(selectStmt.getAsObject())
      }
      selectStmt.free()
      
      return { rows, rowCount: rows.length }
    } else {
      db!.run(sqliteQuery, params)
      saveDb()
      return { rows: [], rowCount: db!.getRowsModified() }
    }
  } catch (error) {
    console.error('Database error:', error)
    throw error
  }
}

// Initialize database on module load
initDb().catch(console.error)

export default db
