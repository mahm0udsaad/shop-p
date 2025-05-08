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
function getProductIdentifier(params: { slug: string }) {
  // Get the request headers
  const headersList = headers();
  const host = headersList.get('host') || '';
  const xSubdomain = headersList.get('x-subdomain');
  
  // First check if we have an x-subdomain header (set by middleware)
  if (xSubdomain) {
    console.log(`Using x-subdomain header: ${xSubdomain}`);
    return xSubdomain;
  }
  
  // Then check if we're on a subdomain
  if (host.includes('.shipfaster.tech') && !host.startsWith('www.') && !host.startsWith('shipfaster.')) {
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
  const identifier = getProductIdentifier(params);
  
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
  const identifier = getProductIdentifier(params);
  
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

      // Render the appropriate template
      const templateProps = {
        product: {
          ...product,
          images,
        },
      }

      switch (product.template) {
        case "classic":
          return <ClassicTemplate {...templateProps} />
        case "modern":
          return <ModernTemplate {...templateProps} />
        case "minimal":
          return <MinimalTemplate {...templateProps} />
        case "premium":
          return <PremiumTemplate {...templateProps} />
        case "gallery":
          return <GalleryTemplate {...templateProps} />
        case "showcase":
          return <ShowcaseTemplate {...templateProps} />
        default:
          return <ClassicTemplate {...templateProps} />
      }
    }

    // If product not found directly, check if it's a domain-mapped showcase
    const { data: domainData, error: domainError } = await supabase.rpc("get_product_showcase", { domain_name: identifier })

    if (domainData && !domainData.error) {
      console.log(`Found product via domain mapping: ${identifier}`);
      
      // Domain-based product found
      if (domainData.type === "single") {
        const { product, template, brand, theme } = domainData

        // Select the template component based on the template name
        switch (template) {
          case "classic":
            return <ClassicTemplate product={product} brand={brand} theme={theme} />
          case "modern":
            return <ModernTemplate product={product} brand={brand} theme={theme} />
          case "premium":
            return <PremiumTemplate product={product} brand={brand} theme={theme} />
          case "showcase":
            return <ShowcaseTemplate product={product} brand={brand} theme={theme} />
          case "gallery":
            return <GalleryTemplate product={product} brand={brand} theme={theme} />
          case "minimal":
            return <MinimalTemplate product={product} brand={brand} theme={theme} />
          default:
            return <ModernTemplate product={product} brand={brand} theme={theme} />
        }
      } else {
        // Multi-product store
        const { store, products, template, theme } = domainData

        switch (template) {
          case "multi-product":
            return <MultiProductTemplate store={store} products={products} theme={theme} />
          case "multi-product-grid":
            return <MultiProductGridTemplate store={store} products={products} theme={theme} />
          case "multi-product-catalog":
            return <MultiProductCatalogTemplate store={store} products={products} theme={theme} />
          default:
            return <MultiProductTemplate store={store} products={products} theme={theme} />
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