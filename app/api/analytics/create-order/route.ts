import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/database.types"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    const {
      productId,
      customerName,
      customerEmail,
      amount,
      currency = "USD",
      shippingAddress = null,
      billingAddress = null,
    } = await request.json()

    if (!productId || !customerName || !customerEmail || !amount) {
      return NextResponse.json(
        {
          error: "Product ID, customer name, customer email, and amount are required",
        },
        { status: 400 },
      )
    }

    // Create the order using the Supabase function
    const { data: orderId, error } = await supabase.rpc("create_order", {
      product_uuid: productId,
      customer_name_input: customerName,
      customer_email_input: customerEmail,
      amount_input: amount,
      currency_input: currency,
      shipping_address_input: shippingAddress,
      billing_address_input: billingAddress,
    })

    if (error) {
      console.error("Error creating order:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      orderId,
    })
  } catch (error) {
    console.error("Error in create-order API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
