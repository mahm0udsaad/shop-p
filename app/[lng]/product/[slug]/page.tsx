import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies, headers } from "next/headers"
import { notFound } from "next/navigation"
import type { Metadata, ResolvingMetadata } from "next"

// Import template components
import { ClassicTemplate } from "@/components/templates/classic-template"
import { ModernTemplate } from "@/components/templates/modern-template"
import { PremiumTemplate } from "@/components/templates/premium-template"
import { ShowcaseTemplate } from "@/components/templates/showcase-template"
import { GalleryTemplate } from "@/components/templates/gallery-template"
import { MinimalTemplate } from "@/components/templates/minimal-template"
import { MultiProductTemplate } from "@/components/templates/multi-product-template"
import { MultiProductGridTemplate } from "@/components/templates/multi-product-grid-template"
import { MultiProductCatalogTemplate } from "@/components/templates/multi-product-catalog-template"

interface ProductPageProps {
  params: {
    slug: string
  }
}

// Helper function to get subdomain or slug from request
async function getProductIdentifier(params: { slug: string }) {
  // Get the request headers
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const xSubdomain = headersList.get('x-subdomain');
  
  // First check if we have an x-subdomain header (set by middleware)
  if (xSubdomain) {
    console.log(`Using x-subdomain header: ${xSubdomain}`);
    return xSubdomain;
  }
  
  // Then check if we're on a subdomain
  if (host.includes('.productshowcase.com') && !host.startsWith('www.') && !host.startsWith('productshowcase.')) {
    const subdomain = host.split('.')[0];
    console.log(`Detected subdomain from host: ${subdomain}`);
    return subdomain;
  }
  
  // Otherwise use the slug from the URL params
  console.log(`Using URL slug parameter: ${params.slug}`);
  return params.slug;
}

export async function generateMetadata({ params }: ProductPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  // Get the product identifier (slug or subdomain)
  const identifier = await getProductIdentifier(params);
  
  // Initialize Supabase client
  const supabase = createServerComponentClient({ cookies })

  try {
    // Log what we're looking for
    console.log(`Generating metadata for product identifier: ${identifier}`);
    
    // Try to fetch by product slug directly
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("slug", identifier)
      .eq("published", true)
      .single()

    if (product) {
      return {
        title: `${product.name} | Product Showcase`,
        description: product.description || `View details about ${product.name}`,
      }
    }

    // If not found directly, might be a domain-mapped product
    const { data: domainData } = await supabase.rpc("get_product_showcase", { domain_name: identifier })

    if (domainData && !domainData.error) {
      // Domain-based product found
      if (domainData.type === "single") {
        const seo = domainData.seo || {}
        return {
          title: seo.title || domainData.product.name,
          description: seo.description || domainData.product.description,
          openGraph: {
            images: seo.image ? [seo.image] : [],
          },
        }
      } else {
        return {
          title: domainData.store.name,
          description: domainData.store.description,
        }
      }
    }

    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Product Showcase",
      description: "View our product showcase",
    }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Get the product identifier (slug or subdomain)
  const identifier = await getProductIdentifier(params);
  
  // Log what we're looking for
  console.log(`Rendering product page for identifier: ${identifier}`);

  // Initialize Supabase client
  const supabase = createServerComponentClient({ cookies })

  try {
    // First try to fetch by product slug directly
    const { data: product, error: productError } = await supabase
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
      .eq("slug", identifier)
      .eq("published", true)
      .single()

    if (product) {
      console.log(`Found product by slug: ${product.hero_title || 'Untitled Product'}`);
      console.log('Product data loaded from structured columns');
      
      // Get product images
      const { data: productImages } = await supabase.storage.from("product-images").list(product.id, {
        sortBy: { column: "created_at", order: "desc" },
      })

      // Get image URLs
      const images = productImages
        ? productImages.map((file) => {
            const {
              data: { publicUrl },
            } = supabase.storage.from("product-images").getPublicUrl(`${product.id}/${file.name}`)

            return publicUrl
          })
        : []

      // Construct template data from individual columns
      const landingPageData = {
        navbar: {
          logo: product.navbar_logo_url || "",
          title: product.navbar_title || product.hero_title || "",
          links: product.navbar_links || [
            { text: "Home", url: "#" },
            { text: "Features", url: "#features" },
            { text: "Pricing", url: "#pricing" },
            { text: "Contact", url: "#", isButton: true }
          ],
          sticky: product.navbar_sticky || false,
          transparent: product.navbar_transparent || false,
        },
        hero: {
          title: product.hero_title || "",
          tagline: product.hero_tagline || "",
          description: product.hero_description || "",
          cta: {
            text: product.hero_cta_text || "Get Started",
            url: product.hero_cta_url || "#pricing",
          },
          image: product.hero_image_url || "",
        },
        about: {
          title: product.about_title || "",
          description: product.about_description || "",
          image: product.about_image_url || "",
          features: product.about_features || [],
        },
        whyChoose: {
          title: product.why_choose_title || "",
          subtitle: product.why_choose_subtitle || "",
          benefits: product.why_choose_benefits || [],
        },
        features: {
          title: product.features_title || "",
          subtitle: product.features_subtitle || "",
          items: product.features_items || [],
        },
        pricing: {
          title: product.pricing_title || "",
          subtitle: product.pricing_subtitle || "",
          currency: product.pricing_currency || "$",
          plans: product.pricing_plans || [],
        },
        faq: {
          title: product.faq_title || "",
          subtitle: product.faq_subtitle || "",
          items: product.faq_items || [],
        },
        testimonials: product.testimonials || [],
        brand: {
          name: product.brand_name || "",
          logo: product.brand_logo_url || "",
        },
        theme: {
          primaryColor: product.theme_primary_color || "#6F4E37",
          secondaryColor: product.theme_secondary_color || "#ECB176",
        },
      };

      // Render the appropriate template
      switch (product.template) {
        case "classic":
          return <ClassicTemplate landingPageData={landingPageData} />
        case "modern":
          return <ModernTemplate landingPageData={landingPageData} />
        case "minimal":
          return <MinimalTemplate landingPageData={landingPageData} />
        case "premium":
          return <PremiumTemplate landingPageData={landingPageData} />
        case "gallery":
          return <GalleryTemplate landingPageData={landingPageData} />
        case "showcase":
          return <ShowcaseTemplate landingPageData={landingPageData} />
        default:
          return <ClassicTemplate landingPageData={landingPageData} />
      }
    }

    // If product not found directly, check if it's a domain-mapped showcase
    const { data: domainData, error: domainError } = await supabase.rpc("get_product_showcase", { domain_name: identifier })

    if (domainData && !domainData.error) {
      console.log(`Found product via domain mapping: ${identifier}`);
      console.log('Domain data loaded from database function');
      
      // Domain-based product found
      if (domainData.type === "single") {
        const { product, template, brand, theme } = domainData;
        
        // The database function should already return structured data
        // Create properly formatted landingPageData for templates
        const landingPageData = {
          navbar: {
            logo: brand?.logo || "",
            title: product.name || "",
            links: [
              { text: "Home", url: "#" },
              { text: "Features", url: "#features" },
              { text: "Pricing", url: "#pricing" },
              { text: "Contact", url: "#", isButton: true }
            ],
            sticky: false,
            transparent: false,
          },
          hero: {
            title: product.name || "",
            tagline: product.tagline || "",
            description: product.description || "",
            cta: {
              text: "Get Started",
              url: "#pricing",
            },
            image: "",
          },
          about: {
            title: `About ${product.name}`,
            description: product.description || "",
            image: "",
            features: Array.isArray(product.features) ? product.features : [],
          },
          whyChoose: {
            title: "Why Choose Us",
            subtitle: "Discover the benefits that set us apart",
            benefits: [],
          },
          features: {
            title: "Features",
            subtitle: "Everything you need to succeed",
            items: [],
          },
          pricing: {
            title: "Pricing Plans",
            subtitle: "Choose the perfect plan for you",
              currency: product.currency || "USD",
            plans: product.price ? [{
              name: "Standard",
              price: Number(product.price) || 0,
              period: "month",
              features: Array.isArray(product.features) ? product.features : [],
              isFeatured: true
            }] : [],
          },
          faq: {
            title: "Frequently Asked Questions",
            subtitle: "Find answers to common questions",
            items: [],
          },
          testimonials: product.testimonials || [],
          brand: {
            name: brand?.name || product.name || "",
            logo: brand?.logo || "",
          },
          theme: {
            primaryColor: theme?.primaryColor || product.color || "#3A86FF",
            secondaryColor: theme?.secondaryColor || product.accent_color || "#FF006E",
          },
        };

        // Select the template component based on the template name
        switch (template) {
          case "classic":
            return <ClassicTemplate landingPageData={landingPageData} />
          case "modern":
            return <ModernTemplate landingPageData={landingPageData} />
          case "premium":
            return <PremiumTemplate landingPageData={landingPageData} />
          case "showcase":
            return <ShowcaseTemplate landingPageData={landingPageData} />
          case "gallery":
            return <GalleryTemplate landingPageData={landingPageData} />
          case "minimal":
            return <MinimalTemplate landingPageData={landingPageData} />
          default:
            return <ModernTemplate landingPageData={landingPageData} />
        }
      } else {
        // Multi-product store
        const { store, products, template, theme } = domainData

        // Create properly formatted store data
        const storeData = {
          store: {
            name: store.name || "",
            description: store.description || "",
            about: store.about || "",
            tagline: store.tagline || "",
            category: store.category || "",
            footerContent: store.footer_content || "",
            contactEmail: store.contact_email || "",
            color: store.color || "#3A86FF",
            accentColor: store.accent_color || "#FF006E"
          },
          products: products || [],
          theme: {
            primaryColor: theme?.primaryColor || store.color || "#3A86FF",
            secondaryColor: theme?.secondaryColor || store.accent_color || "#FF006E"
          }
        };

        switch (template) {
          case "multi-product":
            // Return a fallback to a single product template if multi-product template isn't ready
            return <ModernTemplate landingPageData={{
              navbar: {
                logo: "",
                title: store.name || "",
                links: [
                  { text: "Home", url: "#" },
                  { text: "Products", url: "#products" },
                  { text: "About", url: "#about" },
                  { text: "Contact", url: "#", isButton: true }
                ],
                sticky: false,
                transparent: false,
              },
              hero: {
                title: store.name || "",
                tagline: store.tagline || "",
                description: store.description || "",
                cta: { text: "View Products", url: "#products" },
                image: "",
              },
              about: {
                title: `About ${store.name}`,
                description: store.about || store.description || "",
                image: "",
                features: [],
              },
              whyChoose: {
                title: "Why Choose Us",
                subtitle: "Discover what makes us special",
                benefits: [],
              },
              features: {
                title: "Our Products",
                subtitle: "Explore our collection",
                items: [],
              },
              pricing: {
                title: "Products",
                subtitle: "Browse our offerings",
                currency: "USD",
                plans: [],
              },
              faq: {
                title: "FAQ",
                subtitle: "Frequently Asked Questions",
                items: [],
              },
              testimonials: [],
              brand: {
                name: store.name || "",
                logo: "",
              },
              theme: {
                primaryColor: theme?.primaryColor || store.color || "#3A86FF",
                secondaryColor: theme?.secondaryColor || store.accent_color || "#FF006E",
              },
            }} />
          case "multi-product-grid":
            // Same fallback approach
            return <ModernTemplate landingPageData={{
              navbar: {
                logo: "",
                title: store.name || "",
                links: [
                  { text: "Home", url: "#" },
                  { text: "Products", url: "#products" },
                  { text: "About", url: "#about" },
                  { text: "Contact", url: "#", isButton: true }
                ],
                sticky: false,
                transparent: false,
              },
              hero: {
                title: store.name || "",
                tagline: store.tagline || "",
                description: store.description || "",
                cta: { text: "View Products", url: "#products" },
                image: "",
              },
              about: {
                title: `About ${store.name}`,
                description: store.about || store.description || "",
                image: "",
                features: [],
              },
              whyChoose: {
                title: "Why Choose Us",
                subtitle: "Discover what makes us special",
                benefits: [],
              },
              features: {
                title: "Our Products",
                subtitle: "Explore our collection",
                items: [],
              },
              pricing: {
                title: "Products",
                subtitle: "Browse our offerings",
                currency: "USD",
                plans: [],
              },
              faq: {
                title: "FAQ",
                subtitle: "Frequently Asked Questions",
                items: [],
              },
              testimonials: [],
              brand: {
                name: store.name || "",
                logo: "",
              },
              theme: {
                primaryColor: theme?.primaryColor || store.color || "#3A86FF",
                secondaryColor: theme?.secondaryColor || store.accent_color || "#FF006E",
              },
            }} />
          case "multi-product-catalog":
            // Same fallback approach
            return <ModernTemplate landingPageData={{
              navbar: {
                logo: "",
                title: store.name || "",
                links: [
                  { text: "Home", url: "#" },
                  { text: "Products", url: "#products" },
                  { text: "About", url: "#about" },
                  { text: "Contact", url: "#", isButton: true }
                ],
                sticky: false,
                transparent: false,
              },
              hero: {
                title: store.name || "",
                tagline: store.tagline || "",
                description: store.description || "",
                cta: { text: "View Products", url: "#products" },
                image: "",
              },
              about: {
                title: `About ${store.name}`,
                description: store.about || store.description || "",
                image: "",
                features: [],
              },
              whyChoose: {
                title: "Why Choose Us",
                subtitle: "Discover what makes us special",
                benefits: [],
              },
              features: {
                title: "Our Products",
                subtitle: "Explore our collection",
                items: [],
              },
              pricing: {
                title: "Products",
                subtitle: "Browse our offerings",
                currency: "USD",
                plans: [],
              },
              faq: {
                title: "FAQ",
                subtitle: "Frequently Asked Questions",
                items: [],
              },
              testimonials: [],
              brand: {
                name: store.name || "",
                logo: "",
              },
              theme: {
                primaryColor: theme?.primaryColor || store.color || "#3A86FF",
                secondaryColor: theme?.secondaryColor || store.accent_color || "#FF006E",
              },
            }} />
          default:
            // Same fallback approach
            return <ModernTemplate landingPageData={{
              navbar: {
                logo: "",
                title: store.name || "",
                links: [
                  { text: "Home", url: "#" },
                  { text: "Products", url: "#products" },
                  { text: "About", url: "#about" },
                  { text: "Contact", url: "#", isButton: true }
                ],
                sticky: false,
                transparent: false,
              },
              hero: {
                title: store.name || "",
                tagline: store.tagline || "",
                description: store.description || "",
                cta: { text: "View Products", url: "#products" },
                image: "",
              },
              about: {
                title: `About ${store.name}`,
                description: store.about || store.description || "",
                image: "",
                features: [],
              },
              whyChoose: {
                title: "Why Choose Us",
                subtitle: "Discover what makes us special",
                benefits: [],
              },
              features: {
                title: "Our Products",
                subtitle: "Explore our collection",
                items: [],
              },
              pricing: {
                title: "Products",
                subtitle: "Browse our offerings",
                currency: "USD",
                plans: [],
              },
              faq: {
                title: "FAQ",
                subtitle: "Frequently Asked Questions",
                items: [],
              },
              testimonials: [],
              brand: {
                name: store.name || "",
                logo: "",
              },
              theme: {
                primaryColor: theme?.primaryColor || store.color || "#3A86FF",
                secondaryColor: theme?.secondaryColor || store.accent_color || "#FF006E",
              },
            }} />
        }
      }
    }

    console.error(`No product found for identifier: ${identifier}`);
    // If we get here, nothing was found
    notFound()
  } catch (error) {
    console.error("Error fetching product data:", error)
    notFound()
  }
}