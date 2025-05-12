"use server"

import { createUmamiWebsite } from "@/app/actions/umami"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"


export async function createProduct(formData: FormData, userId?: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // If no session and no userId provided, return error
    if (!user && !userId) {
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
    const subdomain = formData.get("domain") as string
    
    // Validate required fields with more detailed error messages
    const missingFields = []
    if (!name) missingFields.push("name")
    if (!formData.get("description")) missingFields.push("description")
    if (!subdomain) missingFields.push("domain")

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`)
    }
    
    // Create analytics website in Umami
    let analyticsId: string | null = null
    let shareId: string | null = null
    
    try {
      const fullDomain = `${subdomain}.shipfaster.tech`
      const umamiWebsite = await createUmamiWebsite(name, fullDomain)
      console.log("Umami website created:", umamiWebsite)
      if (umamiWebsite) {
        analyticsId = umamiWebsite.id
      }
    } catch (analyticsError) {
      console.error("Error setting up analytics:", analyticsError)
    }

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
      subdomain,
      user_id: userId || user?.id,
      slug: subdomain,
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
    const { data: domain, error: domainError } = await supabase
      .from("domains")
      .insert([
        {
          subdomain,
          user_id: productData.user_id,
          is_active: true,
          analytics_id: analyticsId,
          analytics_share_id: shareId
        },
      ])
      .select()
      .single()

    if (domainError) {
      // If domain creation fails, delete the product
      await supabase.from("products").delete().eq("id", product.id)
      throw new Error(domainError.message)
    }

    // Also save analytics tracking info in a separate table for easier querying
    if (analyticsId) {
      const { error: trackingError } = await supabase
        .from("analytics_tracking")
        .insert([{
          subdomain,
          product_id: product.id,
          user_id: productData.user_id,
          tracking_id: analyticsId,
          share_id: shareId,
          created_at: new Date().toISOString()
        }])

      if (trackingError) {
        console.error("Error saving analytics tracking info:", trackingError)
        // Non-critical error, continue with product creation
      }
    }

    revalidatePath("/dashboard")
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  } finally {
    redirect("/dashboard")
  }
}