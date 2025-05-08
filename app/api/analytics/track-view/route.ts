import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"
import type { Database } from "@/lib/database.types"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    const { productId, path } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    // Get or create visitor ID from cookies
    let visitorId = request.cookies.get("visitor_id")?.value
    if (!visitorId) {
      visitorId = uuidv4()
      // Note: We can't set cookies in the response here since it's an API route
      // The client will need to handle setting the cookie
    }

    // Get referrer from request headers
    const referrer = request.headers.get("referer") || ""

    // Get user agent
    const userAgent = request.headers.get("user-agent") || ""

    // Get IP address (with privacy considerations)
    // In production, you might want to hash or partially anonymize this
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "anonymous"

    // Track the page view using the Supabase function
    const { data, error } = await supabase.rpc("track_page_view", {
      product_uuid: productId,
      visitor_uuid: visitorId,
      referrer_url: referrer,
      user_agent_string: userAgent,
      ip_addr: ip,
      page_path: path || "/",
    })

    if (error) {
      console.error("Error tracking page view:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      visitorId,
    })
  } catch (error) {
    console.error("Error in track-view API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
