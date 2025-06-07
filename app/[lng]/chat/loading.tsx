import { Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-10 backdrop-blur-sm bg-white/75 dark:bg-slate-900/75 border-b border-slate-200 dark:border-slate-800">
        <div className="container flex h-16 items-center justify-between">
          <Skeleton className="h-8 w-24" />
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <Skeleton className="h-8 w-56" />
          </div>
        </div>
      </header>

      {/* Chat container skeleton */}
      <div className="container mx-auto flex-1 overflow-hidden py-6 sm:py-10">
        <Card className="flex flex-col h-[calc(100vh-12rem)] sm:h-[75vh] overflow-hidden rounded-xl border shadow-lg animate-pulse">
          {/* Message skeletons */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="space-y-6">
              {/* Assistant message skeleton */}
              <div className="flex gap-3 sm:gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-20 w-3/4 rounded-xl" />
              </div>
              
              {/* User message skeleton */}
              <div className="flex gap-3 sm:gap-4 justify-end">
                <Skeleton className="h-16 w-2/3 rounded-xl" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
              
              {/* Assistant message skeleton */}
              <div className="flex gap-3 sm:gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-24 w-3/4 rounded-xl" />
              </div>
            </div>
          </div>
          
          {/* Input area skeleton */}
          <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-end gap-3 sm:gap-4">
              <Skeleton className="h-20 flex-grow rounded-xl" />
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 