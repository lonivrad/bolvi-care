"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Heart,
  User,
  Camera,
  FileCheck,
  DollarSign,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Upload,
} from "lucide-react";

const steps = [
  { id: "welcome", title: "Welcome", icon: Heart },
  { id: "profile", title: "Your Profile", icon: User },
  { id: "photo", title: "Profile Photo", icon: Camera },
  { id: "experience", title: "Experience", icon: FileCheck },
  { id: "rates", title: "Rates & Availability", icon: DollarSign },
  { id: "complete", title: "All Set!", icon: CheckCircle2 },
];

const services = [
  "Personal Care",
  "Companionship",
  "Medication Reminders",
  "Meal Preparation",
  "Light Housekeeping",
  "Transportation",
  "Dementia Care",
  "Post-Surgery Care",
];

const certifications = [
  "CPR/First Aid",
  "CNA (Certified Nursing Assistant)",
  "HHA (Home Health Aide)",
  "Dementia Care Certified",
  "Alzheimer's Care Training",
  "Licensed Practical Nurse (LPN)",
];

export default function CaregiverOnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    headline: "",
    bio: "",
    photo: null as File | null,
    photoPreview: "",
    yearsExperience: "",
    hourlyRate: "",
    services: [] as string[],
    certifications: [] as string[],
    languages: ["English"],
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const progress = ((currentStep + 1) / steps.length) * 100;

  const toggleService = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const toggleCertification = (cert: string) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter((c) => c !== cert)
        : [...prev.certifications, cert],
    }));
  };

  const toggleDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: !prev.availability[day as keyof typeof prev.availability],
      },
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/profile/caregiver", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline: formData.headline,
          bio: formData.bio,
          yearsExperience: Number(formData.yearsExperience) || 0,
          hourlyRate: Number(formData.hourlyRate) || 25,
          specialties: formData.services,
          languages: formData.languages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      handleNext();
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Mark onboarding as complete
      await fetch("/api/profile/caregiver/complete-onboarding", {
        method: "POST",
      });

      router.push("/dashboard/caregiver");
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Bolvi Care</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="mt-2 text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Step Content */}
        <Card className="shadow-lg">
          {/* Step 0: Welcome */}
          {currentStep === 0 && (
            <>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Welcome to Bolvi Care!</CardTitle>
                <CardDescription className="text-base">
                  Hi {session?.user?.name?.split(" ")[0] || "there"}! Let&apos;s set up your caregiver profile so families can find you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                  <h3 className="font-semibold">What you&apos;ll do:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Create a compelling profile that stands out</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Add a professional photo (profiles with photos get 3x more bookings)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Set your rates and availability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Start receiving booking requests from families</span>
                    </li>
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  This takes about 5 minutes. You can always update your profile later.
                </p>
              </CardContent>
            </>
          )}

          {/* Step 1: Profile */}
          {currentStep === 1 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Tell us about yourself
                </CardTitle>
                <CardDescription>
                  This helps families understand who you are and what you offer.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="headline">Professional Headline</Label>
                  <Input
                    id="headline"
                    placeholder="e.g., Compassionate CNA with 5+ years of experience"
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">This appears below your name in search results</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">About You</Label>
                  <Textarea
                    id="bio"
                    placeholder="Share your caregiving philosophy, what motivates you, and what makes you a great caregiver..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={5}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.bio.length}/500 characters (aim for at least 100)
                  </p>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 2: Photo */}
          {currentStep === 2 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-primary" />
                  Add a Profile Photo
                </CardTitle>
                <CardDescription>
                  A friendly, professional photo helps families feel comfortable booking with you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative h-32 w-32 rounded-full bg-muted overflow-hidden">
                    {formData.photoPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={formData.photoPreview}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2 text-primary hover:text-primary/80">
                      <Upload className="h-4 w-4" />
                      <span>{formData.photoPreview ? "Change photo" : "Upload photo"}</span>
                    </div>
                  </label>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="font-medium mb-2">Photo tips:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Use a clear, well-lit photo of your face</li>
                    <li>• Smile warmly - you want to appear approachable</li>
                    <li>• Avoid sunglasses or hats that hide your face</li>
                    <li>• Professional attire is recommended</li>
                  </ul>
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  You can skip this for now and add it later
                </p>
              </CardContent>
            </>
          )}

          {/* Step 3: Experience */}
          {currentStep === 3 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-primary" />
                  Your Experience & Skills
                </CardTitle>
                <CardDescription>
                  Select the services you offer and any certifications you hold.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Services You Offer</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {services.map((service) => (
                      <button
                        key={service}
                        type="button"
                        onClick={() => toggleService(service)}
                        className={`rounded-lg border p-3 text-left text-sm transition-colors ${
                          formData.services.includes(service)
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Certifications (Optional)</Label>
                  <div className="flex flex-wrap gap-2">
                    {certifications.map((cert) => (
                      <button
                        key={cert}
                        type="button"
                        onClick={() => toggleCertification(cert)}
                        className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                          formData.certifications.includes(cert)
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {cert}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    max="50"
                    placeholder="e.g., 5"
                    value={formData.yearsExperience}
                    onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                  />
                </div>
              </CardContent>
            </>
          )}

          {/* Step 4: Rates & Availability */}
          {currentStep === 4 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Rates & Availability
                </CardTitle>
                <CardDescription>
                  Set your hourly rate and when you&apos;re available to work.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="rate">Hourly Rate ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="rate"
                      type="number"
                      min="15"
                      max="100"
                      placeholder="25"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Average rate in your area: $22-30/hour. Minimum: $15/hour.
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    General Availability
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Select the days you&apos;re typically available to work
                  </p>
                  <div className="grid grid-cols-7 gap-2">
                    {Object.entries(formData.availability).map(([day, isAvailable]) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`rounded-lg border p-3 text-center text-xs font-medium capitalize transition-colors ${
                          isAvailable
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 5: Complete */}
          {currentStep === 5 && (
            <>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">You&apos;re All Set!</CardTitle>
                <CardDescription className="text-base">
                  Your profile is ready. Families can now find and book you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                  <h3 className="font-semibold">What&apos;s next?</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Complete your background check to get verified</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Add more details to your profile to stand out</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Set up your payment information to get paid</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Start receiving and accepting booking requests</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </>
          )}

          {/* Navigation */}
          <div className="flex justify-between p-6 pt-0">
            {currentStep > 0 && currentStep < 5 && (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            {currentStep === 0 && <div />}

            {currentStep < 4 && (
              <Button onClick={handleNext} className="ml-auto">
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}

            {currentStep === 4 && (
              <Button onClick={handleSaveProfile} disabled={isSaving} className="ml-auto">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save & Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}

            {currentStep === 5 && (
              <Button onClick={handleComplete} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>

        {/* Skip link */}
        {currentStep < 5 && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            <button
              onClick={() => router.push("/dashboard/caregiver")}
              className="text-primary hover:underline"
            >
              Skip for now and complete later
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
