import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface VisitorMetricsProps {
  title: string
  value: string | number
  description: string
  icon?: React.ReactNode
}

export function VisitorMetrics({ title, value, description, icon }: VisitorMetricsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-6 w-6 rounded-full bg-[#FED8B1]/30 flex items-center justify-center">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
