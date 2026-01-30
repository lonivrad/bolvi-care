"use client";

import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Shield,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  AlertTriangle,
  FileText,
  Phone,
  Mail,
} from "lucide-react";

export default function CaregiverAgreementPage() {
  const sections = [
    {
      title: "1. Independent Contractor Relationship",
      content: `By registering as a caregiver on Bolvi Care, you agree to operate as an independent contractor, not an employee of Bolvi Care. This means:

• You are responsible for your own taxes, including self-employment tax
• You set your own rates within our platform guidelines
• You have the freedom to accept or decline job requests
• You control your own schedule and availability
• You are responsible for providing your own equipment and transportation
• You maintain your own professional liability insurance`,
    },
    {
      title: "2. Qualification Requirements",
      content: `To maintain your status as a caregiver on our platform, you must:

• Be at least 18 years of age
• Pass our comprehensive background check
• Provide valid government-issued identification
• Maintain current CPR and First Aid certifications
• Complete all required platform training modules
• Have legal authorization to work in the United States
• Possess reliable transportation to reach client locations`,
    },
    {
      title: "3. Professional Standards",
      content: `As a representative of the Bolvi Care community, you agree to:

• Arrive on time for all scheduled visits
• Dress professionally and maintain good hygiene
• Communicate promptly and professionally with families
• Follow all care plans and instructions provided
• Respect client privacy and confidentiality
• Report any concerns or incidents immediately
• Maintain professional boundaries at all times
• Never solicit clients for off-platform work`,
    },
    {
      title: "4. Payment Terms",
      content: `Understanding our payment structure:

• Payments are processed weekly on Fridays
• Platform fee: 15% of each completed booking
• You retain 85% of the service fee
• Cancellation fees apply per our Cancellation Policy
• Tips from families go directly to you (100%)
• Direct deposits typically arrive within 2-3 business days
• Detailed earnings statements are available in your dashboard`,
    },
    {
      title: "5. Insurance & Liability",
      content: `Regarding insurance and liability:

• Bolvi Care provides liability coverage up to $1,000,000 per incident
• Coverage applies only to services booked through our platform
• You must immediately report any incidents or injuries
• Coverage does not extend to off-platform services
• You agree to maintain your own professional liability insurance
• Falsifying incident reports is grounds for immediate termination`,
    },
    {
      title: "6. Background Check Policy",
      content: `Our background check requirements:

• Initial comprehensive background check upon registration
• Annual re-verification of background check status
• Checks include criminal history, sex offender registry, and driving records
• Any disqualifying offenses will result in platform removal
• You must disclose any new charges or convictions immediately
• Background check results are kept confidential`,
    },
    {
      title: "7. Termination & Suspension",
      content: `Grounds for account termination or suspension include:

• Violation of any terms in this agreement
• Failing to pass background check or re-verification
• Receiving multiple negative reviews or complaints
• No-shows or excessive cancellations without notice
• Inappropriate conduct with clients or their families
• Soliciting clients for off-platform work
• Misrepresentation of qualifications or experience
• Theft, fraud, or any illegal activity`,
    },
    {
      title: "8. Confidentiality",
      content: `You agree to maintain strict confidentiality regarding:

• Client personal information and medical conditions
• Family dynamics and private conversations
• Home security codes, keys, and access information
• Financial information shared during service
• All information obtained through platform access
• This confidentiality obligation continues after termination`,
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
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Caregiver Agreement</h1>
              <Badge variant="secondary">Effective January 2025</Badge>
            </div>
          </div>
          <p className="text-muted-foreground">
            This agreement outlines the terms and conditions for caregivers providing services through the Bolvi Care platform.
            Please read carefully before registering.
          </p>
        </div>

        {/* Quick Overview Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="font-medium">$1M Liability</p>
              <p className="text-xs text-muted-foreground">Coverage per incident</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <DollarSign className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="font-medium">85% Earnings</p>
              <p className="text-xs text-muted-foreground">You keep most</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="font-medium">Weekly Payouts</p>
              <p className="text-xs text-muted-foreground">Every Friday</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="font-medium">Independent</p>
              <p className="text-xs text-muted-foreground">Contractor status</p>
            </CardContent>
          </Card>
        </div>

        {/* Agreement Sections */}
        <div className="space-y-6 mb-8">
          {sections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line text-sm leading-relaxed">
                  {section.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Important Notice */}
        <Card className="mb-8 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                  Important Notice
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  By creating a caregiver account on Bolvi Care, you acknowledge that you have read, understood,
                  and agree to be bound by all terms in this agreement. Violation of any terms may result in
                  immediate account suspension or termination. This agreement may be updated periodically,
                  and you will be notified of any material changes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acknowledgment */}
        <Card className="mb-8 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                  Your Acknowledgment
                </h3>
                <p className="text-sm text-green-700 dark:text-green-400">
                  When you check the agreement box during registration, you confirm that:
                </p>
                <ul className="text-sm text-green-700 dark:text-green-400 mt-2 list-disc list-inside space-y-1">
                  <li>You meet all qualification requirements</li>
                  <li>You understand your responsibilities as an independent contractor</li>
                  <li>You agree to abide by our professional standards</li>
                  <li>You accept the payment terms and platform fee structure</li>
                  <li>You consent to background checks and ongoing verification</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle>Questions About This Agreement?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have any questions about the terms of this agreement, please contact our caregiver support team.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                (206) 555-0150
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                caregivers@bolvicare.com
              </Button>
              <Button asChild>
                <Link href="/auth/signup/caregiver">Apply to Become a Caregiver</Link>
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
