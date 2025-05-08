"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { Database } from "@/lib/database.types"

export async function getUserProducts() {
  const supabase = createServerActionClient<Database>({ cookies })

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
  const supabase = createServerActionClient<Database>({ cookies })

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
  const supabase = createServerActionClient<Database>({ cookies })

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
  const supabase = createServerActionClient<Database>({ cookies })

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

  // Delete the product
  const { error } = await supabase.from("products").delete().eq("id", id).eq("user_id", userId)

  if (error) {
    console.error("Error deleting product:", error)
    return { success: false, error: error.message }
  }

  // Revalidate the products page
  revalidatePath("/dashboard/products")

  // Redirect to the products page
  redirect("/dashboard/products")
}

// Add the missing toggleProductPublished function after the deleteProduct function

export async function toggleProductPublished(id: string, published: boolean) {
  const supabase = createServerActionClient<Database>({ cookies })

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
