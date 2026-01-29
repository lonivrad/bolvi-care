"use client";

import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/ui/stats-card";
import { Progress } from "@/components/ui/progress";
import { useAuthStore, useBookingsStore } from "@/lib/store";
import {
  Calendar,
  Clock,
  DollarSign,
  Star,
  TrendingUp,
  Bell,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  MessageSquare,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CaregiverDashboard() {
  const { caregiverUser } = useAuthStore();
  const { bookings } = useBookingsStore();

  const todaysVisits = bookings.filter(
    (b) => b.status === "upcoming" && new Date(b.date).toDateString() === new Date().toDateString()
  );

  const pendingRequests = bookings.filter((b) => b.status === "pending");
  const thisWeekEarnings = 847;
  const thisMonthEarnings = 3240;
  const completedThisMonth = 28;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Welcome back, {caregiverUser?.name.split(" ")[0]}
              </h1>
              <p className="mt-1 text-muted-foreground">
                {todaysVisits.length > 0
                  ? `You have ${todaysVisits.length} visit${todaysVisits.length > 1 ? "s" : ""} today`
                  : "No visits scheduled for today"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/dashboard/caregiver/calendar">
                  <Calendar className="mr-2 h-4 w-4" />
                  Calendar
                </Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard/caregiver/availability">
                  Set Availability
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="This Week"
              value={`$${thisWeekEarnings}`}
              icon={DollarSign}
              trend={{ value: 15, isPositive: true }}
              description="vs last week"
            />
            <StatsCard
              title="This Month"
              value={`$${thisMonthEarnings}`}
              icon={TrendingUp}
              trend={{ value: 8, isPositive: true }}
              description="vs last month"
            />
            <StatsCard
              title="Completed Visits"
              value={completedThisMonth}
              icon={CheckCircle}
              description="this month"
            />
            <StatsCard
              title="Rating"
              value={caregiverUser?.rating || 4.9}
              icon={Star}
              description={`${caregiverUser?.reviewCount || 127} reviews`}
            />
          </div>

          {/* Pending Requests Alert */}
          {pendingRequests.length > 0 && (
            <Card className="mt-8 border-secondary bg-secondary/5">
              <CardContent className="flex items-center gap-4 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                  <Bell className="h-5 w-5 text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    You have {pendingRequests.length} pending request{pendingRequests.length > 1 ? "s" : ""}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Review and respond to booking requests
                  </p>
                </div>
                <Button asChild>
                  <Link href="/dashboard/caregiver/requests">View Requests</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="mt-8 grid gap-8 lg:grid-cols-3">
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
                  {todaysVisits.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Calendar className="h-12 w-12 text-muted-foreground/50" />
                      <h3 className="mt-4 font-semibold">No visits today</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Enjoy your day off or update your availability
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {todaysVisits.map((visit, index) => (
                        <div
                          key={visit.id}
                          className={cn(
                            "flex items-start gap-4 rounded-lg border border-border p-4",
                            index === 0 && "border-primary bg-primary/5"
                          )}
                        >
                          <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-muted text-center">
                            <span className="text-xs text-muted-foreground">
                              {visit.startTime.split(":")[0] >= "12" ? "PM" : "AM"}
                            </span>
                            <span className="text-sm font-semibold">{visit.startTime}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{visit.recipientName}</p>
                              {index === 0 && (
                                <Badge className="bg-primary text-primary-foreground">Next</Badge>
                              )}
                            </div>
                            <div className="mt-1 flex flex-wrap gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {visit.duration} hours
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {visit.address || "123 Main St"}
                              </span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {visit.services.slice(0, 3).map((service) => (
                                <Badge key={service} variant="secondary" className="text-xs">
                                  {service}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="font-semibold text-foreground">${visit.totalCost}</span>
                            <Button size="sm" variant={index === 0 ? "default" : "outline"}>
                              {index === 0 ? "Start Visit" : "View"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: "booking", text: "New booking request from Sarah M.", time: "2 hours ago" },
                      { type: "review", text: "You received a 5-star review!", time: "Yesterday" },
                      { type: "payment", text: "Payment of $156 received", time: "2 days ago" },
                      { type: "message", text: "New message from Johnson family", time: "3 days ago" },
                    ].map((activity, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full",
                            activity.type === "booking" && "bg-primary/10 text-primary",
                            activity.type === "review" && "bg-secondary/10 text-secondary",
                            activity.type === "payment" && "bg-accent/10 text-accent",
                            activity.type === "message" && "bg-muted text-muted-foreground"
                          )}
                        >
                          {activity.type === "booking" && <Calendar className="h-4 w-4" />}
                          {activity.type === "review" && <Star className="h-4 w-4" />}
                          {activity.type === "payment" && <DollarSign className="h-4 w-4" />}
                          {activity.type === "message" && <MessageSquare className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{activity.text}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
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
                      <span className="text-muted-foreground">85% complete</span>
                      <span className="font-medium">85/100</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-accent" />
                      <span>Background check verified</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-accent" />
                      <span>ID verified</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4" />
                      <span>Add CPR certification</span>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-4 w-full" asChild>
                    <Link href="/dashboard/caregiver/profile">Complete Profile</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Earnings Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Earnings Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Available balance</span>
                    <span className="text-xl font-bold">$1,245</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Pending</span>
                    <span className="font-medium">$312</span>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href="/dashboard/caregiver/earnings">View Earnings</Link>
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
      </main>
      <Footer />
    </div>
  );
}
