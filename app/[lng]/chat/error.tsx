'use client';

import { useEffect } from 'react';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to the console
    console.error('Chat error:', error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-sm bg-white/75 dark:bg-slate-900/75 border-b border-slate-200 dark:border-slate-800">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold">Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Error container */}
      <div className="container mx-auto flex-1 overflow-hidden py-6 sm:py-10 flex items-center justify-center">
        <Card className="max-w-md p-6 sm:p-8 text-center space-y-6">
          <div className="mx-auto bg-red-100 dark:bg-red-900/20 p-3 rounded-full w-fit">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Something went wrong</h2>
            <p className="text-muted-foreground">
              {error.message || 'We encountered an error while loading the chat. Please try again.'}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={reset} variant="default">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try again
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Return to homepage</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
} 