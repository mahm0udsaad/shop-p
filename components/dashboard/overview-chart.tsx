"use client"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface OverviewChartProps {
  data: {
    viewsOverTime?: Array<{ date: string; views: number }>
    ordersOverTime?: Array<{ date: string; orders: number }>
  }
}

export function OverviewChart({ data }: OverviewChartProps) {
  // Make sure we have valid data arrays
  const viewsData = data.viewsOverTime || []
  const ordersData = data.ordersOverTime || []
  // Prepare chart data
  const chartData = viewsData.map((item, index) => {
    // Find corresponding order data by date
    const orderItem = ordersData.find(order => order.date === item.date) || 
                      { date: item.date, orders: 0 }
    
    return {
      name: item.date,
      views: item.views,
      orders: orderItem.orders,
    }
  })

  // Find max value for views to set yAxis domain
  const maxViews = Math.max(...chartData.map((item) => item.views), 10)
  const maxOrders = Math.max(...chartData.map((item) => item.orders), 5)

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          yAxisId="left"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
          domain={[0, maxViews + Math.ceil(maxViews * 0.1)]}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
          domain={[0, maxOrders + Math.ceil(maxOrders * 0.2)]}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Views</span>
                      <span className="font-bold text-[#6F4E37]">{payload[0].value}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">Orders</span>
                      <span className="font-bold text-[#A67B5B]">{payload[1].value}</span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="views"
          stroke="#6F4E37"
          strokeWidth={2}
          activeDot={{
            r: 6,
            style: { fill: "#6F4E37", opacity: 0.8 },
          }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="orders"
          stroke="#A67B5B"
          strokeWidth={2}
          activeDot={{
            r: 6,
            style: { fill: "#A67B5B", opacity: 0.8 },
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
