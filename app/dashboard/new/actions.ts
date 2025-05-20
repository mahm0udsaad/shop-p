"use server"

import { createUmamiWebsite } from "@/app/actions/umami"
import { createClient } from "@/lib/supabase/server"


export async function createProduct(formData: FormData, userId?: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // If no session and no userId provided, return error
    if (!user && !userId) {
      throw new Error("Authentication required")
    }  

    // Extract basic product information
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const tagline = formData.get("tagline") as string
    const subdomain = formData.get("domain") as string
    const primaryColor = formData.get("color") as string
    const secondaryColor = formData.get("accentColor") as string
    const template = formData.get("template") as string || "modern"
    
    // Validate required fields with more detailed error messages
    const missingFields = []
    if (!name) missingFields.push("name")
    if (!description) missingFields.push("description")
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

    // Parse JSON objects from formData
    const parsedFaq = JSON.parse(formData.get("faq") as string || "[]")
    const parsedSeo = JSON.parse(formData.get("seo") as string || "{}")
    const parsedBrand = JSON.parse(formData.get("brand") as string || "{}")
    const parsedMedia = JSON.parse(formData.get("media") as string || '{"images": [], "video": ""}')
    const parsedCallToAction = JSON.parse(formData.get("callToAction") as string || '{"text": "", "url": ""}')
    
    // Convert features string to array with proper structure
    const featuresString = formData.get("features") as string
    const featuresArray = featuresString
      ? featuresString.split("\n").filter(feature => feature.trim() !== "")
      : []
    
    // Parse features into structured items
    const featureItems = featuresArray.map(feature => {
      const parts = feature.split(':')
      const title = parts[0]?.trim() || "Feature"
      const description = parts.length > 1 ? parts.slice(1).join(':').trim() : "Feature description"
      return { title, description, icon: "" }
    })

    // Convert benefits string to array with proper structure
    const benefitsString = formData.get("benefits") as string
    const benefitsArray = benefitsString
      ? benefitsString.split("\n").filter(benefit => benefit.trim() !== "")
      : []

    // Build the complete TemplateData structure for the modern template
    const templateData = {
      navbar: {
        title: name,
        logo: "",
        links: [
          { text: "Home", url: "#" },
          { text: "Features", url: "#features" },
          { text: "Pricing", url: "#pricing" },
          { text: "Contact", url: "#", isButton: true }
        ],
        sticky: true,
        transparent: false
      },
      hero: {
        title: name,
        tagline: tagline || `A compelling tagline for ${name}`,
        description: description,
        cta: parsedCallToAction?.text && parsedCallToAction?.url 
          ? parsedCallToAction 
          : { text: "Get Started", url: "#pricing" },
        image: parsedMedia?.images?.[0] || ""
      },
      about: {
        title: `About ${name}`,
        description: description,
        image: parsedMedia?.images?.[1] || "",
        features: featuresArray.slice(0, 4) // Use first 4 features for about section
      },
      whyChoose: {
        title: "Why Choose Us",
        subtitle: "Discover the benefits that set us apart",
        benefits: benefitsArray
      },
      features: {
        title: "Features",
        subtitle: "Everything you need to succeed",
        items: featureItems
      },
      pricing: {
        title: "Pricing Plans",
        subtitle: "Choose the perfect plan for you",
        currency: "$",
        plans: [
          {
            name: "Basic",
            price: 9,
            period: "month",
            features: featuresArray.slice(0, 3),
            isFeatured: false
          },
          {
            name: "Pro",
            price: 19,
            period: "month",
            features: featuresArray.slice(0, 5),
            isFeatured: true
          },
          {
            name: "Enterprise",
            price: 49,
            period: "month",
            features: featuresArray,
            isFeatured: false
          }
        ]
      },
      faq: {
        title: "Frequently Asked Questions",
        subtitle: "Find answers to common questions",
        items: parsedFaq
      },
      testimonials: JSON.parse(formData.get("testimonials") as string || "[]"),
      media: parsedMedia,
      brand: {
        name: parsedBrand?.name || name,
        contactEmail: parsedBrand?.contactEmail || "",
        socialLinks: parsedBrand?.socialLinks || {}
      },
      theme: {
        primaryColor: primaryColor,
        secondaryColor: secondaryColor,
        fontFamily: "Inter, sans-serif"
      },
      footer: `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
      customFields: {}
    }

    // Prepare data for product creation
    const productData = {
      product_type: "single",
      published: true,
      template,
      user_id: userId || user?.id,
      slug: subdomain,
      template_data: {
        ...templateData,
        hero: {
          ...templateData.hero,
          tagline: tagline || `A compelling tagline for ${name}`,
        },
        theme: {
          ...templateData.theme,
          primaryColor: primaryColor,
          secondaryColor: secondaryColor,
        },
        seo: parsedSeo
      },
    }

    // Log the processed product data
    console.log("Processed product data:", { ...productData, template_data: "LARGE OBJECT" })

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
    
    // Update the product with the domain_id
    const { error: updateError } = await supabase
      .from("products")
      .update({ domain_id: domain.id })
      .eq("id", product.id)
    
    if (updateError) {
      console.error("Error updating product with domain_id:", updateError)
      // Non-critical error, continue with product creation
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

    return { success: true, domain: subdomain, productType: "single" }
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  } 
}