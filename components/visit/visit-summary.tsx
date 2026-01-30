"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  Clock,
  Calendar,
  MapPin,
  User,
  Star,
  MessageSquare,
  Phone,
  FileText,
  Heart,
  Pill,
  Activity,
  AlertCircle,
  Download,
  Share2,
  ChevronRight,
  Utensils,
  Droplets,
  ThumbsUp,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ReviewSubmission } from "@/components/reviews/review-submission";

interface VisitActivity {
  time: string;
  activity: string;
  notes?: string;
  icon: React.ElementType;
}

interface VitalReading {
  type: string;
  value: string;
  unit: string;
  status: "normal" | "caution" | "alert";
  previousValue?: string;
}

interface MedicationLog {
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  notes?: string;
}

interface VisitData {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  status: "completed" | "in_progress" | "cancelled";
  caregiver: {
    id: string;
    name: string;
    photo: string;
    rating: number;
  };
  careRecipient: {
    name: string;
    photo?: string;
  };
  services: string[];
  totalCost: number;
  activities: VisitActivity[];
  vitals?: VitalReading[];
  medications?: MedicationLog[];
  mealInfo?: {
    breakfast?: string;
    lunch?: string;
    snacks?: string;
    hydration: string;
  };
  mood: "happy" | "content" | "neutral" | "anxious" | "sad";
  caregiverNotes?: string;
}

interface VisitSummaryProps {
  visit?: VisitData;
  showReview?: boolean;
}

const moodConfig = {
  happy: { label: "Happy", emoji: "😊", color: "text-green-500" },
  content: { label: "Content", emoji: "🙂", color: "text-blue-500" },
  neutral: { label: "Neutral", emoji: "😐", color: "text-gray-500" },
  anxious: { label: "Anxious", emoji: "😟", color: "text-amber-500" },
  sad: { label: "Sad", emoji: "😢", color: "text-red-500" },
};

const vitalStatusConfig = {
  normal: { label: "Normal", color: "text-green-600 bg-green-100 dark:bg-green-900/30" },
  caution: { label: "Monitor", color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30" },
  alert: { label: "Alert", color: "text-red-600 bg-red-100 dark:bg-red-900/30" },
};

// Default mock data
const defaultVisit: VisitData = {
  id: "visit-123",
  date: "January 28, 2025",
  startTime: "9:00 AM",
  endTime: "1:00 PM",
  duration: "4 hours",
  status: "completed",
  caregiver: {
    id: "cg-1",
    name: "Sarah Martinez",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
    rating: 4.9,
  },
  careRecipient: {
    name: "Eleanor Johnson",
    photo: "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=200&h=200&fit=crop",
  },
  services: ["Companionship", "Meal Preparation", "Medication Reminders", "Light Exercise"],
  totalCost: 112,
  activities: [
    { time: "9:00 AM", activity: "Arrival & morning check-in", icon: CheckCircle },
    { time: "9:15 AM", activity: "Vital signs monitoring", notes: "All readings normal", icon: Activity },
    { time: "9:30 AM", activity: "Morning medications administered", icon: Pill },
    { time: "10:00 AM", activity: "Light stretching exercises", notes: "15 minutes of chair exercises", icon: Heart },
    { time: "10:30 AM", activity: "Prepared and served breakfast", icon: Utensils },
    { time: "11:00 AM", activity: "Companionship & conversation", notes: "Looked through photo albums together", icon: MessageSquare },
    { time: "12:00 PM", activity: "Lunch preparation", icon: Utensils },
    { time: "12:45 PM", activity: "End of visit summary with family", icon: FileText },
  ],
  vitals: [
    { type: "Blood Pressure", value: "128/82", unit: "mmHg", status: "normal", previousValue: "130/84" },
    { type: "Heart Rate", value: "72", unit: "bpm", status: "normal", previousValue: "74" },
    { type: "Temperature", value: "98.4", unit: "°F", status: "normal" },
    { type: "Oxygen Level", value: "97", unit: "%", status: "normal", previousValue: "96" },
    { type: "Blood Sugar", value: "142", unit: "mg/dL", status: "caution", previousValue: "128" },
  ],
  medications: [
    { name: "Metformin", dosage: "500mg", time: "9:30 AM", taken: true },
    { name: "Donepezil", dosage: "10mg", time: "9:30 AM", taken: true },
    { name: "Lisinopril", dosage: "10mg", time: "9:30 AM", taken: true },
    { name: "Vitamin D", dosage: "1000 IU", time: "10:00 AM", taken: true },
  ],
  mealInfo: {
    breakfast: "Oatmeal with berries, scrambled eggs, whole wheat toast",
    lunch: "Grilled chicken salad, vegetable soup",
    snacks: "Apple slices with peanut butter, crackers",
    hydration: "Good - 4 glasses of water, 1 cup of tea",
  },
  mood: "happy",
  caregiverNotes:
    "Eleanor was in great spirits today. She enjoyed looking through old photo albums and shared many wonderful stories about her family. She ate well and completed all her exercises without any issues. Blood sugar was slightly elevated before lunch - recommend monitoring. Overall, a wonderful visit!",
};

export function VisitSummary({ visit: visitProp, showReview = true }: VisitSummaryProps) {
  const visit = visitProp ?? defaultVisit;
  const [activeTab, setActiveTab] = useState("overview");
  const [showReviewForm, setShowReviewForm] = useState(false);

  const mood = moodConfig[visit.mood];

  if (showReviewForm) {
    return (
      <ReviewSubmission
        caregiver={visit.caregiver}
        visitDate={visit.date}
        visitDuration={visit.duration}
        onSubmit={(data) => {
          console.log("Review submitted:", data);
          setShowReviewForm(false);
        }}
        onSkip={() => setShowReviewForm(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Visit Complete</h1>
                <p className="text-muted-foreground">
                  {visit.date} • {visit.startTime} - {visit.endTime}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Clock className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
              <p className="text-2xl font-bold">{visit.duration}</p>
              <p className="text-xs text-muted-foreground">Duration</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Activity className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
              <p className="text-2xl font-bold">{visit.activities.length}</p>
              <p className="text-xs text-muted-foreground">Activities</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <Pill className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
              <p className="text-2xl font-bold">
                {visit.medications?.filter((m) => m.taken).length || 0}/
                {visit.medications?.length || 0}
              </p>
              <p className="text-xs text-muted-foreground">Meds Taken</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <span className="text-2xl block mb-1">{mood.emoji}</span>
              <p className="text-lg font-bold">{mood.label}</p>
              <p className="text-xs text-muted-foreground">Overall Mood</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Caregiver Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={visit.caregiver.photo}
                alt={visit.caregiver.name}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <p className="font-medium">{visit.caregiver.name}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>{visit.caregiver.rating}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/messages">
                <Button variant="outline" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message
                </Button>
              </Link>
              <Link href={`/caregivers/${visit.caregiver.id}`}>
                <Button variant="outline" size="sm">
                  View Profile
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader className="pb-0">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="vitals">Vitals</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-0">
              {/* Services Provided */}
              <div>
                <h3 className="font-medium mb-3">Services Provided</h3>
                <div className="flex flex-wrap gap-2">
                  {visit.services.map((service) => (
                    <Badge key={service} variant="secondary">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Meals & Hydration */}
              {visit.mealInfo && (
                <div>
                  <h3 className="font-medium mb-3">Meals & Hydration</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {visit.mealInfo.breakfast && (
                      <div className="p-3 rounded-lg border">
                        <div className="flex items-center gap-2 mb-1">
                          <Utensils className="h-4 w-4 text-orange-500" />
                          <span className="font-medium text-sm">Breakfast</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {visit.mealInfo.breakfast}
                        </p>
                      </div>
                    )}
                    {visit.mealInfo.lunch && (
                      <div className="p-3 rounded-lg border">
                        <div className="flex items-center gap-2 mb-1">
                          <Utensils className="h-4 w-4 text-green-500" />
                          <span className="font-medium text-sm">Lunch</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {visit.mealInfo.lunch}
                        </p>
                      </div>
                    )}
                    {visit.mealInfo.snacks && (
                      <div className="p-3 rounded-lg border">
                        <div className="flex items-center gap-2 mb-1">
                          <Utensils className="h-4 w-4 text-purple-500" />
                          <span className="font-medium text-sm">Snacks</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {visit.mealInfo.snacks}
                        </p>
                      </div>
                    )}
                    <div className="p-3 rounded-lg border">
                      <div className="flex items-center gap-2 mb-1">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-sm">Hydration</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {visit.mealInfo.hydration}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Medications */}
              {visit.medications && (
                <div>
                  <h3 className="font-medium mb-3">Medications</h3>
                  <div className="space-y-2">
                    {visit.medications.map((med, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "h-8 w-8 rounded-full flex items-center justify-center",
                              med.taken
                                ? "bg-green-100 dark:bg-green-900/30"
                                : "bg-red-100 dark:bg-red-900/30"
                            )}
                          >
                            {med.taken ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{med.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {med.dosage}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{med.time}</p>
                          <Badge
                            variant={med.taken ? "secondary" : "destructive"}
                            className="text-xs"
                          >
                            {med.taken ? "Taken" : "Missed"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Vitals Tab */}
            <TabsContent value="vitals" className="mt-0">
              {visit.vitals ? (
                <div className="space-y-4">
                  {visit.vitals.map((vital, index) => {
                    const status = vitalStatusConfig[vital.status];
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg border"
                      >
                        <div>
                          <p className="font-medium">{vital.type}</p>
                          {vital.previousValue && (
                            <p className="text-xs text-muted-foreground">
                              Previous: {vital.previousValue} {vital.unit}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">
                            {vital.value}
                            <span className="text-sm font-normal text-muted-foreground ml-1">
                              {vital.unit}
                            </span>
                          </p>
                          <Badge className={cn("text-xs", status.color)}>
                            {status.label}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No vital signs recorded for this visit
                </p>
              )}
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities" className="mt-0">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                <div className="space-y-6">
                  {visit.activities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="relative flex gap-4 pl-10">
                        <div className="absolute left-0 h-8 w-8 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="text-sm font-medium text-muted-foreground">
                            {activity.time}
                          </p>
                          <p className="font-medium">{activity.activity}</p>
                          {activity.notes && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {activity.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="mt-0">
              {visit.caregiverNotes ? (
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Image
                      src={visit.caregiver.photo}
                      alt={visit.caregiver.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium text-sm">{visit.caregiver.name}</p>
                      <p className="text-xs text-muted-foreground">Caregiver Notes</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {visit.caregiverNotes}
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No caregiver notes for this visit
                </p>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {showReview && (
              <Button className="flex-1" onClick={() => setShowReviewForm(true)}>
                <Star className="mr-2 h-4 w-4" />
                Leave a Review
              </Button>
            )}
            <Link href={`/book/${visit.caregiver.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Book Again
              </Button>
            </Link>
            <Link href="/caregivers" className="flex-1">
              <Button variant="outline" className="w-full">
                Find More Caregivers
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Cost Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {visit.duration} of care
              </span>
              <span>${visit.totalCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Platform fee</span>
              <span>$0.00</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-medium">
              <span>Total Paid</span>
              <span className="text-lg">${visit.totalCost.toFixed(2)}</span>
            </div>
          </div>
          <Badge variant="secondary" className="mt-4">
            <CheckCircle className="mr-1 h-3 w-3" />
            Payment processed
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
