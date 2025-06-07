"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TemplateEditor } from "@/app/[lng]/dashboard/new/components/template-editor";
import { TemplateControls } from "@/components/templates/template-controls";
import { useAuth } from "@/contexts/auth-context";
import { TemplateProvider } from "@/contexts/template-context";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Icons } from "@/app/components/dashboard/icons";
import { defaultTemplateData } from "@/contexts/template-context";
import { updateProductTemplateData } from "@/app/[lng]/dashboard/products/actions";

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!user) return;

      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("products")
          .select(`
            id,
            slug,
            template,
            published,
            hero_title,
            hero_tagline,
            hero_description,
            hero_cta_text,
            hero_cta_url,
            hero_image_url,
            about_title,
            about_description,
            about_image_url,
            about_features,
            why_choose_title,
            why_choose_subtitle,
            why_choose_benefits,
            features_title,
            features_subtitle,
            features_items,
            pricing_title,
            pricing_subtitle,
            pricing_currency,
            pricing_plans,
            faq_title,
            faq_subtitle,
            faq_items,
            testimonials,
            brand_name,
            brand_logo_url,
            theme_primary_color,
            theme_secondary_color,
            navbar_logo_url,
            navbar_title,
            navbar_links,
            navbar_sticky,
            navbar_transparent
          `)
          .eq("id", params.id)
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching product:", error);
          setError("Failed to load product");
          return;
        }

        if (!data) {
          setError("Product not found");
          return;
        }

        // Construct template data from individual columns
        const templateData = {
          navbar: {
            logo: data.navbar_logo_url || "",
            title: data.navbar_title || "",
            links: data.navbar_links || [],
            sticky: data.navbar_sticky || false,
            transparent: data.navbar_transparent || false,
          },
          hero: {
            title: data.hero_title || "",
            tagline: data.hero_tagline || "",
            description: data.hero_description || "",
            cta: {
              text: data.hero_cta_text || "",
              url: data.hero_cta_url || "",
            },
            image: data.hero_image_url || "",
          },
          about: {
            title: data.about_title || "",
            description: data.about_description || "",
            image: data.about_image_url || "",
            features: data.about_features || [],
          },
          whyChoose: {
            title: data.why_choose_title || "",
            subtitle: data.why_choose_subtitle || "",
            benefits: data.why_choose_benefits || [],
          },
          features: {
            title: data.features_title || "",
            subtitle: data.features_subtitle || "",
            items: data.features_items || [],
          },
          pricing: {
            title: data.pricing_title || "",
            subtitle: data.pricing_subtitle || "",
            currency: data.pricing_currency || "$",
            plans: data.pricing_plans || [],
          },
          faq: {
            title: data.faq_title || "",
            subtitle: data.faq_subtitle || "",
            items: data.faq_items || [],
          },
          testimonials: data.testimonials || [],
          brand: {
            name: data.brand_name || "",
            logo: data.brand_logo_url || "",
          },
          theme: {
            primaryColor: data.theme_primary_color || "#6F4E37",
            secondaryColor: data.theme_secondary_color || "#ECB176",
          },
        };

        setProduct({
          ...data,
          template_data: templateData, // For backward compatibility with existing components
        });
      } catch (err) {
        console.error("Error:", err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [user, params.id]);

  // Handle the case where user is not authenticated
  if (!user) {
    return null;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Error</h1>
          <p className="text-muted-foreground">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
            onClick={() => router.push("/dashboard")}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // If product is loaded, show the editor
  return (
    <TemplateProvider
      initialTemplateData={product.template_data || defaultTemplateData}
      productId={params.id}
      updateFunction={updateProductTemplateData}
    >
      <div className="min-h-screen bg-background">
        <TemplateEditor initialTemplate={product.template || "modern"} isEditMode={true} />
        <TemplateControls />
      </div>
    </TemplateProvider>
  );
} 