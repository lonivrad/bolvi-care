"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  MessageSquare,
  CreditCard,
  Star,
  CheckCircle,
  AlertCircle,
  Heart,
  UserPlus,
  FileText,
  Bell,
  Shield,
  TrendingUp,
  ArrowRight,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ActivityItem {
  id: string;
  type:
    | "booking"
    | "message"
    | "payment"
    | "review"
    | "milestone"
    | "alert"
    | "verification"
    | "referral";
  title: string;
  description: string;
  timestamp: string;
  relativeTime: string;
  actor?: {
    name: string;
    photo: string;
    role?: string;
  };
  metadata?: {
    amount?: number;
    rating?: number;
    status?: string;
    link?: string;
  };
  isNew?: boolean;
}

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "booking",
    title: "Visit Completed",
    description: "Maria Rodriguez completed a 4-hour visit with Eleanor",
    timestamp: "2024-01-25T14:00:00",
    relativeTime: "2 hours ago",
    actor: {
      name: "Maria Rodriguez",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
      role: "Caregiver",
    },
    metadata: { amount: 140, link: "/visit/b-1" },
    isNew: true,
  },
  {
    id: "2",
    type: "message",
    title: "New Message",
    description: "Maria sent an update about today's visit",
    timestamp: "2024-01-25T15:30:00",
    relativeTime: "30 min ago",
    actor: {
      name: "Maria Rodriguez",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
    },
    metadata: { link: "/messages/mt-1" },
    isNew: true,
  },
  {
    id: "3",
    type: "review",
    title: "Review Received",
    description: "You received a 5-star review from the Martinez family",
    timestamp: "2024-01-24T10:00:00",
    relativeTime: "Yesterday",
    actor: {
      name: "Martinez Family",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    },
    metadata: { rating: 5 },
  },
  {
    id: "4",
    type: "payment",
    title: "Payment Processed",
    description: "Payment for last week's visits has been processed",
    timestamp: "2024-01-24T09:00:00",
    relativeTime: "Yesterday",
    metadata: { amount: 420, status: "completed" },
  },
  {
    id: "5",
    type: "milestone",
    title: "Milestone Reached!",
    description: "You've completed 50 visits on Bolvi Care",
    timestamp: "2024-01-23T12:00:00",
    relativeTime: "2 days ago",
    metadata: { status: "achievement" },
  },
  {
    id: "6",
    type: "verification",
    title: "Background Check Verified",
    description: "Your annual background check has been completed",
    timestamp: "2024-01-22T15:00:00",
    relativeTime: "3 days ago",
    metadata: { status: "verified" },
  },
  {
    id: "7",
    type: "booking",
    title: "New Booking Request",
    description: "The Thompson family requested a booking for next Tuesday",
    timestamp: "2024-01-22T11:00:00",
    relativeTime: "3 days ago",
    actor: {
      name: "Thompson Family",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    },
    metadata: { link: "/dashboard/caregiver/requests" },
  },
  {
    id: "8",
    type: "referral",
    title: "Referral Bonus Earned",
    description: "Your referral Jennifer Wong just completed their first booking",
    timestamp: "2024-01-21T14:00:00",
    relativeTime: "4 days ago",
    actor: {
      name: "Jennifer Wong",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
    metadata: { amount: 50 },
  },
];

const typeConfig = {
  booking: {
    icon: Calendar,
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    borderColor: "border-blue-200 dark:border-blue-800/50",
  },
  message: {
    icon: MessageSquare,
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    borderColor: "border-purple-200 dark:border-purple-800/50",
  },
  payment: {
    icon: CreditCard,
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    borderColor: "border-green-200 dark:border-green-800/50",
  },
  review: {
    icon: Star,
    color: "text-amber-500",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    borderColor: "border-amber-200 dark:border-amber-800/50",
  },
  milestone: {
    icon: TrendingUp,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
  },
  alert: {
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    borderColor: "border-red-200 dark:border-red-800/50",
  },
  verification: {
    icon: Shield,
    color: "text-emerald-500",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    borderColor: "border-emerald-200 dark:border-emerald-800/50",
  },
  referral: {
    icon: UserPlus,
    color: "text-pink-500",
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
    borderColor: "border-pink-200 dark:border-pink-800/50",
  },
};

interface ActivityFeedProps {
  userType?: "family" | "caregiver";
  showFilters?: boolean;
  maxItems?: number;
  variant?: "full" | "compact";
}

export function ActivityFeed({
  userType = "family",
  showFilters = true,
  maxItems,
  variant = "full",
}: ActivityFeedProps) {
  const [filter, setFilter] = useState<string>("all");
  const [activities] = useState(mockActivities);

  const filteredActivities = activities
    .filter((a) => filter === "all" || a.type === filter)
    .slice(0, maxItems);

  const ActivityItemComponent = ({ activity }: { activity: ActivityItem }) => {
    const config = typeConfig[activity.type];
    const Icon = config.icon;

    return (
      <div
        className={cn(
          "relative flex gap-4 p-4 rounded-lg border transition-all",
          activity.isNew && "bg-primary/5 border-primary/20",
          !activity.isNew && "border-border hover:border-muted-foreground/20 hover:bg-muted/30"
        )}
      >
        {/* Timeline connector for full variant */}
        {variant === "full" && (
          <div className="absolute left-[31px] top-[60px] bottom-[-16px] w-px bg-border last:hidden" />
        )}

        {/* Icon */}
        <div className="relative z-10 shrink-0">
          {activity.actor ? (
            <div className="relative">
              <Image
                src={activity.actor.photo}
                alt={activity.actor.name}
                width={40}
                height={40}
                className="rounded-full ring-2 ring-background"
              />
              <div
                className={cn(
                  "absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center ring-2 ring-background",
                  config.bgColor
                )}
              >
                <Icon className={cn("h-2.5 w-2.5", config.color)} />
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center",
                config.bgColor
              )}
            >
              <Icon className={cn("h-5 w-5", config.color)} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm text-foreground">
                  {activity.title}
                </p>
                {activity.isNew && (
                  <Badge
                    variant="secondary"
                    className="h-5 px-1.5 text-[10px] bg-primary/10 text-primary"
                  >
                    New
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {activity.description}
              </p>

              {/* Metadata */}
              {activity.metadata && (
                <div className="flex items-center gap-3 mt-2">
                  {activity.metadata.amount !== undefined && (
                    <Badge variant="outline" className="text-xs">
                      ${activity.metadata.amount}
                    </Badge>
                  )}
                  {activity.metadata.rating && (
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-3 w-3",
                            i < activity.metadata!.rating!
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30"
                          )}
                        />
                      ))}
                    </div>
                  )}
                  {activity.metadata.status === "verified" && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {activity.metadata.status === "achievement" && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-primary/10 text-primary"
                    >
                      🎉 Achievement
                    </Badge>
                  )}
                  {activity.metadata.link && (
                    <Link href={activity.metadata.link}>
                      <Button size="sm" variant="ghost" className="h-6 text-xs">
                        View
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Time & Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {activity.relativeTime}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Mark as read</DropdownMenuItem>
                  <DropdownMenuItem>Hide this activity</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (variant === "compact") {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Recent Activity</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/activity">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredActivities.slice(0, 5).map((activity) => (
            <ActivityItemComponent key={activity.id} activity={activity} />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Activity Feed</CardTitle>
          {showFilters && (
            <Tabs value={filter} onValueChange={setFilter} className="w-auto">
              <TabsList className="h-8">
                <TabsTrigger value="all" className="text-xs px-2">
                  All
                </TabsTrigger>
                <TabsTrigger value="booking" className="text-xs px-2">
                  Bookings
                </TabsTrigger>
                <TabsTrigger value="payment" className="text-xs px-2">
                  Payments
                </TabsTrigger>
                <TabsTrigger value="message" className="text-xs px-2">
                  Messages
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] -mx-2 px-2">
          <div className="space-y-4">
            {filteredActivities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="font-medium text-muted-foreground">
                  No activity to show
                </p>
                <p className="text-sm text-muted-foreground">
                  Your recent activity will appear here
                </p>
              </div>
            ) : (
              filteredActivities.map((activity) => (
                <ActivityItemComponent key={activity.id} activity={activity} />
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
