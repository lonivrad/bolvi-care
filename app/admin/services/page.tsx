"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Heart,
  Utensils,
  Car,
  Pill,
  Activity,
  Home,
  Users,
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Search,
  MoreHorizontal,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  baseRate: number;
  minDuration: number;
  maxDuration: number;
  isActive: boolean;
  requiresCertification: boolean;
  totalBookings: number;
  revenue: number;
  activeProviders: number;
  icon: React.ElementType;
}

const services: Service[] = [
  {
    id: "SRV001",
    name: "Companionship Care",
    category: "Daily Living",
    description: "Social interaction, conversation, and emotional support for seniors",
    baseRate: 25,
    minDuration: 2,
    maxDuration: 12,
    isActive: true,
    requiresCertification: false,
    totalBookings: 1245,
    revenue: 124500,
    activeProviders: 156,
    icon: Heart,
  },
  {
    id: "SRV002",
    name: "Meal Preparation",
    category: "Daily Living",
    description: "Nutritious meal planning, grocery shopping, and cooking assistance",
    baseRate: 28,
    minDuration: 2,
    maxDuration: 8,
    isActive: true,
    requiresCertification: false,
    totalBookings: 987,
    revenue: 98700,
    activeProviders: 142,
    icon: Utensils,
  },
  {
    id: "SRV003",
    name: "Transportation",
    category: "Mobility",
    description: "Safe transportation to appointments, errands, and social activities",
    baseRate: 30,
    minDuration: 1,
    maxDuration: 6,
    isActive: true,
    requiresCertification: true,
    totalBookings: 654,
    revenue: 78480,
    activeProviders: 89,
    icon: Car,
  },
  {
    id: "SRV004",
    name: "Medication Reminders",
    category: "Health Support",
    description: "Assistance with medication schedules and refill reminders",
    baseRate: 32,
    minDuration: 1,
    maxDuration: 4,
    isActive: true,
    requiresCertification: true,
    totalBookings: 543,
    revenue: 65160,
    activeProviders: 78,
    icon: Pill,
  },
  {
    id: "SRV005",
    name: "Personal Care",
    category: "Health Support",
    description: "Bathing, grooming, dressing, and hygiene assistance",
    baseRate: 35,
    minDuration: 2,
    maxDuration: 8,
    isActive: true,
    requiresCertification: true,
    totalBookings: 432,
    revenue: 60480,
    activeProviders: 67,
    icon: Activity,
  },
  {
    id: "SRV006",
    name: "Light Housekeeping",
    category: "Home Care",
    description: "Tidying, laundry, dishes, and maintaining a clean living space",
    baseRate: 26,
    minDuration: 2,
    maxDuration: 6,
    isActive: true,
    requiresCertification: false,
    totalBookings: 876,
    revenue: 91140,
    activeProviders: 134,
    icon: Home,
  },
  {
    id: "SRV007",
    name: "Respite Care",
    category: "Specialized",
    description: "Temporary relief care for primary family caregivers",
    baseRate: 38,
    minDuration: 4,
    maxDuration: 24,
    isActive: true,
    requiresCertification: true,
    totalBookings: 234,
    revenue: 53352,
    activeProviders: 45,
    icon: Users,
  },
  {
    id: "SRV008",
    name: "Dementia Care",
    category: "Specialized",
    description: "Specialized care for individuals with Alzheimer's or dementia",
    baseRate: 45,
    minDuration: 4,
    maxDuration: 12,
    isActive: true,
    requiresCertification: true,
    totalBookings: 156,
    revenue: 42120,
    activeProviders: 34,
    icon: GraduationCap,
  },
];

const categories = [
  { id: "daily-living", name: "Daily Living", count: 2 },
  { id: "health-support", name: "Health Support", count: 2 },
  { id: "home-care", name: "Home Care", count: 1 },
  { id: "mobility", name: "Mobility", count: 1 },
  { id: "specialized", name: "Specialized", count: 2 },
];

const stats = [
  { label: "Active Services", value: "8", icon: CheckCircle, color: "text-green-600" },
  { label: "Total Bookings", value: "5,127", icon: Calendar, color: "text-blue-600" },
  { label: "Total Revenue", value: "$613,932", icon: DollarSign, color: "text-green-600" },
  { label: "Active Providers", value: "745", icon: Users, color: "text-purple-600" },
];

export default function AdminServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Services Management</h1>
          <p className="text-muted-foreground">Configure and manage care services offered on the platform</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
              <DialogDescription>
                Create a new care service for the platform
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Service Name</Label>
                <Input id="name" placeholder="e.g., Overnight Care" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the service..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="baseRate">Base Rate ($/hr)</Label>
                  <Input id="baseRate" type="number" placeholder="25" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minDuration">Min Duration (hrs)</Label>
                  <Input id="minDuration" type="number" placeholder="2" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="certification">Requires Certification</Label>
                <Switch id="certification" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="active">Active</Label>
                <Switch id="active" defaultChecked />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Create Service
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                    <Icon className={cn("h-5 w-5", stat.color)} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Categories Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button
                variant={categoryFilter === "all" ? "secondary" : "ghost"}
                className="w-full justify-between"
                onClick={() => setCategoryFilter("all")}
              >
                All Services
                <Badge variant="secondary">{services.length}</Badge>
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={categoryFilter === category.name ? "secondary" : "ghost"}
                  className="w-full justify-between"
                  onClick={() => setCategoryFilter(category.name)}
                >
                  {category.name}
                  <Badge variant="secondary">{category.count}</Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Services Grid */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Services List */}
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredServices.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{service.name}</h3>
                            {service.isActive ? (
                              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Base Rate</p>
                        <p className="font-semibold">${service.baseRate}/hr</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-semibold">
                          {service.minDuration}-{service.maxDuration} hrs
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Bookings</p>
                        <p className="font-semibold">{service.totalBookings.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Providers</p>
                        <p className="font-semibold">{service.activeProviders}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {service.requiresCertification && (
                          <Badge variant="outline" className="text-xs">
                            <GraduationCap className="mr-1 h-3 w-3" />
                            Cert Required
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {service.category}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Service Performance</CardTitle>
          <CardDescription>Detailed metrics for all services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Base Rate</TableHead>
                  <TableHead className="text-right">Bookings</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Providers</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => {
                  const Icon = service.icon;
                  return (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-primary/10 p-1.5">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium">{service.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{service.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">${service.baseRate}/hr</TableCell>
                      <TableCell className="text-right">{service.totalBookings.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-semibold">
                        ${service.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">{service.activeProviders}</TableCell>
                      <TableCell>
                        {service.isActive ? (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
