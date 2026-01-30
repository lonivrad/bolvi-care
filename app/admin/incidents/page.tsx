"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Search,
  Plus,
  Shield,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  MapPin,
  User,
  FileText,
  MessageSquare,
  Calendar,
  ChevronRight,
  AlertCircle,
  Activity,
  Heart,
  Ambulance,
  Home,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Incident {
  id: string;
  title: string;
  description: string;
  type: "safety" | "medical" | "property" | "behavioral" | "other";
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "investigating" | "resolved" | "closed";
  createdAt: string;
  updatedAt: string;
  reportedBy: {
    name: string;
    type: "family" | "caregiver" | "system";
    photo?: string;
  };
  involvedParties: {
    name: string;
    type: "family" | "caregiver" | "care_recipient";
    role: string;
  }[];
  booking?: {
    id: string;
    date: string;
    service: string;
  };
  location?: string;
  assignedTo?: {
    name: string;
    avatar: string;
  };
  timeline: {
    id: string;
    action: string;
    actor: string;
    timestamp: string;
    note?: string;
  }[];
  resolution?: {
    outcome: string;
    actions: string[];
    closedBy: string;
    closedAt: string;
  };
}

const mockIncidents: Incident[] = [
  {
    id: "INC-001",
    title: "Care recipient fall during transfer",
    description: "Mrs. Johnson fell while being transferred from wheelchair to bed. Caregiver was present and followed proper protocols. Minor bruising reported.",
    type: "safety",
    severity: "high",
    status: "investigating",
    createdAt: "2024-01-15T14:30:00Z",
    updatedAt: "2024-01-15T16:45:00Z",
    reportedBy: {
      name: "Maria Santos",
      type: "caregiver",
      photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop",
    },
    involvedParties: [
      { name: "Maria Santos", type: "caregiver", role: "Caregiver on duty" },
      { name: "Dorothy Johnson", type: "care_recipient", role: "Care recipient" },
      { name: "Robert Johnson", type: "family", role: "Family member" },
    ],
    booking: {
      id: "BK-12345",
      date: "2024-01-15",
      service: "Daily Living Assistance",
    },
    location: "123 Main St, Seattle, WA",
    assignedTo: {
      name: "Sarah Admin",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    timeline: [
      {
        id: "1",
        action: "Incident reported",
        actor: "Maria Santos",
        timestamp: "2024-01-15T14:30:00Z",
        note: "Reported via mobile app with photos",
      },
      {
        id: "2",
        action: "Case assigned",
        actor: "System",
        timestamp: "2024-01-15T14:32:00Z",
        note: "Auto-assigned based on severity",
      },
      {
        id: "3",
        action: "Investigation started",
        actor: "Sarah Admin",
        timestamp: "2024-01-15T15:00:00Z",
        note: "Contacted caregiver for initial statement",
      },
      {
        id: "4",
        action: "Family notified",
        actor: "Sarah Admin",
        timestamp: "2024-01-15T16:45:00Z",
        note: "Spoke with Robert Johnson, family member",
      },
    ],
  },
  {
    id: "INC-002",
    title: "Medication administration concern",
    description: "Family reported that medications were not given at the correct time according to the care plan.",
    type: "medical",
    severity: "medium",
    status: "open",
    createdAt: "2024-01-15T10:15:00Z",
    updatedAt: "2024-01-15T10:15:00Z",
    reportedBy: {
      name: "Emily Chen",
      type: "family",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
    involvedParties: [
      { name: "James Wilson", type: "caregiver", role: "Assigned caregiver" },
      { name: "George Chen", type: "care_recipient", role: "Care recipient" },
    ],
    booking: {
      id: "BK-12340",
      date: "2024-01-14",
      service: "Medication Management",
    },
    timeline: [
      {
        id: "1",
        action: "Incident reported",
        actor: "Emily Chen",
        timestamp: "2024-01-15T10:15:00Z",
      },
    ],
  },
  {
    id: "INC-003",
    title: "Property damage during visit",
    description: "Lamp knocked over and broken during care visit. Caregiver reported immediately.",
    type: "property",
    severity: "low",
    status: "resolved",
    createdAt: "2024-01-14T09:00:00Z",
    updatedAt: "2024-01-14T17:00:00Z",
    reportedBy: {
      name: "Linda Thompson",
      type: "caregiver",
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
    },
    involvedParties: [
      { name: "Linda Thompson", type: "caregiver", role: "Caregiver on duty" },
      { name: "William Davis", type: "care_recipient", role: "Care recipient" },
    ],
    location: "456 Oak Ave, Bellevue, WA",
    timeline: [
      {
        id: "1",
        action: "Incident reported",
        actor: "Linda Thompson",
        timestamp: "2024-01-14T09:00:00Z",
      },
      {
        id: "2",
        action: "Resolved",
        actor: "Admin Team",
        timestamp: "2024-01-14T17:00:00Z",
        note: "Replacement arranged, cost covered by platform insurance",
      },
    ],
    resolution: {
      outcome: "Replacement lamp purchased and delivered",
      actions: ["Insurance claim filed", "Family compensated", "No further action needed"],
      closedBy: "Admin Team",
      closedAt: "2024-01-14T17:00:00Z",
    },
  },
  {
    id: "INC-004",
    title: "Behavioral concern - aggressive behavior",
    description: "Care recipient displayed aggressive behavior towards caregiver. No injuries reported but caregiver felt unsafe.",
    type: "behavioral",
    severity: "critical",
    status: "investigating",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-15T12:00:00Z",
    reportedBy: {
      name: "System Alert",
      type: "system",
    },
    involvedParties: [
      { name: "Patricia Lee", type: "caregiver", role: "Caregiver on duty" },
      { name: "Michael Brown", type: "care_recipient", role: "Care recipient" },
      { name: "Susan Brown", type: "family", role: "Emergency contact" },
    ],
    assignedTo: {
      name: "James Admin",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    },
    timeline: [
      {
        id: "1",
        action: "Emergency button activated",
        actor: "Patricia Lee",
        timestamp: "2024-01-15T08:00:00Z",
      },
      {
        id: "2",
        action: "Case escalated to critical",
        actor: "System",
        timestamp: "2024-01-15T08:01:00Z",
      },
      {
        id: "3",
        action: "Caregiver contacted",
        actor: "James Admin",
        timestamp: "2024-01-15T08:05:00Z",
        note: "Confirmed caregiver is safe and has left the premises",
      },
    ],
  },
];

const incidentStats = {
  open: 2,
  investigating: 2,
  resolved: 15,
  avgResolutionTime: "4.2h",
  criticalOpen: 1,
};

export default function IncidentsPage() {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [newIncidentOpen, setNewIncidentOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateNote, setUpdateNote] = useState("");

  const activeIncidents = mockIncidents.filter(
    (i) => i.status === "open" || i.status === "investigating"
  );
  const resolvedIncidents = mockIncidents.filter(
    (i) => i.status === "resolved" || i.status === "closed"
  );

  const filteredIncidents =
    activeTab === "active" ? activeIncidents : resolvedIncidents;

  const getSeverityBadge = (severity: Incident["severity"]) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "high":
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20">High</Badge>;
      case "medium":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Medium</Badge>;
      case "low":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Low</Badge>;
    }
  };

  const getStatusBadge = (status: Incident["status"]) => {
    switch (status) {
      case "open":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">Open</Badge>;
      case "investigating":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">Investigating</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Resolved</Badge>;
      case "closed":
        return <Badge variant="secondary">Closed</Badge>;
    }
  };

  const getTypeIcon = (type: Incident["type"]) => {
    switch (type) {
      case "safety":
        return Shield;
      case "medical":
        return Heart;
      case "property":
        return Home;
      case "behavioral":
        return Users;
      default:
        return AlertCircle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Incident Management</h1>
          <p className="text-muted-foreground">Track and resolve safety and care incidents</p>
        </div>
        <Button onClick={() => setNewIncidentOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Report Incident
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className={incidentStats.criticalOpen > 0 ? "border-red-500/50" : ""}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className={cn(
                "rounded-lg p-2",
                incidentStats.criticalOpen > 0 ? "bg-red-500/10" : "bg-muted"
              )}>
                <AlertTriangle className={cn(
                  "h-4 w-4",
                  incidentStats.criticalOpen > 0 ? "text-red-600" : "text-muted-foreground"
                )} />
              </div>
              <div>
                <p className="text-2xl font-bold">{incidentStats.criticalOpen}</p>
                <p className="text-xs text-muted-foreground">Critical Open</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-red-500/10 p-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{incidentStats.open}</p>
                <p className="text-xs text-muted-foreground">Open</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <Activity className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{incidentStats.investigating}</p>
                <p className="text-xs text-muted-foreground">Investigating</p>
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
                <p className="text-2xl font-bold">{incidentStats.resolved}</p>
                <p className="text-xs text-muted-foreground">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{incidentStats.avgResolutionTime}</p>
                <p className="text-xs text-muted-foreground">Avg Resolution</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Incident List */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Incidents</CardTitle>
              <Badge variant="secondary">{filteredIncidents.length}</Badge>
            </div>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search incidents..."
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
                    value="active"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Active ({activeIncidents.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="resolved"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Resolved
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value={activeTab} className="m-0">
                <ScrollArea className="h-[500px]">
                  <div className="divide-y">
                    {filteredIncidents.map((incident) => {
                      const TypeIcon = getTypeIcon(incident.type);
                      return (
                        <div
                          key={incident.id}
                          className={cn(
                            "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                            selectedIncident?.id === incident.id && "bg-muted",
                            incident.severity === "critical" && "border-l-2 border-l-red-500"
                          )}
                          onClick={() => setSelectedIncident(incident)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "rounded-lg p-2",
                              incident.severity === "critical" ? "bg-red-500/10" : "bg-muted"
                            )}>
                              <TypeIcon className={cn(
                                "h-4 w-4",
                                incident.severity === "critical" ? "text-red-600" : "text-muted-foreground"
                              )} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs text-muted-foreground">
                                  {incident.id}
                                </span>
                                {getSeverityBadge(incident.severity)}
                              </div>
                              <p className="font-medium text-sm mt-1 line-clamp-1">
                                {incident.title}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                {getStatusBadge(incident.status)}
                                <span className="text-xs text-muted-foreground">
                                  {new Date(incident.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
          {selectedIncident ? (
            <>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-muted-foreground">
                        {selectedIncident.id}
                      </span>
                      {getSeverityBadge(selectedIncident.severity)}
                      {getStatusBadge(selectedIncident.status)}
                    </div>
                    <CardTitle className="text-lg mt-2">{selectedIncident.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[520px] pr-4">
                  <div className="space-y-6">
                    {/* Description */}
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm">{selectedIncident.description}</p>
                    </div>

                    {/* Quick Info */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      {selectedIncident.location && (
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-xs text-muted-foreground">Location</p>
                            <p className="text-sm">{selectedIncident.location}</p>
                          </div>
                        </div>
                      )}
                      {selectedIncident.booking && (
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-xs text-muted-foreground">Related Booking</p>
                            <p className="text-sm">{selectedIncident.booking.id}</p>
                            <p className="text-xs text-muted-foreground">
                              {selectedIncident.booking.service}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Reported By */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Reported By</h4>
                      <div className="flex items-center gap-3 p-3 rounded-lg border">
                        {selectedIncident.reportedBy.photo ? (
                          <img
                            src={selectedIncident.reportedBy.photo}
                            alt={selectedIncident.reportedBy.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm">{selectedIncident.reportedBy.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {selectedIncident.reportedBy.type}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Involved Parties */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Involved Parties</h4>
                      <div className="space-y-2">
                        {selectedIncident.involvedParties.map((party, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                <User className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{party.name}</p>
                                <p className="text-xs text-muted-foreground">{party.role}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="capitalize text-xs">
                              {party.type.replace("_", " ")}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Assigned To */}
                    {selectedIncident.assignedTo && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Assigned To</h4>
                        <div className="flex items-center gap-3 p-3 rounded-lg border">
                          <img
                            src={selectedIncident.assignedTo.avatar}
                            alt={selectedIncident.assignedTo.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-sm">{selectedIncident.assignedTo.name}</p>
                            <p className="text-xs text-muted-foreground">Admin Team</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Timeline */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Timeline</h4>
                      <div className="relative pl-4 border-l-2 border-border space-y-4">
                        {selectedIncident.timeline.map((event, idx) => (
                          <div key={event.id} className="relative">
                            <div className="absolute -left-[21px] h-4 w-4 rounded-full bg-background border-2 border-primary" />
                            <div className="ml-4">
                              <p className="font-medium text-sm">{event.action}</p>
                              <p className="text-xs text-muted-foreground">
                                {event.actor} &bull; {new Date(event.timestamp).toLocaleString()}
                              </p>
                              {event.note && (
                                <p className="text-sm text-muted-foreground mt-1 p-2 rounded bg-muted/50">
                                  {event.note}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resolution */}
                    {selectedIncident.resolution && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Resolution</h4>
                        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                          <p className="font-medium text-sm text-green-700">
                            {selectedIncident.resolution.outcome}
                          </p>
                          <ul className="mt-2 space-y-1">
                            {selectedIncident.resolution.actions.map((action, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm text-green-600">
                                <CheckCircle className="h-3 w-3" />
                                {action}
                              </li>
                            ))}
                          </ul>
                          <p className="text-xs text-green-600 mt-2">
                            Closed by {selectedIncident.resolution.closedBy} on{" "}
                            {new Date(selectedIncident.resolution.closedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {selectedIncident.status !== "closed" && selectedIncident.status !== "resolved" && (
                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => setUpdateDialogOpen(true)}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Add Update
                        </Button>
                        <Button className="flex-1">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Resolve Incident
                        </Button>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex flex-col items-center justify-center h-[600px] text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <Shield className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium">Select an incident</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Choose an incident from the list to view details
              </p>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Update Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Update</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Update Note</label>
              <Textarea
                placeholder="Describe the update or action taken..."
                value={updateNote}
                onChange={(e) => setUpdateNote(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Update Status</label>
              <Select>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Keep current status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="keep">Keep current status</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Mark as Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setUpdateDialogOpen(false)}>
              Add Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Incident Dialog */}
      <Dialog open={newIncidentOpen} onOpenChange={setNewIncidentOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Report New Incident</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Incident Type</label>
              <Select>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="property">Property</SelectItem>
                  <SelectItem value="behavioral">Behavioral</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Severity</label>
              <Select>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input placeholder="Brief description of incident" className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Provide detailed information about what happened..."
                className="mt-2"
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Related Booking ID (optional)</label>
              <Input placeholder="BK-12345" className="mt-2" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewIncidentOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setNewIncidentOpen(false)}>
              Create Incident
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
