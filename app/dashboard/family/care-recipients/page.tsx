"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  User,
  Plus,
  Edit,
  Heart,
  AlertCircle,
  Pill,
  Phone,
  FileText,
  Activity,
  Shield,
  Trash2,
  Save,
  X,
  Calendar,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { EmergencyInfo } from "@/components/emergency/emergency-info";

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

interface CareRecipient {
  id: string;
  name: string;
  relationship: string;
  age: number;
  photo: string;
  conditions: string[];
  medications: Medication[];
  allergies: string[];
  emergencyContact: EmergencyContact;
  careNeeds: string[];
  mobilityLevel: string;
  dietaryRestrictions: string[];
  notes: string;
}

const initialCareRecipients: CareRecipient[] = [
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
  const { toast } = useToast();
  const [careRecipients, setCareRecipients] = useState<CareRecipient[]>(initialCareRecipients);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<CareRecipient | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  const [showEmergencyInfo, setShowEmergencyInfo] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Form state for add/edit
  const [formData, setFormData] = useState<Partial<CareRecipient>>({
    name: "",
    relationship: "",
    age: 0,
    conditions: [],
    medications: [],
    allergies: [],
    emergencyContact: { name: "", phone: "", relationship: "" },
    careNeeds: [],
    mobilityLevel: "",
    dietaryRestrictions: [],
    notes: "",
  });

  const [newCondition, setNewCondition] = useState("");
  const [newAllergy, setNewAllergy] = useState("");
  const [newCareNeed, setNewCareNeed] = useState("");
  const [newDietaryRestriction, setNewDietaryRestriction] = useState("");
  const [newMedication, setNewMedication] = useState<Medication>({ name: "", dosage: "", frequency: "" });

  const resetForm = () => {
    setFormData({
      name: "",
      relationship: "",
      age: 0,
      conditions: [],
      medications: [],
      allergies: [],
      emergencyContact: { name: "", phone: "", relationship: "" },
      careNeeds: [],
      mobilityLevel: "",
      dietaryRestrictions: [],
      notes: "",
    });
    setNewCondition("");
    setNewAllergy("");
    setNewCareNeed("");
    setNewDietaryRestriction("");
    setNewMedication({ name: "", dosage: "", frequency: "" });
  };

  const handleEditClick = (recipient: CareRecipient) => {
    setEditingRecipient(recipient);
    setFormData({ ...recipient });
    setIsEditDialogOpen(true);
    setActiveTab("profile");
  };

  const handleSaveEdit = () => {
    if (!editingRecipient) return;

    setCareRecipients(prev =>
      prev.map(r => r.id === editingRecipient.id ? { ...editingRecipient, ...formData } as CareRecipient : r)
    );
    toast({
      title: "Changes saved",
      description: `${formData.name}'s profile has been updated successfully.`,
      variant: "success",
    });
    setIsEditDialogOpen(false);
    setEditingRecipient(null);
    resetForm();
  };

  const handleAddRecipient = () => {
    const newRecipient: CareRecipient = {
      id: `cr-${Date.now()}`,
      name: formData.name || "",
      relationship: formData.relationship || "",
      age: formData.age || 0,
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
      conditions: formData.conditions || [],
      medications: formData.medications || [],
      allergies: formData.allergies || [],
      emergencyContact: formData.emergencyContact || { name: "", phone: "", relationship: "" },
      careNeeds: formData.careNeeds || [],
      mobilityLevel: formData.mobilityLevel || "",
      dietaryRestrictions: formData.dietaryRestrictions || [],
      notes: formData.notes || "",
    };

    setCareRecipients(prev => [...prev, newRecipient]);
    toast({
      title: "Care recipient added",
      description: `${formData.name} has been added successfully.`,
      variant: "success",
    });
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleDeleteRecipient = (id: string) => {
    const recipient = careRecipients.find(r => r.id === id);
    setCareRecipients(prev => prev.filter(r => r.id !== id));
    toast({
      title: "Care recipient removed",
      description: `${recipient?.name} has been removed from your account.`,
      variant: "default",
    });
  };

  const addToArray = (field: keyof CareRecipient, value: string) => {
    if (!value.trim()) return;
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[] || []), value.trim()],
    }));
  };

  const removeFromArray = (field: keyof CareRecipient, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }));
  };

  const addMedication = () => {
    if (!newMedication.name.trim()) return;
    setFormData(prev => ({
      ...prev,
      medications: [...(prev.medications || []), { ...newMedication }],
    }));
    setNewMedication({ name: "", dosage: "", frequency: "" });
  };

  const removeMedication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications?.filter((_, i) => i !== index),
    }));
  };

  const RecipientFormDialog = ({ isEdit = false }: { isEdit?: boolean }) => (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit Care Recipient" : "Add Care Recipient"}</DialogTitle>
        <DialogDescription>
          {isEdit ? "Update the care recipient's information" : "Add a new care recipient to your account"}
        </DialogDescription>
      </DialogHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="care">Care Needs</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Select
                value={formData.relationship || ""}
                onValueChange={(value) => setFormData(prev => ({ ...prev, relationship: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mother">Mother</SelectItem>
                  <SelectItem value="Father">Father</SelectItem>
                  <SelectItem value="Grandmother">Grandmother</SelectItem>
                  <SelectItem value="Grandfather">Grandfather</SelectItem>
                  <SelectItem value="Spouse">Spouse</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                placeholder="Enter age"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobility">Mobility Level</Label>
              <Select
                value={formData.mobilityLevel || ""}
                onValueChange={(value) => setFormData(prev => ({ ...prev, mobilityLevel: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select mobility level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Good - independent">Independent</SelectItem>
                  <SelectItem value="Limited - uses walker">Limited (uses walker/cane)</SelectItem>
                  <SelectItem value="Wheelchair user">Wheelchair user</SelectItem>
                  <SelectItem value="Bedridden">Bedridden</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes for Caregivers</Label>
            <Textarea
              id="notes"
              value={formData.notes || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Personality, preferences, important information for caregivers..."
              rows={4}
            />
          </div>
        </TabsContent>

        <TabsContent value="medical" className="space-y-4 mt-4">
          {/* Medical Conditions */}
          <div className="space-y-2">
            <Label>Medical Conditions</Label>
            <div className="flex gap-2">
              <Input
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="Add a condition"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addToArray("conditions", newCondition);
                    setNewCondition("");
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  addToArray("conditions", newCondition);
                  setNewCondition("");
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.conditions?.map((condition, i) => (
                <Badge key={i} variant="secondary" className="gap-1">
                  {condition}
                  <button onClick={() => removeFromArray("conditions", i)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div className="space-y-2">
            <Label>Allergies</Label>
            <div className="flex gap-2">
              <Input
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="Add an allergy"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addToArray("allergies", newAllergy);
                    setNewAllergy("");
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  addToArray("allergies", newAllergy);
                  setNewAllergy("");
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.allergies?.map((allergy, i) => (
                <Badge key={i} variant="destructive" className="gap-1">
                  {allergy}
                  <button onClick={() => removeFromArray("allergies", i)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Medications */}
          <div className="space-y-2">
            <Label>Medications</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                value={newMedication.name}
                onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Medication name"
              />
              <Input
                value={newMedication.dosage}
                onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                placeholder="Dosage (e.g., 500mg)"
              />
              <div className="flex gap-2">
                <Input
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, frequency: e.target.value }))}
                  placeholder="Frequency"
                />
                <Button type="button" variant="outline" onClick={addMedication}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2 mt-2">
              {formData.medications?.map((med, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded border bg-muted/50">
                  <div className="text-sm">
                    <span className="font-medium">{med.name}</span>
                    <span className="text-muted-foreground"> - {med.dosage}, {med.frequency}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeMedication(i)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="care" className="space-y-4 mt-4">
          {/* Care Needs */}
          <div className="space-y-2">
            <Label>Care Needs</Label>
            <div className="flex gap-2">
              <Input
                value={newCareNeed}
                onChange={(e) => setNewCareNeed(e.target.value)}
                placeholder="Add a care need"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addToArray("careNeeds", newCareNeed);
                    setNewCareNeed("");
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  addToArray("careNeeds", newCareNeed);
                  setNewCareNeed("");
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 mt-2">
              {formData.careNeeds?.map((need, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded border bg-muted/50">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {need}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeFromArray("careNeeds", i)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Dietary Restrictions */}
          <div className="space-y-2">
            <Label>Dietary Restrictions</Label>
            <div className="flex gap-2">
              <Input
                value={newDietaryRestriction}
                onChange={(e) => setNewDietaryRestriction(e.target.value)}
                placeholder="Add a dietary restriction"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addToArray("dietaryRestrictions", newDietaryRestriction);
                    setNewDietaryRestriction("");
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  addToArray("dietaryRestrictions", newDietaryRestriction);
                  setNewDietaryRestriction("");
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.dietaryRestrictions?.map((restriction, i) => (
                <Badge key={i} variant="outline" className="gap-1">
                  {restriction}
                  <button onClick={() => removeFromArray("dietaryRestrictions", i)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="emergency-name">Emergency Contact Name</Label>
            <Input
              id="emergency-name"
              value={formData.emergencyContact?.name || ""}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                emergencyContact: { ...prev.emergencyContact!, name: e.target.value }
              }))}
              placeholder="Contact name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergency-relationship">Relationship</Label>
            <Input
              id="emergency-relationship"
              value={formData.emergencyContact?.relationship || ""}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                emergencyContact: { ...prev.emergencyContact!, relationship: e.target.value }
              }))}
              placeholder="e.g., Primary Physician, Sibling"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergency-phone">Phone Number</Label>
            <Input
              id="emergency-phone"
              value={formData.emergencyContact?.phone || ""}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                emergencyContact: { ...prev.emergencyContact!, phone: e.target.value }
              }))}
              placeholder="(xxx) xxx-xxxx"
            />
          </div>
        </TabsContent>
      </Tabs>

      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={() => {
          isEdit ? setIsEditDialogOpen(false) : setIsAddDialogOpen(false);
          resetForm();
        }}>
          Cancel
        </Button>
        <Button onClick={isEdit ? handleSaveEdit : handleAddRecipient}>
          <Save className="mr-2 h-4 w-4" />
          {isEdit ? "Save Changes" : "Add Care Recipient"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Care Recipients</h1>
          <p className="text-muted-foreground">
            Manage profiles for your loved ones receiving care
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Care Recipient
            </Button>
          </DialogTrigger>
          {/* eslint-disable-next-line react-hooks/static-components -- inline dialog closes over local form state; lifting it out is a separate refactor */}
          <RecipientFormDialog isEdit={false} />
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) {
          setEditingRecipient(null);
          resetForm();
        }
      }}>
        {/* eslint-disable-next-line react-hooks/static-components -- inline dialog closes over local form state; lifting it out is a separate refactor */}
        <RecipientFormDialog isEdit={true} />
      </Dialog>

      <div className="grid gap-6">
        {careRecipients.map((recipient) => (
          <Card key={recipient.id}>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Profile Section */}
                <div className="flex items-start gap-4">
                  <Image
                    src={recipient.photo}
                    alt={recipient.name}
                    width={96}
                    height={96}
                    className="rounded-full object-cover"
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
                    <div className="mt-3 flex gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(recipient)}
                      >
                        <Edit className="mr-2 h-3 w-3" />
                        Edit Profile
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRecipient(recipient.id);
                          setShowEmergencyInfo(true);
                        }}
                      >
                        <Shield className="mr-2 h-3 w-3" />
                        Emergency Info
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="mr-2 h-3 w-3" />
                            Remove
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove care recipient?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove {recipient.name} from your account?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDeleteRecipient(recipient.id)}
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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
                      <li key={need} className="text-sm text-muted-foreground flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {need}
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

      {/* Emergency Info Section */}
      {showEmergencyInfo && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              Emergency Information
              {selectedRecipient && (
                <span className="text-muted-foreground font-normal text-base ml-2">
                  for {careRecipients.find(r => r.id === selectedRecipient)?.name}
                </span>
              )}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setShowEmergencyInfo(false)}>
              Hide
            </Button>
          </div>
          <EmergencyInfo />
        </div>
      )}
    </div>
  );
}
