"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VisitChecklist } from "@/components/caregiver/visit-checklist";
import { useBookingsStore } from "@/lib/store";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  FileText,
  AlertTriangle,
  Heart,
  Pill,
} from "lucide-react";

// Extended visit type for caregiver view
interface VisitDetails {
  id: string;
  recipientName: string;
  familyName: string;
  date: string;
  startTime: string;
  duration: number;
  services: string[];
  totalCost: number;
  status: string;
  address: string;
  phone: string;
  notes: string;
  medications: { name: string; dosage: string; time: string }[];
  emergencyContact: { name: string; phone: string };
}

// Default visit data for demo purposes
const defaultVisit: VisitDetails = {
  id: "",
  recipientName: "Eleanor Smith",
  familyName: "Smith Family",
  date: new Date().toISOString(),
  startTime: "9:00 AM",
  duration: 4,
  services: ["Personal Care", "Medication Management", "Companionship", "Light Housekeeping"],
  totalCost: 180,
  status: "in-progress",
  address: "1234 Oak Street, Seattle, WA 98101",
  phone: "(206) 555-0123",
  notes: "Eleanor prefers to have breakfast before personal care. She enjoys classical music during visits and likes to read the newspaper in the morning. Please ensure all tasks are documented with photos for the family.",
  medications: [
    { name: "Lisinopril", dosage: "10mg", time: "9:00 AM" },
    { name: "Metformin", dosage: "500mg", time: "With breakfast" },
    { name: "Vitamin D", dosage: "1000 IU", time: "With lunch" },
  ],
  emergencyContact: {
    name: "Robert Smith (Son)",
    phone: "(206) 555-0456",
  },
};

// Health conditions for display
const healthConditions = [
  { name: "Type 2 Diabetes", severity: "managed" },
  { name: "Mild Hypertension", severity: "managed" },
  { name: "Mild Cognitive Impairment", severity: "monitor" },
];

export default function VisitPage() {
  const params = useParams();
  const router = useRouter();
  const { bookings } = useBookingsStore();

  // Find the booking/visit - use booking data if found, otherwise use default demo data
  const booking = bookings.find((b) => b.id === params.id);

  // Create visit object with proper typing
  const visit: VisitDetails = booking
    ? {
        id: booking.id,
        recipientName: booking.recipientName || defaultVisit.recipientName,
        familyName: defaultVisit.familyName,
        date: booking.date,
        startTime: booking.startTime || defaultVisit.startTime,
        duration: booking.duration,
        services: booking.services,
        totalCost: booking.totalCost,
        status: booking.status,
        address: defaultVisit.address,
        phone: defaultVisit.phone,
        notes: defaultVisit.notes,
        medications: defaultVisit.medications,
        emergencyContact: defaultVisit.emergencyContact,
      }
    : { ...defaultVisit, id: params.id as string };

  const handleVisitComplete = () => {
    router.push("/dashboard/caregiver");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/caregiver">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Active Visit</h1>
          <p className="text-muted-foreground">
            {visit.recipientName} • {visit.startTime}
          </p>
        </div>
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          In Progress
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content - Checklist */}
        <div className="lg:col-span-2">
          <VisitChecklist
            visitId={visit.id}
            clientName={visit.recipientName}
            scheduledTime={`${visit.startTime} - ${visit.duration} hours`}
            tasks={visit.services}
            onComplete={handleVisitComplete}
          />
        </div>

        {/* Sidebar - Visit Info */}
        <div className="space-y-6">
          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Care Recipient</p>
                <p className="font-medium">{visit.recipientName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Family</p>
                <p className="font-medium">{visit.familyName}</p>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm">{visit.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${visit.phone}`} className="text-sm text-primary hover:underline">
                  {visit.phone}
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Visit Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Visit Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Date</span>
                <span className="font-medium">{new Date(visit.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Time</span>
                <span className="font-medium">{visit.startTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="font-medium">{visit.duration} hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Payment</span>
                <span className="font-medium text-green-600">${visit.totalCost}</span>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground mb-2">Services</p>
                <div className="flex flex-wrap gap-1">
                  {visit.services.map((service) => (
                    <Badge key={service} variant="secondary" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medications */}
          {visit.medications && visit.medications.length > 0 && (
            <Card className="border-purple-200 dark:border-purple-800/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Pill className="h-4 w-4 text-purple-500" />
                  Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {visit.medications.map((med, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                      <div>
                        <p className="font-medium text-sm">{med.name}</p>
                        <p className="text-xs text-muted-foreground">{med.dosage}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {med.time}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Health Conditions */}
          <Card className="border-amber-200 dark:border-amber-800/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Heart className="h-4 w-4 text-amber-500" />
                Health Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {healthConditions.map((condition, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20">
                    <span className="text-sm font-medium">{condition.name}</span>
                    <Badge variant="outline" className={condition.severity === "managed" ? "text-green-600 border-green-300" : "text-amber-600 border-amber-300"}>
                      {condition.severity === "managed" ? "Managed" : "Monitor"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Care Notes */}
          {visit.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Care Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{visit.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Emergency Contact */}
          {visit.emergencyContact && (
            <Card className="border-red-200 dark:border-red-800/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{visit.emergencyContact.name}</p>
                <a
                  href={`tel:${visit.emergencyContact.phone}`}
                  className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
                >
                  <Phone className="h-3 w-3" />
                  {visit.emergencyContact.phone}
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
