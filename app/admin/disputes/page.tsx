"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  MessageSquare,
  DollarSign,
  User,
  Heart,
  Calendar,
  Search,
  FileText,
  Phone,
  Mail,
} from "lucide-react";

const disputes = [
  {
    id: "d-1",
    title: "Billing Discrepancy",
    description:
      "Family claims they were charged for 6 hours but caregiver only worked 4 hours.",
    family: {
      name: "Johnson Family",
      email: "johnson@email.com",
    },
    caregiver: {
      name: "Maria Rodriguez",
      email: "maria@email.com",
    },
    amount: 125.0,
    bookingId: "b-1234",
    status: "open",
    priority: "high",
    created: "2024-03-01T10:30:00",
    lastUpdate: "2024-03-01T14:00:00",
    messages: [
      {
        from: "family",
        message:
          "Maria left at 2pm but we were charged until 4pm. Please review.",
        time: "2024-03-01T10:30:00",
      },
      {
        from: "caregiver",
        message:
          "I stayed until 4pm as scheduled. The family member who was home may not have noticed.",
        time: "2024-03-01T12:15:00",
      },
    ],
  },
  {
    id: "d-2",
    title: "Service Quality Concern",
    description:
      "Family reports caregiver was frequently on phone during visit.",
    family: {
      name: "Smith Family",
      email: "smith@email.com",
    },
    caregiver: {
      name: "David Kim",
      email: "david@email.com",
    },
    amount: 0,
    bookingId: "b-1235",
    status: "investigating",
    priority: "medium",
    created: "2024-02-28T15:45:00",
    lastUpdate: "2024-03-01T09:00:00",
    messages: [
      {
        from: "family",
        message:
          "During the visit on Feb 28, David was on his phone for extended periods instead of engaging with my father.",
        time: "2024-02-28T15:45:00",
      },
    ],
  },
  {
    id: "d-3",
    title: "Cancellation Fee Dispute",
    description: "Family disputes cancellation fee due to emergency.",
    family: {
      name: "Garcia Family",
      email: "garcia@email.com",
    },
    caregiver: {
      name: "Sarah Thompson",
      email: "sarah@email.com",
    },
    amount: 45.0,
    bookingId: "b-1236",
    status: "open",
    priority: "low",
    created: "2024-02-27T11:00:00",
    lastUpdate: "2024-02-27T11:00:00",
    messages: [
      {
        from: "family",
        message:
          "We had to cancel due to a family emergency (hospital admission). We should not be charged the cancellation fee.",
        time: "2024-02-27T11:00:00",
      },
    ],
  },
  {
    id: "d-4",
    title: "Late Arrival Complaint",
    description: "Caregiver arrived 45 minutes late without notice.",
    family: {
      name: "Williams Family",
      email: "williams@email.com",
    },
    caregiver: {
      name: "James Lee",
      email: "james@email.com",
    },
    amount: 0,
    bookingId: "b-1237",
    status: "resolved",
    priority: "medium",
    created: "2024-02-25T09:30:00",
    lastUpdate: "2024-02-26T16:00:00",
    resolution: "Caregiver received warning. Family received 20% credit.",
    messages: [],
  },
];

export default function AdminDisputesPage() {
  const [disputesList, setDisputesList] = useState(disputes);
  const [resolution, setResolution] = useState("");
  const [investigationNotes, setInvestigationNotes] = useState("");
  const [investigationPriority, setInvestigationPriority] = useState("medium");
  const [investigationDialogOpen, setInvestigationDialogOpen] = useState(false);
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);

  const handleStartInvestigation = (disputeId: string) => {
    setSelectedDisputeId(disputeId);
    setInvestigationDialogOpen(true);
  };

  const confirmStartInvestigation = () => {
    if (selectedDisputeId) {
      setDisputesList((prev) =>
        prev.map((d) =>
          d.id === selectedDisputeId
            ? { ...d, status: "investigating", lastUpdate: new Date().toISOString(), priority: investigationPriority }
            : d
        )
      );
      setInvestigationDialogOpen(false);
      setInvestigationNotes("");
      setInvestigationPriority("medium");
      setSelectedDisputeId(null);
    }
  };

  const selectedDispute = disputesList.find((d) => d.id === selectedDisputeId);

  const openCount = disputesList.filter((d) => d.status === "open").length;
  const investigatingCount = disputesList.filter(
    (d) => d.status === "investigating"
  ).length;
  const resolvedCount = disputesList.filter((d) => d.status === "resolved").length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Open
          </Badge>
        );
      case "investigating":
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            Investigating
          </Badge>
        );
      case "resolved":
        return (
          <Badge variant="default" className="bg-accent">
            <CheckCircle className="mr-1 h-3 w-3" />
            Resolved
          </Badge>
        );
      default:
        return null;
    }
  };

  const DisputeCard = ({ dispute }: { dispute: (typeof disputes)[0] }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{dispute.title}</h3>
              {getPriorityBadge(dispute.priority)}
              {getStatusBadge(dispute.status)}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {dispute.description}
            </p>
          </div>
          {dispute.amount > 0 && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Disputed Amount</p>
              <p className="text-lg font-semibold text-foreground">
                ${dispute.amount.toFixed(2)}
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              Family
            </div>
            <p className="mt-1 font-medium text-foreground">
              {dispute.family.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {dispute.family.email}
            </p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="h-4 w-4" />
              Caregiver
            </div>
            <p className="mt-1 font-medium text-foreground">
              {dispute.caregiver.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {dispute.caregiver.email}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Created: {formatDate(dispute.created)}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Updated: {formatDate(dispute.lastUpdate)}
          </div>
        </div>

        {dispute.resolution && (
          <div className="mt-4 rounded-lg bg-accent/10 p-3">
            <p className="text-sm font-medium text-accent">Resolution</p>
            <p className="text-sm text-foreground">{dispute.resolution}</p>
          </div>
        )}

        {dispute.messages.length > 0 && (
          <div className="mt-4 border-t border-border pt-4">
            <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              Messages ({dispute.messages.length})
            </p>
            <div className="mt-2 space-y-2">
              {dispute.messages.slice(0, 2).map((msg, index) => (
                <div key={index} className="rounded-lg bg-muted p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      {msg.from === "family"
                        ? dispute.family.name
                        : dispute.caregiver.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(msg.time)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-foreground">{msg.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {dispute.status !== "resolved" && (
          <div className="mt-4 flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex-1">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Resolve
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Resolve Dispute</DialogTitle>
                  <DialogDescription>
                    Provide a resolution for this dispute. Both parties will be
                    notified.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      Resolution Details
                    </label>
                    <Textarea
                      placeholder="Describe the resolution..."
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  {dispute.amount > 0 && (
                    <div>
                      <label className="text-sm font-medium">
                        Refund Amount
                      </label>
                      <div className="mt-1 flex gap-2">
                        <Button variant="outline" size="sm">
                          No Refund
                        </Button>
                        <Button variant="outline" size="sm">
                          Partial (${(dispute.amount / 2).toFixed(2)})
                        </Button>
                        <Button variant="outline" size="sm">
                          Full (${dispute.amount.toFixed(2)})
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Submit Resolution</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {dispute.status === "open" && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleStartInvestigation(dispute.id)}
              >
                <Search className="mr-2 h-4 w-4" />
                Start Investigation
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Disputes</h1>
        <p className="text-muted-foreground">
          Manage and resolve disputes between families and caregivers
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-muted-foreground">
                Open Disputes
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold">{openCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-secondary" />
              <span className="text-sm text-muted-foreground">
                Investigating
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold">{investigatingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-accent" />
              <span className="text-sm text-muted-foreground">Resolved</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{resolvedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                Total Disputed
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              ${disputesList.reduce((sum, d) => sum + d.amount, 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="open">
        <TabsList>
          <TabsTrigger value="open">Open ({openCount})</TabsTrigger>
          <TabsTrigger value="investigating">
            Investigating ({investigatingCount})
          </TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="mt-6 space-y-4">
          {disputesList
            .filter((d) => d.status === "open")
            .map((d) => (
              <DisputeCard key={d.id} dispute={d} />
            ))}
        </TabsContent>

        <TabsContent value="investigating" className="mt-6 space-y-4">
          {disputesList
            .filter((d) => d.status === "investigating")
            .map((d) => (
              <DisputeCard key={d.id} dispute={d} />
            ))}
        </TabsContent>

        <TabsContent value="resolved" className="mt-6 space-y-4">
          {disputesList
            .filter((d) => d.status === "resolved")
            .map((d) => (
              <DisputeCard key={d.id} dispute={d} />
            ))}
        </TabsContent>

        <TabsContent value="all" className="mt-6 space-y-4">
          {disputesList.map((d) => (
            <DisputeCard key={d.id} dispute={d} />
          ))}
        </TabsContent>
      </Tabs>

      {/* Investigation Dialog */}
      <Dialog open={investigationDialogOpen} onOpenChange={setInvestigationDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Start Investigation
            </DialogTitle>
            <DialogDescription>
              Begin a formal investigation into this dispute. Both parties will be notified.
            </DialogDescription>
          </DialogHeader>

          {selectedDispute && (
            <div className="space-y-4">
              {/* Dispute Summary */}
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <h4 className="font-medium text-foreground">{selectedDispute.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{selectedDispute.description}</p>
                <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                  <span>{selectedDispute.family.name}</span>
                  <span>vs</span>
                  <span>{selectedDispute.caregiver.name}</span>
                </div>
              </div>

              {/* Investigation Steps */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Investigation Checklist</Label>
                <div className="space-y-2 rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>Review booking details and transaction history</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span>Examine message history between parties</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>Contact family for additional details</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>Request caregiver&apos;s statement</span>
                  </div>
                </div>
              </div>

              {/* Priority Selection */}
              <div className="space-y-2">
                <Label htmlFor="priority">Investigation Priority</Label>
                <Select value={investigationPriority} onValueChange={setInvestigationPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High - Urgent attention required</SelectItem>
                    <SelectItem value="medium">Medium - Standard timeline</SelectItem>
                    <SelectItem value="low">Low - Review when available</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Initial Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Initial Investigation Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any initial observations or action items..."
                  value={investigationNotes}
                  onChange={(e) => setInvestigationNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Notification Info */}
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-3">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> Both parties will receive an email notification that an investigation has been started. Expected resolution time is 3-5 business days.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setInvestigationDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmStartInvestigation}>
              <Search className="mr-2 h-4 w-4" />
              Begin Investigation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
