import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/database.types"

const BUCKET_NAME = "product-images"

// Server-side function to get all images for a product
export async function getProductImages(productId: string, userId: string) {
  const supabase = createClientComponentClient<Database>()

  try {
    if (!userId) {
      return []
    }

    // First, check if the product belongs to the user
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .eq("user_id", userId)
      .single()

    if (productError || !product) {
      console.error("Error fetching product or product not found:", productError)
      return []
    }

    // List files in the product's folder
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list(`${userId}/${productId}`)

    if (error) {
      console.error("Error listing files:", error)
      return []
    }

    // Get public URLs for each file
    const images = await Promise.all(
      data
        .filter((file) => !file.name.includes(".DS_Store")) // Filter out system files
        .map(async (file) => {
          const { data: urlData } = await supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(`${userId}/${productId}/${file.name}`)

          return {
            name: file.name,
            path: `${userId}/${productId}/${file.name}`,
            url: urlData.publicUrl,
            size: file.metadata?.size,
            createdAt: file.created_at,
          }
        }),
    )

    return images
  } catch (error) {
    console.error("Error in getProductImages:", error)
    return []
  }
}
