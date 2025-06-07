"use client"

import { CardDescription, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ShoppingBag, Store } from "lucide-react"

interface ProductTypeSelectorProps {
  productType: "single" | "multi"
  setProductType: (type: "single" | "multi") => void
}

export function ProductTypeSelector({ productType, setProductType }: ProductTypeSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-500">
          Choose the type of product page you want to create. This will determine the structure and features available.
        </p>
      </div>

      <RadioGroup
        value={productType}
        onValueChange={(value) => setProductType(value as "single" | "multi")}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4"
      >
        <div className="relative">
          <RadioGroupItem value="single" id="single" className="sr-only peer" />
          <Label
            htmlFor="single"
            className="flex flex-col h-full cursor-pointer rounded-lg border-2 bg-white p-6 hover:border-[#ECB176] hover:bg-[#FED8B1]/5 peer-checked:border-[#ECB176] peer-checked:bg-[#FED8B1]/10 transition-all"
          >
            <div className="mb-4 rounded-full bg-[#ECB176]/10 p-3 w-fit">
              <ShoppingBag className="h-6 w-6 text-[#6F4E37]" />
            </div>
            <CardTitle className="text-xl mb-2">Single Product</CardTitle>
            <CardDescription className="text-gray-500 flex-grow">
              Create a dedicated page for a single product with detailed information, images, and pricing.
            </CardDescription>
            <div className="mt-4 text-sm">
              <p className="font-medium text-[#6F4E37]">Best for:</p>
              <ul className="list-disc pl-5 mt-1 text-gray-600 space-y-1">
                <li>Showcasing a flagship product</li>
                <li>Digital products or services</li>
                <li>Products with detailed specifications</li>
                <li>Subscription-based offerings</li>
              </ul>
            </div>
          </Label>
        </div>

        <div className="relative">
          <RadioGroupItem value="multi" id="multi" className="sr-only peer" />
          <Label
            htmlFor="multi"
            className="flex flex-col h-full cursor-pointer rounded-lg border-2 bg-white p-6 hover:border-[#ECB176] hover:bg-[#FED8B1]/5 peer-checked:border-[#ECB176] peer-checked:bg-[#FED8B1]/10 transition-all"
          >
            <div className="mb-4 rounded-full bg-[#ECB176]/10 p-3 w-fit">
              <Store className="h-6 w-6 text-[#6F4E37]" />
            </div>
            <CardTitle className="text-xl mb-2">Multi-Product Store</CardTitle>
            <CardDescription className="text-gray-500 flex-grow">
              Create a complete store with multiple products, categories, and a unified shopping experience.
            </CardDescription>
            <div className="mt-4 text-sm">
              <p className="font-medium text-[#6F4E37]">Best for:</p>
              <ul className="list-disc pl-5 mt-1 text-gray-600 space-y-1">
                <li>Selling multiple related products</li>
                <li>Creating a brand store</li>
                <li>Product collections or catalogs</li>
                <li>Businesses with diverse offerings</li>
              </ul>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}
