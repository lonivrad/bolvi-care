"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    title: "Total Users",
    value: "12,847",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    description: "vs last month",
  },
  {
    title: "Active Bookings",
    value: "1,234",
    change: "+8.2%",
    trend: "up",
    icon: Calendar,
    description: "vs last month",
  },
  {
    title: "Revenue (MTD)",
    value: "$284,521",
    change: "+23.1%",
    trend: "up",
    icon: DollarSign,
    description: "vs last month",
  },
  {
    title: "Platform Fee",
    value: "$42,678",
    change: "+18.4%",
    trend: "up",
    icon: TrendingUp,
    description: "vs last month",
  },
];

const pendingVerifications = [
  {
    id: "v-1",
    name: "Jennifer Martinez",
    type: "Background Check",
    submitted: "2 hours ago",
    status: "pending",
  },
  {
    id: "v-2",
    name: "Robert Chen",
    type: "License Verification",
    submitted: "4 hours ago",
    status: "pending",
  },
  {
    id: "v-3",
    name: "Amanda Williams",
    type: "Background Check",
    submitted: "6 hours ago",
    status: "in_review",
  },
  {
    id: "v-4",
    name: "Michael Brown",
    type: "Reference Check",
    submitted: "1 day ago",
    status: "pending",
  },
];

const recentDisputes = [
  {
    id: "d-1",
    title: "Billing Discrepancy",
    family: "Johnson Family",
    caregiver: "Maria Rodriguez",
    amount: "$125.00",
    status: "open",
    priority: "high",
  },
  {
    id: "d-2",
    title: "Service Quality Concern",
    family: "Smith Family",
    caregiver: "David Kim",
    amount: "$0.00",
    status: "investigating",
    priority: "medium",
  },
  {
    id: "d-3",
    title: "Cancellation Fee Dispute",
    family: "Garcia Family",
    caregiver: "Sarah Thompson",
    amount: "$45.00",
    status: "open",
    priority: "low",
  },
];

const recentActivity = [
  {
    id: "a-1",
    action: "New caregiver registered",
    user: "Emily Watson",
    time: "5 minutes ago",
  },
  {
    id: "a-2",
    action: "Booking completed",
    user: "Johnson Family",
    time: "12 minutes ago",
  },
  {
    id: "a-3",
    action: "Verification approved",
    user: "James Lee",
    time: "25 minutes ago",
  },
  {
    id: "a-4",
    action: "Dispute resolved",
    user: "Williams Family",
    time: "1 hour ago",
  },
  {
    id: "a-5",
    action: "Payout processed",
    user: "Maria Rodriguez",
    time: "2 hours ago",
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of platform metrics and pending actions
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3 text-accent" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-destructive" />
                  )}
                  <span
                    className={
                      stat.trend === "up" ? "text-accent" : "text-destructive"
                    }
                  >
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground">
                    {stat.description}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Verifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Pending Verifications</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/verifications">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingVerifications.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.type}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        item.status === "in_review" ? "secondary" : "outline"
                      }
                    >
                      {item.status === "in_review" ? (
                        <Clock className="mr-1 h-3 w-3" />
                      ) : null}
                      {item.status === "in_review" ? "In Review" : "Pending"}
                    </Badge>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.submitted}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Disputes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Disputes</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/disputes">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDisputes.map((dispute) => (
                <div
                  key={dispute.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">
                        {dispute.title}
                      </p>
                      <Badge
                        variant={
                          dispute.priority === "high"
                            ? "destructive"
                            : dispute.priority === "medium"
                            ? "secondary"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {dispute.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {dispute.family} vs {dispute.caregiver}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">
                      {dispute.amount}
                    </p>
                    <Badge
                      variant={
                        dispute.status === "open" ? "destructive" : "secondary"
                      }
                      className="mt-1"
                    >
                      {dispute.status === "open" ? (
                        <AlertTriangle className="mr-1 h-3 w-3" />
                      ) : (
                        <Clock className="mr-1 h-3 w-3" />
                      )}
                      {dispute.status === "open" ? "Open" : "Investigating"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
