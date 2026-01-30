"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Star,
  Search,
  Filter,
  Flag,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  TrendingUp,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  reviewerName: string;
  reviewerPhoto: string;
  reviewerType: "family" | "caregiver";
  subjectName: string;
  subjectPhoto: string;
  rating: number;
  content: string;
  bookingId: string;
  createdAt: string;
  status: "pending" | "approved" | "flagged" | "removed";
  flagReason?: string;
  helpful: number;
  reported: number;
}

const reviews: Review[] = [
  {
    id: "REV001",
    reviewerName: "Sarah Johnson",
    reviewerPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    reviewerType: "family",
    subjectName: "Maria Rodriguez",
    subjectPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5,
    content: "Maria was absolutely wonderful with my mother. She arrived on time, was very professional, and my mom loved spending time with her. She helped with meal preparation and light housekeeping. Highly recommend!",
    bookingId: "BK1234",
    createdAt: "2024-03-03T14:30:00",
    status: "pending",
    helpful: 12,
    reported: 0,
  },
  {
    id: "REV002",
    reviewerName: "David Kim",
    reviewerPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    reviewerType: "caregiver",
    subjectName: "The Thompson Family",
    subjectPhoto: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
    rating: 5,
    content: "Great family to work with. Clear communication, flexible scheduling, and very respectful. The care recipient was a joy to spend time with.",
    bookingId: "BK1235",
    createdAt: "2024-03-02T10:15:00",
    status: "approved",
    helpful: 8,
    reported: 0,
  },
  {
    id: "REV003",
    reviewerName: "Anonymous User",
    reviewerPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    reviewerType: "family",
    subjectName: "James Wilson",
    subjectPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    rating: 2,
    content: "Caregiver was late twice and seemed distracted during visits. Would not recommend.",
    bookingId: "BK1236",
    createdAt: "2024-03-01T16:45:00",
    status: "flagged",
    flagReason: "Potentially unfair review - disputes visit logs",
    helpful: 2,
    reported: 3,
  },
  {
    id: "REV004",
    reviewerName: "Emily Chen",
    reviewerPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    reviewerType: "family",
    subjectName: "Sarah Thompson",
    subjectPhoto: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop",
    rating: 4,
    content: "Sarah is very caring and attentive. She connected well with my father and helped him with his daily exercises. Only giving 4 stars because of some scheduling conflicts.",
    bookingId: "BK1237",
    createdAt: "2024-02-28T09:00:00",
    status: "approved",
    helpful: 15,
    reported: 0,
  },
  {
    id: "REV005",
    reviewerName: "Spam Account",
    reviewerPhoto: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop",
    reviewerType: "family",
    subjectName: "Test Caregiver",
    subjectPhoto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
    rating: 1,
    content: "This is spam content that needs to be removed!!!",
    bookingId: "BK0000",
    createdAt: "2024-02-27T23:59:00",
    status: "removed",
    flagReason: "Spam/fake review",
    helpful: 0,
    reported: 12,
  },
];

const stats = [
  { label: "Total Reviews", value: "2,847", change: "+12%", icon: MessageSquare },
  { label: "Avg. Rating", value: "4.72", change: "+0.05", icon: Star },
  { label: "Pending Review", value: "23", change: "-5", icon: Flag },
  { label: "Flagged", value: "8", change: "-2", icon: AlertTriangle },
];

const ratingDistribution = [
  { stars: 5, count: 1856, percentage: 65 },
  { stars: 4, count: 571, percentage: 20 },
  { stars: 3, count: 285, percentage: 10 },
  { stars: 2, count: 85, percentage: 3 },
  { stars: 1, count: 50, percentage: 2 },
];

export default function AdminReviewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.reviewerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || review.status === statusFilter;
    const matchesRating = ratingFilter === "all" || review.rating === parseInt(ratingFilter);
    return matchesSearch && matchesStatus && matchesRating;
  });

  const getStatusBadge = (status: Review["status"]) => {
    const styles = {
      pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      flagged: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      removed: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    };
    return (
      <Badge variant="secondary" className={cn("capitalize", styles[status])}>
        {status}
      </Badge>
    );
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-4 w-4",
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Reviews Management</h1>
          <p className="text-muted-foreground">Monitor and moderate platform reviews</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
                <div className="mt-2 text-sm text-green-600">{stat.change} this month</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm font-medium">{item.stars}</span>
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Review Queue</CardTitle>
            <CardDescription>Reviews requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviews
                .filter((r) => r.status === "pending" || r.status === "flagged")
                .slice(0, 3)
                .map((review) => (
                  <div key={review.id} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                    <Image
                      src={review.reviewerPhoto}
                      alt={review.reviewerName}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{review.reviewerName}</span>
                        {renderStars(review.rating)}
                        {getStatusBadge(review.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {review.content}
                      </p>
                      {review.flagReason && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {review.flagReason}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <XCircle className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search reviews..."
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
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                  <SelectItem value="removed">Removed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Image
                  src={review.reviewerPhoto}
                  alt={review.reviewerName}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{review.reviewerName}</span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {review.reviewerType}
                    </Badge>
                    <span className="text-muted-foreground">reviewed</span>
                    <span className="font-medium">{review.subjectName}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    {renderStars(review.rating)}
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    {getStatusBadge(review.status)}
                  </div>
                  <p className="mt-3 text-muted-foreground">{review.content}</p>
                  {review.flagReason && (
                    <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50">
                      <p className="text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        <strong>Flag Reason:</strong> {review.flagReason}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center gap-4 mt-4">
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <ThumbsUp className="h-4 w-4" />
                      {review.helpful} helpful
                    </span>
                    {review.reported > 0 && (
                      <span className="flex items-center gap-1 text-sm text-red-600">
                        <Flag className="h-4 w-4" />
                        {review.reported} reports
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      Booking #{review.bookingId}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {review.status === "pending" && (
                    <>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                        <XCircle className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                    </>
                  )}
                  {review.status === "flagged" && (
                    <>
                      <Button size="sm" variant="outline">
                        <Eye className="mr-1 h-4 w-4" />
                        Investigate
                      </Button>
                      <Button size="sm" variant="destructive">
                        Remove
                      </Button>
                    </>
                  )}
                  {review.status === "approved" && (
                    <Button size="sm" variant="outline">
                      <Flag className="mr-1 h-4 w-4" />
                      Flag
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
