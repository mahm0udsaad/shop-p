import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { subdomain: string } }) {
  const subdomain = params.subdomain

  if (!subdomain) {
    return NextResponse.json({ error: "Subdomain parameter is required" }, { status: 400 })
  }

  // Initialize Supabase client
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Call the get_product_showcase function
    const { data, error } = await supabase.rpc("get_product_showcase", { domain_name: subdomain })

    if (error) {
      console.error("Error fetching product showcase:", error)
      return NextResponse.json({ error: "Failed to fetch product data" }, { status: 500 })
    }

    if (data && data.error) {
      return NextResponse.json({ error: data.error }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}