"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeSlotData {
  hour: number;
  dayOfWeek: number;
  availability: number; // 0-100 percentage
  bookings: number;
  demand: "low" | "medium" | "high" | "peak";
  suggestedRate?: number;
}

// Generate mock heatmap data
const generateHeatmapData = (): TimeSlotData[] => {
  const data: TimeSlotData[] = [];

  for (let day = 0; day < 7; day++) {
    for (let hour = 6; hour <= 22; hour++) {
      // Simulate realistic patterns
      let availability = Math.random() * 100;
      let demand: "low" | "medium" | "high" | "peak" = "low";

      // Morning rush (8-10 AM) has high demand
      if (hour >= 8 && hour <= 10) {
        availability = Math.random() * 40 + 40;
        demand = Math.random() > 0.3 ? "high" : "peak";
      }
      // Evening (5-7 PM) has medium-high demand
      else if (hour >= 17 && hour <= 19) {
        availability = Math.random() * 50 + 30;
        demand = Math.random() > 0.5 ? "high" : "medium";
      }
      // Weekends have different patterns
      else if (day === 0 || day === 6) {
        availability = Math.random() * 60 + 20;
        demand = Math.random() > 0.6 ? "medium" : "low";
      }
      // Regular hours
      else if (hour >= 9 && hour <= 17) {
        availability = Math.random() * 70 + 20;
        demand = Math.random() > 0.7 ? "medium" : "low";
      }
      // Off hours
      else {
        availability = Math.random() * 30;
        demand = "low";
      }

      data.push({
        hour,
        dayOfWeek: day,
        availability: Math.round(availability),
        bookings: Math.floor(Math.random() * 10),
        demand,
        suggestedRate: demand === "peak" ? 50 : demand === "high" ? 42 : demand === "medium" ? 38 : 35,
      });
    }
  }

  return data;
};

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const hours = Array.from({ length: 17 }, (_, i) => i + 6); // 6 AM to 10 PM

const demandColors = {
  low: "bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400",
  medium: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  high: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  peak: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
};

const demandLabels = {
  low: "Low demand",
  medium: "Moderate demand",
  high: "High demand",
  peak: "Peak demand",
};

interface AvailabilityHeatmapProps {
  userType?: "family" | "caregiver";
}

export function AvailabilityHeatmap({ userType = "caregiver" }: AvailabilityHeatmapProps) {
  const [heatmapData] = useState(generateHeatmapData);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotData | null>(null);

  const getSlotData = (day: number, hour: number) => {
    return heatmapData.find((d) => d.dayOfWeek === day && d.hour === hour);
  };

  const formatHour = (hour: number) => {
    if (hour === 12) return "12PM";
    if (hour < 12) return `${hour}AM`;
    return `${hour - 12}PM`;
  };

  const getWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + weekOffset * 7);

    return days.map((_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates();

  const stats = {
    peakSlots: heatmapData.filter((d) => d.demand === "peak" || d.demand === "high").length,
    avgRate: Math.round(heatmapData.reduce((sum, d) => sum + (d.suggestedRate || 0), 0) / heatmapData.length),
    totalDemand: heatmapData.reduce((sum, d) => sum + d.bookings, 0),
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              {userType === "caregiver" ? "Demand Heatmap" : "Availability Heatmap"}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {userType === "caregiver"
                ? "See when families need care the most"
                : "Find the best times to book care"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setWeekOffset((prev) => prev - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[100px] text-center">
              {weekOffset === 0
                ? "This Week"
                : weekOffset === 1
                ? "Next Week"
                : weekOffset === -1
                ? "Last Week"
                : `${weekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${weekDates[6].toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setWeekOffset((prev) => prev + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.peakSlots}</p>
              <p className="text-xs text-muted-foreground">High demand slots</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">${stats.avgRate}</p>
              <p className="text-xs text-muted-foreground">Avg suggested rate</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalDemand}</p>
              <p className="text-xs text-muted-foreground">Bookings this week</p>
            </div>
          </div>
        </div>

        {/* Heatmap Grid */}
        <TooltipProvider delayDuration={100}>
          <div className="overflow-x-auto -mx-6 px-6">
            <div className="min-w-[600px]">
              {/* Header row with days */}
              <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-1 mb-2">
                <div /> {/* Empty cell for time column */}
                {days.map((day, i) => (
                  <div key={day} className="text-center">
                    <p className="text-xs font-medium text-muted-foreground">{day}</p>
                    <p className="text-xs text-muted-foreground">
                      {weekDates[i].getDate()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Time rows */}
              {hours.map((hour) => (
                <div key={hour} className="grid grid-cols-[60px_repeat(7,1fr)] gap-1 mb-1">
                  <div className="text-xs text-muted-foreground text-right pr-2 py-1">
                    {formatHour(hour)}
                  </div>
                  {days.map((_, dayIndex) => {
                    const slot = getSlotData(dayIndex, hour);
                    if (!slot) return <div key={dayIndex} />;

                    return (
                      <Tooltip key={dayIndex}>
                        <TooltipTrigger asChild>
                          <button
                            className={cn(
                              "h-8 rounded-md transition-all hover:ring-2 hover:ring-primary/50",
                              demandColors[slot.demand],
                              selectedSlot?.hour === hour && selectedSlot?.dayOfWeek === dayIndex && "ring-2 ring-primary"
                            )}
                            onClick={() => setSelectedSlot(slot)}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="p-3">
                          <div className="space-y-1">
                            <p className="font-medium">
                              {days[dayIndex]} {formatHour(hour)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {demandLabels[slot.demand]}
                            </p>
                            <div className="flex items-center gap-2 pt-1">
                              <Badge variant="outline" className="text-xs">
                                {slot.bookings} bookings
                              </Badge>
                              {slot.suggestedRate && (
                                <Badge variant="secondary" className="text-xs">
                                  ${slot.suggestedRate}/hr suggested
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </TooltipProvider>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t">
          <span className="text-xs text-muted-foreground">Demand:</span>
          {(["low", "medium", "high", "peak"] as const).map((level) => (
            <div key={level} className="flex items-center gap-1.5">
              <div
                className={cn(
                  "h-3 w-3 rounded",
                  demandColors[level].split(" ")[0]
                )}
              />
              <span className="text-xs text-muted-foreground capitalize">{level}</span>
            </div>
          ))}
        </div>

        {/* Selected slot detail */}
        {selectedSlot && (
          <div className="mt-4 p-4 rounded-lg border bg-muted/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {days[selectedSlot.dayOfWeek]} at {formatHour(selectedSlot.hour)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {demandLabels[selectedSlot.demand]} · {selectedSlot.bookings} bookings in this time slot
                </p>
              </div>
              {userType === "caregiver" ? (
                <Button size="sm">
                  Set as Available
                </Button>
              ) : (
                <Button size="sm">
                  Find Caregivers
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
