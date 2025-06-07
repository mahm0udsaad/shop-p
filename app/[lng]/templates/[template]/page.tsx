import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"

export default function TemplatePreviewPage({ params }: { params: { template: string } }) {
  const templates = {
    modern: {
      name: "Modern Template",
      description: "Clean, minimalist design with focus on product details",
      image: "/images/templates/modern-template-preview.png",
    },
    premium: {
      name: "Premium Template",
      description: "Luxury design with immersive product experience",
      image: "/images/templates/premium-template-preview.png",
    },
    classic: {
      name: "Classic Template",
      description: "Traditional e-commerce layout with proven conversion rate",
      image: "/images/templates/classic-template-preview.png",
    },
    gallery: {
      name: "Gallery Template",
      description: "Visual-focused design with large images and minimal text",
      image: "/images/templates/gallery-template-preview.png",
    },
    minimal: {
      name: "Minimal Template",
      description: "Clean, text-focused template with a simple layout",
      image: "/images/templates/minimal-template-preview.png",
    },
    showcase: {
      name: "Showcase Template",
      description: "Feature-rich template that highlights product details",
      image: "/images/templates/showcase-template-preview.png",
    },
    "multi-product": {
      name: "Multi-Product Template",
      description: "E-commerce style layout for showcasing multiple products",
      image: "/images/templates/multi-product-template-preview.png",
    },
    "multi-product-grid": {
      name: "Multi-Product Grid Template",
      description: "Modern grid layout with advanced filtering and sorting options",
      image: "/images/templates/multi-product-template-preview.png",
    },
  }

  const template = templates[params.template as keyof typeof templates]

  if (!template) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <Link href="/templates" className="flex items-center text-sm font-medium text-[#6F4E37]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Templates
          </Link>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#6F4E37]">{template.name}</h1>
              <p className="text-[#A67B5B] mt-1">{template.description}</p>
            </div>
            <div className="mt-6 flex gap-4">
              <Button asChild size="lg">
                <Link href={`/dashboard/new?template=${params.template}`}>Use This Template</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={`/templates/preview/${params.template}`}>Live Preview</Link>
              </Button>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden shadow-lg">
            <Image
              src={template.image || "/placeholder.svg"}
              alt={template.name}
              width={1200}
              height={800}
              className="w-full"
            />
          </div>

          <div className="mt-12 space-y-8">
            <div>
              <h2 className="text-xl font-bold mb-2 text-[#6F4E37]">Template Features</h2>
              {params.template === "multi-product" || params.template === "multi-product-grid" ? (
                <ul className="list-disc pl-5 space-y-1 text-[#A67B5B]">
                  <li>Showcase multiple products in a responsive grid layout</li>
                  <li>Category filtering and search functionality</li>
                  <li>Individual product cards with images and descriptions</li>
                  <li>Order form modal for each product</li>
                  <li>About and contact sections included</li>
                  <li>Mobile-friendly design that works on all devices</li>
                  {params.template === "multi-product-grid" && (
                    <>
                      <li>Advanced filtering and sorting options</li>
                      <li>Grid and list view toggle</li>
                      <li>Price range filtering</li>
                      <li>Featured products carousel</li>
                      <li>Product badges for new items and discounts</li>
                    </>
                  )}
                </ul>
              ) : (
                <ul className="list-disc pl-5 space-y-1 text-[#A67B5B]">
                  <li>Fully responsive design that looks great on all devices</li>
                  <li>Optimized for product showcasing and conversions</li>
                  <li>Customizable colors and layout options</li>
                  <li>Built-in product gallery with image zoom</li>
                  <li>Product details section with key features highlight</li>
                  <li>Integrated contact/order form</li>
                </ul>
              )}
            </div>

            <div className="pt-4 border-t">
              <h2 className="text-xl font-bold mb-4 text-[#6F4E37]">Ready to get started?</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={`/dashboard/new?template=${params.template}`}>
                  <Button className="bg-[#ECB176] hover:bg-[#A67B5B] text-[#6F4E37]">Use This Template</Button>
                </Link>
                <Link href="/templates">
                  <Button variant="outline" className="border-[#A67B5B] text-[#6F4E37]">
                    View All Templates
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-sm text-[#A67B5B]">© 2023 Product Showcase. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="#" className="text-sm font-medium text-[#A67B5B] hover:text-[#6F4E37]">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium text-[#A67B5B] hover:text-[#6F4E37]">
              Privacy
            </Link>
            <Link href="#" className="text-sm font-medium text-[#A67B5B] hover:text-[#6F4E37]">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
