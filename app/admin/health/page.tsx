"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Zap,
  Globe,
  Shield,
  BarChart3,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceStatus {
  name: string;
  status: "operational" | "degraded" | "outage";
  latency?: number;
  uptime: number;
  lastIncident?: string;
}

interface SystemMetric {
  name: string;
  value: number;
  max: number;
  unit: string;
  status: "healthy" | "warning" | "critical";
}

const services: ServiceStatus[] = [
  { name: "Web Application", status: "operational", latency: 142, uptime: 99.98, lastIncident: "32 days ago" },
  { name: "API Gateway", status: "operational", latency: 89, uptime: 99.99, lastIncident: "45 days ago" },
  { name: "Authentication", status: "operational", latency: 56, uptime: 99.97, lastIncident: "12 days ago" },
  { name: "Payment Processing", status: "operational", latency: 234, uptime: 99.95, lastIncident: "8 days ago" },
  { name: "Search Service", status: "degraded", latency: 456, uptime: 99.82, lastIncident: "2 hours ago" },
  { name: "Email Service", status: "operational", latency: 312, uptime: 99.91, lastIncident: "5 days ago" },
  { name: "Push Notifications", status: "operational", latency: 78, uptime: 99.94, lastIncident: "18 days ago" },
  { name: "File Storage", status: "operational", latency: 167, uptime: 99.99, lastIncident: "60 days ago" },
  { name: "Background Jobs", status: "operational", latency: 45, uptime: 99.96, lastIncident: "7 days ago" },
  { name: "WebSocket Server", status: "operational", latency: 23, uptime: 99.98, lastIncident: "21 days ago" },
];

const systemMetrics: SystemMetric[] = [
  { name: "CPU Usage", value: 42, max: 100, unit: "%", status: "healthy" },
  { name: "Memory", value: 68, max: 100, unit: "%", status: "warning" },
  { name: "Disk I/O", value: 23, max: 100, unit: "%", status: "healthy" },
  { name: "Network", value: 156, max: 1000, unit: "Mbps", status: "healthy" },
];

const databaseMetrics = {
  connections: { current: 234, max: 500, status: "healthy" as const },
  queryTime: { avg: 12, p95: 45, p99: 128, status: "healthy" as const },
  replication: { lag: 0.3, status: "healthy" as const },
  storage: { used: 245, total: 500, status: "healthy" as const },
};

const recentIncidents = [
  {
    id: "1",
    title: "Search Service Degraded Performance",
    status: "investigating",
    severity: "minor",
    startedAt: "2024-01-15T14:30:00Z",
    description: "Elevated latency in search queries. Engineering team investigating.",
    updates: [
      { time: "14:45", message: "Identified potential cause - database index fragmentation" },
      { time: "14:30", message: "Monitoring alerted on elevated p95 latency" },
    ],
  },
  {
    id: "2",
    title: "Payment Processing Timeout",
    status: "resolved",
    severity: "major",
    startedAt: "2024-01-07T09:15:00Z",
    resolvedAt: "2024-01-07T09:45:00Z",
    description: "Payment gateway experienced brief timeout period.",
    updates: [
      { time: "09:45", message: "Issue resolved. Payment gateway restored." },
      { time: "09:30", message: "Failover to backup gateway initiated" },
      { time: "09:15", message: "Detected payment processing failures" },
    ],
  },
];

const uptimeHistory = [
  { date: "Jan 9", uptime: 100 },
  { date: "Jan 10", uptime: 100 },
  { date: "Jan 11", uptime: 100 },
  { date: "Jan 12", uptime: 99.8 },
  { date: "Jan 13", uptime: 100 },
  { date: "Jan 14", uptime: 100 },
  { date: "Jan 15", uptime: 99.2 },
];

export default function HealthPage() {
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefresh(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  const overallStatus = services.every((s) => s.status === "operational")
    ? "operational"
    : services.some((s) => s.status === "outage")
    ? "outage"
    : "degraded";

  const getStatusIcon = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "outage":
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "operational":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Operational</Badge>;
      case "degraded":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Degraded</Badge>;
      case "outage":
        return <Badge variant="destructive">Outage</Badge>;
    }
  };

  const getMetricColor = (status: SystemMetric["status"]) => {
    switch (status) {
      case "healthy":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "critical":
        return "bg-red-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Platform Health</h1>
          <p className="text-muted-foreground">Real-time system status and monitoring</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Status Banner */}
      <Card className={cn(
        "border-2",
        overallStatus === "operational" ? "border-green-500/50 bg-green-500/5" :
        overallStatus === "degraded" ? "border-yellow-500/50 bg-yellow-500/5" :
        "border-red-500/50 bg-red-500/5"
      )}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                "rounded-full p-3",
                overallStatus === "operational" ? "bg-green-500/20" :
                overallStatus === "degraded" ? "bg-yellow-500/20" :
                "bg-red-500/20"
              )}>
                {overallStatus === "operational" ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : overallStatus === "degraded" ? (
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-500" />
                )}
              </div>
              <div>
                <h2 className={cn(
                  "text-xl font-bold",
                  overallStatus === "operational" ? "text-green-700" :
                  overallStatus === "degraded" ? "text-yellow-700" :
                  "text-red-700"
                )}>
                  {overallStatus === "operational" ? "All Systems Operational" :
                   overallStatus === "degraded" ? "Partial System Degradation" :
                   "System Outage Detected"}
                </h2>
                <p className="text-muted-foreground">
                  {services.filter((s) => s.status === "operational").length} of {services.length} services operational
                </p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-3xl font-bold text-green-600">99.94%</p>
              <p className="text-sm text-muted-foreground">30-day uptime</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-xs text-muted-foreground">Active Connections</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500/10 p-2">
                <Zap className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">142ms</p>
                <p className="text-xs text-muted-foreground">Avg Response Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">45.2K</p>
                <p className="text-xs text-muted-foreground">Requests/min</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-500/10 p-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">0.02%</p>
                <p className="text-xs text-muted-foreground">Error Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Services Status */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Service Status</CardTitle>
            <CardDescription>Real-time status of all platform services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {services.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <p className="font-medium text-sm">{service.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Last incident: {service.lastIncident}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium">{service.latency}ms</p>
                      <p className="text-xs text-muted-foreground">latency</p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-sm font-medium">{service.uptime}%</p>
                      <p className="text-xs text-muted-foreground">uptime</p>
                    </div>
                    {getStatusBadge(service.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Resources</CardTitle>
            <CardDescription>Server resource utilization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {systemMetrics.map((metric) => (
              <div key={metric.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{metric.name}</span>
                  <span className="text-sm">
                    {metric.value}{metric.unit}
                    {metric.max && <span className="text-muted-foreground">/{metric.max}{metric.unit}</span>}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", getMetricColor(metric.status))}
                    style={{ width: `${(metric.value / metric.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}

            <div className="pt-4 border-t space-y-4">
              <h4 className="text-sm font-medium">Database</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-lg font-bold">{databaseMetrics.connections.current}</p>
                  <p className="text-xs text-muted-foreground">Active Connections</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-lg font-bold">{databaseMetrics.queryTime.avg}ms</p>
                  <p className="text-xs text-muted-foreground">Avg Query Time</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-lg font-bold">{databaseMetrics.replication.lag}s</p>
                  <p className="text-xs text-muted-foreground">Replication Lag</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-lg font-bold">{databaseMetrics.storage.used}GB</p>
                  <p className="text-xs text-muted-foreground">Storage Used</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Uptime History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">7-Day Uptime History</CardTitle>
          <CardDescription>Daily uptime percentage over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2 h-32">
            {uptimeHistory.map((day) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "w-full rounded-t transition-all",
                    day.uptime === 100 ? "bg-green-500" : day.uptime >= 99.5 ? "bg-yellow-500" : "bg-red-500"
                  )}
                  style={{ height: `${day.uptime}%` }}
                />
                <div className="text-center">
                  <p className="text-xs font-medium">{day.uptime}%</p>
                  <p className="text-xs text-muted-foreground">{day.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Incidents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Recent Incidents</CardTitle>
            <CardDescription>Latest platform incidents and their status</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <ExternalLink className="mr-2 h-4 w-4" />
            Status Page
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentIncidents.map((incident) => (
              <div key={incident.id} className="p-4 rounded-lg border">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{incident.title}</h4>
                      <Badge
                        variant={incident.status === "resolved" ? "outline" : "destructive"}
                        className={incident.status === "resolved" ? "bg-green-500/10 text-green-600 border-green-500/20" : ""}
                      >
                        {incident.status === "resolved" ? "Resolved" : "Investigating"}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {incident.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{incident.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(incident.startedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-3 pl-4 border-l-2 border-muted space-y-2">
                  {incident.updates.map((update, idx) => (
                    <div key={idx} className="flex gap-2 text-sm">
                      <span className="text-muted-foreground font-mono text-xs w-12">{update.time}</span>
                      <span>{update.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
