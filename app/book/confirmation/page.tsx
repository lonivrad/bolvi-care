"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Calendar, MessageCircle, ArrowRight, Home } from "lucide-react";

export default function BookingConfirmationPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
          <p className="mt-2 text-muted-foreground">
            Your care visit has been successfully booked. You&apos;ll receive a confirmation email shortly.
          </p>

          <div className="mt-8 rounded-lg border bg-muted/50 p-4 text-left">
            <h3 className="font-semibold">What happens next?</h3>
            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  1
                </div>
                <span>Your caregiver will receive your booking request and confirm within 2 hours</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  2
                </div>
                <span>You can message your caregiver to discuss any specific needs</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  3
                </div>
                <span>On the day of the visit, you&apos;ll receive a reminder notification</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
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

          <div className="mt-4">
            <Link href="/">
              <Button className="w-full">
                <Home className="mr-2 h-4 w-4" /> Return Home
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Booking reference: #ECB-{Date.now().toString().slice(-8)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
