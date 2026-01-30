"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

/**
 * Breadcrumb Navigation Component
 *
 * Provides hierarchical navigation showing the user's current location
 * within the site. Essential for orientation, especially for elderly users.
 *
 * @example
 * <Breadcrumb
 *   items={[
 *     { label: "Dashboard", href: "/dashboard" },
 *     { label: "Bookings", href: "/dashboard/bookings" },
 *     { label: "Booking Details" }
 *   ]}
 * />
 */
export function Breadcrumb({ items, showHome = true, className }: BreadcrumbProps) {
  const allItems = showHome
    ? [{ label: "Home", href: "/" }, ...items]
    : items;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-sm", className)}
    >
      <ol className="flex items-center gap-1 flex-wrap" role="list">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const isHome = index === 0 && showHome;

          return (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight
                  className="h-4 w-4 text-muted-foreground flex-shrink-0"
                  aria-hidden="true"
                />
              )}
              {isLast ? (
                <span
                  className="text-foreground font-medium"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    "text-muted-foreground hover:text-foreground transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded",
                    "inline-flex items-center gap-1"
                  )}
                >
                  {isHome && <Home className="h-4 w-4" aria-hidden="true" />}
                  <span className={isHome ? "sr-only sm:not-sr-only" : ""}>
                    {item.label}
                  </span>
                </Link>
              ) : (
                <span className="text-muted-foreground">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
