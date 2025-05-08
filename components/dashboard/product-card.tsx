import Link from "next/link"
import Image from "next/image"
import { Edit3, Eye, LayoutTemplate, MoreHorizontal, RefreshCw, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ProductCardProps {
  product: {
    id: string
    name: string
    template: string
    subdomain: string
    orders: number
    views: number
    conversionRate: string
    created: string
    image: string
  }
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg?height=400&width=600"
          }}
        />
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 hover:bg-white">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Edit3 className="mr-2 h-4 w-4" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LayoutTemplate className="mr-2 h-4 w-4" />
                Change Template
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-[#6F4E37]">{product.name}</h3>
          <span className="text-xs bg-[#FED8B1]/30 text-[#6F4E37] px-2 py-1 rounded-full">{product.template}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="text-sm text-muted-foreground mb-4">{product.subdomain}.showcase.com</div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#FED8B1]/20 rounded-md p-2">
            <div className="text-lg font-medium text-[#6F4E37]">{product.views}</div>
            <div className="text-xs text-muted-foreground">Views</div>
          </div>
          <div className="bg-[#FED8B1]/20 rounded-md p-2">
            <div className="text-lg font-medium text-[#6F4E37]">{product.orders}</div>
            <div className="text-xs text-muted-foreground">Orders</div>
          </div>
          <div className="bg-[#FED8B1]/20 rounded-md p-2">
            <div className="text-lg font-medium text-[#6F4E37]">{product.conversionRate}</div>
            <div className="text-xs text-muted-foreground">Conv. Rate</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm" className="border-[#A67B5B]/30 text-[#6F4E37]" asChild>
          <Link href={`/dashboard/products/${product.id}/edit`}>
            <Edit3 className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="border-[#A67B5B]/30 text-[#6F4E37]" asChild>
          <Link href={`https://${product.subdomain}.showcase.com`} target="_blank">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="border-[#A67B5B]/30 text-[#6F4E37]">
          <RefreshCw className="mr-2 h-4 w-4" />
          Sync
        </Button>
      </CardFooter>
    </Card>
  )
}
