"use client"

import { useState, useRef } from "react"
import { toPng } from "html-to-image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ModernTemplate } from "@/components/templates/modern-template"
import { PremiumTemplate } from "@/components/templates/premium-template"
import { ClassicTemplate } from "@/components/templates/classic-template"
import { GalleryTemplate } from "@/components/templates/gallery-template"
import { MinimalTemplate } from "@/components/templates/minimal-template"
import { ShowcaseTemplate } from "@/components/templates/showcase-template"
import { MultiProductTemplate } from "@/components/templates/multi-product-template"
import { MultiProductGridTemplate } from "@/components/templates/multi-product-grid-template"
import { MultiProductCatalogTemplate } from "@/components/templates/multi-product-catalog-template"
import { Separator } from "@/components/ui/separator"

// Sample product data with real images
const sampleProduct = {
  name: "Premium Wireless Headphones",
  description:
    "Experience crystal-clear sound with our Premium Wireless Headphones. Featuring the latest Bluetooth technology, active noise cancellation, and up to 30 hours of battery life.",
  price: "99.99",
  features:
    "Active Noise Cancellation\n30-hour Battery Life\nBluetooth 5.2\nComfortable Over-ear Design\nBuilt-in Microphone\nQuick Charge (5 min charge = 3 hours playback)",
  color: "#6F4E37",
  accentColor: "#ECB176",
  subdomain: "headphones",
  category: "electronics",
  // Using actual headphone images
  images: [
    { type: "url", src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e" },
    { type: "url", src: "https://images.unsplash.com/photo-1577174881658-0f30ed549adc" },
    { type: "url", src: "https://images.unsplash.com/photo-1546435770-a3e426bf472b" },
    { type: "url", src: "https://images.unsplash.com/photo-1583394838336-acd977736f90" },
  ],
}

// Sample multi-product data
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

type TemplateType =
  | "modern"
  | "premium"
  | "classic"
  | "gallery"
  | "minimal"
  | "showcase"
  | "multi-product"
  | "multi-product-grid"
  | "multi-product-catalog"

type GeneratedImage = {
  template: TemplateType
  dataUrl: string
}

export default function TemplatePreviewGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [images, setImages] = useState<GeneratedImage[]>([])
  const templateRefs = {
    modern: useRef<HTMLDivElement>(null),
    premium: useRef<HTMLDivElement>(null),
    classic: useRef<HTMLDivElement>(null),
    gallery: useRef<HTMLDivElement>(null),
    minimal: useRef<HTMLDivElement>(null),
    showcase: useRef<HTMLDivElement>(null),
    "multi-product": useRef<HTMLDivElement>(null),
    "multi-product-grid": useRef<HTMLDivElement>(null),
    "multi-product-catalog": useRef<HTMLDivElement>(null),
  }

  const generateTemplatePreview = async (template: TemplateType) => {
    try {
      const element = templateRefs[template].current
      if (!element) return null

      // Add some delay to ensure images are properly loaded
      await new Promise((resolve) => setTimeout(resolve, 500))

      const dataUrl = await toPng(element, {
        cacheBust: true,
        width: 800,
        height: 600,
        pixelRatio: 1,
      })

      return { template, dataUrl }
    } catch (error) {
      console.error(`Error generating preview for ${template}:`, error)
      return null
    }
  }

  const generateAllPreviews = async () => {
    setIsGenerating(true)
    const templates: TemplateType[] = [
      "modern",
      "premium",
      "classic",
      "gallery",
      "minimal",
      "showcase",
      "multi-product",
      "multi-product-grid",
      "multi-product-catalog",
    ]
    const generatedImages: GeneratedImage[] = []

    for (const template of templates) {
      const result = await generateTemplatePreview(template)
      if (result) generatedImages.push(result)
    }

    setImages(generatedImages)
    setIsGenerating(false)
  }

  const generateMultiProductPreview = async () => {
    setIsGenerating(true)
    const multiProductTemplates: TemplateType[] = ["multi-product", "multi-product-grid", "multi-product-catalog"]
    const generatedImages: GeneratedImage[] = []

    for (const template of multiProductTemplates) {
      const result = await generateTemplatePreview(template)
      if (result) generatedImages.push(result)
    }

    setImages(generatedImages)
    setIsGenerating(false)
  }

  const downloadImage = (template: string, dataUrl: string) => {
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = `${template}-template-preview.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Template Preview Generator</h1>
        <div className="flex gap-4">
          <Button
            onClick={generateMultiProductPreview}
            disabled={isGenerating}
            className="bg-[#A67B5B] hover:bg-[#6F4E37] text-white"
          >
            {isGenerating ? "Generating..." : "Generate All Multi-Product Previews"}
          </Button>
          <Button
            onClick={generateAllPreviews}
            disabled={isGenerating}
            className="bg-[#ECB176] hover:bg-[#A67B5B] text-[#6F4E37]"
          >
            {isGenerating ? "Generating..." : "Generate All Template Previews"}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 mb-12">
        {/* Display generated images */}
        {images.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Previews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image) => (
                  <div key={image.template} className="border rounded-md p-2">
                    <h3 className="font-medium capitalize mb-2">
                      {image.template === "multi-product" ? "Multi-Product Template" : `${image.template} Template`}
                    </h3>
                    <div className="relative aspect-[4/3] mb-2">
                      <img
                        src={image.dataUrl || "/placeholder.svg"}
                        alt={`${image.template} template preview`}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <Button
                      size="sm"
                      onClick={() => downloadImage(image.template, image.dataUrl)}
                      variant="outline"
                      className="w-full"
                    >
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Template render areas (hidden but used for image generation) */}
        <div className="space-y-8">
          <Separator />
          <h2 className="text-xl font-bold">Template Renders (Used for Generation)</h2>
          <p className="text-muted-foreground">
            These templates are rendered below and captured as images when you click the generate button.
          </p>

          <div className="hidden">
            <h3 className="text-lg font-medium mb-2">Modern Template</h3>
            <div ref={templateRefs.modern} className="w-[800px] h-[600px] overflow-hidden">
              <ModernTemplate product={sampleProduct} />
            </div>

            <h3 className="text-lg font-medium mb-2">Premium Template</h3>
            <div ref={templateRefs.premium} className="w-[800px] h-[600px] overflow-hidden">
              <PremiumTemplate product={sampleProduct} />
            </div>

            <h3 className="text-lg font-medium mb-2">Classic Template</h3>
            <div ref={templateRefs.classic} className="w-[800px] h-[600px] overflow-hidden">
              <ClassicTemplate product={sampleProduct} />
            </div>

            <h3 className="text-lg font-medium mb-2">Gallery Template</h3>
            <div ref={templateRefs.gallery} className="w-[800px] h-[600px] overflow-hidden">
              <GalleryTemplate product={sampleProduct} />
            </div>

            <h3 className="text-lg font-medium mb-2">Minimal Template</h3>
            <div ref={templateRefs.minimal} className="w-[800px] h-[600px] overflow-hidden">
              <MinimalTemplate product={sampleProduct} />
            </div>

            <h3 className="text-lg font-medium mb-2">Showcase Template</h3>
            <div ref={templateRefs.showcase} className="w-[800px] h-[600px] overflow-hidden">
              <ShowcaseTemplate product={sampleProduct} />
            </div>

            <h3 className="text-lg font-medium mb-2">Multi-Product Template</h3>
            <div ref={templateRefs["multi-product"]} className="w-[800px] h-[600px] overflow-hidden">
              <MultiProductTemplate product={sampleMultiProducts} />
            </div>

            <h3 className="text-lg font-medium mb-2">Multi-Product Grid Template</h3>
            <div ref={templateRefs["multi-product-grid"]} className="w-[800px] h-[600px] overflow-hidden">
              <MultiProductGridTemplate product={sampleMultiProducts} />
            </div>

            <h3 className="text-lg font-medium mb-2">Multi-Product Catalog Template</h3>
            <div ref={templateRefs["multi-product-catalog"]} className="w-[800px] h-[600px] overflow-hidden">
              <MultiProductCatalogTemplate product={sampleMultiProducts} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
