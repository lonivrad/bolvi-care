"use client";

import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield,
  UserCheck,
  FileCheck,
  Eye,
  Lock,
  Phone,
  AlertTriangle,
  CheckCircle,
  BadgeCheck,
  Fingerprint,
} from "lucide-react";

const safetyMeasures = [
  {
    icon: UserCheck,
    title: "Identity Verification",
    description: "All caregivers must verify their identity through government-issued ID and facial recognition technology.",
  },
  {
    icon: FileCheck,
    title: "Fully Vetted",
    description: "All caregivers are fully vetted through comprehensive verification processes before joining our platform.",
  },
  {
    icon: BadgeCheck,
    title: "Credential Verification",
    description: "We verify all certifications, licenses, and professional credentials claimed by caregivers.",
  },
  {
    icon: Eye,
    title: "Reference Checks",
    description: "Professional and personal references are contacted and verified for every caregiver.",
  },
  {
    icon: Fingerprint,
    title: "Drug Screening",
    description: "Optional drug screening available for families who want additional peace of mind.",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description: "All payments are processed securely through our platform with fraud protection.",
  },
];

const features = [
  "Real-time GPS tracking during visits",
  "In-app emergency contact button",
  "Visit check-in and check-out verification",
  "Detailed visit notes and photo sharing",
  "Two-way rating system",
  "24/7 customer support",
];

export default function SafetyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-12">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Your Safety is Our Priority
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
              We go above and beyond to ensure the safety and security of both families and caregivers
              on our platform. Trust and transparency are at the heart of everything we do.
            </p>
          </div>
        </section>

        {/* Safety Measures */}
        <section className="py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Comprehensive Safety Measures</h2>
              <p className="mt-2 text-muted-foreground">
                Multiple layers of protection for your peace of mind
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {safetyMeasures.map((measure) => (
                <Card key={measure.title}>
                  <CardContent className="pt-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <measure.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{measure.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{measure.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features List */}
        <section className="bg-muted/30 py-10">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Additional Safety Features</h2>
                <p className="mt-4 text-muted-foreground">
                  Our platform includes built-in features designed to keep everyone safe during every visit.
                </p>
                <ul className="mt-8 space-y-4">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-accent" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Card className="bg-destructive/5 border-destructive/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    Emergency Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    In case of emergency, our platform provides immediate access to support:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-destructive" />
                      <span>One-tap emergency services call</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-destructive" />
                      <span>24/7 support hotline</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-destructive" />
                      <span>Automated family notifications</span>
                    </li>
                  </ul>
                  <Button variant="destructive" className="w-full">
                    <Phone className="mr-2 h-4 w-4" />
                    Emergency: 1-800-CARE-911
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-10">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Questions About Safety?</h2>
            <p className="mt-2 text-muted-foreground">
              Our team is here to address any safety concerns you may have
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/faq">View FAQs</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
