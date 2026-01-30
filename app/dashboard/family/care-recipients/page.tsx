"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User,
  Plus,
  Edit,
  Heart,
  Calendar,
  AlertCircle,
  Pill,
  Phone,
  FileText,
  Activity,
} from "lucide-react";

const careRecipients = [
  {
    id: "cr-1",
    name: "Eleanor Johnson",
    relationship: "Mother",
    age: 78,
    photo: "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=200&h=200&fit=crop",
    conditions: ["Mild Dementia", "Diabetes Type 2", "Arthritis"],
    medications: [
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
      { name: "Donepezil", dosage: "10mg", frequency: "Once daily" },
      { name: "Ibuprofen", dosage: "200mg", frequency: "As needed" },
    ],
    allergies: ["Penicillin", "Shellfish"],
    emergencyContact: {
      name: "Dr. Sarah Miller",
      phone: "(206) 555-0190",
      relationship: "Primary Physician",
    },
    careNeeds: ["Medication reminders", "Meal preparation", "Light housekeeping", "Companionship"],
    mobilityLevel: "Limited - uses walker",
    dietaryRestrictions: ["Low sodium", "Diabetic-friendly"],
    notes: "Enjoys gardening and reading. Best approached calmly in the morning.",
  },
  {
    id: "cr-2",
    name: "Robert Johnson",
    relationship: "Father",
    age: 82,
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    conditions: ["Heart Disease", "Hypertension"],
    medications: [
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
      { name: "Aspirin", dosage: "81mg", frequency: "Once daily" },
    ],
    allergies: ["Sulfa drugs"],
    emergencyContact: {
      name: "Dr. James Wilson",
      phone: "(206) 555-0191",
      relationship: "Cardiologist",
    },
    careNeeds: ["Vital sign monitoring", "Medication reminders", "Transportation to appointments"],
    mobilityLevel: "Good - independent",
    dietaryRestrictions: ["Low cholesterol", "Heart-healthy"],
    notes: "Former engineer, enjoys chess and watching sports.",
  },
];

export default function CareRecipientsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Care Recipients</h1>
          <p className="text-muted-foreground">
            Manage profiles for your loved ones receiving care
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Care Recipient
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Care Recipient</DialogTitle>
              <DialogDescription>
                Add a new care recipient to your account
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input placeholder="Enter full name" className="mt-1" />
                </div>
                <div>
                  <Label>Relationship</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mother">Mother</SelectItem>
                      <SelectItem value="father">Father</SelectItem>
                      <SelectItem value="grandmother">Grandmother</SelectItem>
                      <SelectItem value="grandfather">Grandfather</SelectItem>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date of Birth</Label>
                  <Input type="date" className="mt-1" />
                </div>
                <div>
                  <Label>Mobility Level</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select mobility level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="independent">Independent</SelectItem>
                      <SelectItem value="limited">Limited (uses walker/cane)</SelectItem>
                      <SelectItem value="wheelchair">Wheelchair user</SelectItem>
                      <SelectItem value="bedridden">Bedridden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Medical Conditions</Label>
                <Textarea
                  placeholder="List medical conditions, separated by commas"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Allergies</Label>
                <Input placeholder="List allergies, separated by commas" className="mt-1" />
              </div>
              <div>
                <Label>Care Needs</Label>
                <Textarea
                  placeholder="Describe care needs and preferences"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Additional Notes</Label>
                <Textarea
                  placeholder="Any additional information caregivers should know"
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Add Care Recipient
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {careRecipients.map((recipient) => (
          <Card key={recipient.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Profile Section */}
                <div className="flex items-start gap-4">
                  <img
                    src={recipient.photo}
                    alt={recipient.name}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {recipient.name}
                    </h2>
                    <p className="text-muted-foreground">
                      {recipient.relationship} • {recipient.age} years old
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="outline">
                        <Activity className="mr-1 h-3 w-3" />
                        {recipient.mobilityLevel}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm" className="mt-3">
                      <Edit className="mr-2 h-3 w-3" />
                      Edit Profile
                    </Button>
                  </div>
                </div>

                {/* Details Section */}
                <div className="flex-1 grid gap-4 md:grid-cols-2">
                  {/* Medical Conditions */}
                  <div className="rounded-lg border border-border p-4">
                    <h3 className="flex items-center gap-2 font-medium text-foreground">
                      <Heart className="h-4 w-4 text-red-500" />
                      Medical Conditions
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {recipient.conditions.map((condition) => (
                        <Badge key={condition} variant="secondary">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Allergies */}
                  <div className="rounded-lg border border-border p-4">
                    <h3 className="flex items-center gap-2 font-medium text-foreground">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      Allergies
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {recipient.allergies.map((allergy) => (
                        <Badge key={allergy} variant="destructive">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Medications */}
                  <div className="rounded-lg border border-border p-4">
                    <h3 className="flex items-center gap-2 font-medium text-foreground">
                      <Pill className="h-4 w-4 text-blue-500" />
                      Medications
                    </h3>
                    <div className="mt-2 space-y-2">
                      {recipient.medications.map((med) => (
                        <div key={med.name} className="text-sm">
                          <span className="font-medium">{med.name}</span>
                          <span className="text-muted-foreground">
                            {" "}
                            - {med.dosage}, {med.frequency}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="rounded-lg border border-border p-4">
                    <h3 className="flex items-center gap-2 font-medium text-foreground">
                      <Phone className="h-4 w-4 text-green-500" />
                      Emergency Contact
                    </h3>
                    <div className="mt-2 text-sm">
                      <p className="font-medium">{recipient.emergencyContact.name}</p>
                      <p className="text-muted-foreground">
                        {recipient.emergencyContact.relationship}
                      </p>
                      <p className="text-primary">{recipient.emergencyContact.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Care Needs & Notes */}
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-muted p-4">
                  <h3 className="flex items-center gap-2 font-medium text-foreground">
                    <FileText className="h-4 w-4" />
                    Care Needs
                  </h3>
                  <ul className="mt-2 space-y-1">
                    {recipient.careNeeds.map((need) => (
                      <li key={need} className="text-sm text-muted-foreground">
                        • {need}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <h3 className="flex items-center gap-2 font-medium text-foreground">
                    <User className="h-4 w-4" />
                    Notes for Caregivers
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {recipient.notes}
                  </p>
                  <div className="mt-2">
                    <span className="text-sm font-medium">Dietary:</span>
                    <span className="text-sm text-muted-foreground">
                      {" "}
                      {recipient.dietaryRestrictions.join(", ")}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
