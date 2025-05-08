"use client"

import { ClassicTemplate } from "./templates/classic-template"
import { GalleryTemplate } from "./templates/gallery-template"
import { MinimalTemplate } from "./templates/minimal-template"
import { ModernTemplate } from "./templates/modern-template"
import { PremiumTemplate } from "./templates/premium-template"
import { ShowcaseTemplate } from "./templates/showcase-template"
import { MultiProductTemplate } from "./templates/multi-product-template"
import { MultiProductGridTemplate } from "./templates/multi-product-grid-template"
import { MultiProductCatalogTemplate } from "./templates/multi-product-catalog-template"
import { LandingPageData } from "@/types/landing-page-types"

interface PreviewDeviceProps {
  deviceType: "mobile" | "desktop"
  templateType: string
  productData: any
  productType?: "single" | "multi"
  multiProductsData?: any[]
  storeData?: any
}

export function PreviewDevice({
  deviceType,
  templateType,
  productData,
  productType = "single",
  multiProductsData = [],
  storeData = {},
}: PreviewDeviceProps) {
  const isMobile = deviceType === "mobile"

  // Determine if we're using a multi-product template
  const isMultiProduct = productType === "multi" || templateType.startsWith("multi-product")

  // Set the appropriate width and height based on device type
  const deviceWidth = isMobile ? "w-[375px]" : "w-full max-w-[1024px]"
  const deviceHeight = isMobile ? "h-[667px]" : "h-[600px]"

  // Prepare default product data to avoid null errors
  const defaultProductData = {
    name: "Sample Product",
    description: "This is a sample product description.",
    price: "99.99",
    features: ["Feature 1", "Feature 2", "Feature 3"],
    benefits: ["Benefit 1", "Benefit 2", "Benefit 3"],
    color: "#6F4E37",
    accentColor: "#ECB176",
    subdomain: "sample-product",
    images: [{ type: "image", src: "/diverse-products-still-life.png" }],
    sizes: [],
    productColors: [],
    testimonials: [],
    faq: [],
    callToAction: {
      text: "Get Started",
      url: "#"
    }
  }

  // Use provided product data or default if null/undefined
  const safeLandingPageData: LandingPageData = productData
    ? {
        product: {
          name: productData.name || defaultProductData.name,
          tagline: productData.tagline || "Your perfect product",
          description: productData.description || defaultProductData.description,
          features: Array.isArray(productData.features) ? productData.features : defaultProductData.features,
          benefits: Array.isArray(productData.benefits) ? productData.benefits : defaultProductData.benefits,
          price: {
            currency: productData.price?.currency || "USD",
            monthly: productData.price?.monthly || null,
            yearly: productData.price?.yearly || null,
            discountNote: productData.price?.discountNote || ""
          },
          media: {
            images: Array.isArray(productData.media?.images) 
              ? productData.media.images.map((img: { src?: string } | string) => typeof img === 'string' ? img : img.src || "")
              : defaultProductData.images.map((img: { src?: string } | string) => typeof img === 'string' ? img : img.src || ""),
            video: productData.media?.video || ""
          },
          testimonials: Array.isArray(productData.testimonials) ? productData.testimonials : defaultProductData.testimonials,
          callToAction: {
            text: productData.callToAction?.text || defaultProductData.callToAction.text,
            url: productData.callToAction?.url || defaultProductData.callToAction.url
          },
          faq: Array.isArray(productData.faq) ? productData.faq : defaultProductData.faq
        },
        brand: {
          name: productData.brand?.name || "Your Brand",
          logo: productData.brand?.logo || "",
          contactEmail: productData.brand?.contactEmail || "",
          socialLinks: {
            twitter: productData.brand?.socialLinks?.twitter || "",
            linkedin: productData.brand?.socialLinks?.linkedin || "",
            facebook: productData.brand?.socialLinks?.facebook || ""
          }
        },
        seo: {
          title: productData.seo?.title || `${productData.name || defaultProductData.name} - Your Brand`,
          description: productData.seo?.description || productData.description || defaultProductData.description,
          keywords: Array.isArray(productData.seo?.keywords) ? productData.seo.keywords : [],
          image: productData.seo?.image || ""
        },
        theme: {
          primaryColor: productData.color || defaultProductData.color,
          secondaryColor: productData.accentColor || defaultProductData.accentColor
        }
      }
    : {
        product: {
          name: defaultProductData.name,
          tagline: "Your perfect product",
          description: defaultProductData.description,
          features: defaultProductData.features,
          benefits: defaultProductData.benefits,
          price: {
            currency: "USD",
            monthly: null,
            yearly: null,
            discountNote: ""
          },
          media: {
            images: defaultProductData.images.map((img: { src?: string } | string) => typeof img === 'string' ? img : img.src || ""),
            video: ""
          },
          testimonials: defaultProductData.testimonials,
          callToAction: defaultProductData.callToAction,
          faq: defaultProductData.faq
        },
        brand: {
          name: "Your Brand",
          logo: "",
          contactEmail: "",
          socialLinks: {
            twitter: "",
            linkedin: "",
            facebook: ""
          }
        },
        seo: {
          title: `${defaultProductData.name} - Your Brand`,
          description: defaultProductData.description,
          keywords: [],
          image: ""
        },
        theme: {
          primaryColor: defaultProductData.color,
          secondaryColor: defaultProductData.accentColor
        }
      }

  // Ensure multiProductsData is an array with at least one product
  const safeMultiProductsData =
    Array.isArray(multiProductsData) && multiProductsData.length > 0
      ? multiProductsData.map((product) => ({
          ...defaultProductData,
          ...product,
          images:
            product.images && product.images.length > 0
              ? product.images
              : [{ type: "image", src: "/diverse-products-still-life.png" }],
        }))
      : [defaultProductData]

  // Ensure storeData is an object with required fields
  const safeStoreData = {
    name: "Sample Store",
    description: "This is a sample store description.",
    category: "electronics",
    tagline: "Quality products for everyone",
    about: "About our store...",
    footerContent: "© 2023 Sample Store",
    contactEmail: "contact@example.com",
    color: "#6F4E37",
    accentColor: "#ECB176",
    ...storeData,
  }

  // Format data for multi-product templates
  const multiProductTemplateData = {
    name: safeStoreData.name,
    description: safeStoreData.description,
    color: safeStoreData.color || "#6F4E37",
    accentColor: safeStoreData.accentColor || "#ECB176",
    storeName: safeStoreData.name,
    storeDescription: safeStoreData.description,
    products: safeMultiProductsData,
    images: safeMultiProductsData.map(
      (product) => product.images?.[0] || { type: "image", src: "/diverse-products-still-life.png" },
    ),
  }

  // Render the appropriate template based on the template type
  const renderTemplate = () => {
    // For multi-product templates
    if (isMultiProduct) {
      switch (templateType) {
        case "multi-product":
          return <MultiProductTemplate product={multiProductTemplateData} />
        case "multi-product-grid":
          return <MultiProductGridTemplate product={multiProductTemplateData} />
        case "multi-product-catalog":
          return <MultiProductCatalogTemplate product={multiProductTemplateData} />
        default:
          return <MultiProductTemplate product={multiProductTemplateData} />
      }
    }

    // For single product templates
    switch (templateType) {
      case "classic":
        return <ClassicTemplate landingPageData={safeLandingPageData} />
      case "gallery":
        return <GalleryTemplate landingPageData={safeLandingPageData} />
      case "minimal":
        return <MinimalTemplate landingPageData={safeLandingPageData} />
      case "modern":
        return <ModernTemplate landingPageData={safeLandingPageData} />
      case "premium":
        return <PremiumTemplate landingPageData={safeLandingPageData} />
      case "showcase":
        return <ShowcaseTemplate landingPageData={safeLandingPageData} />
      default:
        return <ModernTemplate landingPageData={safeLandingPageData} />
    }
  }

  return (
    <div
      className={`border rounded-lg overflow-hidden bg-white ${deviceWidth}`}
      key={JSON.stringify({
        productType,
        templateType,
        productData: productData?.name || "default",
        multiProductsData: multiProductsData?.length || 0,
        storeData: storeData?.name || "default",
      })}
    >
      <div className="bg-gray-100 p-2 border-b flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-400"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
        <div className="w-3 h-3 rounded-full bg-green-400"></div>
        <div className="text-xs text-gray-500 ml-2">{isMobile ? "Mobile Preview" : "Desktop Preview"}</div>
      </div>
      <div className={`overflow-y-auto ${deviceHeight}`}>{renderTemplate()}</div>
    </div>
  )
}