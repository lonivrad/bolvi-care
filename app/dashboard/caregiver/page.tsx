"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/ui/stats-card";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Clock,
  DollarSign,
  Star,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  MessageSquare,
  Loader2,
  User,
} from "lucide-react";

interface CaregiverProfile {
  id: string;
  headline: string | null;
  bio: string | null;
  hourlyRate: number | null;
  rating: number | null;
  reviewCount: number;
  isNew: boolean;
  specialties: string[];
  yearsExperience: number | null;
  user: {
    name: string;
    email: string;
    photo: string | null;
  };
}

export default function CaregiverDashboard() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<CaregiverProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile/caregiver");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const userName = session?.user?.name || "Caregiver";
  const firstName = userName.split(" ")[0];

  // Calculate profile completion
  const completedItems = [
    !!profile?.bio,
    !!profile?.headline,
    !!profile?.hourlyRate,
    (profile?.specialties?.length || 0) > 0,
    !!session?.user?.image,
  ];
  const completionPercentage = Math.round(
    (completedItems.filter(Boolean).length / completedItems.length) * 100
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Welcome back, {firstName}!
          </h1>
          <p className="mt-1 text-muted-foreground">
            {profile?.isNew
              ? "Complete your profile to start receiving booking requests"
              : "Here's an overview of your caregiving activity"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/caregiver/calendar">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/dashboard/caregiver/availability">
              Set Availability
            </Link>
          </Button>
        </div>
      </div>

      {/* New User Welcome Card */}
      {profile?.isNew && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Complete Your Profile</h3>
              <p className="text-sm text-muted-foreground">
                Families can&apos;t find you until your profile is complete. Add your bio, photo, and rates.
              </p>
            </div>
            <Button asChild>
              <Link href="/onboarding/caregiver">Complete Setup</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="This Week"
          value="$0"
          icon={DollarSign}
          description="No earnings yet"
        />
        <StatsCard
          title="This Month"
          value="$0"
          icon={TrendingUp}
          description="Start accepting jobs"
        />
        <StatsCard
          title="Completed Visits"
          value={0}
          icon={CheckCircle}
          description="this month"
        />
        <StatsCard
          title="Rating"
          value={profile?.rating || "-"}
          icon={Star}
          description={profile?.reviewCount ? `${profile.reviewCount} reviews` : "No reviews yet"}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-8 lg:col-span-2">
          {/* Today's Schedule */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Today&apos;s Schedule</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/caregiver/calendar">
                  View Calendar
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 font-semibold">No visits today</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {profile?.isNew
                    ? "Complete your profile to start receiving bookings"
                    : "Enjoy your day off or update your availability"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Getting Started Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ChecklistItem
                  completed={!!profile?.bio}
                  title="Add your bio"
                  description="Tell families about yourself"
                  href="/dashboard/caregiver/profile"
                />
                <ChecklistItem
                  completed={!!session?.user?.image}
                  title="Upload a profile photo"
                  description="Profiles with photos get 3x more bookings"
                  href="/profile"
                />
                <ChecklistItem
                  completed={(profile?.specialties?.length || 0) > 0}
                  title="Select your services"
                  description="What types of care do you offer?"
                  href="/dashboard/caregiver/profile"
                />
                <ChecklistItem
                  completed={!!profile?.hourlyRate}
                  title="Set your hourly rate"
                  description="Let families know your pricing"
                  href="/dashboard/caregiver/profile"
                />
                <ChecklistItem
                  completed={false}
                  title="Complete background check"
                  description="Required to receive bookings"
                  href="/dashboard/caregiver/verification"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Completion */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{completionPercentage}% complete</span>
                  <span className="font-medium text-foreground">{completionPercentage}/100</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>
              <div className="mt-4 space-y-2">
                {profile?.bio ? (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-foreground">Bio added</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <span>Add your bio</span>
                  </div>
                )}
                {session?.user?.image ? (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-foreground">Photo uploaded</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <span>Add profile photo</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span>Complete background check</span>
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full" asChild>
                <Link href="/profile">Complete Profile</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Your Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {profile?.headline ? (
                <p className="text-sm font-medium">{profile.headline}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">No headline set</p>
              )}
              {profile?.hourlyRate ? (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">${profile.hourlyRate}/hour</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No rate set</p>
              )}
              {profile?.specialties && profile.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {profile.specialties.slice(0, 3).map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {profile.specialties.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{profile.specialties.length - 3}
                    </Badge>
                  )}
                </div>
              )}
              <Button variant="outline" className="w-full" size="sm" asChild>
                <Link href="/dashboard/caregiver/profile">Edit Profile</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/dashboard/caregiver/availability">
                  <Calendar className="mr-2 h-4 w-4" />
                  Set Availability
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/messages">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Messages
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/dashboard/caregiver/profile">
                  <Star className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ChecklistItem({
  completed,
  title,
  description,
  href,
}: {
  completed: boolean;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
    >
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full ${
          completed
            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {completed ? (
          <CheckCircle className="h-4 w-4" />
        ) : (
          <Clock className="h-4 w-4" />
        )}
      </div>
      <div className="flex-1">
        <p className={`font-medium ${completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
          {title}
        </p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {!completed && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
    </Link>
  );
}
