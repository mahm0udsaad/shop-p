"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { nanoid } from "nanoid"

// Helper function to generate slug
async function generateUniqueSlug(name: string, supabase: any): Promise<string> {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens

  // Check if slug exists
  const { data: existingProduct } = await supabase
    .from("products")
    .select("slug")
    .eq("slug", baseSlug)
    .single()

  if (!existingProduct) {
    return baseSlug
  }

  // If slug exists, append a unique identifier
  return `${baseSlug}-${nanoid(6)}`
}

export async function createProduct(formData: FormData, userId?: string) {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

  // If no session and no userId provided, return error
  if (!session && !userId) {
      throw new Error("Authentication required")
    }

    // Convert features string to array
    const featuresString = formData.get("features") as string
    const featuresArray = featuresString
      ? featuresString.split("\n").filter(feature => feature.trim() !== "")
      : []

    // Convert benefits string to array
    const benefitsString = formData.get("benefits") as string
    const benefitsArray = benefitsString
      ? benefitsString.split("\n").filter(benefit => benefit.trim() !== "")
      : []

    const name = formData.get("name") as string
    const productData = {
          name,
      description: formData.get("description") as string,
      price: formData.get("price") as string,
      currency: "USD",
      template: formData.get("template") as string || "modern",
      product_type: "single",
          published: true,
      featured: false,
      features: featuresArray,
      benefits: benefitsArray,
      color: formData.get("color") as string,
      accent_color: formData.get("accentColor") as string,
      subdomain: formData.get("domain") as string,
      user_id: userId || session?.user?.id,
      slug: formData.get("domain"),
      tagline: formData.get("tagline") as string,
          template_data: {
        faq: JSON.parse(formData.get("faq") as string || "[]"),
        seo: JSON.parse(formData.get("seo") as string || "{}"),
        brand: JSON.parse(formData.get("brand") as string || "{}"),
        media: JSON.parse(formData.get("media") as string || '{"images": [], "video": ""}'),
        colors: JSON.parse(formData.get("colors") as string || "[]"),
        sizes: JSON.parse(formData.get("sizes") as string || "[]"),
        testimonials: JSON.parse(formData.get("testimonials") as string || "[]"),
        callToAction: JSON.parse(formData.get("callToAction") as string || '{"text": "", "url": ""}'),
        theme: {
          primaryColor: formData.get("color") as string,
          secondaryColor: formData.get("accentColor") as string
        }
      }
    }

    // Log the processed product data
    console.log("Processed product data:", productData)

    // Validate required fields with more detailed error messages
    const missingFields = []
    if (!productData.name) missingFields.push("name")
    if (!productData.description) missingFields.push("description")
    if (!productData.subdomain) missingFields.push("domain")

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`)
    }

    // Create the product
    const { data: product, error: productError } = await supabase
          .from("products")
      .insert([productData])
          .select()
      .single()

        if (productError) {
      throw new Error(productError.message)
    }

    // Create the domain entry
    const { error: domainError } = await supabase
      .from("domains")
      .insert([
        {
          subdomain: productData.subdomain,
          user_id: productData.user_id,
          is_active: true,
        },
      ])

    if (domainError) {
      // If domain creation fails, delete the product
      await supabase.from("products").delete().eq("id", product.id)
      throw new Error(domainError.message)
    }

    revalidatePath("/dashboard")
    redirect("/dashboard")
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  }
}
