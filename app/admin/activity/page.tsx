"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Search,
  RefreshCw,
  UserPlus,
  UserMinus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  DollarSign,
  Star,
  Shield,
  MessageSquare,
  Calendar,
  Flag,
  Edit,
  Trash2,
  Eye,
  Download,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock activity data
const activities = [
  {
    id: "act-001",
    type: "user_signup",
    title: "New caregiver registered",
    description: "Jennifer Martinez completed registration",
    user: { name: "Jennifer Martinez", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" },
    timestamp: "2 minutes ago",
    icon: UserPlus,
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  {
    id: "act-002",
    type: "booking_completed",
    title: "Booking completed",
    description: "Johnson Family → Maria Rodriguez - 4 hour visit",
    user: { name: "Maria Rodriguez", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop" },
    timestamp: "5 minutes ago",
    icon: CheckCircle,
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    id: "act-003",
    type: "verification_approved",
    title: "Background check approved",
    description: "James Lee - All checks passed",
    user: { name: "James Lee", photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop" },
    timestamp: "12 minutes ago",
    icon: Shield,
    color: "text-emerald-500",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    id: "act-004",
    type: "dispute_opened",
    title: "New dispute opened",
    description: "Garcia Family vs Sarah Thompson - Billing issue",
    user: { name: "Garcia Family", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
    timestamp: "18 minutes ago",
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    id: "act-005",
    type: "payout_processed",
    title: "Payout processed",
    description: "Maria Rodriguez - $847.00 transferred",
    user: { name: "Maria Rodriguez", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop" },
    timestamp: "25 minutes ago",
    icon: DollarSign,
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  {
    id: "act-006",
    type: "review_posted",
    title: "5-star review posted",
    description: "Smith Family rated Emily Chen",
    user: { name: "Smith Family", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
    timestamp: "32 minutes ago",
    icon: Star,
    color: "text-amber-500",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    id: "act-007",
    type: "content_flagged",
    title: "Content flagged for review",
    description: "Review ID #4521 - Potential policy violation",
    user: { name: "System", photo: "" },
    timestamp: "45 minutes ago",
    icon: Flag,
    color: "text-red-500",
    bgColor: "bg-red-100 dark:bg-red-900/30",
  },
  {
    id: "act-008",
    type: "user_deactivated",
    title: "Account deactivated",
    description: "Robert Brown - Requested by user",
    user: { name: "Robert Brown", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
    timestamp: "1 hour ago",
    icon: UserMinus,
    color: "text-gray-500",
    bgColor: "bg-gray-100 dark:bg-gray-900/30",
  },
  {
    id: "act-009",
    type: "booking_cancelled",
    title: "Booking cancelled",
    description: "Williams Family cancelled upcoming visit",
    user: { name: "Williams Family", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" },
    timestamp: "1 hour ago",
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-100 dark:bg-red-900/30",
  },
  {
    id: "act-010",
    type: "profile_updated",
    title: "Profile updated",
    description: "David Kim updated availability schedule",
    user: { name: "David Kim", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" },
    timestamp: "2 hours ago",
    icon: Edit,
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    id: "act-011",
    type: "message_sent",
    title: "New message thread",
    description: "Chen Family started conversation with Linda Martinez",
    user: { name: "Chen Family", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
    timestamp: "2 hours ago",
    icon: MessageSquare,
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    id: "act-012",
    type: "booking_created",
    title: "New booking created",
    description: "Taylor Family booked with Patricia Adams",
    user: { name: "Taylor Family", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
    timestamp: "3 hours ago",
    icon: Calendar,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

const activityTypes = [
  { value: "all", label: "All Activities" },
  { value: "user_signup", label: "User Signups" },
  { value: "booking", label: "Bookings" },
  { value: "verification", label: "Verifications" },
  { value: "payout", label: "Payouts" },
  { value: "review", label: "Reviews" },
  { value: "dispute", label: "Disputes" },
  { value: "moderation", label: "Moderation" },
];

export default function AdminActivityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isLive, setIsLive] = useState(true);

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      typeFilter === "all" ||
      activity.type.includes(typeFilter) ||
      (typeFilter === "booking" && activity.type.includes("booking")) ||
      (typeFilter === "verification" && activity.type.includes("verification")) ||
      (typeFilter === "payout" && activity.type.includes("payout")) ||
      (typeFilter === "review" && activity.type.includes("review")) ||
      (typeFilter === "dispute" && activity.type.includes("dispute")) ||
      (typeFilter === "moderation" && activity.type.includes("flag"));
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Activity Log</h1>
          <p className="text-muted-foreground">Real-time platform activity and audit trail</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isLive ? "default" : "outline"}
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="gap-2"
          >
            <span className={cn("h-2 w-2 rounded-full", isLive ? "bg-green-500 animate-pulse" : "bg-gray-400")} />
            {isLive ? "Live" : "Paused"}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">1,247</p>
              <p className="text-sm text-muted-foreground">Events Today</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">+156</p>
              <p className="text-sm text-muted-foreground">New Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">342</p>
              <p className="text-sm text-muted-foreground">Bookings</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">7</p>
              <p className="text-sm text-muted-foreground">Flags</p>
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
                placeholder="Search activity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Recent Activity
            {isLive && <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No activities found matching your criteria</p>
              </div>
            ) : (
              filteredActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-lg transition-colors hover:bg-muted/50",
                      index === 0 && isLive && "bg-muted/30"
                    )}
                  >
                    <div className={cn("h-10 w-10 rounded-full flex items-center justify-center shrink-0", activity.bgColor)}>
                      <Icon className={cn("h-5 w-5", activity.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-foreground">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.timestamp}</span>
                      </div>
                      {activity.user.photo && (
                        <div className="mt-2 flex items-center gap-2">
                          <Image
                            src={activity.user.photo}
                            alt={activity.user.name}
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                          <span className="text-xs text-muted-foreground">{activity.user.name}</span>
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })
            )}
          </div>

          {/* Load More */}
          <div className="mt-6 text-center">
            <Button variant="outline">Load More</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
