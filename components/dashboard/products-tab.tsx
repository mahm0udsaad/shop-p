"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/app/components/dashboard/icons"
import { DeleteProductButton } from "@/app/components/dashboard/delete-product-button"
import { Palette } from "lucide-react"

type Product = {
  id: string
  slug: string
  template: string
  created: string
  published: boolean
  image: string
  views: number
  orders: number
  conversionRate: string
  subdomain: string
}

interface ProductsTabProps {
  products: Product[]
}

export function ProductsTab({ products }: ProductsTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <Card key={product.id || index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{product.slug}</CardTitle>
              <CardDescription>
                Template: {product.template} • Created: {product.created}
                {product.published ? " • Published" : " • Draft"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video relative mb-4 overflow-hidden rounded-md">
                <img
                  src={product.image}
                  alt={product.slug}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Views</p>
                  <p className="text-lg font-medium">{product.views}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Orders</p>
                  <p className="text-lg font-medium">{product.orders}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Conversion</p>
                  <p className="text-lg font-medium">{product.conversionRate}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-1">
              <div className="flex w-full justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-[#A67B5B]/30 text-[#6F4E37]" asChild>
                  <Link href={`/dashboard/edit-product/${product.id}`}>
                  Edit</Link>
                  </Button>
                  <DeleteProductButton productId={product.id} productName={product.slug} />
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-[#A67B5B]/30 text-[#6F4E37]" 
                  asChild
                  disabled={!product.published}
                >
                  <Link href={`https://${product.subdomain}.shipfaster.tech`} target="_blank">
                    View
                  </Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      {products.length === 0 && (
        <Card className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FED8B1]/30">
            <Icons.products className="h-6 w-6 text-[#6F4E37]" />
          </div>
          <h3 className="mb-2 text-lg font-medium">No Products Yet</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            You haven't created any product showcases yet. Get started by adding your first product.
          </p>
          <Button className="bg-[#ECB176] hover:bg-[#A67B5B] text-[#6F4E37]" asChild>
            <Link href="/dashboard/new">
              <Icons.add className="mr-2 h-4 w-4" />
              Add New Product
            </Link>
          </Button>
        </Card>
      )}
    </div>
  )
} 