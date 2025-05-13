import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Orders | Dashboard",
  description: "Manage your product orders and view order details",
}

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 