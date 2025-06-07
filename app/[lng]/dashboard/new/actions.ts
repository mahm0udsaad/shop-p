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

    // Parse JSON objects from formData - these now come from the frontend
    const parsedFaq = JSON.parse(formData.get("faq") as string || "[]")
    const parsedSeo = JSON.parse(formData.get("seo") as string || "{}")
    const parsedBrand = JSON.parse(formData.get("brand") as string || "{}")
    const parsedMedia = JSON.parse(formData.get("media") as string || '{"images": [], "video": ""}')
    const parsedCallToAction = JSON.parse(formData.get("callToAction") as string || '{"text": "", "url": ""}')
    const parsedTestimonials = JSON.parse(formData.get("testimonials") as string || "[]")
    
    // Parse template data if provided (for advanced users)
    const parsedTemplateData = formData.get("templateData") ? JSON.parse(formData.get("templateData") as string) : null
    
    // Debug: Log the parsed template data
    console.log("Parsed template data:", parsedTemplateData)
    
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

    // Parse pricing data from frontend
    const parsedPricing = JSON.parse(formData.get("pricing") as string || '{"plans": []}')
    
    // Use template data from frontend if provided, otherwise use defaults
    const templateData = parsedTemplateData ? {
      // Merge provided template data with any missing defaults
      navbar: parsedTemplateData.navbar || {
        title: name,
        logo: parsedBrand?.logo || "",
        links: [
          { text: "Home", url: "#" },
          { text: "Features", url: "#features" },
          { text: "Pricing", url: "#pricing" },
          { text: "Contact", url: "#", isButton: true }
        ],
        sticky: true,
        transparent: false
      },
      hero: parsedTemplateData.hero || {
        title: name,
        tagline: tagline || `A compelling tagline for ${name}`,
        description: description,
        cta: parsedCallToAction?.text && parsedCallToAction?.url 
          ? parsedCallToAction 
          : { text: "Get Started", url: "#pricing" },
        image: parsedMedia?.images?.[0] || ""
      },
      about: parsedTemplateData.about || {
        title: `About ${name}`,
        description: description,
        image: parsedMedia?.images?.[1] || "",
        features: featuresArray.slice(0, 4)
      },
      whyChoose: parsedTemplateData.whyChoose || {
        title: "Why Choose Us",
        subtitle: "Discover the benefits that set us apart",
        benefits: benefitsArray
      },
      features: parsedTemplateData.features || {
        title: "Features",
        subtitle: "Everything you need to succeed",
        items: featureItems
      },
      pricing: parsedTemplateData.pricing || {
        title: parsedPricing?.title || "Pricing Plans",
        subtitle: parsedPricing?.subtitle || "Choose the perfect plan for you",
        currency: parsedPricing?.currency || "$",
        plans: parsedPricing?.plans || []
      },
      faq: parsedTemplateData.faq || {
        title: "Frequently Asked Questions",
        subtitle: "Find answers to common questions",
        items: parsedFaq
      },
      testimonials: parsedTemplateData.testimonials || parsedTestimonials,
      media: parsedTemplateData.media || parsedMedia,
      brand: parsedTemplateData.brand || {
        name: parsedBrand?.name || name,
        contactEmail: parsedBrand?.contactEmail || "",
        socialLinks: parsedBrand?.socialLinks || {}
      },
      theme: parsedTemplateData.theme || {
        primaryColor: primaryColor,
        secondaryColor: secondaryColor,
        fontFamily: "Inter, sans-serif"
      },
      footer: parsedTemplateData.footer || `© ${new Date().getFullYear()} ${name}. All rights reserved.`,
      customFields: parsedTemplateData.customFields || {}
    } : {
      navbar: {
        title: name,
        logo: parsedBrand?.logo || "",
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
        features: featuresArray.slice(0, 4)
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
        title: parsedPricing?.title || "Pricing Plans",
        subtitle: parsedPricing?.subtitle || "Choose the perfect plan for you",
        currency: parsedPricing?.currency || "$",
        plans: parsedPricing?.plans || [
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
      testimonials: parsedTestimonials,
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

    // Debug: Log the final template data structure
    console.log("Final template data structure:", {
      hero: templateData.hero,
      pricing: templateData.pricing,
      navbar: templateData.navbar,
      brand: templateData.brand
    })

    // Prepare data for product creation with structured columns
    const productData = {
      product_type: "single",
      published: true,
      template,
      user_id: userId || user?.id,
      slug: subdomain,
      
      // Hero section - use data from templateData
      hero_title: templateData.hero?.title || name,
      hero_tagline: templateData.hero?.tagline || tagline || `A compelling tagline for ${name}`,
      hero_description: templateData.hero?.description || description,
      hero_cta_text: templateData.hero?.cta?.text || parsedCallToAction?.text || "Get Started",
      hero_cta_url: templateData.hero?.cta?.url || parsedCallToAction?.url || "#pricing",
      hero_image_url: templateData.hero?.image || parsedMedia?.images?.[0] || null,
      
      // About section
      about_title: templateData.about?.title || `About ${name}`,
      about_description: templateData.about?.description || description,
      about_image_url: templateData.about?.image || parsedMedia?.images?.[1] || null,
      about_features: templateData.about?.features || featuresArray.slice(0, 4),
      
      // Why Choose section
      why_choose_title: templateData.whyChoose?.title || "Why Choose Us",
      why_choose_subtitle: templateData.whyChoose?.subtitle || "Discover the benefits that set us apart",
      why_choose_benefits: templateData.whyChoose?.benefits || benefitsArray,
      
      // Features section
      features_title: templateData.features?.title || "Features",
      features_subtitle: templateData.features?.subtitle || "Everything you need to succeed",
      features_items: templateData.features?.items || featureItems,
      
      // Pricing section
      pricing_title: templateData.pricing?.title || "Pricing Plans",
      pricing_subtitle: templateData.pricing?.subtitle || "Choose the perfect plan for you",
      pricing_currency: templateData.pricing?.currency || "$",
      pricing_plans: templateData.pricing?.plans || [],
      
      // FAQ section
      faq_title: templateData.faq?.title || "Frequently Asked Questions",
      faq_subtitle: templateData.faq?.subtitle || "Find answers to common questions",
      faq_items: templateData.faq?.items || parsedFaq,
      
      // Testimonials
      testimonials: templateData.testimonials || parsedTestimonials,
      
      // Brand
      brand_name: templateData.brand?.name || parsedBrand?.name || name,
      brand_logo_url: templateData.brand?.logo || parsedBrand?.logo || null,
      
      // Theme
      theme_primary_color: templateData.theme?.primaryColor || primaryColor,
      theme_secondary_color: templateData.theme?.secondaryColor || secondaryColor,
      
      // Navbar
      navbar_title: templateData.navbar?.title || name,
      navbar_logo_url: templateData.navbar?.logo || parsedBrand?.logo || null,
      navbar_links: templateData.navbar?.links || [
        { text: "Home", url: "#" },
        { text: "Features", url: "#features" },
        { text: "Pricing", url: "#pricing" },
        { text: "Contact", url: "#", isButton: true }
      ],
      navbar_sticky: templateData.navbar?.sticky ?? true,
      navbar_transparent: templateData.navbar?.transparent ?? false,
    }

    // Log the processed product data
    console.log("Processed product data:", { ...productData, template_data: "STRUCTURED COLUMNS" })

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