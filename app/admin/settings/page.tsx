"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Settings,
  Users,
  Shield,
  Bell,
  Globe,
  DollarSign,
  Mail,
  Lock,
  Key,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  AlertTriangle,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Save,
  Sliders,
  FileText,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "moderator" | "support" | "analyst";
  status: "active" | "inactive" | "pending";
  lastActive: string;
  permissions: string[];
  avatar: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

const mockAdminUsers: AdminUser[] = [
  {
    id: "1",
    name: "Sarah Admin",
    email: "sarah@bolvicare.com",
    role: "super_admin",
    status: "active",
    lastActive: "2024-01-15T16:30:00Z",
    permissions: ["all"],
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    name: "James Moderator",
    email: "james@bolvicare.com",
    role: "moderator",
    status: "active",
    lastActive: "2024-01-15T15:00:00Z",
    permissions: ["moderation", "support", "read_users"],
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    name: "Emily Support",
    email: "emily@bolvicare.com",
    role: "support",
    status: "active",
    lastActive: "2024-01-15T14:45:00Z",
    permissions: ["support", "read_users", "read_bookings"],
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
  {
    id: "4",
    name: "Michael Analyst",
    email: "michael@bolvicare.com",
    role: "analyst",
    status: "inactive",
    lastActive: "2024-01-10T10:00:00Z",
    permissions: ["analytics", "reports"],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  },
];

const mockRoles: Role[] = [
  {
    id: "1",
    name: "Super Admin",
    description: "Full access to all platform features and settings",
    permissions: ["all"],
    userCount: 1,
  },
  {
    id: "2",
    name: "Admin",
    description: "Access to most admin features except system settings",
    permissions: ["users", "bookings", "support", "moderation", "analytics", "finance"],
    userCount: 2,
  },
  {
    id: "3",
    name: "Moderator",
    description: "Content moderation and user support capabilities",
    permissions: ["moderation", "support", "read_users"],
    userCount: 3,
  },
  {
    id: "4",
    name: "Support",
    description: "Customer support and ticket management",
    permissions: ["support", "read_users", "read_bookings"],
    userCount: 5,
  },
  {
    id: "5",
    name: "Analyst",
    description: "Read-only access to analytics and reports",
    permissions: ["analytics", "reports"],
    userCount: 2,
  },
];

const allPermissions = [
  { id: "users", label: "User Management", description: "Create, edit, and delete users" },
  { id: "read_users", label: "View Users", description: "View user profiles and data" },
  { id: "bookings", label: "Booking Management", description: "Manage bookings and schedules" },
  { id: "read_bookings", label: "View Bookings", description: "View booking data" },
  { id: "support", label: "Support", description: "Handle support tickets" },
  { id: "moderation", label: "Moderation", description: "Moderate content and reviews" },
  { id: "analytics", label: "Analytics", description: "View analytics dashboards" },
  { id: "reports", label: "Reports", description: "Generate and export reports" },
  { id: "finance", label: "Finance", description: "Access financial data and payouts" },
  { id: "settings", label: "Settings", description: "Modify platform settings" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [editRoleDialogOpen, setEditRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

  const getRoleBadge = (role: AdminUser["role"]) => {
    switch (role) {
      case "super_admin":
        return <Badge variant="destructive">Super Admin</Badge>;
      case "admin":
        return <Badge variant="default">Admin</Badge>;
      case "moderator":
        return <Badge variant="secondary">Moderator</Badge>;
      case "support":
        return <Badge variant="outline">Support</Badge>;
      case "analyst":
        return <Badge variant="outline">Analyst</Badge>;
    }
  };

  const getStatusBadge = (status: AdminUser["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Active</Badge>;
      case "inactive":
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-600 border-gray-500/20">Inactive</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">Manage platform settings, team access, and configurations</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
          <TabsTrigger value="general" className="gap-2">
            <Settings className="h-4 w-4 hidden sm:inline" />
            General
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2">
            <Users className="h-4 w-4 hidden sm:inline" />
            Team
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2">
            <Shield className="h-4 w-4 hidden sm:inline" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4 hidden sm:inline" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2">
            <Key className="h-4 w-4 hidden sm:inline" />
            API
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Platform Settings</CardTitle>
              <CardDescription>Configure general platform behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Platform Name</Label>
                  <Input defaultValue="Bolvi Care" />
                </div>
                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input defaultValue="support@bolvicare.com" />
                </div>
                <div className="space-y-2">
                  <Label>Default Timezone</Label>
                  <Select defaultValue="America/Los_Angeles">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default Currency</Label>
                  <Select defaultValue="USD">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Feature Flags</CardTitle>
              <CardDescription>Enable or disable platform features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New User Onboarding Flow</Label>
                  <p className="text-sm text-muted-foreground">Enable the new guided onboarding experience</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>AI-Powered Matching</Label>
                  <p className="text-sm text-muted-foreground">Use AI to suggest caregiver matches</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Instant Booking</Label>
                  <p className="text-sm text-muted-foreground">Allow families to book without caregiver approval</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Video Consultations</Label>
                  <p className="text-sm text-muted-foreground">Enable video chat between families and caregivers</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Temporarily disable the platform for maintenance</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Business Rules</CardTitle>
              <CardDescription>Configure platform policies and limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Platform Fee (%)</Label>
                  <Input type="number" defaultValue="15" />
                </div>
                <div className="space-y-2">
                  <Label>Minimum Booking Hours</Label>
                  <Input type="number" defaultValue="2" />
                </div>
                <div className="space-y-2">
                  <Label>Cancellation Window (hours)</Label>
                  <Input type="number" defaultValue="24" />
                </div>
                <div className="space-y-2">
                  <Label>Max Active Bookings per Caregiver</Label>
                  <Input type="number" defaultValue="5" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Management */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Admin Team</CardTitle>
                <CardDescription>Manage admin users and their access</CardDescription>
              </div>
              <Button onClick={() => setInviteDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Invite User
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                      <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">Role</th>
                      <th className="px-4 py-3 text-left text-sm font-medium hidden sm:table-cell">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium hidden lg:table-cell">Last Active</th>
                      <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAdminUsers.map((user) => (
                      <tr key={user.id} className="border-b last:border-b-0">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium text-sm">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell text-sm text-muted-foreground">
                          {new Date(user.lastActive).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
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

        {/* Roles & Permissions */}
        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Roles & Permissions</CardTitle>
                <CardDescription>Define access levels for admin users</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Role
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRoles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{role.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {role.userCount} users
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {role.permissions.slice(0, 4).map((perm) => (
                          <Badge key={perm} variant="outline" className="text-xs">
                            {perm === "all" ? "Full Access" : perm}
                          </Badge>
                        ))}
                        {role.permissions.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{role.permissions.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedRole(role);
                        setEditRoleDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Permission Reference</CardTitle>
              <CardDescription>Available permissions and their descriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {allPermissions.map((perm) => (
                  <div key={perm.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    <Shield className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">{perm.label}</p>
                      <p className="text-xs text-muted-foreground">{perm.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Admin Alerts</CardTitle>
              <CardDescription>Configure when admins receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-red-500/10 p-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Critical Incidents</p>
                    <p className="text-xs text-muted-foreground">Immediate notification for critical safety incidents</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-yellow-500/10 p-2">
                    <Shield className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">New Verifications</p>
                    <p className="text-xs text-muted-foreground">When background checks are ready for review</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-500/10 p-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Content Flagged</p>
                    <p className="text-xs text-muted-foreground">When AI flags content for review</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-500/10 p-2">
                    <DollarSign className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Large Transactions</p>
                    <p className="text-xs text-muted-foreground">For transactions over $1,000</p>
                  </div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-500/10 p-2">
                    <Clock className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Daily Summary</p>
                    <p className="text-xs text-muted-foreground">Daily digest of platform activity</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notification Channels</CardTitle>
              <CardDescription>How you receive admin notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">Email</p>
                    <p className="text-xs text-muted-foreground">admin@bolvicare.com</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">In-App Notifications</p>
                    <p className="text-xs text-muted-foreground">Show in admin dashboard</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">Slack Integration</p>
                    <p className="text-xs text-muted-foreground">#admin-alerts channel</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Settings */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">API Keys</CardTitle>
              <CardDescription>Manage API access for integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-sm">Production API Key</p>
                    <p className="text-xs text-muted-foreground">Created Jan 1, 2024</p>
                  </div>
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    value="sk_live_abc123xyz789...def456"
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Rotate Key
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive">
                    Revoke
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-sm">Test API Key</p>
                    <p className="text-xs text-muted-foreground">Created Jan 1, 2024</p>
                  </div>
                  <Badge variant="secondary">Test</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="password"
                    value="sk_test_abc123xyz789"
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button className="w-full" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create New API Key
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Webhooks</CardTitle>
              <CardDescription>Configure webhook endpoints for real-time events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">Booking Events</p>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                      Active
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  https://api.example.com/webhooks/bookings
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="outline" className="text-xs">booking.created</Badge>
                  <Badge variant="outline" className="text-xs">booking.updated</Badge>
                  <Badge variant="outline" className="text-xs">booking.cancelled</Badge>
                </div>
              </div>

              <div className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">Payment Events</p>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                      Active
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  https://api.example.com/webhooks/payments
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="outline" className="text-xs">payment.completed</Badge>
                  <Badge variant="outline" className="text-xs">payment.failed</Badge>
                  <Badge variant="outline" className="text-xs">payout.sent</Badge>
                </div>
              </div>

              <Button className="w-full" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Webhook Endpoint
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invite User Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Admin User</DialogTitle>
            <DialogDescription>
              Send an invitation to join the admin team
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input type="email" placeholder="user@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="analyst">Analyst</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Personal Message (optional)</Label>
              <Textarea placeholder="Add a personal note to the invitation..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setInviteDialogOpen(false)}>
              <Mail className="mr-2 h-4 w-4" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={editRoleDialogOpen} onOpenChange={setEditRoleDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Role: {selectedRole?.name}</DialogTitle>
            <DialogDescription>
              Modify permissions for this role
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Role Name</Label>
              <Input defaultValue={selectedRole?.name} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea defaultValue={selectedRole?.description} />
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="grid gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-lg">
                {allPermissions.map((perm) => (
                  <div key={perm.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{perm.label}</p>
                      <p className="text-xs text-muted-foreground">{perm.description}</p>
                    </div>
                    <Switch
                      defaultChecked={
                        selectedRole?.permissions.includes("all") ||
                        selectedRole?.permissions.includes(perm.id)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setEditRoleDialogOpen(false)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
