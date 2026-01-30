"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Star,
  Shield,
  Activity,
  Zap,
  AlertCircle,
  RefreshCw,
  Eye,
  MessageSquare,
  UserPlus,
  UserMinus,
  CreditCard,
  ShieldCheck,
  Flag,
  Ticket,
  MoreHorizontal,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Platform health metrics
const platformHealth = {
  status: "operational",
  uptime: 99.98,
  responseTime: 142,
  errorRate: 0.02,
  activeConnections: 1247,
};

// Key metrics with trends
const keyMetrics = [
  {
    title: "Total Users",
    value: "12,847",
    change: 12.5,
    trend: "up",
    icon: Users,
    breakdown: { families: 8234, caregivers: 4613 },
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    title: "Active Bookings",
    value: "1,234",
    change: 8.2,
    trend: "up",
    icon: Calendar,
    breakdown: { today: 156, thisWeek: 892 },
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    title: "Revenue (MTD)",
    value: "$284,521",
    change: 23.1,
    trend: "up",
    icon: DollarSign,
    breakdown: { platformFees: "$42,678", payouts: "$241,843" },
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  {
    title: "Avg Rating",
    value: "4.87",
    change: 0.3,
    trend: "up",
    icon: Star,
    breakdown: { reviews: "2,341", thisMonth: 456 },
    color: "text-amber-500",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
  },
];

// Action items requiring attention
const actionItems = [
  {
    id: "1",
    type: "verification",
    title: "12 Pending Verifications",
    description: "Background checks awaiting review",
    priority: "high",
    href: "/admin/verifications",
    icon: ShieldCheck,
  },
  {
    id: "2",
    type: "dispute",
    title: "3 Open Disputes",
    description: "Requiring admin resolution",
    priority: "high",
    href: "/admin/disputes",
    icon: AlertTriangle,
  },
  {
    id: "3",
    type: "support",
    title: "8 Support Tickets",
    description: "Unassigned tickets waiting",
    priority: "medium",
    href: "/admin/support",
    icon: Ticket,
  },
  {
    id: "4",
    type: "moderation",
    title: "4 Flagged Reviews",
    description: "Content needing moderation",
    priority: "medium",
    href: "/admin/moderation",
    icon: Flag,
  },
  {
    id: "5",
    type: "payout",
    title: "$18,450 Pending Payouts",
    description: "23 caregivers waiting for payment",
    priority: "low",
    href: "/admin/payouts",
    icon: CreditCard,
  },
];

// Real-time activity feed
const recentActivity = [
  {
    id: "1",
    type: "user_signup",
    title: "New caregiver registered",
    user: "Jennifer Martinez",
    time: "2 minutes ago",
    icon: UserPlus,
    color: "text-green-500",
  },
  {
    id: "2",
    type: "booking",
    title: "Booking completed",
    user: "Johnson Family → Maria Rodriguez",
    time: "5 minutes ago",
    icon: CheckCircle,
    color: "text-blue-500",
  },
  {
    id: "3",
    type: "verification",
    title: "Verification approved",
    user: "James Lee - Background Check",
    time: "12 minutes ago",
    icon: Shield,
    color: "text-emerald-500",
  },
  {
    id: "4",
    type: "dispute",
    title: "New dispute opened",
    user: "Garcia Family vs Sarah Thompson",
    time: "18 minutes ago",
    icon: AlertTriangle,
    color: "text-amber-500",
  },
  {
    id: "5",
    type: "payout",
    title: "Payout processed",
    user: "Maria Rodriguez - $847.00",
    time: "25 minutes ago",
    icon: DollarSign,
    color: "text-green-500",
  },
  {
    id: "6",
    type: "review",
    title: "5-star review posted",
    user: "Smith Family for Emily Chen",
    time: "32 minutes ago",
    icon: Star,
    color: "text-amber-500",
  },
  {
    id: "7",
    type: "flag",
    title: "Content flagged",
    user: "Review ID #4521 flagged for review",
    time: "45 minutes ago",
    icon: Flag,
    color: "text-red-500",
  },
  {
    id: "8",
    type: "user_deactivate",
    title: "Account deactivated",
    user: "Robert Brown (by request)",
    time: "1 hour ago",
    icon: UserMinus,
    color: "text-gray-500",
  },
];

// Conversion funnel data
const conversionFunnel = [
  { stage: "Visitors", value: 45000, percentage: 100 },
  { stage: "Sign-ups", value: 4500, percentage: 10 },
  { stage: "Profile Complete", value: 3150, percentage: 70 },
  { stage: "First Booking", value: 1890, percentage: 60 },
  { stage: "Repeat Customer", value: 1134, percentage: 60 },
];

// Top performers
const topCaregivers = [
  { name: "Maria Rodriguez", rating: 4.98, bookings: 47, earnings: "$3,245", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face" },
  { name: "Sarah Chen", rating: 4.95, bookings: 42, earnings: "$2,890", photo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop&crop=face" },
  { name: "James Williams", rating: 4.92, bookings: 38, earnings: "$2,640", photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face" },
  { name: "Emily Thompson", rating: 4.91, bookings: 35, earnings: "$2,380", photo: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop&crop=face" },
];

// Geographic distribution
const geoDistribution = [
  { city: "Seattle, WA", users: 3245, percentage: 25 },
  { city: "Bellevue, WA", users: 2156, percentage: 17 },
  { city: "Tacoma, WA", users: 1847, percentage: 14 },
  { city: "Kirkland, WA", users: 1423, percentage: 11 },
  { city: "Redmond, WA", users: 1189, percentage: 9 },
  { city: "Other", users: 2987, percentage: 24 },
];

export default function AdminDashboard() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Platform overview and real-time metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
            Refresh
          </Button>
          <Button size="sm" asChild>
            <Link href="/admin/analytics">
              View Analytics
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Platform Health Bar */}
      <Card className={cn(
        "border-l-4",
        platformHealth.status === "operational" ? "border-l-green-500" : "border-l-amber-500"
      )}>
        <CardContent className="py-3">
          <div className="flex flex-wrap items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2">
              <span className={cn(
                "h-2 w-2 rounded-full animate-pulse",
                platformHealth.status === "operational" ? "bg-green-500" : "bg-amber-500"
              )} />
              <span className="text-sm font-medium">
                {platformHealth.status === "operational" ? "All Systems Operational" : "Degraded Performance"}
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>Uptime: <strong className="text-foreground">{platformHealth.uptime}%</strong></span>
              <span>Response: <strong className="text-foreground">{platformHealth.responseTime}ms</strong></span>
              <span>Error Rate: <strong className="text-foreground">{platformHealth.errorRate}%</strong></span>
              <span>Active Users: <strong className="text-foreground">{platformHealth.activeConnections.toLocaleString()}</strong></span>
            </div>
            <Link href="/admin/health" className="ml-auto text-sm text-primary hover:underline flex items-center gap-1">
              View Details <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {keyMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", metric.bgColor)}>
                  <Icon className={cn("h-4 w-4", metric.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center gap-2 mt-1">
                  {metric.trend === "up" ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">
                      <ArrowUpRight className="h-3 w-3 mr-0.5" />
                      {metric.change}%
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs">
                      <ArrowDownRight className="h-3 w-3 mr-0.5" />
                      {metric.change}%
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
                <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                  {Object.entries(metric.breakdown).map(([key, value], i) => (
                    <span key={key}>
                      {i > 0 && " · "}
                      <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>: <strong className="text-foreground">{value}</strong>
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Items & Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Action Items */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Requires Attention
            </CardTitle>
            <Badge variant="destructive">{actionItems.filter(i => i.priority === "high").length}</Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            {actionItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border transition-colors hover:bg-muted/50",
                    item.priority === "high" && "border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-950/10"
                  )}
                >
                  <div className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                    item.priority === "high" ? "bg-red-100 dark:bg-red-900/30" : "bg-muted"
                  )}>
                    <Icon className={cn(
                      "h-4 w-4",
                      item.priority === "high" ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </Link>
              );
            })}
          </CardContent>
        </Card>

        {/* Real-time Activity */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Live Activity
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/activity">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 py-2 border-b last:border-0"
                  >
                    <div className={cn("h-8 w-8 rounded-full flex items-center justify-center bg-muted shrink-0")}>
                      <Icon className={cn("h-4 w-4", activity.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{activity.user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Conversion Funnel (This Month)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {conversionFunnel.map((stage, i) => (
              <div key={stage.stage}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{stage.stage}</span>
                  <span className="text-sm text-muted-foreground">
                    {stage.value.toLocaleString()} ({stage.percentage}%)
                  </span>
                </div>
                <Progress
                  value={stage.percentage}
                  className="h-2"
                />
                {i < conversionFunnel.length - 1 && (
                  <div className="flex justify-center my-1">
                    <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Top Caregivers (This Month)</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/users?type=caregiver&sort=rating">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCaregivers.map((caregiver, i) => (
                <div key={caregiver.name} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground w-4">#{i + 1}</span>
                  <Image
                    src={caregiver.photo}
                    alt={caregiver.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{caregiver.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {caregiver.rating}
                      </span>
                      <span>·</span>
                      <span>{caregiver.bookings} bookings</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm text-green-600 dark:text-green-400">{caregiver.earnings}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic & Quick Stats */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Geographic Distribution */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">User Distribution by Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {geoDistribution.map((location) => (
                <div key={location.city} className="flex items-center gap-3">
                  <div className="w-32 text-sm font-medium truncate">{location.city}</div>
                  <div className="flex-1">
                    <Progress value={location.percentage} className="h-2" />
                  </div>
                  <div className="w-20 text-right text-sm text-muted-foreground">
                    {location.users.toLocaleString()} ({location.percentage}%)
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Avg. Session Duration</span>
              <span className="font-medium">12m 34s</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Booking Completion Rate</span>
              <span className="font-medium">87.3%</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Avg. Response Time</span>
              <span className="font-medium">2.4 hours</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Caregiver Retention</span>
              <span className="font-medium">94.2%</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Customer NPS</span>
              <span className="font-medium text-green-600">+72</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Avg. Booking Value</span>
              <span className="font-medium">$142.50</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
