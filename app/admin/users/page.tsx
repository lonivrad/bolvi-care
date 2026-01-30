"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  MoreVertical,
  User,
  Heart,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

const users = [
  {
    id: "u-1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    type: "family",
    status: "active",
    verified: true,
    joined: "Jan 15, 2024",
    bookings: 12,
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: "u-2",
    name: "Maria Rodriguez",
    email: "maria.rodriguez@email.com",
    phone: "(555) 234-5678",
    type: "caregiver",
    status: "active",
    verified: true,
    joined: "Dec 3, 2023",
    bookings: 48,
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
  },
  {
    id: "u-3",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "(555) 345-6789",
    type: "family",
    status: "active",
    verified: true,
    joined: "Feb 20, 2024",
    bookings: 5,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  },
  {
    id: "u-4",
    name: "David Kim",
    email: "david.kim@email.com",
    phone: "(555) 456-7890",
    type: "caregiver",
    status: "pending",
    verified: false,
    joined: "Mar 1, 2024",
    bookings: 0,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    id: "u-5",
    name: "Emily Watson",
    email: "emily.watson@email.com",
    phone: "(555) 567-8901",
    type: "caregiver",
    status: "suspended",
    verified: true,
    joined: "Nov 10, 2023",
    bookings: 23,
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
  {
    id: "u-6",
    name: "Michael Brown",
    email: "michael.brown@email.com",
    phone: "(555) 678-9012",
    type: "family",
    status: "active",
    verified: true,
    joined: "Jan 28, 2024",
    bookings: 8,
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  },
];

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || user.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground">
          View and manage all platform users
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Users</span>
            </div>
            <p className="mt-2 text-2xl font-bold">12,847</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Families</span>
            </div>
            <p className="mt-2 text-2xl font-bold">8,234</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-secondary" />
              <span className="text-sm text-muted-foreground">Caregivers</span>
            </div>
            <p className="mt-2 text-2xl font-bold">4,613</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-muted-foreground">
                Pending Verification
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold">127</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
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
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">User</th>
                  <th className="pb-3 font-medium">Contact</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Joined</th>
                  <th className="pb-3 font-medium">Bookings</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.photo}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">
                              {user.name}
                            </p>
                            {user.verified && (
                              <CheckCircle className="h-4 w-4 text-accent" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            ID: {user.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge
                        variant={
                          user.type === "caregiver" ? "secondary" : "outline"
                        }
                      >
                        {user.type === "caregiver" ? (
                          <Heart className="mr-1 h-3 w-3" />
                        ) : (
                          <User className="mr-1 h-3 w-3" />
                        )}
                        {user.type === "caregiver" ? "Caregiver" : "Family"}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <Badge
                        variant={
                          user.status === "active"
                            ? "default"
                            : user.status === "pending"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {user.status === "active" ? (
                          <CheckCircle className="mr-1 h-3 w-3" />
                        ) : user.status === "pending" ? (
                          <AlertCircle className="mr-1 h-3 w-3" />
                        ) : (
                          <XCircle className="mr-1 h-3 w-3" />
                        )}
                        {user.status.charAt(0).toUpperCase() +
                          user.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {user.joined}
                      </div>
                    </td>
                    <td className="py-4">
                      <p className="text-sm font-medium">{user.bookings}</p>
                    </td>
                    <td className="py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit User</DropdownMenuItem>
                          <DropdownMenuItem>View Bookings</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            {user.status === "suspended"
                              ? "Reactivate"
                              : "Suspend User"}
                          </DropdownMenuItem>
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
    </div>
  );
}
