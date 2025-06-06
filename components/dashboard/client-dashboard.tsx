"use client";

import { use } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";
import { useNotifications } from "@/hooks/use-notifications";
import { useAuth } from "@/contexts/auth-context";
import { ErrorBoundary } from "@/components/error-boundary";
import { DashboardErrorFallback } from "@/components/dashboard/dashboard-error-fallback";

interface ClientDashboardProps {
  dashboardDataPromise: Promise<{
    products: any[];
    analytics: any;
  }>;
  selectedProductId?: string;
  heading: string;
  description: string;
}

export function ClientDashboard({
  dashboardDataPromise,
  selectedProductId,
  heading,
  description
}: ClientDashboardProps) {
  const { user } = useAuth();
  const { notifications, unreadCount } = useNotifications();

  return (
    <main className="w-full">
      <DashboardHeader
        heading={heading}
        description={description}
        notifications={notifications}
        unreadCount={unreadCount}
        userId={user?.id}
      />

      <div className="container px-1.5 sm:px-4 py-2 sm:py-6 max-w-full sm:max-w-screen-2xl">
        <ErrorBoundary fallback={<DashboardErrorFallback promise={dashboardDataPromise} />}>
          <DashboardContent 
            dashboardDataPromise={dashboardDataPromise}
            selectedProductId={selectedProductId}
          />
        </ErrorBoundary>
      </div>
    </main>
  );
}

function DashboardContent({ 
  dashboardDataPromise, 
  selectedProductId 
}: { 
  dashboardDataPromise: Promise<{products: any[], analytics: any}>,
  selectedProductId?: string
}) {
  // Remove try-catch since ErrorBoundary will handle it
  const { products, analytics } = use(dashboardDataPromise);
  
  return (
    <DashboardTabs 
      products={products} 
      analytics={analytics} 
      selectedProductId={selectedProductId} 
    />
  );
}