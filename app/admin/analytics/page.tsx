"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Calendar,
  Clock,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  RefreshCw,
  Target,
  Zap,
  Heart,
  MapPin,
  Smartphone,
  Monitor,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCard {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  trend: "up" | "down" | "neutral";
}

const overviewMetrics: MetricCard[] = [
  {
    label: "Total Revenue",
    value: "$847,392",
    change: 12.5,
    changeLabel: "vs last month",
    icon: DollarSign,
    trend: "up",
  },
  {
    label: "Active Users",
    value: "12,847",
    change: 8.2,
    changeLabel: "vs last month",
    icon: Users,
    trend: "up",
  },
  {
    label: "Bookings",
    value: "3,428",
    change: -2.4,
    changeLabel: "vs last month",
    icon: Calendar,
    trend: "down",
  },
  {
    label: "Avg Rating",
    value: "4.87",
    change: 0.12,
    changeLabel: "vs last month",
    icon: Star,
    trend: "up",
  },
];

const conversionData = {
  visitors: 45280,
  signups: 2847,
  profileComplete: 1923,
  firstBooking: 1456,
  repeatBooking: 892,
};

const userGrowthData = [
  { month: "Aug", families: 8420, caregivers: 2150 },
  { month: "Sep", families: 9180, caregivers: 2380 },
  { month: "Oct", families: 10250, caregivers: 2650 },
  { month: "Nov", families: 11340, caregivers: 2890 },
  { month: "Dec", families: 12100, caregivers: 3120 },
  { month: "Jan", families: 12847, caregivers: 3350 },
];

const topServices = [
  { name: "Companionship", bookings: 1245, revenue: 124500, growth: 15.2 },
  { name: "Personal Care", bookings: 987, revenue: 148050, growth: 8.7 },
  { name: "Medication Mgmt", bookings: 654, revenue: 78480, growth: 22.1 },
  { name: "Meal Preparation", bookings: 543, revenue: 48870, growth: 5.3 },
  { name: "Transportation", bookings: 432, revenue: 34560, growth: -3.2 },
];

const geoData = [
  { region: "Seattle", users: 3420, revenue: 245000, growth: 12.5 },
  { region: "Bellevue", users: 2890, revenue: 198000, growth: 18.2 },
  { region: "Tacoma", users: 1650, revenue: 112000, growth: 8.7 },
  { region: "Spokane", users: 1240, revenue: 86000, growth: 15.3 },
  { region: "Vancouver", users: 980, revenue: 72000, growth: 22.1 },
];

const deviceData = [
  { device: "Mobile", percentage: 62, sessions: 28140 },
  { device: "Desktop", percentage: 31, sessions: 14040 },
  { device: "Tablet", percentage: 7, sessions: 3170 },
];

const retentionData = {
  day1: 78,
  day7: 52,
  day30: 38,
  day90: 24,
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showExportToast, setShowExportToast] = useState(false);

  const getConversionRate = (current: number, previous: number) => {
    return ((current / previous) * 100).toFixed(1);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExport = () => {
    setShowExportToast(true);
    setTimeout(() => setShowExportToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Platform performance and insights</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>

          {/* Export Toast Notification */}
          {showExportToast && (
            <div className="fixed bottom-4 right-4 z-50 bg-background border border-border rounded-lg shadow-lg p-4 flex items-center gap-3 animate-in slide-in-from-bottom-5">
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Download className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-sm">Export Started</p>
                <p className="text-xs text-muted-foreground">Analytics report downloading...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    metric.trend === "up" ? "text-green-600" : metric.trend === "down" ? "text-red-600" : "text-muted-foreground"
                  )}>
                    {metric.trend === "up" ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : metric.trend === "down" ? (
                      <ArrowDownRight className="h-4 w-4" />
                    ) : null}
                    {metric.change > 0 ? "+" : ""}{metric.change}%
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Conversion Funnel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Conversion Funnel</CardTitle>
                <CardDescription>User journey from visitor to repeat customer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Visitors</span>
                      <span className="font-medium">{conversionData.visitors.toLocaleString()}</span>
                    </div>
                    <div className="h-3 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "100%" }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Sign Ups</span>
                      <span className="font-medium">
                        {conversionData.signups.toLocaleString()}
                        <span className="text-muted-foreground ml-2">
                          ({getConversionRate(conversionData.signups, conversionData.visitors)}%)
                        </span>
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary/80 rounded-full"
                        style={{ width: `${(conversionData.signups / conversionData.visitors) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Profile Complete</span>
                      <span className="font-medium">
                        {conversionData.profileComplete.toLocaleString()}
                        <span className="text-muted-foreground ml-2">
                          ({getConversionRate(conversionData.profileComplete, conversionData.signups)}%)
                        </span>
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary/60 rounded-full"
                        style={{ width: `${(conversionData.profileComplete / conversionData.visitors) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>First Booking</span>
                      <span className="font-medium">
                        {conversionData.firstBooking.toLocaleString()}
                        <span className="text-muted-foreground ml-2">
                          ({getConversionRate(conversionData.firstBooking, conversionData.profileComplete)}%)
                        </span>
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary/40 rounded-full"
                        style={{ width: `${(conversionData.firstBooking / conversionData.visitors) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Repeat Booking</span>
                      <span className="font-medium">
                        {conversionData.repeatBooking.toLocaleString()}
                        <span className="text-muted-foreground ml-2">
                          ({getConversionRate(conversionData.repeatBooking, conversionData.firstBooking)}%)
                        </span>
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${(conversionData.repeatBooking / conversionData.visitors) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Growth */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">User Growth</CardTitle>
                <CardDescription>Monthly active users by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userGrowthData.map((data, idx) => (
                    <div key={data.month} className="flex items-center gap-4">
                      <span className="w-8 text-sm text-muted-foreground">{data.month}</span>
                      <div className="flex-1 flex gap-1">
                        <div
                          className="h-6 bg-primary rounded-l"
                          style={{ width: `${(data.families / 15000) * 100}%` }}
                        />
                        <div
                          className="h-6 bg-primary/40 rounded-r"
                          style={{ width: `${(data.caregivers / 15000) * 100}%` }}
                        />
                      </div>
                      <span className="w-20 text-sm text-right">
                        {(data.families + data.caregivers).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-6 mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-primary" />
                    <span className="text-sm text-muted-foreground">Families</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-primary/40" />
                    <span className="text-sm text-muted-foreground">Caregivers</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Services */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Services</CardTitle>
              <CardDescription>Most popular care services by bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium">Service</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Bookings</th>
                      <th className="px-4 py-3 text-right text-sm font-medium hidden sm:table-cell">Revenue</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topServices.map((service, idx) => (
                      <tr key={service.name} className="border-b last:border-b-0">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                              {idx + 1}
                            </div>
                            <span className="font-medium text-sm">{service.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-sm">
                          {service.bookings.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-sm hidden sm:table-cell">
                          ${service.revenue.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={cn(
                            "inline-flex items-center text-sm font-medium",
                            service.growth >= 0 ? "text-green-600" : "text-red-600"
                          )}>
                            {service.growth >= 0 ? (
                              <ArrowUpRight className="h-4 w-4 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 mr-1" />
                            )}
                            {Math.abs(service.growth)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Geographic Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Geographic Distribution</CardTitle>
                <CardDescription>Users by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {geoData.map((region) => (
                    <div key={region.region} className="flex items-center gap-4">
                      <div className="flex items-center gap-2 w-32">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium truncate">{region.region}</span>
                      </div>
                      <div className="flex-1">
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(region.users / 3420) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right w-20">
                        <p className="text-sm font-medium">{region.users.toLocaleString()}</p>
                        <p className="text-xs text-green-600">+{region.growth}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Device Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Device Breakdown</CardTitle>
                <CardDescription>Sessions by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-4 mb-6">
                  {deviceData.map((device) => {
                    const Icon = device.device === "Mobile" ? Smartphone : device.device === "Desktop" ? Monitor : Globe;
                    return (
                      <div key={device.device} className="text-center">
                        <div className={cn(
                          "h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-2",
                          device.device === "Mobile" ? "bg-primary/20" : device.device === "Desktop" ? "bg-primary/10" : "bg-primary/5"
                        )}>
                          <Icon className={cn(
                            "h-8 w-8",
                            device.device === "Mobile" ? "text-primary" : "text-primary/60"
                          )} />
                        </div>
                        <p className="text-2xl font-bold">{device.percentage}%</p>
                        <p className="text-sm text-muted-foreground">{device.device}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="h-4 rounded-full overflow-hidden flex">
                  {deviceData.map((device, idx) => (
                    <div
                      key={device.device}
                      className={cn(
                        idx === 0 ? "bg-primary" : idx === 1 ? "bg-primary/60" : "bg-primary/30"
                      )}
                      style={{ width: `${device.percentage}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-sm text-muted-foreground">
                  <span>{deviceData.reduce((sum, d) => sum + d.sessions, 0).toLocaleString()} total sessions</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-blue-500/10 p-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Families</p>
                    <p className="text-2xl font-bold">12,847</p>
                    <p className="text-sm text-green-600">+8.2% this month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-pink-500/10 p-3">
                    <Heart className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Caregivers</p>
                    <p className="text-2xl font-bold">3,350</p>
                    <p className="text-sm text-green-600">+12.4% this month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-500/10 p-3">
                    <Zap className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Today</p>
                    <p className="text-2xl font-bold">2,847</p>
                    <p className="text-sm text-muted-foreground">17.6% of total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Retention Cohort */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">User Retention</CardTitle>
              <CardDescription>Percentage of users returning over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="p-4 rounded-lg border text-center">
                  <p className="text-3xl font-bold text-green-600">{retentionData.day1}%</p>
                  <p className="text-sm text-muted-foreground mt-1">Day 1</p>
                </div>
                <div className="p-4 rounded-lg border text-center">
                  <p className="text-3xl font-bold text-blue-600">{retentionData.day7}%</p>
                  <p className="text-sm text-muted-foreground mt-1">Day 7</p>
                </div>
                <div className="p-4 rounded-lg border text-center">
                  <p className="text-3xl font-bold text-purple-600">{retentionData.day30}%</p>
                  <p className="text-sm text-muted-foreground mt-1">Day 30</p>
                </div>
                <div className="p-4 rounded-lg border text-center">
                  <p className="text-3xl font-bold text-orange-600">{retentionData.day90}%</p>
                  <p className="text-sm text-muted-foreground mt-1">Day 90</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-500/10 p-3">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">$847,392</p>
                    <p className="text-sm text-green-600">+12.5% vs last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-blue-500/10 p-3">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Platform Fees</p>
                    <p className="text-2xl font-bold">$127,109</p>
                    <p className="text-sm text-muted-foreground">15% of GMV</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-purple-500/10 p-3">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Booking Value</p>
                    <p className="text-2xl font-bold">$247</p>
                    <p className="text-sm text-green-600">+5.2% vs last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Revenue Breakdown</CardTitle>
              <CardDescription>Revenue by service category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topServices.map((service) => (
                  <div key={service.name} className="flex items-center gap-4">
                    <span className="w-32 text-sm font-medium">{service.name}</span>
                    <div className="flex-1">
                      <div className="h-4 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(service.revenue / 148050) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-24 text-right text-sm font-medium">
                      ${service.revenue.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6 mt-6">
          <div className="grid gap-6 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="text-2xl font-bold">12.4 min</p>
                <p className="text-sm text-muted-foreground">Avg Session Duration</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="text-2xl font-bold">4.2</p>
                <p className="text-sm text-muted-foreground">Pages per Session</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingDown className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="text-2xl font-bold">32%</p>
                <p className="text-sm text-muted-foreground">Bounce Rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="text-2xl font-bold">68</p>
                <p className="text-sm text-muted-foreground">NPS Score</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Feature Adoption</CardTitle>
              <CardDescription>Percentage of users using key features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Profile Photo Upload</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: "87%" }} />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">87%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Messaging</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "72%" }} />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">72%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Calendar Sync</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: "45%" }} />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">45%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mobile App</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: "62%" }} />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">62%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Reviews Written</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-pink-500 rounded-full" style={{ width: "38%" }} />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">38%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
