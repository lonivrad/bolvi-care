"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  User,
  CalendarDays,
  Settings,
  Plus,
} from "lucide-react";

// Mock upcoming visits data
const upcomingVisits = [
  {
    id: "v-001",
    date: "2025-01-31",
    startTime: "9:00 AM",
    endTime: "1:00 PM",
    duration: 4,
    clientName: "Margaret Chen",
    clientPhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    location: "4521 Pine Street, Seattle, WA",
    type: "Regular Care",
    status: "confirmed",
  },
  {
    id: "v-002",
    date: "2025-01-31",
    startTime: "2:00 PM",
    endTime: "5:00 PM",
    duration: 3,
    clientName: "Robert Williams",
    clientPhoto: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&h=200&fit=crop",
    location: "789 Oak Avenue, Bellevue, WA",
    type: "Companionship",
    status: "confirmed",
  },
  {
    id: "v-003",
    date: "2025-02-01",
    startTime: "10:00 AM",
    endTime: "2:00 PM",
    duration: 4,
    clientName: "Eleanor Davis",
    clientPhoto: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
    location: "123 Maple Lane, Kirkland, WA",
    type: "Medical Assistance",
    status: "pending",
  },
  {
    id: "v-004",
    date: "2025-02-03",
    startTime: "8:00 AM",
    endTime: "12:00 PM",
    duration: 4,
    clientName: "Margaret Chen",
    clientPhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    location: "4521 Pine Street, Seattle, WA",
    type: "Regular Care",
    status: "confirmed",
  },
  {
    id: "v-005",
    date: "2025-02-05",
    startTime: "1:00 PM",
    endTime: "5:00 PM",
    duration: 4,
    clientName: "James Wilson",
    clientPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    location: "567 Cedar Road, Tacoma, WA",
    type: "Overnight Care",
    status: "confirmed",
  },
];

export default function CaregiverCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showVisitDialog, setShowVisitDialog] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<typeof upcomingVisits[0] | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (Date | null)[] = [];

    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const formatDateString = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const getVisitsForDate = (date: Date) => {
    const dateStr = formatDateString(date);
    return upcomingVisits.filter((v) => v.date === dateStr);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const visits = getVisitsForDate(date);
    if (visits.length === 1) {
      setSelectedVisit(visits[0]);
      setShowVisitDialog(true);
    } else if (visits.length > 1) {
      // Just select the date to show visits in sidebar
      setSelectedVisit(null);
    }
  };

  const handleVisitClick = (visit: typeof upcomingVisits[0]) => {
    setSelectedVisit(visit);
    setShowVisitDialog(true);
  };

  const days = getDaysInMonth(currentDate);
  const weekDayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get visits for selected date or today
  const displayDate = selectedDate || today;
  const visitsForSelectedDate = getVisitsForDate(displayDate);

  // Calculate stats
  const thisWeekVisits = upcomingVisits.filter((v) => {
    const visitDate = new Date(v.date);
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return visitDate >= weekStart && visitDate <= weekEnd;
  });

  const totalHoursThisWeek = thisWeekVisits.reduce((sum, v) => sum + v.duration, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground">View and manage your scheduled visits</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/caregiver/availability">
              <Settings className="mr-2 h-4 w-4" />
              Manage Availability
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">This Week</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{thisWeekVisits.length} visits</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Hours This Week</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{totalHoursThisWeek} hrs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Upcoming</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{upcomingVisits.length} total</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-lg font-semibold">
                {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h3>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {/* Week day headers */}
              {weekDayHeaders.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {days.map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const visits = getVisitsForDate(date);
                const hasVisits = visits.length > 0;
                const isToday = formatDateString(date) === formatDateString(new Date());
                const isSelected = selectedDate && formatDateString(date) === formatDateString(selectedDate);
                const isPast = date < today;

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => handleDateClick(date)}
                    className={`
                      aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all relative
                      ${isPast ? "text-muted-foreground/50" : "hover:bg-muted cursor-pointer"}
                      ${isToday ? "ring-2 ring-primary" : ""}
                      ${isSelected ? "bg-primary/10" : ""}
                      ${hasVisits && !isPast ? "bg-blue-50 dark:bg-blue-900/20" : ""}
                    `}
                  >
                    <span className="font-medium">{date.getDate()}</span>
                    {hasVisits && (
                      <div className="absolute bottom-1 flex gap-0.5">
                        {visits.slice(0, 3).map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              visits[i].status === "confirmed"
                                ? "bg-green-500"
                                : "bg-yellow-500"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground">Confirmed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-sm text-muted-foreground">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 border-primary" />
                <span className="text-sm text-muted-foreground">Today</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar - Visits for selected date */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {displayDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {visitsForSelectedDate.length > 0 ? (
                <div className="space-y-3">
                  {visitsForSelectedDate.map((visit) => (
                    <button
                      key={visit.id}
                      onClick={() => handleVisitClick(visit)}
                      className="w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{visit.clientName}</span>
                        <Badge
                          variant={visit.status === "confirmed" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {visit.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {visit.startTime} - {visit.endTime}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{visit.location.split(",")[0]}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarDays className="h-10 w-10 text-muted-foreground/50 mx-auto" />
                  <p className="mt-2 text-sm text-muted-foreground">No visits scheduled</p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Link href="/dashboard/caregiver/availability">
                      <Plus className="mr-1 h-4 w-4" />
                      Set Availability
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/caregiver/availability">
                  <Settings className="mr-2 h-4 w-4" />
                  Manage Availability
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/caregiver/requests">
                  <User className="mr-2 h-4 w-4" />
                  View Requests
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Visit Details Dialog */}
      <Dialog open={showVisitDialog} onOpenChange={setShowVisitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Visit Details</DialogTitle>
            <DialogDescription>
              {selectedVisit?.date &&
                new Date(selectedVisit.date + "T00:00:00").toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
            </DialogDescription>
          </DialogHeader>
          {selectedVisit && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedVisit.clientPhoto}
                  alt={selectedVisit.clientName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{selectedVisit.clientName}</p>
                  <Badge variant={selectedVisit.status === "confirmed" ? "default" : "secondary"}>
                    {selectedVisit.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {selectedVisit.startTime} - {selectedVisit.endTime} ({selectedVisit.duration} hours)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedVisit.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedVisit.type}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVisitDialog(false)}>
              Close
            </Button>
            <Button asChild>
              <Link href={`/dashboard/caregiver/visits/${selectedVisit?.id}`}>View Full Details</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
