'use server'

import { createClient } from "@/lib/supabase/server"
import { deleteUmamiWebsite } from "./umami"
import { revalidatePath } from "next/cache"

export async function deleteProductDomain(supabase: any, productId: string) {
  try {
    // Get domain info first using subdomain
    const { data: domain, error: fetchError } = await supabase
      .from('domains')
      .select('analytics_id, subdomain')
      .eq('subdomain', productId)
      .single()

    if (fetchError) throw fetchError

    // Delete Umami website if exists
    if (domain?.analytics_id) {
      await deleteUmamiWebsite(domain.analytics_id)
    }

    // Delete domain record using subdomain
    const { error: deleteError } = await supabase
      .from('domains')
      .delete()
      .eq('subdomain', productId)

    if (deleteError) throw deleteError
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting domain:', error)
    return { success: false, error }
  }
}

async function deleteProductImages(supabase: any, productId: string) {
  try {
    // First get the product to find image URLs
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('media')
      .eq('id', productId)
      .single()

    if (fetchError) throw fetchError

    const media = product?.media || {}
    const imageUrls = [
      ...(media.images || []),
      media.thumbnail,
      media.logo,
      ...(Object.values(media).filter(Array.isArray) as string[][]).flat()
    ].filter(Boolean)

    // Extract file paths from URLs
    const filePaths = imageUrls.map(url => {
      try {
        // Convert URL to storage path
        // Example: https://xxx.supabase.co/storage/v1/object/public/products/image.jpg
        // to: products/image.jpg
        const urlObj = new URL(url)
        const path = urlObj.pathname.split('/public/')[1]
        return path
      } catch (e) {
        console.warn('Invalid image URL:', url)
        return null
      }
    }).filter(Boolean)

    if (filePaths.length > 0) {
      const { error: storageError } = await supabase
        .storage
        .from('products')
        .remove(filePaths)

      if (storageError) throw storageError
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting product images:', error)
    return { success: false, error }
  }
}

async function deleteProductRecord(supabase: any, productId: string) {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Error deleting product record:', error)
    return { success: false, error }
  }
}

export async function deleteProduct(productId: string) {
  try {
    const supabase = await createClient()

    // Delete in sequence to maintain referential integrity
    // 1. Delete domain and analytics
    const domainResult = await deleteProductDomain(supabase, productId)
    if (!domainResult.success) throw domainResult.error

    // 2. Delete images from storage
    const imagesResult = await deleteProductImages(supabase, productId)
    if (!imagesResult.success) throw imagesResult.error

    // 3. Delete product record
    const productResult = await deleteProductRecord(supabase, productId)
    if (!productResult.success) throw productResult.error

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error in delete product process:', error)
    return { success: false, error }
  }
} 