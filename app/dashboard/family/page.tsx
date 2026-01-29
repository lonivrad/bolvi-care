"use client";

import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/ui/stats-card";
import { CaregiverCard } from "@/components/caregivers/caregiver-card";
import { useAuthStore, useBookingsStore } from "@/lib/store";
import { caregivers } from "@/lib/mock-data";
import {
  Calendar,
  Clock,
  DollarSign,
  Users,
  ArrowRight,
  Star,
  Bell,
  Heart,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function FamilyDashboard() {
  const { familyUser } = useAuthStore();
  const { bookings } = useBookingsStore();

  const upcomingBookings = bookings.filter((b) => b.status === "upcoming").slice(0, 3);
  const favoriteCaregiversData = caregivers.filter((c) => 
    familyUser?.favoriteCaregiversIds.includes(c.id)
  );

  const totalSpentThisMonth = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + b.totalCost, 0);

  const totalHoursThisMonth = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + b.duration, 0);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Welcome back, {familyUser?.name.split(' ')[0]}
              </h1>
              <p className="mt-1 text-muted-foreground">
                Here's an overview of your care schedule
              </p>
            </div>
            <Button asChild>
              <Link href="/caregivers">
                <Search className="mr-2 h-4 w-4" />
                Find Caregiver
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Upcoming Visits"
              value={upcomingBookings.length}
              icon={Calendar}
              description="this week"
            />
            <StatsCard
              title="Hours This Month"
              value={totalHoursThisMonth}
              icon={Clock}
              trend={{ value: 12, isPositive: true }}
              description="vs last month"
            />
            <StatsCard
              title="Total Spent"
              value={`$${totalSpentThisMonth}`}
              icon={DollarSign}
              description="this month"
            />
            <StatsCard
              title="Care Recipients"
              value={familyUser?.careRecipients.length || 0}
              icon={Users}
            />
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming Bookings */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Upcoming Visits</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/family/bookings">
                      View all
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {upcomingBookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Calendar className="h-12 w-12 text-muted-foreground/50" />
                      <h3 className="mt-4 font-semibold">No upcoming visits</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Book your first caregiver to get started
                      </p>
                      <Button className="mt-4" asChild>
                        <Link href="/caregivers">Find Caregiver</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="flex items-center gap-4 rounded-lg border border-border p-4"
                        >
                          <Image
                            src={booking.caregiverPhoto}
                            alt={booking.caregiverName}
                            width={48}
                            height={48}
                            className="rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{booking.caregiverName}</p>
                              <Badge variant="secondary" className="text-xs">
                                {booking.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(booking.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                              })} at {booking.startTime}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              For {booking.recipientName} • {booking.duration}hrs
                            </p>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/visit/${booking.id}`}>View</Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recommended Caregivers */}
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Recommended for You</h2>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/caregivers">
                      View all
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {caregivers.slice(0, 2).map((caregiver) => (
                    <CaregiverCard
                      key={caregiver.id}
                      caregiver={caregiver}
                      isFavorite={familyUser?.favoriteCaregiversIds.includes(caregiver.id)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Care Recipients */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Care Recipients</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/family/care-recipients">Manage</Link>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {familyUser?.careRecipients.map((recipient) => (
                    <div key={recipient.id} className="flex items-center gap-3">
                      <Image
                        src={recipient.photo}
                        alt={recipient.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium">{recipient.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {recipient.age} years old
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Favorite Caregivers */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Favorites</CardTitle>
                  <Heart className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent className="space-y-3">
                  {favoriteCaregiversData.slice(0, 3).map((caregiver) => (
                    <Link
                      key={caregiver.id}
                      href={`/caregivers/${caregiver.id}`}
                      className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
                    >
                      <Image
                        src={caregiver.photo}
                        alt={caregiver.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{caregiver.name}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-secondary text-secondary" />
                          {caregiver.rating}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Book</Button>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <Button variant="outline" className="justify-start" asChild>
                    <Link href="/dashboard/family/bookings">
                      <Calendar className="mr-2 h-4 w-4" />
                      View All Bookings
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link href="/dashboard/family/analytics">
                      <DollarSign className="mr-2 h-4 w-4" />
                      View Spending
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <Link href="/messages">
                      <Bell className="mr-2 h-4 w-4" />
                      Messages
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
