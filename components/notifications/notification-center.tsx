"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell,
  Calendar,
  MessageSquare,
  CreditCard,
  Star,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Heart,
  Gift,
  Trash2,
  MoreHorizontal,
  Settings,
  BellOff,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Notification {
  id: string;
  type: "booking" | "message" | "payment" | "review" | "alert" | "promo" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  avatar?: string;
  priority?: "low" | "medium" | "high";
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "booking",
    title: "Booking Confirmed",
    message: "Your visit with Sarah Martinez is confirmed for tomorrow at 9:00 AM.",
    timestamp: "5 min ago",
    read: false,
    actionUrl: "/dashboard/family/bookings",
    actionLabel: "View Booking",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
    priority: "high",
  },
  {
    id: "2",
    type: "message",
    title: "New Message",
    message: "Sarah Martinez sent you a message about tomorrow's visit.",
    timestamp: "15 min ago",
    read: false,
    actionUrl: "/messages",
    actionLabel: "Reply",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    type: "review",
    title: "Leave a Review",
    message: "How was your visit with Emily Chen? Share your experience to help other families.",
    timestamp: "2 hours ago",
    read: false,
    actionUrl: "/review",
    actionLabel: "Write Review",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: "4",
    type: "payment",
    title: "Payment Processed",
    message: "Your payment of $84.00 for last week's visits has been processed.",
    timestamp: "Yesterday",
    read: true,
    actionUrl: "/dashboard/family/bookings",
    actionLabel: "View Receipt",
  },
  {
    id: "5",
    type: "promo",
    title: "Refer & Earn $50",
    message: "Share Bolvi Care with friends and earn $50 for each successful referral!",
    timestamp: "2 days ago",
    read: true,
    actionUrl: "/dashboard/family/referrals",
    actionLabel: "Start Referring",
    priority: "low",
  },
  {
    id: "6",
    type: "alert",
    title: "Background Check Complete",
    message: "Good news! Maria Rodriguez has passed her background check verification.",
    timestamp: "3 days ago",
    read: true,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
  {
    id: "7",
    type: "system",
    title: "Profile Update Reminder",
    message: "Complete your profile to get better caregiver matches and faster bookings.",
    timestamp: "1 week ago",
    read: true,
    actionUrl: "/settings",
    actionLabel: "Complete Profile",
    priority: "medium",
  },
];

const typeConfig = {
  booking: {
    icon: Calendar,
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  message: {
    icon: MessageSquare,
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
  payment: {
    icon: CreditCard,
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  review: {
    icon: Star,
    color: "text-amber-500",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
  },
  alert: {
    icon: Shield,
    color: "text-emerald-500",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  promo: {
    icon: Gift,
    color: "text-pink-500",
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
  },
  system: {
    icon: Bell,
    color: "text-gray-500",
    bgColor: "bg-gray-100 dark:bg-gray-900/30",
  },
};

interface NotificationCenterProps {
  variant?: "full" | "dropdown";
  onClose?: () => void;
}

export function NotificationCenter({ variant = "full", onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !n.read;
    return n.type === activeTab;
  });

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const NotificationItem = ({ notification }: { notification: Notification }) => {
    const config = typeConfig[notification.type];
    const Icon = config.icon;

    return (
      <div
        className={cn(
          "flex gap-3 p-4 border-b last:border-b-0 transition-colors",
          !notification.read && "bg-primary/5",
          "hover:bg-muted/50"
        )}
      >
        <div className="shrink-0">
          {notification.avatar ? (
            <div className="relative">
              <Image
                src={notification.avatar}
                alt=""
                width={40}
                height={40}
                className="rounded-full"
              />
              <div
                className={cn(
                  "absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center",
                  config.bgColor
                )}
              >
                <Icon className={cn("h-3 w-3", config.color)} />
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
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p
                className={cn(
                  "font-medium text-sm",
                  !notification.read && "text-foreground",
                  notification.read && "text-muted-foreground"
                )}
              >
                {notification.title}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {notification.message}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!notification.read && (
                  <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                    <Check className="mr-2 h-4 w-4" />
                    Mark as read
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => deleteNotification(notification.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-muted-foreground">
              {notification.timestamp}
            </span>
            {notification.actionUrl && (
              <Link href={notification.actionUrl}>
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  {notification.actionLabel}
                </Button>
              </Link>
            )}
            {!notification.read && (
              <span className="h-2 w-2 rounded-full bg-primary" />
            )}
          </div>
        </div>
      </div>
    );
  };

  if (variant === "dropdown") {
    return (
      <div className="w-[380px]">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <span className="font-semibold">Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7"
                onClick={markAllAsRead}
              >
                Mark all read
              </Button>
            )}
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BellOff className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">No notifications</p>
            </div>
          ) : (
            notifications.slice(0, 5).map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          )}
        </ScrollArea>
        <div className="p-3 border-t">
          <Link href="/notifications">
            <Button variant="ghost" className="w-full">
              View all notifications
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge>{unreadCount} new</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <Check className="mr-2 h-4 w-4" />
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAll}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear all
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-4">
            <TabsTrigger value="all">
              All
              {notifications.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 h-5 px-1.5">
                  {notifications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {unreadCount > 0 && (
                <Badge className="ml-1.5 h-5 px-1.5">{unreadCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="booking">Bookings</TabsTrigger>
            <TabsTrigger value="message">Messages</TabsTrigger>
            <TabsTrigger value="payment">Payments</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] -mx-6">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                <BellOff className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">
                  {activeTab === "unread"
                    ? "No unread notifications"
                    : "No notifications in this category"}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))
            )}
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}
