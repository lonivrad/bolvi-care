"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Star,
  Shield,
  CreditCard,
  User,
  Heart,
} from "lucide-react";
import { mockCaregivers, mockCareRecipients } from "@/lib/mock-data";
import { useStore } from "@/lib/store";

const steps = [
  { id: "recipient", title: "Care Recipient" },
  { id: "schedule", title: "Schedule" },
  { id: "services", title: "Services" },
  { id: "payment", title: "Payment" },
  { id: "confirm", title: "Confirm" },
];

const timeSlots = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
];

const durations = [
  { value: "2", label: "2 hours" },
  { value: "3", label: "3 hours" },
  { value: "4", label: "4 hours" },
  { value: "6", label: "6 hours" },
  { value: "8", label: "8 hours (Full day)" },
];

export default function BookingPage({ params }: { params: Promise<{ caregiverId: string }> }) {
  const { caregiverId } = use(params);
  const router = useRouter();
  const { currentUser } = useStore();
  const caregiver = mockCaregivers.find((c) => c.id === caregiverId) || mockCaregivers[0];

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState({
    careRecipientId: "",
    newRecipient: {
      firstName: "",
      lastName: "",
      relationship: "",
      age: "",
      conditions: [] as string[],
      notes: "",
    },
    isNewRecipient: false,
    date: undefined as Date | undefined,
    startTime: "",
    duration: "3",
    isRecurring: false,
    recurringDays: [] as string[],
    services: [] as string[],
    specialInstructions: "",
    paymentMethod: "card",
    cardLast4: "4242",
    agreedToTerms: false,
  });

  const conditions = [
    "Alzheimer's/Dementia",
    "Diabetes",
    "Heart Condition",
    "Mobility Issues",
    "Parkinson's",
    "Post-Surgery Recovery",
    "Stroke Recovery",
    "Vision/Hearing Impaired",
  ];

  const toggleService = (service: string) => {
    setBookingData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const toggleCondition = (condition: string) => {
    setBookingData((prev) => ({
      ...prev,
      newRecipient: {
        ...prev.newRecipient,
        conditions: prev.newRecipient.conditions.includes(condition)
          ? prev.newRecipient.conditions.filter((c) => c !== condition)
          : [...prev.newRecipient.conditions, condition],
      },
    }));
  };

  const calculateTotal = () => {
    const hours = parseInt(bookingData.duration) || 0;
    const subtotal = hours * caregiver.hourlyRate;
    const serviceFee = subtotal * 0.1;
    return { subtotal, serviceFee, total: subtotal + serviceFee };
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    router.push("/book/confirmation?success=true");
  };

  const { subtotal, serviceFee, total } = calculateTotal();

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <Link
            href={`/caregivers/${caregiverId}`}
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to profile
          </Link>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium ${
                        index < currentStep
                          ? "bg-primary text-primary-foreground"
                          : index === currentStep
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index < currentStep ? <Check className="h-5 w-5" /> : index + 1}
                    </div>
                    <span className="mt-2 hidden text-xs sm:block">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`mx-2 h-0.5 flex-1 ${index < currentStep ? "bg-primary" : "bg-muted"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Form */}
            <div className="lg:col-span-2">
              {/* Step 1: Care Recipient */}
              {currentStep === 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Who needs care?</CardTitle>
                    <CardDescription>Select an existing care recipient or add a new one</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {mockCareRecipients.length > 0 && (
                      <div className="space-y-3">
                        <Label>Existing care recipients</Label>
                        <RadioGroup
                          value={bookingData.careRecipientId}
                          onValueChange={(value) =>
                            setBookingData({ ...bookingData, careRecipientId: value, isNewRecipient: false })
                          }
                        >
                          {mockCareRecipients.map((recipient) => (
                            <div key={recipient.id} className="flex items-center space-x-3 rounded-lg border p-4">
                              <RadioGroupItem value={recipient.id} id={recipient.id} />
                              <Label htmlFor={recipient.id} className="flex-1 cursor-pointer">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <User className="h-5 w-5 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{recipient.firstName} {recipient.lastName}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {recipient.relationship} • Age {recipient.age}
                                    </p>
                                  </div>
                                </div>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    )}

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or add new</span>
                      </div>
                    </div>

                    <div
                      className={`space-y-4 rounded-lg border p-4 ${bookingData.isNewRecipient ? "border-primary" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="newRecipient"
                          checked={bookingData.isNewRecipient}
                          onCheckedChange={(checked) =>
                            setBookingData({ ...bookingData, isNewRecipient: checked as boolean, careRecipientId: "" })
                          }
                        />
                        <Label htmlFor="newRecipient">Add a new care recipient</Label>
                      </div>

                      {bookingData.isNewRecipient && (
                        <div className="space-y-4 pt-2">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="recipientFirstName">First name</Label>
                              <Input
                                id="recipientFirstName"
                                value={bookingData.newRecipient.firstName}
                                onChange={(e) =>
                                  setBookingData({
                                    ...bookingData,
                                    newRecipient: { ...bookingData.newRecipient, firstName: e.target.value },
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="recipientLastName">Last name</Label>
                              <Input
                                id="recipientLastName"
                                value={bookingData.newRecipient.lastName}
                                onChange={(e) =>
                                  setBookingData({
                                    ...bookingData,
                                    newRecipient: { ...bookingData.newRecipient, lastName: e.target.value },
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="relationship">Relationship to you</Label>
                              <Select
                                value={bookingData.newRecipient.relationship}
                                onValueChange={(value) =>
                                  setBookingData({
                                    ...bookingData,
                                    newRecipient: { ...bookingData.newRecipient, relationship: value },
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="parent">Parent</SelectItem>
                                  <SelectItem value="grandparent">Grandparent</SelectItem>
                                  <SelectItem value="spouse">Spouse</SelectItem>
                                  <SelectItem value="sibling">Sibling</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="age">Age</Label>
                              <Input
                                id="age"
                                type="number"
                                value={bookingData.newRecipient.age}
                                onChange={(e) =>
                                  setBookingData({
                                    ...bookingData,
                                    newRecipient: { ...bookingData.newRecipient, age: e.target.value },
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Health conditions (select all that apply)</Label>
                            <div className="flex flex-wrap gap-2">
                              {conditions.map((condition) => (
                                <button
                                  key={condition}
                                  type="button"
                                  onClick={() => toggleCondition(condition)}
                                  className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                                    bookingData.newRecipient.conditions.includes(condition)
                                      ? "border-primary bg-primary/10 text-primary"
                                      : "border-border hover:border-primary/50"
                                  }`}
                                >
                                  {condition}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Schedule */}
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Select date and time</CardTitle>
                    <CardDescription>Choose when you need care</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Select date</Label>
                        <Calendar
                          mode="single"
                          selected={bookingData.date}
                          onSelect={(date) => setBookingData({ ...bookingData, date })}
                          disabled={(date) => date < new Date()}
                          className="rounded-md border"
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Start time</Label>
                          <Select
                            value={bookingData.startTime}
                            onValueChange={(value) => setBookingData({ ...bookingData, startTime: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select start time" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Duration</Label>
                          <Select
                            value={bookingData.duration}
                            onValueChange={(value) => setBookingData({ ...bookingData, duration: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              {durations.map((d) => (
                                <SelectItem key={d.value} value={d.value}>
                                  {d.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="rounded-lg border bg-muted/50 p-4">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="recurring"
                              checked={bookingData.isRecurring}
                              onCheckedChange={(checked) =>
                                setBookingData({ ...bookingData, isRecurring: checked as boolean })
                              }
                            />
                            <Label htmlFor="recurring">Make this a recurring booking</Label>
                          </div>
                          {bookingData.isRecurring && (
                            <div className="mt-4 space-y-2">
                              <Label className="text-sm">Repeat on</Label>
                              <div className="flex gap-2">
                                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                                  <button
                                    key={day}
                                    type="button"
                                    onClick={() =>
                                      setBookingData((prev) => ({
                                        ...prev,
                                        recurringDays: prev.recurringDays.includes(day)
                                          ? prev.recurringDays.filter((d) => d !== day)
                                          : [...prev.recurringDays, day],
                                      }))
                                    }
                                    className={`rounded-md border px-3 py-1.5 text-sm ${
                                      bookingData.recurringDays.includes(day)
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "hover:border-primary/50"
                                    }`}
                                  >
                                    {day}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Services */}
              {currentStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Select services needed</CardTitle>
                    <CardDescription>Choose the services you need from {caregiver.firstName}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {caregiver.services.map((service) => (
                        <button
                          key={service}
                          type="button"
                          onClick={() => toggleService(service)}
                          className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                            bookingData.services.includes(service)
                              ? "border-primary bg-primary/5"
                              : "hover:border-primary/50"
                          }`}
                        >
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                              bookingData.services.includes(service)
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted-foreground"
                            }`}
                          >
                            {bookingData.services.includes(service) && <Check className="h-4 w-4" />}
                          </div>
                          <span className="font-medium">{service}</span>
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instructions">Special instructions (optional)</Label>
                      <Textarea
                        id="instructions"
                        placeholder="Any specific needs or preferences for this visit..."
                        value={bookingData.specialInstructions}
                        onChange={(e) => setBookingData({ ...bookingData, specialInstructions: e.target.value })}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Payment */}
              {currentStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment method</CardTitle>
                    <CardDescription>Select how you&apos;d like to pay</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup
                      value={bookingData.paymentMethod}
                      onValueChange={(value) => setBookingData({ ...bookingData, paymentMethod: value })}
                    >
                      <div className="flex items-center space-x-3 rounded-lg border p-4">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex flex-1 cursor-pointer items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5" />
                            <div>
                              <p className="font-medium">Credit Card ending in 4242</p>
                              <p className="text-sm text-muted-foreground">Expires 12/25</p>
                            </div>
                          </div>
                          <Badge variant="secondary">Default</Badge>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 rounded-lg border p-4">
                        <RadioGroupItem value="new" id="new" />
                        <Label htmlFor="new" className="cursor-pointer">
                          <p className="font-medium">Add new payment method</p>
                        </Label>
                      </div>
                    </RadioGroup>

                    <div className="rounded-lg bg-muted/50 p-4">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Secure Payment</p>
                          <p className="text-sm text-muted-foreground">
                            Your payment information is encrypted and secure
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 5: Confirm */}
              {currentStep === 4 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review your booking</CardTitle>
                    <CardDescription>Please review and confirm your booking details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4">
                      <div className="flex items-start gap-4 rounded-lg border p-4">
                        <CalendarIcon className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Date & Time</p>
                          <p className="text-sm text-muted-foreground">
                            {bookingData.date?.toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            })}{" "}
                            at {bookingData.startTime}
                          </p>
                          <p className="text-sm text-muted-foreground">{bookingData.duration} hours</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 rounded-lg border p-4">
                        <Heart className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Services</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {bookingData.services.map((service) => (
                              <Badge key={service} variant="secondary">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 rounded-lg border p-4">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Payment</p>
                          <p className="text-sm text-muted-foreground">Card ending in {bookingData.cardLast4}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="terms"
                        checked={bookingData.agreedToTerms}
                        onCheckedChange={(checked) =>
                          setBookingData({ ...bookingData, agreedToTerms: checked as boolean })
                        }
                      />
                      <Label htmlFor="terms" className="text-sm font-normal leading-tight">
                        I agree to the{" "}
                        <Link href="/terms" className="text-primary hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/cancellation" className="text-primary hover:underline">
                          Cancellation Policy
                        </Link>
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation */}
              <div className="mt-6 flex justify-between">
                {currentStep > 0 ? (
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                ) : (
                  <div />
                )}
                {currentStep < steps.length - 1 ? (
                  <Button onClick={handleNext}>
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={!bookingData.agreedToTerms || isSubmitting}>
                    {isSubmitting ? "Processing..." : "Confirm Booking"}
                  </Button>
                )}
              </div>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Image
                      src={caregiver.avatar || "/placeholder.svg"}
                      alt={caregiver.firstName}
                      width={64}
                      height={64}
                      className="rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold">
                        {caregiver.firstName} {caregiver.lastName}
                      </h3>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span>{caregiver.rating}</span>
                        <span className="text-muted-foreground">({caregiver.reviewCount})</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3 border-t pt-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        ${caregiver.hourlyRate} x {bookingData.duration} hours
                      </span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Service fee</span>
                      <span>${serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between border-t pt-3 font-semibold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-6 rounded-lg bg-muted/50 p-3 text-center text-sm">
                    <Shield className="mx-auto h-5 w-5 text-primary" />
                    <p className="mt-1 font-medium">Free cancellation</p>
                    <p className="text-xs text-muted-foreground">Up to 24 hours before the visit</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
