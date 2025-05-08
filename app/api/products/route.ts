import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/database.types"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug")
  const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit") as string) : 10

  const supabase = createRouteHandlerClient<Database>({ cookies })

  try {
    if (slug) {
      // Get a single product by slug
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }

      return NextResponse.json({ product: data })
    } else {
      // Get multiple products
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ products: data })
    }
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
