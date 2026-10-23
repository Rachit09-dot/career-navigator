"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = void 0;
// @ts-nocheck
const sql_js_1 = __importDefault(require("sql.js"));
const fs_1 = __importDefault(require("fs"));
let db = null;
const dbPath = process.env.DATABASE_PATH || './database.sqlite';
let initPromise = null;
// Initialize database
const initDb = async () => {
    if (db)
        return db;
    if (initPromise)
        return initPromise;
    initPromise = (async () => {
        const SQL = await (0, sql_js_1.default)();
        // Load existing database or create new one
        if (fs_1.default.existsSync(dbPath)) {
            const buffer = fs_1.default.readFileSync(dbPath);
            db = new SQL.Database(buffer);
        }
        else {
            db = new SQL.Database();
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
  `);
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
  `);
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
        ];
        for (const migration of profileMigrations) {
            try {
                db.run(migration);
            }
            catch (_) { /* column already exists */ }
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
  `);
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
  `);
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
        ];
        for (const migration of appMigrations) {
            try {
                db.run(migration);
            }
            catch (_) { /* column already exists */ }
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
  `);
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
  `);
        // Phase 2: interview_sessions table
        db.run(`
    CREATE TABLE IF NOT EXISTS interview_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      role TEXT NOT NULL,
      category TEXT NOT NULL,
      difficulty TEXT NOT NULL DEFAULT 'Medium',
      questions TEXT NOT NULL,
      answers TEXT,
      feedback TEXT,
      score INTEGER,
      status TEXT DEFAULT 'in_progress',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
        // Phase 2: mcq_results table
        db.run(`
    CREATE TABLE IF NOT EXISTS mcq_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      role TEXT NOT NULL,
      topic TEXT,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      answers TEXT NOT NULL,
      questions TEXT NOT NULL,
      time_taken INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
        db.run(`
    CREATE TABLE IF NOT EXISTS roadmap_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      role TEXT NOT NULL,
      roadmap TEXT NOT NULL,
      completed_milestones TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
        // Gamification
        db.run(`
    CREATE TABLE IF NOT EXISTS user_xp (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      total_xp INTEGER DEFAULT 0,
      earned_actions TEXT DEFAULT '[]',
      badges TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
        db.run(`
    CREATE TABLE IF NOT EXISTS xp_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      action TEXT NOT NULL,
      xp_earned INTEGER NOT NULL,
      label TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
        // Resume persistence
        db.run(`
    CREATE TABLE IF NOT EXISTS resumes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      resume_data TEXT NOT NULL,
      template TEXT DEFAULT 'classic',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
        // Notifications
        db.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'system',
      link TEXT,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
        // Save database to file
        saveDb();
        console.log('✅ SQLite database initialized with full schema');
        return db;
    })();
    return initPromise;
};
// Save database to file
const saveDb = () => {
    if (db) {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs_1.default.writeFileSync(dbPath, buffer);
    }
};
// Convert PostgreSQL $1, $2... to SQLite ?
const convertQuery = (text) => {
    return text.replace(/\$\d+/g, '?');
};
// Query function compatible with PostgreSQL-style queries
const query = async (text, params) => {
    if (!db) {
        await initDb();
    }
    // Ensure no undefined values are bound to SQLite
    const safeParams = (params || []).map(p => (p === undefined ? null : p));
    const sqliteQuery = convertQuery(text);
    try {
        if (text.trim().toUpperCase().startsWith('SELECT')) {
            const stmt = db.prepare(sqliteQuery);
            if (safeParams.length > 0) {
                stmt.bind(safeParams);
            }
            const rows = [];
            while (stmt.step()) {
                rows.push(stmt.getAsObject());
            }
            stmt.free();
            return { rows, rowCount: rows.length };
        }
        else if (text.trim().toUpperCase().includes('RETURNING')) {
            // Handle INSERT/UPDATE with RETURNING
            const [mainQuery] = text.split(/RETURNING/i);
            const sqliteMainQuery = convertQuery(mainQuery);
            db.run(sqliteMainQuery, safeParams);
            saveDb();
            const tableName = mainQuery.match(/(?:INTO|UPDATE)\s+(\w+)/i)?.[1];
            const returningFields = text.split(/RETURNING/i)[1].trim();
            let rows = [];
            if (text.trim().toUpperCase().startsWith('INSERT')) {
                // For INSERT: use db.exec to reliably get last_insert_rowid in sql.js
                const lastIdResult = db.exec('SELECT last_insert_rowid() as id');
                const lastId = lastIdResult[0]?.values[0]?.[0];
                if (lastId !== undefined && lastId !== null && Number(lastId) > 0) {
                    const selectStmt = db.prepare(`SELECT ${returningFields} FROM ${tableName} WHERE id = ?`);
                    selectStmt.bind([lastId]);
                    while (selectStmt.step()) {
                        rows.push(selectStmt.getAsObject());
                    }
                    selectStmt.free();
                }
            }
            else {
                // For UPDATE: re-select using WHERE conditions from original query
                const whereMatch = mainQuery.match(/WHERE\s+(.+)$/i);
                if (whereMatch) {
                    // Count ? placeholders before WHERE in the converted query (reliable vs regex on original SQL)
                    const sqliteBeforeWhere = sqliteMainQuery.split(/\s+WHERE\s+/i)[0];
                    const setCount = (sqliteBeforeWhere.match(/\?/g) || []).length;
                    const whereParams = safeParams.slice(setCount);
                    const sqliteWhereQuery = convertQuery(`SELECT ${returningFields} FROM ${tableName} WHERE ${whereMatch[1].trim()}`);
                    const selectStmt = db.prepare(sqliteWhereQuery);
                    if (whereParams.length > 0)
                        selectStmt.bind(whereParams);
                    while (selectStmt.step()) {
                        rows.push(selectStmt.getAsObject());
                    }
                    selectStmt.free();
                }
            }
            return { rows, rowCount: rows.length };
        }
        else {
            db.run(sqliteQuery, safeParams);
            saveDb();
            return { rows: [], rowCount: db.getRowsModified() };
        }
    }
    catch (error) {
        console.error('Database error:', error);
        throw error;
    }
};
exports.query = query;
// Initialize database on module load
initDb().catch(console.error);
exports.default = db;
