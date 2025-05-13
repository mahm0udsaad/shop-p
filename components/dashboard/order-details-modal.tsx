"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateOrderStatus } from "@/app/actions"

interface OrderDetailsModalProps {
  order: {
    id: string
    order_number: string
    customer_name: string
    customer_email: string
    customer_phone?: string
    product_name: string
    amount: number
    currency: string
    status: string
    notes?: string
    shipping_address?: any
    billing_address?: any
    created_at: string
    updated_at: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderDetailsModal({ order, open, onOpenChange }: OrderDetailsModalProps) {
  const [copied, setCopied] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  
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
  
  const handleCopyOrderDetails = () => {
    const formatAddress = (address: any) => {
      if (!address) return "N/A"
      return `${address.address || ''}, ${address.city || ''}, ${address.postalCode || ''}, ${address.country || ''}`
    }
    
    const orderDetails = `
Order Details:
--------------
Order #: ${order.order_number}
Date: ${new Date(order.created_at).toLocaleString()}
Status: ${order.status}

Customer Information:
-------------------
Name: ${order.customer_name}
Email: ${order.customer_email}
Phone: ${order.customer_phone || 'N/A'}

Product:
-------
Name: ${order.product_name}
Price: ${order.currency} ${order.amount.toFixed(2)}

Shipping Address:
---------------
${formatAddress(order.shipping_address)}

Billing Address:
--------------
${formatAddress(order.billing_address)}

Order Notes:
-----------
${order.notes || 'None'}
`.trim()
    
    navigator.clipboard.writeText(orderDetails)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  const handleStatusChange = async (newStatus: string) => {
    setIsUpdatingStatus(true)
    try {
      const result = await updateOrderStatus({
        orderId: order.id,
        status: newStatus
      })
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      // The parent component will need to refresh data after status changes
      // This is handled outside this component
    } catch (error) {
      console.error("Error updating order status:", error)
    } finally {
      setIsUpdatingStatus(false)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order #{order.order_number}</span>
            <Badge className={getStatusColor(order.status)}>
              {order.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {new Date(order.created_at).toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-md p-3">
              <h3 className="text-sm font-medium mb-2">Customer Information</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Name:</span> {order.customer_name}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {order.customer_email}
                </p>
                {order.customer_phone && (
                  <p>
                    <span className="font-medium">Phone:</span> {order.customer_phone}
                  </p>
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-md p-3">
              <h3 className="text-sm font-medium mb-2">Order Details</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Product:</span> {order.product_name}
                </p>
                <p>
                  <span className="font-medium">Amount:</span> {order.currency} {order.amount.toFixed(2)}
                </p>
              </div>
            </div>
            
            {order.notes && (
              <div className="bg-gray-50 rounded-md p-3">
                <h3 className="text-sm font-medium mb-2">Notes</h3>
                <p className="text-sm">{order.notes}</p>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {order.shipping_address && (
              <div className="bg-gray-50 rounded-md p-3">
                <h3 className="text-sm font-medium mb-2">Shipping Address</h3>
                <div className="space-y-1 text-sm">
                  <p>{order.shipping_address.address}</p>
                  <p>
                    {order.shipping_address.city}, {order.shipping_address.postalCode}
                  </p>
                  <p>{order.shipping_address.country}</p>
                </div>
              </div>
            )}
            
            {order.billing_address && order.billing_address !== order.shipping_address && (
              <div className="bg-gray-50 rounded-md p-3">
                <h3 className="text-sm font-medium mb-2">Billing Address</h3>
                <div className="space-y-1 text-sm">
                  <p>{order.billing_address.address}</p>
                  <p>
                    {order.billing_address.city}, {order.billing_address.postalCode}
                  </p>
                  <p>{order.billing_address.country}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-center pt-4 gap-4">
          <div className="flex items-center">
            <h3 className="text-sm font-medium mr-3">Update Status</h3>
            <Select 
              defaultValue={order.status} 
              onValueChange={handleStatusChange}
              disabled={isUpdatingStatus}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant="outline" 
            className="flex items-center justify-center gap-2"
            onClick={handleCopyOrderDetails}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Order Details
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 