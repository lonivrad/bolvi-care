"use client";

import { useState, useRef } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import {
  User,
  Camera,
  Shield,
  CreditCard,
  Lock,
  CheckCircle,
  Upload,
  Trash2,
} from "lucide-react";

const initialProfile = {
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
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [editedProfile, setEditedProfile] = useState(initialProfile);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setProfile(editedProfile);
    setIsEditing(false);
    setIsSaving(false);
    toast({
      title: "Profile updated",
      description: "Your changes have been saved successfully.",
      variant: "success",
    });
  };

  const handleCancelEdit = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handlePhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload to a server
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile({ ...editedProfile, photo: reader.result as string });
        toast({
          title: "Photo uploaded",
          description: "Your new profile photo has been set.",
          variant: "success",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast({
        title: "Missing fields",
        description: "Please fill in all password fields.",
        variant: "error",
      });
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match.",
        variant: "error",
      });
      return;
    }
    if (passwords.new.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters.",
        variant: "error",
      });
      return;
    }
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setPasswords({ current: "", new: "", confirm: "" });
    setIsSaving(false);
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
      variant: "success",
    });
  };

  const handleEnable2FA = () => {
    toast({
      title: "2FA Setup",
      description: "Two-factor authentication setup will be available soon.",
      variant: "info",
    });
  };

  const handleRevokeSession = (sessionName: string) => {
    toast({
      title: "Session revoked",
      description: `${sessionName} has been signed out.`,
      variant: "success",
    });
  };

  const handleRemovePayment = (methodId: string) => {
    const method = profile.paymentMethods.find((m) => m.id === methodId);
    if (method?.isDefault) {
      toast({
        title: "Cannot remove default",
        description: "Please set another card as default first.",
        variant: "error",
      });
      return;
    }
    setProfile({
      ...profile,
      paymentMethods: profile.paymentMethods.filter((m) => m.id !== methodId),
    });
    toast({
      title: "Card removed",
      description: "Payment method has been removed.",
      variant: "success",
    });
  };

  const handleAddCard = () => {
    toast({
      title: "Add Payment Method",
      description: "Payment method management will be available soon.",
      variant: "info",
    });
  };

  const handleUploadID = () => {
    toast({
      title: "ID Verification",
      description: "ID verification upload will be available soon.",
      variant: "info",
    });
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
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
                  <div className="flex gap-2">
                    {isEditing && (
                      <Button variant="outline" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    )}
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Photo */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img
                      src={isEditing ? editedProfile.photo : profile.photo}
                      alt={profile.name}
                      className="h-24 w-24 rounded-full object-cover"
                    />
                    {isEditing && (
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                        onClick={handlePhotoUpload}
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
                      value={isEditing ? editedProfile.name : profile.name}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, name: e.target.value })
                      }
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={isEditing ? editedProfile.email : profile.email}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, email: e.target.value })
                      }
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={isEditing ? editedProfile.phone : profile.phone}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, phone: e.target.value })
                      }
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
                        value={isEditing ? editedProfile.address.street : profile.address.street}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            address: { ...editedProfile.address, street: e.target.value },
                          })
                        }
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">City</Label>
                      <Input
                        value={isEditing ? editedProfile.address.city : profile.address.city}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            address: { ...editedProfile.address, city: e.target.value },
                          })
                        }
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm">State</Label>
                        <Input
                          value={isEditing ? editedProfile.address.state : profile.address.state}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              address: { ...editedProfile.address, state: e.target.value },
                            })
                          }
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">ZIP Code</Label>
                        <Input
                          value={isEditing ? editedProfile.address.zip : profile.address.zip}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              address: { ...editedProfile.address, zip: e.target.value },
                            })
                          }
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
                  <Input
                    type="password"
                    value={passwords.current}
                    onChange={(e) =>
                      setPasswords({ ...passwords, current: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    value={passwords.new}
                    onChange={(e) =>
                      setPasswords({ ...passwords, new: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Confirm New Password</Label>
                  <Input
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) =>
                      setPasswords({ ...passwords, confirm: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleUpdatePassword} disabled={isSaving}>
                  {isSaving ? "Updating..." : "Update Password"}
                </Button>
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
                <Button variant="outline" onClick={handleEnable2FA}>
                  Enable 2FA
                </Button>
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevokeSession("iPhone 14")}
                    >
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
                  <Button onClick={handleAddCard}>
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemovePayment(method.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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
                  <Button variant="outline" onClick={handleUploadID}>
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
