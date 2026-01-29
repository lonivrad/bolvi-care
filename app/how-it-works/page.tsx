"use client";

import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  UserCheck,
  Calendar,
  Heart,
  Shield,
  Clock,
  DollarSign,
  Star,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Search & Discover",
    description: "Browse our network of verified caregivers. Filter by services, availability, experience, and location to find the perfect match for your loved one.",
    details: ["Advanced search filters", "View caregiver profiles", "Read verified reviews", "Compare rates"],
  },
  {
    number: "02",
    icon: UserCheck,
    title: "Review & Connect",
    description: "Review detailed caregiver profiles including certifications, experience, and reviews. Message caregivers directly to discuss your needs.",
    details: ["Detailed profiles", "Direct messaging", "Video introductions", "Background check info"],
  },
  {
    number: "03",
    icon: Calendar,
    title: "Book & Schedule",
    description: "Book visits that fit your schedule. Our flexible booking system allows for one-time visits or recurring care arrangements.",
    details: ["Flexible scheduling", "Recurring bookings", "Real-time availability", "Instant confirmation"],
  },
  {
    number: "04",
    icon: Heart,
    title: "Receive Quality Care",
    description: "Your caregiver arrives prepared and ready to provide compassionate, professional care. Track visits in real-time through our app.",
    details: ["GPS check-in/out", "Visit notes & updates", "Photo sharing", "Care task tracking"],
  },
];

const benefits = [
  { icon: Shield, title: "Verified Caregivers", desc: "All caregivers undergo thorough background checks and verification" },
  { icon: Clock, title: "Flexible Scheduling", desc: "Book care when you need it, from a few hours to full-time support" },
  { icon: DollarSign, title: "Transparent Pricing", desc: "Clear hourly rates with no hidden fees or surprise charges" },
  { icon: Star, title: "Quality Guarantee", desc: "Not satisfied? We'll find you a new caregiver at no extra cost" },
];

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Finding Quality Care Made Simple
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
              Our platform connects families with trusted, verified caregivers in just a few steps. 
              Here's how we make elder care accessible and stress-free.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/caregivers">
                  Find a Caregiver
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/signup/caregiver">Become a Caregiver</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-16">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`flex flex-col gap-8 lg:flex-row lg:items-center ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-5xl font-bold text-primary/20">{step.number}</span>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">{step.title}</h2>
                    <p className="text-muted-foreground">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail) => (
                        <li key={detail} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-accent" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1">
                    <Card className="overflow-hidden">
                      <CardContent className="flex aspect-video items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-8">
                        <step.icon className="h-24 w-24 text-primary/30" />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-muted/30 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground">Why Choose Us</h2>
              <p className="mt-4 text-muted-foreground">
                We're committed to making quality care accessible and reliable
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit) => (
                <Card key={benefit.title}>
                  <CardContent className="pt-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 font-semibold">{benefit.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{benefit.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground">Ready to Get Started?</h2>
            <p className="mt-4 text-muted-foreground">
              Join thousands of families who trust us for their elder care needs
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/caregivers">Find Care Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/signup">Create Account</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
