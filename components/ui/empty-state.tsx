"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  MessageSquare,
  Search,
  FileText,
  Bell,
  CreditCard,
  Heart,
  Star,
  Clock,
  Briefcase,
  Activity,
  TrendingUp,
  Settings,
  HelpCircle,
  Plus,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateType =
  | "bookings"
  | "caregivers"
  | "messages"
  | "notifications"
  | "search"
  | "reviews"
  | "payments"
  | "favorites"
  | "care-recipients"
  | "jobs"
  | "earnings"
  | "activity"
  | "analytics"
  | "settings"
  | "generic";

interface EmptyStateConfig {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

const emptyStateConfigs: Record<EmptyStateType, EmptyStateConfig> = {
  bookings: {
    icon: Calendar,
    title: "No bookings yet",
    description: "When you book a caregiver, your upcoming and past visits will appear here.",
    actionLabel: "Find a Caregiver",
    actionHref: "/caregivers",
  },
  caregivers: {
    icon: Users,
    title: "No caregivers found",
    description: "Try adjusting your search filters or browse all available caregivers in your area.",
    actionLabel: "Clear Filters",
    secondaryLabel: "Browse All",
    secondaryHref: "/caregivers",
  },
  messages: {
    icon: MessageSquare,
    title: "No messages yet",
    description: "Your conversations with caregivers and families will appear here.",
    actionLabel: "Start a Conversation",
    actionHref: "/caregivers",
  },
  notifications: {
    icon: Bell,
    title: "All caught up!",
    description: "You don't have any new notifications right now.",
  },
  search: {
    icon: Search,
    title: "No results found",
    description: "We couldn't find what you're looking for. Try different keywords or filters.",
    actionLabel: "Clear Search",
  },
  reviews: {
    icon: Star,
    title: "No reviews yet",
    description: "Reviews from families will appear here once you complete visits.",
    actionLabel: "View Job Requests",
    actionHref: "/dashboard/caregiver/requests",
  },
  payments: {
    icon: CreditCard,
    title: "No payment history",
    description: "Your payment transactions will be recorded here once you start booking care.",
    actionLabel: "Book Care",
    actionHref: "/caregivers",
  },
  favorites: {
    icon: Heart,
    title: "No favorites yet",
    description: "Save caregivers you like by clicking the heart icon on their profile.",
    actionLabel: "Browse Caregivers",
    actionHref: "/caregivers",
  },
  "care-recipients": {
    icon: Users,
    title: "No care recipients added",
    description: "Add the loved ones you're arranging care for to get personalized caregiver matches.",
    actionLabel: "Add Care Recipient",
    actionHref: "/dashboard/family/care-recipients/new",
  },
  jobs: {
    icon: Briefcase,
    title: "No jobs yet",
    description: "Accepted job requests and ongoing care assignments will appear here.",
    actionLabel: "View Requests",
    actionHref: "/dashboard/caregiver/requests",
  },
  earnings: {
    icon: TrendingUp,
    title: "No earnings yet",
    description: "Complete visits to start earning. Your payment history will be tracked here.",
    actionLabel: "Update Availability",
    actionHref: "/dashboard/caregiver/availability",
  },
  activity: {
    icon: Activity,
    title: "No recent activity",
    description: "Your bookings, messages, and other activity will be recorded here.",
  },
  analytics: {
    icon: TrendingUp,
    title: "Not enough data",
    description: "Complete more visits to unlock detailed analytics and insights.",
    actionLabel: "Find Caregivers",
    actionHref: "/caregivers",
  },
  settings: {
    icon: Settings,
    title: "Settings not configured",
    description: "Set up your preferences to personalize your experience.",
    actionLabel: "Configure Settings",
  },
  generic: {
    icon: FileText,
    title: "Nothing here yet",
    description: "Content will appear here once available.",
  },
};

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  icon?: React.ElementType;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  secondaryHref?: string;
  onSecondaryAction?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function EmptyState({
  type = "generic",
  title,
  description,
  icon,
  actionLabel,
  actionHref,
  onAction,
  secondaryLabel,
  secondaryHref,
  onSecondaryAction,
  className,
  size = "md",
}: EmptyStateProps) {
  const config = emptyStateConfigs[type];
  const Icon = icon || config.icon;
  const displayTitle = title || config.title;
  const displayDescription = description || config.description;
  const displayActionLabel = actionLabel || config.actionLabel;
  const displayActionHref = actionHref || config.actionHref;
  const displaySecondaryLabel = secondaryLabel || config.secondaryLabel;
  const displaySecondaryHref = secondaryHref || config.secondaryHref;

  const sizeClasses = {
    sm: {
      container: "py-6",
      icon: "h-10 w-10",
      iconInner: "h-5 w-5",
      title: "text-sm",
      description: "text-xs",
    },
    md: {
      container: "py-12",
      icon: "h-16 w-16",
      iconInner: "h-8 w-8",
      title: "text-base",
      description: "text-sm",
    },
    lg: {
      container: "py-16",
      icon: "h-20 w-20",
      iconInner: "h-10 w-10",
      title: "text-lg",
      description: "text-base",
    },
  };

  const sizes = sizeClasses[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        sizes.container,
        className
      )}
    >
      <div
        className={cn(
          "rounded-full bg-muted flex items-center justify-center",
          sizes.icon
        )}
      >
        <Icon
          className={cn("text-muted-foreground/50", sizes.iconInner)}
        />
      </div>
      <h3 className={cn("mt-4 font-semibold text-foreground", sizes.title)}>
        {displayTitle}
      </h3>
      <p
        className={cn(
          "mt-2 text-muted-foreground max-w-sm",
          sizes.description
        )}
      >
        {displayDescription}
      </p>
      {(displayActionLabel || displaySecondaryLabel) && (
        <div className="mt-6 flex items-center gap-3">
          {displayActionLabel && (
            displayActionHref ? (
              <Button asChild>
                <Link href={displayActionHref}>
                  {displayActionLabel}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : onAction ? (
              <Button onClick={onAction}>
                {displayActionLabel}
              </Button>
            ) : null
          )}
          {displaySecondaryLabel && (
            displaySecondaryHref ? (
              <Button variant="outline" asChild>
                <Link href={displaySecondaryHref}>
                  {displaySecondaryLabel}
                </Link>
              </Button>
            ) : onSecondaryAction ? (
              <Button variant="outline" onClick={onSecondaryAction}>
                {displaySecondaryLabel}
              </Button>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}

// Specialized empty state for lists with add functionality
interface EmptyListStateProps {
  title: string;
  description: string;
  icon?: React.ElementType;
  addLabel: string;
  onAdd?: () => void;
  addHref?: string;
}

export function EmptyListState({
  title,
  description,
  icon: Icon = Plus,
  addLabel,
  onAdd,
  addHref,
}: EmptyListStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>
      {addHref ? (
        <Button className="mt-6" asChild>
          <Link href={addHref}>
            <Plus className="mr-2 h-4 w-4" />
            {addLabel}
          </Link>
        </Button>
      ) : onAdd ? (
        <Button className="mt-6" onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          {addLabel}
        </Button>
      ) : null}
    </div>
  );
}
