"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  /** Explicit URL to navigate to. If not provided, uses browser history. */
  href?: string;
  /** Button label. Default: "Back" */
  label?: string;
  /** Additional CSS classes */
  className?: string;
  /** Show as text link instead of button */
  variant?: "button" | "link";
}

/**
 * Back Button Component
 *
 * Provides consistent back navigation across the application.
 * Essential for user orientation, especially for elderly users
 * who may get lost in deep navigation hierarchies.
 *
 * @example
 * // Use browser history
 * <BackButton />
 *
 * @example
 * // Explicit navigation
 * <BackButton href="/dashboard" label="Back to Dashboard" />
 */
export function BackButton({
  href,
  label = "Back",
  className,
  variant = "button",
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  if (href && variant === "link") {
    return (
      <Link
        href={href}
        className={cn(
          "inline-flex items-center gap-2 text-sm text-muted-foreground",
          "hover:text-foreground transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded",
          className
        )}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {label}
      </Link>
    );
  }

  if (variant === "link") {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "inline-flex items-center gap-2 text-sm text-muted-foreground",
          "hover:text-foreground transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded",
          className
        )}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {label}
      </button>
    );
  }

  if (href) {
    return (
      <Button variant="ghost" size="sm" asChild className={className}>
        <Link href={href}>
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          {label}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={className}
    >
      <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
      {label}
    </Button>
  );
}
