"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import Link from "next/link";

const careTeam = [
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

const invitedCaregivers = [
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

export default function CareTeamPage() {
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
              {(careTeam.reduce((sum, cg) => sum + cg.rating, 0) / careTeam.length).toFixed(1)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Team Members */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Active Caregivers</h2>
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
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
                    <div className="text-right flex flex-col items-end gap-1.5">
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0">
                        Pending
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        Invited {caregiver.invitedDate}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
