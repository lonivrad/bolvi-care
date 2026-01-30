"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Eye, EyeOff, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useAuthStore } from "@/lib/store";

const steps = ["Basic Info", "Experience", "Availability"];

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
];

export default function CaregiverSignupPage() {
  const router = useRouter();
  const { setRole } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    zipCode: "",
    bio: "",
    yearsExperience: "",
    hourlyRate: "",
    services: [] as string[],
    certifications: [] as string[],
    availability: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    },
    agreeTerms: false,
    agreeBackground: false,
  });

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

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
      if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^[\d\s\-()]+$/.test(formData.phone) || formData.phone.replace(/\D/g, "").length < 10) {
        newErrors.phone = "Please enter a valid phone number";
      }
      if (!formData.zipCode.trim()) {
        newErrors.zipCode = "ZIP code is required";
      } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
        newErrors.zipCode = "Please enter a valid ZIP code";
      }
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (step === 1) {
      if (formData.services.length === 0) {
        newErrors.services = "Please select at least one service";
      }
      if (!formData.yearsExperience) {
        newErrors.yearsExperience = "Years of experience is required";
      }
      if (!formData.hourlyRate) {
        newErrors.hourlyRate = "Hourly rate is required";
      } else if (Number(formData.hourlyRate) < 15) {
        newErrors.hourlyRate = "Minimum rate is $15/hour";
      }
    }

    if (step === 2) {
      const hasAvailability = Object.values(formData.availability).some((v) => v);
      if (!hasAvailability) {
        newErrors.availability = "Please select at least one day of availability";
      }
      if (!formData.agreeTerms) {
        newErrors.agreeTerms = "You must agree to the terms";
      }
      if (!formData.agreeBackground) {
        newErrors.agreeBackground = "Background check consent is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // For MVP, just set the role to caregiver (uses sample data)
    // In production, this would create a new user in the database
    setRole("caregiver");
    router.push("/dashboard/caregiver");
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <Link href="/auth/signup" className="mb-2 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to role selection
          </Link>
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="font-semibold">Bolvi Care</span>
          </div>
          <CardTitle className="text-2xl">Become a caregiver</CardTitle>
          <CardDescription>Join our network of trusted care providers</CardDescription>

          {/* Progress Steps */}
          <div className="mt-4 flex items-center gap-2">
            {steps.map((step, index) => (
              <div key={step} className="flex flex-1 items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    index <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span className="ml-2 hidden text-sm sm:inline">{step}</span>
                {index < steps.length - 1 && (
                  <div className={`mx-2 h-0.5 flex-1 ${index < currentStep ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {currentStep === 0 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className={errors.firstName ? "border-destructive" : ""}
                    />
                    {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className={errors.lastName ? "border-destructive" : ""}
                    />
                    {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className={errors.zipCode ? "border-destructive" : ""}
                  />
                  {errors.zipCode && <p className="text-xs text-destructive">{errors.zipCode}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`pr-10 ${errors.password ? "border-destructive" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={errors.confirmPassword ? "border-destructive" : ""}
                  />
                  {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                </div>
              </>
            )}

            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="bio">About you</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell families about your experience and what makes you passionate about caregiving..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yearsExperience">Years of experience</Label>
                    <Input
                      id="yearsExperience"
                      type="number"
                      min="0"
                      value={formData.yearsExperience}
                      onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                      className={errors.yearsExperience ? "border-destructive" : ""}
                    />
                    {errors.yearsExperience && <p className="text-xs text-destructive">{errors.yearsExperience}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Hourly rate ($)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      min="15"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                      className={errors.hourlyRate ? "border-destructive" : ""}
                    />
                    {errors.hourlyRate && <p className="text-xs text-destructive">{errors.hourlyRate}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Services you offer</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {services.map((service) => (
                      <button
                        key={service}
                        type="button"
                        onClick={() => toggleService(service)}
                        className={`rounded-lg border p-2 text-left text-sm transition-colors ${
                          formData.services.includes(service)
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                  {errors.services && <p className="text-xs text-destructive">{errors.services}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Certifications</Label>
                  <div className="flex flex-wrap gap-2">
                    {certifications.map((cert) => (
                      <button
                        key={cert}
                        type="button"
                        onClick={() => toggleCertification(cert)}
                        className={`rounded-full border px-3 py-1 text-sm transition-colors ${
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
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="space-y-2">
                  <Label>General availability</Label>
                  <p className="text-sm text-muted-foreground">Select the days you&apos;re generally available</p>
                  <div className="grid grid-cols-7 gap-2">
                    {Object.keys(formData.availability).map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`rounded-lg border p-3 text-center text-xs font-medium capitalize transition-colors ${
                          formData.availability[day as keyof typeof formData.availability]
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                  {errors.availability && <p className="text-xs text-destructive">{errors.availability}</p>}
                </div>

                <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
                    />
                    <Label htmlFor="terms" className="text-sm font-normal leading-tight">
                      I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>,{" "}
                      <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, and{" "}
                      <Link href="/caregiver-agreement" className="text-primary hover:underline">Caregiver Agreement</Link>
                    </Label>
                  </div>
                  {errors.agreeTerms && <p className="text-xs text-destructive ml-6">{errors.agreeTerms}</p>}
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="background"
                      checked={formData.agreeBackground}
                      onCheckedChange={(checked) => setFormData({ ...formData, agreeBackground: checked as boolean })}
                    />
                    <Label htmlFor="background" className="text-sm font-normal leading-tight">
                      I consent to a background check as part of the verification process
                    </Label>
                  </div>
                  {errors.agreeBackground && <p className="text-xs text-destructive ml-6">{errors.agreeBackground}</p>}
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <div className="flex w-full gap-3">
              {currentStep > 0 && (
                <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              )}
              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={handleNext} className="flex-1">
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading || !formData.agreeTerms || !formData.agreeBackground}
                >
                  {isLoading ? "Creating account..." : "Complete signup"}
                </Button>
              )}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">Sign in</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
