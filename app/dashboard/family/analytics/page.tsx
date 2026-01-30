"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { MetricsDashboard } from "@/components/analytics/metrics-dashboard";

const stats = [
  {
    title: "Total Spent",
    value: "$4,850",
    change: "+12%",
    trend: "up",
    period: "vs last month",
    icon: DollarSign,
  },
  {
    title: "Care Hours",
    value: "156 hrs",
    change: "+8%",
    trend: "up",
    period: "vs last month",
    icon: Clock,
  },
  {
    title: "Visits Completed",
    value: "42",
    change: "+15%",
    trend: "up",
    period: "vs last month",
    icon: Calendar,
  },
  {
    title: "Avg. Rating Given",
    value: "4.9",
    change: "+0.1",
    trend: "up",
    period: "vs last month",
    icon: Star,
  },
];

const monthlySpending = [
  { month: "Sep", amount: 3200 },
  { month: "Oct", amount: 3850 },
  { month: "Nov", amount: 4100 },
  { month: "Dec", amount: 3900 },
  { month: "Jan", amount: 4320 },
  { month: "Feb", amount: 4850 },
];

const careByRecipient = [
  { name: "Eleanor Johnson", hours: 98, percentage: 63, color: "bg-primary" },
  { name: "Robert Johnson", hours: 58, percentage: 37, color: "bg-secondary" },
];

const topCaregivers = [
  {
    name: "Maria Rodriguez",
    hours: 72,
    rating: 4.9,
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    name: "David Kim",
    hours: 48,
    rating: 4.8,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    name: "Sarah Thompson",
    hours: 36,
    rating: 4.7,
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
];

const recentActivity = [
  {
    type: "visit",
    description: "Visit completed with Maria Rodriguez",
    date: "Today",
    amount: "$140",
  },
  {
    type: "payment",
    description: "Payment processed for booking #1234",
    date: "Yesterday",
    amount: "$185",
  },
  {
    type: "visit",
    description: "Visit completed with David Kim",
    date: "Mar 1",
    amount: "$120",
  },
  {
    type: "review",
    description: "Left a review for Sarah Thompson",
    date: "Feb 28",
    rating: 5,
  },
];

export default function FamilyAnalyticsPage() {
  const maxSpending = Math.max(...monthlySpending.map((m) => m.amount));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Care Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Insights into your care spending and activity
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-primary/10 p-2.5">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Spending Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-48">
              {monthlySpending.map((month) => (
                <div key={month.month} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center">
                    <span className="text-xs text-muted-foreground mb-1">
                      ${(month.amount / 1000).toFixed(1)}k
                    </span>
                    <div
                      className="w-full bg-gradient-to-t from-primary to-primary/70 rounded-t transition-all hover:from-primary/90 hover:to-primary/60"
                      style={{
                        height: `${(month.amount / maxSpending) * 140}px`,
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

        {/* Care by Recipient */}
        <Card>
          <CardHeader>
            <CardTitle>Care Hours by Recipient</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {careByRecipient.map((recipient) => (
                <div key={recipient.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{recipient.name}</span>
                    <span className="text-muted-foreground">
                      {recipient.hours} hrs ({recipient.percentage}%)
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full ${recipient.color} rounded-full transition-all`}
                      style={{ width: `${recipient.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between">
                  <span className="font-medium text-foreground">Total Hours</span>
                  <span className="font-bold text-foreground">
                    {careByRecipient.reduce((sum, r) => sum + r.hours, 0)} hrs
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Caregivers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Caregivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCaregivers.map((caregiver, index) => (
                <div
                  key={caregiver.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Image
                        src={caregiver.photo}
                        alt={caregiver.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover ring-2 ring-border"
                      />
                      <div className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{caregiver.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {caregiver.hours} hours
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-foreground">{caregiver.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${
                        activity.type === "visit"
                          ? "bg-blue-100 dark:bg-blue-900/30"
                          : activity.type === "payment"
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-amber-100 dark:bg-amber-900/30"
                      }`}
                    >
                      {activity.type === "visit" ? (
                        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      ) : activity.type === "payment" ? (
                        <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                  {activity.amount && (
                    <span className="font-semibold text-foreground">{activity.amount}</span>
                  )}
                  {activity.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold">{activity.rating}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full Metrics Dashboard */}
      <MetricsDashboard />
    </div>
  );
}
