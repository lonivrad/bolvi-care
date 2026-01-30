"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Sun,
  Sunset,
  Moon,
  CheckCircle,
  AlertCircle,
  Calendar,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeSlot {
  time: string;
  available: boolean;
  price?: number;
  popular?: boolean;
}

interface DayAvailability {
  date: Date;
  slots: TimeSlot[];
}

interface BookingCalendarProps {
  caregiverId?: string;
  caregiverName?: string;
  hourlyRate?: number;
  onSelectSlot?: (date: Date, time: string) => void;
  selectedDate?: Date;
  selectedTime?: string;
  minHours?: number;
}

const generateTimeSlots = (date: Date, hourlyRate: number = 28): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const currentHour = today.getHours();

  // Generate slots from 7 AM to 9 PM
  for (let hour = 7; hour <= 21; hour++) {
    // Skip past hours if today
    if (isToday && hour <= currentHour) continue;

    // Simulate availability (random but consistent based on date + hour)
    const seed = date.getDate() + hour;
    const available = seed % 3 !== 0; // ~66% availability

    // Popular times (9-11am, 2-4pm)
    const popular = (hour >= 9 && hour <= 11) || (hour >= 14 && hour <= 16);

    // Weekend surcharge
    const price = isWeekend ? Math.round(hourlyRate * 1.15) : hourlyRate;

    slots.push({
      time: `${hour.toString().padStart(2, "0")}:00`,
      available,
      price,
      popular: popular && available,
    });
  }

  return slots;
};

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function TimeSlotButton({
  slot,
  isSelected,
  onClick,
}: {
  slot: TimeSlot;
  isSelected: boolean;
  onClick: () => void;
}) {
  const hour = parseInt(slot.time.split(":")[0]);
  const period = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
  const PeriodIcon = period === "morning" ? Sun : period === "afternoon" ? Sunset : Moon;

  if (!slot.available) {
    return (
      <button
        disabled
        className="flex items-center justify-between p-3 rounded-lg border border-dashed bg-muted/30 opacity-50 cursor-not-allowed"
      >
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{slot.time}</span>
        </div>
        <Badge variant="outline" className="text-xs">Booked</Badge>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-between p-3 rounded-lg border transition-all",
        isSelected
          ? "border-primary bg-primary/5 ring-2 ring-primary"
          : "hover:border-primary/50 hover:bg-muted/50",
        slot.popular && !isSelected && "border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20"
      )}
    >
      <div className="flex items-center gap-2">
        <PeriodIcon className={cn(
          "h-4 w-4",
          isSelected ? "text-primary" : "text-muted-foreground"
        )} />
        <span className={cn("font-medium", isSelected && "text-primary")}>
          {slot.time}
        </span>
        {slot.popular && (
          <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            <Zap className="h-3 w-3 mr-1" />
            Popular
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">${slot.price}/hr</span>
        {isSelected && <CheckCircle className="h-4 w-4 text-primary" />}
      </div>
    </button>
  );
}

export function BookingCalendar({
  caregiverId,
  caregiverName = "Caregiver",
  hourlyRate = 28,
  onSelectSlot,
  selectedDate: externalSelectedDate,
  selectedTime: externalSelectedTime,
  minHours = 2,
}: BookingCalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(externalSelectedDate || null);
  const [selectedTime, setSelectedTime] = useState<string | null>(externalSelectedTime || null);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startPadding = firstDay.getDay();
    const days: (Date | null)[] = [];

    // Add padding for days before the 1st
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(currentYear, currentMonth, i));
    }

    return days;
  }, [currentMonth, currentYear]);

  // Generate time slots for selected date
  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];
    return generateTimeSlots(selectedDate, hourlyRate);
  }, [selectedDate, hourlyRate]);

  const isPastDate = (date: Date) => {
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < todayStart;
  };

  const hasAvailability = (date: Date) => {
    if (isPastDate(date)) return false;
    // Simulate availability check
    const seed = date.getDate() + date.getMonth();
    return seed % 5 !== 0; // ~80% of days have some availability
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      onSelectSlot?.(selectedDate, time);
    }
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentYear, currentMonth + direction, 1);
    setCurrentMonth(newDate.getMonth());
    setCurrentYear(newDate.getFullYear());
  };

  const availableCount = timeSlots.filter((s) => s.available).length;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Calendar */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Select Date</CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateMonth(-1)}
                disabled={currentMonth === today.getMonth() && currentYear === today.getFullYear()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="min-w-[140px] text-center font-medium">
                {MONTHS[currentMonth]} {currentYear}
              </span>
              <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Days of week header */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS_OF_WEEK.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const isPast = isPastDate(date);
              const hasSlots = hasAvailability(date);
              const isSelected = selectedDate?.toDateString() === date.toDateString();
              const isToday = date.toDateString() === today.toDateString();

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => !isPast && hasSlots && handleDateSelect(date)}
                  disabled={isPast || !hasSlots}
                  className={cn(
                    "aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all relative",
                    isPast && "text-muted-foreground/40 cursor-not-allowed",
                    !isPast && !hasSlots && "text-muted-foreground/60 cursor-not-allowed",
                    !isPast && hasSlots && "hover:bg-muted cursor-pointer",
                    isSelected && "bg-primary text-primary-foreground hover:bg-primary",
                    isToday && !isSelected && "ring-1 ring-primary"
                  )}
                >
                  <span className={cn("font-medium", isSelected && "text-primary-foreground")}>
                    {date.getDate()}
                  </span>
                  {!isPast && hasSlots && !isSelected && (
                    <span className="absolute bottom-1 h-1 w-1 rounded-full bg-green-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
              <span>Unavailable</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Slots */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>
              {selectedDate
                ? `Times for ${selectedDate.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}`
                : "Select a date first"}
            </span>
            {selectedDate && (
              <Badge variant="secondary">
                {availableCount} available
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedDate ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">
                Choose a date to see available times
              </p>
            </div>
          ) : timeSlots.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">
                No availability for this date
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[320px] pr-4">
              <div className="space-y-2">
                {/* Morning slots */}
                {timeSlots.filter((s) => parseInt(s.time) < 12).length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sun className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium text-muted-foreground">
                        Morning
                      </span>
                    </div>
                    <div className="space-y-2">
                      {timeSlots
                        .filter((s) => parseInt(s.time) < 12)
                        .map((slot) => (
                          <TimeSlotButton
                            key={slot.time}
                            slot={slot}
                            isSelected={selectedTime === slot.time}
                            onClick={() => handleTimeSelect(slot.time)}
                          />
                        ))}
                    </div>
                  </div>
                )}

                {/* Afternoon slots */}
                {timeSlots.filter((s) => parseInt(s.time) >= 12 && parseInt(s.time) < 17).length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sunset className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium text-muted-foreground">
                        Afternoon
                      </span>
                    </div>
                    <div className="space-y-2">
                      {timeSlots
                        .filter((s) => parseInt(s.time) >= 12 && parseInt(s.time) < 17)
                        .map((slot) => (
                          <TimeSlotButton
                            key={slot.time}
                            slot={slot}
                            isSelected={selectedTime === slot.time}
                            onClick={() => handleTimeSelect(slot.time)}
                          />
                        ))}
                    </div>
                  </div>
                )}

                {/* Evening slots */}
                {timeSlots.filter((s) => parseInt(s.time) >= 17).length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Moon className="h-4 w-4 text-indigo-500" />
                      <span className="text-sm font-medium text-muted-foreground">
                        Evening
                      </span>
                    </div>
                    <div className="space-y-2">
                      {timeSlots
                        .filter((s) => parseInt(s.time) >= 17)
                        .map((slot) => (
                          <TimeSlotButton
                            key={slot.time}
                            slot={slot}
                            isSelected={selectedTime === slot.time}
                            onClick={() => handleTimeSelect(slot.time)}
                          />
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          {/* Selection Summary */}
          {selectedDate && selectedTime && (
            <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary">Selected</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    at {selectedTime}
                  </p>
                </div>
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Minimum booking: {minHours} hours
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
