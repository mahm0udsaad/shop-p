import { ShoppingBag } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Order {
  id: string
  product: string
  customer: string
  date: string
  status: string
  amount: string
}

interface RecentOrdersProps {
  orders?: Order[]
}

export function RecentOrders({ orders = [] }: RecentOrdersProps) {
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
  
  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <ShoppingBag className="h-8 w-8 text-muted-foreground mb-3" />
        <h3 className="text-sm font-medium mb-1">No Recent Orders</h3>
        <p className="text-xs text-muted-foreground">When customers place orders, they will appear here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order, index) => (
        <div key={index} className="flex items-center">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-[#FED8B1]/30 flex items-center justify-center">
              <ShoppingBag className="h-4 w-4 text-[#6F4E37]" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">{order.product}</p>
              <p className="text-xs text-muted-foreground">{order.customer}</p>
            </div>
          </div>
          <div className="ml-auto text-right flex flex-col items-end gap-1">
            <p className="text-sm font-medium">{order.amount}</p>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">{order.date}</p>
              <Badge className={getStatusColor(order.status)}>
                {order.status}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
