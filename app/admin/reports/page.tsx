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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileText,
  Download,
  Calendar,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  Star,
  ArrowRight,
  RefreshCw,
  Plus,
  Trash2,
  Eye,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Report types
const reportTemplates = [
  {
    id: "revenue",
    name: "Revenue Report",
    description: "Platform revenue, fees, and financial metrics",
    icon: DollarSign,
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    lastGenerated: "2024-01-28",
    frequency: "Weekly",
  },
  {
    id: "users",
    name: "User Growth Report",
    description: "New signups, retention, and user demographics",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    lastGenerated: "2024-01-27",
    frequency: "Daily",
  },
  {
    id: "bookings",
    name: "Bookings Report",
    description: "Booking volume, completion rates, and trends",
    icon: Calendar,
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    lastGenerated: "2024-01-28",
    frequency: "Daily",
  },
  {
    id: "caregivers",
    name: "Caregiver Performance",
    description: "Ratings, bookings, and caregiver metrics",
    icon: Star,
    color: "text-amber-500",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    lastGenerated: "2024-01-25",
    frequency: "Monthly",
  },
  {
    id: "compliance",
    name: "Compliance Report",
    description: "Background checks, verifications, and compliance status",
    icon: Shield,
    color: "text-emerald-500",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    lastGenerated: "2024-01-20",
    frequency: "Monthly",
  },
  {
    id: "engagement",
    name: "Platform Engagement",
    description: "Session duration, feature usage, and activity metrics",
    icon: Activity,
    color: "text-pink-500",
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
    lastGenerated: "2024-01-26",
    frequency: "Weekly",
  },
];

// Scheduled reports
const scheduledReports = [
  {
    id: "sched-1",
    name: "Weekly Revenue Summary",
    type: "revenue",
    schedule: "Every Monday at 9:00 AM",
    recipients: ["admin@bolvicare.com", "finance@bolvicare.com"],
    format: "PDF",
    status: "active",
  },
  {
    id: "sched-2",
    name: "Daily Bookings Dashboard",
    type: "bookings",
    schedule: "Daily at 6:00 AM",
    recipients: ["ops@bolvicare.com"],
    format: "CSV",
    status: "active",
  },
  {
    id: "sched-3",
    name: "Monthly Compliance Audit",
    type: "compliance",
    schedule: "1st of every month",
    recipients: ["compliance@bolvicare.com", "legal@bolvicare.com"],
    format: "PDF",
    status: "active",
  },
];

// Recent reports
const recentReports = [
  {
    id: "rep-1",
    name: "Revenue Report - January 2024",
    type: "revenue",
    generatedAt: "2024-01-28T14:30:00",
    size: "2.4 MB",
    format: "PDF",
  },
  {
    id: "rep-2",
    name: "User Growth Report - Week 4",
    type: "users",
    generatedAt: "2024-01-27T09:15:00",
    size: "1.8 MB",
    format: "PDF",
  },
  {
    id: "rep-3",
    name: "Bookings Export - January 2024",
    type: "bookings",
    generatedAt: "2024-01-28T06:00:00",
    size: "4.2 MB",
    format: "CSV",
  },
  {
    id: "rep-4",
    name: "Caregiver Performance Q4 2023",
    type: "caregivers",
    generatedAt: "2024-01-25T11:45:00",
    size: "3.1 MB",
    format: "PDF",
  },
  {
    id: "rep-5",
    name: "Platform Engagement - Week 4",
    type: "engagement",
    generatedAt: "2024-01-26T16:20:00",
    size: "1.5 MB",
    format: "PDF",
  },
];

export default function AdminReportsPage() {
  const [selectedDateRange, setSelectedDateRange] = useState("30d");
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getReportIcon = (type: string) => {
    const template = reportTemplates.find((t) => t.id === type);
    return template?.icon || FileText;
  };

  const getReportColor = (type: string) => {
    const template = reportTemplates.find((t) => t.id === type);
    return template?.color || "text-gray-500";
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerateDialogOpen(false);
      setSelectedReportType(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">Generate and manage platform reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
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
          <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Generate New Report</DialogTitle>
                <DialogDescription>
                  Select a report type and configure options to generate a new report.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Report Type</Label>
                  <Select value={selectedReportType || ""} onValueChange={setSelectedReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Select defaultValue="30d">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                      <SelectItem value="ytd">Year to date</SelectItem>
                      <SelectItem value="custom">Custom range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Export Format</Label>
                  <Select defaultValue="pdf">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                      <SelectItem value="xlsx">Excel Workbook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="email" />
                  <Label htmlFor="email" className="text-sm font-normal">
                    Email report when ready
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setGenerateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleGenerateReport} disabled={!selectedReportType || isGenerating}>
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Report
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Reports Generated</span>
            </div>
            <p className="mt-2 text-2xl font-bold">147</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Scheduled</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{scheduledReports.length}</p>
            <p className="text-xs text-muted-foreground">Active schedules</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Downloads</span>
            </div>
            <p className="mt-2 text-2xl font-bold">89</p>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Emailed</span>
            </div>
            <p className="mt-2 text-2xl font-bold">34</p>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="templates">
        <TabsList>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled ({scheduledReports.length})</TabsTrigger>
          <TabsTrigger value="recent">Recent Reports</TabsTrigger>
        </TabsList>

        {/* Report Templates */}
        <TabsContent value="templates" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reportTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <Card key={template.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", template.bgColor)}>
                        <Icon className={cn("h-5 w-5", template.color)} />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {template.frequency}
                      </Badge>
                    </div>
                    <CardTitle className="text-base mt-3">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Last generated: {template.lastGenerated}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedReportType(template.id);
                          setGenerateDialogOpen(true);
                        }}
                      >
                        Generate
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Scheduled Reports */}
        <TabsContent value="scheduled" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Scheduled Reports</CardTitle>
              <CardDescription>Automatically generated reports on a schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledReports.map((report) => {
                  const Icon = getReportIcon(report.type);
                  return (
                    <div
                      key={report.id}
                      className="flex items-center gap-4 p-4 rounded-lg border border-border"
                    >
                      <div className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center",
                        reportTemplates.find((t) => t.id === report.type)?.bgColor
                      )}>
                        <Icon className={cn("h-5 w-5", getReportColor(report.type))} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">{report.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{report.schedule}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground truncate">
                            {report.recipients.join(", ")}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={report.status === "active" ? "default" : "secondary"}>
                          {report.status}
                        </Badge>
                        <Badge variant="outline">{report.format}</Badge>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule New Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Reports */}
        <TabsContent value="recent" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Reports</CardTitle>
              <CardDescription>Previously generated reports available for download</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentReports.map((report) => {
                  const Icon = getReportIcon(report.type);
                  return (
                    <div
                      key={report.id}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className={cn(
                        "h-9 w-9 rounded-lg flex items-center justify-center",
                        reportTemplates.find((t) => t.id === report.type)?.bgColor
                      )}>
                        <Icon className={cn("h-4 w-4", getReportColor(report.type))} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground">{report.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(report.generatedAt)} · {report.size}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {report.format}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
