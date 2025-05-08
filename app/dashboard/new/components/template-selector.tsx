"use client"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface TemplateSelectorProps {
  selectedTemplate: string
  setSelectedTemplate: (template: string) => void
  productType: "single" | "multi"
}

export function TemplateSelector({ selectedTemplate, setSelectedTemplate, productType }: TemplateSelectorProps) {
  // Define templates based on product type
  const templates =
    productType === "single"
      ? [
          {
            id: "modern",
            name: "Modern",
            description: "A clean, modern design with focus on product details",
            image: "/images/templates/modern-template-preview.png",
            badge: "Popular",
          },
          {
            id: "premium",
            name: "Premium",
            description: "Elegant design for luxury products with rich visuals",
            image: "/images/templates/premium-template-preview.png",
            badge: "Premium",
          },
          {
            id: "classic",
            name: "Classic",
            description: "Traditional e-commerce layout with all essential elements",
            image: "/images/templates/classic-template-preview.png",
          },
          {
            id: "gallery",
            name: "Gallery",
            description: "Image-focused layout perfect for visual products",
            image: "/images/templates/gallery-template-preview.png",
            badge: "New",
          },
          {
            id: "minimal",
            name: "Minimal",
            description: "Simple, distraction-free design that focuses on conversion",
            image: "/images/templates/minimal-template-preview.png",
          },
          {
            id: "showcase",
            name: "Showcase",
            description: "Feature-rich template with advanced product presentation",
            image: "/images/templates/showcase-template-preview.png",
          },
        ]
      : [
          {
            id: "multi-product",
            name: "Standard Store",
            description: "Complete store layout with featured products and categories",
            image: "/images/templates/multi-product-template-preview.png",
            badge: "Popular",
          },
          {
            id: "multi-product-grid",
            name: "Grid Store",
            description: "Modern grid layout with filtering and sorting options",
            image: "/images/templates/multi-product-grid-template-preview.png",
            badge: "New",
          },
          {
            id: "multi-product-catalog",
            name: "Catalog Store",
            description: "Catalog-style layout with detailed product cards",
            image: "/images/templates/multi-product-catalog-template-preview.png",
          },
        ]

  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-500">
          Select a template that best showcases your {productType === "single" ? "product" : "products"}. Each template
          is designed for different types of products and presentation styles.
        </p>
      </div>

      <RadioGroup
        value={selectedTemplate}
        onValueChange={setSelectedTemplate}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {templates.map((template) => (
          <div key={template.id} className="relative">
            <RadioGroupItem value={template.id} id={template.id} className="sr-only peer" />
            <Label
              htmlFor={template.id}
              className="block cursor-pointer rounded-lg border-2 bg-white p-2 hover:border-[#ECB176] peer-checked:border-[#ECB176] peer-checked:ring-1 peer-checked:ring-[#ECB176] transition-all"
            >
              <div className="aspect-video w-full overflow-hidden rounded-md bg-gray-100 relative">
                <img
                  src={template.image || `/placeholder.svg?height=200&width=400&query=${template.name} template`}
                  alt={template.name}
                  className="h-full w-full object-cover"
                />
                {template.badge && (
                  <Badge className="absolute top-2 right-2 bg-[#ECB176] hover:bg-[#D9A066]">{template.badge}</Badge>
                )}
              </div>
              <div className="p-2">
                <h3 className="font-medium">{template.name}</h3>
                <p className="text-xs text-gray-500">{template.description}</p>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
