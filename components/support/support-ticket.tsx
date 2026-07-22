"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  MessageSquare,
  Upload,
  X,
  HelpCircle,
  CreditCard,
  Calendar,
  User,
  Shield,
  FileText,
  Send,
  ChevronRight,
  Phone,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SupportTicket {
  id: string;
  category: string;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  messages: TicketMessage[];
}

interface TicketMessage {
  id: string;
  sender: "user" | "support";
  senderName: string;
  senderAvatar?: string;
  message: string;
  timestamp: string;
  attachments?: string[];
}

const categoryOptions = [
  { value: "billing", label: "Billing & Payments", icon: CreditCard, description: "Payment issues, refunds, invoices" },
  { value: "booking", label: "Booking Issues", icon: Calendar, description: "Schedule changes, cancellations" },
  { value: "caregiver", label: "Caregiver Concerns", icon: User, description: "Quality, behavior, no-show" },
  { value: "safety", label: "Safety & Trust", icon: Shield, description: "Safety concerns, verification issues" },
  { value: "technical", label: "Technical Support", icon: HelpCircle, description: "App issues, bugs, account access" },
  { value: "other", label: "Other", icon: FileText, description: "General questions" },
];

const priorityConfig = {
  low: { label: "Low", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  medium: { label: "Medium", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  high: { label: "High", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  urgent: { label: "Urgent", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

const statusConfig = {
  open: { label: "Open", color: "bg-blue-100 text-blue-700", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-amber-100 text-amber-700", icon: MessageSquare },
  resolved: { label: "Resolved", color: "bg-green-100 text-green-700", icon: CheckCircle },
  closed: { label: "Closed", color: "bg-gray-100 text-gray-700", icon: X },
};

const mockTickets: SupportTicket[] = [
  {
    id: "TKT-001",
    category: "billing",
    subject: "Incorrect charge on my account",
    description: "I was charged $56 for a visit that was cancelled. Please refund.",
    status: "in_progress",
    priority: "medium",
    createdAt: "2 days ago",
    updatedAt: "1 hour ago",
    assignedTo: "Support Team",
    messages: [
      {
        id: "1",
        sender: "user",
        senderName: "You",
        message: "I was charged $56 for a visit that was cancelled. Please refund.",
        timestamp: "2 days ago",
      },
      {
        id: "2",
        sender: "support",
        senderName: "Sarah from Support",
        senderAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
        message: "Hi! I'm looking into this for you. Can you please confirm the date of the cancelled visit?",
        timestamp: "1 day ago",
      },
      {
        id: "3",
        sender: "user",
        senderName: "You",
        message: "It was January 25th, 2025. The caregiver cancelled at the last minute.",
        timestamp: "1 day ago",
      },
      {
        id: "4",
        sender: "support",
        senderName: "Sarah from Support",
        senderAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
        message: "Thank you for confirming. I've initiated a full refund of $56 to your payment method. It should appear in 3-5 business days.",
        timestamp: "1 hour ago",
      },
    ],
  },
];

interface SupportTicketProps {
  variant?: "create" | "list" | "detail";
  ticketId?: string;
  onSubmit?: (ticket: Partial<SupportTicket>) => void;
}

export function SupportTicket({ variant = "create", ticketId, onSubmit }: SupportTicketProps) {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<string>("medium");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedTicketId, setGeneratedTicketId] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [tickets, setTickets] = useState(mockTickets);

  const selectedTicket = tickets.find((t) => t.id === ticketId);

  const handleSubmit = () => {
    const newTicket: Partial<SupportTicket> = {
      category,
      subject,
      description,
      priority: priority as SupportTicket["priority"],
      status: "open",
      createdAt: "Just now",
      updatedAt: "Just now",
    };
    setGeneratedTicketId(Math.random().toString(36).substring(2, 8).toUpperCase());
    onSubmit?.(newTicket);
    setIsSubmitted(true);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return;

    const updatedTickets = tickets.map((t) => {
      if (t.id === ticketId) {
        return {
          ...t,
          messages: [
            ...t.messages,
            {
              id: String(t.messages.length + 1),
              sender: "user" as const,
              senderName: "You",
              message: newMessage,
              timestamp: "Just now",
            },
          ],
          updatedAt: "Just now",
        };
      }
      return t;
    });

    setTickets(updatedTickets);
    setNewMessage("");
  };

  // Create New Ticket Form
  if (variant === "create") {
    if (isSubmitted) {
      return (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Ticket Submitted</h2>
            <p className="text-muted-foreground mb-4">
              Your support ticket has been created. We&apos;ll respond within 24 hours.
            </p>
            <Badge className="text-lg px-4 py-2">Ticket #TKT-{generatedTicketId}</Badge>
            <div className="mt-6 p-4 rounded-lg bg-muted text-left">
              <p className="text-sm text-muted-foreground">
                <strong>What happens next?</strong>
              </p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>• You&apos;ll receive an email confirmation</li>
                <li>• Our team will review your request</li>
                <li>• We&apos;ll respond within 24 hours</li>
                <li>• Check your tickets anytime in the Help Center</li>
              </ul>
            </div>
            <Button className="mt-6" onClick={() => setIsSubmitted(false)}>
              Submit Another Ticket
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
          <CardDescription>
            We&apos;re here to help. Tell us what&apos;s going on.
          </CardDescription>
          <Progress value={(step / 3) * 100} className="h-2 mt-4" />
        </CardHeader>
        <CardContent>
          {/* Step 1: Category Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <Label>What can we help you with?</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                {categoryOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        setCategory(option.value);
                        setStep(2);
                      }}
                      className={cn(
                        "flex items-start gap-3 p-4 rounded-lg border text-left transition-all hover:border-primary",
                        category === option.value && "border-primary bg-primary/5"
                      )}
                    >
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{option.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Brief summary of your issue"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide as much detail as possible..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 min-h-[150px]"
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - General question</SelectItem>
                    <SelectItem value="medium">Medium - Need help soon</SelectItem>
                    <SelectItem value="high">High - Affecting my experience</SelectItem>
                    <SelectItem value="urgent">Urgent - Safety or payment issue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!subject.trim() || !description.trim()}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <Badge variant="outline">
                    {categoryOptions.find((c) => c.value === category)?.label}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Priority</span>
                  <Badge className={priorityConfig[priority as keyof typeof priorityConfig]?.color}>
                    {priorityConfig[priority as keyof typeof priorityConfig]?.label}
                  </Badge>
                </div>
                <div className="pt-2 border-t">
                  <p className="font-medium">{subject}</p>
                  <p className="text-sm text-muted-foreground mt-1">{description}</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm">
                  <strong>Expected response time:</strong>{" "}
                  {priority === "urgent" ? "Within 2 hours" : "Within 24 hours"}
                </p>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={handleSubmit}>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Ticket
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Ticket List View
  if (variant === "list") {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Tickets</CardTitle>
            <Button size="sm">
              New Ticket
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <div className="text-center py-8">
              <HelpCircle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No support tickets yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket) => {
                const status = statusConfig[ticket.status];
                const StatusIcon = status.icon;
                return (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", status.color)}>
                        <StatusIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{ticket.subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {ticket.id} • {ticket.updatedAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={priorityConfig[ticket.priority].color}>
                        {priorityConfig[ticket.priority].label}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Ticket Detail View
  if (variant === "detail" && selectedTicket) {
    const status = statusConfig[selectedTicket.status];
    const StatusIcon = status.icon;

    return (
      <div className="space-y-6">
        {/* Ticket Header */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline">{selectedTicket.id}</Badge>
                  <Badge className={status.color}>
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {status.label}
                  </Badge>
                  <Badge className={priorityConfig[selectedTicket.priority].color}>
                    {priorityConfig[selectedTicket.priority].label}
                  </Badge>
                </div>
                <h2 className="text-xl font-bold">{selectedTicket.subject}</h2>
                <p className="text-sm text-muted-foreground">
                  Created {selectedTicket.createdAt} • Updated {selectedTicket.updatedAt}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Conversation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedTicket.messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.sender === "user" && "flex-row-reverse"
                  )}
                >
                  {message.senderAvatar ? (
                    <Image
                      src={message.senderAvatar}
                      alt={message.senderName}
                      width={36}
                      height={36}
                      className="rounded-full shrink-0"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[70%] rounded-lg p-3",
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="text-sm font-medium mb-1">{message.senderName}</p>
                    <p className="text-sm">{message.message}</p>
                    <p
                      className={cn(
                        "text-xs mt-2",
                        message.sender === "user"
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      )}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Input */}
            {selectedTicket.status !== "closed" && (
              <div className="mt-6 pt-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your reply..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium mb-3">Need more help?</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Phone className="mr-2 h-4 w-4" />
                Call Support
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Email Us
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
