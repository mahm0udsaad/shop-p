import { notFound } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ProductEditForm } from "@/components/dashboard/product-edit-form"
import { getProductImages } from '@/lib/supabase/server-storage'
import type { Database } from "@/lib/database.types"

interface ProductEditPageProps {
  params: {
    id: string
  }
}

interface ProductImage {
  name: string
  path: string
  url: string
  size?: number
  createdAt?: string
}

export default async function ProductEditPage({ params }: ProductEditPageProps) {
  const supabase = createServerComponentClient<Database>({ cookies })

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const userId = session?.user?.id

  if (!userId) {
    return notFound()
  }

  // Fetch the product directly
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", userId)
    .single()

  if (error || !product) {
    console.error("Error fetching product:", error)
    return notFound()
  }

  // Get product images
  let productImages: ProductImage[] = []
  try {
    productImages = await getProductImages(params.id, userId)
  } catch (error) {
    console.error("Error fetching product images:", error)
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={`Edit Product: ${product.name}`}
        description="Update your product details and settings"
      />

      <div className="grid gap-10">
        <ProductEditForm product={product} productImages={productImages} />
      </div>
    </DashboardShell>
  )
}
