"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Clock,
  Star,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Repeat,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TimeRange = "7d" | "30d" | "90d" | "12m";

interface MetricData {
  current: number;
  previous: number;
  target?: number;
}

const mockMetrics = {
  "7d": {
    revenue: { current: 2847, previous: 2456, target: 3000 },
    bookings: { current: 34, previous: 29, target: 40 },
    avgBookingValue: { current: 84, previous: 78 },
    repeatRate: { current: 68, previous: 62 },
    caregiverUtilization: { current: 76, previous: 71 },
    avgRating: { current: 4.87, previous: 4.82 },
    responseTime: { current: 2.3, previous: 2.8 },
    cancellationRate: { current: 4.2, previous: 5.1 },
  },
  "30d": {
    revenue: { current: 12450, previous: 10890, target: 15000 },
    bookings: { current: 148, previous: 132, target: 175 },
    avgBookingValue: { current: 84, previous: 82 },
    repeatRate: { current: 72, previous: 65 },
    caregiverUtilization: { current: 78, previous: 74 },
    avgRating: { current: 4.89, previous: 4.85 },
    responseTime: { current: 2.1, previous: 2.5 },
    cancellationRate: { current: 3.8, previous: 4.5 },
  },
  "90d": {
    revenue: { current: 38760, previous: 32100, target: 45000 },
    bookings: { current: 456, previous: 398, target: 525 },
    avgBookingValue: { current: 85, previous: 81 },
    repeatRate: { current: 74, previous: 68 },
    caregiverUtilization: { current: 79, previous: 75 },
    avgRating: { current: 4.88, previous: 4.84 },
    responseTime: { current: 2.2, previous: 2.6 },
    cancellationRate: { current: 3.5, previous: 4.2 },
  },
  "12m": {
    revenue: { current: 156840, previous: 124560, target: 180000 },
    bookings: { current: 1847, previous: 1523, target: 2100 },
    avgBookingValue: { current: 85, previous: 82 },
    repeatRate: { current: 76, previous: 70 },
    caregiverUtilization: { current: 80, previous: 76 },
    avgRating: { current: 4.89, previous: 4.86 },
    responseTime: { current: 2.0, previous: 2.4 },
    cancellationRate: { current: 3.2, previous: 3.9 },
  },
};

function calculateChange(current: number, previous: number): { value: number; isPositive: boolean } {
  const change = ((current - previous) / previous) * 100;
  return { value: Math.abs(Math.round(change * 10) / 10), isPositive: change >= 0 };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change: { value: number; isPositive: boolean };
  icon: React.ElementType;
  target?: number;
  suffix?: string;
  inverse?: boolean;
}

function MetricCard({ title, value, change, icon: Icon, target, suffix = "", inverse = false }: MetricCardProps) {
  const isPositive = inverse ? !change.isPositive : change.isPositive;

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">{value}</span>
              {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
            </div>
          </div>
          <div className="rounded-xl bg-primary/10 p-2.5">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {isPositive ? (
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-600" />
            )}
            <span
              className={cn(
                "text-sm font-medium",
                isPositive ? "text-green-600" : "text-red-600"
              )}
            >
              {change.value}%
            </span>
            <span className="text-xs text-muted-foreground">vs prev period</span>
          </div>

          {target && (
            <div className="text-right">
              <div className="text-xs text-muted-foreground">
                Target: {typeof value === "string" && value.includes("$") ? formatCurrency(target) : target}
              </div>
              <div className="mt-0.5 h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      (parseFloat(String(value).replace(/[$,]/g, "")) / target) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function MetricsDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const metrics = mockMetrics[timeRange];

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
    { value: "90d", label: "90 Days" },
    { value: "12m", label: "12 Months" },
  ];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Performance Metrics</h2>
          <p className="text-sm text-muted-foreground">Track your marketplace health</p>
        </div>
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {timeRanges.map((range) => (
            <Button
              key={range.value}
              variant={timeRange === range.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeRange(range.value)}
              className={cn(
                "text-xs",
                timeRange === range.value && "shadow-sm"
              )}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(metrics.revenue.current)}
          change={calculateChange(metrics.revenue.current, metrics.revenue.previous)}
          icon={DollarSign}
          target={metrics.revenue.target}
        />
        <MetricCard
          title="Total Bookings"
          value={metrics.bookings.current}
          change={calculateChange(metrics.bookings.current, metrics.bookings.previous)}
          icon={Calendar}
          target={metrics.bookings.target}
        />
        <MetricCard
          title="Avg Booking Value"
          value={formatCurrency(metrics.avgBookingValue.current)}
          change={calculateChange(metrics.avgBookingValue.current, metrics.avgBookingValue.previous)}
          icon={Target}
        />
        <MetricCard
          title="Repeat Booking Rate"
          value={metrics.repeatRate.current}
          change={calculateChange(metrics.repeatRate.current, metrics.repeatRate.previous)}
          icon={Repeat}
          suffix="%"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Caregiver Utilization"
          value={metrics.caregiverUtilization.current}
          change={calculateChange(metrics.caregiverUtilization.current, metrics.caregiverUtilization.previous)}
          icon={UserCheck}
          suffix="%"
        />
        <MetricCard
          title="Average Rating"
          value={metrics.avgRating.current}
          change={calculateChange(metrics.avgRating.current, metrics.avgRating.previous)}
          icon={Star}
          suffix="/ 5"
        />
        <MetricCard
          title="Avg Response Time"
          value={metrics.responseTime.current}
          change={calculateChange(metrics.responseTime.current, metrics.responseTime.previous)}
          icon={Clock}
          suffix="hrs"
          inverse
        />
        <MetricCard
          title="Cancellation Rate"
          value={metrics.cancellationRate.current}
          change={calculateChange(metrics.cancellationRate.current, metrics.cancellationRate.previous)}
          icon={Activity}
          suffix="%"
          inverse
        />
      </div>
    </div>
  );
}
