"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw, HelpCircle, Bug } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        {/* Error Illustration */}
        <div className="relative mx-auto mb-8 h-48 w-48">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-32 w-32 rounded-full bg-destructive/10 animate-pulse" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-destructive/20 p-6">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
          Something went wrong
        </h1>
        <p className="mx-auto mt-4 text-muted-foreground">
          We apologize for the inconvenience. An unexpected error occurred while processing your request.
        </p>

        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-6 p-4 rounded-lg bg-muted/50 text-left">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Bug className="h-4 w-4" />
              Error Details
            </div>
            <p className="text-xs text-muted-foreground font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground mt-2">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} className="w-full gap-2 sm:w-auto">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full gap-2 sm:w-auto">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </div>

        {/* Help Link */}
        <div className="mt-12 border-t border-border pt-6">
          <Link
            href="/help"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <HelpCircle className="h-4 w-4" />
            Need help? Visit our support center
          </Link>
        </div>
      </div>
    </div>
  );
}
