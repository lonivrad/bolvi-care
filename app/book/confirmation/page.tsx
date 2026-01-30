"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Calendar, MessageCircle, Home, Printer, Download } from "lucide-react";

export default function BookingConfirmationPage() {
  const [bookingRef, setBookingRef] = useState("");
  const [bookingDate, setBookingDate] = useState("");

  useEffect(() => {
    // Generate stable booking reference on client
    setBookingRef(`ECB-${Date.now().toString().slice(-8)}`);
    setBookingDate(new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4 print:bg-white print:p-0">
      <Card className="w-full max-w-lg print:border-none print:shadow-none">
        <CardContent className="p-8 text-center print:p-4">
          {/* Print Header - Only shows when printing */}
          <div className="hidden print:block print:mb-6 print:border-b print:pb-4">
            <h1 className="text-2xl font-bold">Bolvi Care</h1>
            <p className="text-sm text-muted-foreground">Booking Confirmation</p>
          </div>

          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 print:bg-green-50">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold print:text-xl">Booking Confirmed!</h1>
          <p className="mt-2 text-muted-foreground">
            Your care visit has been successfully booked. You&apos;ll receive a confirmation email shortly.
          </p>

          {/* Booking Details - Enhanced for print */}
          <div className="mt-6 rounded-lg border bg-muted/50 p-4 text-left print:bg-gray-50">
            <h3 className="font-semibold">Booking Details</h3>
            <div className="mt-2 space-y-1 text-sm">
              <p><span className="text-muted-foreground">Reference:</span> <strong>#{bookingRef}</strong></p>
              <p><span className="text-muted-foreground">Booked on:</span> {bookingDate}</p>
            </div>
          </div>

          <div className="mt-6 rounded-lg border bg-muted/50 p-4 text-left print:bg-gray-50">
            <h3 className="font-semibold">What happens next?</h3>
            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary print:bg-blue-100 print:text-blue-700">
                  1
                </div>
                <span>Your caregiver will receive your booking request and confirm within 2 hours</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary print:bg-blue-100 print:text-blue-700">
                  2
                </div>
                <span>You can message your caregiver to discuss any specific needs</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary print:bg-blue-100 print:text-blue-700">
                  3
                </div>
                <span>On the day of the visit, you&apos;ll receive a reminder notification</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons - Hidden when printing */}
          <div className="mt-8 print:hidden">
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/dashboard/family/bookings">
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" /> View Bookings
                </Button>
              </Link>
              <Link href="/messages">
                <Button variant="outline" className="w-full">
                  <MessageCircle className="mr-2 h-4 w-4" /> Send Message
                </Button>
              </Link>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Button variant="outline" onClick={handlePrint} className="w-full">
                <Printer className="mr-2 h-4 w-4" /> Print Confirmation
              </Button>
              <Link href="/">
                <Button className="w-full">
                  <Home className="mr-2 h-4 w-4" /> Return Home
                </Button>
              </Link>
            </div>
          </div>

          {/* Print Footer */}
          <div className="mt-8 border-t pt-4 text-xs text-muted-foreground">
            <p className="hidden print:block">
              Thank you for choosing Bolvi Care. For support, contact us at support@bolvicare.com or call 1-800-BOLVI-CARE
            </p>
            <p className="print:hidden">
              Questions? Contact us at support@bolvicare.com
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
