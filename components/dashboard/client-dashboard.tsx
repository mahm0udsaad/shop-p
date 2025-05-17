"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";
import { useNotifications } from "@/hooks/use-notifications";
import { useAuth } from "@/contexts/auth-context";

interface ClientDashboardProps {
  products: any[];
  analytics: any;
  selectedProductId?: string;
  heading: string;
  description: string;
}

export function ClientDashboard({
  products,
  analytics,
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

      <DashboardTabs 
        products={products} 
        analytics={analytics} 
        selectedProductId={selectedProductId} 
      />
    </main>
  );
} 