"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { v4 as uuidv4 } from "uuid"
import type { Database } from "@/lib/database.types"

const BUCKET_NAME = "product-images"

// Client-side function to upload an image
export async function uploadProductImage(file: File, productId: string) {
  const supabase = createClientComponentClient<Database>()

  try {
    // Get the current user
    const { data: sessionData } = await supabase.auth.getSession()
    const userId = sessionData.session?.user?.id

    if (!userId) {
      throw new Error("Not authenticated")
    }

    // Create a unique file name
    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `${userId}/${productId}/${fileName}`

    // Upload the file
    const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Error uploading file:", error)
      throw error
    }

    // Get the public URL
    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

    return { path: filePath, url: urlData.publicUrl }
  } catch (error) {
    console.error("Error in uploadProductImage:", error)
    throw error
  }
}

// Client-side function to delete an image
export async function deleteProductImage(filePath: string) {
  const supabase = createClientComponentClient<Database>()

  try {
    // Get the current user
    const { data: sessionData } = await supabase.auth.getSession()
    const userId = sessionData.session?.user?.id

    if (!userId) {
      return { success: false, error: "Not authenticated" }
    }

    // Ensure the path starts with the user's ID to prevent unauthorized deletion
    if (!filePath.startsWith(`${userId}/`)) {
      return { success: false, error: "Unauthorized" }
    }

    // Delete the file
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath])

    if (error) {
      console.error("Error deleting file:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in deleteProductImage:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
