"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
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
    phone: "(415) 555-0101",
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
    phone: "(415) 555-0102",
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
    phone: "(415) 555-0103",
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Care Team</h1>
          <p className="text-muted-foreground">
            Manage your trusted caregivers and care coordination
          </p>
        </div>
        <Link href="/caregivers">
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Find Caregivers
          </Button>
        </Link>
      </div>

      {/* Team Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-pink-500" />
              <span className="text-sm text-muted-foreground">Team Members</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{careTeam.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Total Visits</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {careTeam.reduce((sum, cg) => sum + cg.completedVisits, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Upcoming</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {careTeam.reduce((sum, cg) => sum + cg.upcomingVisits, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Avg Rating</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {(careTeam.reduce((sum, cg) => sum + cg.rating, 0) / careTeam.length).toFixed(1)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Team Members */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Active Caregivers</h2>
        <div className="grid gap-4">
          {careTeam.map((caregiver) => (
            <Card key={caregiver.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Profile */}
                  <div className="flex items-start gap-4">
                    <img
                      src={caregiver.photo}
                      alt={caregiver.name}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {caregiver.name}
                        </h3>
                        <Badge
                          variant={
                            caregiver.role === "Primary Caregiver"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {caregiver.role}
                        </Badge>
                      </div>
                      <div className="mt-1 flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{caregiver.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({caregiver.reviewCount} reviews)
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {caregiver.specialties.map((specialty) => (
                          <Badge key={specialty} variant="outline">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Stats & Contact */}
                  <div className="flex-1 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{caregiver.completedVisits} completed visits</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span>{caregiver.upcomingVisits} upcoming</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Last: {caregiver.lastVisit}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>Next: {caregiver.nextVisit}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{caregiver.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{caregiver.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes & Actions */}
                <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Note: </span>
                    {caregiver.notes}
                  </p>
                  <div className="flex gap-2">
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
              <Card key={caregiver.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={caregiver.photo}
                        alt={caregiver.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {caregiver.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {caregiver.rating} •{" "}
                          {caregiver.specialties.join(", ")}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">Pending</Badge>
                      <p className="mt-1 text-xs text-muted-foreground">
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
