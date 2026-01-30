"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Download,
  User,
  Settings,
  Shield,
  DollarSign,
  FileText,
  Database,
  Clock,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Plus,
  LogIn,
  LogOut,
  Key,
  Mail,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AuditLog {
  id: string;
  timestamp: string;
  actor: {
    id: string;
    name: string;
    email: string;
    type: "admin" | "system" | "user";
    avatar?: string;
  };
  action: string;
  category: "auth" | "user" | "booking" | "payment" | "settings" | "moderation" | "security";
  resource: {
    type: string;
    id: string;
    name?: string;
  };
  details: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  status: "success" | "failure" | "warning";
}

const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    timestamp: "2024-01-15T16:45:32Z",
    actor: {
      id: "admin1",
      name: "Sarah Admin",
      email: "sarah@bolvicare.com",
      type: "admin",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    action: "user.verify",
    category: "user",
    resource: { type: "caregiver", id: "cg-12345", name: "Maria Santos" },
    details: { verificationLevel: "enhanced", documentsReviewed: 5 },
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    status: "success",
  },
  {
    id: "2",
    timestamp: "2024-01-15T16:30:15Z",
    actor: {
      id: "admin2",
      name: "James Moderator",
      email: "james@bolvicare.com",
      type: "admin",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    },
    action: "content.reject",
    category: "moderation",
    resource: { type: "review", id: "rev-98765", name: "Review by Robert Chen" },
    details: { reason: "Potential defamation", aiScore: 0.85 },
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    status: "success",
  },
  {
    id: "3",
    timestamp: "2024-01-15T16:15:00Z",
    actor: {
      id: "system",
      name: "System",
      email: "system@bolvicare.com",
      type: "system",
    },
    action: "payout.process",
    category: "payment",
    resource: { type: "payout", id: "pay-45678" },
    details: { amount: 1250.00, recipients: 15, method: "direct_deposit" },
    ipAddress: "internal",
    userAgent: "BolviCare/BatchProcessor",
    status: "success",
  },
  {
    id: "4",
    timestamp: "2024-01-15T15:45:22Z",
    actor: {
      id: "admin1",
      name: "Sarah Admin",
      email: "sarah@bolvicare.com",
      type: "admin",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    action: "settings.update",
    category: "settings",
    resource: { type: "platform_settings", id: "platform" },
    details: { field: "platform_fee", oldValue: "12%", newValue: "15%" },
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    status: "success",
  },
  {
    id: "5",
    timestamp: "2024-01-15T15:30:00Z",
    actor: {
      id: "admin3",
      name: "Unknown",
      email: "unknown@external.com",
      type: "admin",
    },
    action: "auth.login_failed",
    category: "security",
    resource: { type: "auth", id: "session" },
    details: { reason: "invalid_credentials", attempts: 3 },
    ipAddress: "203.0.113.42",
    userAgent: "Mozilla/5.0 (Linux; Android 10)",
    status: "failure",
  },
  {
    id: "6",
    timestamp: "2024-01-15T15:00:00Z",
    actor: {
      id: "admin1",
      name: "Sarah Admin",
      email: "sarah@bolvicare.com",
      type: "admin",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    action: "user.suspend",
    category: "user",
    resource: { type: "caregiver", id: "cg-99999", name: "John Doe" },
    details: { reason: "Terms violation", duration: "permanent" },
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    status: "success",
  },
  {
    id: "7",
    timestamp: "2024-01-15T14:30:00Z",
    actor: {
      id: "system",
      name: "System",
      email: "system@bolvicare.com",
      type: "system",
    },
    action: "booking.auto_complete",
    category: "booking",
    resource: { type: "booking", id: "bk-12340" },
    details: { bookings_completed: 24, total_value: 4560.00 },
    ipAddress: "internal",
    userAgent: "BolviCare/Scheduler",
    status: "success",
  },
  {
    id: "8",
    timestamp: "2024-01-15T14:00:00Z",
    actor: {
      id: "admin2",
      name: "James Moderator",
      email: "james@bolvicare.com",
      type: "admin",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    },
    action: "incident.resolve",
    category: "security",
    resource: { type: "incident", id: "inc-001", name: "Care recipient fall" },
    details: { resolution: "documented", followUp: true },
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    status: "success",
  },
];

const auditStats = {
  totalLogs: 15847,
  todayLogs: 342,
  securityEvents: 12,
  failedActions: 8,
};

export default function AuditPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || log.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryIcon = (category: AuditLog["category"]) => {
    switch (category) {
      case "auth":
        return Key;
      case "user":
        return User;
      case "booking":
        return Calendar;
      case "payment":
        return DollarSign;
      case "settings":
        return Settings;
      case "moderation":
        return FileText;
      case "security":
        return Shield;
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes("login") || action.includes("auth")) return LogIn;
    if (action.includes("logout")) return LogOut;
    if (action.includes("create") || action.includes("add")) return Plus;
    if (action.includes("update") || action.includes("edit")) return Edit;
    if (action.includes("delete") || action.includes("remove")) return Trash2;
    if (action.includes("view") || action.includes("read")) return Eye;
    return FileText;
  };

  const getStatusBadge = (status: AuditLog["status"]) => {
    switch (status) {
      case "success":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Success</Badge>;
      case "failure":
        return <Badge variant="destructive">Failed</Badge>;
      case "warning":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Warning</Badge>;
    }
  };

  const formatAction = (action: string) => {
    return action.replace(/\./g, " → ").replace(/_/g, " ");
  };

  const viewLogDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Audit Logs</h1>
          <p className="text-muted-foreground">Track all administrative actions and system events</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{auditStats.totalLogs.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Logs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{auditStats.todayLogs}</p>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-yellow-500/10 p-2">
                <Shield className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{auditStats.securityEvents}</p>
                <p className="text-xs text-muted-foreground">Security Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-500/10 p-2">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{auditStats.failedActions}</p>
                <p className="text-xs text-muted-foreground">Failed Actions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="auth">Authentication</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="booking">Booking</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="settings">Settings</SelectItem>
                <SelectItem value="moderation">Moderation</SelectItem>
                <SelectItem value="security">Security</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failure">Failed</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Activity Log</CardTitle>
            <Badge variant="secondary">{filteredLogs.length} entries</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="divide-y">
              {filteredLogs.map((log) => {
                const CategoryIcon = getCategoryIcon(log.category);
                const ActionIcon = getActionIcon(log.action);
                return (
                  <div
                    key={log.id}
                    className={cn(
                      "p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                      log.status === "failure" && "bg-red-500/5"
                    )}
                    onClick={() => viewLogDetails(log)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "rounded-lg p-2",
                        log.status === "success" ? "bg-green-500/10" :
                        log.status === "failure" ? "bg-red-500/10" :
                        "bg-yellow-500/10"
                      )}>
                        <CategoryIcon className={cn(
                          "h-4 w-4",
                          log.status === "success" ? "text-green-600" :
                          log.status === "failure" ? "text-red-600" :
                          "text-yellow-600"
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm capitalize">
                            {formatAction(log.action)}
                          </span>
                          {getStatusBadge(log.status)}
                          <Badge variant="outline" className="text-xs capitalize">
                            {log.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {log.actor.avatar ? (
                            <img
                              src={log.actor.avatar}
                              alt={log.actor.name}
                              className="h-5 w-5 rounded-full"
                            />
                          ) : (
                            <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                              <User className="h-3 w-3 text-muted-foreground" />
                            </div>
                          )}
                          <span className="text-sm text-muted-foreground">
                            {log.actor.name}
                          </span>
                          {log.resource.name && (
                            <>
                              <span className="text-muted-foreground">→</span>
                              <span className="text-sm">{log.resource.name}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{new Date(log.timestamp).toLocaleString()}</span>
                          <span className="hidden sm:inline">{log.ipAddress}</span>
                          <span className="font-mono">{log.resource.id}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                {selectedLog.actor.avatar ? (
                  <img
                    src={selectedLog.actor.avatar}
                    alt={selectedLog.actor.name}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <p className="font-medium">{selectedLog.actor.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedLog.actor.email}</p>
                </div>
                <Badge variant="outline" className="ml-auto capitalize">
                  {selectedLog.actor.type}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Action</p>
                  <p className="text-sm font-medium capitalize">{formatAction(selectedLog.action)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  {getStatusBadge(selectedLog.status)}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Timestamp</p>
                  <p className="text-sm">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Category</p>
                  <Badge variant="outline" className="capitalize">{selectedLog.category}</Badge>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Resource</p>
                <div className="p-3 rounded-lg border">
                  <p className="text-sm font-medium">{selectedLog.resource.name || selectedLog.resource.id}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {selectedLog.resource.type} • {selectedLog.resource.id}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Details</p>
                <pre className="p-3 rounded-lg bg-muted text-xs overflow-auto">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">IP Address</p>
                  <p className="text-sm font-mono">{selectedLog.ipAddress}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">User Agent</p>
                  <p className="text-xs text-muted-foreground truncate">{selectedLog.userAgent}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
