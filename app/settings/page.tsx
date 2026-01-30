"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/lib/store";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Key,
  Smartphone,
  Mail,
  Globe,
  Moon,
  LogOut,
  Trash2,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { familyUser, caregiverUser, logout, role } = useAuthStore();
  const user = role === "caregiver" ? caregiverUser : familyUser;

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    bookingUpdates: true,
    messages: true,
    marketing: false,
  });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your account settings and preferences
          </p>

          <Tabs defaultValue="profile" className="mt-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal details and profile photo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Photo */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Image
                        src={user?.photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"}
                        alt="Profile"
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <Button variant="outline">Change Photo</Button>
                      <p className="mt-2 text-xs text-muted-foreground">
                        JPG, PNG or GIF. Max 2MB
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Form Fields */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue={user?.name.split(" ")[0]} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue={user?.name.split(" ")[1]} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={user?.email} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" defaultValue={user?.phone} />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" defaultValue="San Francisco, CA" />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>
                    Customize your app experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Language</p>
                        <p className="text-sm text-muted-foreground">
                          Select your preferred language
                        </p>
                      </div>
                    </div>
                    <Select defaultValue="en">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Moon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-sm text-muted-foreground">
                          Toggle dark theme
                        </p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose how you want to be notified
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Channels</h3>
                    <div className="space-y-4">
                      {[
                        { key: "email", icon: Mail, label: "Email notifications", desc: "Receive updates via email" },
                        { key: "push", icon: Bell, label: "Push notifications", desc: "Receive push notifications on your device" },
                        { key: "sms", icon: Smartphone, label: "SMS notifications", desc: "Receive text message alerts" },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <item.icon className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{item.label}</p>
                              <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                          </div>
                          <Switch
                            checked={notifications[item.key as keyof typeof notifications]}
                            onCheckedChange={(checked) =>
                              setNotifications({ ...notifications, [item.key]: checked })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">Activity</h3>
                    <div className="space-y-4">
                      {[
                        { key: "bookingUpdates", label: "Booking updates", desc: "New bookings, cancellations, and changes" },
                        { key: "messages", label: "Messages", desc: "New messages from caregivers/families" },
                        { key: "marketing", label: "Marketing", desc: "Tips, promotions, and news" },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{item.label}</p>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                          <Switch
                            checked={notifications[item.key as keyof typeof notifications]}
                            onCheckedChange={(checked) =>
                              setNotifications({ ...notifications, [item.key]: checked })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Change your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button>Update Password</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Key className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Enable 2FA</p>
                        <p className="text-sm text-muted-foreground">
                          Use an authenticator app for additional security
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>
                    Irreversible and destructive actions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Sign out everywhere</p>
                      <p className="text-sm text-muted-foreground">
                        Log out of all devices
                      </p>
                    </div>
                    <Button variant="outline" onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out All
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Delete account</p>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>
                    Manage your payment methods
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-16 items-center justify-center rounded bg-muted">
                        <CreditCard className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-muted-foreground">Expires 12/26</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Default</Badge>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                  <Button variant="outline">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>
                    View your past transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { date: "Jan 28, 2025", desc: "Visit - Sarah Martinez", amount: "$140.00" },
                      { date: "Jan 25, 2025", desc: "Visit - Emily Chen", amount: "$95.00" },
                      { date: "Jan 20, 2025", desc: "Visit - Sarah Martinez", amount: "$175.00" },
                    ].map((tx, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium">{tx.desc}</p>
                          <p className="text-sm text-muted-foreground">{tx.date}</p>
                        </div>
                        <span className="font-medium">{tx.amount}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="link" className="mt-4 px-0">
                    View all transactions
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
