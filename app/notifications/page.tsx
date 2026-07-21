"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Calendar,
  MessageSquare,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Settings,
  Trash2,
  Check,
  Star,
  Loader2,
} from "lucide-react";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: React.ElementType;
  color: string;
}

const getIconForType = (type: string) => {
  switch (type) {
    case "booking":
      return { icon: Calendar, color: "text-blue-500" };
    case "message":
      return { icon: MessageSquare, color: "text-green-500" };
    case "payment":
      return { icon: DollarSign, color: "text-emerald-500" };
    case "reminder":
      return { icon: Clock, color: "text-yellow-500" };
    case "review":
      return { icon: Star, color: "text-purple-500" };
    case "alert":
      return { icon: AlertCircle, color: "text-orange-500" };
    default:
      return { icon: Bell, color: "text-gray-500" };
  }
};

const notificationSettings = [
  {
    category: "Bookings",
    settings: [
      { id: "booking_confirmed", label: "Booking confirmations", enabled: true },
      { id: "booking_reminder", label: "Visit reminders", enabled: true },
      { id: "booking_cancelled", label: "Cancellation alerts", enabled: true },
    ],
  },
  {
    category: "Messages",
    settings: [
      { id: "new_message", label: "New messages", enabled: true },
      { id: "message_reply", label: "Message replies", enabled: true },
    ],
  },
  {
    category: "Payments",
    settings: [
      { id: "payment_processed", label: "Payment confirmations", enabled: true },
      { id: "payment_failed", label: "Payment failures", enabled: true },
      { id: "pay_period", label: "Pay period & pay date reminders", enabled: false },
    ],
  },
  {
    category: "Care Updates",
    settings: [
      { id: "visit_summary", label: "Visit summaries", enabled: true },
      { id: "care_plan_update", label: "Care plan updates", enabled: true },
      { id: "caregiver_notes", label: "Caregiver notes", enabled: true },
    ],
  },
  {
    category: "Marketing",
    settings: [
      { id: "promotions", label: "Promotions and offers", enabled: false },
      { id: "newsletter", label: "Newsletter", enabled: false },
      { id: "tips", label: "Care tips and resources", enabled: true },
    ],
  },
];

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const [notificationList, setNotificationList] = useState<Notification[]>([]);
  const [settings, setSettings] = useState(notificationSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch notifications from API
  useEffect(() => {
    async function fetchNotifications() {
      if (status !== "authenticated") {
        setIsLoading(false);
        return;
      }

      try {
        // TODO: Replace with actual API call
        // const res = await fetch("/api/notifications");
        // if (res.ok) {
        //   const data = await res.json();
        //   setNotificationList(data.notifications);
        // }

        // For now, show empty state for new users
        setNotificationList([]);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchNotifications();
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [status]);

  const unreadCount = notificationList.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotificationList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    // TODO: Call API to mark as read
  };

  const markAllAsRead = () => {
    setNotificationList((prev) => prev.map((n) => ({ ...n, read: true })));
    // TODO: Call API to mark all as read
  };

  const deleteNotification = (id: string) => {
    setNotificationList((prev) => prev.filter((n) => n.id !== id));
    // TODO: Call API to delete notification
  };

  const toggleSetting = (categoryIndex: number, settingIndex: number) => {
    setSettings((prev) => {
      const newSettings = [...prev];
      newSettings[categoryIndex].settings[settingIndex].enabled =
        !newSettings[categoryIndex].settings[settingIndex].enabled;
      return newSettings;
    });
    // TODO: Call API to save preference
  };

  if (status === "loading" || isLoading) {
    return (
      <>
        <Header />
        <main className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                : "You're all caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">
              All
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {notificationList.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-4">
                    <Bell className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 font-semibold text-lg">No notifications yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                    When you receive booking updates, messages, or other important alerts, they'll appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {notificationList.map((notification) => {
                  const { icon: Icon, color } = getIconForType(notification.type);
                  return (
                    <Card
                      key={notification.id}
                      className={`transition-colors ${
                        !notification.read ? "bg-primary/5 border-primary/20" : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full bg-muted ${color}`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium text-foreground">
                                  {notification.title}
                                  {!notification.read && (
                                    <Badge variant="default" className="ml-2 text-xs">
                                      New
                                    </Badge>
                                  )}
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {notification.message}
                                </p>
                                <p className="mt-2 text-xs text-muted-foreground">
                                  {notification.time}
                                </p>
                              </div>
                              <div className="flex gap-1">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteNotification(notification.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="unread" className="mt-6">
            {notificationList.filter((n) => !n.read).length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                  <h3 className="mt-4 font-medium text-foreground">All caught up!</h3>
                  <p className="text-sm text-muted-foreground">
                    You have no unread notifications.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {notificationList
                  .filter((n) => !n.read)
                  .map((notification) => {
                    const { icon: Icon, color } = getIconForType(notification.type);
                    return (
                      <Card
                        key={notification.id}
                        className="bg-primary/5 border-primary/20"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full bg-muted ${color}`}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-medium text-foreground">
                                    {notification.title}
                                  </h3>
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    {notification.message}
                                  </p>
                                  <p className="mt-2 text-xs text-muted-foreground">
                                    {notification.time}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {settings.map((category, categoryIndex) => (
                  <div key={category.category}>
                    <h3 className="font-medium text-foreground mb-3">
                      {category.category}
                    </h3>
                    <div className="space-y-3">
                      {category.settings.map((setting, settingIndex) => (
                        <div
                          key={setting.id}
                          className="flex items-center justify-between"
                        >
                          <Label
                            htmlFor={setting.id}
                            className="text-sm text-muted-foreground"
                          >
                            {setting.label}
                          </Label>
                          <Switch
                            id={setting.id}
                            checked={setting.enabled}
                            onCheckedChange={() =>
                              toggleSetting(categoryIndex, settingIndex)
                            }
                          />
                        </div>
                      ))}
                    </div>
                    {categoryIndex < settings.length - 1 && (
                      <div className="mt-4 border-b border-border" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </>
  );
}
