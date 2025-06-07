"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Product {
  id: string
  name: string
  hasAnalytics: boolean
}

interface ProductAnalyticsSelectorProps {
  products: Product[]
  selectedProductId?: string
}

export function ProductAnalyticsSelector({
  products,
  selectedProductId,
}: ProductAnalyticsSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const selectedProduct = products.find((product) => product.id === selectedProductId)
  const hasProducts = products.length > 0
  const hasAnalyticsProducts = products.some(p => p.hasAnalytics)
  const totalProducts = products.length

  const handleSelect = (productId: string | null) => {
    setOpen(false)
    const params = new URLSearchParams()
    if (productId) {
      params.set('productId', productId)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full sm:w-[250px] text-sm truncate justify-between border-[#A67B5B]/30 text-[#6F4E37]"
        >
          <div className="flex items-center">
            {selectedProduct ? 
              <span className="truncate max-w-[180px]">{selectedProduct.name}</span> 
              : "All Products Analytics"}
            <span className="ml-2 text-xs bg-[#FED8B1]/50 text-[#6F4E37] rounded-full px-1.5 py-0.5 font-medium">
              {totalProducts}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 flex-none" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search products..." />
          <CommandEmpty>No products found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              onSelect={() => handleSelect(null)}
              className="cursor-pointer"
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  !selectedProductId ? "opacity-100" : "opacity-0"
                )}
              />
              <span>All Products Analytics</span>
              <span className="ml-2 text-xs bg-[#FED8B1]/50 text-[#6F4E37] rounded-full px-1.5 py-0.5 font-medium">
                {totalProducts}
              </span>
            </CommandItem>
            {products
              .map((product) => (
                <CommandItem
                  key={product.id}
                  onSelect={() => handleSelect(product.id)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      product.id === selectedProductId ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="truncate">{product.name}</span>
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 