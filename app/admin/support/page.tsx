"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Ticket,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  User,
  MoreHorizontal,
  Send,
  Paperclip,
  ArrowRight,
  RefreshCw,
  Tag,
  UserCircle,
  Calendar,
  Phone,
  Mail,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  category: "billing" | "technical" | "account" | "booking" | "other";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "waiting" | "resolved" | "closed";
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    type: "family" | "caregiver";
    photo: string;
  };
  assignedTo?: {
    name: string;
    avatar: string;
  };
  messages: {
    id: string;
    sender: "user" | "admin";
    senderName: string;
    content: string;
    timestamp: string;
  }[];
  tags: string[];
}

const mockTickets: SupportTicket[] = [
  {
    id: "TKT-001",
    subject: "Unable to process payment",
    description: "I'm trying to pay for my booking but the payment keeps failing. I've tried multiple cards.",
    category: "billing",
    priority: "high",
    status: "open",
    createdAt: "2024-01-25T10:30:00",
    updatedAt: "2024-01-25T10:30:00",
    user: {
      id: "u-1",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "(206) 555-0123",
      type: "family",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    },
    messages: [
      {
        id: "m-1",
        sender: "user",
        senderName: "Sarah Johnson",
        content: "I'm trying to pay for my booking but the payment keeps failing. I've tried multiple cards and even PayPal. Error says 'Transaction declined'. Please help!",
        timestamp: "2024-01-25T10:30:00",
      },
    ],
    tags: ["payment", "urgent"],
  },
  {
    id: "TKT-002",
    subject: "Account verification pending for 2 weeks",
    description: "I submitted my background check documents 2 weeks ago but haven't heard back.",
    category: "account",
    priority: "medium",
    status: "in_progress",
    createdAt: "2024-01-24T14:15:00",
    updatedAt: "2024-01-25T09:00:00",
    user: {
      id: "u-2",
      name: "Maria Rodriguez",
      email: "maria.r@email.com",
      phone: "(206) 555-0456",
      type: "caregiver",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
    },
    assignedTo: {
      name: "Admin John",
      avatar: "JD",
    },
    messages: [
      {
        id: "m-1",
        sender: "user",
        senderName: "Maria Rodriguez",
        content: "I submitted my background check documents 2 weeks ago but haven't heard back. Can you please check the status?",
        timestamp: "2024-01-24T14:15:00",
      },
      {
        id: "m-2",
        sender: "admin",
        senderName: "Admin John",
        content: "Hi Maria, I apologize for the delay. I'm looking into your verification status now and will have an update for you shortly.",
        timestamp: "2024-01-25T09:00:00",
      },
    ],
    tags: ["verification", "background-check"],
  },
  {
    id: "TKT-003",
    subject: "Caregiver didn't show up",
    description: "The caregiver I booked didn't show up for the appointment.",
    category: "booking",
    priority: "urgent",
    status: "open",
    createdAt: "2024-01-25T08:00:00",
    updatedAt: "2024-01-25T08:00:00",
    user: {
      id: "u-3",
      name: "Michael Chen",
      email: "m.chen@email.com",
      phone: "(206) 555-0789",
      type: "family",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    },
    messages: [
      {
        id: "m-1",
        sender: "user",
        senderName: "Michael Chen",
        content: "The caregiver I booked (James Williams) didn't show up for our 8am appointment today. My father needed assistance and no one came. This is unacceptable!",
        timestamp: "2024-01-25T08:00:00",
      },
    ],
    tags: ["no-show", "escalation"],
  },
  {
    id: "TKT-004",
    subject: "How do I update my availability?",
    description: "I can't figure out how to change my weekly availability.",
    category: "technical",
    priority: "low",
    status: "resolved",
    createdAt: "2024-01-23T16:45:00",
    updatedAt: "2024-01-24T10:30:00",
    user: {
      id: "u-4",
      name: "Emily Thompson",
      email: "emily.t@email.com",
      phone: "(206) 555-0321",
      type: "caregiver",
      photo: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop&crop=face",
    },
    assignedTo: {
      name: "Admin Sarah",
      avatar: "SA",
    },
    messages: [
      {
        id: "m-1",
        sender: "user",
        senderName: "Emily Thompson",
        content: "I can't figure out how to change my weekly availability. The calendar keeps resetting.",
        timestamp: "2024-01-23T16:45:00",
      },
      {
        id: "m-2",
        sender: "admin",
        senderName: "Admin Sarah",
        content: "Hi Emily! To update your availability: Go to Dashboard > Availability > Click on the calendar days you want to modify. Make sure to click 'Save Changes' at the bottom. Let me know if this helps!",
        timestamp: "2024-01-24T10:30:00",
      },
      {
        id: "m-3",
        sender: "user",
        senderName: "Emily Thompson",
        content: "That worked! Thank you so much for your help.",
        timestamp: "2024-01-24T11:00:00",
      },
    ],
    tags: ["how-to"],
  },
  {
    id: "TKT-005",
    subject: "Request refund for cancelled booking",
    description: "I need a refund for a booking that was cancelled by the caregiver.",
    category: "billing",
    priority: "medium",
    status: "waiting",
    createdAt: "2024-01-22T11:20:00",
    updatedAt: "2024-01-24T15:00:00",
    user: {
      id: "u-5",
      name: "Jennifer Williams",
      email: "j.williams@email.com",
      phone: "(206) 555-0654",
      type: "family",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    },
    assignedTo: {
      name: "Admin Mike",
      avatar: "MK",
    },
    messages: [
      {
        id: "m-1",
        sender: "user",
        senderName: "Jennifer Williams",
        content: "The caregiver cancelled my booking last minute. I was charged $45 cancellation fee but it wasn't my fault. Please refund.",
        timestamp: "2024-01-22T11:20:00",
      },
      {
        id: "m-2",
        sender: "admin",
        senderName: "Admin Mike",
        content: "I've reviewed your case and you're correct - since the caregiver cancelled, you shouldn't have been charged. I'm processing your refund now.",
        timestamp: "2024-01-24T15:00:00",
      },
    ],
    tags: ["refund", "cancellation"],
  },
];

const priorityColors = {
  low: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  high: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const statusColors = {
  open: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  in_progress: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  waiting: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  resolved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  closed: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export default function SupportTicketsPage() {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");

  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    open: mockTickets.filter((t) => t.status === "open").length,
    inProgress: mockTickets.filter((t) => t.status === "in_progress").length,
    waiting: mockTickets.filter((t) => t.status === "waiting").length,
    resolved: mockTickets.filter((t) => t.status === "resolved").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Support Tickets</h1>
          <p className="text-muted-foreground">Manage customer support requests</p>
        </div>
        <Button>
          <Ticket className="mr-2 h-4 w-4" />
          Create Ticket
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="cursor-pointer hover:border-primary/50" onClick={() => setStatusFilter("open")}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open</p>
                <p className="text-2xl font-bold">{stats.open}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50" onClick={() => setStatusFilter("in_progress")}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50" onClick={() => setStatusFilter("waiting")}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Waiting</p>
                <p className="text-2xl font-bold">{stats.waiting}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50" onClick={() => setStatusFilter("resolved")}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold">{stats.resolved}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Ticket List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="waiting">Waiting</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <div className="divide-y">
                {filteredTickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={cn(
                      "w-full text-left p-4 hover:bg-muted/50 transition-colors",
                      selectedTicket?.id === ticket.id && "bg-muted"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                      <Badge className={cn("text-[10px]", priorityColors[ticket.priority])}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    <p className="font-medium text-sm line-clamp-1">{ticket.subject}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Image
                        src={ticket.user.photo}
                        alt={ticket.user.name}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      <span className="text-xs text-muted-foreground truncate">{ticket.user.name}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className={cn("text-[10px]", statusColors[ticket.status])}>
                        {ticket.status.replace("_", " ")}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(ticket.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Ticket Detail */}
        <Card className="lg:col-span-2">
          {selectedTicket ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-mono text-muted-foreground">{selectedTicket.id}</span>
                      <Badge className={cn(priorityColors[selectedTicket.priority])}>
                        {selectedTicket.priority}
                      </Badge>
                      <Badge variant="outline" className={cn(statusColors[selectedTicket.status])}>
                        {selectedTicket.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{selectedTicket.subject}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Assign to me</DropdownMenuItem>
                      <DropdownMenuItem>Change priority</DropdownMenuItem>
                      <DropdownMenuItem>Mark as resolved</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Close ticket</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-3">
                  {/* Messages */}
                  <div className="lg:col-span-2 border-r">
                    <ScrollArea className="h-[400px] p-4">
                      <div className="space-y-4">
                        {selectedTicket.messages.map((message) => (
                          <div
                            key={message.id}
                            className={cn(
                              "flex gap-3",
                              message.sender === "admin" && "flex-row-reverse"
                            )}
                          >
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                              {message.sender === "user" ? (
                                <Image
                                  src={selectedTicket.user.photo}
                                  alt={message.senderName}
                                  width={32}
                                  height={32}
                                  className="rounded-full"
                                />
                              ) : (
                                <UserCircle className="h-5 w-5 text-primary" />
                              )}
                            </div>
                            <div
                              className={cn(
                                "flex-1 rounded-lg p-3 max-w-[80%]",
                                message.sender === "admin"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              )}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium">{message.senderName}</span>
                                <span className={cn(
                                  "text-[10px]",
                                  message.sender === "admin" ? "text-primary-foreground/70" : "text-muted-foreground"
                                )}>
                                  {new Date(message.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm">{message.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="border-t p-4">
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Type your reply..."
                          className="min-h-[80px]"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <Button variant="ghost" size="sm">
                          <Paperclip className="h-4 w-4 mr-2" />
                          Attach
                        </Button>
                        <Button size="sm">
                          <Send className="h-4 w-4 mr-2" />
                          Send Reply
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="p-4 space-y-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">CUSTOMER</p>
                      <div className="flex items-center gap-3">
                        <Image
                          src={selectedTicket.user.photo}
                          alt={selectedTicket.user.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <p className="font-medium text-sm">{selectedTicket.user.name}</p>
                          <Badge variant="secondary" className="text-[10px]">
                            {selectedTicket.user.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground truncate">{selectedTicket.user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{selectedTicket.user.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-xs font-medium text-muted-foreground mb-2">ASSIGNED TO</p>
                      {selectedTicket.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                            {selectedTicket.assignedTo.avatar}
                          </div>
                          <span className="text-sm">{selectedTicket.assignedTo.name}</span>
                        </div>
                      ) : (
                        <Button variant="outline" size="sm" className="w-full">
                          Assign Ticket
                        </Button>
                      )}
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-xs font-medium text-muted-foreground mb-2">CATEGORY</p>
                      <Badge variant="outline">{selectedTicket.category}</Badge>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-xs font-medium text-muted-foreground mb-2">TAGS</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedTicket.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-xs font-medium text-muted-foreground mb-2">TIMELINE</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Created</span>
                          <span>{new Date(selectedTicket.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Updated</span>
                          <span>{new Date(selectedTicket.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View User Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[600px] text-center">
              <Ticket className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="font-medium text-muted-foreground">Select a ticket</p>
              <p className="text-sm text-muted-foreground">Choose a ticket from the list to view details</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
