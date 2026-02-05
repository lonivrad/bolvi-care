"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BackButton } from "@/components/ui/back-button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  Activity,
  Heart,
  Thermometer,
  Scale,
  Droplets,
  Brain,
  Moon,
  Utensils,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
  Plus,
  Download,
  Share,
  Pill,
  BookOpen,
} from "lucide-react";
import { CareJournal } from "@/components/care/care-journal";

// Mock health data
const vitalSignsHistory = [
  { date: "Mar 1", bp: "128/82", hr: 72, temp: 98.4, weight: 145, glucose: 110 },
  { date: "Feb 28", bp: "132/85", hr: 75, temp: 98.6, weight: 145.5, glucose: 115 },
  { date: "Feb 27", bp: "125/80", hr: 70, temp: 98.2, weight: 145, glucose: 108 },
  { date: "Feb 26", bp: "130/84", hr: 73, temp: 98.5, weight: 146, glucose: 112 },
  { date: "Feb 25", bp: "127/81", hr: 71, temp: 98.4, weight: 145.5, glucose: 105 },
];

const moodHistory = [
  { date: "Mar 1", mood: 4, notes: "Good spirits today, enjoyed puzzle time" },
  { date: "Feb 28", mood: 3, notes: "A bit tired, napped in afternoon" },
  { date: "Feb 27", mood: 5, notes: "Excellent day! Family video call" },
  { date: "Feb 26", mood: 4, notes: "Pleasant walk in garden" },
  { date: "Feb 25", mood: 2, notes: "Some confusion, needed extra support" },
];

const medicationAdherence = [
  { name: "Lisinopril", adherence: 98, doses: 28, missed: 0 },
  { name: "Metformin", adherence: 95, doses: 56, missed: 3 },
  { name: "Aricept", adherence: 100, doses: 28, missed: 0 },
  { name: "Vitamin D", adherence: 92, doses: 28, missed: 2 },
];

const sleepData = [
  { date: "Mar 1", hours: 7.5, quality: "good", wakeups: 1 },
  { date: "Feb 28", hours: 6.0, quality: "fair", wakeups: 3 },
  { date: "Feb 27", hours: 8.0, quality: "excellent", wakeups: 0 },
  { date: "Feb 26", hours: 7.0, quality: "good", wakeups: 2 },
  { date: "Feb 25", hours: 5.5, quality: "poor", wakeups: 4 },
];

const nutritionData = [
  { date: "Mar 1", meals: 3, hydration: "good", appetite: "normal" },
  { date: "Feb 28", meals: 2, hydration: "fair", appetite: "reduced" },
  { date: "Feb 27", meals: 3, hydration: "excellent", appetite: "good" },
  { date: "Feb 26", meals: 3, hydration: "good", appetite: "normal" },
  { date: "Feb 25", meals: 2, hydration: "fair", appetite: "reduced" },
];

const alerts = [
  {
    type: "warning",
    title: "Blood Pressure Elevated",
    message: "Average BP this week is higher than baseline. Consider consulting physician.",
    date: "Today",
  },
  {
    type: "info",
    title: "Sleep Pattern Change",
    message: "Sleep hours decreased by 15% this week compared to last week.",
    date: "Yesterday",
  },
];

export default function HealthTrackingPage() {
  const [selectedRecipient, setSelectedRecipient] = useState("cr-1");
  const [timeRange, setTimeRange] = useState("7days");

  const getMoodEmoji = (mood: number) => {
    const emojis = ["😢", "😟", "😐", "🙂", "😊"];
    return emojis[mood - 1] || "😐";
  };

  const getMoodLabel = (mood: number) => {
    const labels = ["Very Low", "Low", "Neutral", "Good", "Excellent"];
    return labels[mood - 1] || "Unknown";
  };

  const getQualityBadge = (quality: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      excellent: "default",
      good: "secondary",
      fair: "outline",
      poor: "destructive",
    };
    return <Badge variant={variants[quality] || "outline"}>{quality}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div>
          <BackButton href="/dashboard/family" label="Back to Dashboard" variant="link" />
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/dashboard/family" },
              { label: "Health Tracking" },
            ]}
            className="mt-2"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Share className="mr-2 h-4 w-4" />
            Share with Doctor
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Health Tracking</h1>
          <p className="text-muted-foreground">
            Monitor health trends and wellness indicators
          </p>
        </div>
        <div className="flex gap-4">
          <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select care recipient" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cr-1">Margaret Johnson</SelectItem>
              <SelectItem value="cr-2">Robert Johnson</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 Days</SelectItem>
              <SelectItem value="30days">30 Days</SelectItem>
              <SelectItem value="90days">90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <Card
              key={index}
              className={
                alert.type === "warning"
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-blue-500 bg-blue-50"
              }
            >
              <CardContent className="py-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    className={`h-5 w-5 mt-0.5 ${
                      alert.type === "warning" ? "text-yellow-600" : "text-blue-600"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">{alert.title}</h4>
                      <span className="text-xs text-muted-foreground">{alert.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {alert.message}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                <Heart className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Blood Pressure</p>
                <p className="text-2xl font-bold">128/82</p>
                <p className="text-xs text-muted-foreground">mmHg (avg)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Heart Rate</p>
                <p className="text-2xl font-bold">72</p>
                <p className="text-xs text-muted-foreground">bpm (avg)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <Brain className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mood Average</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">3.6</p>
                  <span className="text-xl">{getMoodEmoji(4)}</span>
                </div>
                <p className="text-xs text-muted-foreground">out of 5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <Pill className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Med Adherence</p>
                <p className="text-2xl font-bold">96%</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> +2% from last week
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="vitals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
          <TabsTrigger value="mood">Mood & Wellness</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="journal">
            <BookOpen className="mr-1 h-4 w-4 hidden sm:inline" />
            Care Journal
          </TabsTrigger>
        </TabsList>

        {/* Vital Signs Tab */}
        <TabsContent value="vitals">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Vital Signs History</CardTitle>
                  <CardDescription>
                    Track blood pressure, heart rate, temperature, and more
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Log Reading
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Blood Pressure</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Heart Rate</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Temperature</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Weight</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Glucose</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vitalSignsHistory.map((reading, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-3 px-4 font-medium">{reading.date}</td>
                        <td className="py-3 px-4">{reading.bp} mmHg</td>
                        <td className="py-3 px-4">{reading.hr} bpm</td>
                        <td className="py-3 px-4">{reading.temp}°F</td>
                        <td className="py-3 px-4">{reading.weight} lbs</td>
                        <td className="py-3 px-4">{reading.glucose} mg/dL</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mood & Wellness Tab */}
        <TabsContent value="mood">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mood & Wellness Tracking</CardTitle>
                  <CardDescription>
                    Daily mood assessments and observations from caregivers
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Log Mood
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {moodHistory.map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg border"
                  >
                    <div className="text-center">
                      <span className="text-3xl">{getMoodEmoji(entry.mood)}</span>
                      <p className="text-xs text-muted-foreground mt-1">
                        {getMoodLabel(entry.mood)}
                      </p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{entry.date}</p>
                        <Badge variant="outline">{entry.mood}/5</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {entry.notes}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medications Tab */}
        <TabsContent value="medications">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Medication Adherence</CardTitle>
                  <CardDescription>
                    Track medication compliance and timing
                  </CardDescription>
                </div>
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Schedule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medicationAdherence.map((med, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Pill className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{med.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold ${
                            med.adherence >= 95
                              ? "text-green-600"
                              : med.adherence >= 85
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {med.adherence}%
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({med.doses - med.missed}/{med.doses} doses)
                        </span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          med.adherence >= 95
                            ? "bg-green-500"
                            : med.adherence >= 85
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${med.adherence}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sleep Tab */}
        <TabsContent value="sleep">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Patterns</CardTitle>
              <CardDescription>
                Track sleep duration and quality over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sleepData.map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <Moon className="h-5 w-5 text-indigo-500" />
                      <div>
                        <p className="font-medium">{entry.date}</p>
                        <p className="text-sm text-muted-foreground">
                          {entry.wakeups} wake-up{entry.wakeups !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-lg">{entry.hours} hrs</p>
                        {getQualityBadge(entry.quality)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nutrition Tab */}
        <TabsContent value="nutrition">
          <Card>
            <CardHeader>
              <CardTitle>Nutrition & Hydration</CardTitle>
              <CardDescription>
                Track meals, hydration, and appetite patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nutritionData.map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <Utensils className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="font-medium">{entry.date}</p>
                        <p className="text-sm text-muted-foreground">
                          {entry.meals} meals eaten
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span className="text-sm capitalize">{entry.hydration}</span>
                      </div>
                      <Badge
                        variant={
                          entry.appetite === "good" || entry.appetite === "normal"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        Appetite: {entry.appetite}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Care Journal Tab */}
        <TabsContent value="journal">
          <CareJournal />
        </TabsContent>
      </Tabs>
    </div>
  );
}
