"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
const db_sqlite_1 = require("./db-sqlite");
dotenv_1.default.config();
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_KEY ||
    '';
const isValidSupabaseUrl = supabaseUrl.startsWith('https://') &&
    supabaseUrl.includes('.supabase.co') &&
    !supabaseUrl.includes('example') &&
    !supabaseUrl.includes('your-project');
const useSqlite = process.env.USE_SQLITE === 'true';
let realSupabase = null;
if (!useSqlite && isValidSupabaseUrl && supabaseKey) {
    try {
        realSupabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
        console.log('✅ Supabase client initialized:', supabaseUrl);
    }
    catch (e) {
        console.warn('⚠️ Supabase init error, falling back to SQLite:', e?.message || e);
    }
}
else {
    if (useSqlite) {
        console.log('ℹ️ USE_SQLITE is enabled. Using SQLite database.');
    }
    else if (process.env.NODE_ENV === 'production') {
        console.warn('⚠️ [PRODUCTION DATABASE WARNING] Supabase credentials (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY) are missing or invalid.');
        console.warn('⚠️ The application is currently running with the local SQLite fallback. On platforms with ephemeral filesystems (e.g., Render free tier), SQLite data is wiped across restarts.');
    }
    else {
        console.log('ℹ️ Running with local SQLite fallback database for development.');
    }
}
class SQLiteQueryBuilder {
    constructor(table) {
        this.operation = 'select';
        this.selectFields = '*';
        this.insertData = null;
        this.updateData = null;
        this.whereConditions = [];
        this.orderBy = null;
        this.limitVal = null;
        this.isSingle = false;
        this.isMaybeSingle = false;
        this.tableName = table;
    }
    select(fields = '*') {
        if (this.operation !== 'insert' && this.operation !== 'update' && this.operation !== 'delete') {
            this.operation = 'select';
        }
        this.selectFields = fields;
        return this;
    }
    insert(data) {
        this.operation = 'insert';
        this.insertData = data;
        return this;
    }
    update(data) {
        this.operation = 'update';
        this.updateData = data;
        return this;
    }
    delete() {
        this.operation = 'delete';
        return this;
    }
    eq(col, val) {
        if (val === undefined) {
            throw new Error(`[QueryBuilder] Filter condition '${col}' cannot be undefined`);
        }
        this.whereConditions.push({ col, val });
        return this;
    }
    order(col, opts) {
        this.orderBy = { col, asc: opts?.ascending !== false };
        return this;
    }
    limit(n) {
        this.limitVal = n;
        return this;
    }
    single() {
        this.isSingle = true;
        return this.execute();
    }
    maybeSingle() {
        this.isMaybeSingle = true;
        return this.execute();
    }
    then(onfulfilled, onrejected) {
        return this.execute().then(onfulfilled, onrejected);
    }
    async execute() {
        try {
            if (this.operation === 'select') {
                let sql = `SELECT ${this.selectFields} FROM ${this.tableName}`;
                const params = [];
                if (this.whereConditions.length > 0) {
                    const clauses = this.whereConditions.map((cond, i) => {
                        params.push(cond.val);
                        return `${cond.col} = $${i + 1}`;
                    });
                    sql += ` WHERE ${clauses.join(' AND ')}`;
                }
                if (this.orderBy) {
                    sql += ` ORDER BY ${this.orderBy.col} ${this.orderBy.asc ? 'ASC' : 'DESC'}`;
                }
                if (this.limitVal) {
                    sql += ` LIMIT ${this.limitVal}`;
                }
                const res = await (0, db_sqlite_1.query)(sql, params);
                const rows = (res.rows || []).map(parseJSONFields);
                if (this.isSingle) {
                    if (rows.length === 0)
                        return { data: null, error: { message: 'Row not found', code: 'PGRST116' } };
                    return { data: rows[0], error: null };
                }
                if (this.isMaybeSingle)
                    return { data: rows[0] || null, error: null };
                return { data: rows, error: null };
            }
            if (this.operation === 'insert') {
                const item = Array.isArray(this.insertData) ? this.insertData[0] : this.insertData;
                const keys = Object.keys(item);
                const values = keys.map(k => stringifyIfObject(item[k]));
                const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
                const sql = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
                const res = await (0, db_sqlite_1.query)(sql, values);
                const rows = (res.rows || []).map(parseJSONFields);
                const inserted = rows[0] || item;
                if (this.isSingle || this.isMaybeSingle)
                    return { data: inserted, error: null };
                return { data: Array.isArray(this.insertData) ? rows : [inserted], error: null };
            }
            if (this.operation === 'update') {
                const keys = Object.keys(this.updateData || {}).filter(k => this.updateData[k] !== undefined);
                // If no fields to update, return the existing row
                if (keys.length === 0) {
                    let sql = `SELECT * FROM ${this.tableName}`;
                    const params = [];
                    if (this.whereConditions.length > 0) {
                        const clauses = this.whereConditions.map((cond, i) => {
                            params.push(cond.val);
                            return `${cond.col} = $${i + 1}`;
                        });
                        sql += ` WHERE ${clauses.join(' AND ')}`;
                    }
                    const res = await (0, db_sqlite_1.query)(sql, params);
                    const rows = (res.rows || []).map(parseJSONFields);
                    if (this.isSingle || this.isMaybeSingle)
                        return { data: rows[0] || null, error: null };
                    return { data: rows, error: null };
                }
                const setClauses = [];
                const params = [];
                keys.forEach(k => {
                    params.push(stringifyIfObject(this.updateData[k]));
                    setClauses.push(`${k} = $${params.length}`);
                });
                let sql = `UPDATE ${this.tableName} SET ${setClauses.join(', ')}`;
                if (this.whereConditions.length > 0) {
                    const whereClauses = this.whereConditions.map(cond => {
                        if (cond.val === undefined) {
                            throw new Error(`[QueryBuilder] Filter condition '${cond.col}' cannot be undefined`);
                        }
                        params.push(cond.val);
                        return `${cond.col} = $${params.length}`;
                    });
                    sql += ` WHERE ${whereClauses.join(' AND ')}`;
                }
                // Run UPDATE without RETURNING (avoids fragile RETURNING parsing in SQLite)
                await (0, db_sqlite_1.query)(sql, params);
                // Then SELECT the updated row using WHERE conditions
                const selectParams = [];
                let selectSql = `SELECT * FROM ${this.tableName}`;
                if (this.whereConditions.length > 0) {
                    const selectWhere = this.whereConditions.map((cond, i) => {
                        selectParams.push(cond.val);
                        return `${cond.col} = $${i + 1}`;
                    });
                    selectSql += ` WHERE ${selectWhere.join(' AND ')}`;
                }
                const res = await (0, db_sqlite_1.query)(selectSql, selectParams);
                const rows = (res.rows || []).map(parseJSONFields);
                if (this.isSingle || this.isMaybeSingle)
                    return { data: rows[0] || null, error: null };
                return { data: rows, error: null };
            }
            if (this.operation === 'delete') {
                let sql = `DELETE FROM ${this.tableName}`;
                const params = [];
                if (this.whereConditions.length > 0) {
                    const clauses = this.whereConditions.map(cond => {
                        if (cond.val === undefined) {
                            throw new Error(`[QueryBuilder] Filter condition '${cond.col}' cannot be undefined`);
                        }
                        params.push(cond.val);
                        return `${cond.col} = $${params.length}`;
                    });
                    sql += ` WHERE ${clauses.join(' AND ')}`;
                }
                await (0, db_sqlite_1.query)(sql, params);
                return { data: null, error: null };
            }
            return { data: null, error: new Error('Unsupported operation') };
        }
        catch (err) {
            console.error('SQLite execution error:', err);
            return { data: null, error: err };
        }
    }
}
function stringifyIfObject(val) {
    if (val === null || val === undefined)
        return null;
    if (typeof val === 'object')
        return JSON.stringify(val);
    return val;
}
function parseJSONFields(row) {
    if (!row)
        return row;
    const copy = { ...row };
    for (const key of Object.keys(copy)) {
        if (typeof copy[key] === 'string' && (copy[key].startsWith('{') || copy[key].startsWith('['))) {
            try {
                copy[key] = JSON.parse(copy[key]);
            }
            catch { /* leave as string */ }
        }
    }
    return copy;
}
exports.supabase = {
    from(table) {
        if (realSupabase) {
            return realSupabase.from(table);
        }
        return new SQLiteQueryBuilder(table);
    }
};
exports.default = exports.supabase;
