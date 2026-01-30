"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Calendar,
  Clock,
  Download,
  ArrowUpRight,
  Wallet,
  Calculator,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EarningsCalculator } from "@/components/earnings/earnings-calculator";

const earningsData = {
  available: 1245,
  pending: 312,
  thisWeek: 847,
  thisMonth: 3240,
  lastMonth: 2980,
};

const transactions = [
  { id: "1", type: "payment", description: "Visit - Johnson Family", amount: 140, date: "2025-01-28", status: "completed" },
  { id: "2", type: "payment", description: "Visit - Martinez Family", amount: 120, date: "2025-01-27", status: "completed" },
  { id: "3", type: "payout", description: "Bank Transfer", amount: -500, date: "2025-01-25", status: "completed" },
  { id: "4", type: "payment", description: "Visit - Chen Family", amount: 175, date: "2025-01-24", status: "pending" },
  { id: "5", type: "payment", description: "Visit - Williams Family", amount: 95, date: "2025-01-23", status: "completed" },
];

const weeklyData = [
  { day: "Mon", amount: 140 },
  { day: "Tue", amount: 95 },
  { day: "Wed", amount: 175 },
  { day: "Thu", amount: 120 },
  { day: "Fri", amount: 200 },
  { day: "Sat", amount: 0 },
  { day: "Sun", amount: 117 },
];

export default function EarningsPage() {
  const [period, setPeriod] = useState("week");
  const [activeTab, setActiveTab] = useState("overview");
  const maxAmount = Math.max(...weeklyData.map((d) => d.amount));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Earnings</h1>
          <p className="mt-1 text-muted-foreground">
            Track your income, manage payouts, and plan your earnings
          </p>
        </div>
        <Button>
          <Wallet className="mr-2 h-4 w-4" />
          Request Payout
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="overview">
            <DollarSign className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="calculator">
            <Calculator className="mr-2 h-4 w-4" />
            Earnings Calculator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">

          {/* Balance Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-primary bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <p className="mt-2 text-3xl font-bold">${earningsData.available}</p>
                <Button variant="link" className="mt-2 h-auto p-0 text-primary">
                  Withdraw funds <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mt-2 text-3xl font-bold">${earningsData.pending}</p>
                <p className="mt-2 text-xs text-muted-foreground">Clears in 2-3 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <TrendingUp className="h-4 w-4 text-accent" />
                </div>
                <p className="mt-2 text-3xl font-bold">${earningsData.thisWeek}</p>
                <p className="mt-2 text-xs text-accent">+15% vs last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mt-2 text-3xl font-bold">${earningsData.thisMonth}</p>
                <p className="mt-2 text-xs text-accent">+8% vs last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Earnings Overview</CardTitle>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="flex h-48 items-end gap-2">
                {weeklyData.map((day) => (
                  <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
                    <div className="relative w-full">
                      <div
                        className={cn(
                          "w-full rounded-t-sm bg-primary transition-all",
                          day.amount === 0 && "bg-muted"
                        )}
                        style={{ height: `${(day.amount / maxAmount) * 160}px` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{day.day}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Transaction History</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full",
                          tx.type === "payment"
                            ? "bg-accent/10 text-accent"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <DollarSign className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{tx.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(tx.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          "font-semibold",
                          tx.amount > 0 ? "text-accent" : "text-foreground"
                        )}
                      >
                        {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount)}
                      </p>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs",
                          tx.status === "completed"
                            ? "bg-accent/10 text-accent"
                            : "bg-secondary/10 text-secondary"
                        )}
                      >
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator">
          <EarningsCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
