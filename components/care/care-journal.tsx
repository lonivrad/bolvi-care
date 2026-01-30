"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Calendar,
  Clock,
  Heart,
  Pill,
  Utensils,
  Activity,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  Camera,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CareLogEntry {
  id: string;
  date: string;
  time: string;
  caregiverName: string;
  caregiverPhoto: string;
  recipientName: string;
  duration: number;
  activities: Activity[];
  vitals?: VitalSigns;
  meals?: Meal[];
  medications?: Medication[];
  mood: "excellent" | "good" | "fair" | "poor";
  notes?: string;
  alerts?: Alert[];
  photos?: string[];
}

interface Activity {
  type: string;
  description: string;
  duration?: number;
}

interface VitalSigns {
  bloodPressure?: string;
  heartRate?: number;
  temperature?: number;
  bloodSugar?: number;
  weight?: number;
  oxygenLevel?: number;
}

interface Meal {
  type: "breakfast" | "lunch" | "dinner" | "snack";
  description: string;
  eaten: "all" | "most" | "some" | "none";
}

interface Medication {
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

interface Alert {
  type: "warning" | "info";
  message: string;
}

const mockEntries: CareLogEntry[] = [
  {
    id: "1",
    date: "2024-01-29",
    time: "9:00 AM",
    caregiverName: "Maria Rodriguez",
    caregiverPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    recipientName: "Eleanor",
    duration: 4,
    activities: [
      { type: "Personal Care", description: "Morning routine assistance, bathing", duration: 45 },
      { type: "Exercise", description: "Light stretching and 15-min walk in garden", duration: 30 },
      { type: "Companionship", description: "Worked on puzzle together, read newspaper", duration: 60 },
      { type: "Household", description: "Light tidying, changed bed linens", duration: 30 },
    ],
    vitals: {
      bloodPressure: "128/82",
      heartRate: 72,
      temperature: 98.4,
      oxygenLevel: 97,
    },
    meals: [
      { type: "breakfast", description: "Oatmeal with berries, toast, orange juice", eaten: "all" },
      { type: "snack", description: "Apple slices with peanut butter", eaten: "most" },
    ],
    medications: [
      { name: "Lisinopril", dosage: "10mg", time: "9:00 AM", taken: true },
      { name: "Metformin", dosage: "500mg", time: "9:00 AM", taken: true },
      { name: "Vitamin D", dosage: "1000 IU", time: "9:00 AM", taken: true },
    ],
    mood: "excellent",
    notes: "Eleanor was in great spirits today! She especially enjoyed our walk in the garden and spotted some early spring flowers. She mentioned looking forward to her daughter's visit this weekend.",
    photos: ["https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=200&h=200&fit=crop"],
  },
  {
    id: "2",
    date: "2024-01-28",
    time: "2:00 PM",
    caregiverName: "David Kim",
    caregiverPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    recipientName: "Eleanor",
    duration: 3,
    activities: [
      { type: "Physical Therapy", description: "Mobility exercises as prescribed by PT", duration: 30 },
      { type: "Companionship", description: "Watched favorite TV show together", duration: 60 },
      { type: "Personal Care", description: "Evening routine preparation", duration: 30 },
    ],
    vitals: {
      bloodPressure: "132/85",
      heartRate: 78,
      bloodSugar: 142,
    },
    meals: [
      { type: "lunch", description: "Chicken soup, crackers, fruit cup", eaten: "most" },
    ],
    medications: [
      { name: "Metformin", dosage: "500mg", time: "2:00 PM", taken: true },
    ],
    mood: "good",
    notes: "Physical therapy exercises went well. Eleanor showed improvement in balance. Blood sugar was slightly elevated - will monitor.",
    alerts: [
      { type: "info", message: "Blood sugar reading higher than usual (142 mg/dL). Continue monitoring." },
    ],
  },
];

const moodConfig = {
  excellent: { label: "Excellent", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  good: { label: "Good", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  fair: { label: "Fair", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  poor: { label: "Needs Attention", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

const mealEatenConfig = {
  all: { label: "Ate all", color: "text-green-600" },
  most: { label: "Ate most", color: "text-blue-600" },
  some: { label: "Ate some", color: "text-amber-600" },
  none: { label: "Did not eat", color: "text-red-600" },
};

function CareLogEntryCard({ entry }: { entry: CareLogEntry }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className={cn("transition-all", expanded && "ring-1 ring-primary/20")}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={entry.caregiverPhoto}
              alt={entry.caregiverName}
              width={40}
              height={40}
              className="rounded-full ring-2 ring-border"
            />
            <div>
              <p className="font-medium text-foreground">{entry.caregiverName}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(entry.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
                <Clock className="h-3 w-3 ml-1" />
                {entry.time} • {entry.duration} hrs
              </div>
            </div>
          </div>
          <Badge className={moodConfig[entry.mood].color}>
            {moodConfig[entry.mood].label}
          </Badge>
        </div>

        {/* Alerts */}
        {entry.alerts && entry.alerts.length > 0 && (
          <div className="mt-3 space-y-2">
            {entry.alerts.map((alert, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-2 rounded-lg p-2 text-sm",
                  alert.type === "warning" ? "bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300" : "bg-blue-50 text-blue-800 dark:bg-blue-950/30 dark:text-blue-300"
                )}
              >
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                {alert.message}
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-4 gap-3">
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <Activity className="h-4 w-4 mx-auto text-primary" />
            <p className="text-xs text-muted-foreground mt-1">Activities</p>
            <p className="font-semibold text-sm">{entry.activities.length}</p>
          </div>
          {entry.vitals && (
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <Heart className="h-4 w-4 mx-auto text-red-500" />
              <p className="text-xs text-muted-foreground mt-1">BP</p>
              <p className="font-semibold text-sm">{entry.vitals.bloodPressure || "N/A"}</p>
            </div>
          )}
          {entry.medications && (
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <Pill className="h-4 w-4 mx-auto text-purple-500" />
              <p className="text-xs text-muted-foreground mt-1">Meds</p>
              <p className="font-semibold text-sm">
                {entry.medications.filter((m) => m.taken).length}/{entry.medications.length}
              </p>
            </div>
          )}
          {entry.meals && (
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <Utensils className="h-4 w-4 mx-auto text-orange-500" />
              <p className="text-xs text-muted-foreground mt-1">Meals</p>
              <p className="font-semibold text-sm">{entry.meals.length}</p>
            </div>
          )}
        </div>

        {/* Notes Preview */}
        {entry.notes && (
          <div className="mt-3 p-3 rounded-lg bg-muted/30 border-l-2 border-primary">
            <p className="text-sm text-muted-foreground line-clamp-2">{entry.notes}</p>
          </div>
        )}

        {/* Expand Button */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-3"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" /> Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" /> Show Details
            </>
          )}
        </Button>

        {/* Expanded Details */}
        {expanded && (
          <div className="mt-4 space-y-4 pt-4 border-t">
            {/* Activities */}
            <div>
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Activities
              </h4>
              <div className="space-y-2">
                {entry.activities.map((activity, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <span className="font-medium">{activity.type}</span>
                      <span className="text-muted-foreground"> - {activity.description}</span>
                      {activity.duration && (
                        <span className="text-xs text-muted-foreground ml-1">({activity.duration} min)</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vitals */}
            {entry.vitals && (
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  Vital Signs
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {entry.vitals.bloodPressure && (
                    <div className="p-2 rounded bg-muted/50 text-center">
                      <p className="text-xs text-muted-foreground">Blood Pressure</p>
                      <p className="font-semibold">{entry.vitals.bloodPressure}</p>
                    </div>
                  )}
                  {entry.vitals.heartRate && (
                    <div className="p-2 rounded bg-muted/50 text-center">
                      <p className="text-xs text-muted-foreground">Heart Rate</p>
                      <p className="font-semibold">{entry.vitals.heartRate} bpm</p>
                    </div>
                  )}
                  {entry.vitals.oxygenLevel && (
                    <div className="p-2 rounded bg-muted/50 text-center">
                      <p className="text-xs text-muted-foreground">O2 Level</p>
                      <p className="font-semibold">{entry.vitals.oxygenLevel}%</p>
                    </div>
                  )}
                  {entry.vitals.temperature && (
                    <div className="p-2 rounded bg-muted/50 text-center">
                      <p className="text-xs text-muted-foreground">Temperature</p>
                      <p className="font-semibold">{entry.vitals.temperature}°F</p>
                    </div>
                  )}
                  {entry.vitals.bloodSugar && (
                    <div className="p-2 rounded bg-muted/50 text-center">
                      <p className="text-xs text-muted-foreground">Blood Sugar</p>
                      <p className="font-semibold">{entry.vitals.bloodSugar} mg/dL</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Medications */}
            {entry.medications && entry.medications.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Pill className="h-4 w-4 text-purple-500" />
                  Medications
                </h4>
                <div className="space-y-1">
                  {entry.medications.map((med, i) => (
                    <div key={i} className="flex items-center justify-between text-sm p-2 rounded bg-muted/30">
                      <div className="flex items-center gap-2">
                        {med.taken ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        )}
                        <span>{med.name}</span>
                        <span className="text-muted-foreground">({med.dosage})</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{med.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Meals */}
            {entry.meals && entry.meals.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-orange-500" />
                  Meals
                </h4>
                <div className="space-y-2">
                  {entry.meals.map((meal, i) => (
                    <div key={i} className="text-sm p-2 rounded bg-muted/30">
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">{meal.type}</span>
                        <span className={cn("text-xs", mealEatenConfig[meal.eaten].color)}>
                          {mealEatenConfig[meal.eaten].label}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs mt-1">{meal.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photos */}
            {entry.photos && entry.photos.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Camera className="h-4 w-4 text-blue-500" />
                  Photos
                </h4>
                <div className="flex gap-2">
                  {entry.photos.map((photo, i) => (
                    <Image
                      key={i}
                      src={photo}
                      alt={`Care photo ${i + 1}`}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function CareJournal() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Care Journal</h2>
          <p className="text-sm text-muted-foreground">
            Track daily care activities, health metrics, and notes
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Entry
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button variant="default" size="sm">All Entries</Button>
        <Button variant="outline" size="sm">
          <Activity className="h-4 w-4 mr-1" /> Activities
        </Button>
        <Button variant="outline" size="sm">
          <Heart className="h-4 w-4 mr-1" /> Vitals
        </Button>
        <Button variant="outline" size="sm">
          <Pill className="h-4 w-4 mr-1" /> Medications
        </Button>
        <Button variant="outline" size="sm">
          <AlertTriangle className="h-4 w-4 mr-1" /> Alerts
        </Button>
      </div>

      {/* Entries */}
      <div className="space-y-4">
        {mockEntries.map((entry) => (
          <CareLogEntryCard key={entry.id} entry={entry} />
        ))}
      </div>

      {/* Load More */}
      <Button variant="outline" className="w-full">
        Load More Entries
      </Button>
    </div>
  );
}
