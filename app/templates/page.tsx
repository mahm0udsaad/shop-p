import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"

export default function TemplatesPage() {
  const templates = [
    {
      id: "modern",
      name: "Modern Template",
      description: "Clean, minimalist design with focus on product details",
      image: "/images/templates/modern-template-preview.png",
    },
    {
      id: "premium",
      name: "Premium Template",
      description: "Luxury design with immersive product experience",
      image: "/images/templates/premium-template-preview.png",
    },
    {
      id: "classic",
      name: "Classic Template",
      description: "Traditional e-commerce layout with proven conversion rate",
      image: "/images/templates/classic-template-preview.png",
    },
    {
      id: "gallery",
      name: "Gallery Template",
      description: "Visual-focused design with large images and minimal text",
      image: "/images/templates/gallery-template-preview.png",
    },
    {
      id: "minimal",
      name: "Minimal Template",
      description: "Clean, text-focused template with a simple layout",
      image: "/images/templates/minimal-template-preview.png",
    },
    {
      id: "showcase",
      name: "Showcase Template",
      description: "Feature-rich template that highlights product details",
      image: "/images/templates/showcase-template-preview.png",
    },
    {
      id: "multi-product",
      name: "Multi-Product Template",
      description: "E-commerce style layout for showcasing multiple products",
      image: "/images/templates/multi-product-template-preview.png",
    },
    {
      id: "multi-product-grid",
      name: "Multi-Product Grid Template",
      description: "Modern grid layout with advanced filtering and sorting options",
      image: "/images/templates/multi-product-template-preview.png",
    },
    {
      id: "multi-product-catalog",
      name: "Multi-Product Catalog Template",
      description: "Elegant catalog-style layout with wishlist and detailed product views",
      image: "/images/templates/multi-product-template-preview.png",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Link href="/">
              <span className="bg-gradient-to-r from-[#6F4E37] to-[#A67B5B] text-transparent bg-clip-text">
                Product
              </span>
              <span className="text-[#A67B5B]">Showcase</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/#features"
              className="text-sm font-medium text-[#6F4E37] hover:text-[#A67B5B] transition-colors"
            >
              Features
            </Link>
            <Link
              href="/templates"
              className="text-sm font-medium text-[#6F4E37] hover:text-[#A67B5B] transition-colors"
            >
              Templates
            </Link>
            <Link
              href="/#pricing"
              className="text-sm font-medium text-[#6F4E37] hover:text-[#A67B5B] transition-colors"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-[#6F4E37]">
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-[#ECB176] hover:bg-[#A67B5B] text-[#6F4E37] shadow-sm">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-[#FED8B1]/20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#6F4E37]">
                Choose Your Perfect Template
              </h1>
              <p className="max-w-[700px] text-[#A67B5B] md:text-xl">
                Our professionally designed templates help you showcase your products in the best possible way
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {templates.map((template) => (
                <div key={template.id} className="overflow-hidden rounded-lg border bg-white shadow">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={template.image || "/placeholder.svg"}
                      alt={template.name}
                      width={600}
                      height={400}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium">{template.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{template.description}</p>
                    <div className="mt-4 flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/templates/${template.id}`}>View Details</Link>
                      </Button>
                      <Button asChild size="sm">
                        <Link href={`/templates/preview/${template.id}`}>Live Preview</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <h2 className="text-2xl font-bold mb-4 text-[#6F4E37]">Ready to create your product page?</h2>
              <p className="text-[#A67B5B]">Choose a template and get started today!</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
