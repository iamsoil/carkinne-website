import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Fallback to environment variables without NEXT_PUBLIC_ prefix if needed
const url = supabaseUrl || import.meta.env.VITE_SUPABASE_URL
const key = supabaseKey || import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url) throw new Error('Missing Supabase URL environment variable')
if (!key) throw new Error('Missing Supabase anon key environment variable')

export const supabase = createClient(url, key)