import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface VisitorMetricsProps {
  title: string
  value: string | number
  description: string
  icon?: React.ReactNode
  compact?: boolean
}

export function VisitorMetrics({ title, value = 0, description, icon, compact = false }: VisitorMetricsProps) {
  return (
    <Card>
      <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${compact ? 'p-2 sm:pb-2' : 'pb-2'}`}>
        <CardTitle className={`${compact ? 'text-xs sm:text-sm' : 'text-sm'} font-medium`}>{title}</CardTitle>
        {icon && <div className={`${compact ? 'h-5 w-5 sm:h-6 sm:w-6' : 'h-6 w-6'} rounded-full bg-[#FED8B1]/30 flex items-center justify-center`}>{icon}</div>}
      </CardHeader>
      <CardContent className={compact ? 'p-2 pb-3 sm:p-6 sm:pt-0' : undefined}>
        <div className={`${compact ? 'text-lg sm:text-2xl' : 'text-2xl'} font-bold`}>{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
