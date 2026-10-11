"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closePool = exports.query = void 0;
const pg_1 = require("pg");
// Create PostgreSQL connection pool
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
// Test connection
pool.on('connect', () => {
    console.log('✅ Connected to Supabase PostgreSQL database');
});
pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle client', err);
    process.exit(-1);
});
// Query function compatible with PostgreSQL
const query = async (text, params) => {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: result.rowCount });
        return result;
    }
    catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};
exports.query = query;
// Close pool (for graceful shutdown)
const closePool = async () => {
    await pool.end();
    console.log('Database pool closed');
};
exports.closePool = closePool;
exports.default = pool;
