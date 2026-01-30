"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Tag,
  Plus,
  Search,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Copy,
  Edit,
  Trash2,
  MoreHorizontal,
  CheckCircle,
  Clock,
  XCircle,
  Percent,
  Gift,
  Zap,
  Target,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Promotion {
  id: string;
  code: string;
  name: string;
  description: string;
  type: "percentage" | "fixed" | "free_hours";
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  userLimit?: number;
  startDate: string;
  endDate: string;
  status: "active" | "scheduled" | "expired" | "disabled";
  targetAudience: "all" | "new_users" | "returning" | "families" | "caregivers";
  applicableServices: string[];
  createdBy: string;
  performance: {
    redemptions: number;
    revenue: number;
    avgOrderValue: number;
  };
}

const mockPromotions: Promotion[] = [
  {
    id: "1",
    code: "WELCOME25",
    name: "New User Welcome",
    description: "25% off first booking for new families",
    type: "percentage",
    value: 25,
    maxDiscount: 50,
    usageLimit: 1000,
    usageCount: 342,
    userLimit: 1,
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    status: "active",
    targetAudience: "new_users",
    applicableServices: ["all"],
    createdBy: "Sarah Admin",
    performance: {
      redemptions: 342,
      revenue: 28560,
      avgOrderValue: 83.5,
    },
  },
  {
    id: "2",
    code: "CARE50",
    name: "Loyalty Reward",
    description: "$50 off for returning customers",
    type: "fixed",
    value: 50,
    minPurchase: 150,
    usageLimit: 500,
    usageCount: 187,
    startDate: "2024-01-15",
    endDate: "2024-02-28",
    status: "active",
    targetAudience: "returning",
    applicableServices: ["companionship", "personal_care"],
    createdBy: "James Admin",
    performance: {
      redemptions: 187,
      revenue: 32450,
      avgOrderValue: 173.5,
    },
  },
  {
    id: "3",
    code: "SPRING2024",
    name: "Spring Campaign",
    description: "15% off all services",
    type: "percentage",
    value: 15,
    maxDiscount: 30,
    usageLimit: 2000,
    usageCount: 0,
    startDate: "2024-03-01",
    endDate: "2024-03-31",
    status: "scheduled",
    targetAudience: "all",
    applicableServices: ["all"],
    createdBy: "Sarah Admin",
    performance: {
      redemptions: 0,
      revenue: 0,
      avgOrderValue: 0,
    },
  },
  {
    id: "4",
    code: "FREEHOUR",
    name: "Free Hour Promo",
    description: "1 free hour with 4+ hour booking",
    type: "free_hours",
    value: 1,
    minPurchase: 4,
    usageLimit: 200,
    usageCount: 200,
    userLimit: 1,
    startDate: "2023-12-01",
    endDate: "2024-01-15",
    status: "expired",
    targetAudience: "all",
    applicableServices: ["all"],
    createdBy: "James Admin",
    performance: {
      redemptions: 200,
      revenue: 18900,
      avgOrderValue: 94.5,
    },
  },
  {
    id: "5",
    code: "CAREGIVER10",
    name: "Caregiver Bonus",
    description: "10% bonus on caregiver payouts",
    type: "percentage",
    value: 10,
    usageLimit: 100,
    usageCount: 45,
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    status: "active",
    targetAudience: "caregivers",
    applicableServices: ["all"],
    createdBy: "Sarah Admin",
    performance: {
      redemptions: 45,
      revenue: 0,
      avgOrderValue: 0,
    },
  },
];

const promoStats = {
  activePromos: 3,
  totalRedemptions: 774,
  totalSavings: 45280,
  conversionRate: 12.4,
};

export default function PromotionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);

  const filteredPromotions = mockPromotions.filter((promo) => {
    const matchesSearch =
      promo.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && promo.status === "active") ||
      (activeTab === "scheduled" && promo.status === "scheduled") ||
      (activeTab === "expired" && (promo.status === "expired" || promo.status === "disabled"));
    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (status: Promotion["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Active</Badge>;
      case "scheduled":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">Scheduled</Badge>;
      case "expired":
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-600 border-gray-500/20">Expired</Badge>;
      case "disabled":
        return <Badge variant="secondary">Disabled</Badge>;
    }
  };

  const getTypeIcon = (type: Promotion["type"]) => {
    switch (type) {
      case "percentage":
        return Percent;
      case "fixed":
        return DollarSign;
      case "free_hours":
        return Gift;
    }
  };

  const formatValue = (promo: Promotion) => {
    switch (promo.type) {
      case "percentage":
        return `${promo.value}% off`;
      case "fixed":
        return `$${promo.value} off`;
      case "free_hours":
        return `${promo.value} free hour${promo.value > 1 ? "s" : ""}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Promotions & Coupons</h1>
          <p className="text-muted-foreground">Manage discount codes and promotional campaigns</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Promotion
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500/10 p-2">
                <Zap className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{promoStats.activePromos}</p>
                <p className="text-xs text-muted-foreground">Active Promos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <Tag className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{promoStats.totalRedemptions}</p>
                <p className="text-xs text-muted-foreground">Redemptions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-500/10 p-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${promoStats.totalSavings.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Customer Savings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-500/10 p-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{promoStats.conversionRate}%</p>
                <p className="text-xs text-muted-foreground">Conversion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search promotions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Promotions List */}
      <div className="space-y-4">
        {filteredPromotions.map((promo) => {
          const TypeIcon = getTypeIcon(promo.type);
          const usagePercent = promo.usageLimit
            ? (promo.usageCount / promo.usageLimit) * 100
            : 0;

          return (
            <Card key={promo.id} className={cn(
              promo.status === "expired" && "opacity-60"
            )}>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* Left Section */}
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "rounded-lg p-3",
                      promo.status === "active" ? "bg-green-500/10" :
                      promo.status === "scheduled" ? "bg-blue-500/10" :
                      "bg-gray-500/10"
                    )}>
                      <TypeIcon className={cn(
                        "h-6 w-6",
                        promo.status === "active" ? "text-green-600" :
                        promo.status === "scheduled" ? "text-blue-600" :
                        "text-gray-600"
                      )} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{promo.name}</h3>
                        {getStatusBadge(promo.status)}
                        <Badge variant="outline" className="capitalize text-xs">
                          {promo.targetAudience.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{promo.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          <code className="text-sm font-mono bg-muted px-2 py-0.5 rounded">
                            {promo.code}
                          </code>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="text-sm font-medium text-primary">
                          {formatValue(promo)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}
                        </span>
                        {promo.minPurchase && (
                          <span>Min: ${promo.minPurchase}</span>
                        )}
                        {promo.maxDiscount && (
                          <span>Max: ${promo.maxDiscount}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Stats */}
                  <div className="flex items-center gap-6">
                    {/* Usage */}
                    <div className="text-center">
                      <p className="text-lg font-bold">{promo.usageCount}</p>
                      <p className="text-xs text-muted-foreground">
                        / {promo.usageLimit || "∞"} used
                      </p>
                      {promo.usageLimit && (
                        <div className="w-20 h-1.5 rounded-full bg-muted mt-1 overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              usagePercent >= 90 ? "bg-red-500" :
                              usagePercent >= 70 ? "bg-yellow-500" :
                              "bg-green-500"
                            )}
                            style={{ width: `${Math.min(usagePercent, 100)}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Revenue */}
                    <div className="text-center hidden sm:block">
                      <p className="text-lg font-bold">
                        ${promo.performance.revenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>

                    {/* Avg Order */}
                    <div className="text-center hidden md:block">
                      <p className="text-lg font-bold">
                        ${promo.performance.avgOrderValue.toFixed(0)}
                      </p>
                      <p className="text-xs text-muted-foreground">Avg Order</p>
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
                          <BarChart3 className="mr-2 h-4 w-4" />
                          View Analytics
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        {promo.status === "active" && (
                          <DropdownMenuItem className="text-destructive">
                            <XCircle className="mr-2 h-4 w-4" />
                            Disable
                          </DropdownMenuItem>
                        )}
                        {promo.status === "disabled" && (
                          <DropdownMenuItem>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Enable
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Promotion Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Promotion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Promotion Code</Label>
                <Input placeholder="SUMMER20" className="uppercase" />
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input placeholder="Summer Sale" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Describe the promotion..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select defaultValue="percentage">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage Off</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="free_hours">Free Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <Input type="number" placeholder="20" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Min Purchase ($)</Label>
                <Input type="number" placeholder="Optional" />
              </div>
              <div className="space-y-2">
                <Label>Max Discount ($)</Label>
                <Input type="number" placeholder="Optional" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Usage Limit</Label>
                <Input type="number" placeholder="Unlimited" />
              </div>
              <div className="space-y-2">
                <Label>Per User Limit</Label>
                <Input type="number" placeholder="Unlimited" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="new_users">New Users Only</SelectItem>
                  <SelectItem value="returning">Returning Customers</SelectItem>
                  <SelectItem value="families">Families Only</SelectItem>
                  <SelectItem value="caregivers">Caregivers Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Applicable Services</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="companionship">Companionship</SelectItem>
                  <SelectItem value="personal_care">Personal Care</SelectItem>
                  <SelectItem value="medication">Medication Management</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="space-y-0.5">
                <Label>Activate Immediately</Label>
                <p className="text-xs text-muted-foreground">
                  Enable this promotion right away
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setCreateDialogOpen(false)}>
              Create Promotion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
