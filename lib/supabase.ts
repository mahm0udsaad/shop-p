import { supabaseClient } from "./supabase/client"

export const supabase = supabaseClient

export type UserProfile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error || !data) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return data as UserProfile
}

export async function uploadProductImage(file: File, userId: string): Promise<string | null> {
  const fileExt = file.name.split(".").pop()
  const fileName = `${userId}/${Date.now()}.${fileExt}`
  const filePath = `${fileName}`

  const { error } = await supabase.storage.from("product-images").upload(filePath, file)

  if (error) {
    console.error("Error uploading image:", error)
    return null
  }

  const { data } = supabase.storage.from("product-images").getPublicUrl(filePath)

  return data.publicUrl
}
