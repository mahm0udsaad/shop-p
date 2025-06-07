import { notFound } from "next/navigation"
import { ModernTemplate } from "@/components/templates/modern-template"
import { PremiumTemplate } from "@/components/templates/premium-template"
import { ClassicTemplate } from "@/components/templates/classic-template"
import { GalleryTemplate } from "@/components/templates/gallery-template"
import { MinimalTemplate } from "@/components/templates/minimal-template"
import { ShowcaseTemplate } from "@/components/templates/showcase-template"
import { MultiProductTemplate } from "@/components/templates/multi-product-template"
import { MultiProductGridTemplate } from "@/components/templates/multi-product-grid-template"
import { MultiProductCatalogTemplate } from "@/components/templates/multi-product-catalog-template"
import { samplePreviewData } from "../sample-data"

const templateComponents = {
  modern: ModernTemplate,
  premium: PremiumTemplate,
  classic: ClassicTemplate,
  gallery: GalleryTemplate,
  minimal: MinimalTemplate,
  showcase: ShowcaseTemplate,
  "multi-product": MultiProductTemplate,
  "multi-product-grid": MultiProductGridTemplate,
  "multi-product-catalog": MultiProductCatalogTemplate,
}

export default function TemplatePreviewPage({ params }: { params: { template: string } }) {
  const { template } = params

  if (!templateComponents[template as keyof typeof templateComponents]) {
    notFound()
  }

  const TemplateComponent = templateComponents[template as keyof typeof templateComponents]

  // For multi-product templates, we need to use a different data structure
  if (template === "multi-product" || template === "multi-product-grid" || template === "multi-product-catalog") {
    const sampleMultiProducts = {
      storeName: "Tech Gadgets Store",
      storeDescription: "Your one-stop shop for the latest tech gadgets and accessories.",
      color: "#6F4E37",
      accentColor: "#ECB176",
      subdomain: "techgadgets",
      heroImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      products: [
        {
          id: "1",
          name: "Premium Wireless Headphones",
          description: "Experience crystal-clear sound with our Premium Wireless Headphones.",
          price: "99.99",
          category: "Audio",
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        },
        {
          id: "2",
          name: "Smart Watch Pro",
          description: "Track your fitness and stay connected with Smart Watch Pro.",
          price: "149.99",
          category: "Wearables",
          image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12",
        },
        {
          id: "3",
          name: "Portable Bluetooth Speaker",
          description: "Take your music anywhere with this waterproof Bluetooth speaker.",
          price: "79.99",
          category: "Audio",
          image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1",
        },
        {
          id: "4",
          name: "Wireless Charging Pad",
          description: "Fast wireless charging for all Qi-compatible devices.",
          price: "29.99",
          category: "Accessories",
          image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c",
        },
      ],
      categories: ["All", "Audio", "Wearables", "Accessories"],
    }

    return (
      <div className="min-h-screen">
        <TemplateComponent product={sampleMultiProducts} />
      </div>
    )
  }

  // For single product templates, use the standardized landingPageData
  return (
    <div className="min-h-screen">
      <TemplateComponent landingPageData={samplePreviewData} />
    </div>
  )
}
