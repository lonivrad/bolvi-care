"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
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
  TrendingUp,
  TrendingDown,
  Heart,
  Star,
  Activity,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

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
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Care Analytics</h1>
          <p className="text-muted-foreground">
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="pt-6">
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
                      className="w-full bg-primary rounded-t transition-all"
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
                    <span className="font-medium">{recipient.name}</span>
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
                  <span className="font-medium">Total Hours</span>
                  <span className="font-bold">
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
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={caregiver.photo}
                        alt={caregiver.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{caregiver.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {caregiver.hours} hours
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{caregiver.rating}</span>
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
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        activity.type === "visit"
                          ? "bg-blue-100"
                          : activity.type === "payment"
                          ? "bg-green-100"
                          : "bg-yellow-100"
                      }`}
                    >
                      {activity.type === "visit" ? (
                        <Calendar className="h-4 w-4 text-blue-600" />
                      ) : activity.type === "payment" ? (
                        <DollarSign className="h-4 w-4 text-green-600" />
                      ) : (
                        <Star className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                  {activity.amount && (
                    <span className="font-medium">{activity.amount}</span>
                  )}
                  {activity.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{activity.rating}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      </main>
      <Footer />
    </>
  );
}
