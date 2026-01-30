"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Shield,
  CreditCard,
  Bell,
  Lock,
  CheckCircle,
  Upload,
} from "lucide-react";

const userProfile = {
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  phone: "(206) 555-0123",
  photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  address: {
    street: "123 Pine Street",
    city: "Seattle",
    state: "WA",
    zip: "98101",
  },
  role: "family",
  memberSince: "January 2024",
  verified: true,
  paymentMethods: [
    {
      id: "pm-1",
      type: "visa",
      last4: "4242",
      expiry: "12/26",
      isDefault: true,
    },
    {
      id: "pm-2",
      type: "mastercard",
      last4: "8888",
      expiry: "08/25",
      isDefault: false,
    },
  ],
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(userProfile);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="mr-2 h-4 w-4" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="verification">
            <Shield className="mr-2 h-4 w-4" />
            Verification
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Personal Information</CardTitle>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Photo */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img
                    src={profile.photo}
                    alt={profile.name}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                  {isEditing && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{profile.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Member since {profile.memberSince}
                  </p>
                  {profile.verified && (
                    <Badge className="mt-1" variant="secondary">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={profile.name}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={profile.email}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={profile.phone}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Account Type</Label>
                  <Input
                    value={profile.role === "family" ? "Family Account" : "Caregiver"}
                    disabled
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <Label className="text-base font-medium">Address</Label>
                <div className="mt-2 grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Label className="text-sm">Street Address</Label>
                    <Input
                      value={profile.address.street}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">City</Label>
                    <Input
                      value={profile.address.city}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">State</Label>
                      <Input
                        value={profile.address.state}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">ZIP Code</Label>
                      <Input
                        value={profile.address.zip}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Current Password</Label>
                <Input type="password" className="mt-1" />
              </div>
              <div>
                <Label>New Password</Label>
                <Input type="password" className="mt-1" />
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <Input type="password" className="mt-1" />
              </div>
              <Button>Update Password</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Add an extra layer of security to your account by enabling
                two-factor authentication.
              </p>
              <Button variant="outline">Enable 2FA</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium">Current Session</p>
                    <p className="text-sm text-muted-foreground">
                      Seattle, WA • Chrome on MacOS
                    </p>
                  </div>
                  <Badge variant="secondary">Active Now</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium">iPhone 14</p>
                    <p className="text-sm text-muted-foreground">
                      Seattle, WA • iOS App
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Revoke
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Payment Methods</CardTitle>
                <Button>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Add Card
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                        <CreditCard className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium capitalize">
                          {method.type} •••• {method.last4}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Expires {method.expiry}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {method.isDefault && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: "Mar 1, 2024", amount: "$185.00", status: "Paid" },
                  { date: "Feb 25, 2024", amount: "$240.00", status: "Paid" },
                  { date: "Feb 18, 2024", amount: "$92.50", status: "Paid" },
                ].map((invoice, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-border pb-4 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{invoice.date}</p>
                      <p className="text-sm text-muted-foreground">
                        Care Services
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{invoice.amount}</p>
                      <Badge variant="secondary">{invoice.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verification Tab */}
        <TabsContent value="verification" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Email Verified</p>
                    <p className="text-sm text-muted-foreground">
                      {profile.email}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Verified</Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Phone Verified</p>
                    <p className="text-sm text-muted-foreground">
                      {profile.phone}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Verified</Badge>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">ID Verification</p>
                    <p className="text-sm text-muted-foreground">
                      Upload a government-issued ID for enhanced trust
                    </p>
                  </div>
                </div>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </main>
      <Footer />
    </>
  );
}
