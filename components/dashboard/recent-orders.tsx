import { ShoppingBag } from "lucide-react"

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
          <div className="ml-auto text-right">
            <p className="text-sm font-medium">{order.amount}</p>
            <p className="text-xs text-muted-foreground">{order.date}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
