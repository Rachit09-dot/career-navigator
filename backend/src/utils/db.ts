import { createClient, SupabaseClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { query as runSqliteQuery } from './db-sqlite'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const isValidSupabaseUrl =
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('xxmhlvkqhlmcxqeyvzld') &&
  !supabaseUrl.includes('example') &&
  !supabaseUrl.includes('your-project')

let realSupabase: SupabaseClient | null = null

if (isValidSupabaseUrl && supabaseKey) {
  try {
    realSupabase = createClient(supabaseUrl, supabaseKey)
    console.log('✅ Initialized Supabase client for:', supabaseUrl)
  } catch (e) {
    console.warn('⚠️ Supabase init error, falling back to SQLite')
  }
} else {
  console.warn('⚠️ Placeholder or unreachable Supabase URL detected. Using SQLite database fallback.')
}

class SQLiteQueryBuilder {
  private tableName: string
  private operation: 'select' | 'insert' | 'update' | 'delete' = 'select'
  private selectFields: string = '*'
  private insertData: any = null
  private updateData: any = null
  private whereConditions: Array<{ col: string; val: any }> = []
  private orderBy: { col: string; asc: boolean } | null = null
  private limitVal: number | null = null
  private isSingle: boolean = false
  private isMaybeSingle: boolean = false

  constructor(table: string) {
    this.tableName = table
  }

  select(fields = '*') {
    if (this.operation !== 'insert' && this.operation !== 'update' && this.operation !== 'delete') {
      this.operation = 'select'
    }
    this.selectFields = fields
    return this
  }

  insert(data: any) {
    this.operation = 'insert'
    this.insertData = data
    return this
  }

  update(data: any) {
    this.operation = 'update'
    this.updateData = data
    return this
  }

  delete() {
    this.operation = 'delete'
    return this
  }

  eq(col: string, val: any) {
    this.whereConditions.push({ col, val })
    return this
  }

  order(col: string, opts?: { ascending?: boolean }) {
    this.orderBy = { col, asc: opts?.ascending !== false }
    return this
  }

  limit(n: number) {
    this.limitVal = n
    return this
  }

  single() {
    this.isSingle = true
    return this.execute()
  }

  maybeSingle() {
    this.isMaybeSingle = true
    return this.execute()
  }

  then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    return this.execute().then(onfulfilled, onrejected)
  }

  async execute(): Promise<{ data: any; error: any }> {
    try {
      if (this.operation === 'select') {
        let sql = `SELECT ${this.selectFields} FROM ${this.tableName}`
        const params: any[] = []

        if (this.whereConditions.length > 0) {
          const clauses = this.whereConditions.map((cond, i) => {
            params.push(cond.val)
            return `${cond.col} = $${i + 1}`
          })
          sql += ` WHERE ${clauses.join(' AND ')}`
        }

        if (this.orderBy) {
          sql += ` ORDER BY ${this.orderBy.col} ${this.orderBy.asc ? 'ASC' : 'DESC'}`
        }

        if (this.limitVal) {
          sql += ` LIMIT ${this.limitVal}`
        }

        const res = await runSqliteQuery(sql, params)
        let rows = (res.rows || []).map(parseJSONFields)

        if (this.isSingle) {
          if (rows.length === 0) {
            return { data: null, error: { message: 'Row not found', code: 'PGRST116' } }
          }
          return { data: rows[0], error: null }
        }

        if (this.isMaybeSingle) {
          return { data: rows[0] || null, error: null }
        }

        return { data: rows, error: null }
      }

      if (this.operation === 'insert') {
        const item = Array.isArray(this.insertData) ? this.insertData[0] : this.insertData
        const keys = Object.keys(item)
        const values = keys.map(k => stringifyIfObject(item[k]))
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ')

        let sql = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`
        const res = await runSqliteQuery(sql, values)
        let rows = (res.rows || []).map(parseJSONFields)
        const inserted = rows[0] || item

        if (this.isSingle || this.isMaybeSingle) {
          return { data: inserted, error: null }
        }
        return { data: Array.isArray(this.insertData) ? rows : [inserted], error: null }
      }

      if (this.operation === 'update') {
        const keys = Object.keys(this.updateData)
        const setClauses: string[] = []
        const params: any[] = []

        keys.forEach(k => {
          params.push(stringifyIfObject(this.updateData[k]))
          setClauses.push(`${k} = $${params.length}`)
        })

        let sql = `UPDATE ${this.tableName} SET ${setClauses.join(', ')}`
        if (this.whereConditions.length > 0) {
          const whereClauses = this.whereConditions.map(cond => {
            params.push(cond.val)
            return `${cond.col} = $${params.length}`
          })
          sql += ` WHERE ${whereClauses.join(' AND ')}`
        }
        sql += ` RETURNING *`

        const res = await runSqliteQuery(sql, params)
        let rows = (res.rows || []).map(parseJSONFields)

        if (this.isSingle || this.isMaybeSingle) {
          return { data: rows[0] || null, error: null }
        }
        return { data: rows, error: null }
      }

      if (this.operation === 'delete') {
        let sql = `DELETE FROM ${this.tableName}`
        const params: any[] = []

        if (this.whereConditions.length > 0) {
          const clauses = this.whereConditions.map(cond => {
            params.push(cond.val)
            return `${cond.col} = $${params.length}`
          })
          sql += ` WHERE ${clauses.join(' AND ')}`
        }

        await runSqliteQuery(sql, params)
        return { data: null, error: null }
      }

      return { data: null, error: new Error('Unsupported operation') }
    } catch (err: any) {
      console.error('SQLite execution error:', err)
      return { data: null, error: err }
    }
  }
}

function stringifyIfObject(val: any): any {
  if (val === null || val === undefined) return null
  if (typeof val === 'object') return JSON.stringify(val)
  return val
}

function parseJSONFields(row: any): any {
  if (!row) return row
  const copy = { ...row }
  for (const key of Object.keys(copy)) {
    if (typeof copy[key] === 'string' && (copy[key].startsWith('{') || copy[key].startsWith('['))) {
      try {
        copy[key] = JSON.parse(copy[key])
      } catch {
        // Leave as string
      }
    }
  }
  return copy
}

export const supabase: any = {
  from(table: string) {
    if (realSupabase) {
      const builder = realSupabase.from(table)
      return new Proxy(builder, {
        get(target, prop, receiver) {
          const orig = Reflect.get(target, prop, receiver)
          if (typeof orig === 'function') {
            return function (...args: any[]) {
              const res = orig.apply(target, args)
              if (res && typeof res.then === 'function') {
                return res.catch((err: any) => {
                  console.warn(`Supabase network error (${err?.message}). Falling back to SQLite for table '${table}'`)
                  return new SQLiteQueryBuilder(table).then()
                })
              }
              return res
            }
          }
          return orig
        }
      })
    }
    return new SQLiteQueryBuilder(table)
  }
}

export default supabase
