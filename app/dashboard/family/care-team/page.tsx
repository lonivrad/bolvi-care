"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
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
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/toast";
import {
  Star,
  MessageSquare,
  Calendar,
  Phone,
  Mail,
  Heart,
  Clock,
  CheckCircle,
  UserPlus,
  MoreHorizontal,
  Edit,
  Trash2,
  UserMinus,
  X,
} from "lucide-react";

interface Caregiver {
  id: string;
  name: string;
  photo: string;
  role: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  completedVisits: number;
  upcomingVisits: number;
  phone: string;
  email: string;
  status: string;
  lastVisit: string;
  nextVisit: string;
  notes: string;
}

interface InvitedCaregiver {
  id: string;
  name: string;
  photo: string;
  specialties: string[];
  rating: number;
  status: string;
  invitedDate: string;
}

const initialCareTeam: Caregiver[] = [
  {
    id: "cg-1",
    name: "Maria Rodriguez",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    role: "Primary Caregiver",
    specialties: ["Dementia Care", "Medication Management"],
    rating: 4.9,
    reviewCount: 127,
    completedVisits: 48,
    upcomingVisits: 3,
    phone: "(206) 555-0101",
    email: "maria.r@email.com",
    status: "active",
    lastVisit: "Today, 2:00 PM",
    nextVisit: "Tomorrow, 9:00 AM",
    notes: "Excellent rapport with Eleanor. Very reliable and communicative.",
  },
  {
    id: "cg-2",
    name: "David Kim",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    role: "Backup Caregiver",
    specialties: ["Physical Therapy", "Mobility Assistance"],
    rating: 4.8,
    reviewCount: 89,
    completedVisits: 12,
    upcomingVisits: 1,
    phone: "(206) 555-0102",
    email: "david.k@email.com",
    status: "active",
    lastVisit: "Last Week",
    nextVisit: "Friday, 10:00 AM",
    notes: "Great with Robert. Helps with physical exercises.",
  },
  {
    id: "cg-3",
    name: "Sarah Thompson",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    role: "Weekend Caregiver",
    specialties: ["Companionship", "Meal Preparation"],
    rating: 4.7,
    reviewCount: 56,
    completedVisits: 8,
    upcomingVisits: 2,
    phone: "(206) 555-0103",
    email: "sarah.t@email.com",
    status: "active",
    lastVisit: "Sunday",
    nextVisit: "Saturday, 8:00 AM",
    notes: "Eleanor enjoys her company. Makes wonderful meals.",
  },
];

const initialInvited: InvitedCaregiver[] = [
  {
    id: "inv-1",
    name: "Jennifer Lee",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    specialties: ["Night Care", "Dementia Care"],
    rating: 4.9,
    status: "pending",
    invitedDate: "2 days ago",
  },
];

const roleOptions = [
  "Primary Caregiver",
  "Backup Caregiver",
  "Weekend Caregiver",
  "Night Caregiver",
  "Relief Caregiver",
];

export default function CareTeamPage() {
  const { toast } = useToast();
  const [careTeam, setCareTeam] = useState<Caregiver[]>(initialCareTeam);
  const [invitedCaregivers, setInvitedCaregivers] = useState<InvitedCaregiver[]>(initialInvited);

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCaregiver, setSelectedCaregiver] = useState<Caregiver | null>(null);
  const [editRole, setEditRole] = useState("");
  const [editNotes, setEditNotes] = useState("");

  // Remove confirmation state
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [caregiverToRemove, setCaregiverToRemove] = useState<Caregiver | null>(null);

  // Cancel invitation state
  const [cancelInviteDialogOpen, setCancelInviteDialogOpen] = useState(false);
  const [inviteToCancel, setInviteToCancel] = useState<InvitedCaregiver | null>(null);

  const handleEditClick = (caregiver: Caregiver) => {
    setSelectedCaregiver(caregiver);
    setEditRole(caregiver.role);
    setEditNotes(caregiver.notes);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedCaregiver) {
      setCareTeam(team =>
        team.map(cg =>
          cg.id === selectedCaregiver.id
            ? { ...cg, role: editRole, notes: editNotes }
            : cg
        )
      );
      toast({
        title: "Changes saved",
        description: `Updated information for ${selectedCaregiver.name}`,
        variant: "success",
      });
    }
    setEditDialogOpen(false);
    setSelectedCaregiver(null);
  };

  const handleRemoveClick = (caregiver: Caregiver) => {
    setCaregiverToRemove(caregiver);
    setRemoveDialogOpen(true);
  };

  const confirmRemove = () => {
    if (caregiverToRemove) {
      setCareTeam(team => team.filter(cg => cg.id !== caregiverToRemove.id));
      toast({
        title: "Caregiver removed",
        description: `${caregiverToRemove.name} has been removed from your care team`,
        variant: "default",
      });
    }
    setRemoveDialogOpen(false);
    setCaregiverToRemove(null);
  };

  const handleCancelInvite = (invite: InvitedCaregiver) => {
    setInviteToCancel(invite);
    setCancelInviteDialogOpen(true);
  };

  const confirmCancelInvite = () => {
    if (inviteToCancel) {
      setInvitedCaregivers(invites => invites.filter(inv => inv.id !== inviteToCancel.id));
      toast({
        title: "Invitation cancelled",
        description: `Invitation to ${inviteToCancel.name} has been cancelled`,
        variant: "default",
      });
    }
    setCancelInviteDialogOpen(false);
    setInviteToCancel(null);
  };

  const handleResendInvite = (invite: InvitedCaregiver) => {
    toast({
      title: "Invitation resent",
      description: `A new invitation has been sent to ${invite.name}`,
      variant: "success",
    });
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Care Team</h1>
          <p className="text-muted-foreground mt-1">
            Manage your trusted caregivers and care coordination
          </p>
        </div>
        <Link href="/caregivers">
          <Button size="lg">
            <UserPlus className="mr-2 h-4 w-4" />
            Find Caregivers
          </Button>
        </Link>
      </div>

      {/* Team Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-pink-50 to-white dark:from-pink-950/20 dark:to-card border-pink-100 dark:border-pink-900/30">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900/30">
                <Heart className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Team Members</span>
            </div>
            <p className="mt-3 text-3xl font-bold text-foreground">{careTeam.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-card border-green-100 dark:border-green-900/30">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Total Visits</span>
            </div>
            <p className="mt-3 text-3xl font-bold text-foreground">
              {careTeam.reduce((sum, cg) => sum + cg.completedVisits, 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-card border-blue-100 dark:border-blue-900/30">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Upcoming</span>
            </div>
            <p className="mt-3 text-3xl font-bold text-foreground">
              {careTeam.reduce((sum, cg) => sum + cg.upcomingVisits, 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-card border-amber-100 dark:border-amber-900/30">
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Avg Rating</span>
            </div>
            <p className="mt-3 text-3xl font-bold text-foreground">
              {careTeam.length > 0
                ? (careTeam.reduce((sum, cg) => sum + cg.rating, 0) / careTeam.length).toFixed(1)
                : "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Team Members */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Active Caregivers</h2>
        {careTeam.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Heart className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No caregivers yet</h3>
              <p className="mt-2 text-muted-foreground text-center">
                Start building your care team by finding trusted caregivers
              </p>
              <Button className="mt-4" asChild>
                <Link href="/caregivers">Find Caregivers</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5">
            {careTeam.map((caregiver) => (
              <Card key={caregiver.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Profile */}
                      <div className="flex items-start gap-4">
                        <div className="relative h-20 w-20 flex-shrink-0">
                          <Image
                            src={caregiver.photo}
                            alt={caregiver.name}
                            fill
                            className="rounded-full object-cover ring-2 ring-border"
                          />
                          <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 ring-2 ring-card" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-foreground">
                              {caregiver.name}
                            </h3>
                            <Badge
                              variant={
                                caregiver.role === "Primary Caregiver"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {caregiver.role}
                            </Badge>
                          </div>
                          <div className="mt-1.5 flex items-center gap-1.5">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="font-semibold text-foreground">{caregiver.rating}</span>
                            <span className="text-sm text-muted-foreground">
                              ({caregiver.reviewCount} reviews)
                            </span>
                          </div>
                          <div className="mt-2.5 flex flex-wrap gap-1.5">
                            {caregiver.specialties.map((specialty) => (
                              <Badge key={specialty} variant="outline" className="text-xs bg-muted/50">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Stats & Contact */}
                      <div className="flex-1 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-2.5 p-3 rounded-lg bg-muted/30">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-foreground font-medium">{caregiver.completedVisits}</span>
                            <span className="text-muted-foreground">completed visits</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-blue-500" />
                            <span className="text-foreground font-medium">{caregiver.upcomingVisits}</span>
                            <span className="text-muted-foreground">upcoming</span>
                          </div>
                        </div>
                        <div className="space-y-2.5 p-3 rounded-lg bg-muted/30">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Last:</span>
                            <span className="font-medium text-foreground">{caregiver.lastVisit}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="text-muted-foreground">Next:</span>
                            <span className="font-medium text-foreground">{caregiver.nextVisit}</span>
                          </div>
                        </div>
                        <div className="space-y-2.5 p-3 rounded-lg bg-muted/30">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{caregiver.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground truncate">{caregiver.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes & Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-5 py-4 sm:px-6 border-t border-border bg-muted/20">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Note: </span>
                      {caregiver.notes}
                    </p>
                    <div className="flex gap-2 flex-shrink-0">
                      <Link href="/messages">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Message
                        </Button>
                      </Link>
                      <Link href={`/book/${caregiver.id}`}>
                        <Button size="sm">
                          <Calendar className="mr-2 h-4 w-4" />
                          Book
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(caregiver)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Role & Notes
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleRemoveClick(caregiver)}
                          >
                            <UserMinus className="mr-2 h-4 w-4" />
                            Remove from Team
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Pending Invitations */}
      {invitedCaregivers.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Pending Invitations
          </h2>
          <div className="grid gap-4">
            {invitedCaregivers.map((caregiver) => (
              <Card key={caregiver.id} className="border-dashed border-2 bg-muted/10">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <Image
                          src={caregiver.photo}
                          alt={caregiver.name}
                          fill
                          className="rounded-full object-cover opacity-80"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {caregiver.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-medium">{caregiver.rating}</span>
                          <span className="mx-1">•</span>
                          {caregiver.specialties.join(", ")}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right flex flex-col items-end gap-1.5">
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0">
                          Pending
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          Invited {caregiver.invitedDate}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleResendInvite(caregiver)}>
                            <Mail className="mr-2 h-4 w-4" />
                            Resend Invitation
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleCancelInvite(caregiver)}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Cancel Invitation
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Caregiver Details</DialogTitle>
            <DialogDescription>
              Update the role and notes for {selectedCaregiver?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Add personal notes about this caregiver..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                These notes are private and only visible to you
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Confirmation Dialog */}
      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Care Team?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {caregiverToRemove?.name} from your care team?
              This won&apos;t cancel any upcoming bookings with them.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {caregiverToRemove && (
            <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/50">
              <Image
                src={caregiverToRemove.photo}
                alt={caregiverToRemove.name}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <p className="font-medium">{caregiverToRemove.name}</p>
                <p className="text-sm text-muted-foreground">{caregiverToRemove.role}</p>
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Keep on Team</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemove}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Invitation Dialog */}
      <AlertDialog open={cancelInviteDialogOpen} onOpenChange={setCancelInviteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Invitation?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel the invitation to {inviteToCancel?.name}?
              They will no longer be able to join your care team with this invitation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Invitation</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancelInvite}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel Invitation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
