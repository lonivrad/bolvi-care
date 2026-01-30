"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DollarSign,
  Search,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  CreditCard,
  Building2,
  RefreshCw,
  Eye,
  MoreHorizontal,
  Send,
  Calendar,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Payout {
  id: string;
  caregiverName: string;
  caregiverEmail: string;
  amount: number;
  method: "bank_transfer" | "stripe" | "paypal";
  status: "pending" | "processing" | "completed" | "failed";
  requestedAt: string;
  processedAt?: string;
  bookingsCount: number;
  period: string;
  accountLast4?: string;
}

const payouts: Payout[] = [
  {
    id: "PAY001",
    caregiverName: "Maria Rodriguez",
    caregiverEmail: "maria.r@email.com",
    amount: 1245.00,
    method: "bank_transfer",
    status: "pending",
    requestedAt: "2024-03-03T10:30:00",
    bookingsCount: 12,
    period: "Feb 16 - Mar 1",
    accountLast4: "4521",
  },
  {
    id: "PAY002",
    caregiverName: "David Kim",
    caregiverEmail: "david.kim@email.com",
    amount: 892.50,
    method: "stripe",
    status: "processing",
    requestedAt: "2024-03-02T14:15:00",
    bookingsCount: 8,
    period: "Feb 16 - Mar 1",
    accountLast4: "1234",
  },
  {
    id: "PAY003",
    caregiverName: "Sarah Thompson",
    caregiverEmail: "sarah.t@email.com",
    amount: 1567.25,
    method: "bank_transfer",
    status: "completed",
    requestedAt: "2024-03-01T09:00:00",
    processedAt: "2024-03-02T11:30:00",
    bookingsCount: 15,
    period: "Feb 1 - Feb 15",
    accountLast4: "7890",
  },
  {
    id: "PAY004",
    caregiverName: "James Wilson",
    caregiverEmail: "james.w@email.com",
    amount: 445.00,
    method: "paypal",
    status: "completed",
    requestedAt: "2024-02-28T16:45:00",
    processedAt: "2024-03-01T10:00:00",
    bookingsCount: 5,
    period: "Feb 1 - Feb 15",
  },
  {
    id: "PAY005",
    caregiverName: "Emily Chen",
    caregiverEmail: "emily.c@email.com",
    amount: 2134.75,
    method: "bank_transfer",
    status: "failed",
    requestedAt: "2024-02-27T12:30:00",
    bookingsCount: 18,
    period: "Feb 1 - Feb 15",
    accountLast4: "5678",
  },
  {
    id: "PAY006",
    caregiverName: "Michael Brown",
    caregiverEmail: "michael.b@email.com",
    amount: 678.00,
    method: "stripe",
    status: "pending",
    requestedAt: "2024-03-03T08:00:00",
    bookingsCount: 6,
    period: "Feb 16 - Mar 1",
    accountLast4: "9012",
  },
];

const stats = [
  {
    label: "Pending Payouts",
    value: "$5,392",
    count: 12,
    change: "+8%",
    trend: "up",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
  },
  {
    label: "Processing",
    value: "$2,847",
    count: 5,
    change: "-3%",
    trend: "down",
    icon: RefreshCw,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
  {
    label: "Completed (This Week)",
    value: "$48,293",
    count: 87,
    change: "+15%",
    trend: "up",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-500/10",
  },
  {
    label: "Failed/Rejected",
    value: "$3,421",
    count: 4,
    change: "-22%",
    trend: "down",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-500/10",
  },
];

export default function AdminPayoutsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);

  const filteredPayouts = payouts.filter((payout) => {
    const matchesSearch =
      payout.caregiverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payout.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || payout.status === statusFilter;
    const matchesMethod = methodFilter === "all" || payout.method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const getStatusBadge = (status: Payout["status"]) => {
    const styles = {
      pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return (
      <Badge variant="secondary" className={cn("capitalize", styles[status])}>
        {status}
      </Badge>
    );
  };

  const getMethodIcon = (method: Payout["method"]) => {
    switch (method) {
      case "bank_transfer":
        return <Building2 className="h-4 w-4" />;
      case "stripe":
        return <CreditCard className="h-4 w-4" />;
      case "paypal":
        return <Wallet className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Payouts Management</h1>
          <p className="text-muted-foreground">Process and track caregiver payouts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Send className="mr-2 h-4 w-4" />
            Process Batch
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={cn("rounded-lg p-2", stat.bgColor)}>
                    <Icon className={cn("h-5 w-5", stat.color)} />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  )}>
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">
                    {stat.label} ({stat.count})
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or payout ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payouts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Requests</CardTitle>
          <CardDescription>
            Review and process payout requests from caregivers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payout ID</TableHead>
                  <TableHead>Caregiver</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell className="font-mono text-sm">{payout.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{payout.caregiverName}</p>
                        <p className="text-xs text-muted-foreground">{payout.caregiverEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">${payout.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getMethodIcon(payout.method)}
                        <span className="text-sm capitalize">
                          {payout.method.replace("_", " ")}
                        </span>
                        {payout.accountLast4 && (
                          <span className="text-xs text-muted-foreground">
                            ****{payout.accountLast4}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {payout.period}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {payout.bookingsCount} bookings
                      </p>
                    </TableCell>
                    <TableCell>{getStatusBadge(payout.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(payout.requestedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedPayout(payout)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Payout Details</DialogTitle>
                              <DialogDescription>
                                Review payout request {payout.id}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Caregiver</p>
                                  <p className="font-medium">{payout.caregiverName}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Amount</p>
                                  <p className="font-medium text-lg">${payout.amount.toFixed(2)}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Method</p>
                                  <p className="font-medium capitalize">{payout.method.replace("_", " ")}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Period</p>
                                  <p className="font-medium">{payout.period}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Bookings</p>
                                  <p className="font-medium">{payout.bookingsCount}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Status</p>
                                  {getStatusBadge(payout.status)}
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              {payout.status === "pending" && (
                                <>
                                  <Button variant="outline">Reject</Button>
                                  <Button>Approve & Process</Button>
                                </>
                              )}
                              {payout.status === "failed" && (
                                <Button>Retry Payout</Button>
                              )}
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        {payout.status === "pending" && (
                          <Button size="sm">
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Approve
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
            {[
              { action: "Payout completed", user: "Sarah Thompson", amount: "$1,567.25", time: "2 hours ago", type: "success" },
              { action: "Payout processing", user: "David Kim", amount: "$892.50", time: "4 hours ago", type: "info" },
              { action: "Payout failed", user: "Emily Chen", amount: "$2,134.75", time: "1 day ago", type: "error" },
              { action: "Batch processed", user: "System", amount: "$12,450.00", time: "2 days ago", type: "success" },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    activity.type === "success" && "bg-green-500",
                    activity.type === "info" && "bg-blue-500",
                    activity.type === "error" && "bg-red-500"
                  )} />
                  <div>
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.user}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{activity.amount}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
