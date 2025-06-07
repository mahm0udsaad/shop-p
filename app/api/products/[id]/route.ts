import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const supabase = await createClient();
    
    // Verify user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get request body
    const body = await request.json();
    
    // Verify user owns this product
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, user_id')
      .eq('id', productId)
      .single();
      
    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    if (product.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Update product
    const updateData: Record<string, any> = {};
    
    // Only allow specific fields to be updated
    if (body.template_data) {
      // Map template data to individual columns
      const templateData = body.template_data;
      
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
    }
    
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }
    
    const { error: updateError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', productId);
      
    if (updateError) {
      console.error('Error updating product:', updateError);
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Product updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in product update API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 