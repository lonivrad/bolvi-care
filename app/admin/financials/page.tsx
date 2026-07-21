"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  CreditCard,
  Wallet,
  PiggyBank,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Heart,
  MapPin,
  ExternalLink,
} from "lucide-react";

const financialStats = [
  {
    title: "Total Revenue",
    value: "$1,284,521",
    change: "+23.1%",
    trend: "up",
    icon: DollarSign,
    description: "All time care revenue",
  },
  {
    title: "Care Revenue (MTD)",
    value: "$426,098",
    change: "+18.4%",
    trend: "up",
    icon: PiggyBank,
    description: "This month's care billing",
  },
  {
    title: "Payroll (MTD)",
    value: "$302,540",
    change: "+6.1%",
    trend: "up",
    icon: Wallet,
    description: "Processed via payroll provider",
  },
  {
    title: "Avg Transaction",
    value: "$187",
    change: "+4.7%",
    trend: "up",
    icon: CreditCard,
    description: "Per booking average",
  },
];

interface Transaction {
  id: string;
  type: "booking" | "payout" | "refund";
  description: string;
  caregiver: string;
  amount: number;
  fee: number;
  status: "completed" | "pending" | "processing";
  date: string;
  // Extended details for booking transactions
  bookingDetails?: {
    bookingId: string;
    family: string;
    familyEmail: string;
    caregiverEmail: string;
    careRecipient: string;
    services: string[];
    duration: number;
    hourlyRate: number;
    location: string;
    startTime: string;
    endTime: string;
    notes?: string;
  };
}

const recentTransactions: Transaction[] = [
  {
    id: "t-1",
    type: "booking",
    description: "Booking Payment - Johnson Family",
    caregiver: "Maria Rodriguez",
    amount: 245.0,
    fee: 24.5,
    status: "completed",
    date: "2024-03-01T14:30:00",
    bookingDetails: {
      bookingId: "BK-2024-1234",
      family: "Johnson Family",
      familyEmail: "johnson@email.com",
      caregiverEmail: "maria.r@email.com",
      careRecipient: "Robert Johnson (Father)",
      services: ["Personal Care", "Medication Management", "Companionship"],
      duration: 5,
      hourlyRate: 45,
      location: "Seattle, WA 98101",
      startTime: "2024-03-01T09:00:00",
      endTime: "2024-03-01T14:00:00",
      notes: "Requires assistance with mobility and medication schedule.",
    },
  },
  {
    id: "t-2",
    type: "payout",
    description: "Payroll",
    caregiver: "David Kim",
    amount: -520.0,
    fee: 0,
    status: "completed",
    date: "2024-03-01T12:00:00",
  },
  {
    id: "t-3",
    type: "booking",
    description: "Booking Payment - Smith Family",
    caregiver: "Sarah Thompson",
    amount: 180.0,
    fee: 18.0,
    status: "completed",
    date: "2024-03-01T10:15:00",
    bookingDetails: {
      bookingId: "BK-2024-1235",
      family: "Smith Family",
      familyEmail: "smith@email.com",
      caregiverEmail: "sarah.t@email.com",
      careRecipient: "Eleanor Smith (Mother)",
      services: ["Companionship", "Light Housekeeping"],
      duration: 4,
      hourlyRate: 40,
      location: "Bellevue, WA 98004",
      startTime: "2024-03-01T08:00:00",
      endTime: "2024-03-01T12:00:00",
    },
  },
  {
    id: "t-4",
    type: "refund",
    description: "Refund - Cancellation",
    caregiver: "James Lee",
    amount: -75.0,
    fee: -7.5,
    status: "completed",
    date: "2024-02-29T16:45:00",
  },
  {
    id: "t-5",
    type: "booking",
    description: "Booking Payment - Garcia Family",
    caregiver: "Emily Watson",
    amount: 320.0,
    fee: 32.0,
    status: "pending",
    date: "2024-02-29T14:20:00",
    bookingDetails: {
      bookingId: "BK-2024-1236",
      family: "Garcia Family",
      familyEmail: "garcia@email.com",
      caregiverEmail: "emily.w@email.com",
      careRecipient: "Manuel Garcia (Father)",
      services: ["Personal Care", "Meal Preparation", "Transportation"],
      duration: 8,
      hourlyRate: 38,
      location: "Tacoma, WA 98402",
      startTime: "2024-02-29T08:00:00",
      endTime: "2024-02-29T16:00:00",
      notes: "Needs transportation to doctor's appointment at 2pm.",
    },
  },
  {
    id: "t-6",
    type: "payout",
    description: "Payroll",
    caregiver: "Maria Rodriguez",
    amount: -890.0,
    fee: 0,
    status: "processing",
    date: "2024-02-29T09:00:00",
  },
];

export default function AdminFinancialsPage() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDetailsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financials</h1>
          <p className="text-muted-foreground">
            Track revenue, transactions, and payouts
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="march">
            <SelectTrigger className="w-[140px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="march">March 2024</SelectItem>
              <SelectItem value="february">February 2024</SelectItem>
              <SelectItem value="january">January 2024</SelectItem>
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
        {financialStats.map((stat) => {
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
                  <span className="text-muted-foreground">vs last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">Transaction</th>
                      <th className="pb-3 font-medium">Caregiver</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Platform Fee</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className={transaction.bookingDetails ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""}
                        onClick={() => transaction.bookingDetails && handleViewDetails(transaction)}
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <div>
                              <p className="font-medium text-foreground">
                                {transaction.description}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {transaction.id}
                              </p>
                            </div>
                            {transaction.bookingDetails && (
                              <ExternalLink className="h-3 w-3 text-muted-foreground" />
                            )}
                          </div>
                        </td>
                        <td className="py-4 text-sm">
                          {transaction.caregiver}
                        </td>
                        <td className="py-4">
                          <span
                            className={`font-medium ${
                              transaction.amount >= 0
                                ? "text-accent"
                                : "text-destructive"
                            }`}
                          >
                            {transaction.amount >= 0 ? "+" : ""}$
                            {Math.abs(transaction.amount).toFixed(2)}
                          </span>
                        </td>
                        <td className="py-4 text-sm">
                          {transaction.fee !== 0 && (
                            <span
                              className={
                                transaction.fee >= 0
                                  ? "text-accent"
                                  : "text-destructive"
                              }
                            >
                              {transaction.fee >= 0 ? "+" : ""}$
                              {Math.abs(transaction.fee).toFixed(2)}
                            </span>
                          )}
                          {transaction.fee === 0 && (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="py-4">
                          <Badge
                            variant={
                              transaction.status === "completed"
                                ? "default"
                                : transaction.status === "processing"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {transaction.status.charAt(0).toUpperCase() +
                              transaction.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-4 text-sm text-muted-foreground">
                          {formatDate(transaction.date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Service Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Personal Care", amount: 45230, percent: 35 },
                    { name: "Companionship", amount: 32450, percent: 25 },
                    { name: "Dementia Care", amount: 25980, percent: 20 },
                    { name: "Medical Care", amount: 15560, percent: 12 },
                    { name: "Other", amount: 10280, percent: 8 },
                  ].map((item) => (
                    <div key={item.name}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground">{item.name}</span>
                        <span className="font-medium">
                          ${item.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { month: "March 2024", amount: 42678, change: "+18%" },
                    { month: "February 2024", amount: 36145, change: "+12%" },
                    { month: "January 2024", amount: 32280, change: "+8%" },
                    { month: "December 2023", amount: 29890, change: "+15%" },
                    { month: "November 2023", amount: 25990, change: "+5%" },
                  ].map((item) => (
                    <div
                      key={item.month}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {item.month}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Platform fees collected
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          ${item.amount.toLocaleString()}
                        </p>
                        <p className="flex items-center gap-1 text-sm text-accent">
                          <TrendingUp className="h-3 w-3" />
                          {item.change}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Transaction Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Transaction Details
            </DialogTitle>
            <DialogDescription>
              {selectedTransaction?.bookingDetails?.bookingId} • {selectedTransaction && formatDate(selectedTransaction.date)}
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction?.bookingDetails && (
            <div className="space-y-6">
              {/* Amount Summary */}
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-xl font-bold text-accent">
                      ${selectedTransaction.amount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Platform Fee</p>
                    <p className="text-xl font-bold text-primary">
                      ${selectedTransaction.fee.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payroll</p>
                    <p className="text-xl font-bold text-foreground">
                      ${(selectedTransaction.amount - selectedTransaction.fee).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">FAMILY</p>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{selectedTransaction.bookingDetails.family}</p>
                        <p className="text-xs text-muted-foreground">{selectedTransaction.bookingDetails.familyEmail}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">CARE RECIPIENT</p>
                    <p className="text-sm">{selectedTransaction.bookingDetails.careRecipient}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">CAREGIVER</p>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{selectedTransaction.caregiver}</p>
                        <p className="text-xs text-muted-foreground">{selectedTransaction.bookingDetails.caregiverEmail}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">LOCATION</p>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <p className="text-sm">{selectedTransaction.bookingDetails.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">SERVICES RENDERED</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTransaction.bookingDetails.services.map((service) => (
                    <Badge key={service} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Time & Rate */}
              <div className="grid grid-cols-2 gap-4 rounded-lg border border-border p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Start Time</span>
                    <span className="text-sm font-medium">{formatTime(selectedTransaction.bookingDetails.startTime)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">End Time</span>
                    <span className="text-sm font-medium">{formatTime(selectedTransaction.bookingDetails.endTime)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Duration</span>
                    <span className="text-sm font-medium">{selectedTransaction.bookingDetails.duration} hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Hourly Rate</span>
                    <span className="text-sm font-medium">${selectedTransaction.bookingDetails.hourlyRate}/hr</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedTransaction.bookingDetails.notes && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">BOOKING NOTES</p>
                  <p className="text-sm text-muted-foreground rounded-lg border border-border bg-muted/50 p-3">
                    {selectedTransaction.bookingDetails.notes}
                  </p>
                </div>
              )}

              {/* Status */}
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-sm text-muted-foreground">Transaction Status</span>
                <Badge
                  variant={
                    selectedTransaction.status === "completed"
                      ? "default"
                      : selectedTransaction.status === "processing"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {selectedTransaction.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                  {selectedTransaction.status === "processing" && <Clock className="h-3 w-3 mr-1" />}
                  {selectedTransaction.status === "pending" && <AlertCircle className="h-3 w-3 mr-1" />}
                  {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
