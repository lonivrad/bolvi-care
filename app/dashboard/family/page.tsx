"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/ui/stats-card";
import {
  Calendar,
  Clock,
  DollarSign,
  Users,
  ArrowRight,
  Heart,
  Search,
  Loader2,
  UserPlus,
  MessageSquare,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FamilyProfile {
  id: string;
  preferences: {
    onboardingComplete?: boolean;
  } | null;
}

interface CareRecipient {
  id: string;
  name: string;
  relationship: string;
  age: number | null;
}

export default function FamilyDashboard() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<FamilyProfile | null>(null);
  const [careRecipients, setCareRecipients] = useState<CareRecipient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/profile/family");
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
          setCareRecipients(data.careRecipients || []);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const userName = session?.user?.name || "User";
  const firstName = userName.split(" ")[0];

  const isNewUser = !profile?.preferences?.onboardingComplete && careRecipients.length === 0;

  const completedItems = [
    !!session?.user?.name,
    !!session?.user?.email,
    careRecipients.length > 0,
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
          <p className="mt-2 text-muted-foreground">
            {isNewUser
              ? "Get started by adding a care recipient"
              : "Here's an overview of your care schedule"}
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/caregivers">
            <Search className="mr-2 h-4 w-4" />
            Find Caregiver
          </Link>
        </Button>
      </div>

      {/* New User Welcome Card */}
      {isNewUser && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Complete Your Setup</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Add your care recipient to start finding the perfect caregiver for your family.
              </p>
            </div>
            <Button asChild>
              <Link href="/onboarding/family">Get Started</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Upcoming Visits"
          value={0}
          icon={Calendar}
          description="this week"
        />
        <StatsCard
          title="Hours This Month"
          value={0}
          icon={Clock}
          description="No visits yet"
        />
        <StatsCard
          title="Total Spent"
          value="$0"
          icon={DollarSign}
          description="this month"
        />
        <StatsCard
          title="Care Recipients"
          value={careRecipients.length}
          icon={Users}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Visits */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle>Upcoming Visits</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/family/bookings">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 font-semibold">No upcoming visits</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                  {careRecipients.length === 0
                    ? "Add a care recipient first, then you can book caregivers"
                    : "Book your first caregiver to get started"}
                </p>
                <Button className="mt-6" asChild>
                  <Link href={careRecipients.length === 0 ? "/onboarding/family" : "/caregivers"}>
                    {careRecipients.length === 0 ? "Add Care Recipient" : "Find Caregiver"}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Getting Started Checklist */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ChecklistItem
                  completed={true}
                  title="Create your account"
                  description="Your account is set up and ready"
                />
                <ChecklistItem
                  completed={careRecipients.length > 0}
                  title="Add a care recipient"
                  description="Tell us who needs care"
                  href="/onboarding/family"
                />
                <ChecklistItem
                  completed={false}
                  title="Book your first caregiver"
                  description="Find the perfect match for your family"
                  href="/caregivers"
                />
                <ChecklistItem
                  completed={false}
                  title="Add a payment method"
                  description="Secure and easy payments"
                  href="/settings"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Completion */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Profile Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{completionPercentage}% complete</span>
                  <span className="font-medium text-foreground">{completionPercentage}/100</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>
              <div className="mt-6 space-y-3">
                {careRecipients.length > 0 ? (
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                    <span className="text-foreground">Care recipient added</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
                    <span>Add a care recipient</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
                  <span>Add payment method</span>
                </div>
              </div>
              <Button variant="outline" className="mt-6 w-full" asChild>
                <Link href="/onboarding/family">Complete Setup</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Care Recipients */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base">Care Recipients</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/family/care-recipients">Manage</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {careRecipients.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Users className="h-10 w-10 text-muted-foreground/50" />
                  <p className="mt-3 text-sm text-muted-foreground">No care recipients yet</p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Link href="/onboarding/family">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Care Recipient
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {careRecipients.map((recipient) => (
                    <div
                      key={recipient.id}
                      className="flex items-center gap-3 rounded-lg p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                        {recipient.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{recipient.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {recipient.relationship}
                          {recipient.age && ` · ${recipient.age} years old`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/caregivers">
                  <Search className="mr-3 h-4 w-4" />
                  Find Caregivers
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/family/bookings">
                  <Calendar className="mr-3 h-4 w-4" />
                  View Bookings
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/messages">
                  <MessageSquare className="mr-3 h-4 w-4" />
                  Messages
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
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
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
      <div className="flex-1 min-w-0">
        <p className={`font-medium ${completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
          {title}
        </p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {!completed && href && <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />}
    </div>
  );

  if (href && !completed) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
