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
// Initialize database
const initDb = async () => {
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
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
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
      status TEXT DEFAULT 'pending',
      job_id INTEGER NOT NULL,
      cover_letter TEXT,
      applied_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
    )
  `);
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
    // Save database to file
    saveDb();
    console.log('✅ SQLite database initialized');
    return db;
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
    const sqliteQuery = convertQuery(text);
    try {
        if (text.trim().toUpperCase().startsWith('SELECT')) {
            const stmt = db.prepare(sqliteQuery);
            if (params && params.length > 0) {
                stmt.bind(params);
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
            db.run(sqliteMainQuery, params);
            saveDb();
            // Get the last inserted row
            const lastIdStmt = db.prepare('SELECT last_insert_rowid() as id');
            lastIdStmt.step();
            const lastId = lastIdStmt.getAsObject().id;
            lastIdStmt.free();
            // Get the inserted row data
            const tableName = mainQuery.match(/(?:INTO|UPDATE)\s+(\w+)/i)?.[1];
            const returningFields = text.split(/RETURNING/i)[1].trim();
            const selectStmt = db.prepare(`SELECT ${returningFields} FROM ${tableName} WHERE id = ?`);
            selectStmt.bind([lastId]);
            const rows = [];
            while (selectStmt.step()) {
                rows.push(selectStmt.getAsObject());
            }
            selectStmt.free();
            return { rows, rowCount: rows.length };
        }
        else {
            db.run(sqliteQuery, params);
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
