import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check user authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }
    
    // Fetch orders for the current user
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
    
    if (error) {
      console.error("Error fetching orders:", error)
      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Unexpected error in orders API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 