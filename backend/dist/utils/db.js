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
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const isValidSupabaseUrl = supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('xxmhlvkqhlmcxqeyvzld') &&
    !supabaseUrl.includes('example') &&
    !supabaseUrl.includes('your-project');
let realSupabase = null;
if (isValidSupabaseUrl && supabaseKey) {
    try {
        realSupabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
        console.log('✅ Initialized Supabase client for:', supabaseUrl);
    }
    catch (e) {
        console.warn('⚠️ Supabase init error, falling back to SQLite');
    }
}
else {
    console.warn('⚠️ Placeholder or unreachable Supabase URL detected. Using SQLite database fallback.');
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
                let rows = (res.rows || []).map(parseJSONFields);
                if (this.isSingle) {
                    if (rows.length === 0) {
                        return { data: null, error: { message: 'Row not found', code: 'PGRST116' } };
                    }
                    return { data: rows[0], error: null };
                }
                if (this.isMaybeSingle) {
                    return { data: rows[0] || null, error: null };
                }
                return { data: rows, error: null };
            }
            if (this.operation === 'insert') {
                const item = Array.isArray(this.insertData) ? this.insertData[0] : this.insertData;
                const keys = Object.keys(item);
                const values = keys.map(k => stringifyIfObject(item[k]));
                const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
                let sql = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
                const res = await (0, db_sqlite_1.query)(sql, values);
                let rows = (res.rows || []).map(parseJSONFields);
                const inserted = rows[0] || item;
                if (this.isSingle || this.isMaybeSingle) {
                    return { data: inserted, error: null };
                }
                return { data: Array.isArray(this.insertData) ? rows : [inserted], error: null };
            }
            if (this.operation === 'update') {
                const keys = Object.keys(this.updateData);
                const setClauses = [];
                const params = [];
                keys.forEach(k => {
                    params.push(stringifyIfObject(this.updateData[k]));
                    setClauses.push(`${k} = $${params.length}`);
                });
                let sql = `UPDATE ${this.tableName} SET ${setClauses.join(', ')}`;
                if (this.whereConditions.length > 0) {
                    const whereClauses = this.whereConditions.map(cond => {
                        params.push(cond.val);
                        return `${cond.col} = $${params.length}`;
                    });
                    sql += ` WHERE ${whereClauses.join(' AND ')}`;
                }
                sql += ` RETURNING *`;
                const res = await (0, db_sqlite_1.query)(sql, params);
                let rows = (res.rows || []).map(parseJSONFields);
                if (this.isSingle || this.isMaybeSingle) {
                    return { data: rows[0] || null, error: null };
                }
                return { data: rows, error: null };
            }
            if (this.operation === 'delete') {
                let sql = `DELETE FROM ${this.tableName}`;
                const params = [];
                if (this.whereConditions.length > 0) {
                    const clauses = this.whereConditions.map(cond => {
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
            catch {
                // Leave as string
            }
        }
    }
    return copy;
}
exports.supabase = {
    from(table) {
        if (realSupabase) {
            const builder = realSupabase.from(table);
            return new Proxy(builder, {
                get(target, prop, receiver) {
                    const orig = Reflect.get(target, prop, receiver);
                    if (typeof orig === 'function') {
                        return function (...args) {
                            const res = orig.apply(target, args);
                            if (res && typeof res.then === 'function') {
                                return res.catch((err) => {
                                    console.warn(`Supabase network error (${err?.message}). Falling back to SQLite for table '${table}'`);
                                    return new SQLiteQueryBuilder(table).then();
                                });
                            }
                            return res;
                        };
                    }
                    return orig;
                }
            });
        }
        return new SQLiteQueryBuilder(table);
    }
};
exports.default = exports.supabase;
