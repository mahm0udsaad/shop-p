import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ProductsTable } from "@/components/dashboard/products-table"
import { getUserProducts } from "./actions"

export const metadata = {
  title: "Products | Product Showcase",
  description: "Manage your product showcases",
}

export default async function ProductsPage() {
  const { products, error } = await getUserProducts()

  return (
    <DashboardShell>
      <DashboardHeader heading="Products" description="Manage your product showcases">
        <Link href="/dashboard/new">
          <Button className="bg-[#ECB176] hover:bg-[#A67B5B] text-[#6F4E37]">
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </Link>
      </DashboardHeader>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading products: {error}
        </div>
      ) : products && products.length > 0 ? (
        <ProductsTable products={products} />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-[#FED8B1]/30 p-3 mb-4">
            <Plus className="h-6 w-6 text-[#6F4E37]" />
          </div>
          <h3 className="text-lg font-medium text-[#6F4E37] mb-2">No products yet</h3>
          <p className="text-sm text-[#A67B5B] max-w-sm mb-6">
            Create your first product showcase to start selling and promoting your products.
          </p>
          <Button className="bg-[#ECB176] hover:bg-[#A67B5B] text-[#6F4E37]" asChild>
            <Link href="/dashboard/new">Create Product</Link>
          </Button>
        </div>
      )}
    </DashboardShell>
  )
}
