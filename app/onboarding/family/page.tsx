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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Heart,
  User,
  Users,
  Home,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Plus,
} from "lucide-react";

const steps = [
  { id: "welcome", title: "Welcome", icon: Heart },
  { id: "care-recipient", title: "Care Recipient", icon: Users },
  { id: "care-needs", title: "Care Needs", icon: Home },
  { id: "complete", title: "All Set!", icon: CheckCircle2 },
];

const careTypes = [
  { value: "companion", label: "Companionship", description: "Social interaction, activities, errands" },
  { value: "personal", label: "Personal Care", description: "Bathing, dressing, grooming assistance" },
  { value: "medical", label: "Medical Support", description: "Medication reminders, health monitoring" },
  { value: "dementia", label: "Dementia Care", description: "Specialized memory care support" },
  { value: "respite", label: "Respite Care", description: "Temporary relief for family caregivers" },
  { value: "post-surgery", label: "Post-Surgery Care", description: "Recovery assistance after procedures" },
];

const relationships = [
  "Parent",
  "Grandparent",
  "Spouse/Partner",
  "Sibling",
  "Myself",
  "Other Family Member",
  "Friend",
  "Client",
];

export default function FamilyOnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    // Care recipient info
    recipientFirstName: "",
    recipientLastName: "",
    recipientAge: "",
    relationship: "",

    // Care needs
    careTypes: [] as string[],
    careDescription: "",
    hoursPerWeek: "",
    startDate: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const progress = ((currentStep + 1) / steps.length) * 100;

  const toggleCareType = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      careTypes: prev.careTypes.includes(value)
        ? prev.careTypes.filter((t) => t !== value)
        : [...prev.careTypes, value],
    }));
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

  const handleSaveAndContinue = async () => {
    setIsSaving(true);
    try {
      // Save care recipient
      const response = await fetch("/api/care-recipients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.recipientFirstName,
          lastName: formData.recipientLastName,
          dateOfBirth: formData.recipientAge ? new Date(Date.now() - Number(formData.recipientAge) * 365 * 24 * 60 * 60 * 1000).toISOString() : undefined,
          relationship: formData.relationship,
          careNeeds: formData.careTypes,
          notes: formData.careDescription,
          address: formData.address.street ? formData.address : undefined,
        }),
      });

      if (!response.ok) {
        console.error("Failed to save care recipient");
      }

      handleNext();
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Mark onboarding as complete
      await fetch("/api/profile/family/complete-onboarding", {
        method: "POST",
      });

      router.push("/dashboard/family");
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
                  Hi {session?.user?.name?.split(" ")[0] || "there"}! Let&apos;s help you find the perfect caregiver for your loved one.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                  <h3 className="font-semibold">Here&apos;s what we&apos;ll do:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Tell us about who needs care</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Describe the type of care needed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Get matched with qualified caregivers in your area</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Book care visits that fit your schedule</span>
                    </li>
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  This takes about 3 minutes. All caregivers are background-checked and verified.
                </p>
              </CardContent>
            </>
          )}

          {/* Step 1: Care Recipient */}
          {currentStep === 1 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Who needs care?
                </CardTitle>
                <CardDescription>
                  Tell us about the person who will be receiving care.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="First name"
                      value={formData.recipientFirstName}
                      onChange={(e) => setFormData({ ...formData, recipientFirstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Last name"
                      value={formData.recipientLastName}
                      onChange={(e) => setFormData({ ...formData, recipientLastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      min="0"
                      max="120"
                      placeholder="e.g., 75"
                      value={formData.recipientAge}
                      onChange={(e) => setFormData({ ...formData, recipientAge: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Relationship to You</Label>
                    <Select
                      value={formData.relationship}
                      onValueChange={(value) => setFormData({ ...formData, relationship: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        {relationships.map((rel) => (
                          <SelectItem key={rel} value={rel}>
                            {rel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Care Location</Label>
                  <Input
                    placeholder="Street address"
                    value={formData.address.street}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, street: e.target.value }
                    })}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="City"
                      value={formData.address.city}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, city: e.target.value }
                      })}
                    />
                    <Input
                      placeholder="State"
                      maxLength={2}
                      value={formData.address.state}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, state: e.target.value.toUpperCase() }
                      })}
                    />
                    <Input
                      placeholder="ZIP"
                      maxLength={5}
                      value={formData.address.zipCode}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, zipCode: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 2: Care Needs */}
          {currentStep === 2 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  What type of care is needed?
                </CardTitle>
                <CardDescription>
                  Select all that apply. This helps us match you with the right caregivers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-3">
                  {careTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => toggleCareType(type.value)}
                      className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-colors ${
                        formData.careTypes.includes(type.value)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border ${
                        formData.careTypes.includes(type.value)
                          ? "border-primary bg-primary text-white"
                          : "border-muted-foreground"
                      }`}>
                        {formData.careTypes.includes(type.value) && (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-muted-foreground">{type.description}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Additional Details (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Any specific needs, conditions, or preferences we should know about..."
                    value={formData.careDescription}
                    onChange={(e) => setFormData({ ...formData, careDescription: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Estimated Hours per Week</Label>
                  <Select
                    value={formData.hoursPerWeek}
                    onValueChange={(value) => setFormData({ ...formData, hoursPerWeek: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select hours needed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 hours/week</SelectItem>
                      <SelectItem value="10-20">10-20 hours/week</SelectItem>
                      <SelectItem value="20-30">20-30 hours/week</SelectItem>
                      <SelectItem value="30-40">30-40 hours/week</SelectItem>
                      <SelectItem value="40+">40+ hours/week (Full-time)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3: Complete */}
          {currentStep === 3 && (
            <>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">You&apos;re All Set!</CardTitle>
                <CardDescription className="text-base">
                  We&apos;ve saved your care preferences. Now let&apos;s find you the perfect caregiver.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                  <h3 className="font-semibold">What&apos;s next?</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Browse verified caregivers in your area</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Message caregivers to learn more about them</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Book your first care visit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Add a payment method for easy booking</span>
                    </li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push("/caregivers")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Browse Caregivers
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleComplete}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Home className="mr-2 h-4 w-4" />
                    )}
                    Go to Dashboard
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Navigation */}
          {currentStep < 3 && (
            <div className="flex justify-between p-6 pt-0">
              {currentStep > 0 && (
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              {currentStep === 0 && <div />}

              {currentStep < 2 && (
                <Button onClick={handleNext} className="ml-auto">
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}

              {currentStep === 2 && (
                <Button onClick={handleSaveAndContinue} disabled={isSaving} className="ml-auto">
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
            </div>
          )}
        </Card>

        {/* Skip link */}
        {currentStep < 3 && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            <button
              onClick={() => router.push("/dashboard/family")}
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
