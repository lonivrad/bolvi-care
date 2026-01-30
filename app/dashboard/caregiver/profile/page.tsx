"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import {
  User,
  Camera,
  CheckCircle,
  AlertCircle,
  Upload,
  Briefcase,
  Award,
  Languages,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Shield,
  FileText,
  Plus,
  X,
} from "lucide-react";

const allServices = [
  "Companionship",
  "Personal Care",
  "Dementia Care",
  "Medication Reminders",
  "Meal Prep",
  "Transportation",
  "Light Housekeeping",
  "Hospice Care",
  "Night Care",
  "Exercise Assistance",
  "Post-Surgery Recovery",
  "Diabetes Care",
];

const allLanguages = [
  "English",
  "Spanish",
  "Mandarin",
  "Cantonese",
  "Korean",
  "Vietnamese",
  "Tagalog",
  "French",
  "Portuguese",
  "Arabic",
];

const allCertifications = [
  "CPR Certified",
  "CNA (Certified Nursing Assistant)",
  "RN (Registered Nurse)",
  "LVN/LPN",
  "First Aid",
  "Dementia Care Specialist",
  "Hospice Certified",
  "Home Health Aide (HHA)",
  "Medication Administration",
  "Physical Therapy Assistant",
];

export default function CaregiverProfilePage() {
  const { caregiverUser } = useAuthStore();
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    firstName: caregiverUser?.name.split(" ")[0] || "",
    lastName: caregiverUser?.name.split(" ")[1] || "",
    email: caregiverUser?.email || "",
    phone: caregiverUser?.phone || "",
    bio: caregiverUser?.profile?.bio || "",
    hourlyRate: caregiverUser?.profile?.hourlyRate || 35,
    location: caregiverUser?.profile?.location || "Seattle, WA",
    yearsExperience: caregiverUser?.profile?.yearsExperience || 5,
    services: caregiverUser?.profile?.specialties || [],
    languages: caregiverUser?.profile?.languages || ["English"],
    certifications: caregiverUser?.profile?.certifications || [],
    hasTransportation: true,
    willingToTravel: 15,
  });

  const [isSaving, setIsSaving] = useState(false);

  const completionSteps = [
    { id: "photo", label: "Profile photo", completed: true },
    { id: "bio", label: "Bio (100+ words)", completed: profile.bio.length > 100 },
    { id: "services", label: "At least 3 services", completed: profile.services.length >= 3 },
    { id: "certifications", label: "Add certifications", completed: profile.certifications.length > 0 },
    { id: "rate", label: "Set hourly rate", completed: profile.hourlyRate > 0 },
    { id: "experience", label: "Years of experience", completed: profile.yearsExperience > 0 },
  ];

  const completionPercentage = Math.round(
    (completionSteps.filter((s) => s.completed).length / completionSteps.length) * 100
  );

  const toggleService = (service: string) => {
    setProfile((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const toggleLanguage = (language: string) => {
    setProfile((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }));
  };

  const toggleCertification = (cert: string) => {
    setProfile((prev) => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter((c) => c !== cert)
        : [...prev.certifications, cert],
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    toast({
      title: "Profile updated",
      description: "Your profile changes have been saved successfully.",
      variant: "success",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Edit Profile
          </h1>
          <p className="mt-1 text-muted-foreground">
            Complete your profile to attract more families
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Profile Completion Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Profile Completion</h3>
                <Badge variant={completionPercentage === 100 ? "default" : "secondary"}>
                  {completionPercentage}%
                </Badge>
              </div>
              <Progress value={completionPercentage} className="mt-2 h-2" />
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {completionSteps.map((step) => (
                  <div key={step.id} className="flex items-center gap-2 text-sm">
                    {step.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    )}
                    <span className={step.completed ? "text-muted-foreground" : "text-foreground"}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
          <TabsTrigger value="rates">Rates & Location</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>
                A clear, professional photo helps families feel confident choosing you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Image
                    src={caregiverUser?.photo || "/placeholder.svg"}
                    alt={caregiverUser?.name || "Profile"}
                    width={120}
                    height={120}
                    className="rounded-full object-cover"
                  />
                  <button className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90">
                    <Camera className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex-1">
                  <Button variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload New Photo
                  </Button>
                  <p className="mt-2 text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max 5MB. Recommended 400x400px.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
              <CardDescription>
                Tell families about yourself, your experience, and what makes you a great caregiver
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="I'm a compassionate caregiver with experience in..."
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={6}
              />
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {profile.bio.length} characters
                </span>
                <span className={profile.bio.length >= 100 ? "text-green-500" : "text-amber-500"}>
                  {profile.bio.length >= 100 ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" /> Minimum met
                    </span>
                  ) : (
                    `${100 - profile.bio.length} more characters needed`
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Services You Offer</CardTitle>
              <CardDescription>
                Select all the services you can provide. More services = more visibility.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {allServices.map((service) => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => toggleService(service)}
                    className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                      profile.services.includes(service)
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                  >
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                        profile.services.includes(service)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground"
                      }`}
                    >
                      {profile.services.includes(service) && <CheckCircle className="h-4 w-4" />}
                    </div>
                    <span className="font-medium">{service}</span>
                  </button>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                {profile.services.length} service{profile.services.length !== 1 ? "s" : ""} selected
                {profile.services.length < 3 && " (minimum 3 recommended)"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Languages</CardTitle>
              <CardDescription>
                Select all languages you can communicate in with families
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {allLanguages.map((language) => (
                  <button
                    key={language}
                    type="button"
                    onClick={() => toggleLanguage(language)}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      profile.languages.includes(language)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {language}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Qualifications Tab */}
        <TabsContent value="qualifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="experience">Years of caregiving experience</Label>
                <div className="relative w-32">
                  <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    max="50"
                    value={profile.yearsExperience}
                    onChange={(e) =>
                      setProfile({ ...profile, yearsExperience: parseInt(e.target.value) || 0 })
                    }
                    className="pl-9"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
              <CardDescription>
                Add your certifications to build trust with families
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {allCertifications.map((cert) => (
                  <label
                    key={cert}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-muted/50"
                  >
                    <Checkbox
                      checked={profile.certifications.includes(cert)}
                      onCheckedChange={() => toggleCertification(cert)}
                    />
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-primary" />
                      <span>{cert}</span>
                    </div>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Background Check</p>
                      <p className="text-sm text-muted-foreground">Verified on Jan 15, 2024</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Verified</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">ID Verification</p>
                      <p className="text-sm text-muted-foreground">Government ID verified</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Verified</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="font-medium">Insurance Coverage</p>
                      <p className="text-sm text-muted-foreground">Upload proof of insurance</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Upload
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rates & Location Tab */}
        <TabsContent value="rates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hourly Rate</CardTitle>
              <CardDescription>
                Set your hourly rate. The average in your area is $32-$45/hour.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative w-32">
                  <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="number"
                    min="15"
                    max="100"
                    value={profile.hourlyRate}
                    onChange={(e) =>
                      setProfile({ ...profile, hourlyRate: parseInt(e.target.value) || 0 })
                    }
                    className="pl-9"
                  />
                </div>
                <span className="text-muted-foreground">per hour</span>
              </div>
              <div className="mt-4 rounded-lg bg-muted/50 p-4">
                <p className="text-sm">
                  <strong>Tip:</strong> Competitive rates help you get more bookings. You can adjust your rate anytime.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location & Travel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Your location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="travel">Willing to travel (miles)</Label>
                <Input
                  id="travel"
                  type="number"
                  min="1"
                  max="50"
                  value={profile.willingToTravel}
                  onChange={(e) =>
                    setProfile({ ...profile, willingToTravel: parseInt(e.target.value) || 0 })
                  }
                  className="w-32"
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="transportation"
                  checked={profile.hasTransportation}
                  onCheckedChange={(checked) =>
                    setProfile({ ...profile, hasTransportation: checked as boolean })
                  }
                />
                <Label htmlFor="transportation">I have my own transportation</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button at Bottom */}
      <div className="flex justify-end gap-4 border-t pt-6">
        <Button variant="outline" asChild>
          <Link href="/dashboard/caregiver">Cancel</Link>
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
