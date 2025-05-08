import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const domain = searchParams.get("domain")

  if (!domain) {
    return NextResponse.json({ error: "Domain is required" }, { status: 400 })
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("domains")
      .select("subdomain, is_active")
      .eq("subdomain", domain.toLowerCase())
      .eq("is_active", true)
      .single()

      if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ available: !data })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check domain availability" },
      { status: 500 }
    )
  }
}
