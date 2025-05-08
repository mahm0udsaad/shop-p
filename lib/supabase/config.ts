// Supabase configuration
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabaseConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
}

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing Supabase environment variables")
}

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)
