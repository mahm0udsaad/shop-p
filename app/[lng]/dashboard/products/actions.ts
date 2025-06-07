"use server"

import { createClient } from "@/lib/supabase/server";
import { deleteProduct as baseDeleteProduct } from "@/app/actions/product";
import type { Database } from "@/lib/database.types";

// Update product details
export async function updateProduct(productId: string, formData: FormData) {
  try {
    const supabase = await createClient();
    // Build update object from formData
    const updateData: Partial<Database["public"]["Tables"]["products"]["Update"]> = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: formData.get("price") ? Number(formData.get("price")) : undefined,
      template: formData.get("template") as string,
      published: formData.get("published") === "true",
    };
    // Remove undefined fields
    Object.keys(updateData).forEach(
      (key) => updateData[key as keyof typeof updateData] === undefined && delete updateData[key as keyof typeof updateData]
    );
    const { error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", productId);
    if (error) {
      return { error: error.message };
    }
    return { success: true };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

// Update product template data
export async function updateProductTemplateData(productId: string, templateData: any) {
  try {
    const supabase = await createClient();
    
    // Get current user to ensure they own the product
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: "Unauthorized" };
    }
    
    // Check if user owns this product
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, user_id")
      .eq("id", productId)
      .eq("user_id", user.id)
      .single();
      
    if (productError || !product) {
      return { error: "Product not found or access denied" };
    }
    
    // Map template data to individual columns
    const updateData: any = {};
    
    // Hero section
    if (templateData.hero) {
      updateData.hero_title = templateData.hero.title || '';
      updateData.hero_tagline = templateData.hero.tagline || '';
      updateData.hero_description = templateData.hero.description || '';
      updateData.hero_cta_text = templateData.hero.cta?.text || '';
      updateData.hero_cta_url = templateData.hero.cta?.url || '';
      updateData.hero_image_url = templateData.hero.image || null;
    }
    
    // About section
    if (templateData.about) {
      updateData.about_title = templateData.about.title || '';
      updateData.about_description = templateData.about.description || '';
      updateData.about_image_url = templateData.about.image || null;
      updateData.about_features = templateData.about.features || [];
    }
    
    // Why Choose section
    if (templateData.whyChoose) {
      updateData.why_choose_title = templateData.whyChoose.title || '';
      updateData.why_choose_subtitle = templateData.whyChoose.subtitle || '';
      updateData.why_choose_benefits = templateData.whyChoose.benefits || [];
    }
    
    // Features section
    if (templateData.features) {
      updateData.features_title = templateData.features.title || '';
      updateData.features_subtitle = templateData.features.subtitle || '';
      updateData.features_items = templateData.features.items || [];
    }
    
    // Pricing section
    if (templateData.pricing) {
      updateData.pricing_title = templateData.pricing.title || '';
      updateData.pricing_subtitle = templateData.pricing.subtitle || '';
      updateData.pricing_currency = templateData.pricing.currency || '$';
      updateData.pricing_plans = templateData.pricing.plans || [];
    }
    
    // FAQ section
    if (templateData.faq) {
      updateData.faq_title = templateData.faq.title || '';
      updateData.faq_subtitle = templateData.faq.subtitle || '';
      updateData.faq_items = templateData.faq.items || [];
    }
    
    // Testimonials
    if (templateData.testimonials) {
      updateData.testimonials = templateData.testimonials || [];
    }
    
    // Brand
    if (templateData.brand) {
      updateData.brand_name = templateData.brand.name || '';
      updateData.brand_logo_url = templateData.brand.logo || null;
    }
    
    // Theme
    if (templateData.theme) {
      updateData.theme_primary_color = templateData.theme.primaryColor || '#6F4E37';
      updateData.theme_secondary_color = templateData.theme.secondaryColor || '#ECB176';
    }
    
    // Navbar
    if (templateData.navbar) {
      updateData.navbar_logo_url = templateData.navbar.logo || null;
      updateData.navbar_title = templateData.navbar.title || null;
      updateData.navbar_links = templateData.navbar.links || [];
      updateData.navbar_sticky = templateData.navbar.sticky || false;
      updateData.navbar_transparent = templateData.navbar.transparent || false;
    }
    
    // Update the product with structured data
    const { error: updateError } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", productId);
      
    if (updateError) {
      console.error("Error updating product template:", updateError);
      return { error: updateError.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error in updateProductTemplateData:", error);
    return { error: (error as Error).message };
  }
}

// Toggle published status
export async function toggleProductPublished(productId: string, published: boolean) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("products")
      .update({ published })
      .eq("id", productId);
    if (error) {
      return { error: error.message };
    }
    return { success: true };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

// Upload image to Supabase storage
export async function uploadImageToStorage(formData: FormData) {
  try {
    const supabase = await createClient();
    
    // Get current user to ensure they're authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: "Unauthorized" };
    }
    
    const file = formData.get("file") as File;
    if (!file) {
      return { error: "No file provided" };
    }
    
    // Validate file type
    if (!file.type.startsWith("image/")) {
      return { error: "File must be an image" };
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return { error: "File size must be less than 5MB" };
    }
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false
      });
    
    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { error: uploadError.message };
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);
    
    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("Error in uploadImageToStorage:", error);
    return { error: (error as Error).message };
  }
}

// Re-export deleteProduct
export const deleteProduct = baseDeleteProduct; 