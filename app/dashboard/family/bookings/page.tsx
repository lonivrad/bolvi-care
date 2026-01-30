"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBookingsStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import {
  Calendar,
  Clock,
  MoreHorizontal,
  MessageSquare,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  CalendarDays,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const statusConfig = {
  upcoming: { label: "Upcoming", icon: Calendar, className: "bg-primary/10 text-primary" },
  "in-progress": { label: "In Progress", icon: Loader2, className: "bg-secondary/10 text-secondary" },
  completed: { label: "Completed", icon: CheckCircle, className: "bg-accent/10 text-accent" },
  cancelled: { label: "Cancelled", icon: X, className: "bg-destructive/10 text-destructive" },
  pending: { label: "Pending", icon: AlertCircle, className: "bg-muted text-muted-foreground" },
};

export default function BookingsPage() {
  const { bookings, cancelBooking, updateBooking } = useBookingsStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");

  const filteredBookings = activeTab === "all"
    ? bookings
    : bookings.filter((b) => b.status === activeTab);

  const upcomingCount = bookings.filter((b) => b.status === "upcoming").length;
  const completedCount = bookings.filter((b) => b.status === "completed").length;

  const handleCancelClick = (bookingId: string) => {
    setSelectedBooking(bookingId);
    setCancelDialogOpen(true);
  };

  const confirmCancel = () => {
    if (selectedBooking) {
      cancelBooking(selectedBooking);
      toast({
        title: "Booking cancelled",
        description: "Your booking has been cancelled successfully. A refund will be processed within 3-5 business days.",
        variant: "success",
      });
    }
    setCancelDialogOpen(false);
    setSelectedBooking(null);
  };

  const handleRescheduleClick = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setSelectedBooking(bookingId);
      setNewDate(booking.date);
      setNewStartTime(booking.startTime);
      setNewEndTime(booking.endTime);
      setRescheduleDialogOpen(true);
    }
  };

  const confirmReschedule = () => {
    if (selectedBooking && newDate && newStartTime && newEndTime) {
      updateBooking(selectedBooking, {
        date: newDate,
        startTime: newStartTime,
        endTime: newEndTime,
      });
      toast({
        title: "Booking rescheduled",
        description: "Your booking has been rescheduled successfully. The caregiver has been notified.",
        variant: "success",
      });
    }
    setRescheduleDialogOpen(false);
    setSelectedBooking(null);
  };

  const selectedBookingDetails = selectedBooking
    ? bookings.find(b => b.id === selectedBooking)
    : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">My Bookings</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your care appointments
          </p>
        </div>
        <Button asChild>
          <Link href="/caregivers">Book New Visit</Link>
        </Button>
      </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
            <TabsList>
              <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming ({upcomingCount})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedCount})</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredBookings.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-semibold">No bookings found</h3>
                    <p className="mt-2 text-muted-foreground">
                      {activeTab === "all"
                        ? "You haven't made any bookings yet"
                        : `No ${activeTab} bookings`}
                    </p>
                    <Button className="mt-4" asChild>
                      <Link href="/caregivers">Find a Caregiver</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((booking) => {
                    const status = statusConfig[booking.status];
                    const StatusIcon = status.icon;
                    
                    return (
                      <Card key={booking.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col sm:flex-row">
                            {/* Left color stripe */}
                            <div className={cn("w-full sm:w-1 shrink-0", status.className.replace('text-', 'bg-').split(' ')[0])} />
                            
                            <div className="flex flex-1 flex-col gap-4 p-6 sm:flex-row sm:items-center">
                              {/* Caregiver info */}
                              <div className="flex items-center gap-4">
                                <Image
                                  src={booking.caregiverPhoto}
                                  alt={booking.caregiverName}
                                  width={56}
                                  height={56}
                                  className="rounded-full"
                                />
                                <div>
                                  <Link
                                    href={`/caregivers/${booking.caregiverId}`}
                                    className="font-semibold text-foreground hover:underline"
                                  >
                                    {booking.caregiverName}
                                  </Link>
                                  <p className="text-sm text-muted-foreground">
                                    For {booking.recipientName}
                                  </p>
                                  <Badge variant="outline" className={cn("mt-1", status.className)}>
                                    <StatusIcon className="mr-1 h-3 w-3" />
                                    {status.label}
                                  </Badge>
                                </div>
                              </div>

                              {/* Booking details */}
                              <div className="flex flex-1 flex-wrap items-center gap-6 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    {new Date(booking.date).toLocaleDateString('en-US', {
                                      weekday: 'short',
                                      month: 'short',
                                      day: 'numeric',
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  <span>{booking.startTime} - {booking.endTime}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-foreground">
                                    ${booking.totalCost}
                                  </span>
                                  <span className="text-muted-foreground">
                                    ({booking.duration}hrs)
                                  </span>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2">
                                {booking.status === "upcoming" && (
                                  <>
                                    <Button variant="outline" size="sm" asChild>
                                      <Link href={`/messages`}>
                                        <MessageSquare className="mr-1 h-4 w-4" />
                                        Message
                                      </Link>
                                    </Button>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleRescheduleClick(booking.id)}>
                                          <CalendarDays className="mr-2 h-4 w-4" />
                                          Reschedule
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          className="text-destructive"
                                          onClick={() => handleCancelClick(booking.id)}
                                        >
                                          <X className="mr-2 h-4 w-4" />
                                          Cancel Booking
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </>
                                )}
                                {booking.status === "completed" && (
                                  <Button variant="outline" size="sm" asChild>
                                    <Link href={`/visit/${booking.id}`}>
                                      View Summary
                                    </Link>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Services */}
                          {booking.services.length > 0 && (
                            <div className="border-t border-border bg-muted/30 px-6 py-3">
                              <div className="flex flex-wrap gap-2">
                                {booking.services.map((service) => (
                                  <Badge key={service} variant="secondary" className="text-xs">
                                    {service}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking?</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your booking with{" "}
              <span className="font-medium text-foreground">
                {selectedBookingDetails?.caregiverName}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>
          {selectedBookingDetails && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-4">
                <Image
                  src={selectedBookingDetails.caregiverPhoto}
                  alt={selectedBookingDetails.caregiverName}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium">{selectedBookingDetails.caregiverName}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedBookingDetails.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedBookingDetails.startTime} - {selectedBookingDetails.endTime}
                  </p>
                </div>
              </div>
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            Cancellations made at least 24 hours in advance are eligible for a full refund.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Keep Booking
            </Button>
            <Button variant="destructive" onClick={confirmCancel}>
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Booking</DialogTitle>
            <DialogDescription>
              Choose a new date and time for your booking with{" "}
              <span className="font-medium text-foreground">
                {selectedBookingDetails?.caregiverName}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-date">New Date</Label>
              <Input
                id="new-date"
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={newStartTime}
                  onChange={(e) => setNewStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={newEndTime}
                  onChange={(e) => setNewEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            The caregiver will be notified of the schedule change.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmReschedule}>
              Confirm Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
