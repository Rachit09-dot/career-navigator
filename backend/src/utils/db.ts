import { createClient, SupabaseClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load env here too so db.ts works regardless of import order
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Supabase credentials missing in .env')
} else {
  console.log('✅ Supabase connected:', supabaseUrl)
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey)

export default supabase
