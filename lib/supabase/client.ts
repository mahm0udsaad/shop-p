import { createBrowserClient } from '@supabase/ssr'
import type { Database } from "../database.types"

// Check if the environment variables are defined
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL")
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn("Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY")
}

// Create a single supabase client for the browser
export const supabaseClient = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
)

// Export a function to create a client-side Supabase client
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Helper to get user profile on the client
export async function getClientUserProfile(userId: string) {
  try {
    const { data, error } = await supabaseClient.from("profiles").select("*").eq("id", userId).single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error getting user profile on client:", error)
    return null
  }
}
