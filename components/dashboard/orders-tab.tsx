"use client"

import { useState } from "react"
import { use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Info, ShoppingBag } from "lucide-react"
import { OrderDetailsModal } from "@/components/dashboard/order-details-modal"

interface Order {
  id: string
  order_number?: string
  product: string
  customer: string
  date: string
  status: string
  amount: string
  customer_email?: string
  customer_phone?: string
  created_at?: string
  updated_at?: string
  notes?: string
  shipping_address?: any
  billing_address?: any
  currency?: string
  product_name?: string
}

interface OrdersTabProps {
  orders: Order[] | Promise<Order[]>
}

export function OrdersTab({ orders }: OrdersTabProps) {
  // If orders is a promise, use the React use() hook to handle it
  const resolvedOrders = orders instanceof Promise ? use(orders) : orders;
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
  
  const openOrderDetails = (order: Order) => {
    // Format the order to match the expected format for OrderDetailsModal
    const formattedOrder = {
      ...order,
      product_name: order.product_name || order.product,
      customer_name: order.customer,
      currency: order.currency || "USD",
      amount: typeof order.amount === 'string' ? parseFloat(order.amount.replace(/[^0-9.]/g, '')) : 0,
      created_at: order.created_at || order.date,
      updated_at: order.updated_at || order.date
    }
    
    setSelectedOrder(formattedOrder as any)
    setIsDetailsOpen(true)
  }
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>Manage your product orders and update their status</CardDescription>
        </CardHeader>
        <CardContent>
          {resolvedOrders.length > 0 ? (
            <div className="rounded-md border">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b bg-[#FED8B1]/10">
                    <th className="h-12 px-4 text-left align-middle font-medium">Order #</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Customer</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Product</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Amount</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {resolvedOrders.map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="p-4 align-middle font-medium">{order.order_number || order.id}</td>
                      <td className="p-4 align-middle">{order.date}</td>
                      <td className="p-4 align-middle">{order.customer}</td>
                      <td className="p-4 align-middle">{order.product}</td>
                      <td className="p-4 align-middle">{order.amount}</td>
                      <td className="p-4 align-middle">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="inline-flex items-center justify-center"
                          onClick={() => openOrderDetails(order)}
                        >
                          <Info className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FED8B1]/30">
                <ShoppingBag className="h-6 w-6 text-[#6F4E37]" />
              </div>
              <h3 className="mb-2 text-lg font-medium">No Orders Yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                You haven't received any orders yet. Share your product showcases to start getting orders.
              </p>
            </div>
          )}
        </CardContent>
        {resolvedOrders.length > 0 && (
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full border-[#A67B5B]/30 text-[#6F4E37]"
              asChild
            >
              <Link href="/dashboard/orders">View more orders</Link>
            </Button>
          </CardFooter>
        )}
      </Card>
      
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder as any}
          open={isDetailsOpen}
          onOpenChange={(open) => {
            setIsDetailsOpen(open)
            if (!open) {
              // Could trigger a refresh if needed
            }
          }}
        />
      )}
    </>
  )
} 