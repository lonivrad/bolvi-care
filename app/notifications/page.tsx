"use client";

import { useState } from "react";
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
} from "lucide-react";

const notifications = [
  {
    id: "n-1",
    type: "booking",
    title: "Booking Confirmed",
    message: "Your booking with Maria Rodriguez for tomorrow at 9:00 AM has been confirmed.",
    time: "5 minutes ago",
    read: false,
    icon: Calendar,
    color: "text-blue-500",
  },
  {
    id: "n-2",
    type: "message",
    title: "New Message",
    message: "Maria Rodriguez sent you a message about tomorrow's visit.",
    time: "15 minutes ago",
    read: false,
    icon: MessageSquare,
    color: "text-green-500",
  },
  {
    id: "n-3",
    type: "payment",
    title: "Payment Processed",
    message: "Your payment of $185.00 for the visit on March 1st has been processed.",
    time: "1 hour ago",
    read: false,
    icon: DollarSign,
    color: "text-emerald-500",
  },
  {
    id: "n-4",
    type: "reminder",
    title: "Visit Reminder",
    message: "Reminder: Sarah Thompson's visit is scheduled for Saturday at 8:00 AM.",
    time: "2 hours ago",
    read: true,
    icon: Clock,
    color: "text-yellow-500",
  },
  {
    id: "n-5",
    type: "review",
    title: "Leave a Review",
    message: "How was your recent visit with David Kim? Share your feedback.",
    time: "1 day ago",
    read: true,
    icon: Star,
    color: "text-purple-500",
  },
  {
    id: "n-6",
    type: "alert",
    title: "Care Plan Update",
    message: "Eleanor's care plan has been updated with new medication reminders.",
    time: "2 days ago",
    read: true,
    icon: AlertCircle,
    color: "text-orange-500",
  },
  {
    id: "n-7",
    type: "booking",
    title: "Booking Request",
    message: "Your booking request for next week has been sent to Jennifer Lee.",
    time: "3 days ago",
    read: true,
    icon: Calendar,
    color: "text-blue-500",
  },
];

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
      { id: "payout_sent", label: "Payout notifications", enabled: false },
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
  const [notificationList, setNotificationList] = useState(notifications);
  const [settings, setSettings] = useState(notificationSettings);

  const unreadCount = notificationList.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotificationList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotificationList((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotificationList((prev) => prev.filter((n) => n.id !== id));
  };

  const toggleSetting = (categoryIndex: number, settingIndex: number) => {
    setSettings((prev) => {
      const newSettings = [...prev];
      newSettings[categoryIndex].settings[settingIndex].enabled =
        !newSettings[categoryIndex].settings[settingIndex].enabled;
      return newSettings;
    });
  };

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
          <div className="space-y-2">
            {notificationList.map((notification) => {
              const Icon = notification.icon;
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
                        className={`flex h-10 w-10 items-center justify-center rounded-full bg-muted ${notification.color}`}
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
        </TabsContent>

        <TabsContent value="unread" className="mt-6">
          <div className="space-y-2">
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
              notificationList
                .filter((n) => !n.read)
                .map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <Card
                      key={notification.id}
                      className="bg-primary/5 border-primary/20"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full bg-muted ${notification.color}`}
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
                })
            )}
          </div>
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
