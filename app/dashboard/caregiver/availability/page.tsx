"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const timeSlots = [
  "6:00 AM",
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
];

const initialSchedule = [
  { day: "Monday", enabled: true, slots: [{ start: "8:00 AM", end: "5:00 PM" }] },
  { day: "Tuesday", enabled: true, slots: [{ start: "8:00 AM", end: "5:00 PM" }] },
  { day: "Wednesday", enabled: true, slots: [{ start: "8:00 AM", end: "5:00 PM" }] },
  { day: "Thursday", enabled: true, slots: [{ start: "8:00 AM", end: "5:00 PM" }] },
  { day: "Friday", enabled: true, slots: [{ start: "8:00 AM", end: "3:00 PM" }] },
  { day: "Saturday", enabled: false, slots: [] },
  { day: "Sunday", enabled: false, slots: [] },
];

const blockedDates = [
  { date: "2024-03-15", reason: "Personal appointment" },
  { date: "2024-03-20", reason: "Vacation" },
  { date: "2024-03-21", reason: "Vacation" },
  { date: "2024-03-22", reason: "Vacation" },
];

export default function AvailabilityPage() {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [instantBooking, setInstantBooking] = useState(true);
  const [minimumNotice, setMinimumNotice] = useState("24");
  const [maxHoursPerDay, setMaxHoursPerDay] = useState("8");

  const toggleDay = (dayIndex: number) => {
    setSchedule((prev) => {
      const newSchedule = [...prev];
      newSchedule[dayIndex].enabled = !newSchedule[dayIndex].enabled;
      if (!newSchedule[dayIndex].enabled) {
        newSchedule[dayIndex].slots = [];
      } else if (newSchedule[dayIndex].slots.length === 0) {
        newSchedule[dayIndex].slots = [{ start: "9:00 AM", end: "5:00 PM" }];
      }
      return newSchedule;
    });
  };

  const addTimeSlot = (dayIndex: number) => {
    setSchedule((prev) => {
      const newSchedule = [...prev];
      newSchedule[dayIndex].slots.push({ start: "9:00 AM", end: "5:00 PM" });
      return newSchedule;
    });
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    setSchedule((prev) => {
      const newSchedule = [...prev];
      newSchedule[dayIndex].slots.splice(slotIndex, 1);
      return newSchedule;
    });
  };

  const updateTimeSlot = (
    dayIndex: number,
    slotIndex: number,
    field: "start" | "end",
    value: string
  ) => {
    setSchedule((prev) => {
      const newSchedule = [...prev];
      newSchedule[dayIndex].slots[slotIndex][field] = value;
      return newSchedule;
    });
  };

  const totalHours = schedule.reduce((total, day) => {
    if (!day.enabled) return total;
    return (
      total +
      day.slots.reduce((slotTotal, slot) => {
        const start = timeSlots.indexOf(slot.start);
        const end = timeSlots.indexOf(slot.end);
        return slotTotal + (end - start);
      }, 0)
    );
  }, 0);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Availability</h1>
          <p className="text-muted-foreground">
            Set your weekly schedule and manage time off
          </p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Weekly Hours</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{totalHours} hrs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Available Days</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {schedule.filter((d) => d.enabled).length}/7
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Blocked Dates</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{blockedDates.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {schedule.map((day, dayIndex) => (
              <div
                key={day.day}
                className="rounded-lg border border-border p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={day.enabled}
                      onCheckedChange={() => toggleDay(dayIndex)}
                    />
                    <span
                      className={`font-medium ${
                        day.enabled ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {day.day}
                    </span>
                  </div>
                  {day.enabled && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addTimeSlot(dayIndex)}
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Add Slot
                    </Button>
                  )}
                </div>

                {day.enabled && day.slots.length > 0 ? (
                  <div className="space-y-2">
                    {day.slots.map((slot, slotIndex) => (
                      <div
                        key={slotIndex}
                        className="flex items-center gap-2"
                      >
                        <Select
                          value={slot.start}
                          onValueChange={(value) =>
                            updateTimeSlot(dayIndex, slotIndex, "start", value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="text-muted-foreground">to</span>
                        <Select
                          value={slot.end}
                          onValueChange={(value) =>
                            updateTimeSlot(dayIndex, slotIndex, "end", value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {day.slots.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : day.enabled ? (
                  <p className="text-sm text-muted-foreground">
                    No time slots added. Click "Add Slot" to set your hours.
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Not available</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Settings & Blocked Dates */}
        <div className="space-y-6">
          {/* Booking Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Instant Booking</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow instant bookings without approval
                  </p>
                </div>
                <Switch
                  checked={instantBooking}
                  onCheckedChange={setInstantBooking}
                />
              </div>

              <div>
                <Label>Minimum Notice</Label>
                <Select value={minimumNotice} onValueChange={setMinimumNotice}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                    <SelectItem value="12">12 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                    <SelectItem value="48">48 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Max Hours Per Day</Label>
                <Select value={maxHoursPerDay} onValueChange={setMaxHoursPerDay}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4 hours</SelectItem>
                    <SelectItem value="6">6 hours</SelectItem>
                    <SelectItem value="8">8 hours</SelectItem>
                    <SelectItem value="10">10 hours</SelectItem>
                    <SelectItem value="12">12 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Blocked Dates */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Blocked Dates</CardTitle>
                <Button variant="outline" size="sm">
                  <Plus className="mr-1 h-4 w-4" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {blockedDates.length > 0 ? (
                <div className="space-y-2">
                  {blockedDates.map((blocked, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg bg-muted p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {new Date(blocked.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {blocked.reason}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No blocked dates
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      </main>
      <Footer />
    </>
  );
}
