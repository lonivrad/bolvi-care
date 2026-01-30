"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Filter,
  MoreHorizontal,
  Flag,
  CheckCircle,
  XCircle,
  Eye,
  AlertTriangle,
  MessageSquare,
  Image as ImageIcon,
  FileText,
  User,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Ban,
  Mail,
  Shield,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ModerationItem {
  id: string;
  type: "review" | "profile" | "message" | "photo";
  content: string;
  author: {
    id: string;
    name: string;
    email: string;
    type: "family" | "caregiver";
    photo: string;
    flagCount: number;
  };
  target?: {
    id: string;
    name: string;
    type: "family" | "caregiver";
  };
  reportedBy?: {
    name: string;
    reason: string;
  };
  status: "pending" | "approved" | "rejected" | "escalated";
  flags: number;
  createdAt: string;
  aiScore?: number;
  aiFlags?: string[];
}

const mockModerationQueue: ModerationItem[] = [
  {
    id: "1",
    type: "review",
    content: "This caregiver was terrible! Never on time, rude to my mother, and I suspect they stole some jewelry. DO NOT HIRE!",
    author: {
      id: "u1",
      name: "Robert Chen",
      email: "robert.chen@email.com",
      type: "family",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      flagCount: 0,
    },
    target: {
      id: "c1",
      name: "Maria Santos",
      type: "caregiver",
    },
    status: "pending",
    flags: 3,
    createdAt: "2024-01-15T10:30:00Z",
    aiScore: 0.85,
    aiFlags: ["potential_defamation", "unverified_claim", "harsh_language"],
  },
  {
    id: "2",
    type: "profile",
    content: "Professional caregiver with 10 years experience. Contact me directly at 555-1234 for better rates! Skip the platform fees.",
    author: {
      id: "c2",
      name: "James Wilson",
      email: "james.wilson@email.com",
      type: "caregiver",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      flagCount: 2,
    },
    status: "pending",
    flags: 1,
    createdAt: "2024-01-15T09:15:00Z",
    aiScore: 0.92,
    aiFlags: ["contact_sharing", "fee_circumvention"],
  },
  {
    id: "3",
    type: "message",
    content: "Hey, I can give you my services for cash outside the app. Much cheaper that way. Here's my personal number...",
    author: {
      id: "c3",
      name: "Linda Thompson",
      email: "linda.t@email.com",
      type: "caregiver",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      flagCount: 1,
    },
    target: {
      id: "f1",
      name: "Sarah Johnson",
      type: "family",
    },
    reportedBy: {
      name: "Sarah Johnson",
      reason: "Trying to take transactions off-platform",
    },
    status: "pending",
    flags: 1,
    createdAt: "2024-01-15T08:45:00Z",
    aiScore: 0.98,
    aiFlags: ["off_platform_transaction", "contact_sharing"],
  },
  {
    id: "4",
    type: "photo",
    content: "[Profile photo flagged for review]",
    author: {
      id: "c4",
      name: "Michael Brown",
      email: "michael.b@email.com",
      type: "caregiver",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      flagCount: 0,
    },
    status: "pending",
    flags: 2,
    createdAt: "2024-01-15T07:30:00Z",
    aiScore: 0.45,
    aiFlags: ["potentially_misleading"],
  },
  {
    id: "5",
    type: "review",
    content: "Excellent caregiver! Very professional and caring. My father loved having her around. Highly recommend!",
    author: {
      id: "u2",
      name: "Emily Davis",
      email: "emily.d@email.com",
      type: "family",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      flagCount: 0,
    },
    target: {
      id: "c5",
      name: "Patricia Lee",
      type: "caregiver",
    },
    status: "approved",
    flags: 0,
    createdAt: "2024-01-14T16:20:00Z",
    aiScore: 0.05,
    aiFlags: [],
  },
];

const moderationStats = {
  pending: 4,
  approved: 156,
  rejected: 23,
  escalated: 2,
  avgResponseTime: "2.4h",
  aiAccuracy: 94.2,
};

export default function ModerationPage() {
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | "escalate" | null>(null);
  const [actionNote, setActionNote] = useState("");

  const filteredItems = mockModerationQueue.filter((item) => {
    const matchesSearch =
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeTab === "all" || item.status === activeTab;
    return matchesSearch && matchesStatus;
  });

  const getTypeIcon = (type: ModerationItem["type"]) => {
    switch (type) {
      case "review":
        return FileText;
      case "profile":
        return User;
      case "message":
        return MessageSquare;
      case "photo":
        return ImageIcon;
    }
  };

  const getStatusBadge = (status: ModerationItem["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">Rejected</Badge>;
      case "escalated":
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20">Escalated</Badge>;
    }
  };

  const handleAction = (type: "approve" | "reject" | "escalate") => {
    setActionType(type);
    setActionDialogOpen(true);
  };

  const confirmAction = () => {
    // In production, this would send to API
    console.log(`Action: ${actionType}, Note: ${actionNote}, Item: ${selectedItem?.id}`);
    setActionDialogOpen(false);
    setActionNote("");
    setActionType(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Content Moderation</h1>
          <p className="text-muted-foreground">Review and moderate user-generated content</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <TrendingUp className="mr-2 h-4 w-4" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-yellow-500/10 p-2">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{moderationStats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-green-500/10 p-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{moderationStats.approved}</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-red-500/10 p-2">
                <XCircle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{moderationStats.rejected}</p>
                <p className="text-xs text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-purple-500/10 p-2">
                <AlertTriangle className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{moderationStats.escalated}</p>
                <p className="text-xs text-muted-foreground">Escalated</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{moderationStats.avgResponseTime}</p>
                <p className="text-xs text-muted-foreground">Avg Response</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{moderationStats.aiAccuracy}%</p>
                <p className="text-xs text-muted-foreground">AI Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Queue List */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Moderation Queue</CardTitle>
              <Badge variant="secondary">{filteredItems.length} items</Badge>
            </div>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b px-4">
                <TabsList className="h-10 w-full justify-start rounded-none bg-transparent p-0">
                  <TabsTrigger
                    value="pending"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Pending
                  </TabsTrigger>
                  <TabsTrigger
                    value="escalated"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Escalated
                  </TabsTrigger>
                  <TabsTrigger
                    value="all"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    All
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value={activeTab} className="m-0">
                <ScrollArea className="h-[500px]">
                  <div className="divide-y">
                    {filteredItems.map((item) => {
                      const TypeIcon = getTypeIcon(item.type);
                      return (
                        <div
                          key={item.id}
                          className={cn(
                            "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                            selectedItem?.id === item.id && "bg-muted"
                          )}
                          onClick={() => setSelectedItem(item)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="rounded-lg bg-muted p-2">
                              <TypeIcon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm truncate">
                                  {item.author.name}
                                </span>
                                {getStatusBadge(item.status)}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {item.content}
                              </p>
                              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                <span className="capitalize">{item.type}</span>
                                {item.flags > 0 && (
                                  <span className="flex items-center gap-1 text-red-600">
                                    <Flag className="h-3 w-3" />
                                    {item.flags} flags
                                  </span>
                                )}
                                {item.aiScore && item.aiScore > 0.7 && (
                                  <span className="flex items-center gap-1 text-yellow-600">
                                    <AlertCircle className="h-3 w-3" />
                                    AI flagged
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Detail View */}
        <Card className="lg:col-span-3">
          {selectedItem ? (
            <>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base capitalize">{selectedItem.type} Review</CardTitle>
                    {getStatusBadge(selectedItem.status)}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Original
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        View User Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Ban className="mr-2 h-4 w-4" />
                        Ban User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Content */}
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="text-sm">{selectedItem.content}</p>
                </div>

                {/* Author Info */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Author</h4>
                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <img
                      src={selectedItem.author.photo}
                      alt={selectedItem.author.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{selectedItem.author.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedItem.author.email}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="capitalize">
                        {selectedItem.author.type}
                      </Badge>
                      {selectedItem.author.flagCount > 0 && (
                        <p className="text-xs text-red-600 mt-1">
                          {selectedItem.author.flagCount} previous flags
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Target (if applicable) */}
                {selectedItem.target && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">About</h4>
                    <div className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{selectedItem.target.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{selectedItem.target.type}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reporter (if applicable) */}
                {selectedItem.reportedBy && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Reported By</h4>
                    <div className="p-3 rounded-lg border">
                      <p className="font-medium text-sm">{selectedItem.reportedBy.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Reason: {selectedItem.reportedBy.reason}
                      </p>
                    </div>
                  </div>
                )}

                {/* AI Analysis */}
                {selectedItem.aiScore !== undefined && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">AI Analysis</h4>
                    <div className="p-3 rounded-lg border space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Risk Score</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                selectedItem.aiScore > 0.7
                                  ? "bg-red-500"
                                  : selectedItem.aiScore > 0.4
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              )}
                              style={{ width: `${selectedItem.aiScore * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {Math.round(selectedItem.aiScore * 100)}%
                          </span>
                        </div>
                      </div>
                      {selectedItem.aiFlags && selectedItem.aiFlags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedItem.aiFlags.map((flag) => (
                            <Badge key={flag} variant="outline" className="text-xs">
                              {flag.replace(/_/g, " ")}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {selectedItem.status === "pending" && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      className="flex-1"
                      variant="outline"
                      onClick={() => handleAction("approve")}
                    >
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      className="flex-1"
                      variant="outline"
                      onClick={() => handleAction("reject")}
                    >
                      <ThumbsDown className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      className="flex-1"
                      variant="outline"
                      onClick={() => handleAction("escalate")}
                    >
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Escalate
                    </Button>
                  </div>
                )}
              </CardContent>
            </>
          ) : (
            <CardContent className="flex flex-col items-center justify-center h-[600px] text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium">Select an item to review</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Choose an item from the queue to view details and take action
              </p>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="capitalize">
              {actionType} Content
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Add a note (optional)</label>
              <Textarea
                placeholder="Explain your decision..."
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                className="mt-2"
              />
            </div>
            {actionType === "reject" && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-600">Notify user?</p>
                  <p className="text-muted-foreground">
                    The author will be notified that their content was rejected.
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              variant={actionType === "reject" ? "destructive" : "default"}
            >
              Confirm {actionType}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
