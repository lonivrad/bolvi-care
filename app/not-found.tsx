"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center">
        {/* 404 Illustration */}
        <div className="relative mx-auto mb-8 h-48 w-48">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-[120px] font-bold text-primary/10">
              404
            </span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-primary/10 p-6">
              <Search className="h-12 w-12 text-primary" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
          Page Not Found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
          It might have been moved, deleted, or never existed.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button className="w-full gap-2 sm:w-auto">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Link href="/caregivers">
            <Button variant="outline" className="w-full gap-2 sm:w-auto">
              <Search className="h-4 w-4" />
              Find Caregivers
            </Button>
          </Link>
        </div>

        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Go back to previous page
        </button>

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
