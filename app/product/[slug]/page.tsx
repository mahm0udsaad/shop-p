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
      .select("*")
      .eq("slug", identifier)
      .eq("published", true)
      .single()

    if (product) {
      console.log(`Found product by slug: ${product.name}`);
      console.log('Template data:', JSON.stringify(product.template_data).slice(0, 150) + '...');
      
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

      // Create properly formatted landingPageData
      const landingPageData = {
        product: {
          id: product.id,
          name: product.name,
          tagline: product.tagline || "",
          description: product.description || "",
          features: Array.isArray(product.features) ? product.features : [],
          benefits: product.benefits || "",
          price: {
            currency: product.currency || "USD",
            monthly: null,
            yearly: Number(product.price) || 0,
            discountNote: ""
          },
          media: product.template_data?.media || {
            images: images || [],
            video: product.media?.video || ""
          },
          testimonials: product.template_data?.testimonials || [],
          callToAction: product.template_data?.callToAction || { text: "", url: "" },
          faq: product.template_data?.faq || []
        },
        brand: product.template_data?.brand || {
          name: product.brand?.name || "",
          logo: product.brand?.logo || "",
          contactEmail: product.brand?.contactEmail || "",
          socialLinks: product.brand?.socialLinks || {
            twitter: "",
            linkedin: "",
            facebook: ""
          }
        },
        seo: product.template_data?.seo || {
          title: product.name,
          description: product.description,
          keywords: [],
          image: images[0] || ""
        },
        theme: product.template_data?.theme || {
          primaryColor: product.color || "#3A86FF",
          secondaryColor: product.accent_color || "#FF006E"
        }
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
      console.log('Domain template data:', JSON.stringify(product.template_data).slice(0, 150) + '...');
      
      // Domain-based product found
      if (domainData.type === "single") {
        const { product, template, brand, theme } = domainData;
        
        // Create properly formatted landingPageData
        const landingPageData = {
          product: {
            id: product.id,
            name: product.name,
            tagline: product.tagline || "",
            description: product.description || "",
            features: Array.isArray(product.features) ? product.features : [],
            benefits: product.benefits || "",
            price: {
              currency: product.currency || "USD",
              monthly: null,
              yearly: Number(product.price) || 0,
              discountNote: ""
            },
            media: product.template_data?.media || {
              images: Array.isArray(product.media?.images) ? product.media.images : [],
              video: product.media?.video || ""
            },
            testimonials: product.template_data?.testimonials || [],
            callToAction: product.template_data?.callToAction || { text: "", url: "" },
            faq: product.template_data?.faq || []
          },
          brand: product.template_data?.brand || {
            name: brand?.name || "",
            logo: brand?.logo || "",
            contactEmail: brand?.contactEmail || "",
            socialLinks: brand?.socialLinks || {
              twitter: "",
              linkedin: "",
              facebook: ""
            }
          },
          seo: product.template_data?.seo || {
            title: product.name,
            description: product.description,
            keywords: [],
            image: ""
          },
          theme: product.template_data?.theme || {
            primaryColor: theme?.primaryColor || product.color || "#3A86FF",
            secondaryColor: theme?.secondaryColor || product.accent_color || "#FF006E"
          }
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
              product: {
                id: store.id,
                name: store.name || "",
                tagline: store.tagline || "",
                description: store.description || "",
                features: [],
                benefits: store.about || "",
                price: { currency: "USD", monthly: null, yearly: null, discountNote: "" },
                media: { images: [], video: "" },
                testimonials: [],
                callToAction: { text: "View Products", url: "#products" },
                faq: []
              },
              brand: {
                name: store.name || "",
                logo: "",
                contactEmail: store.contact_email || "",
                socialLinks: { twitter: "", linkedin: "", facebook: "" }
              },
              seo: {
                title: store.name || "",
                description: store.description || "",
                keywords: [],
                image: ""
              },
              theme: {
                primaryColor: theme?.primaryColor || store.color || "#3A86FF",
                secondaryColor: theme?.secondaryColor || store.accent_color || "#FF006E"
              }
            }} />
          case "multi-product-grid":
            // Same fallback approach
            return <ModernTemplate landingPageData={{
              product: {
                id: store.id,
                name: store.name || "",
                tagline: store.tagline || "",
                description: store.description || "",
                features: [],
                benefits: store.about || "",
                price: { currency: "USD", monthly: null, yearly: null, discountNote: "" },
                media: { images: [], video: "" },
                testimonials: [],
                callToAction: { text: "View Products", url: "#products" },
                faq: []
              },
              brand: {
                name: store.name || "",
                logo: "",
                contactEmail: store.contact_email || "",
                socialLinks: { twitter: "", linkedin: "", facebook: "" }
              },
              seo: {
                title: store.name || "",
                description: store.description || "",
                keywords: [],
                image: ""
              },
              theme: {
                primaryColor: theme?.primaryColor || store.color || "#3A86FF",
                secondaryColor: theme?.secondaryColor || store.accent_color || "#FF006E"
              }
            }} />
          case "multi-product-catalog":
            // Same fallback approach
            return <ModernTemplate landingPageData={{
              product: {
                id: store.id,
                name: store.name || "",
                tagline: store.tagline || "",
                description: store.description || "",
                features: [],
                benefits: store.about || "",
                price: { currency: "USD", monthly: null, yearly: null, discountNote: "" },
                media: { images: [], video: "" },
                testimonials: [],
                callToAction: { text: "View Products", url: "#products" },
                faq: []
              },
              brand: {
                name: store.name || "",
                logo: "",
                contactEmail: store.contact_email || "",
                socialLinks: { twitter: "", linkedin: "", facebook: "" }
              },
              seo: {
                title: store.name || "",
                description: store.description || "",
                keywords: [],
                image: ""
              },
              theme: {
                primaryColor: theme?.primaryColor || store.color || "#3A86FF",
                secondaryColor: theme?.secondaryColor || store.accent_color || "#FF006E"
              }
            }} />
          default:
            // Same fallback approach
            return <ModernTemplate landingPageData={{
              product: {
                id: store.id,
                name: store.name || "",
                tagline: store.tagline || "",
                description: store.description || "",
                features: [],
                benefits: store.about || "",
                price: { currency: "USD", monthly: null, yearly: null, discountNote: "" },
                media: { images: [], video: "" },
                testimonials: [],
                callToAction: { text: "View Products", url: "#products" },
                faq: []
              },
              brand: {
                name: store.name || "",
                logo: "",
                contactEmail: store.contact_email || "",
                socialLinks: { twitter: "", linkedin: "", facebook: "" }
              },
              seo: {
                title: store.name || "",
                description: store.description || "",
                keywords: [],
                image: ""
              },
              theme: {
                primaryColor: theme?.primaryColor || store.color || "#3A86FF",
                secondaryColor: theme?.secondaryColor || store.accent_color || "#FF006E"
              }
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