"use client";

import { cn } from "@/lib/utils";

interface SkipLinkProps {
  href?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Skip Link Component
 *
 * Provides a skip link for keyboard users to bypass navigation
 * and jump directly to main content. Essential for accessibility.
 *
 * @example
 * <SkipLink href="#main-content">Skip to main content</SkipLink>
 */
export function SkipLink({
  href = "#main-content",
  children = "Skip to main content",
  className,
}: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        // Visually hidden by default
        "sr-only",
        // Show on focus with prominent styling
        "focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100]",
        "focus:bg-primary focus:text-primary-foreground",
        "focus:px-4 focus:py-2 focus:rounded-md",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "font-medium text-sm",
        className
      )}
    >
      {children}
    </a>
  );
}

/**
 * Skip Links Group
 *
 * Provides multiple skip links for different sections of the page.
 * Useful for complex layouts with multiple main areas.
 */
interface SkipLinksProps {
  links?: Array<{ href: string; label: string }>;
}

export function SkipLinks({ links }: SkipLinksProps) {
  const defaultLinks = [
    { href: "#main-content", label: "Skip to main content" },
    { href: "#navigation", label: "Skip to navigation" },
  ];

  const skipLinks = links || defaultLinks;

  return (
    <div className="skip-links">
      {skipLinks.map((link) => (
        <SkipLink key={link.href} href={link.href}>
          {link.label}
        </SkipLink>
      ))}
    </div>
  );
}
