"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, MapPin, DollarSign, User, CheckCircle, X } from "lucide-react";

const mockRequests = [
  {
    id: "1",
    familyName: "Johnson Family",
    familyPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    recipientName: "Robert Johnson",
    recipientAge: 78,
    date: "2025-02-05",
    startTime: "09:00",
    endTime: "13:00",
    duration: 4,
    services: ["Mobility Assistance", "Medication Reminders", "Meal Preparation"],
    totalCost: 140,
    notes: "Dad needs help getting to his doctor appointment at 10am.",
    status: "pending",
    requestedAt: "2 hours ago",
  },
  {
    id: "2",
    familyName: "Martinez Family",
    familyPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    recipientName: "Elena Martinez",
    recipientAge: 82,
    date: "2025-02-06",
    startTime: "14:00",
    endTime: "18:00",
    duration: 4,
    services: ["Companionship", "Light Housekeeping"],
    totalCost: 120,
    notes: "Mom enjoys playing cards and talking about her garden.",
    status: "pending",
    requestedAt: "5 hours ago",
  },
];

export default function CaregiverRequestsPage() {
  const [requests, setRequests] = useState(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<typeof mockRequests[0] | null>(null);
  const [actionType, setActionType] = useState<"accept" | "decline" | null>(null);
  const [declineReason, setDeclineReason] = useState("");

  const handleAction = (request: typeof mockRequests[0], action: "accept" | "decline") => {
    setSelectedRequest(request);
    setActionType(action);
  };

  const confirmAction = () => {
    if (!selectedRequest) return;
    
    setRequests(prev =>
      prev.map(r =>
        r.id === selectedRequest.id
          ? { ...r, status: actionType === "accept" ? "accepted" : "declined" }
          : r
      )
    );
    setSelectedRequest(null);
    setActionType(null);
    setDeclineReason("");
  };

  const pendingRequests = requests.filter(r => r.status === "pending");
  const respondedRequests = requests.filter(r => r.status !== "pending");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Booking Requests</h1>
              <p className="mt-1 text-muted-foreground">
                Review and respond to care requests
              </p>
            </div>
            <Badge variant="secondary" className="text-base">
              {pendingRequests.length} pending
            </Badge>
          </div>

          <Tabs defaultValue="pending" className="mt-8">
            <TabsList>
              <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
              <TabsTrigger value="responded">Responded ({respondedRequests.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-6">
              {pendingRequests.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <CheckCircle className="h-12 w-12 text-accent" />
                    <h3 className="mt-4 text-lg font-semibold">All caught up!</h3>
                    <p className="mt-2 text-muted-foreground">
                      No pending requests to review
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <Card key={request.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-6 sm:flex-row">
                          {/* Family Info */}
                          <div className="flex items-start gap-4">
                            <Image
                              src={request.familyPhoto}
                              alt={request.familyName}
                              width={56}
                              height={56}
                              className="rounded-full"
                            />
                            <div>
                              <h3 className="font-semibold">{request.familyName}</h3>
                              <p className="text-sm text-muted-foreground">
                                Care for {request.recipientName}, {request.recipientAge}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                Requested {request.requestedAt}
                              </p>
                            </div>
                          </div>

                          {/* Visit Details */}
                          <div className="flex-1 space-y-3">
                            <div className="flex flex-wrap gap-4 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {new Date(request.date).toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                {request.startTime} - {request.endTime} ({request.duration}hrs)
                              </div>
                              <div className="flex items-center gap-2 font-semibold text-foreground">
                                <DollarSign className="h-4 w-4" />
                                ${request.totalCost}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {request.services.map((service) => (
                                <Badge key={service} variant="secondary" className="text-xs">
                                  {service}
                                </Badge>
                              ))}
                            </div>

                            {request.notes && (
                              <div className="rounded-lg bg-muted p-3">
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-medium text-foreground">Note: </span>
                                  {request.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex justify-end gap-2 border-t border-border pt-4">
                          <Button
                            variant="outline"
                            onClick={() => handleAction(request, "decline")}
                          >
                            Decline
                          </Button>
                          <Button onClick={() => handleAction(request, "accept")}>
                            Accept Request
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="responded" className="mt-6">
              {respondedRequests.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-muted-foreground">No responded requests yet</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {respondedRequests.map((request) => (
                    <Card key={request.id} className="opacity-75">
                      <CardContent className="flex items-center gap-4 p-4">
                        <Image
                          src={request.familyPhoto}
                          alt={request.familyName}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{request.familyName}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(request.date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          variant={request.status === "accepted" ? "default" : "secondary"}
                          className={
                            request.status === "accepted"
                              ? "bg-accent text-accent-foreground"
                              : "bg-destructive/10 text-destructive"
                          }
                        >
                          {request.status === "accepted" ? "Accepted" : "Declined"}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

      {/* Confirmation Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "accept" ? "Accept Request" : "Decline Request"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "accept"
                ? "You're about to accept this booking. The family will be notified and the visit will be added to your calendar."
                : "Please provide a reason for declining (optional). This helps families understand and find alternative care."}
            </DialogDescription>
          </DialogHeader>

          {actionType === "decline" && (
            <Textarea
              placeholder="Reason for declining (optional)"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
            />
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>
              Cancel
            </Button>
            <Button
              variant={actionType === "accept" ? "default" : "destructive"}
              onClick={confirmAction}
            >
              {actionType === "accept" ? "Accept" : "Decline"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
