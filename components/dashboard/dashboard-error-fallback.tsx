"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DashboardErrorFallbackProps {
  promise: Promise<any>;
}

export function DashboardErrorFallback({ promise }: DashboardErrorFallbackProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      // Force a re-render by refreshing the page
      window.location.reload();
    } catch (error) {
      console.error("Error retrying dashboard data:", error);
      setIsRetrying(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-lg border border-red-200 bg-red-50 my-4">
      <svg 
        className="h-12 w-12 text-red-500 mb-4" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to load dashboard data</h3>
      <p className="text-red-600 mb-4 text-center">There was an error loading your dashboard data. Please try again.</p>
      <Button 
        className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
        onClick={handleRetry}
        disabled={isRetrying}
      >
        {isRetrying ? "Retrying..." : "Retry"}
      </Button>
    </div>
  );
} 