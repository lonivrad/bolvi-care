"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  ShieldCheck,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Eye,
} from "lucide-react";

const verifications = [
  {
    id: "v-1",
    caregiver: {
      name: "Jennifer Martinez",
      email: "jennifer.martinez@email.com",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
    },
    type: "background_check",
    status: "pending",
    submitted: "2024-03-01T10:30:00",
    documents: ["Background Check Report", "ID Verification"],
    notes: "",
  },
  {
    id: "v-2",
    caregiver: {
      name: "Robert Chen",
      email: "robert.chen@email.com",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    type: "license",
    status: "pending",
    submitted: "2024-03-01T08:15:00",
    documents: ["CNA License", "CPR Certification"],
    notes: "",
  },
  {
    id: "v-3",
    caregiver: {
      name: "Amanda Williams",
      email: "amanda.williams@email.com",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
    type: "background_check",
    status: "in_review",
    submitted: "2024-02-28T14:45:00",
    documents: ["Background Check Report", "Reference Letters"],
    notes: "Additional documentation requested",
  },
  {
    id: "v-4",
    caregiver: {
      name: "Michael Brown",
      email: "michael.brown@email.com",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    },
    type: "references",
    status: "pending",
    submitted: "2024-02-27T11:00:00",
    documents: ["Reference 1", "Reference 2", "Reference 3"],
    notes: "",
  },
  {
    id: "v-5",
    caregiver: {
      name: "Sarah Thompson",
      email: "sarah.thompson@email.com",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    type: "license",
    status: "approved",
    submitted: "2024-02-25T09:30:00",
    documents: ["RN License"],
    notes: "Verified with state board",
  },
  {
    id: "v-6",
    caregiver: {
      name: "David Wilson",
      email: "david.wilson@email.com",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    },
    type: "background_check",
    status: "rejected",
    submitted: "2024-02-24T16:20:00",
    documents: ["Background Check Report"],
    notes: "Failed background check - criminal record",
  },
];

const typeLabels: Record<string, string> = {
  background_check: "Background Check",
  license: "License Verification",
  references: "Reference Check",
};

export default function AdminVerificationsPage() {
  const [, setSelectedVerification] = useState<
    (typeof verifications)[0] | null
  >(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const pendingCount = verifications.filter(
    (v) => v.status === "pending" || v.status === "in_review"
  ).length;
  const approvedCount = verifications.filter(
    (v) => v.status === "approved"
  ).length;
  const rejectedCount = verifications.filter(
    (v) => v.status === "rejected"
  ).length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "in_review":
        return (
          <Badge variant="secondary">
            <Eye className="mr-1 h-3 w-3" />
            In Review
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="default" className="bg-accent">
            <CheckCircle className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const VerificationCard = ({
    verification,
  }: {
    verification: (typeof verifications)[0];
  }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <img
              src={verification.caregiver.photo}
              alt={verification.caregiver.name}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-foreground">
                {verification.caregiver.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {verification.caregiver.email}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline">{typeLabels[verification.type]}</Badge>
                {getStatusBadge(verification.status)}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              Submitted {formatDate(verification.submitted)}
            </p>
          </div>
        </div>

        <div className="mt-4 border-t border-border pt-4">
          <p className="text-sm font-medium text-muted-foreground">Documents</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {verification.documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-sm"
              >
                <FileText className="h-3 w-3" />
                {doc}
              </div>
            ))}
          </div>
        </div>

        {verification.notes && (
          <div className="mt-4 rounded-md bg-muted p-3">
            <p className="text-sm text-muted-foreground">
              <strong>Notes:</strong> {verification.notes}
            </p>
          </div>
        )}

        {(verification.status === "pending" ||
          verification.status === "in_review") && (
          <div className="mt-4 flex gap-2">
            <Button
              className="flex-1"
              onClick={() => setSelectedVerification(verification)}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1">
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reject Verification</DialogTitle>
                  <DialogDescription>
                    Please provide a reason for rejecting this verification
                    request.
                  </DialogDescription>
                </DialogHeader>
                <Textarea
                  placeholder="Enter rejection reason..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button variant="destructive">Confirm Rejection</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Verifications</h1>
        <p className="text-muted-foreground">
          Review and process caregiver verification requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-secondary" />
              <span className="text-sm text-muted-foreground">
                Pending Review
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-accent" />
              <span className="text-sm text-muted-foreground">Approved</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{approvedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-muted-foreground">Rejected</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{rejectedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                Total This Month
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold">{verifications.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingCount})
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6 space-y-4">
          {verifications
            .filter(
              (v) => v.status === "pending" || v.status === "in_review"
            )
            .map((v) => (
              <VerificationCard key={v.id} verification={v} />
            ))}
        </TabsContent>

        <TabsContent value="approved" className="mt-6 space-y-4">
          {verifications
            .filter((v) => v.status === "approved")
            .map((v) => (
              <VerificationCard key={v.id} verification={v} />
            ))}
        </TabsContent>

        <TabsContent value="rejected" className="mt-6 space-y-4">
          {verifications
            .filter((v) => v.status === "rejected")
            .map((v) => (
              <VerificationCard key={v.id} verification={v} />
            ))}
        </TabsContent>

        <TabsContent value="all" className="mt-6 space-y-4">
          {verifications.map((v) => (
            <VerificationCard key={v.id} verification={v} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
