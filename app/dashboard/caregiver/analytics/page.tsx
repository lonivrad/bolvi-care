"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  DollarSign,
  Star,
  Users,
  TrendingUp,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Target,
} from "lucide-react";

const stats = [
  {
    title: "Total Earnings",
    value: "$8,920",
    change: "+18%",
    trend: "up",
    period: "vs last month",
    icon: DollarSign,
  },
  {
    title: "Hours Worked",
    value: "248 hrs",
    change: "+12%",
    trend: "up",
    period: "vs last month",
    icon: Clock,
  },
  {
    title: "Completed Visits",
    value: "68",
    change: "+22%",
    trend: "up",
    period: "vs last month",
    icon: CheckCircle,
  },
  {
    title: "Average Rating",
    value: "4.9",
    change: "+0.2",
    trend: "up",
    period: "vs last month",
    icon: Star,
  },
];

const monthlyEarnings = [
  { month: "Sep", amount: 6200 },
  { month: "Oct", amount: 6850 },
  { month: "Nov", amount: 7400 },
  { month: "Dec", amount: 7100 },
  { month: "Jan", amount: 7560 },
  { month: "Feb", amount: 8920 },
];

const clientBreakdown = [
  { name: "Johnson Family", hours: 72, earnings: 2880, percentage: 32 },
  { name: "Chen Family", hours: 56, earnings: 2240, percentage: 25 },
  { name: "Martinez Family", hours: 48, earnings: 1920, percentage: 22 },
  { name: "Other Clients", hours: 72, earnings: 1880, percentage: 21 },
];

const performanceMetrics = [
  { label: "On-Time Arrival", value: 98, target: 95, unit: "%" },
  { label: "Visit Completion", value: 100, target: 98, unit: "%" },
  { label: "Client Satisfaction", value: 4.9, target: 4.5, unit: "/5" },
  { label: "Response Time", value: 15, target: 30, unit: " min" },
];

const recentReviews = [
  {
    family: "Johnson Family",
    rating: 5,
    comment: "Maria is wonderful with our mother. Very patient and caring.",
    date: "2 days ago",
  },
  {
    family: "Chen Family",
    rating: 5,
    comment: "Excellent care and very professional.",
    date: "1 week ago",
  },
  {
    family: "Williams Family",
    rating: 4,
    comment: "Great caregiver, always reliable.",
    date: "2 weeks ago",
  },
];

export default function CaregiverAnalyticsPage() {
  const maxEarnings = Math.max(...monthlyEarnings.map((m) => m.amount));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Performance Analytics</h1>
          <p className="text-muted-foreground">
            Track your earnings, hours, and client feedback
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="6months">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <div
                    className={`flex items-center text-sm ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Earnings Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-48">
              {monthlyEarnings.map((month) => (
                <div key={month.month} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center">
                    <span className="text-xs text-muted-foreground mb-1">
                      ${(month.amount / 1000).toFixed(1)}k
                    </span>
                    <div
                      className="w-full bg-green-500 rounded-t transition-all"
                      style={{
                        height: `${(month.amount / maxEarnings) * 140}px`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground mt-2">
                    {month.month}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {performanceMetrics.map((metric) => {
                const percentage =
                  metric.unit === "%"
                    ? metric.value
                    : metric.unit === "/5"
                    ? (metric.value / 5) * 100
                    : Math.min(100, (metric.target / metric.value) * 100);
                const isGood =
                  metric.unit === " min"
                    ? metric.value <= metric.target
                    : metric.value >= metric.target;

                return (
                  <div key={metric.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{metric.label}</span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold ${
                            isGood ? "text-green-600" : "text-yellow-600"
                          }`}
                        >
                          {metric.value}
                          {metric.unit}
                        </span>
                        {isGood && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isGood ? "bg-green-500" : "bg-yellow-500"
                        }`}
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Target: {metric.target}
                      {metric.unit}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Client Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Earnings by Client</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clientBreakdown.map((client) => (
                <div key={client.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{client.name}</span>
                    <div className="text-right">
                      <span className="font-bold">${client.earnings}</span>
                      <span className="text-muted-foreground text-sm ml-2">
                        ({client.hours} hrs)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${client.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">
                    ${clientBreakdown.reduce((sum, c) => sum + c.earnings, 0)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReviews.map((review, index) => (
                <div
                  key={index}
                  className="border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{review.family}</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                  <p className="text-xs text-muted-foreground mt-1">{review.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Monthly Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Earnings Goal</span>
                <span className="text-sm text-muted-foreground">
                  $8,920 / $10,000
                </span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: "89%" }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">89% complete</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Hours Goal</span>
                <span className="text-sm text-muted-foreground">248 / 280 hrs</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: "88%" }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">88% complete</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">5-Star Reviews</span>
                <span className="text-sm text-muted-foreground">12 / 15</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: "80%" }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">80% complete</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
