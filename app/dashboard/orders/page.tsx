"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, Info } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { OrderDetailsModal } from "@/components/dashboard/order-details-modal"
import { useToast } from "@/components/ui/use-toast"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  
  // Function to get status badge color
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
  
  // Fetch orders data
  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setOrders(data.orders || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({
        title: "Error fetching orders",
        description: "There was a problem loading your orders.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Load orders when component mounts
  useEffect(() => {
    fetchOrders()
  }, [])
  
  const openOrderDetails = (order: any) => {
    setSelectedOrder(order)
    setIsDetailsOpen(true)
  }
  
  const handleStatusChange = () => {
    // Refresh the orders list after status change
    fetchOrders()
  }
  
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Orders"
        description="View and manage customer orders for your products."
      />
      
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>
            Manage your customer orders and update their status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6F4E37]"></div>
            </div>
          ) : orders && orders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.order_number}</TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{order.customer_name}</TableCell>
                    <TableCell>{order.product_name}</TableCell>
                    <TableCell>
                      {order.currency} {order.amount?.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openOrderDetails(order)}
                      >
                        <Info className="h-4 w-4" />
                        <span className="sr-only">View order details</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
      </Card>
      
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder}
          open={isDetailsOpen}
          onOpenChange={(open) => {
            setIsDetailsOpen(open)
            if (!open) {
              // Refresh orders list when modal is closed
              handleStatusChange()
            }
          }}
        />
      )}
    </DashboardShell>
  )
} 