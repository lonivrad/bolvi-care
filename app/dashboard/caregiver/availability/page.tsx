"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { useToast } from "@/components/ui/toast";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Trash2,
  Save,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
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

const initialBlockedDates = [
  { date: "2025-02-15", reason: "Personal appointment" },
  { date: "2025-02-20", reason: "Vacation" },
  { date: "2025-02-21", reason: "Vacation" },
  { date: "2025-02-22", reason: "Vacation" },
];

export default function AvailabilityPage() {
  const { toast } = useToast();
  const [schedule, setSchedule] = useState(initialSchedule);
  const [blockedDates, setBlockedDates] = useState(initialBlockedDates);
  const [instantBooking, setInstantBooking] = useState(true);
  const [minimumNotice, setMinimumNotice] = useState("24");
  const [maxHoursPerDay, setMaxHoursPerDay] = useState("8");

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [blockReason, setBlockReason] = useState("");

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

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const formatDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isDateBlocked = (date: Date) => {
    const dateStr = formatDateString(date);
    return blockedDates.some(b => b.date === dateStr);
  };

  const getBlockedReason = (date: Date) => {
    const dateStr = formatDateString(date);
    const blocked = blockedDates.find(b => b.date === dateStr);
    return blocked?.reason || "";
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (date: Date) => {
    if (isPastDate(date)) return;

    if (isDateBlocked(date)) {
      // Unblock the date
      const dateStr = formatDateString(date);
      setBlockedDates(prev => prev.filter(b => b.date !== dateStr));
      toast({
        title: "Date unblocked",
        description: `${date.toLocaleDateString("en-US", { month: "long", day: "numeric" })} is now available for bookings.`,
        variant: "success",
      });
    } else {
      // Open dialog to block the date
      setSelectedDate(date);
      setBlockReason("");
      setBlockDialogOpen(true);
    }
  };

  const confirmBlockDate = () => {
    if (!selectedDate) return;

    const dateStr = formatDateString(selectedDate);
    setBlockedDates(prev => [...prev, { date: dateStr, reason: blockReason || "Unavailable" }]);
    setBlockDialogOpen(false);
    setSelectedDate(null);

    toast({
      title: "Date blocked",
      description: `${selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric" })} has been blocked.`,
      variant: "success",
    });
  };

  const removeBlockedDate = (dateStr: string) => {
    setBlockedDates(prev => prev.filter(b => b.date !== dateStr));
    toast({
      title: "Date unblocked",
      description: "The date is now available for bookings.",
      variant: "success",
    });
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleSave = () => {
    toast({
      title: "Changes saved",
      description: "Your availability settings have been updated.",
      variant: "success",
    });
  };

  const days = getDaysInMonth(currentDate);
  const weekDayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Availability</h1>
          <p className="text-muted-foreground">
            Set your weekly schedule and manage time off
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Weekly Hours</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{totalHours} hrs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
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
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Blocked Dates</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{blockedDates.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar for Blocked Dates */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Block Time Off</CardTitle>
            <p className="text-sm text-muted-foreground">Click dates to block/unblock</p>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Navigation */}
          <div className="flex items-center justify-between mb-4">
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

          {/* Calendar Grid */}
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

              const isBlocked = isDateBlocked(date);
              const isPast = isPastDate(date);
              const isToday = formatDateString(date) === formatDateString(new Date());
              const reason = getBlockedReason(date);

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => handleDateClick(date)}
                  disabled={isPast}
                  className={`
                    aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all relative group
                    ${isPast ? "text-muted-foreground/50 cursor-not-allowed" : "hover:bg-muted cursor-pointer"}
                    ${isBlocked ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50" : ""}
                    ${isToday && !isBlocked ? "ring-2 ring-primary" : ""}
                  `}
                  title={isBlocked ? reason : isPast ? "Past date" : "Click to block"}
                >
                  <span className={`font-medium ${isBlocked ? "font-bold" : ""}`}>
                    {date.getDate()}
                  </span>
                  {isBlocked && (
                    <X className="h-3 w-3 absolute top-1 right-1 text-red-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700" />
              <span className="text-sm text-muted-foreground">Blocked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-primary" />
              <span className="text-sm text-muted-foreground">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-muted" />
              <span className="text-sm text-muted-foreground">Available</span>
            </div>
          </div>
        </CardContent>
      </Card>

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
                    No time slots added. Click &quot;Add Slot&quot; to set your hours.
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

          {/* Blocked Dates List */}
          <Card>
            <CardHeader>
              <CardTitle>Blocked Dates</CardTitle>
            </CardHeader>
            <CardContent>
              {blockedDates.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {blockedDates
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((blocked, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg bg-muted p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {new Date(blocked.date + "T00:00:00").toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {blocked.reason}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeBlockedDate(blocked.date)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No blocked dates. Click dates on the calendar above to block time off.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Block Date Dialog */}
      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block Date</DialogTitle>
            <DialogDescription>
              Block {selectedDate?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} from bookings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Reason (optional)</Label>
              <Input
                id="reason"
                placeholder="e.g., Vacation, Personal appointment"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmBlockDate}>
              Block Date
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
