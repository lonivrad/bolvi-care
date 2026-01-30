"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  DollarSign,
  User,
  MapPin,
  RefreshCw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Mock bookings data for admin view
const adminBookings = [
  {
    id: "BK-001",
    family: { name: "Johnson Family", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
    caregiver: { name: "Maria Rodriguez", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop" },
    recipient: "Eleanor Johnson",
    date: "2024-01-25",
    time: "9:00 AM - 1:00 PM",
    duration: 4,
    services: ["Companionship", "Medication Reminders"],
    status: "confirmed",
    amount: 140,
    location: "Seattle, WA",
  },
  {
    id: "BK-002",
    family: { name: "Chen Family", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
    caregiver: { name: "David Kim", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
    recipient: "Robert Chen",
    date: "2024-01-25",
    time: "2:00 PM - 6:00 PM",
    duration: 4,
    services: ["Physical Therapy Support", "Personal Care"],
    status: "in-progress",
    amount: 160,
    location: "Bellevue, WA",
  },
  {
    id: "BK-003",
    family: { name: "Martinez Family", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" },
    caregiver: { name: "Sarah Thompson", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" },
    recipient: "Rosa Martinez",
    date: "2024-01-24",
    time: "10:00 AM - 2:00 PM",
    duration: 4,
    services: ["Dementia Care", "Meal Prep"],
    status: "completed",
    amount: 180,
    location: "Tacoma, WA",
  },
  {
    id: "BK-004",
    family: { name: "Williams Family", photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop" },
    caregiver: { name: "Emily Chen", photo: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop" },
    recipient: "James Williams",
    date: "2024-01-26",
    time: "8:00 AM - 12:00 PM",
    duration: 4,
    services: ["Companionship", "Transportation"],
    status: "pending",
    amount: 120,
    location: "Kirkland, WA",
  },
  {
    id: "BK-005",
    family: { name: "Garcia Family", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
    caregiver: { name: "Michael Johnson", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
    recipient: "Maria Garcia",
    date: "2024-01-23",
    time: "1:00 PM - 5:00 PM",
    duration: 4,
    services: ["Personal Care", "Light Housekeeping"],
    status: "cancelled",
    amount: 152,
    location: "Seattle, WA",
  },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  "in-progress": { label: "In Progress", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  completed: { label: "Completed", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

export default function AdminBookingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const filteredBookings = adminBookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.family.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.caregiver.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    const matchesTab = activeTab === "all" || booking.status === activeTab;
    return matchesSearch && matchesStatus && matchesTab;
  });

  const stats = {
    total: adminBookings.length,
    pending: adminBookings.filter((b) => b.status === "pending").length,
    confirmed: adminBookings.filter((b) => b.status === "confirmed").length,
    inProgress: adminBookings.filter((b) => b.status === "in-progress").length,
    completed: adminBookings.filter((b) => b.status === "completed").length,
    cancelled: adminBookings.filter((b) => b.status === "cancelled").length,
    totalRevenue: adminBookings.filter((b) => b.status === "completed").reduce((sum, b) => sum + b.amount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bookings Management</h1>
          <p className="text-muted-foreground">View and manage all platform bookings</p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-purple-600">{stats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue (Completed)</p>
                <p className="text-2xl font-bold text-green-600">${stats.totalRevenue}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by booking ID, family, or caregiver..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
              <TabsTrigger value="in-progress">Active ({stats.inProgress})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-1">No bookings found</h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  No bookings match your current filters. Try adjusting your search criteria or date range.
                </p>
                <Button variant="outline" className="mt-4" onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}>
                  Clear filters
                </Button>
              </div>
            ) : (
              filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors sm:flex-row sm:items-center"
                >
                  {/* Booking ID & Status */}
                  <div className="flex items-center gap-3 sm:w-32">
                    <div>
                      <p className="font-mono text-sm font-medium">{booking.id}</p>
                      <Badge className={cn("mt-1", statusConfig[booking.status].color)}>
                        {statusConfig[booking.status].label}
                      </Badge>
                    </div>
                  </div>

                  {/* Participants */}
                  <div className="flex-1 grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <Image
                        src={booking.family.photo}
                        alt={booking.family.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium">{booking.family.name}</p>
                        <p className="text-xs text-muted-foreground">For: {booking.recipient}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Image
                        src={booking.caregiver.photo}
                        alt={booking.caregiver.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium">{booking.caregiver.name}</p>
                        <p className="text-xs text-muted-foreground">Caregiver</p>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground sm:w-48">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {booking.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {booking.duration}h
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {booking.location}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right sm:w-24">
                    <p className="font-semibold">${booking.amount}</p>
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {booking.status === "pending" && (
                        <>
                          <DropdownMenuItem className="text-green-600">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem>
                        <User className="h-4 w-4 mr-2" />
                        Contact Family
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
