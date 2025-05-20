import { getDashboardData } from "./utils"
import { createClient } from "@/lib/supabase/server"
import { ClientDashboard } from "@/components/dashboard/client-dashboard"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return null // Handle this case appropriately in your app
  }

  const currSearchParams = await searchParams;
  const selectedProductId = typeof currSearchParams.productId === 'string' ? currSearchParams.productId : undefined
  
  // Pass the promise instead of awaiting it
  const dashboardDataPromise = getDashboardData(user.id, selectedProductId)

  return (
    <ClientDashboard
      dashboardDataPromise={dashboardDataPromise}
      selectedProductId={selectedProductId}
      heading="Dashboard"
      description="Overview of your product showcase performance and management."
    />
  )
}
