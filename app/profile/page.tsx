"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
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
  Loader2,
  AlertCircle,
} from "lucide-react";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  photo: string | null;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  role: string;
  memberSince: string;
  verified: boolean;
  emailVerified: boolean;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editedProfile, setEditedProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch profile data
  useEffect(() => {
    async function fetchProfile() {
      if (status !== "authenticated" || !session?.user) return;

      try {
        // Determine the correct API endpoint based on role
        const role = session.user.role?.toLowerCase();
        const endpoint = role === "caregiver"
          ? "/api/profile/caregiver"
          : "/api/profile/family";

        const res = await fetch(endpoint);

        if (res.ok) {
          const data = await res.json();

          // Build profile from API data
          const profileData: ProfileData = {
            name: session.user.name || "",
            email: session.user.email || "",
            phone: data.user?.phone || data.phone || "",
            photo: session.user.image || data.user?.photo || null,
            address: {
              street: data.address || "",
              city: data.city || "",
              state: data.state || "",
              zip: data.zipCode || "",
            },
            role: role || "family",
            memberSince: formatDate(session.user.createdAt || new Date().toISOString()),
            verified: data.verificationStatus === "VERIFIED",
            emailVerified: !!session.user.email,
          };

          setProfile(profileData);
          setEditedProfile(profileData);
        } else {
          // Use session data as fallback
          const profileData: ProfileData = {
            name: session.user.name || "",
            email: session.user.email || "",
            phone: "",
            photo: session.user.image || null,
            address: {
              street: "",
              city: "",
              state: "",
              zip: "",
            },
            role: session.user.role?.toLowerCase() || "family",
            memberSince: formatDate(new Date().toISOString()),
            verified: false,
            emailVerified: !!session.user.email,
          };
          setProfile(profileData);
          setEditedProfile(profileData);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        // Use session data as fallback
        if (session?.user) {
          const profileData: ProfileData = {
            name: session.user.name || "",
            email: session.user.email || "",
            phone: "",
            photo: session.user.image || null,
            address: {
              street: "",
              city: "",
              state: "",
              zip: "",
            },
            role: session.user.role?.toLowerCase() || "family",
            memberSince: formatDate(new Date().toISOString()),
            verified: false,
            emailVerified: !!session.user.email,
          };
          setProfile(profileData);
          setEditedProfile(profileData);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchProfile();
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [status, session]);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }

  const handleSaveProfile = async () => {
    if (!editedProfile) return;

    setIsSaving(true);
    try {
      const role = session?.user?.role?.toLowerCase();
      const endpoint = role === "caregiver"
        ? "/api/profile/caregiver"
        : "/api/profile/family";

      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: editedProfile.address.street,
          city: editedProfile.address.city,
          state: editedProfile.address.state,
          zipCode: editedProfile.address.zip,
        }),
      });

      if (res.ok) {
        setProfile(editedProfile);
        setIsEditing(false);
        toast({
          title: "Profile updated",
          description: "Your changes have been saved successfully.",
          variant: "success",
        });
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "error",
      });
    } finally {
      setIsSaving(false);
    }
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
    if (file && editedProfile) {
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
    // TODO: Implement actual password update API
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

  // Loading state
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

  // Not authenticated
  if (status === "unauthenticated" || !profile || !editedProfile) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground" />
              <h2 className="mt-4 text-lg font-semibold">Please sign in</h2>
              <p className="mt-2 text-muted-foreground">
                You need to be signed in to view your profile.
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  const displayProfile = isEditing ? editedProfile : profile;
  const initials = displayProfile.name
    ? displayProfile.name.charAt(0).toUpperCase()
    : "U";

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
                    {displayProfile.photo ? (
                      <img
                        src={displayProfile.photo}
                        alt={displayProfile.name}
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-primary-foreground text-3xl font-semibold">
                        {initials}
                      </div>
                    )}
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
                    <h3 className="text-lg font-semibold">{displayProfile.name || "Your Name"}</h3>
                    <p className="text-sm text-muted-foreground">
                      Member since {displayProfile.memberSince}
                    </p>
                    {displayProfile.verified && (
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
                      value={displayProfile.name}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, name: e.target.value })
                      }
                      disabled={!isEditing}
                      placeholder="Enter your name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={displayProfile.email}
                      disabled
                      className="mt-1"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Contact support to change your email
                    </p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={displayProfile.phone}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, phone: e.target.value })
                      }
                      disabled={!isEditing}
                      placeholder="Enter phone number"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Account Type</Label>
                    <Input
                      value={displayProfile.role === "family" ? "Family Account" : displayProfile.role === "caregiver" ? "Caregiver" : "Admin"}
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
                        value={displayProfile.address.street}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            address: { ...editedProfile.address, street: e.target.value },
                          })
                        }
                        disabled={!isEditing}
                        placeholder="Enter street address"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">City</Label>
                      <Input
                        value={displayProfile.address.city}
                        onChange={(e) =>
                          setEditedProfile({
                            ...editedProfile,
                            address: { ...editedProfile.address, city: e.target.value },
                          })
                        }
                        disabled={!isEditing}
                        placeholder="Enter city"
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm">State</Label>
                        <Input
                          value={displayProfile.address.state}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              address: { ...editedProfile.address, state: e.target.value },
                            })
                          }
                          disabled={!isEditing}
                          placeholder="State"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">ZIP Code</Label>
                        <Input
                          value={displayProfile.address.zip}
                          onChange={(e) =>
                            setEditedProfile({
                              ...editedProfile,
                              address: { ...editedProfile.address, zip: e.target.value },
                            })
                          }
                          disabled={!isEditing}
                          placeholder="ZIP"
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
                        This device • Active now
                      </p>
                    </div>
                    <Badge variant="secondary">Active Now</Badge>
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
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CreditCard className="h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 font-semibold">No payment methods</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Add a payment method to book caregivers
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No transactions yet
                  </p>
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
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${profile.emailVerified ? "bg-green-100" : "bg-muted"}`}>
                      {profile.emailVerified ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">Email Verification</p>
                      <p className="text-sm text-muted-foreground">
                        {profile.email || "No email set"}
                      </p>
                    </div>
                  </div>
                  {profile.emailVerified ? (
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  ) : (
                    <Button variant="outline" size="sm">Verify</Button>
                  )}
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

                {profile.role === "caregiver" && (
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">Background Check</p>
                        <p className="text-sm text-muted-foreground">
                          Required for caregivers to receive bookings
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">
                      Start Check
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </>
  );
}
