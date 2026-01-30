"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Phone,
  User,
  Heart,
  Pill,
  FileText,
  MapPin,
  Clock,
  Shield,
  Plus,
  Edit,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  Home,
  Car,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
  canMakeDecisions: boolean;
}

interface MedicalInfo {
  bloodType?: string;
  allergies: string[];
  conditions: string[];
  medications: Medication[];
  primaryPhysician?: {
    name: string;
    phone: string;
    practice: string;
  };
  pharmacy?: {
    name: string;
    phone: string;
    address: string;
  };
  insuranceProvider?: string;
  insuranceId?: string;
  dnrStatus?: boolean;
  advanceDirective?: boolean;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
  prescriber: string;
}

interface CareRecipient {
  id: string;
  name: string;
  photo: string;
  dateOfBirth: string;
  address: string;
  emergencyContacts: EmergencyContact[];
  medicalInfo: MedicalInfo;
}

const mockCareRecipient: CareRecipient = {
  id: "1",
  name: "Eleanor Thompson",
  photo: "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=200&h=200&fit=crop",
  dateOfBirth: "1942-03-15",
  address: "1234 Maple Street, Seattle, WA 98101",
  emergencyContacts: [
    {
      id: "ec-1",
      name: "Sarah Thompson",
      relationship: "Daughter",
      phone: "(206) 555-0101",
      isPrimary: true,
      canMakeDecisions: true,
    },
    {
      id: "ec-2",
      name: "Michael Thompson",
      relationship: "Son",
      phone: "(206) 555-0102",
      isPrimary: false,
      canMakeDecisions: true,
    },
    {
      id: "ec-3",
      name: "Dr. James Wilson",
      relationship: "Primary Physician",
      phone: "(206) 555-0200",
      isPrimary: false,
      canMakeDecisions: false,
    },
  ],
  medicalInfo: {
    bloodType: "O+",
    allergies: ["Penicillin", "Sulfa drugs", "Shellfish"],
    conditions: ["Type 2 Diabetes", "Hypertension", "Mild Dementia", "Osteoarthritis"],
    medications: [
      {
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily with meals",
        purpose: "Diabetes management",
        prescriber: "Dr. James Wilson",
      },
      {
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily, morning",
        purpose: "Blood pressure control",
        prescriber: "Dr. James Wilson",
      },
      {
        name: "Donepezil",
        dosage: "5mg",
        frequency: "Once daily, bedtime",
        purpose: "Dementia management",
        prescriber: "Dr. Sarah Chen",
      },
      {
        name: "Vitamin D",
        dosage: "1000 IU",
        frequency: "Once daily",
        purpose: "Bone health",
        prescriber: "Dr. James Wilson",
      },
    ],
    primaryPhysician: {
      name: "Dr. James Wilson",
      phone: "(206) 555-0200",
      practice: "Seattle Family Medicine",
    },
    pharmacy: {
      name: "Walgreens",
      phone: "(206) 555-0300",
      address: "500 Pine Street, Seattle, WA",
    },
    insuranceProvider: "Medicare + UnitedHealthcare Supplement",
    insuranceId: "1EG4-TE5-MK72",
    dnrStatus: false,
    advanceDirective: true,
  },
};

export function EmergencyInfo() {
  const [activeTab, setActiveTab] = useState<"contacts" | "medical" | "care-plan">("contacts");
  const recipient = mockCareRecipient;

  return (
    <div className="space-y-6">
      {/* Emergency Banner */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-red-200 dark:border-red-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/50">
                <Phone className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="font-semibold text-red-800 dark:text-red-300">
                  In case of emergency, call 911
                </p>
                <p className="text-sm text-red-700 dark:text-red-400">
                  Then notify primary emergency contact
                </p>
              </div>
            </div>
            <Button variant="destructive" size="lg" className="gap-2">
              <Phone className="h-4 w-4" />
              Call 911
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setActiveTab("contacts")}>
          <CardContent className="p-4 text-center">
            <User className="h-8 w-8 mx-auto text-primary" />
            <p className="font-medium mt-2">Emergency Contacts</p>
            <p className="text-sm text-muted-foreground">
              {recipient.emergencyContacts.length} contacts
            </p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setActiveTab("medical")}>
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 mx-auto text-red-500" />
            <p className="font-medium mt-2">Medical Information</p>
            <p className="text-sm text-muted-foreground">
              {recipient.medicalInfo.conditions.length} conditions
            </p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setActiveTab("care-plan")}>
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 mx-auto text-blue-500" />
            <p className="font-medium mt-2">Care Plan</p>
            <p className="text-sm text-muted-foreground">View instructions</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {[
          { id: "contacts", label: "Emergency Contacts", icon: User },
          { id: "medical", label: "Medical Info", icon: Heart },
          { id: "care-plan", label: "Care Plan", icon: FileText },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className="flex-1"
          >
            <tab.icon className="h-4 w-4 mr-1.5" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "contacts" && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Emergency Contacts</CardTitle>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Contact
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recipient.emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className={cn(
                  "p-4 rounded-lg border",
                  contact.isPrimary && "border-primary bg-primary/5"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">
                        {contact.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{contact.name}</p>
                        {contact.isPrimary && (
                          <Badge className="bg-primary text-primary-foreground text-xs">
                            Primary
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                      {contact.canMakeDecisions && (
                        <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                          <CheckCircle className="h-3 w-3" />
                          Can make medical decisions
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`tel:${contact.phone}`}>
                        <Phone className="h-4 w-4 mr-1" />
                        {contact.phone}
                      </a>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {activeTab === "medical" && (
        <div className="space-y-4">
          {/* Critical Info */}
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Critical Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Blood Type</p>
                  <p className="text-xl font-bold text-red-600">{recipient.medicalInfo.bloodType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Allergies</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {recipient.medicalInfo.allergies.map((allergy) => (
                      <Badge key={allergy} variant="destructive" className="text-xs">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              {recipient.medicalInfo.advanceDirective && (
                <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Advance Directive on file
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Conditions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary" />
                Medical Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {recipient.medicalInfo.conditions.map((condition) => (
                  <Badge key={condition} variant="secondary" className="text-sm py-1.5 px-3">
                    {condition}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Medications */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Pill className="h-5 w-5 text-purple-500" />
                Current Medications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recipient.medicalInfo.medications.map((med, i) => (
                  <div key={i} className="p-3 rounded-lg border bg-muted/20">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{med.name}</p>
                        <p className="text-sm text-muted-foreground">{med.dosage} • {med.frequency}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {med.purpose}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Prescribed by: {med.prescriber}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Healthcare Providers */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Primary Physician</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{recipient.medicalInfo.primaryPhysician?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {recipient.medicalInfo.primaryPhysician?.practice}
                </p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <a href={`tel:${recipient.medicalInfo.primaryPhysician?.phone}`}>
                    <Phone className="h-4 w-4 mr-1" />
                    {recipient.medicalInfo.primaryPhysician?.phone}
                  </a>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Pharmacy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{recipient.medicalInfo.pharmacy?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {recipient.medicalInfo.pharmacy?.address}
                </p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <a href={`tel:${recipient.medicalInfo.pharmacy?.phone}`}>
                    <Phone className="h-4 w-4 mr-1" />
                    {recipient.medicalInfo.pharmacy?.phone}
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Insurance */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Insurance Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Provider</p>
                  <p className="font-medium">{recipient.medicalInfo.insuranceProvider}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Member ID</p>
                  <p className="font-medium font-mono">{recipient.medicalInfo.insuranceId}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "care-plan" && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                Home & Environment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="font-medium">Address</p>
                <p className="text-sm text-muted-foreground">{recipient.address}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="font-medium">Entry Instructions</p>
                <p className="text-sm text-muted-foreground">
                  Ring doorbell and announce yourself. Spare key is under the blue flowerpot on the left.
                  Security code: 1942
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="font-medium">Safety Notes</p>
                <p className="text-sm text-muted-foreground">
                  Be careful of the step between kitchen and living room. Night light in hallway should
                  always be on. Bathroom grab bars on both sides of toilet.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Daily Routine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: "7:00 AM", activity: "Wake up, morning medications with breakfast" },
                  { time: "8:00 AM", activity: "Breakfast (prefers oatmeal or eggs)" },
                  { time: "9:00 AM", activity: "Morning hygiene, get dressed" },
                  { time: "10:00 AM", activity: "Light exercise or garden walk (weather permitting)" },
                  { time: "12:00 PM", activity: "Lunch, afternoon medications" },
                  { time: "2:00 PM", activity: "Rest time or quiet activities (reading, TV)" },
                  { time: "5:00 PM", activity: "Dinner preparation" },
                  { time: "6:00 PM", activity: "Dinner, evening medications" },
                  { time: "8:00 PM", activity: "Evening routine, prepare for bed" },
                  { time: "9:00 PM", activity: "Bedtime medication (Donepezil)" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 text-sm">
                    <span className="font-mono font-medium text-primary w-20">{item.time}</span>
                    <span className="text-muted-foreground">{item.activity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Special Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                <p className="font-medium text-amber-800 dark:text-amber-300">Dementia Care Notes</p>
                <ul className="text-sm text-amber-700 dark:text-amber-400 mt-2 space-y-1 list-disc list-inside">
                  <li>May ask repetitive questions - respond patiently each time</li>
                  <li>Sometimes forgets names - gently remind without making her feel bad</li>
                  <li>Can become confused in the evening (sundowning) - keep calm, redirect attention</li>
                  <li>Enjoys looking at old photo albums - helps with memory and mood</li>
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="font-medium">Dietary Restrictions</p>
                <p className="text-sm text-muted-foreground">
                  Diabetic diet - limit sugar and refined carbs. No shellfish (allergy).
                  Prefers smaller, more frequent meals. Ensure adequate hydration (tends to forget to drink).
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="font-medium">Mobility Assistance</p>
                <p className="text-sm text-muted-foreground">
                  Uses walker for longer distances. Can manage short distances with supervision.
                  Needs assistance with stairs - use elevator when available.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
