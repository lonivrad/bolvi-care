"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  ShieldCheck,
  FileText,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Download,
  ExternalLink,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationRequest {
  id: string;
  caregiver: {
    id: string;
    name: string;
    email: string;
    phone: string;
    photo: string;
    location: string;
    appliedAt: string;
  };
  status: "pending" | "in_review" | "approved" | "rejected" | "additional_info";
  type: "new" | "renewal";
  documents: {
    id: string;
    name: string;
    type: "id" | "background" | "certification" | "reference" | "other";
    status: "pending" | "verified" | "rejected";
    uploadedAt: string;
    notes?: string;
  }[];
  backgroundCheck: {
    status: "pending" | "clear" | "flagged" | "failed";
    provider: string;
    completedAt?: string;
    issues?: string[];
  };
  references: {
    id: string;
    name: string;
    relationship: string;
    status: "pending" | "verified" | "unreachable";
    notes?: string;
  }[];
  notes: string[];
  assignedTo?: string;
  priority: "normal" | "high" | "urgent";
  createdAt: string;
  updatedAt: string;
}

const mockVerifications: VerificationRequest[] = [
  {
    id: "VER-001",
    caregiver: {
      id: "cg-1",
      name: "Maria Santos",
      email: "maria.santos@email.com",
      phone: "(415) 555-5678",
      photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop",
      location: "San Francisco, CA",
      appliedAt: "2024-01-10",
    },
    status: "in_review",
    type: "new",
    documents: [
      { id: "d1", name: "Driver's License", type: "id", status: "verified", uploadedAt: "2024-01-10" },
      { id: "d2", name: "CNA Certification", type: "certification", status: "verified", uploadedAt: "2024-01-10" },
      { id: "d3", name: "CPR Certification", type: "certification", status: "pending", uploadedAt: "2024-01-10" },
    ],
    backgroundCheck: {
      status: "clear",
      provider: "Checkr",
      completedAt: "2024-01-12",
    },
    references: [
      { id: "r1", name: "John Smith", relationship: "Former Employer", status: "verified" },
      { id: "r2", name: "Jane Doe", relationship: "Colleague", status: "pending" },
    ],
    notes: ["All documents look valid", "Background check came back clean"],
    assignedTo: "Sarah Admin",
    priority: "normal",
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
  },
  {
    id: "VER-002",
    caregiver: {
      id: "cg-2",
      name: "James Wilson",
      email: "james.wilson@email.com",
      phone: "(415) 555-3456",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      location: "Berkeley, CA",
      appliedAt: "2024-01-14",
    },
    status: "pending",
    type: "new",
    documents: [
      { id: "d1", name: "Passport", type: "id", status: "pending", uploadedAt: "2024-01-14" },
      { id: "d2", name: "HHA Certification", type: "certification", status: "pending", uploadedAt: "2024-01-14" },
    ],
    backgroundCheck: {
      status: "pending",
      provider: "Checkr",
    },
    references: [
      { id: "r1", name: "Mary Johnson", relationship: "Former Supervisor", status: "pending" },
      { id: "r2", name: "Robert Brown", relationship: "Professional Reference", status: "pending" },
    ],
    notes: [],
    priority: "normal",
    createdAt: "2024-01-14T09:00:00Z",
    updatedAt: "2024-01-14T09:00:00Z",
  },
  {
    id: "VER-003",
    caregiver: {
      id: "cg-3",
      name: "Linda Thompson",
      email: "linda.t@email.com",
      phone: "(415) 555-7890",
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
      location: "Oakland, CA",
      appliedAt: "2024-01-08",
    },
    status: "additional_info",
    type: "new",
    documents: [
      { id: "d1", name: "Driver's License", type: "id", status: "rejected", uploadedAt: "2024-01-08", notes: "Image too blurry" },
      { id: "d2", name: "RN License", type: "certification", status: "verified", uploadedAt: "2024-01-08" },
    ],
    backgroundCheck: {
      status: "flagged",
      provider: "Checkr",
      completedAt: "2024-01-10",
      issues: ["Minor traffic violation (2019)"],
    },
    references: [
      { id: "r1", name: "Dr. Smith", relationship: "Former Employer", status: "verified" },
      { id: "r2", name: "Nancy White", relationship: "Colleague", status: "unreachable" },
    ],
    notes: ["Need clearer ID photo", "Traffic violation is minor, may still approve"],
    assignedTo: "James Moderator",
    priority: "high",
    createdAt: "2024-01-08T11:00:00Z",
    updatedAt: "2024-01-14T16:00:00Z",
  },
  {
    id: "VER-004",
    caregiver: {
      id: "cg-4",
      name: "Patricia Lee",
      email: "patricia.lee@email.com",
      phone: "(415) 555-2345",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      location: "Palo Alto, CA",
      appliedAt: "2024-01-05",
    },
    status: "approved",
    type: "renewal",
    documents: [
      { id: "d1", name: "Driver's License", type: "id", status: "verified", uploadedAt: "2024-01-05" },
      { id: "d2", name: "CNA Certification", type: "certification", status: "verified", uploadedAt: "2024-01-05" },
    ],
    backgroundCheck: {
      status: "clear",
      provider: "Checkr",
      completedAt: "2024-01-07",
    },
    references: [
      { id: "r1", name: "Sarah Johnson", relationship: "Client", status: "verified" },
    ],
    notes: ["Annual renewal - all clear"],
    assignedTo: "Sarah Admin",
    priority: "normal",
    createdAt: "2024-01-05T08:00:00Z",
    updatedAt: "2024-01-07T10:00:00Z",
  },
];

const verificationStats = {
  pending: 12,
  inReview: 8,
  approved: 156,
  rejected: 14,
  avgProcessingTime: "2.3 days",
};

export default function VerificationsPage() {
  const [selectedVerification, setSelectedVerification] = useState<VerificationRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | "request_info" | null>(null);
  const [actionNote, setActionNote] = useState("");

  const getFilteredVerifications = () => {
    return mockVerifications.filter((v) => {
      const matchesSearch =
        v.caregiver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.id.toLowerCase().includes(searchQuery.toLowerCase());

      if (activeTab === "pending") {
        return matchesSearch && (v.status === "pending" || v.status === "in_review" || v.status === "additional_info");
      } else if (activeTab === "completed") {
        return matchesSearch && (v.status === "approved" || v.status === "rejected");
      }
      return matchesSearch;
    });
  };

  const filteredVerifications = getFilteredVerifications();

  const getStatusBadge = (status: VerificationRequest["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Pending</Badge>;
      case "in_review":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">In Review</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "additional_info":
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20">Info Needed</Badge>;
    }
  };

  const getDocStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getBackgroundBadge = (status: string) => {
    switch (status) {
      case "clear":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Clear</Badge>;
      case "flagged":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Flagged</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const handleAction = (type: "approve" | "reject" | "request_info") => {
    setActionType(type);
    setActionDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Caregiver Verifications</h1>
          <p className="text-muted-foreground">Review and approve caregiver background checks</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-yellow-500/10 p-2">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{verificationStats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <Eye className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{verificationStats.inReview}</p>
                <p className="text-xs text-muted-foreground">In Review</p>
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
                <p className="text-2xl font-bold">{verificationStats.approved}</p>
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
                <p className="text-2xl font-bold">{verificationStats.rejected}</p>
                <p className="text-xs text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{verificationStats.avgProcessingTime}</p>
                <p className="text-xs text-muted-foreground">Avg Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Verification List */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Verification Queue</CardTitle>
              <Badge variant="secondary">{filteredVerifications.length}</Badge>
            </div>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
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
                    value="completed"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                  >
                    Completed
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value={activeTab} className="m-0">
                <ScrollArea className="h-[500px]">
                  <div className="divide-y">
                    {filteredVerifications.map((verification) => (
                      <div
                        key={verification.id}
                        className={cn(
                          "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                          selectedVerification?.id === verification.id && "bg-muted",
                          verification.priority === "urgent" && "border-l-2 border-l-red-500",
                          verification.priority === "high" && "border-l-2 border-l-orange-500"
                        )}
                        onClick={() => setSelectedVerification(verification)}
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={verification.caregiver.photo}
                            alt={verification.caregiver.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm truncate">
                                {verification.caregiver.name}
                              </span>
                              {getStatusBadge(verification.status)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {verification.id} • {verification.type === "renewal" ? "Renewal" : "New Application"}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <span>Applied {new Date(verification.caregiver.appliedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Detail View */}
        <Card className="lg:col-span-3">
          {selectedVerification ? (
            <>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-muted-foreground">
                        {selectedVerification.id}
                      </span>
                      {getStatusBadge(selectedVerification.status)}
                      {selectedVerification.priority !== "normal" && (
                        <Badge variant={selectedVerification.priority === "urgent" ? "destructive" : "outline"} className="capitalize">
                          {selectedVerification.priority}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg mt-2">Caregiver Verification</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-6">
                    {/* Caregiver Info */}
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                      <img
                        src={selectedVerification.caregiver.photo}
                        alt={selectedVerification.caregiver.name}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{selectedVerification.caregiver.name}</h3>
                        <div className="grid gap-1 mt-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            {selectedVerification.caregiver.email}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            {selectedVerification.caregiver.phone}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {selectedVerification.caregiver.location}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                    </div>

                    {/* Documents */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Documents</h4>
                      <div className="space-y-2">
                        {selectedVerification.documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex items-center gap-3">
                              {getDocStatusIcon(doc.status)}
                              <div>
                                <p className="font-medium text-sm">{doc.name}</p>
                                <p className="text-xs text-muted-foreground capitalize">
                                  {doc.type} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                                </p>
                                {doc.notes && (
                                  <p className="text-xs text-red-600 mt-1">{doc.notes}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Background Check */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Background Check</h4>
                      <div className="p-4 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-sm">
                                {selectedVerification.backgroundCheck.provider}
                              </p>
                              {selectedVerification.backgroundCheck.completedAt && (
                                <p className="text-xs text-muted-foreground">
                                  Completed {new Date(selectedVerification.backgroundCheck.completedAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                          {getBackgroundBadge(selectedVerification.backgroundCheck.status)}
                        </div>
                        {selectedVerification.backgroundCheck.issues && selectedVerification.backgroundCheck.issues.length > 0 && (
                          <div className="mt-3 p-3 rounded bg-yellow-500/10">
                            <p className="text-sm font-medium text-yellow-700 flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4" />
                              Issues Found
                            </p>
                            <ul className="mt-2 space-y-1">
                              {selectedVerification.backgroundCheck.issues.map((issue, idx) => (
                                <li key={idx} className="text-sm text-yellow-600">• {issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* References */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">References</h4>
                      <div className="space-y-2">
                        {selectedVerification.references.map((ref) => (
                          <div key={ref.id} className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex items-center gap-3">
                              {getDocStatusIcon(ref.status)}
                              <div>
                                <p className="font-medium text-sm">{ref.name}</p>
                                <p className="text-xs text-muted-foreground">{ref.relationship}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {ref.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    {selectedVerification.notes.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium">Review Notes</h4>
                        <div className="space-y-2">
                          {selectedVerification.notes.map((note, idx) => (
                            <div key={idx} className="p-3 rounded-lg bg-muted/50 text-sm">
                              {note}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {selectedVerification.status !== "approved" && selectedVerification.status !== "rejected" && (
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
                          onClick={() => handleAction("request_info")}
                        >
                          <Flag className="mr-2 h-4 w-4" />
                          Request Info
                        </Button>
                        <Button
                          className="flex-1"
                          variant="outline"
                          onClick={() => handleAction("reject")}
                        >
                          <ThumbsDown className="mr-2 h-4 w-4" />
                          Reject
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
                <ShieldCheck className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium">Select a verification request</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Choose a request from the queue to review
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
              {actionType === "request_info" ? "Request Additional Information" : `${actionType} Verification`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                {actionType === "request_info" ? "What information is needed?" : "Add a note"}
              </label>
              <Textarea
                placeholder={
                  actionType === "request_info"
                    ? "Describe what additional documents or information is required..."
                    : "Explain your decision..."
                }
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                className="mt-2"
              />
            </div>
            {actionType === "reject" && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-red-600">This action cannot be undone</p>
                  <p className="text-muted-foreground">
                    The caregiver will be notified and will need to reapply.
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
              onClick={() => setActionDialogOpen(false)}
              variant={actionType === "reject" ? "destructive" : "default"}
            >
              {actionType === "approve" && "Approve Verification"}
              {actionType === "reject" && "Reject Verification"}
              {actionType === "request_info" && "Send Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
