'use server'

import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js'
import { configureLemonSqueezy } from './config/lemonsqueezy'
import { createClient } from '@/lib/supabase/server'
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from 'uuid'

export async function getCheckoutURL(variantId: number, embed = false) {
  try {
    configureLemonSqueezy()

    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      throw new Error('User is not authenticated.')
    }

    const checkout = await createCheckout(
      178354, // your store ID
  793602, // this variant ID
      {
        checkoutOptions: {
          embed,
          media: false,
          logo: !embed,
        },
        checkoutData: {
          email: session.user.email ?? undefined,
          custom: {
            user_id: session.user.id,
          },
        },
        productOptions: {
          enabledVariants: [variantId],
          redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
          receiptButtonText: 'Go to Dashboard',
          receiptThankYouNote: 'Thank you for subscribing to our service!',
        },
      }
    )

    if (!checkout?.data?.data?.attributes?.url) {
      console.error('Invalid checkout response:', checkout)
      throw new Error('Failed to create checkout URL')
    }

    return checkout.data.data.attributes.url
  } catch (error) {
    console.error('Error creating checkout:', error)
    throw new Error('Failed to create checkout. Please try again.')
  }
}

export interface OrderFormData {
  productId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  amount: number
  currency: string
  orderNotes?: string
  shippingAddress?: {
    address: string
    city: string
    postalCode: string
    country: string
  }
  billingAddress?: {
    address: string
    city: string
    postalCode: string
    country: string
  }
  status: string
}

export async function createOrder(data: OrderFormData) {
  try {
    // Initialize Supabase client
    
    const supabase = createServerActionClient({ cookies })
    console.log('Creating order with data:', { 
      productId: data.productId,
      customerName: data.customerName,
      amount: data.amount,
      status: data.status
    });
    
    // Validate required fields
    if (!data.productId || !data.customerName || !data.customerEmail || !data.amount) {
      console.error('Missing required order information:', { 
        hasProductId: Boolean(data.productId),
        hasCustomerName: Boolean(data.customerName),
        hasCustomerEmail: Boolean(data.customerEmail),
        hasAmount: Boolean(data.amount)
      });
      return {
        error: "Missing required order information"
      }
    }
    
    // Fetch product information to get the owner's user_id
    const { data: productData, error: productError } = await supabase
      .from("products")
      .select("id, name, user_id")
      .eq("id", data.productId)
      .single()
    
    if (productError || !productData) {
      console.error("Error fetching product:", productError, "Product ID was:", data.productId);
      return {
        error: "Product not found"
      }
    }
    
    console.log("Found product:", { id: productData.id, name: productData.name, userId: productData.user_id });
    
    // Generate order number
    const orderNumber = `ORD-${uuidv4().substring(0, 8).toUpperCase()}`
    
    // Create new order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        product_id: data.productId,
        user_id: productData.user_id,
        product_name: productData.name, // Store product name for easier retrieval
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone,
        amount: data.amount,
        currency: data.currency,
        status: data.status,
        notes: data.orderNotes,
        shipping_address: data.shippingAddress,
        billing_address: data.billingAddress || data.shippingAddress,
      })
      .select()
    
    if (orderError) {
      console.error("Error creating order:", orderError)
      return {
        error: "Failed to create order"
      }
    }
    
    return {
      success: true,
      order: order[0]
    }
  } catch (error) {
    console.error("Unexpected error creating order:", error)
    return {
      error: "An unexpected error occurred"
    }
  }
}

export async function updateOrderStatus({
  orderId,
  status
}: {
  orderId: string
  status: string
}) {
  try {
    // Initialize Supabase client
    const supabase = createServerActionClient({ cookies })
    
    // Update the order status
    const { data, error } = await supabase
      .from("orders")
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq("id", orderId)
      .select()
    
    if (error) {
      console.error("Error updating order status:", error)
      return {
        error: "Failed to update order status"
      }
    }
    
    return {
      success: true,
      order: data[0]
    }
  } catch (error) {
    console.error("Unexpected error updating order status:", error)
    return {
      error: "An unexpected error occurred"
    }
  }
} 