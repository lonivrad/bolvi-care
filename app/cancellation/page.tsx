"use client";

import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  DollarSign,
  Calendar,
  Phone,
  Mail,
} from "lucide-react";

export default function CancellationPolicyPage() {
  const cancellationTiers = [
    {
      timeframe: "48+ hours before",
      refund: "100%",
      description: "Full refund, no questions asked",
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      timeframe: "24-48 hours before",
      refund: "75%",
      description: "75% refund of the booking cost",
      icon: Clock,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    },
    {
      timeframe: "12-24 hours before",
      refund: "50%",
      description: "50% refund of the booking cost",
      icon: AlertTriangle,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
    {
      timeframe: "Less than 12 hours",
      refund: "0%",
      description: "No refund available",
      icon: XCircle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/30",
    },
  ];

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Cancellation Policy</h1>
          <p className="mt-2 text-muted-foreground">
            We understand that plans change. Here&apos;s what you need to know about cancellations and refunds.
          </p>
        </div>

        {/* Cancellation Tiers */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Refund Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {cancellationTiers.map((tier, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg border"
                >
                  <div className={`p-2 rounded-full ${tier.bgColor}`}>
                    <tier.icon className={`h-5 w-5 ${tier.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{tier.timeframe}</span>
                      <Badge variant={tier.refund === "100%" ? "default" : "secondary"}>
                        {tier.refund} refund
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How to Cancel */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              How to Cancel a Booking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  1
                </div>
                <div>
                  <p className="font-medium">Go to your dashboard</p>
                  <p className="text-sm text-muted-foreground">
                    Navigate to &quot;My Bookings&quot; in your family dashboard
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  2
                </div>
                <div>
                  <p className="font-medium">Find your booking</p>
                  <p className="text-sm text-muted-foreground">
                    Locate the booking you wish to cancel from your upcoming visits
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  3
                </div>
                <div>
                  <p className="font-medium">Click &quot;Cancel Booking&quot;</p>
                  <p className="text-sm text-muted-foreground">
                    Select the reason for cancellation and confirm your request
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  4
                </div>
                <div>
                  <p className="font-medium">Receive confirmation</p>
                  <p className="text-sm text-muted-foreground">
                    You&apos;ll receive an email confirming your cancellation and any applicable refund
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exceptions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Exceptions & Special Circumstances
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-4">
              <h4 className="font-medium mb-2">Emergency Situations</h4>
              <p className="text-sm text-muted-foreground">
                If you need to cancel due to a medical emergency, family emergency, or natural disaster,
                please contact our support team. We review these cases individually and may offer
                full refunds regardless of timing.
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <h4 className="font-medium mb-2">Caregiver Cancellations</h4>
              <p className="text-sm text-muted-foreground">
                If a caregiver cancels on you, you&apos;ll receive a full refund automatically.
                We&apos;ll also help you find a replacement caregiver as quickly as possible.
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <h4 className="font-medium mb-2">Service Issues</h4>
              <p className="text-sm text-muted-foreground">
                If you&apos;re dissatisfied with the care provided, please report it within 24 hours
                of the visit. Our team will investigate and may issue partial or full refunds
                depending on the circumstances.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have questions about our cancellation policy or need assistance with a cancellation,
              our support team is here to help.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                (206) 555-0100
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                support@bolvicare.com
              </Button>
              <Button asChild>
                <Link href="/messages">Contact Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Last Updated */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Last updated: January 2025
        </p>
      </main>
      <Footer />
    </>
  );
}
