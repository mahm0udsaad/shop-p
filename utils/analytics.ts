import { v4 as uuidv4 } from "uuid"

// Function to get or create a visitor ID
export function getVisitorId(): string {
  if (typeof window === "undefined") return ""

  let visitorId = localStorage.getItem("visitor_id")

  if (!visitorId) {
    visitorId = uuidv4()
    localStorage.setItem("visitor_id", visitorId)
  }

  return visitorId
}

// Function to track a page view
export async function trackPageView(productId: string, path: string = window.location.pathname) {
  if (!productId) return

  try {
    const visitorId = getVisitorId()

    const response = await fetch("/api/analytics/track-view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        path,
        visitorId,
      }),
    })

    if (!response.ok) {
      console.error("Failed to track page view")
    }

    return response.ok
  } catch (error) {
    console.error("Error tracking page view:", error)
    return false
  }
}

// Function to track an order conversion
export async function trackOrder(
  productId: string,
  customerName: string,
  customerEmail: string,
  amount: number,
  currency = "USD",
  shippingAddress: any = null,
  billingAddress: any = null,
) {
  if (!productId) return

  try {
    const response = await fetch("/api/analytics/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        customerName,
        customerEmail,
        amount,
        currency,
        shippingAddress,
        billingAddress,
      }),
    })

    if (!response.ok) {
      console.error("Failed to track order")
    }

    const data = await response.json()
    return data.orderId
  } catch (error) {
    console.error("Error tracking order:", error)
    return null
  }
}
