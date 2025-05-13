"use server"

import { revalidatePath } from "next/cache"
import { deleteUmamiWebsite } from "@/app/actions/umami"
import { createClient } from "@/lib/supabase/server"

export async function getUserProducts() {
  const supabase = await createClient()

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const userId = session?.user?.id
  if (!userId) {
    return { products: [], error: "Not authenticated" }
  }

  // Fetch products
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
    return { products: [], error: error.message }
  }

  return { products: data || [], error: null }
}

export async function getProductById(id: string) {
  const supabase = await createClient()

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const userId = session?.user?.id

  if (!userId) {
    return { product: null, error: "Not authenticated" }
  }

  // Fetch the product
  const { data, error } = await supabase.from("products").select("*").eq("id", id).eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching product:", error)
    return { product: null, error: error.message }
  }

  return { product: data, error: null }
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient()

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const userId = session?.user?.id

  if (!userId) {
    return { success: false, error: "Not authenticated" }
  }

  // Check if the product belongs to the user
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single()

  if (productError || !product) {
    console.error("Error fetching product:", productError)
    return { success: false, error: "Product not found or access denied" }
  }

  // Extract form data
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = formData.get("price") ? Number.parseFloat(formData.get("price") as string) : null
  const template = formData.get("template") as string
  const published = formData.get("published") === "true"

  // Update the product
  const { error } = await supabase
    .from("products")
    .update({
      name,
      description,
      price,
      template,
      published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", userId)

  if (error) {
    console.error("Error updating product:", error)
    return { success: false, error: error.message }
  }

  // Revalidate the products page and the specific product page
  revalidatePath("/dashboard/products")
  revalidatePath(`/dashboard/products/${id}/edit`)

  return { success: true, error: null }
}

export async function deleteProduct(id: string) {
  console.log(`[DELETE PRODUCT] Starting deletion process for product ID: ${id}`)
  const supabase = await createClient()
  const logs: string[] = []

  const log = (message: string, data?: any) => {
    const logMessage = data ? `${message}: ${JSON.stringify(data)}` : message
    console.log(`[DELETE PRODUCT] ${logMessage}`)
    logs.push(logMessage)
    return logMessage
  }

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const userId = session?.user?.id
  console.log(`[GET USER PRODUCTS] User ID: ${userId}`)

  if (!userId) {
    log("Not authenticated")
    return { success: false, error: "Not authenticated", logs }
  }

  log(`Starting deletion process for product ID: ${id}`)

  try {
    // First, get basic product info without joins to confirm it exists
    log(`Fetching basic product info`)
    const { data: basicProduct, error: basicProductError } = await supabase
    .from("products")
      .select(`id, name, domain_id, subdomain`)
    .eq("id", id)
    .eq("user_id", userId)
    .single()

    if (basicProductError) {
      log(`Error fetching basic product`, basicProductError)
      return { success: false, error: "Product not found or access denied", logs }
    }

    log(`Found product`, basicProduct)

    // If the product has a domain_id, get domain info separately
    let domainInfo = null
    if (basicProduct.domain_id) {
      log(`Product has domain_id: ${basicProduct.domain_id}, fetching domain info`)
      const { data: domain, error: domainError } = await supabase
        .from("domains")
        .select(`id, subdomain, analytics_id`)
        .eq("id", basicProduct.domain_id)
        .single()

      if (domainError) {
        log(`Error fetching domain`, domainError)
      } else {
        domainInfo = domain
        log(`Found domain`, domainInfo)
      }
    } else if (basicProduct.subdomain) {
      log(`Product has subdomain: ${basicProduct.subdomain}, fetching domain by subdomain`)
      const { data: domain, error: domainError } = await supabase
        .from("domains")
        .select(`id, subdomain, analytics_id`)
        .eq("subdomain", basicProduct.subdomain)
        .single()

      if (domainError) {
        log(`Error fetching domain by subdomain`, domainError)
      } else {
        domainInfo = domain
        log(`Found domain by subdomain`, domainInfo)
      }
  }

    // Delete the product first
    log(`Deleting product record`)
    const { error: deleteProductError } = await supabase
      .from("products")
      .delete()
      .eq("id", id)
      .eq("user_id", userId)

    if (deleteProductError) {
      log(`Error deleting product`, deleteProductError)
      return { success: false, error: deleteProductError.message, logs }
    }

    log(`Product record deleted successfully`)

    // If we found domain info, delete the domain
    if (domainInfo) {
      log(`Deleting domain with ID: ${domainInfo.id}`)
      const { error: deleteDomainError } = await supabase
        .from("domains")
        .delete()
        .eq("id", domainInfo.id)
        .eq("user_id", userId)

      if (deleteDomainError) {
        log(`Error deleting domain`, deleteDomainError)
        // Continue anyway since the product is already deleted
      } else {
        log(`Domain record deleted successfully`)
      }

      // Delete Umami analytics if exists
      if (domainInfo.analytics_id) {
        log(`Deleting Umami website for analytics_id: ${domainInfo.analytics_id}`)
        try {
          if (!domainInfo.analytics_id) {
            log('No analytics_id found, skipping Umami deletion')
          } else {
            log(`Calling deleteUmamiWebsite with ID: ${domainInfo.analytics_id}`)
            const result = await deleteUmamiWebsite(domainInfo.analytics_id)
            log(`Umami deletion result`, result)
          }
        } catch (error) {
          log(`Error deleting Umami website`, error)
          // Continue anyway since this is just cleanup
        }
      } else {
        log('No analytics_id found for this domain, skipping Umami deletion')
      }
  }

  // Revalidate the products page
    log(`Revalidating paths`)
  revalidatePath("/dashboard/products")
    revalidatePath("/dashboard")
    
    log(`Process completed successfully`)
    return { success: true, logs }
  } catch (error) {
    log(`Unexpected error in delete process`, error)
    return { success: false, error: "An unexpected error occurred", logs }
  }
}

// Add the missing toggleProductPublished function after the deleteProduct function

export async function toggleProductPublished(id: string, published: boolean) {
  const supabase = await createClient()

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const userId = session?.user?.id

  if (!userId) {
    return { success: false, error: "Not authenticated" }
  }

  // Check if the product belongs to the user
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single()

  if (productError || !product) {
    console.error("Error fetching product:", productError)
    return { success: false, error: "Product not found or access denied" }
  }

  // Update the product's published status
  const { error } = await supabase
    .from("products")
    .update({
      published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", userId)

  if (error) {
    console.error("Error updating product published status:", error)
    return { success: false, error: error.message }
  }

  // Revalidate the products page and the specific product page
  revalidatePath("/dashboard/products")
  revalidatePath(`/dashboard/products/${id}/edit`)

  return { success: true, error: null }
}
