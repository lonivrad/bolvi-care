"use client";

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
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  CreditCard,
  Wallet,
  PiggyBank,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

const financialStats = [
  {
    title: "Total Revenue",
    value: "$1,284,521",
    change: "+23.1%",
    trend: "up",
    icon: DollarSign,
    description: "All time platform revenue",
  },
  {
    title: "Platform Fees (MTD)",
    value: "$42,678",
    change: "+18.4%",
    trend: "up",
    icon: PiggyBank,
    description: "This month's earnings",
  },
  {
    title: "Pending Payouts",
    value: "$28,450",
    change: "-5.2%",
    trend: "down",
    icon: Wallet,
    description: "Awaiting processing",
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

const recentTransactions = [
  {
    id: "t-1",
    type: "booking",
    description: "Booking Payment - Johnson Family",
    caregiver: "Maria Rodriguez",
    amount: 245.0,
    fee: 24.5,
    status: "completed",
    date: "2024-03-01T14:30:00",
  },
  {
    id: "t-2",
    type: "payout",
    description: "Caregiver Payout",
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
  },
  {
    id: "t-6",
    type: "payout",
    description: "Caregiver Payout",
    caregiver: "Maria Rodriguez",
    amount: -890.0,
    fee: 0,
    status: "processing",
    date: "2024-02-29T09:00:00",
  },
];

const pendingPayouts = [
  {
    id: "p-1",
    caregiver: "Maria Rodriguez",
    email: "maria.rodriguez@email.com",
    amount: 1250.0,
    bookings: 8,
    lastPayout: "Feb 22, 2024",
    status: "ready",
  },
  {
    id: "p-2",
    caregiver: "David Kim",
    email: "david.kim@email.com",
    amount: 680.0,
    bookings: 4,
    lastPayout: "Feb 25, 2024",
    status: "ready",
  },
  {
    id: "p-3",
    caregiver: "Sarah Thompson",
    email: "sarah.thompson@email.com",
    amount: 420.0,
    bookings: 3,
    lastPayout: "Feb 28, 2024",
    status: "processing",
  },
  {
    id: "p-4",
    caregiver: "James Lee",
    email: "james.lee@email.com",
    amount: 890.0,
    bookings: 6,
    lastPayout: "Feb 20, 2024",
    status: "ready",
  },
];

export default function AdminFinancialsPage() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
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
          <TabsTrigger value="payouts">Pending Payouts</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Breakdown</TabsTrigger>
          <TabsTrigger value="taxes">Tax Documents</TabsTrigger>
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
                      <tr key={transaction.id}>
                        <td className="py-4">
                          <div>
                            <p className="font-medium text-foreground">
                              {transaction.description}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {transaction.id}
                            </p>
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

        <TabsContent value="payouts" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pending Payouts</CardTitle>
              <Button>
                <DollarSign className="mr-2 h-4 w-4" />
                Process All Ready
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">Caregiver</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Bookings</th>
                      <th className="pb-3 font-medium">Last Payout</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {pendingPayouts.map((payout) => (
                      <tr key={payout.id}>
                        <td className="py-4">
                          <div>
                            <p className="font-medium text-foreground">
                              {payout.caregiver}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {payout.email}
                            </p>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-lg font-semibold text-foreground">
                            ${payout.amount.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-4 text-sm">{payout.bookings}</td>
                        <td className="py-4 text-sm text-muted-foreground">
                          {payout.lastPayout}
                        </td>
                        <td className="py-4">
                          <Badge
                            variant={
                              payout.status === "ready"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {payout.status === "ready"
                              ? "Ready"
                              : "Processing"}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={payout.status === "processing"}
                          >
                            Process
                          </Button>
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

        <TabsContent value="taxes" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  1099 Form Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">1099-NEC Forms Generated</p>
                        <p className="text-sm text-muted-foreground">Tax Year 2023</p>
                      </div>
                    </div>
                    <Badge variant="secondary">342 Forms</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900/30">
                        <Clock className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium">Pending Tax ID Verification</p>
                        <p className="text-sm text-muted-foreground">Caregivers needing W-9</p>
                      </div>
                    </div>
                    <Badge variant="outline">12 Pending</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">1099 Threshold Met</p>
                        <p className="text-sm text-muted-foreground">Caregivers earning $600+</p>
                      </div>
                    </div>
                    <Badge>287 Caregivers</Badge>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export All 1099 Forms
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tax Reporting Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Total Caregiver Earnings (2023)", value: "$2,847,320", icon: DollarSign },
                    { label: "Platform Fees Collected", value: "$426,098", icon: PiggyBank },
                    { label: "Total 1099 Reportable", value: "$2,421,222", icon: FileText },
                    { label: "Caregivers Below $600 Threshold", value: "55", icon: AlertCircle },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <span className="font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Tax Document Activity</CardTitle>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left text-sm text-muted-foreground">
                        <th className="pb-3 font-medium">Caregiver</th>
                        <th className="pb-3 font-medium">Document</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {[
                        { name: "Maria Rodriguez", doc: "1099-NEC", amount: "$18,450", status: "sent", date: "Jan 31, 2024" },
                        { name: "David Kim", doc: "1099-NEC", amount: "$12,320", status: "sent", date: "Jan 31, 2024" },
                        { name: "Sarah Thompson", doc: "W-9", amount: "—", status: "pending", date: "Feb 15, 2024" },
                        { name: "James Lee", doc: "1099-NEC", amount: "$8,750", status: "sent", date: "Jan 31, 2024" },
                        { name: "Emily Watson", doc: "1099-NEC", amount: "$15,890", status: "downloaded", date: "Feb 2, 2024" },
                      ].map((item) => (
                        <tr key={item.name}>
                          <td className="py-3 font-medium">{item.name}</td>
                          <td className="py-3 text-sm">{item.doc}</td>
                          <td className="py-3 text-sm">{item.amount}</td>
                          <td className="py-3">
                            <Badge variant={item.status === "sent" || item.status === "downloaded" ? "default" : "secondary"}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 text-sm text-muted-foreground">{item.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
