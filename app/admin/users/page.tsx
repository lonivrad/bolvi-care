"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";
import {
  Search,
  Download,
  Users,
  Heart,
  Star,
  Calendar,
  DollarSign,
  MoreHorizontal,
  Eye,
  Edit,
  Ban,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Shield,
  MessageSquare,
  FileText,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "family" | "caregiver";
  status: "active" | "pending" | "suspended" | "inactive";
  verified: boolean;
  photo: string;
  joinedAt: string;
  lastActive: string;
  location: string;
  stats: {
    bookings: number;
    spent?: number;
    earned?: number;
    rating?: number;
    reviews: number;
  };
  verification?: {
    background: boolean;
    identity: boolean;
    references: boolean;
  };
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(206) 555-1234",
    type: "family",
    status: "active",
    verified: true,
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    joinedAt: "2023-06-15",
    lastActive: "2024-01-15T16:30:00Z",
    location: "Seattle, WA",
    stats: {
      bookings: 24,
      spent: 4560,
      reviews: 18,
    },
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "(206) 555-5678",
    type: "caregiver",
    status: "active",
    verified: true,
    photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop",
    joinedAt: "2023-03-20",
    lastActive: "2024-01-15T15:45:00Z",
    location: "Seattle, WA",
    stats: {
      bookings: 156,
      earned: 23400,
      rating: 4.9,
      reviews: 89,
    },
    verification: {
      background: true,
      identity: true,
      references: true,
    },
  },
  {
    id: "3",
    name: "Robert Chen",
    email: "robert.chen@email.com",
    phone: "(425) 555-9012",
    type: "family",
    status: "active",
    verified: true,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    joinedAt: "2023-09-10",
    lastActive: "2024-01-14T10:00:00Z",
    location: "Bellevue, WA",
    stats: {
      bookings: 8,
      spent: 1240,
      reviews: 6,
    },
  },
  {
    id: "4",
    name: "James Wilson",
    email: "james.wilson@email.com",
    phone: "(253) 555-3456",
    type: "caregiver",
    status: "pending",
    verified: false,
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    joinedAt: "2024-01-10",
    lastActive: "2024-01-15T12:00:00Z",
    location: "Tacoma, WA",
    stats: {
      bookings: 0,
      earned: 0,
      rating: 0,
      reviews: 0,
    },
    verification: {
      background: false,
      identity: true,
      references: false,
    },
  },
  {
    id: "5",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "(360) 555-7890",
    type: "family",
    status: "suspended",
    verified: true,
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    joinedAt: "2023-05-22",
    lastActive: "2024-01-05T08:30:00Z",
    location: "Vancouver, WA",
    stats: {
      bookings: 3,
      spent: 450,
      reviews: 2,
    },
  },
  {
    id: "6",
    name: "Patricia Lee",
    email: "patricia.lee@email.com",
    phone: "(425) 555-2345",
    type: "caregiver",
    status: "active",
    verified: true,
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
    joinedAt: "2023-07-08",
    lastActive: "2024-01-15T14:20:00Z",
    location: "Kirkland, WA",
    stats: {
      bookings: 98,
      earned: 14700,
      rating: 4.8,
      reviews: 67,
    },
    verification: {
      background: true,
      identity: true,
      references: true,
    },
  },
];

const userStats = {
  totalUsers: 16197,
  families: 12847,
  caregivers: 3350,
  newThisMonth: 842,
  activeToday: 2847,
  pendingVerification: 45,
};

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    const matchesType = typeFilter === "all" || user.type === typeFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: User["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Active</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Pending</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
    }
  };

  const viewUserDetails = (user: User) => {
    setSelectedUser(user);
    setDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage families, caregivers, and user accounts</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Users
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold">{userStats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-bold">{userStats.families.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Families</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-pink-500/10 p-2">
                <Heart className="h-4 w-4 text-pink-600" />
              </div>
              <div>
                <p className="text-xl font-bold">{userStats.caregivers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Caregivers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-green-500/10 p-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xl font-bold">+{userStats.newThisMonth}</p>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-orange-500/10 p-2">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-xl font-bold">{userStats.activeToday.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Active Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-yellow-500/10 p-2">
                <Shield className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-xl font-bold">{userStats.pendingVerification}</p>
                <p className="text-xs text-muted-foreground">Pending Verify</p>
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
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="User Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="family">Families</SelectItem>
                <SelectItem value="caregiver">Caregivers</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Users</CardTitle>
            <Badge variant="secondary">{filteredUsers.length} results</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-lg border mx-6 mb-6 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                  <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium hidden sm:table-cell">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium hidden lg:table-cell">Location</th>
                  <th className="px-4 py-3 text-left text-sm font-medium hidden xl:table-cell">Stats</th>
                  <th className="px-4 py-3 text-left text-sm font-medium hidden lg:table-cell">Last Active</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b last:border-b-0 hover:bg-muted/50 cursor-pointer" onClick={() => viewUserDetails(user)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.photo}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm hover:text-primary hover:underline">{user.name}</p>
                            {user.verified && (
                              <CheckCircle className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Badge variant="outline" className="capitalize">
                        {user.type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">{user.location}</span>
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {user.stats.bookings}
                        </span>
                        {user.stats.rating && (
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            {user.stats.rating}
                          </span>
                        )}
                        {user.stats.spent && (
                          <span className="flex items-center gap-1 text-muted-foreground">
                            ${user.stats.spent.toLocaleString()}
                          </span>
                        )}
                        {user.stats.earned && (
                          <span className="flex items-center gap-1 text-green-600">
                            ${user.stats.earned.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {new Date(user.lastActive).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => viewUserDetails(user)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            View Messages
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            View Bookings
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.status === "active" ? (
                            <DropdownMenuItem className="text-destructive">
                              <Ban className="mr-2 h-4 w-4" />
                              Suspend User
                            </DropdownMenuItem>
                          ) : user.status === "suspended" ? (
                            <DropdownMenuItem>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Reactivate User
                            </DropdownMenuItem>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* User Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start gap-4">
                <img
                  src={selectedUser.photo}
                  alt={selectedUser.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{selectedUser.name}</h3>
                    {selectedUser.verified && (
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="capitalize">
                      {selectedUser.type}
                    </Badge>
                    {getStatusBadge(selectedUser.status)}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Contact Information</h4>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {selectedUser.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {selectedUser.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {selectedUser.location}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Statistics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-xl font-bold">{selectedUser.stats.bookings}</p>
                    <p className="text-xs text-muted-foreground">Bookings</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-xl font-bold">{selectedUser.stats.reviews}</p>
                    <p className="text-xs text-muted-foreground">Reviews</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    {selectedUser.stats.rating ? (
                      <>
                        <p className="text-xl font-bold">{selectedUser.stats.rating}</p>
                        <p className="text-xs text-muted-foreground">Rating</p>
                      </>
                    ) : selectedUser.stats.spent ? (
                      <>
                        <p className="text-xl font-bold">${selectedUser.stats.spent}</p>
                        <p className="text-xs text-muted-foreground">Spent</p>
                      </>
                    ) : (
                      <>
                        <p className="text-xl font-bold">-</p>
                        <p className="text-xs text-muted-foreground">N/A</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Verification (for caregivers) */}
              {selectedUser.verification && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Verification Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded border">
                      <span className="text-sm">Fully Vetted</span>
                      {selectedUser.verification.background ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-2 rounded border">
                      <span className="text-sm">Identity Verification</span>
                      {selectedUser.verification.identity ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-2 rounded border">
                      <span className="text-sm">References</span>
                      {selectedUser.verification.references ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-muted-foreground">Member Since</p>
                  <p className="text-sm">{new Date(selectedUser.joinedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Active</p>
                  <p className="text-sm">{new Date(selectedUser.lastActive).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
          {selectedUser && selectedUser.type === "caregiver" && (
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
                Close
              </Button>
              <Button asChild>
                <Link href={`/caregivers/${selectedUser.id}`} target="_blank">
                  <Eye className="mr-2 h-4 w-4" />
                  View Full Profile
                </Link>
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
